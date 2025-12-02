interface ApiResponse<T = any> {
  issuccessful: boolean;
  message: string;
  data: T;
}

interface ApiError {
  issuccessful: false;
  message: string;
  data: {
    errors?: string[];
    error?: string;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-dot-project-ab-dev.el.r.appspot.com') {
    this.baseURL = baseURL;
    }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<ApiResponse<T>> {
//     const url = `${this.baseURL}${endpoint}`;
    
//     const config: RequestInit = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'API request failed');
//       }

//       return data;
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new Error(error.message);
//       }
//       throw new Error('Network error occurred');
//     }
//   }


  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        
        const config: RequestInit = {
            headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                return {
                    issuccessful: false,
                    message: data.message || 'Request failed',
                    data: data.data || {}
                };
            }

            return {
                issuccessful: true,
                message: data.message || 'Success',
                data: data.data || data // Handle both response formats
            };
        } catch (error) {
            if (error instanceof Error) {
            throw new Error(error.message);
            }
            throw new Error('Network error occurred');
        }
    }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
