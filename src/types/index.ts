export interface User {
  name: string;
  email: string;
  phone?: string;
  preferredLanguage: string;
  avatar?: string;
  password?:string;
  dob?:string,
  pincode?:Number,
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  medicalHistory?: {
    pastIllnesses?: string[];
    ongoingConditions?: string[];
    allergies?: string[];
    currentMedications?: string[];
  };
  bodyMeasurements?: {
    height?: string;
    weight?: string;
    bmi?: string;
  };
  age?: string;
  gender?: string;
  role?: string;
}

export interface UserQuery{
  role: string | null,
  email: string,
  password: string
}

export interface Appointment {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'physical' | 'video';
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  specialization: string;
  rating: number;
  experience: number;
  availableSlots: string[];
  consultationFee: number;
  image: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  fileUrl: string;
  description: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  taken: boolean[];
  prescribedBy: string;
  startDate: string;
  endDate: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: string;
  isVoice?: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}