import React from "react";

const ChatBubble = ({ sender, message, time, isSent }) => {
  return (
    <div className="flex flex-col items-end space-y-1">
      <span className="text-xs text-gray-600">{sender}</span>
      <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg max-w-xs shadow-md relative">
        <p>{message}</p>
        <div className="flex items-center justify-end text-xs text-gray-200 mt-1">
          <span>{time}</span>
          {isSent && (
            <span className="ml-1 text-green-400">✔✔</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;