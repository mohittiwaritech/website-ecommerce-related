import React from 'react';

const Shipping = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#006699]">Shipping and Delivery Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
        <p>Last updated: June 20, 2026</p>
        
        <section>
          <h2 className="text-xl font-semibold text-black mb-3">1. Delivery of Software Products</h2>
          <p>
            All software purchases made on billingzone.in are delivered digitally. Upon successful payment verification, you will receive an email containing your license key, download link, and installation instructions. Digital delivery is typically completed within 2-4 hours, but may take up to 24 hours in some cases. No physical shipping fees apply to software purchases.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">2. Processing Time for Hardware</h2>
          <p>
            Orders for physical hardware products are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. We will communicate any significant delays directly to you via email or phone.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">3. Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. Delivery timelines depend on your location:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Metro Cities:</strong> 3-5 business days</li>
            <li><strong>Non-Metro Cities:</strong> 5-7 business days</li>
            <li><strong>Remote Locations:</strong> 7-10 business days</li>
          </ul>
          <p className="mt-2 text-xs italic">
            * Delivery delays can occasionally occur due to unforeseen circumstances beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">4. Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your hardware order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">5. Damages During Shipping</h2>
          <p>
            Billing Zone is liable for any products damaged or lost during shipping. If you received your order damaged, please contact us immediately so we can file a claim with the shipment carrier and arrange a replacement for you. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-black mb-3">6. Contact Us</h2>
          <p>
            If you have any questions about the shipping and delivery of your order, please contact us at:
            <br />Email: sales@slantco.com
            <br />Phone: +91 9289024863
            <br />Address: C-56/22 Sector 62, Noida, Uttar Pradesh, 201309
          </p>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
