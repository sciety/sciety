import axios from 'axios';

type TwitterResponse = {
  data?: {
    name: string,
    profile_image_url: string;
    username: string;
  },
  errors?: unknown,
};

export type GetTwitterResponse = (url: string) => Promise<TwitterResponse>;

export default (twitterApiBearerToken: string): GetTwitterResponse => (
  async (url) => {
    const { data } = await axios.get<TwitterResponse>(
      url,
      { headers: { Authorization: `Bearer ${twitterApiBearerToken}` } },
    );
    return data;
  }
);
