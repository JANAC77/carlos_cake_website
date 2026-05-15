import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_bceqi08';
const EMAILJS_TEMPLATE_ID = 'template_djuits6';
const EMAILJS_PUBLIC_KEY = 'GPjhDd8aCZpx-ppY6';

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    let itemsHtml = '';

    orderData.items.forEach(item => {
      const total = (item.price * item.quantity).toFixed(2);

      itemsHtml += `
        <tr>
          <td style="padding:8px;">${item.name}</td>
          <td style="padding:8px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;text-align:right;">₹${total}</td>
        </tr>
      `;
    });

    const templateParams = {
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,

      order_id: orderData.orderId,
      order_date: new Date().toLocaleString('en-IN'),

      order_items_html: itemsHtml,

      subtotal: orderData.subtotal.toFixed(2),
      delivery_charge: orderData.deliveryCharge.toFixed(2),
      total: orderData.total.toFixed(2),

      delivery_address: orderData.deliveryAddress,
      payment_method:
        orderData.paymentMethod === 'cod'
          ? 'Cash on Delivery'
          : 'UPI',

      website_url: window.location.origin,
      tracking_url: `${window.location.origin}/my-orders`,
    };

    const res = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Email Sent:', res);
    return true;

  } catch (err) {
    console.error('❌ Email Error:', err);
    return false;
  }
};

// Add to emailService.js
export const sendContactFormEmail = async (formData) => {
  try {
    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone || 'Not provided',
      user_subject: formData.subject,
      user_message: formData.message,
      submitted_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    };

    const response = await emailjs.send(
      'service_bceqi08',
      'template_f09t9v8', // Your contact template ID
      templateParams,
      'GPjhDd8aCZpx-ppY6'
    );

    console.log('✅ Contact email sent:', response);
    return { success: true };

  } catch (err) {
    console.error('❌ Contact email error:', err);
    return { success: false, error: err.message };
  }
};