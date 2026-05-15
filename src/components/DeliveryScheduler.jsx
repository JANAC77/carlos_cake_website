// src/components/DeliveryScheduler.jsx
import { useState, useEffect } from 'react';
import { getAvailableTimeSlots, getHolidayDates } from '../firebase';

const DeliveryScheduler = ({ onScheduleConfirm, initialDate, initialTime }) => {
  const [deliveryDate, setDeliveryDate] = useState(initialDate || '');
  const [deliveryTime, setDeliveryTime] = useState(initialTime || '');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [isPreOrder, setIsPreOrder] = useState(false);

  useEffect(() => {
    loadAvailableTimes();
    loadHolidays();
  }, [deliveryDate]);

  const loadAvailableTimes = async () => {
    const slots = await getAvailableTimeSlots(deliveryDate);
    setAvailableTimes(slots);
  };

  const loadHolidays = async () => {
    const holidayList = await getHolidayDates();
    setHolidays(holidayList.map(h => h.date));
  };

  const isHoliday = (date) => {
    return holidays.includes(date);
  };

  const getMinDate = () => {
    const date = new Date();
    if (isPreOrder) {
      date.setDate(date.getDate() + 7);
    } else {
      date.setDate(date.getDate() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date.toISOString().split('T')[0];
  };

  const handleConfirm = () => {
    if (deliveryDate && deliveryTime) {
      onScheduleConfirm({ date: deliveryDate, time: deliveryTime, isPreOrder });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Delivery Schedule</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPreOrder}
            onChange={(e) => setIsPreOrder(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Pre-order (7+ days advance)</span>
        </label>
      </div>

      {/* Delivery Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isPreOrder ? 'Pre-order Date' : 'Delivery Date'} *
        </label>
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          min={getMinDate()}
          max={getMaxDate()}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
        />
        {deliveryDate && isHoliday(deliveryDate) && (
          <p className="text-red-500 text-xs mt-1">⚠️ No delivery on this date (Holiday)</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {isPreOrder ? 'Pre-orders require 7+ days advance notice' : 'Regular orders require 1 day advance notice'}
        </p>
      </div>

      {/* Delivery Time */}
      {deliveryDate && !isHoliday(deliveryDate) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time Slot *</label>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setDeliveryTime(slot)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  deliveryTime === slot
                    ? 'border-pink-500 bg-pink-50 text-pink-600'
                    : 'border-gray-200 hover:border-pink-200'
                }`}
              >
                <span className="text-sm font-medium">{slot}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!deliveryDate || !deliveryTime || isHoliday(deliveryDate)}
        className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 disabled:opacity-50 transition-all"
      >
        Confirm Delivery Schedule
      </button>

    </div>
  );
};

export default DeliveryScheduler;