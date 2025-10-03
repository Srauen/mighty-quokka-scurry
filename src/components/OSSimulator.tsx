"use client";

import React from 'react';

const OSSimulator: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe
        src="/os-simulation.html"
        title="Stock OS Simulator"
        className="w-full h-full border-none"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default OSSimulator;