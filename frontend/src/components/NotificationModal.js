import React, {useEffect, useRef} from 'react';
import { X, Bell, CheckCircle, Mail } from 'lucide-react';
import { notifications } from '../DummyData/notifications';

function NotificationModal({ onClose }) {

// Function to remove a notification
const handleRemoveNotification = (id) => {
  // Filter out the notification with the given ID
  const updatedNotifications = notifications.filter((notification) => notification.id !== id);
  // Update the state (you can replace this with actual state management)
  console.log('Notification removed:', id);
};

// Ref for the modal container
const modalRef = useRef(null);

// Close the modal when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(); // Close the modal
    }
  };

  // Add event listener
  document.addEventListener('mousedown', handleClickOutside);

  // Cleanup
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [onClose]);

return (
  <div
    className="fixed top-16 right-4 z-50" // Position the modal near the bell icon
    ref={modalRef} // Attach the ref to the modal container
  >
    <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Modal Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          Notifications
        </h3>
      </div>

      {/* Modal Body */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Icon based on notification type */}
              {notification.type === 'task' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Mail className="w-4 h-4 text-blue-600" />
              )}
              <div>
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
            {/* Remove button */}
            <button
              onClick={() => handleRemoveNotification(notification.id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}

export default NotificationModal;