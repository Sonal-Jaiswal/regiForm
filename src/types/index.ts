
export type Gender = 'male' | 'female' | 'other';

export interface TeamMember {
  fullName: string;
  rollNo: string;
  email: string;
  branch: string;
  gender: Gender;
  isTeamLead: boolean;
}

export interface RegistrationData {
  teamName: string;
  members: TeamMember[];
}

export interface Branch {
  name: string;
  value: string;
}
