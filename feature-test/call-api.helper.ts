import axios from 'axios';

export const callApi = async (endpoint: string, payload: Record<string, unknown>): Promise<void> => axios.post(
  `http://localhost:8080/${endpoint}`,
  JSON.stringify(payload),
  {
    headers: {
      Authorization: 'Bearer secret',
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  },
);
