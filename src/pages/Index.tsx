
import React, { useState } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import IdCardsContainer from '@/components/IdCardsContainer';
import { RegistrationData } from '@/types';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  const handleRegistrationComplete = (data: RegistrationData) => {
    setRegistrationData(data);
    setRegistrationComplete(true);
  };

  const handleBackToRegistration = () => {
    setRegistrationComplete(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {!registrationComplete ? (
          <RegistrationForm onRegistrationComplete={handleRegistrationComplete} />
        ) : (
          registrationData && (
            <IdCardsContainer 
              data={registrationData} 
              onBack={handleBackToRegistration} 
            />
          )
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
