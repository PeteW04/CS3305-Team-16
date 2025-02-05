import React from 'react';

function PriorityBadge({ priority, status }) {
  const getBadgeStyles = () => {
    if (status === 'done') {
      return 'bg-green-100 text-green-600';
    }
    return priority === 'Low' 
      ? 'bg-orange-100 text-orange-600' 
      : 'bg-red-100 text-red-600';
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${getBadgeStyles()}`}>
      {status === 'done' ? 'Completed' : priority}
    </span>
  );
}

export default PriorityBadge;