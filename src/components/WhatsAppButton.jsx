// src/components/WhatsAppButton.jsx
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const whatsappNumber = "919880944843";
    const message = "Hello! I would like to know more about your cakes.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20B859] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Chat on WhatsApp"
        >
            <FaWhatsapp size={28} />
        </a>
    );
};

export default WhatsAppButton;