import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { productsData } from './src/data/productsData.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://billingzone.in']
}));
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

// Lightweight ping endpoint to wake up Render server
app.get('/api/ping', (req, res) => {
  res.status(200).send('OK');
});

app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { cartItems, currency = 'INR', receipt } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    // Securely calculate the amount on the backend
    let subtotal = 0;
    cartItems.forEach(item => {
      const product = productsData.find(p => p.id === item.id);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    });

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
