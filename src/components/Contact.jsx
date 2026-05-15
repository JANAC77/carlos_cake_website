// components/Contact.jsx
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { sendContactFormEmail } from '../services/emailService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the email service function
      const result = await sendContactFormEmail(formData);
      
      if (result.success) {
        console.log('Email sent successfully!');
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        
        // Auto hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Email sending error:', err);
      setError('Failed to send message. Please try again or call us directly at +91 98809 44843');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FaPhone, title: 'Phone', details: ['+91 98809 44843', '+91 77953 22889'], color: 'text-green-500' },
    { icon: FaEnvelope, title: 'Email', details: ['carloscakecafe@gmail.com'], color: 'text-blue-500' },
    { icon: FaMapMarkerAlt, title: 'Address', details: ['#3, Bellandur Gate, Sarjapur Road', 'Near Spencer Hyper Market, Bangalore-560068'], color: 'text-red-500' },
    { icon: FaClock, title: 'Business Hours', details: ['Monday - Sunday: 9:00 AM - 10:00 PM'], color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-white pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-6">
            Get In Touch
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Have a question? Want to place a custom order? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6">
              Send Us a Message
            </h2>
            
            {/* Success Message */}
            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-xl animate-slide-down">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-green-700 font-medium">
                    ✅ Thank you! We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-xl animate-slide-down">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                    placeholder="hello@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                    placeholder="+91 98765 43210"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                    placeholder="Custom Cake Order"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
                  placeholder="Tell us about your celebration, desired cake design, or any questions..."
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-pink-600 text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message '
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                We'll respond to your message within 24 hours
              </p>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tight mb-6">
              Contact Information
            </h2>
            <div className="space-y-8">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center ${info.color} flex-shrink-0`}>
                    <info.icon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-500">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-8 bg-gray-200 rounded-2xl overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.993456789012!2d77.6708423!3d12.931234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1360b5b2b2b3%3A0x5b2b2b2b2b2b2b2b!2sBellandur%2C%20Bengaluru%2C%20Karnataka%20560103!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carlos Cake Cafe Location"
              ></iframe>
            </div>
   
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;