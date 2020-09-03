import axios from 'axios';

type TwitterResponse = {
  data: {
    profile_image_url: string;
  },
};

export type GetTwitterResponse = (
  url: string,
  oauthBearerTokenValue: string
) => Promise<TwitterResponse>;

export default (): GetTwitterResponse => (
  async (url, oauthBearerTokenValue) => {
    const { data } = await axios.get<TwitterResponse>(
      url,
      { headers: { Authorization: `Bearer ${oauthBearerTokenValue}` } },
    );
    return data;
  }
);
