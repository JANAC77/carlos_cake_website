// src/services/whatsappService.js

// WhatsApp configuration
const WHATSAPP_NUMBER = "918489091148"; // Your WhatsApp number (without + symbol)

// Base URL for WhatsApp API
const WHATSAPP_API_URL = "https://api.whatsapp.com/send";

/**
 * Generate WhatsApp message for product order
 */
export const generateProductOrderMessage = (product, quantity = 1, addons = [], cakeMessage = '', occasion = '', selectedWeight = null) => {
  let message = "🍰 *New Cake Order Request* 🍰\n\n";
  message += `*Item:* ${product.name}\n`;

  if (selectedWeight && selectedWeight.label) {
    message += `*Weight:* ${selectedWeight.label}\n`;
    message += `*Serves:* ${selectedWeight.serves}\n`;
    message += `*Base Price:* ₹${product.price}\n`;
    message += `*Weight Price:* ₹${selectedWeight.price}\n`;
  } else {
    message += `*Price:* ₹${product.price}\n`;
  }

  message += `*Quantity:* ${quantity}\n`;
  message += `*Subtotal:* ₹${(selectedWeight?.price || product.price) * quantity}\n\n`;

  if (occasion) {
    message += `*Occasion:* ${occasion}\n`;
  }

  if (addons && addons.length > 0) {
    message += `\n*Add-ons Selected:*\n`;
    addons.forEach(addon => {
      message += `  • ${addon.name} (+₹${addon.price})\n`;
    });
  }

  if (cakeMessage) {
    message += `\n*Cake Message:* "${cakeMessage}"\n`;
  }

  return message;
};

/**
 * Generate WhatsApp message for cart order
 */
export const generateCartOrderMessage = (cart, subtotal, deliveryCharge, total) => {
  let message = "🛒 *New Cart Order Request* 🛒\n\n";
  message += "*Order Items:*\n";

  cart.forEach((item, index) => {
    const itemPrice = item.selectedWeight?.price || item.price;
    const itemTotal = itemPrice * (item.quantity || 1);
    message += `\n${index + 1}. *${item.name}*\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ₹${itemPrice}\n`;
    message += `   Total: ₹${itemTotal}\n`;

    if (item.selectedWeight?.label) {
      message += `   Weight: ${item.selectedWeight.label}\n`;
    }

    if (item.occasion) {
      message += `   Occasion: ${item.occasion}\n`;
    }

    if (item.addons && item.addons.length > 0) {
      message += `   Add-ons: ${item.addons.map(a => `${a.name}(+₹${a.price})`).join(', ')}\n`;
    }

    if (item.cakeMessage) {
      message += `   Message: "${item.cakeMessage}"\n`;
    }
  });

  message += `\n*Order Summary:*\n`;
  message += `Subtotal: ₹${subtotal}\n`;
  message += `Delivery Charge: ₹${deliveryCharge}\n`;
  message += `*Total: ₹${total}*\n`;

  return message;
};

/**
 * Generate WhatsApp message for custom cake request
 */
export const generateCustomCakeMessage = (cakeDetails, customerInfo) => {
  let message = "🎨 *New Custom Cake Request* 🎨\n\n";
  message += `*Customer:* ${customerInfo.name}\n`;
  message += `*Phone:* ${customerInfo.phone}\n`;
  message += `*Email:* ${customerInfo.email}\n\n`;
  message += `*Cake Details:*\n`;
  message += `• Flavor: ${cakeDetails.flavor}\n`;
  message += `• Size: ${cakeDetails.size}\n`;
  message += `• Design: ${cakeDetails.design}\n`;
  message += `• Required Date: ${cakeDetails.requiredDate}\n`;

  if (cakeDetails.cakeMessage) {
    message += `• Message: "${cakeDetails.cakeMessage}"\n`;
  }

  if (cakeDetails.specialInstructions) {
    message += `\n*Special Instructions:*\n${cakeDetails.specialInstructions}\n`;
  }

  message += `\n_Please provide a quote for this custom cake._`;

  return message;
};

/**
 * Generate WhatsApp message for customer inquiry
 */
export const generateInquiryMessage = (subject, message, customerInfo) => {
  let inquiryMsg = "💬 *New Customer Inquiry* 💬\n\n";
  inquiryMsg += `*From:* ${customerInfo.name}\n`;
  inquiryMsg += `*Email:* ${customerInfo.email}\n`;
  inquiryMsg += `*Phone:* ${customerInfo.phone || 'Not provided'}\n`;
  inquiryMsg += `*Subject:* ${subject}\n\n`;
  inquiryMsg += `*Message:*\n${message}\n\n`;
  inquiryMsg += `_Please respond to this inquiry._`;

  return inquiryMsg;
};

/**
 * Generate quick order confirmation message for customer
 */
export const generateQuickConfirmationMessage = (orderType, items, estimatedTime = "2-3 hours") => {
  let message = " *Order Confirmation - Carlos Cake Cafe* \n\n";
  message += `Thank you for your ${orderType} order!\n\n`;

  if (items && items.length > 0) {
    message += "*Order Summary:*\n";
    items.slice(0, 3).forEach(item => {
      message += `• ${item.name} x${item.quantity}\n`;
    });
    if (items.length > 3) {
      message += `• +${items.length - 3} more items\n`;
    }
  }

  message += `\n*Estimated Delivery:* ${estimatedTime}\n`;
  message += `*Payment:* Cash on Delivery\n\n`;
  message += `We'll confirm your order shortly. For urgent queries, call us at +91 75029 81623.\n\n`;
  message += `*Carlos Cake Cafe* 🍰\n`;
  message += `#3, Bellandur Gate, Sarjapur Road, Bangalore`;

  return message;
};

/**
 * Generate order status update message
 */
export const generateStatusUpdateMessage = (orderId, status, notes = '') => {
  const statusEmojis = {
    confirmed: '✅',
    processing: '👩‍🍳',
    ready: '🎂',
    'out-for-delivery': '🚚',
    delivered: '🏠',
    cancelled: '❌'
  };

  const statusMessages = {
    confirmed: 'Your order has been confirmed!',
    processing: 'Our bakers are preparing your cake!',
    ready: 'Your cake is ready for delivery!',
    'out-for-delivery': 'Your order is out for delivery!',
    delivered: 'Your order has been delivered! Enjoy! ',
    cancelled: 'Your order has been cancelled.'
  };

  let message = `${statusEmojis[status] || '📦'} *Order Status Update* ${statusEmojis[status] || '📦'}\n\n`;
  message += `*Order ID:* ${orderId}\n`;
  message += `*Status:* ${statusMessages[status] || status.toUpperCase()}\n`;

  if (notes) {
    message += `\n*Note:* ${notes}\n`;
  }

  message += `\nTrack your order: ${window.location.origin}/my-orders\n\n`;
  message += `*Carlos Cake Cafe* 🍰`;

  return message;
};

/**
 * Generate WhatsApp link with encoded message
 */
export const getWhatsAppLink = (message = '') => {
  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `${WHATSAPP_API_URL}?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
  }
  return `${WHATSAPP_API_URL}?phone=${WHATSAPP_NUMBER}`;
};

/**
 * Order confirmation via WhatsApp (opens chat with pre-filled confirmation)
 */
export const sendOrderConfirmation = (orderType, items, estimatedTime = "2-3 hours") => {
  const message = generateQuickConfirmationMessage(orderType, items, estimatedTime);
  const link = getWhatsAppLink(message);
  window.open(link, '_blank');
  return link;
};

/**
 * Quick order - Direct WhatsApp ordering
 */
export const quickOrderViaWhatsApp = (product, quantity = 1, customerName = '', customerPhone = '') => {
  let message = "🛍️ *Quick Order Request* 🛍️\n\n";
  message += `*Product:* ${product.name}\n`;
  message += `*Quantity:* ${quantity}\n`;
  message += `*Price:* ₹${product.price * quantity}\n\n`;
  message += `*Customer Name:* ${customerName || '_________'}\n`;
  message += `*Customer Phone:* ${customerPhone || '_________'}\n\n`;
  message += `_Please confirm availability and delivery details._\n\n`;
  message += `Sent via Quick Order`;

  const link = getWhatsAppLink(message);
  window.open(link, '_blank');
  return link;
};

/**
 * Send custom cake request via WhatsApp
 */
export const sendCustomCakeRequest = (cakeDetails, customerInfo) => {
  const message = generateCustomCakeMessage(cakeDetails, customerInfo);
  const link = getWhatsAppLink(message);
  window.open(link, '_blank');
  return link;
};

/**
 * Send general inquiry via WhatsApp
 */
export const sendInquiry = (subject, message, customerInfo) => {
  const inquiryMessage = generateInquiryMessage(subject, message, customerInfo);
  const link = getWhatsAppLink(inquiryMessage);
  window.open(link, '_blank');
  return link;
};

export default {
  getWhatsAppLink,
  sendOrderConfirmation,
  quickOrderViaWhatsApp,
  sendCustomCakeRequest,
  sendInquiry,
  generateProductOrderMessage,
  generateCartOrderMessage,
  generateQuickConfirmationMessage
};