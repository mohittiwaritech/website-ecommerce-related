import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_RAZORPAY_KEY_SECRET',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartItems, currency = 'INR', receipt } = body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    let subtotal = 0;
    
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
    const finalAmount = Math.round(subtotal);

    const options = {
      amount: finalAmount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Unknown Error' }, { status: 500 });
  }
}
