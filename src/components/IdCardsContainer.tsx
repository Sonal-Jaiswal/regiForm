
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegistrationData } from '@/types';
import IdCard from './IdCard';
import { ArrowLeft } from 'lucide-react';

interface IdCardsContainerProps {
  data: RegistrationData;
  onBack: () => void;
}

const IdCardsContainer: React.FC<IdCardsContainerProps> = ({ data, onBack }) => {
  // Function to handle printing the ID cards
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="card-glow animate-pulse-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary trapped-glow">Your ID Cards</CardTitle>
          <CardDescription className="text-lg">
            Your team has been successfully registered for TRAPPED: Dare to Escape!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4 justify-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registration
          </Button>
          <Button onClick={handlePrint}>
            Print ID Cards
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 print:gap-4">
        {data.members.map((member, index) => (
          <IdCard 
            key={index} 
            member={member} 
            teamName={data.teamName} 
          />
        ))}
      </div>
    </div>
  );
};

export default IdCardsContainer;
