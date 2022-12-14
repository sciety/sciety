import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { headers } from '../../../src/html-pages/generic-list-page/headers';
import * as DE from '../../../src/types/data-error';
import { UserId } from '../../../src/types/user-id';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryList } from '../../types/list-helper';

describe('headers', () => {
  describe('when the logged in user owns the list', () => {
    it.skip('includes editing capability', async () => {
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
      const list = arbitraryList();
      const viewModel = await pipe(
        list,
        headers(ports),
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
