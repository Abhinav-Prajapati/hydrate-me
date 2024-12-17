-- Create table for Water Intake
CREATE TABLE IF NOT EXISTS water_intake (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sensor_id VARCHAR(50),
    water_intake_in_ml INTEGER,
    supabase_user_id UUID NOT NULL,
    FOREIGN KEY (supabase_user_id) REFERENCES user_profile(supabase_user_id) ON DELETE CASCADE
    -- Removed the foreign key constraint on sensor_id
);

CREATE OR REPLACE FUNCTION update_todays_water_intake()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profile
  SET todays_water_intake_in_ml = todays_water_intake_in_ml + NEW.water_intake_in_ml
  WHERE supabase_user_id = NEW.supabase_user_id;
  RETURN NEW; -- Added RETURN keyword
END;
$$ LANGUAGE plpgsql; 

-- new key word holds they new row which is added 

create trigger
trigger_update_todays_totoal_water_intake
after insert on water_intake
for each row
execute function
update_todays_water_intake();
