import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getTwitterUserDetailsBatch } from '../../src/infrastructure/get-twitter-user-details-batch';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryUserId } from '../types/user-id.helper';

describe('get-twitter-user-details-batch', () => {
  describe('when given no user ids', () => {
    it.todo('does not call Twitter');

    it('returns an empty array', async () => {
      const result = await pipe(
        [],
        getTwitterUserDetailsBatch(shouldNotBeCalled),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual([]);
    });
  });

  describe('when given one or more user ids', () => {
    it.skip('returns details for each user id', async () => {
      const handleA = arbitraryWord();
      const handleB = arbitraryWord();
      const getTwitterResponse = async () => (
        {
          data: [
            {
              id: '2244994945',
              username: handleA,
              name: 'Twitter Dev',
            },
            {
              id: '783214',
              username: handleB,
              name: 'Twitter',
            },
          ],
        }
      );

      const result = await pipe(
        [
          arbitraryUserId(),
          arbitraryUserId(),
        ],
        getTwitterUserDetailsBatch(getTwitterResponse),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          handle: handleA,
        }),
        expect.objectContaining({
          handle: handleB,
        }),
      ]));
    });

    it.todo('returns details in the same order as that supplied');

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
