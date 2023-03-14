import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constructViewModel } from '../../../src/html-pages/user-page/construct-view-model/construct-view-model';
import * as LOID from '../../../src/types/list-owner-id';
import { CandidateUserHandle } from '../../../src/types/candidate-user-handle';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryList } from '../../types/list-helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { createTestFramework, TestFramework } from '../../framework';

describe('user-page', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the user has multiple lists', () => {
    const user = arbitraryUserDetails();
    const list = arbitraryList(LOID.fromUserId(user.id));

    it('the list count is correct', async () => {
      await framework.commandHelpers.createUserAccount(user);
      await framework.commandHelpers.createList(list);
      const viewmodel = await pipe(
        {
          handle: user.handle as string as CandidateUserHandle,
          user: O.none,
        },
        constructViewModel('lists', { ...framework.queries, getAllEvents: framework.getAllEvents }),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(viewmodel.listCount).toBe(2);
    });
  });
});
