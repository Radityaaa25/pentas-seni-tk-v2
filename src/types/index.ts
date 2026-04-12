export type RegistrationData = {
  id: string; 
  child_name: string;
  child_class: string;
};

export type Seat = {
  id: string;
  row_name: string;
  seat_number: number;
  is_occupied: boolean;
  is_blocked: boolean;
  assigned_to: string | null;
  registrations?: RegistrationData | null;
};

export type GroupedParticipant = {
  regId: string;
  childName: string;
  childClass: string;
  seatNumbers: string[];
};