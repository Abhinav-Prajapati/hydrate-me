-- Create table for Water Intake
CREATE TABLE IF NOT EXISTS water_intake (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sensor_id VARCHAR(50),
    water_intake_in_ml INTEGER,
    supabase_user_id UUID NOT NULL,
    FOREIGN KEY (supabase_user_id) REFERENCES user_profile(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_water_intake_and_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the last water intake time is for the previous day
  IF (SELECT last_water_intake_at::DATE FROM user_profile WHERE id = NEW.supabase_user_id) < CURRENT_TIME THEN
    UPDATE user_profile
    SET 
        todays_water_intake_in_ml = NEW.water_intake_in_ml, -- Reset today's water intake
        last_water_intake_at = NEW.timestamp -- Update the last water intake time
    WHERE id = NEW.supabase_user_id;
  ELSE
    -- Check if the last update time matches the current entry to prevent duplication
    IF (SELECT last_water_intake_at FROM user_profile WHERE id = NEW.supabase_user_id) <> NEW.timestamp THEN
      UPDATE user_profile
      SET 
          todays_water_intake_in_ml = todays_water_intake_in_ml + NEW.water_intake_in_ml, -- Add to today's water intake
          last_water_intake_at = NEW.timestamp -- Update the last water intake time
      WHERE id = NEW.supabase_user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Trigger to call the consolidated function after a new water intake entry is added
CREATE TRIGGER trigger_update_water_intake_and_time
AFTER INSERT ON water_intake
FOR EACH ROW
EXECUTE FUNCTION update_water_intake_and_time();

-- Sample row for testing
INSERT INTO public.water_intake (
    timestamp,
    sensor_id,
    water_intake_in_ml,
    supabase_user_id
)
VALUES (
    '2024-12-17 02:01:00',   -- Replace with your timestamp
    'sensor_123',            -- Replace with the sensor ID
    1000,                    -- Replace with the water intake amount in ml
    '838d9f56-cd42-49f0-b78d-134530cfb5d9'  -- Replace with the user ID (UUID)
);


select todays_water_intake_in_ml from user_profile;
