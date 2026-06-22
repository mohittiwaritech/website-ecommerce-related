import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

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
    <div className="bg-slate-50 min-h-screen py-16 md:py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO TITLE HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#0088cc] font-bold text-xs uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full">
            Contact Support
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Let's Start a Conversation
          </h1>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed">
            Have questions about our professional POS hardware, software installations, or driver downloads? Reach out and we will help you scale your business operations.
          </p>
        </div>

        {/* MAIN CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: CONTACT CARD INFO (5/12 width) */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[500px]">
            
            {/* BACKGROUND DECORATIVE GLOW */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#0088cc]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-10 relative z-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Contact Information</h2>
                <p className="text-slate-400 text-sm mt-2">
                  Fill out the form on the right and our dedicated technical support team will contact you within 24 business hours.
                </p>
              </div>

              {/* LIST DETAILS */}
              <div className="space-y-6">
                
                {/* ADDRESS */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-[#0088cc]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Head Office</h4>
                    <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                      C-56/22 Sector 62, Noida, Uttar Pradesh, 201309
                    </p>
                  </div>
                </div>

                {/* PHONE */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-[#0088cc]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Call / Support</h4>
                    <p className="text-sm text-slate-200 mt-1 font-semibold hover:text-[#0088cc] transition-colors">
                      <a href="tel:+919289024863">+91 9289024863</a>
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-[#0088cc]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</h4>
                    <p className="text-sm text-slate-200 mt-1 font-semibold hover:text-[#0088cc] transition-colors">
                      <a href="mailto:sales@slantco.com">sales@slantco.com</a>
                    </p>
                  </div>
                </div>

                {/* BUSINESS HOURS */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 text-[#0088cc]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Working Hours</h4>
                    <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                      Monday - Saturday: 10:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* QUICK WHATSAPP CHAT */}
            <div className="mt-12 relative z-10 border-t border-slate-800 pt-8">
              <a
                href="https://wa.me/919289024863"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-green-600/20 font-bold text-sm tracking-wide justify-center md:justify-start hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* RIGHT COLUMN: CONTACT FORM (7/12 width) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col justify-center">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NAME */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[#0088cc] transition-all disabled:opacity-55 text-slate-800 text-sm font-medium" 
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
                    Your Email *
                  </label>
                  <input 
                    type="email" 
                    placeholder="john@example.com" 
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[#0088cc] transition-all disabled:opacity-55 text-slate-800 text-sm font-medium" 
                  />
                </div>

              </div>

              {/* MESSAGE */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
                  Detailed Message *
                </label>
                <textarea 
                  placeholder="How can our support team help you today? Please include details about product models if applicable..." 
                  value={message}
                  required
                  rows="6"
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[#0088cc] transition-all disabled:opacity-55 text-slate-800 text-sm font-medium resize-none leading-relaxed"
                ></textarea>
              </div>

              {/* SUBMIT BUTTON */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02] ${
                  isSubmitting 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-[#0088cc] hover:bg-[#006699] hover:shadow-blue-500/10'
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