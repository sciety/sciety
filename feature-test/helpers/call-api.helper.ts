import axios from 'axios';

export const callApi = async (endpoint: string, payload: Record<string, unknown>): Promise<unknown> => axios.post(
  `http://localhost:8081/${endpoint}`,
  JSON.stringify(payload),
  {
    headers: {
      Authorization: 'Bearer secret',
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  },
).catch((reason) => {
  // eslint-disable-next-line no-console
  console.log('callApi failed', {
    status: reason.response.status,
    url: reason.response.config.url,
    data: reason.response.data,
    payload,
  });
  throw reason;
});
