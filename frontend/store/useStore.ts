import { getUsersWaterRelatedData } from '@/api';
import { create } from 'zustand';

interface UserWaterData {
  currect_water_level_in_bottle: number,
  daily_goal: number,
  todays_water_intake_in_ml: number
  is_bottle_on_dock: boolean,
  percentage_completed: number
}

interface Store {
  userWaterData: UserWaterData | null,
  setUserWaterData: (data: UserWaterData) => void,
  fetchUserWaterData: (token: string) => void,
}

const useStore = create<Store>((set) => ({
  userWaterData: null,
  setUserWaterData: (data: UserWaterData) => set({ userWaterData: data }),
  fetchUserWaterData: async (token) => {
    try {
      const data = await getUsersWaterRelatedData(token);
      const percentageCompleted = Math.min(
        (data.todays_water_intake_in_ml / data.daily_goal) * 100,
        100
      );
      const updatedData: UserWaterData = {
        ...data,
        percentage_completed: isNaN(percentageCompleted) ? 0 : percentageCompleted,
      };
      set({ userWaterData: updatedData });
    } catch (error) {
      console.error('Failed to fetch user water data:', error);
    }
  },
}));

export default useStore;
