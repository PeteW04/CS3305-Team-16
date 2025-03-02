import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, CheckCircle, Mail } from 'lucide-react';
import { notifications } from '../DummyData/notifications';
import { getNotifications, deleteNotification } from '../api/notification';
import socket from '../utils/socket';

function NotificationModal({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    socket.connect();

    const handleNewNotification = (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    };

    const handleDeleteNotification = (deletedId) => {
      setNotifications(prev => prev.filter(n => n._id !== deletedId));
    };

    socket.on('new-notification', handleNewNotification);
    socket.on('delete-notification', handleDeleteNotification);

    // Cleanup on unmount
    return () => {
      socket.off('new-notification', handleNewNotification);
      socket.off('delete-notification', handleDeleteNotification);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
        console.log(data)
      } catch (err) {
        setError(err.message);
        console.error('Notification fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleRemoveNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id)); // Use _id if using MongoDB
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

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
            <div key={notification._id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Icon based on notification type */}
                {notification.type === 'task' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Mail className="w-4 h-4 text-blue-600" />
                )}
                <div>
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  {new Date(notification.createdAt).toLocaleDateString()}
                </div>
              </div>
              {/* Remove button */}
              <button
                onClick={() => handleRemoveNotification(notification._id)}
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