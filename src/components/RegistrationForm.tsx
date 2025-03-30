
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';
import { BRANCHES, MAX_TEAM_MEMBERS, SHEETS_URL } from '@/constants';
import { Gender, RegistrationData, TeamMember } from '@/types';
import { UserIcon, BadgeCheck, UserPlus, Save, Trash2 } from 'lucide-react';

const emptyMember = (): TeamMember => ({
  fullName: '',
  rollNo: '',
  email: '',
  branch: '',
  gender: 'male',
  isTeamLead: false
});

const RegistrationForm = ({ onRegistrationComplete }: { onRegistrationComplete: (data: RegistrationData) => void }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    teamName: '',
    members: [{ ...emptyMember(), isTeamLead: true }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = () => {
    if (registrationData.members.length < MAX_TEAM_MEMBERS) {
      setRegistrationData(prev => ({
        ...prev,
        members: [...prev.members, emptyMember()]
      }));
    } else {
      toast({
        title: "Maximum team size reached",
        description: `You can only have up to ${MAX_TEAM_MEMBERS} members per team.`,
        variant: "destructive"
      });
    }
  };

  const handleRemoveMember = (index: number) => {
    if (registrationData.members.length > 1) {
      const newMembers = [...registrationData.members];
      newMembers.splice(index, 1);
      
      if (registrationData.members[index].isTeamLead && newMembers.length > 0) {
        newMembers[0].isTeamLead = true;
      }
      
      setRegistrationData(prev => ({
        ...prev,
        members: newMembers
      }));
    }
  };

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...registrationData.members];
    
    if (field === 'gender') {
      newMembers[index][field] = value as Gender;
    } else if (field === 'isTeamLead') {
      newMembers[index][field] = value === 'true';
    } else {
      newMembers[index][field] = value;
    }
    
    setRegistrationData(prev => ({
      ...prev,
      members: newMembers
    }));
  };

  const handleTeamLeadChange = (newLeadIndex: number) => {
    const newMembers = registrationData.members.map((member, idx) => ({
      ...member,
      isTeamLead: idx === newLeadIndex
    }));
    
    setRegistrationData(prev => ({
      ...prev,
      members: newMembers
    }));
  };

  const validateForm = (): boolean => {
    if (!registrationData.teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a team name",
        variant: "destructive"
      });
      return false;
    }

    for (let i = 0; i < registrationData.members.length; i++) {
      const member = registrationData.members[i];
      if (!member.fullName.trim()) {
        toast({
          title: "Full name required",
          description: `Please enter full name for member ${i + 1}`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!member.rollNo.trim()) {
        toast({
          title: "Roll number required",
          description: `Please enter roll number for ${member.fullName}`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!member.email.trim() || !member.email.includes('@')) {
        toast({
          title: "Valid email required",
          description: `Please enter a valid email for ${member.fullName}`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!member.branch) {
        toast({
          title: "Branch required",
          description: `Please select a branch for ${member.fullName}`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    if (!registrationData.members.some(member => member.isTeamLead)) {
      toast({
        title: "Team lead required",
        description: "Please designate one member as the team lead",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('teamName', registrationData.teamName);
      
      registrationData.members.forEach((member, index) => {
        formData.append(`member[${index+1}]Name`, member.fullName);
        formData.append(`member[${index+1}]RollNo`, member.rollNo);
        formData.append(`member[${index+1}]Email`, member.email);
        formData.append(`member[${index+1}]Branch`, member.branch);
        formData.append(`member[${index+1}]Gender`, member.gender);
        formData.append(`member[${index+1}]IsTeamLead`, member.isTeamLead ? 'Yes' : 'No');
      });
      
      console.log("Sending data to Google Sheets:", Object.fromEntries(formData));

      const response = await fetch(
        `https://script.google.com/macros/s/${import.meta.env.VITE_Sheet}/exec`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        toast({
          title: "Registration note",
          description: "Your registration was processed, but we couldn't verify with Google Sheets",
          duration: 5000
        });
      }
      else{
        toast({
          title: "Registration successful!",
          description: "Your team has been registered for the event.",
          duration: 5000
        });
      }
      
      // Use JSONP approach for Google Sheets
      const jsonpCallback = `callback_${Date.now()}`;
      const script = document.createElement('script');
      
      // Create a global callback function
      (window as any)[jsonpCallback] = function(response: any) {
        console.log("Google Sheets response:", response);
        
        // Clean up
        document.body.removeChild(script);
        delete (window as any)[jsonpCallback];
        
        if (response && response.result === 'success') {
          // toast({
          //   title: "Registration successful!",
          //   description: "Your team has been registered for the event.",
          //   duration: 5000
          // });
          
          onRegistrationComplete(registrationData);
        } else {
          // toast({
          //   title: "Registration note",
          //   description: "Your registration was processed, but we couldn't verify with Google Sheets. Your ID cards are still generated.",
          //   duration: 5000
          // });
          
          // Still proceed with registration to show ID cards
          onRegistrationComplete(registrationData);
        }
      };
      
      // Build query string from FormData
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        params.append(key, value.toString());
      }
      params.append('callback', jsonpCallback);
      
      // Create and append script
      script.src = `${SHEETS_URL}?${params.toString()}`;
      document.body.appendChild(script);
      
      // Set a fallback timeout
      setTimeout(() => {
        if ((window as any)[jsonpCallback]) {
          // Clean up if callback wasn't triggered
          document.body.removeChild(script);
          delete (window as any)[jsonpCallback];
          
          toast({
            title: "Registration complete",
            description: "Your ID cards have been generated.",
            duration: 5000
          });
          
          // Still proceed with registration to show ID cards
          onRegistrationComplete(registrationData);
        }
      }, 5000);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Submission Form Error",
        description: "We encountered an issue with Google Sheets",
        variant: "destructive"
      });
      
      // Still proceed with registration to show ID cards
      onRegistrationComplete(registrationData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto card-glow animate-pulse-glow">
      <CardHeader className="space-y-1 pb-6 border-b border-muted flex flex-col items-center">
        <div className="w-16 h-16 mb-2">
          <img 
            src="gfgKIIT.png" 
            alt="GFG KIIT Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <CardTitle className="text-3xl font-bold text-center text-primary trapped-glow">
          TRAPPED: Dare to Escape
        </CardTitle>
        <CardDescription className="text-center text-lg">
          Fill in your details to register. You can participate solo or as a team of up to {MAX_TEAM_MEMBERS} members.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name</Label>
            <Input 
              id="teamName" 
              placeholder="Enter your team name"
              value={registrationData.teamName}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, teamName: e.target.value }))}
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-6">
            {registrationData.members.map((member, index) => (
              <Card key={index} className="bg-muted p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Team Member {index + 1}</h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        id={`teamLead${index}`} 
                        name="teamLead" 
                        checked={member.isTeamLead}
                        onChange={() => handleTeamLeadChange(index)}
                        className="text-primary focus:ring-primary"
                      />
                      <label htmlFor={`teamLead${index}`} className="flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-1 text-primary" />
                        <span className="text-sm">Team Lead</span>
                      </label>
                    </div>
                    
                    {registrationData.members.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveMember(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`fullName${index}`}>Full Name</Label>
                    <Input
                      id={`fullName${index}`}
                      placeholder="Enter full name"
                      value={member.fullName}
                      onChange={(e) => handleMemberChange(index, 'fullName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`rollNo${index}`}>Roll No</Label>
                    <Input
                      id={`rollNo${index}`}
                      placeholder="Enter roll number"
                      value={member.rollNo}
                      onChange={(e) => handleMemberChange(index, 'rollNo', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`email${index}`}>Email</Label>
                    <Input
                      id={`email${index}`}
                      type="email"
                      placeholder="Enter email address"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`branch${index}`}>Branch</Label>
                    <Select 
                      value={member.branch} 
                      onValueChange={(value) => handleMemberChange(index, 'branch', value)}
                    >
                      <SelectTrigger id={`branch${index}`}>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup 
                      defaultValue="male"
                      value={member.gender}
                      onValueChange={(value) => handleMemberChange(index, 'gender', value)}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id={`male${index}`} />
                        <Label htmlFor={`male${index}`}>Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id={`female${index}`} />
                        <Label htmlFor={`female${index}`}>Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id={`other${index}`} />
                        <Label htmlFor={`other${index}`}>Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </Card>
            ))}
            
            {registrationData.members.length < MAX_TEAM_MEMBERS && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddMember}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full transition-all duration-300 bg-primary text-black hover:bg-primary/90 hover:scale-[1.02]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processing</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Registration
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegistrationForm;
