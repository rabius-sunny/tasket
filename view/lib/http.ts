export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

class Network {
  private static getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  public async get(url: string, options?: RequestInit) {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      method: 'GET',
      headers: {
        ...(options?.headers || {}),
        ...Network.getAuthHeader()
      }
    });
    return await response.json();
  }

  public async post(url: string, body: unknown, options?: RequestInit) {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
        ...Network.getAuthHeader()
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  }

  public async put(url: string, body: unknown, options?: RequestInit) {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
        ...Network.getAuthHeader()
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  }

  public async patch(url: string, body: unknown, options?: RequestInit) {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
        ...Network.getAuthHeader()
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  }

  public async delete(url: string, options?: RequestInit) {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      method: 'DELETE',
      headers: {
        ...(options?.headers || {}),
        ...Network.getAuthHeader()
      }
    });
    return await response.json();
  }
}

const requests = new Network();
export default requests;
