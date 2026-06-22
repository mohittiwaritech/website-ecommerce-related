import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/send-order-email', async (req, res) => {
  try {
    const { email, name, orderDetails } = req.body;
    
    if (!email || !name || !orderDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation - Thank you for your purchase!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for your order! We have received your payment and your order is being processed.</p>
        <h3>Order Summary:</h3>
        <p><strong>Total Amount:</strong> ₹${orderDetails.total.toLocaleString('en-IN')}</p>
        <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
        <p>We will notify you once your order is shipped.</p>
        <br/>
        <p>Best Regards,</p>
        <p>Your E-commerce Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
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
