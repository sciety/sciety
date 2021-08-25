import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getTwitterUserDetailsBatch } from '../../src/infrastructure/get-twitter-user-details-batch';
import { arbitraryWord } from '../helpers';
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
      const name1 = arbitraryWord();
      const name2 = arbitraryWord();
      const getTwitterResponse = async () => (
        {
          data: [
            {
              id: userId1,
              username: handle1,
              name: name1,
            },
            {
              id: userId2,
              username: handle2,
              name: name2,
            },
          ],
        }
      );

      const [result1, result2] = await pipe(
        [userId1, userId2],
        getTwitterUserDetailsBatch(getTwitterResponse),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result1).toStrictEqual(expect.objectContaining({ handle: handle1, displayName: name1 }));
      expect(result2).toStrictEqual(expect.objectContaining({ handle: handle2, displayName: name2 }));
    });

    it.todo('asks Twitter for the user\'s avatarUrl, displayName, and handle');
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
