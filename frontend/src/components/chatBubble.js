import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const ChatBubble = ({ sender, currentUser, message, time, readBy = [], onEdit, onDelete, messageId }) => {
  const isSender = sender._id === currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);
  const isSent = sender._id === currentUser;
  const isRead = readBy.length > 1 ||
    (readBy.length === 1 && readBy.some(reader =>
      reader._id !== sender._id
    ));

  const handleEdit = () => {
    console.log("EDITING");
    if (isEditing && editedMessage !== message) {
      onEdit(messageId, editedMessage);
    }
    setIsEditing(!isEditing);
  };
  return (
    <div className={`flex flex-col space-y-1 ${isSent ? "items-end" : "items-start"}`}>
      <div className="flex flex-row gap-2">
        <span className="text-xs text-black-600">{`${sender.firstName} ${sender.lastName}`}</span>
        {isSent && (
          <div className="flex space-x-2">
            <button onClick={handleEdit} className="text-gray-300 hover:text-black">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(messageId)} className="text-gray-300 hover:text-black">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      <div className={`px-4 py-2 rounded-lg max-w-xs shadow-md relative ${isSent ? "bg-indigo-600 text-white" : "bg-emerald-400 text-black"
        }`}>
        {isEditing ? (
          <input
            type="text"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg outline-none bg-transparent border border-white ${isSent ? "text-white" : "text-black"
              }`}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
            autoFocus
          />
        ) : (
          <p>{message}</p>
        )}

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