"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
  sectionRef: React.MutableRefObject<HTMLElement | null>;
}

const TeamSection: React.FC<TeamSectionProps> = ({ teamMembers, sectionRef }) => {
  return (
    <section id="team" ref={sectionRef} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Meet Our Expert Team
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          A dedicated group of professionals passionate about revolutionizing stock trading with AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none">
              <CardHeader className="flex flex-col items-center justify-center p-6">
                <Avatar className="w-24 h-24 mb-4 border-4 border-blue-500 dark:border-green-400">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-green-400 text-base font-medium">
                  {member.role}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;