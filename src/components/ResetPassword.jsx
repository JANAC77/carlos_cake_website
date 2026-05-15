// ResetPassword.jsx - Fully working version
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, confirmPasswordReset, verifyPasswordResetCode } from '../firebase';
import { Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');
  const [oobCode, setOobCode] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== Reset Password Page Loaded ===');
    console.log('Full URL:', window.location.href);
    console.log('Location search:', location.search);
    console.log('Location hash:', location.hash);
    console.log('Location pathname:', location.pathname);

    // Extract oobCode from URL
    let code = null;

    // Try to get from query parameters
    const params = new URLSearchParams(location.search);
    code = params.get('oobCode');

    // If not found, try from hash
    if (!code && location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      code = hashParams.get('oobCode');
    }

    // If still not found, try to extract from full URL
    if (!code) {
      const match = window.location.href.match(/[?&]oobCode=([^&]+)/);
      if (match) code = match[1];
    }

    console.log('Extracted oobCode:', code);

    if (!code || code === 'undefined' || code === 'null') {
      setError('Invalid password reset link. Please request a new one.');
      setVerifying(false);
      return;
    }

    setOobCode(code);

    // Verify the code with Firebase
    const verifyCode = async () => {
      try {
        console.log('Verifying code with Firebase...');
        const userEmail = await verifyPasswordResetCode(auth, code);
        console.log('✅ Code verified successfully for email:', userEmail);
        setEmail(userEmail);
        setValidCode(true);
      } catch (err) {
        console.error('❌ Verification error:', err);

        switch (err.code) {
          case 'auth/expired-action-code':
            setError('This password reset link has expired. Please request a new one.');
            break;
          case 'auth/invalid-action-code':
            setError('Invalid reset link. The link may have been already used or is corrupted. Please request a new password reset.');
            break;
          default:
            setError('Unable to verify reset link. ' + (err.message || 'Please request a new reset link.'));
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oobCode) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to reset password with code:', oobCode);
      await confirmPasswordReset(auth, oobCode, password);
      console.log('✅ Password reset successful!');
      setSuccess(true);

      // Clear any pending actions
      localStorage.removeItem('pendingAction');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('❌ Password reset error:', err);

      switch (err.code) {
        case 'auth/expired-action-code':
          setError('This password reset link has expired. Please request a new one.');
          break;
        case 'auth/invalid-action-code':
          setError('Invalid reset link. Please request a new password reset.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use a stronger password.');
          break;
        default:
          setError('Failed to reset password. ' + (err.message || 'Please request a new reset link.'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-24">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white rounded-[3rem] p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-32 pb-24">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl shadow-pink-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mx-auto mb-6">
              <Lock size={32} />
            </div>

            <h2 className="text-pink-600 font-['Outfit'] font-black uppercase tracking-[0.3em] text-[10px] mb-4">Security</h2>
            <h3 className="text-4xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter mb-2">New Password</h3>

            {email && validCode && (
              <p className="text-gray-500 text-sm mb-8">
                Reset password for: <span className="font-medium text-gray-700">{email}</span>
              </p>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-600 shrink-0" size={20} />
                  <p className="text-red-600 text-sm font-medium text-left">{error}</p>
                </div>
                {(error.includes('expired') || error.includes('Invalid')) && (
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-3 text-pink-600 text-sm font-medium hover:underline"
                  >
                    Go to Login →
                  </button>
                )}
              </div>
            )}

            {success ? (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-gray-600 font-medium">Password reset successful!</p>
                <p className="text-gray-500 text-sm">Redirecting you to login...</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-pink-600 transition-all shadow-xl"
                >
                  Go To Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4 text-left">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-4 text-left">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-600 transition-all font-medium placeholder:text-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !validCode}
                  className={`w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 mt-4 ${(loading || !validCode) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting...</span>
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            )}

            <button
              onClick={() => navigate('/login')}
              className="mt-8 flex items-center justify-center space-x-2 text-gray-400 hover:text-pink-600 transition-colors mx-auto group"
            >
              <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-black uppercase tracking-widest text-[10px]">Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}