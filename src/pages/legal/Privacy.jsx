import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#006699]">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
        <p>Last updated: June 20, 2026</p>
        
        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Information We Collect</h2>
          <p>
            When you visit billingzone.in or make a purchase, we collect certain information to process your orders and improve your experience. This includes:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Personal identification information (Name, Email address, Phone number, Delivery address).</li>
            <li>Payment information (processed securely via our payment gateway).</li>
            <li>Technical data (IP address, browser type, device information).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>To process and fulfill your orders (software licenses or physical hardware delivery).</li>
            <li>To communicate with you regarding your order status, support requests, or product updates.</li>
            <li>To improve our website functionality and customer service.</li>
            <li>To comply with legal obligations and prevent fraud.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All sensitive payment data is transmitted via Secure Socket Layer (SSL) technology and encrypted into our payment gateway provider's database (Razorpay), which is only accessible by those authorized with special access rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Third-Party Services</h2>
          <p>
            We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. For example, we share address details with our courier partners for hardware delivery.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Your Rights</h2>
          <p>
            You have the right to request access to, correction, or deletion of your personal data. If you wish to exercise any of these rights, please contact our support team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Contact Us</h2>
          <p>
            For any privacy-related queries, please contact us at:
            <br />Email: sales@billingzone.in
            <br />Phone: +91 9289024863
            <br />Address: C-56/22 Sector 62, Noida, Uttar Pradesh, 201309
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
