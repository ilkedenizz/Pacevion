/**
 * Fetch client wrapper for Jolpica F1 API.
 * Base URL: https://api.jolpi.ca/ergast/f1/
 * All requests include a custom User-Agent header as recommended.
 */

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export async function fetchClient<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'User-Agent': 'Pacevion/0.0.0 (github.com/your-repo)',
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
}
