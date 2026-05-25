import React from 'react';

const Contact = () => {
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
        <form className="space-y-4 bg-gray-50 p-8 rounded shadow-sm">
          <input type="text" placeholder="Your Name" className="w-full p-3 border rounded" />
          <input type="email" placeholder="Your Email" className="w-full p-3 border rounded" />
          <textarea placeholder="Your Message" className="w-full p-3 border rounded h-32"></textarea>
          <button className="bg-[#0073B7] text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">SEND MESSAGE</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;