import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getTwitterUserDetailsBatch } from '../../src/infrastructure/get-twitter-user-details-batch';
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
    it.skip('returns details for each user id in the same order', async () => {
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

  describe('if at least one Twitter user does not exist', () => {
    it.todo('returns notFound');
  });

  describe('if at least one Twitter user ID is invalid', () => {
    it.todo('returns notFound');
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
