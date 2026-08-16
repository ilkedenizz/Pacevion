const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export async function fetchClient<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  return response.json();
}
