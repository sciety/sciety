import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constructViewModel } from '../../../src/html-pages/user-page/construct-view-model/construct-view-model';
import * as LOID from '../../../src/types/list-owner-id';
import { CandidateUserHandle } from '../../../src/types/candidate-user-handle';
import { CommandHelpers, createCommandHelpers } from '../../framework/create-command-helpers';
import { ReadAndWriteSides, createReadAndWriteSides } from '../../framework/create-read-and-write-sides';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryList } from '../../types/list-helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';

describe('user-page', () => {
  let commandHandlers: ReadAndWriteSides['commandHandlers'];
  let getAllEvents: ReadAndWriteSides['getAllEvents'];
  let queries: ReadAndWriteSides['queries'];
  let commandHelpers: CommandHelpers;

  beforeEach(() => {
    ({ queries, getAllEvents, commandHandlers } = createReadAndWriteSides());
    commandHelpers = createCommandHelpers(commandHandlers);
  });

  describe('when the user has multiple lists', () => {
    const user = arbitraryUserDetails();
    const list = {
      ...arbitraryList(),
      ownerId: LOID.fromUserId(user.id),
    };

    it('the list count is correct', async () => {
      await commandHelpers.createUserAccount(user);
      await commandHelpers.createList(list);
      const viewmodel = await pipe(
        {
          handle: user.handle as string as CandidateUserHandle,
          user: O.none,
        },
        constructViewModel('lists', { ...queries, getAllEvents }),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewmodel.listCount).toBe(2);
    });
  });
});
