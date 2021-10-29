import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { axiosError } from './helpers';
import { GetTwitterResponse } from '../../src/infrastructure/get-twitter-response';
import { getTwitterUserDetails } from '../../src/infrastructure/get-twitter-user-details';
import * as DE from '../../src/types/data-error';
import { dummyLogger } from '../dummy-logger';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryUserId } from '../types/user-id.helper';

describe('get-twitter-user-details', () => {
  it('returns the details for the user', async () => {
    const getTwitterResponse: GetTwitterResponse = () => TE.right({
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

  it.each([
    ['png'],
    ['jpg'],
  ])('returns the bigger version of the avatar url', async (fileFormat) => {
    const getTwitterResponse: GetTwitterResponse = () => TE.right({
      data: {
        name: 'John Smith',
        profile_image_url: `http://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.${fileFormat}`,
        username: 'arbitrary_twitter_handle',
      },
    });

    const result = await pipe(
      arbitraryUserId(),
      getTwitterUserDetails(getTwitterResponse, dummyLogger),
      TE.getOrElse(shouldNotBeCalled),
    )();

    expect(result).toStrictEqual(expect.objectContaining({
      avatarUrl: `http://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_bigger.${fileFormat}`,
    }));
  });

  it('returns notFound if the Twitter user does not exist', async () => {
    const getTwitterResponse: GetTwitterResponse = () => TE.right({
      errors: [
        {
          detail: 'Could not find user with id: [2244994946].',
          title: 'Not Found Error',
          resource_type: 'user',
          parameter: 'id',
          value: '2244994946',
          type: 'https://api.twitter.com/2/problems/resource-notFound',
        },
      ],
    });
    const result = await pipe(
      arbitraryUserId(),
      getTwitterUserDetails(getTwitterResponse, dummyLogger),
      T.map(flow(
        E.matchW(
          identity,
          shouldNotBeCalled,
        ),
        DE.isNotFound,
      )),
    )();

    expect(result).toBe(true);
  });

  it('returns notFound if the Twitter user ID is invalid', async () => {
    const getTwitterResponse: GetTwitterResponse = () => TE.left(axiosError(400));
    const result = await pipe(
      arbitraryUserId(),
      getTwitterUserDetails(getTwitterResponse, dummyLogger),
      T.map(flow(
        E.matchW(
          identity,
          shouldNotBeCalled,
        ),
        DE.isNotFound,
      )),
    )();

    expect(result).toBe(true);
  });

  it('returns unavailable if the Twitter API is unavailable', async () => {
    const getTwitterResponse: GetTwitterResponse = () => TE.left(axiosError(500));
    const result = await pipe(
      arbitraryUserId(),
      getTwitterUserDetails(getTwitterResponse, dummyLogger),
      T.map(flow(
        E.matchW(
          identity,
          shouldNotBeCalled,
        ),
        DE.isUnavailable,
      )),
    )();

    expect(result).toBe(true);
  });
});
