import * as E from 'fp-ts/lib/Either';
import { GetTwitterResponse } from '../../src/infrastructure/get-twitter-response';
import createGetTwitterUserDetails from '../../src/infrastructure/get-twitter-user-details';
import { toUserId } from '../../src/types/user-id';
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
    const result = getTwitterUserDetails(toUserId('12345'));
    const expected = {
      avatarUrl: 'http://example.com',
      displayName: 'John Smith',
      handle: 'arbitrary_twitter_handle',
    };

    expect(await result()).toStrictEqual(E.right(expected));
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
    const result = getTwitterUserDetails(toUserId('12345'));

    expect(await result()).toStrictEqual(E.left('not-found'));
  });

  it('returns not-found if the Twitter user ID is invalid', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => {
      class InvalidTwitterIdError extends Error {
        isAxiosError = true;

        response = {
          status: 400,
        };
      }
      throw new InvalidTwitterIdError();
    };
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = getTwitterUserDetails(toUserId('123456abcdef'));

    expect(await result()).toStrictEqual(E.left('not-found'));
  });

  it('returns unavailable if the Twitter API is unavailable', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => {
      throw new Error('Twitter API Unavailable');
    };
    const getTwitterUserDetails = createGetTwitterUserDetails(getTwitterResponse, dummyLogger);
    const result = getTwitterUserDetails(toUserId('12345'));

    expect(await result()).toStrictEqual(E.left('unavailable'));
  });
});
