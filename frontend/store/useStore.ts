import { getUsersWaterRelatedData, getUserProfile } from '@/api';
import { create } from 'zustand';
import useAuthStore from './useAuthStore';

interface UserWaterData {
  currect_water_level_in_bottle: number;
  daily_goal: number;
  todays_water_intake_in_ml: number;
  is_bottle_on_dock: boolean;
  percentage_completed: number;
}

interface Store {
  userWaterData: UserWaterData | null;
  setUserWaterData: (data: UserWaterData) => void;
  fetchUserWaterData: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export const useStore = create<Store>((set) => ({
  userWaterData: null,
  error: null,
  isLoading: false,

  setUserWaterData: (data: UserWaterData) => set({ userWaterData: data }),

  fetchUserWaterData: async () => {
    const { session } = useAuthStore.getState();

    if (!session || !session.access_token) {
      set({ error: 'User is not authenticated. Please log in.', isLoading: false });
      return;
    }

    set({ error: null, isLoading: true });

    try {
      const data = await getUsersWaterRelatedData(session.access_token);

      const percentageCompleted = Math.min(
        (data.todays_water_intake_in_ml / data.daily_goal) * 100,
        100
      );

      const updatedData: UserWaterData = {
        ...data,
        percentage_completed: isNaN(percentageCompleted) ? 0 : percentageCompleted,
      };

      set({ userWaterData: updatedData, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch user water data:', error);

      let errorMessage = 'An unexpected error occurred.';
      if (error.response?.status === 401) {
        errorMessage = 'Unauthorized access. Please check your login credentials.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      set({ error: errorMessage, isLoading: false });
    }
  },
}));


/**
 * Zustand store to manage user profile data and handle related operations.
 *
 * -> State:
 * - `userProfile`: Stores the user's profile information (`username` and `email`).
 * - `error`: Contains any error messages encountered during operations (e.g., fetching data).
 * - `isLoading`: Boolean to indicate whether the profile data is currently being fetched.
 *
 * -> Methods:
 * - `fetchUserProfile`: Fetches the user's profile data from the server using their session token.
 *   - Checks if the session and access token are valid before making the request.
 *   - Updates `userProfile` with the fetched data if successful.
 *   - Handles various error scenarios:
 *     - If the user is not authenticated (no session or token).
 *     - Network-related errors (e.g., no internet connection).
 *     - API errors (e.g., invalid token, server errors).
 *   - Sets appropriate error messages to the `error` state for better debugging and UI feedback.
 *
 * -> Error Handling:
 * - Provides user-friendly messages for specific error cases:
 *   - 401 Unauthorized: Indicates the user needs to log in.
 *   - Network Errors: Suggests checking the internet connection.
 *   - Unexpected Errors: Displays a default message for unhandled issues.
 **/

interface UserProfile {
  username: string;
  email: string;
}

interface ProfileStore {
  userProfile: UserProfile | null;
  fetchUserProfile: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  userProfile: null,
  error: null,
  isLoading: false,

  fetchUserProfile: async () => {
    const { session } = useAuthStore.getState();

    if (!session || !session.access_token) {
      set({ error: 'User is not authenticated. Please log in.', isLoading: false });
      return;
    }

    set({ error: null, isLoading: true });

    try {
      const data = await getUserProfile(session.access_token);

      if (!data) {
        throw new Error('No user profile data returned from the server.');
      }

      set({ userProfile: data, error: null, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);

      let errorMessage = 'An unexpected error occurred while fetching the user profile.';
      if (error.response?.status === 401) {
        errorMessage = 'Unauthorized access. Please check your login credentials.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      set({ error: errorMessage, isLoading: false });
    }
  },
}));
