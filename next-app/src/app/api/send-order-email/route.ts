import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const generateEmailTemplate = (name: string, items: any[] = [], customerDetails: any = {}, orderDetails: any = {}) => {
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
              <tr>
                <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 3px solid #edf2f7; text-align: center;">
                  <span style="font-family: sans-serif; font-size: 28px; font-weight: bold; font-style: italic; color: #1e3a8a; letter-spacing: -0.5px;">Billing</span><span style="font-family: sans-serif; font-size: 28px; font-weight: bold; font-style: italic; color: #22c55e; letter-spacing: -0.5px;">Zone</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 40px 10px 40px; text-align: center;">
                  <div style="display: inline-block; width: 56px; height: 56px; background-color: #def7ec; color: #03543f; border-radius: 50%; text-align: center; line-height: 56px; font-size: 28px; font-weight: bold; margin-bottom: 15px;">✓</div>
                  <h1 style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 24px; font-weight: 800; color: #0e9f6e; letter-spacing: -0.5px;">Order Confirmed!</h1>
                  <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #718096;">Thank you for shopping with us. We are processing your order now.</p>
                </td>
              </tr>
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
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-left: auto; width: 280px; margin-bottom: 25px;">
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #718096;">Subtotal:</td>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #2d3748; font-weight: bold; text-align: right;">₹${Number(subtotalVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #718096;">GST (18%):</td>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #2d3748; font-weight: bold; text-align: right;">₹${Number(gstVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #718096;">Shipping:</td>
                      <td style="padding: 6px 0; font-family: sans-serif; font-size: 13px; color: #48bb78; font-weight: bold; text-align: right;">Free Shipping</td>
                    </tr>
                    <tr style="border-top: 1px solid #edf2f7; border-bottom: 2px solid #1e3a8a;">
                      <td style="padding: 12px 0; font-family: sans-serif; font-size: 15px; color: #1a202c; font-weight: bold;">Grand Total:</td>
                      <td style="padding: 12px 0; font-family: sans-serif; font-size: 17px; color: #1e3a8a; font-weight: 800; text-align: right;">
                        ₹${Number(totalVal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </table>
                  ${addressHtml}
                </td>
              </tr>
              <tr>
                <td align="center" style="background-color: #1a202c; padding: 30px 40px; text-align: center;">
                  <p style="margin: 0 0 10px 0; font-family: sans-serif; font-size: 13px; color: #a0aec0; line-height: 1.5;">
                    If you have any questions, please contact our support team at <a href="mailto:support@billingzone.in" style="color: #63b3ed; text-decoration: none;">support@billingzone.in</a> or visit our website.
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, items, customerDetails, orderDetails } = body;
    
    if (!email || !name || !orderDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailHtml = generateEmailTemplate(name, items, customerDetails, orderDetails);

    if (resendClient) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'order@billingzone.in';
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

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
