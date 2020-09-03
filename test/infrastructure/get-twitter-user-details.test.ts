import { GetTwitterResponse } from '../../src/infrastructure/get-twitter-response';
import createGetTwitterUserDetails from '../../src/infrastructure/get-twitter-user-details';
import userId from '../../src/types/user-id';
import dummyLogger from '../dummy-logger';

describe('get-twitter-user-details', () => {
  it('returns the avatar URL for the user', async () => {
    const avatarUrl = 'http://example.com';
    const getTwitterResponse: GetTwitterResponse = async () => ({
      data: {
        profile_image_url: avatarUrl,
      },
    });
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = await getTwitterUserDetails(userId('12345'));
    const userDetails = result.unsafelyUnwrap();

    expect(userDetails.avatarUrl).toBe(avatarUrl);
  });

  it.todo('returns an error if the Twitter user does not exist');

  it.todo('returns an error if the Twitter API is unavailable');
});
