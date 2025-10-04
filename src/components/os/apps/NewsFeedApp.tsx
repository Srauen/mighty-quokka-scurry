"use client";

import React from 'react';

interface NewsFeedAppProps {
  newsFeed: string[]; // Changed to accept an array of strings
}

const NewsFeedApp: React.FC<NewsFeedAppProps> = ({ newsFeed }) => {
  // Display the latest news item
  const latestNews = newsFeed.length > 0 ? newsFeed[0] : null;

  // Extract time and headline if latestNews is not null
  const time = latestNews ? latestNews.split('] ')[0].replace('[', '') : '';
  const headline = latestNews ? latestNews.split('] ')[1] : '';

  return (
    <div className="flex-grow p-0 overflow-hidden flex items-center justify-center text-center">
      {latestNews ? (
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