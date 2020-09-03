import axios from 'axios';

type TwitterResponse = {
  data?: {
    profile_image_url: string;
  },
  errors?: unknown,
};

export type GetTwitterResponse = (url: string) => Promise<TwitterResponse>;

export default (): GetTwitterResponse => (
  async (url) => {
    const { data } = await axios.get<TwitterResponse>(
      url,
      { headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER_TOKEN ?? ''}` } },
    );
    return data;
  }
);
