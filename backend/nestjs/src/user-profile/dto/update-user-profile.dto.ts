export class UpdateUserProfileDto {
  username?: string;
  currect_water_level_in_bottle?: number;
  bottle_weight?: number;
  is_bottle_on_dock?: boolean;
  daily_goal?: number;
  todays_water_intake_in_ml?: number;
  wakeup_time?: Date;
  sleep_time?: Date;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  last_water_intake_at?: Date;
}

