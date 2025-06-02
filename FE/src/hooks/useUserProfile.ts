
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/conversation';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  // Load user profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Convert string date to Date object
        if (parsedProfile.birthdate) {
          parsedProfile.birthdate = new Date(parsedProfile.birthdate);
        }
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  return { userProfile, setUserProfile };
};
