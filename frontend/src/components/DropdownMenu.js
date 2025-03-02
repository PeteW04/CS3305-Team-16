import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

function DropdownMenu({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block">
      {/* Dropdown Trigger Button */}
      <button
        onClick={toggleDropdown}
      >
        <MoreHorizontal size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-left"
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
          >
            Edit Project
          </button>
          <button
            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50 text-left"
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
          >
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;