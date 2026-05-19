import crypto from 'crypto';

async function parseRequestBody(req) {
  // 1. If it's already an object with keys, return it
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body) && Object.keys(req.body).length > 0) {
    return req.body;
  }

  // 2. If req.body is a Buffer
  if (req.body && Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf8'));
    } catch (e) {
      console.error('Failed to parse req.body Buffer:', e);
      return {};
    }
  }

  // 3. If req.body is a string
  if (req.body && typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      console.error('Failed to parse req.body string:', e);
      return {};
    }
  }

  // 4. If req.body is empty or a stream, read it manually
  return new Promise((resolve) => {
    let bodyStr = '';
    req.on('data', (chunk) => {
      bodyStr += chunk;
    });
    req.on('end', () => {
      try {
        resolve(bodyStr ? JSON.parse(bodyStr) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { action } = req.query;

  const keyId = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : undefined;
  const keySecret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : undefined;

  if (!keyId || !keySecret) {
    console.error('Razorpay keys are not configured in environment variables');
    return res.status(500).json({ success: false, message: 'Razorpay keys not configured on server' });
  }

  const body = await parseRequestBody(req);

  // Action: Create Razorpay Order
  if (action === 'create') {
    const { amount, receipt } = body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    try {
      // Amount in paise (1 INR = 100 Paise)
      const amountInPaise = Math.round(parseFloat(amount) * 100);

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(keyId + ':' + keySecret).toString('base64'),
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        console.error('Razorpay Order API Error:', orderData);
        return res.status(response.status).json({ success: false, error: orderData });
      }

      return res.status(200).json({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
      });
    } catch (error) {
      console.error('Razorpay Order Creation Server Error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  // Action: Verify Payment Signature
  if (action === 'verify') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required signature parameters' });
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generatedSignature === razorpay_signature) {
        return res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        console.error('Signature mismatch:', {
          generated: generatedSignature,
          received: razorpay_signature,
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id
        });
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    } catch (error) {
      console.error('Razorpay Signature Verification Error:', error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }

  return res.status(400).json({ message: 'Invalid action parameter' });
}
