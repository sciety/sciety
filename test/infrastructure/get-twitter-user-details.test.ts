import * as E from 'fp-ts/Either';
import { GetTwitterResponse } from '../../src/infrastructure/get-twitter-response';
import { getTwitterUserDetails } from '../../src/infrastructure/get-twitter-user-details';
import { dummyLogger } from '../dummy-logger';
import { arbitraryUserId } from '../types/user-id.helper';

describe('get-twitter-user-details', () => {
  it('returns the details for the user', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => ({
      data: {
        name: 'John Smith',
        profile_image_url: 'http://example.com',
        username: 'arbitrary_twitter_handle',
      },
    });
    const result = getTwitterUserDetails(getTwitterResponse, dummyLogger)(arbitraryUserId());
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
    const result = getTwitterUserDetails(getTwitterResponse, dummyLogger)(arbitraryUserId());

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
    const result = getTwitterUserDetails(getTwitterResponse, dummyLogger)(arbitraryUserId());

    expect(await result()).toStrictEqual(E.left('not-found'));
  });

  it('returns unavailable if the Twitter API is unavailable', async () => {
    const getTwitterResponse: GetTwitterResponse = async () => {
      throw new Error('Twitter API Unavailable');
    };
    const result = getTwitterUserDetails(getTwitterResponse, dummyLogger)(arbitraryUserId());

    expect(await result()).toStrictEqual(E.left('unavailable'));
  });
});
