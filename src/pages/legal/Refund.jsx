import React from 'react';

const Refund = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#006699]">Refund and Cancellation Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
        <p>Last updated: June 20, 2026</p>
        
        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Cancellation Policy</h2>
          <p>
            You may request to cancel your order within 24 hours of placing it, provided the order has not already been processed or dispatched.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Hardware Orders:</strong> Cancellations must be requested before the product is handed over to our courier partner.</li>
            <li><strong>Software Orders:</strong> Software license purchases can be canceled before the license key is generated and activated.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Refund Policy for Hardware</h2>
          <p>
            We offer refunds for physical hardware products under the following conditions:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The product received is defective, damaged in transit, or incorrect.</li>
            <li>You must notify us within 7 days of receiving the product to be eligible for a return and refund.</li>
            <li>The product must be returned in its original packaging along with all accessories, manuals, and invoice.</li>
            <li>Once the returned product is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed to your original method of payment within 5-7 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Refund Policy for Software</h2>
          <p>
            Due to the nature of digital goods, refunds for software licenses are generally not provided once the license key has been activated. We encourage you to review the software features carefully or request a demo before making a purchase. Exceptions may be made in cases where the software fails to perform fundamentally as advertised and our support team is unable to resolve the issue within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Non-Refundable Items</h2>
          <p>
            Installation charges, shipping fees, and any custom development or consultation services are strictly non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Contact for Refunds</h2>
          <p>
            To initiate a return or cancellation request, please contact our support team at:
            <br />Email: sales@slantco.com
            <br />Phone: +91 9289024863
            <br />Address: C-56/22 Sector 62, Noida, Uttar Pradesh, 201309
          </p>
        </section>
      </div>
    </div>
  );
};

export default Refund;
