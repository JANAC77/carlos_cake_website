// src/components/OrderTracking.jsx
import { useState, useEffect } from 'react';
import { getOrderTracking } from '../firebase';

const OrderTracking = ({ orderId }) => {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchTracking();
    }
  }, [orderId]);

  const fetchTracking = async () => {
    const data = await getOrderTracking(orderId);
    setTracking(data);
    setLoading(false);
  };

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: '📝', description: 'Your order has been received' },
    { status: 'processing', label: 'Processing', icon: '👩‍🍳', description: 'Our bakers are preparing your cake' },
    { status: 'ready', label: 'Ready', icon: '🎂', description: 'Your cake is ready for delivery' },
    { status: 'out-for-delivery', label: 'Out for Delivery', icon: '🚚', description: 'Your order is on the way' },
    { status: 'delivered', label: 'Delivered', icon: '✅', description: 'Your order has been delivered' }
  ];

  const getCurrentStepIndex = () => {
    const currentStatus = tracking?.currentStatus || 'pending';
    return statusSteps.findIndex(step => step.status === currentStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tracking information available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Timeline */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-pink-500 transition-all duration-500"
          style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
        ></div>
        
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= getCurrentStepIndex();
            const isCurrent = index === getCurrentStepIndex();
            
            return (
              <div key={step.status} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                  isCompleted ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-pink-200 scale-110' : ''}`}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <p className={`text-xs font-medium ${isCompleted ? 'text-pink-600' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[80px]">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery */}
      {tracking.estimatedDeliveryTime && (
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-600">
            🚚 Estimated Delivery: {tracking.estimatedDeliveryTime}
          </p>
          <p className="text-xs text-blue-500 mt-1">
            Delivery Date: {tracking.deliveryDate}
          </p>
        </div>
      )}

      {/* Status History */}
      {tracking.statusHistory && tracking.statusHistory.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-bold text-gray-900 mb-3 text-sm">Status History</h4>
          <div className="space-y-2">
            {tracking.statusHistory.map((history, index) => (
              <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                <span className="capitalize">{history.status}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(history.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;