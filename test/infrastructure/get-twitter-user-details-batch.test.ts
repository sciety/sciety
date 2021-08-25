import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getTwitterUserDetailsBatch } from '../../src/infrastructure/get-twitter-user-details-batch';
import * as DE from '../../src/types/data-error';
import { toUserId } from '../../src/types/user-id';
import { arbitraryUri, arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryUserId } from '../types/user-id.helper';

describe('get-twitter-user-details-batch', () => {
  describe('when given no user ids', () => {
    it('does not call Twitter and returns an empty array', async () => {
      const getTwitterResponseMock = jest.fn();
      const result = await pipe(
        [],
        getTwitterUserDetailsBatch(getTwitterResponseMock),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(getTwitterResponseMock).not.toHaveBeenCalled();
      expect(result).toStrictEqual([]);
    });
  });

  describe('when given one or more user ids', () => {
    it('returns details for each user id in the same order', async () => {
      const handle1 = arbitraryWord();
      const handle2 = arbitraryWord();
      const userId1 = arbitraryUserId();
      const userId2 = arbitraryUserId();
      const displayName1 = arbitraryWord();
      const displayName2 = arbitraryWord();
      const avatarUrl1 = arbitraryUri();
      const avatarUrl2 = arbitraryUri();
      const getTwitterResponse = async () => (
        {
          data: [
            {
              id: userId1,
              username: handle1,
              name: displayName1,
              profile_image_url: avatarUrl1,
            },
            {
              id: userId2,
              username: handle2,
              name: displayName2,
              profile_image_url: avatarUrl2,
            },
          ],
        }
      );

      const [result1, result2] = await pipe(
        [userId1, userId2],
        getTwitterUserDetailsBatch(getTwitterResponse),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result1).toStrictEqual({
        handle: handle1,
        displayName: displayName1,
        avatarUrl: avatarUrl1,
      });
      expect(result2).toStrictEqual({
        handle: handle2,
        displayName: displayName2,
        avatarUrl: avatarUrl2,
      });
    });

    it('asks Twitter for the user\'s avatarUrl', async () => {
      const getTwitterResponseMock = jest.fn();
      await pipe(
        [arbitraryUserId(), arbitraryUserId()],
        getTwitterUserDetailsBatch(getTwitterResponseMock),
      )();

      expect(getTwitterResponseMock).toHaveBeenCalledWith(expect.stringContaining('user.fields=profile_image_url'));
    });

    it('asks Twitter for the user ids', async () => {
      const getTwitterResponseMock = jest.fn();
      const userId1 = arbitraryUserId();
      const userId2 = arbitraryUserId();

      await pipe(
        [userId1, userId2],
        getTwitterUserDetailsBatch(getTwitterResponseMock),
      )();

      expect(getTwitterResponseMock).toHaveBeenCalledWith(expect.stringContaining(`ids=${userId1},${userId2}`));
    });
  });

  describe('if no ids match existing Twitter users', () => {
    it('returns notFound', async () => {
      const getTwitterResponse = async () => (
        {
          data: [
            {
              id: '987655',
              name: arbitraryWord(),
              username: arbitraryWord(),
              profile_image_url: arbitraryUri(),
            },
          ],
          errors: [
            {
              value: '1234556',
              detail: 'Could not find user with ids: [1234556].',
              title: 'Not Found Error',
              resource_type: 'user',
              parameter: 'ids',
              resource_id: '1234556',
              type: 'https://api.twitter.com/2/problems/resource-not-found',
            },
          ],
        }
      );

      const result = await pipe(
        [toUserId('987655'), toUserId('1234556')],
        getTwitterUserDetailsBatch(getTwitterResponse),
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('if not all ids match Twitter user IDs', () => {
    it('returns notFound', async () => {
      const getTwitterResponse = async () => (
        {
          errors: [
            {
              value: '1234556',
              detail: 'Could not find user with ids: [1234556].',
              title: 'Not Found Error',
              resource_type: 'user',
              parameter: 'ids',
              resource_id: '1234556',
              type: 'https://api.twitter.com/2/problems/resource-not-found',
            },
          ],
        }

      );

      const result = await pipe(
        [toUserId('1234556')],
        getTwitterUserDetailsBatch(getTwitterResponse),
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('if at least one Twitter user ID is invalid', () => {
    /*
    400
    {
  "errors": [
    {
      "parameters": {
        "ids": [
          "47998559,foo"
        ]
      },
      "message": "The `ids` query parameter value [foo] does not match ^[0-9]{1,19}$"
    }
  ],
  "title": "Invalid Request",
  "detail": "One or more parameters to your request was invalid.",
  "type": "https://api.twitter.com/2/problems/invalid-request"
}
    */
    it.skip('returns notFound', async () => {
      const getTwitterResponse = jest.fn().mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 400,
        },
      });

      const result = await pipe(
        [toUserId('47998559'), toUserId('foo')],
        getTwitterUserDetailsBatch(getTwitterResponse),
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('if the Twitter API is unavailable', () => {
    it.todo('returns unavailable');
  });

  describe('if we cannot understand the Twitter response', () => {
    it.todo('returns unavailable');
  });

  describe('if we cannot generate userDetails for each user ID', () => {
    it.todo('returns unavailable');
  });
});
