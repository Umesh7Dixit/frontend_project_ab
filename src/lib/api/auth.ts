import {  ApiResponse } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    userId: number;
    userType: string;
    user_id: number;
    parent_org_id: number;
    org_id: number;
    facility_id: number;
    full_name: string;
    phone_number: string;
    is_active: boolean;
    login_status: string;
  };
  expiresIn: string;
  error?: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          issuccessful: false,
          message: data.message || 'Login failed',
          data: data.data || {}
        }; 
      }
      console.log("response is here ", response);

      return {
        issuccessful: true,
        message: 'Login successful',
        data: data.data // unwrap the inner "data"
      };

    } catch (error) {
        console.error('Login error:', error);
        return {
          issuccessful: false,
          message: error instanceof Error ? error.message : 'Network error',
          data: {
            token: '',
            user: {
              email: '',
              userId: 0,
              userType: '',
              user_id: 0,
              parent_org_id: 0,
              org_id: 0,
              facility_id: 0,
              full_name: '',
              phone_number: '',
              is_active: false,
              login_status: '',
            },
            expiresIn: '',
            error: 'Network error',
          },
        };
      }

  },
};