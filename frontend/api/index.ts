// @api/index.ts
const API_BASE_URL = 'http://192.168.81.213:8000';

export const addWaterIntake = async (sensorId: string, intake: number, token: string) => {
  const encodedTime = encodeURIComponent(new Date().toLocaleString('sv-SE', { timeZoneName: 'short' }).replace(' ', 'T').slice(0, 19));
  console.log(encodedTime)
  const response = await fetch(`${API_BASE_URL}/user/add_intake?sensor_id=${sensorId}&intake=${intake}&time=${encodedTime}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

interface userWaterDateResponse {
  currect_water_level_in_bottle: number,
  daily_goal: number,
  todays_water_intake_in_ml: number
  is_bottle_on_dock: boolean
}

export const getUsersWaterRelatedData = async (token: string): Promise<userWaterDateResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/get_user_water_attributes`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: userWaterDateResponse = await response.json();
  return data;
};
