import React, { useState } from 'react';
import { Mail } from 'lucide-react';

function AddMemberModal({ onClose, onAddMember }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (email.trim()) {
      onAddMember(email); 
      setEmail(''); 
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-96 bg-white rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-lg">Add New Member</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Enter Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="victor@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;