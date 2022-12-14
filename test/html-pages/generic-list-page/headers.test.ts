import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { headers } from '../../../src/html-pages/generic-list-page/headers';
import * as DE from '../../../src/types/data-error';
import * as LOID from '../../../src/types/list-owner-id';
import { UserId } from '../../../src/types/user-id';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryList } from '../../types/list-helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('headers', () => {
  describe('when the logged in user owns the list', () => {
    it.skip('includes editing capability', async () => {
      const loggedInUserId = arbitraryUserId();
      const ports = {
        getAllEvents: T.of([]),
        getGroup: () => E.left(DE.notFound),
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

      expect(viewModel.editCapability).toStrictEqual(O.some(list.listId));
    });
  });

  describe('when the logged in user does not own the list', () => {
    it.todo('does not include editing capability');
  });

  describe('when there is no logged in user', () => {
    it.todo('does not include editing capability');
  });
});
