import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { headers } from '../../../src/html-pages/generic-list-page/headers';
import * as LOID from '../../../src/types/list-owner-id';
import { UserId } from '../../../src/types/user-id';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryList } from '../../types/list-helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('headers', () => {
  describe('when the logged in user owns the list', () => {
    it('includes editing capability', async () => {
      const loggedInUserId = arbitraryUserId();
      const ports = {
        getAllEvents: T.of([]),
        getGroup: shouldNotBeCalled,
        getUserDetails: (userId: UserId) => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
          userId,
        }),
      };
      const list = {
        ...arbitraryList(),
        ownerId: LOID.fromUserId(loggedInUserId),
      };
      const viewModel = await pipe(
        headers(ports)(list, O.some(loggedInUserId)),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewModel.editCapability).toBe(true);
    });
  });

  describe('when the logged in user does not own the list', () => {
    it('does not include editing capability', async () => {
      const loggedInUserId = arbitraryUserId();
      const ports = {
        getAllEvents: T.of([]),
        getGroup: shouldNotBeCalled,
        getUserDetails: (userId: UserId) => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
          userId,
        }),
      };
      const list = {
        ...arbitraryList(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      const viewModel = await pipe(
        headers(ports)(list, O.some(loggedInUserId)),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewModel.editCapability).toBe(false);
    });
  });

  describe('when there is no logged in user', () => {
    it('does not include editing capability', async () => {
      const ports = {
        getAllEvents: T.of([]),
        getGroup: shouldNotBeCalled,
        getUserDetails: (userId: UserId) => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
          userId,
        }),
      };
      const list = {
        ...arbitraryList(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      const viewModel = await pipe(
        headers(ports)(list, O.none),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewModel.editCapability).toBe(false);
    });
  });
});
