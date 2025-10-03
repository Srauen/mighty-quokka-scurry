"use client";

import React, { useEffect, useRef } from 'react';

interface NewsFeedAppProps {
  newsFeed: string[];
}

const NewsFeedApp: React.FC<NewsFeedAppProps> = ({ newsFeed }) => {
  const newsFeedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newsFeedRef.current) {
      newsFeedRef.current.scrollTop = newsFeedRef.current.scrollHeight;
    }
  }, [newsFeed]);

  return (
    <div id="news-feed" ref={newsFeedRef} className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar">
      {newsFeed.length === 0 ? (
        <p className="text-gray-400">No news available...</p>
      ) : (
        newsFeed.map((item, index) => (
          <div key={index} className="bg-[#2d3748] p-3 rounded-lg flex items-center justify-between">
            <p className="text-sm text-gray-300">{item.split('] ')[1]}</p>
            <span className="text-xs text-gray-400 whitespace-nowrap">{item.split('] ')[0].replace('[', '')}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsFeedApp;