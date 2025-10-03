"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamSectionProps {
  sectionRef: React.MutableRefObject<HTMLElement | null>;
  teamMembers: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ sectionRef, teamMembers }) => {
  return (
    <section 
      id="team" 
      ref={sectionRef}
      className="py-20 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet the experts behind Stock-OS who are revolutionizing stock trading
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{member.role}</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                    <span className="text-sm">📘</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                    <span className="text-sm">🐦</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900">
                    <span className="text-sm">💼</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;