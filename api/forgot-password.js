// forgot-password.js - Simplified version (only Firebase)
export default async function handler(req, res) {
  // CORS headers
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

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const apiKey = process.env.FIREBASE_API_KEY;

    if (!apiKey) {
      console.error('FIREBASE_API_KEY not set');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    console.log('Sending password reset request for email:', email);

    // Send password reset email via Firebase
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email,
        })
      }
    );

    const data = await response.json();
    console.log('Firebase API Response:', data);

    if (!response.ok) {
      console.error('Firebase API error:', data);
      // For security, return success even if email not found
      return res.status(200).json({
        success: true,
        message: 'If an account exists, a reset link has been sent.'
      });
    }

    console.log('Password reset email sent successfully to:', email);

    return res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email!'
    });

  } catch (error) {
    console.error('Password reset function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to send reset email. Please try again later.'
    });
  }
}