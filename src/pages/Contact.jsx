import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      });

      toast.success('Your message has been sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error("Error submitting contact form: ", error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-blue-600 w-fit pb-2">CONTACT US</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Address Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Get In Touch</h2>
          <p className="text-gray-600">Have questions about our POS solutions? Reach out to us.</p>
          <div className="space-y-4">
            <p><strong>📍 Address:</strong> C-56/22 Sector 62, Noida, UP 201309</p>
            <p><strong>📞 Phone:</strong> +91 9289024863</p>
            <p><strong>✉️ Email:</strong>sales@slantco.com</p>
          </div>
        </div>
        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-8 rounded shadow-sm">
          <input 
            type="text" 
            placeholder="Your Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-3 border rounded focus:outline-none focus:border-[#0073B7]" 
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-3 border rounded focus:outline-none focus:border-[#0073B7]" 
          />
          <textarea 
            placeholder="Your Message" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-3 border rounded h-32 focus:outline-none focus:border-[#0073B7]"
          ></textarea>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`text-white px-8 py-3 rounded font-bold transition ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#0073B7] hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;