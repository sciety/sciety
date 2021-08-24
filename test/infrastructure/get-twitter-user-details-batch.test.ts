import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getTwitterUserDetailsBatch } from '../../src/infrastructure/get-twitter-user-details-batch';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('get-twitter-user-details-batch', () => {
  describe('when given no user ids', () => {
    it.todo('does not call Twitter');

    it('returns an empty array', async () => {
      const result = await pipe(
        [],
        getTwitterUserDetailsBatch,
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual([]);
    });
  });

  describe('when given one or more user ids', () => {
    it.todo('returns details for each user id');

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
