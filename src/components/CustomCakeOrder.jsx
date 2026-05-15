// src/components/CustomCakeOrder.jsx
import { useState } from 'react';
import { submitCustomCakeRequest } from '../firebase';

const CustomCakeOrder = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    flavor: '',
    size: '',
    design: '',
    cakeMessage: '',
    requiredDate: '',
    specialInstructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const flavors = ['Vanilla', 'Chocolate', 'Strawberry', 'Red Velvet', 'Black Forest', 'Pineapple', 'Mango', 'Butterscotch'];
  const sizes = ['6 inches (4-6 people)', '8 inches (8-12 people)', '10 inches (14-18 people)', '12 inches (20-25 people)', '14 inches (30-35 people)'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to place custom cake order');
      return;
    }

    setLoading(true);
    const result = await submitCustomCakeRequest({
      ...formData,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phoneNumber,
      status: 'pending'
    });

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 2000);
    } else {
      alert('Failed to submit request: ' + result.error);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
        <p className="text-gray-500">We'll get back to you with a quote within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">🎨 Custom Cake Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cake Flavor *</label>
            <div className="grid grid-cols-2 gap-2">
              {flavors.map(flavor => (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => setFormData({ ...formData, flavor })}
                  className={`p-2 rounded-lg border transition-all text-sm ${formData.flavor === flavor
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 hover:border-pink-200'
                    }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cake Size *</label>
            <div className="grid grid-cols-1 gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, size })}
                  className={`p-3 rounded-xl border text-left transition-all ${formData.size === size
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Design Description *</label>
            <textarea
              required
              rows="3"
              value={formData.design}
              onChange={(e) => setFormData({ ...formData, design: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
              placeholder="Describe the design you want (colors, theme, decorations...)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message on Cake</label>
            <input
              type="text"
              value={formData.cakeMessage}
              onChange={(e) => setFormData({ ...formData, cakeMessage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
              placeholder="e.g., Happy Birthday John!"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Date *</label>
            <input
              type="date"
              required
              value={formData.requiredDate}
              onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
              min={new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 3 days advance notice for custom cakes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
            <textarea
              rows="2"
              value={formData.specialInstructions}
              onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
              placeholder="Any dietary restrictions, allergies, or special requests?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomCakeOrder;