import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { TestFramework, createTestFramework } from '../../../framework';
import * as LOID from '../../../../src/types/list-owner-id';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { constructViewModel, Ports } from '../../../../src/html-pages/user-page/construct-view-model';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { CandidateUserHandle } from '../../../../src/types/candidate-user-handle';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the user owns two lists', () => {
    const user = arbitraryUserDetails();
    const secondList = arbitraryList(LOID.fromUserId(user.id));

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
      await framework.commandHelpers.createList(secondList);
    });

    it('the list count is 2', async () => {
      const adapters: Ports = {
        ...framework.queries,
        getAllEvents: framework.getAllEvents,
      };
      const viewmodel = await pipe(
        {
          handle: user.handle as string as CandidateUserHandle,
          user: O.some(user),
        },
        constructViewModel('lists', adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewmodel.listCount).toBe(2);
    });
  });

  describe('when the user saves an article to the default list for the first time', () => {
    it.todo('the article count of the default list is 1');
  });
});
