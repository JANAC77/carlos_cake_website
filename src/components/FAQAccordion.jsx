import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-2xl transition-all duration-300 overflow-hidden bg-white shadow-sm hover:shadow-md ${isOpen
                ? 'border-pink-300 ring-2 ring-pink-500/5 bg-gradient-to-b from-white to-pink-50/10'
                : 'border-gray-100 hover:border-pink-200'
              }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group cursor-pointer"
            >
              <span className="font-['Outfit'] font-extrabold text-gray-800 text-sm md:text-base leading-snug group-hover:text-pink-600 transition-colors uppercase tracking-wide">
                {faq.question}
              </span>
              <span
                className={`flex-shrink-0 ml-4 p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-pink-100 text-pink-600 rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-pink-50 group-hover:text-pink-500'
                  }`}
              >
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 transition-transform" />
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'
                }`}
            >
              <div className="p-5 md:p-6 text-gray-600 text-xs md:text-sm font-medium leading-relaxed bg-cream-base/30">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
