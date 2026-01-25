interface RequestOptions {
  headers?: Record<string, string>;
  cookieHeader?: string;
}

class ApiClient {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(cookieHeader?: string, additionalHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    // Forward cookies to backend so AuthGuard can read session_token
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(errorData.message || errorData.error || 'An error occurred');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  }

  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const headers = this.getHeaders(options?.cookieHeader, options?.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async post<T = any>(endpoint: string, data?: Record<string, any>, options?: RequestOptions): Promise<T> {
    const headers = this.getHeaders(options?.cookieHeader, options?.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async put<T = any>(endpoint: string, data: Record<string, any>, options?: RequestOptions): Promise<T> {
    const headers = this.getHeaders(options?.cookieHeader, options?.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async patch<T = any>(endpoint: string, data: Record<string, any>, options?: RequestOptions): Promise<T> {
    const headers = this.getHeaders(options?.cookieHeader, options?.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const headers = this.getHeaders(options?.cookieHeader, options?.headers);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    return this.handleResponse<T>(response);
  }
}
console.log("API URL IS", process.env.NEXT_PUBLIC_API_URL)
export default new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
