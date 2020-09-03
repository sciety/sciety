import { GetTwitterResponse } from '../../src/infrastructure/get-twitter-response';
import createGetTwitterUserDetails from '../../src/infrastructure/get-twitter-user-details';
import userId from '../../src/types/user-id';
import dummyLogger from '../dummy-logger';

describe('get-twitter-user-details', () => {
  it('returns the details for the user', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => ({
      data: {
        name: 'John Smith',
        profile_image_url: 'http://example.com',
        username: 'arbitrary_twitter_handle',
      },
    });
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = await getTwitterUserDetails(userId('12345'));
    const userDetails = result.unsafelyUnwrap();
    const expected = {
      avatarUrl: 'http://example.com',
      displayName: 'John Smith',
      handle: 'arbitrary_twitter_handle',
    };

    expect(userDetails).toStrictEqual(expected);
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
