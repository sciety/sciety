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

  it('returns not-found if the Twitter user does not exist', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => ({
      errors: [
        {
          detail: 'Could not find user with id: [2244994946].',
          title: 'Not Found Error',
          resource_type: 'user',
          parameter: 'id',
          value: '2244994946',
          type: 'https://api.twitter.com/2/problems/resource-not-found',
        },
      ],
    });
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = await getTwitterUserDetails(userId('12345'));
    const error = result.unsafelyUnwrapErr();

    expect(error).toBe('not-found');
  });

  it('returns not-found if the Twitter user ID is invalid', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => {
      class InvalidTwitterIdError extends Error {
        response = {
          status: 400,
        };
      }
      throw new InvalidTwitterIdError();
    };
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = await getTwitterUserDetails(userId('123456abcdef'));
    const error = result.unsafelyUnwrapErr();

    expect(error).toBe('not-found');
  });

  it('returns unavailable if the Twitter API is unavailable', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => {
      throw new Error('Twitter API Unavailable');
    };
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = await getTwitterUserDetails(userId('12345'));
    const error = result.unsafelyUnwrapErr();

    expect(error).toBe('unavailable');
  });
});
