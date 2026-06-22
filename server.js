import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://billingzone.in', 'https://www.billingzone.in']
}));
app.use(express.json({ limit: '50mb' }));

// Initialize Firebase Admin/Client for backend
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

// Lightweight ping endpoint to wake up Render server
app.get('/api/ping', (req, res) => {
  res.status(200).send('OK');
});

// ImageKit Base64 Upload Proxy
app.post('/api/upload-image', async (req, res) => {
  try {
    const { file, fileName } = req.body;
    if (!file || !fileName) {
      return res.status(400).json({ error: 'Missing file or fileName' });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      return res.status(500).json({ error: 'IMAGEKIT_PRIVATE_KEY not configured' });
    }

    const form = new FormData();
    // ImageKit accepts base64 format natively via REST API
    form.append('file', file); 
    form.append('fileName', fileName);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(privateKey + ':').toString('base64')}`
      },
      body: form
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'ImageKit upload failed');
    }

    res.json({ url: data.url });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { cartItems, currency = 'INR', receipt } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    // Securely calculate the amount on the backend using Firestore
    let subtotal = 0;
    
    // Fetch all product details from Firestore
    for (const item of cartItems) {
      const docRef = doc(db, "products", item.id.toString());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const product = docSnap.data();
        subtotal += Number(product.price) * Number(item.quantity);
      } else {
        console.warn(`Product not found: ${item.id}`);
      }
    }
    const gst = subtotal * 0.18;
    const finalAmount = Math.round(subtotal + gst);

    const options = {
      amount: finalAmount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error || 'Unknown Error' });
  }
});

// Initialize Resend
const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// HTML Email Template Generator
const generateEmailTemplate = (name, items = [], customerDetails = {}, orderDetails = {}) => {
  const orderNumber = orderDetails.orderId || Math.floor(100000 + Math.random() * 900000);
  const dateText = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const subtotalVal = orderDetails.subtotal || (orderDetails.total / 1.18) || 0;
  const gstVal = orderDetails.gst || (orderDetails.total - subtotalVal) || 0;
  const totalVal = orderDetails.total || 0;
  const paymentMethodVal = orderDetails.paymentMethod || 'Online Payment';

  // Build items table rows
  let itemsHtml = '';
  if (items && items.length > 0) {
    itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-family: sans-serif; font-size: 14px; color: #2d3748; text-align: left; line-height: 1.5;">
          ${item.title}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-family: sans-serif; font-size: 14px; color: #2d3748; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-family: sans-serif; font-size: 14px; color: #2d3748; text-align: right; font-weight: bold;">
          ₹${Number(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    `).join('');
  } else {
    itemsHtml = `
      <tr>
        <td colspan="3" style="padding: 20px; text-align: center; color: #718096; font-family: sans-serif; font-size: 14px; border-bottom: 1px solid #edf2f7;">
          Standard Checkout Order
        </td>
      </tr>
    `;
  }

  // Address HTML block
  let addressHtml = '';
  if (customerDetails && customerDetails.address) {
    addressHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #edf2f7;">
        <tr>
          <td width="50%" valign="top" style="padding-right: 15px;">
            <h4 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 12px; color: #1a202c; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Billing Address</h4>
            <p style="margin: 0; font-family: sans-serif; font-size: 13px; color: #4a5568; line-height: 1.6;">
              <strong>${customerDetails.firstName} ${customerDetails.lastName}</strong><br>
              ${customerDetails.address}<br>
              ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.zip}<br>
              Phone: ${customerDetails.phone}<br>
              Email: ${customerDetails.email}
            </p>
          </td>
          <td width="50%" valign="top">
            <h4 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 12px; color: #1a202c; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</h4>
            <p style="margin: 0; font-family: sans-serif; font-size: 13px; color: #4a5568; line-height: 1.6;">
              <strong>${customerDetails.firstName} ${customerDetails.lastName}</strong><br>
              ${customerDetails.address}<br>
              ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.zip}<br>
              Phone: ${customerDetails.phone}
            </p>
          </td>
        </tr>
      </table>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - BillingZone</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f7fafc; -webkit-text-size-adjust: 100%;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; padding: 20px 0;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; overflow: hidden;">
              <!-- Header Branding -->
              <tr>
                <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 3px solid #edf2f7; text-align: center;">
                  <span style="font-family: sans-serif; font-size: 28px; font-weight: bold; font-style: italic; color: #1e3a8a; letter-spacing: -0.5px;">Billing</span><span style="font-family: sans-serif; font-size: 28px; font-weight: bold; font-style: italic; color: #22c55e; letter-spacing: -0.5px;">Zone</span>
                </td>
              </tr>
              
              <!-- Confirmed Hero Area -->
              <tr>
                <td style="padding: 30px 40px 10px 40px; text-align: center;">
                  <div style="display: inline-block; width: 56px; height: 56px; background-color: #def7ec; color: #03543f; border-radius: 50%; text-align: center; line-height: 56px; font-size: 28px; font-weight: bold; margin-bottom: 15px;">✓</div>
                  <h1 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 24px; font-weight: 800; color: #0e9f6e; letter-spacing: -0.5px;">Order Confirmed!</h1>
                  <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #718096;">Thank you for shopping with us. We are processing your order now.</p>
                </td>
              </tr>

              <!-- Greeting & Details Grid -->
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 15px 0; font-family: sans-serif; font-size: 15px; color: #2d3748; line-height: 1.5;">
                    Hi <strong>${name}</strong>,
                  </p>
                  <p style="margin: 0 0 20px 0; font-family: sans-serif; font-size: 14px; color: #4a5568; line-height: 1.5;">
                    Your order has been successfully placed. Here is your receipt summary:
                  </p>
                  
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7fafc; border-radius: 6px; padding: 15px; border: 1px solid #edf2f7; margin-bottom: 25px;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #718096; padding-bottom: 8px;">Order ID:</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #2d3748; font-weight: bold; padding-bottom: 8px; text-align: right;">#${orderNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #718096; padding-bottom: 8px;">Order Date:</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #2d3748; padding-bottom: 8px; text-align: right;">${dateText}</td>
                    </tr>
                    <tr>
                      <td style="font-family: sans-serif; font-size: 13px; color: #718096;">Payment Method:</td>
                      <td style="font-family: sans-serif; font-size: 13px; color: #2d3748; font-weight: bold; text-align: right;">${paymentMethodVal}</td>
                    </tr>
                  </table>

                  <!-- Items Table Header -->
                  <h3 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 13px; color: #1a202c; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Items Ordered</h3>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 25px;">
                    <thead>
                      <tr style="background-color: #f7fafc;">
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0; font-family: sans-serif; font-size: 12px; color: #718096; text-transform: uppercase; text-align: left;">Product</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0; font-family: sans-serif; font-size: 12px; color: #718096; text-transform: uppercase; text-align: center; width: 60px;">Qty</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e2e8f0; font-family: sans-serif; font-size: 12px; color: #718096; text-transform: uppercase; text-align: right; width: 100px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Pricing Summary -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-left: auto; width: 280px; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #718096;">Subtotal:</td>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #2d3748; font-weight: bold; text-align: right;">₹${Number(subtotalVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #718096;">Shipping:</td>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #48bb78; font-weight: bold; text-align: right;">Free Shipping</td>
                    </tr>
                    <tr style="border-top: 1px solid #edf2f7; border-bottom: 2px solid #1e3a8a;">
                      <td style="padding: 12px 0; font-family: sans-serif; font-size: 15px; color: #1a202c; font-weight: bold;">Grand Total:</td>
                      <td style="padding: 12px 0; font-family: sans-serif; font-size: 17px; color: #1e3a8a; font-weight: 800; text-align: right;">
                        ₹${Number(totalVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span style="font-size: 10px; font-weight: normal; color: #a0aec0; display: block; margin-top: 4px;">(includes ₹${Number(gstVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GST)</span>
                      </td>
                    </tr>
                  </table>

                  <!-- Addresses (Billing/Shipping) -->
                  ${addressHtml}

                </td>
              </tr>

              <!-- Footer info -->
              <tr>
                <td align="center" style="background-color: #1a202c; padding: 30px 40px; text-align: center;">
                  <p style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 13px; color: #a0aec0; line-height: 1.5;">
                    If you have any questions, please contact our support team at <a href="mailto:info@billingzone.in" style="color: #63b3ed; text-decoration: none;">info@billingzone.in</a> or visit our website.
                  </p>
                  <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #718096;">
                    © 2017 - 2026 BillingZone.in | All Rights Reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Nodemailer transporter setup (Fallback)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-order-email', async (req, res) => {
  try {
    const { email, name, items, customerDetails, orderDetails } = req.body;
    
    if (!email || !name || !orderDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailHtml = generateEmailTemplate(name, items, customerDetails, orderDetails);

    if (resendClient) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'orders@billingzone.in';
      const { error } = await resendClient.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Order Confirmation - Thank you for your purchase!',
        html: emailHtml
      });

      if (error) {
        throw new Error(error.message || 'Resend API error');
      }
      console.log('Email sent using Resend');
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Order Confirmation - Thank you for your purchase!',
        html: emailHtml
      };
      await transporter.sendMail(mailOptions);
      console.log('Email sent using Nodemailer fallback');
    }

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment parameters" });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET';
    
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    
    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
