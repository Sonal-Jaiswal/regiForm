
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TeamMember } from '@/types';
import { BadgeCheck } from 'lucide-react';
import { BRANCHES } from '@/constants';

interface IdCardProps {
  member: TeamMember;
  teamName: string;
}

const IdCard: React.FC<IdCardProps> = ({ member, teamName }) => {
  // Select the appropriate spider image based on gender
  const getCharacterImage = () => {
    if (member.gender === 'female') {
      return '/lovable-uploads/1d476e35-1558-4bac-bd0d-4a9d8be955e1.png';
    } else if (member.gender === 'male') {
      return '/lovable-uploads/2b2d6e50-4ce6-49d6-ad8d-c5391fdbdd64.png';
    } else {
      // For 'other' gender
      return '/lovable-uploads/d9f88e6a-8984-4fa5-afd1-6e22eaf1c01c.png';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden card-glow animate-pulse-glow bg-card">
      <div className="bg-muted p-2 border-b border-border flex justify-between items-center">
        <div className="w-10 h-10">
          <img 
            src="/lovable-uploads/2a5b9d6d-fbd8-4e4a-ab5b-1f4f6c6bfffe.png" 
            alt="GFG KIIT Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-center text-primary trapped-glow flex-1">TRAPPED: Dare to Escape</h2>
        <div className="w-10 h-10"></div> {/* Empty div for balanced layout */}
      </div>
      
      <div className="p-1 bg-primary/10 text-center">
        <p className="text-xs font-medium">OFFICIAL PARTICIPANT</p>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
            <img 
              src={getCharacterImage()} 
              alt="Character Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
              <h3 className="text-xl font-bold">{member.fullName}</h3>
              {member.isTeamLead && (
                <div className="flex items-center justify-center md:justify-start text-primary">
                  <BadgeCheck className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Team Lead</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-1 text-sm">
              <p><span className="text-muted-foreground">Team:</span> <span className="font-medium">{teamName}</span></p>
              <p><span className="text-muted-foreground">Roll No:</span> <span className="font-medium">{member.rollNo}</span></p>
              <p><span className="text-muted-foreground">Branch:</span> <span className="font-medium">
                {BRANCHES.find(b => b.value === member.branch)?.name || member.branch}
              </span></p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-muted text-center">
          <div className="text-xs text-muted-foreground">ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdCard;
