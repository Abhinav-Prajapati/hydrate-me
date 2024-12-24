export interface UserProfileUpdateData {
  username?: string;
  sensor_id?: string;
  currect_water_level_in_bottle?: number;
  bottle_weight?: number;
  is_bottle_on_dock?: boolean;
  daily_goal?: number;
  todays_water_intake_in_ml?: number;
  wakeup_time?: string;
  sleep_time?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
}
