import React from "react";

const ChatBubble = ({ sender, currentUser, message, time, readBy = [] }) => {
  const isSent = sender._id === currentUser;
  const isRead = readBy.length > 1 ||
    (readBy.length === 1 && readBy.some(reader =>
      reader._id !== sender._id
    ));
  console.log(readBy)

  return (
    <div className={`flex flex-col space-y-1 ${isSent ? "items-end" : "items-start"}`}>
      <span className="text-xs text-black-600">{`${sender.firstName} ${sender.lastName}`}</span>
      <div className={`px-4 py-2 rounded-lg max-w-xs shadow-md relative ${isSent ? "bg-indigo-600 text-white" : "bg-emerald-400 text-black"
        }`}>
        <p>{message}</p>
        <div className="flex items-center justify-end text-xs text-gray-200 mt-1">
          <span className={isSent ? "text-gray-200" : "text-gray-600"}>{time}</span>
          {isSent && (
            <span className="ml-1 text-green-400">
              {isRead ? "✔✔" : "✔"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


export default ChatBubble;