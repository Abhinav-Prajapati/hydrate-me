// api.ts
const API_BASE_URL = 'http://192.168.81.213:8000';
export const addWaterIntake = async (sensorId: string, intake: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/user/add_intake?sensor_id=${sensorId}&intake=${intake}`, {
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
