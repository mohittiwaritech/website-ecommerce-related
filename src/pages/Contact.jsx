import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

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
    <div className="bg-white min-h-screen py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TWO-COLUMN GRID (Details Left, Map Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          
          {/* LEFT COLUMN: Contact details (6/12 width) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2C] tracking-tight mb-2">
                Contact Us
              </h1>
              <p className="text-gray-500 text-sm md:text-base font-semibold">
                Get In Touch
              </p>
            </div>
            
            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 pt-4">
              
              {/* ADDRESS */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#0088cc] shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Address
                  </h3>
                  <div className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed space-y-0.5">
                    <p className="font-extrabold text-slate-800">BILLING ZONE</p>
                    <p>C-56/22 Sector 62,</p>
                    <p>Noida, Uttar Pradesh,</p>
                    <p>201309</p>
                  </div>
                </div>
              </div>

              {/* OPENING HOURS */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#0088cc] shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Opening Hours
                  </h3>
                  <div className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed space-y-1">
                    <p>Monday - Saturday:</p>
                    <p className="font-semibold text-slate-800">10:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* E-MAIL */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#0088cc] shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    E-Mail
                  </h3>
                  <div className="text-xs md:text-sm text-[#0088cc] mt-2 leading-relaxed space-y-1 font-semibold">
                    <p>
                      <a href="mailto:sales@billingzone.in" className="hover:underline hover:text-[#006699] transition-colors">
                        sales@billingzone.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* PHONE */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#0088cc] shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Phone
                  </h3>
                  <div className="text-xs md:text-sm text-[#0088cc] mt-2 leading-relaxed space-y-1 font-semibold">
                    <p>
                      <a href="tel:+919289024863" className="hover:underline hover:text-[#006699] transition-colors">
                        +91 9289024863
                      </a>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: MAPS LOCATION (6/12 width) */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C2C2C] tracking-tight mb-2">
                Maps Location
              </h2>
              <div className="h-4 hidden lg:block"></div> {/* aligns with left column's subtitle spacing */}
            </div>
            
            <div className="w-full h-[360px] md:h-[400px] rounded-2xl overflow-hidden shadow-md border border-slate-100 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4338944520977!2d77.36214157630248!3d28.61676647567228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce55df4c58e57%3A0xe54efde8bd9b706c!2sC-56%20Noida%20Sector%2062!5e0!3m2!1sen!2sin!4v1782139000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location for Billing Zone Noida"
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: MESSAGE FORM */}
        <div className="border-t border-slate-100 pt-16">
          <div className="max-w-3xl mx-auto bg-slate-50/55 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
              <p className="text-slate-500 text-sm">
                Have questions about our products or need technical support? Drop us a message below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NAME */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0088cc] transition-all disabled:opacity-55 text-slate-800 text-sm font-medium" 
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                    Your Email *
                  </label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0088cc] transition-all disabled:opacity-55 text-slate-800 text-sm font-medium" 
                  />
                </div>

              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                  Detailed Message *
                </label>
                <textarea 
                  placeholder="How can we help you today?" 
                  value={message}
                  required
                  rows="5"
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0088cc] transition-all disabled:opacity-55 text-slate-800 text-sm font-medium resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-center">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] ${
                    isSubmitting 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-[#0088cc] hover:bg-[#006699]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* BOTTOM FEATURES BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-t border-slate-200 pt-12">
          <div className="text-center p-4">
            <h3 className="text-slate-800 font-bold text-base mb-1">Quick Response</h3>
            <p className="text-slate-400 text-sm">Our sales and technical support representatives answer all queries within 24 hours.</p>
          </div>
          <div className="text-center p-4">
            <h3 className="text-slate-800 font-bold text-base mb-1">Expert Assistance</h3>
            <p className="text-slate-400 text-sm">Need help configuring POS systems or printer drivers? Our technicians are ready to guide you.</p>
          </div>
          <div className="text-center p-4">
            <h3 className="text-slate-800 font-bold text-base mb-1">Pan-India Support</h3>
            <p className="text-slate-400 text-sm">Providing robust billing machine services and device replacement coverage nationwide.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;