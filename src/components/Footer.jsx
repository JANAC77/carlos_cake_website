import { Link } from 'react-router-dom';

const Footer = ({ logo }) => {
  const socialLinks = [
    {
      name: 'Instagram',
      id: 'instagram',
      url: 'https://www.instagram.com/carloscakecafe123/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      id: 'facebook',
      url: 'https://www.facebook.com/Carlos-Cake-Cafe-232591287098461/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        </svg>
      )
    },
    {
      name: 'Pinterest',
      id: 'pinterest',
      url: 'https://in.pinterest.com/carloscakecafe123/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.091.375-.293 1.199-.334 1.363-.053.211-.174.256-.402.151-1.504-.699-2.445-2.896-2.445-4.659 0-3.793 2.757-7.277 7.946-7.277 4.171 0 7.413 2.973 7.413 6.944 0 4.144-2.613 7.477-6.239 7.477-1.219 0-2.365-.632-2.757-1.38l-.75 2.854c-.271 1.033-1.003 2.324-1.492 3.121 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      id: 'linkedin',
      url: 'https://www.linkedin.com/company/14626378/admin/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    }
  ];

  const footerLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' }
  ];

  return (
    <footer className="bg-[#1A1616] pt-20 pb-12 overflow-hidden relative border-t border-pink-500/10">
      {/* Background decoration - Pink Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-white/10">
          {/* Logo Section - Increased Size */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-10">
              <img className="h-24 w-auto brightness-110" src={logo} alt="Carlos Cakes" />
            </div>
            <p className="text-gray-400 leading-relaxed font-medium mb-10">
              We believe every celebration deserves a masterpiece. Handcrafted in the heart of the city since 2010.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-[#1A1616] transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-pink-500 font-black uppercase tracking-widest text-sm mb-10">Navigation</h4>
            <ul className="space-y-6">
              {['The Menu', 'Special Orders', 'Wedding Cakes', 'Gift Cards', 'Bakery Locations'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-pink-500 font-black uppercase tracking-widest text-sm mb-10">Contact Us</h4>
            <ul className="space-y-8 text-gray-400 font-medium">
              {/* Location */}
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0 group-hover:bg-pink-500 group-hover:text-[#1A1616] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="10" r="3" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-sm leading-relaxed">
                  Address :#3, Bellandur Gate Sarjapur Road, Near Spencer Hyper Market & Sagar Deluxe Hotel, Bangalore-560068.
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0 group-hover:bg-pink-500 group-hover:text-[#1A1616] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col space-y-1 text-sm tracking-widest">
                  <span>+91 98809 44843</span>
                  <span>+91 77953 22889</span>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start space-x-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-pink-500 flex-shrink-0 group-hover:bg-pink-500 group-hover:text-[#1A1616] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm break-all font-serif italic">carloscakecafe@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links with Privacy Policy */}
<div>
    <h4 className="text-pink-500 font-black uppercase tracking-widest text-sm mb-10">Quick Links</h4>
    <ul className="space-y-6">
        <li>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors font-medium">
                Privacy Policy
            </Link>
        </li>
        <li>
            <Link to="/terms-conditions" className="text-gray-400 hover:text-white transition-colors font-medium">
                Terms & Conditions
            </Link>
        </li>
        <li>
            <Link to="/refund-policy" className="text-gray-400 hover:text-white transition-colors font-medium">
                Refund Policy
            </Link>
        </li>
    </ul>
</div>
        </div>

        {/* Bottom Bar */}
<div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
    <p className="text-gray-600 font-medium text-[10px] uppercase tracking-[0.2em]">
        © 2026 Carlos Cakes. All Rights Reserved.
    </p>
    <div className="flex space-x-8">
        <Link 
            to="/privacy-policy"
            className="text-gray-600 hover:text-pink-500 transition-colors text-[10px] uppercase tracking-[0.2em]"
        >
            Privacy Policy
        </Link>
        <Link 
            to="/terms-conditions"
            className="text-gray-600 hover:text-pink-500 transition-colors text-[10px] uppercase tracking-[0.2em]"
        >
            Terms of Service
        </Link>
        <Link 
            to="/refund-policy"
            className="text-gray-600 hover:text-pink-500 transition-colors text-[10px] uppercase tracking-[0.2em]"
        >
            Refund Policy
        </Link>
    </div>
</div>
      </div>
    </footer>
  );
};

export default Footer;