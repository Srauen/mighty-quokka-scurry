"use client";

import React from 'react';

interface NewsFeedAppProps {
  newsFeed: string | null; // Changed to accept a single string or null
}

const NewsFeedApp: React.FC<NewsFeedAppProps> = ({ newsFeed }) => {
  // No need for useRef or scrolling logic as it's a single item now

  // Extract time and headline if newsFeed is not null
  const time = newsFeed ? newsFeed.split('] ')[0].replace('[', '') : '';
  const headline = newsFeed ? newsFeed.split('] ')[1] : '';

  return (
    <div className="flex-grow p-0 overflow-hidden flex items-center justify-center text-center"> {/* Centered content */}
      {newsFeed ? (
        <div className="bg-[#2d3748] p-3 rounded-lg flex flex-col items-center justify-center w-full h-full">
          <p className="text-sm text-gray-300 font-medium mb-1">{headline}</p>
          <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No news available...</p>
      )}
    </div>
  );
};

export default NewsFeedApp;