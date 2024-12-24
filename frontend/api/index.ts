// @api/index.ts
const API_BASE_URL = 'http://192.168.122.213:3002';


export const addWaterIntake = async (sensorId: string, intake: number, token: string) => {
  const encodedTime = encodeURIComponent(new Date().toLocaleString('sv-SE', { timeZoneName: 'short' }).replace(' ', 'T').slice(0, 19));
  console.log(encodedTime)
  const response = await fetch(`${API_BASE_URL}/user/add_intake`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      sensor_id: sensorId,
      intake: intake,
      time: encodedTime
    }),
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
  const response = await fetch(`${API_BASE_URL}/user/get_water_attributes`, {
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

interface UserProfileResponse {
  username: string,
  email: string,
}

export const getUserProfile = async (token: string): Promise<UserProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  const data: UserProfileResponse = await response.json();
  return data;
}

export const setDailyGoal = async (token: string, dailyGaol: number) => {
  const response = await fetch(`${API_BASE_URL}/user/set_daily_goal?dailyGoal=${dailyGaol}`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`)
  }
  return true
}

