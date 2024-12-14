
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    username: string;
    token: string;  // This will include the JWT token
  };
  error?: string;
}
const API_BASE_URL = 'http://192.168.81.213:8000';

export const register = async (userData: RegisterParams): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      const { username, token } = result;
      //console.log(`User Registred ${username}  token ${token}`)
      return {
        success: true,
        data: {
          username,
          token,
        },
      };
    } else {
      return { success: false, error: result.detail || `Error ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    return { success: false, error: 'A network error occurred. Please try again later.' };
  }
};

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    access_token: string;
    token_type: string;
  };
  error?: string;
}

export const login = async (userData: LoginParams): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', userData.username);
  formData.append('password', userData.password);
  formData.append('scope', ''); // You can add scope if needed
  formData.append('client_id', 'string'); // Replace with your actual client_id
  formData.append('client_secret', 'string'); // Replace with your actual client_secret

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(), // Send the form data as a string
    });

    const result = await response.json();

    if (response.ok) {
      console.log(DataView)
      return { success: true, data: result };
    } else {
      return { success: false, error: result.detail || `Error ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    return { success: false, error: 'A network error occurred. Please try again later.' };
  }
};
