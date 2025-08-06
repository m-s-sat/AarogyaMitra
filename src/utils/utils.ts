// src/utils/utils.ts
import { User } from '../types';

interface ProfileData {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    pastIllnesses: string[];
    ongoingConditions: string[];
    allergies: string[];
    currentMedications: string[];
  };
  bodyMeasurements: {
    height: string;
    weight: string;
    bmi: string;
  };
}

export const calculateCompletionPercentage = (user: User | null, profileData: ProfileData): number => {
  let completed = 0;
  const total = 8;

  if (user?.name || profileData.name) completed++;
  if (profileData.age) completed++;
  if (profileData.gender) completed++;
  if (user?.phone || profileData.phone) completed++;
  if (profileData.emergencyContact.name) completed++;
  if (profileData.bodyMeasurements.height) completed++;
  if (profileData.bodyMeasurements.weight) completed++;
  if (profileData.medicalHistory.allergies.length > 0) completed++;

  return Math.round((completed / total) * 100);
};