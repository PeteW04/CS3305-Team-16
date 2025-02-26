import React from 'react';
import { X, Bell, CheckCircle, Mail } from 'lucide-react';
import { notifications } from '../DummyData/notifications';

function NotificationModal({ onClose }) {

  const handleRemoveNotification = (id) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    console.log('Notification removed:', id);
  };

  return (
    <div
      className="fixed top-16 right-4 z-50" 
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
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