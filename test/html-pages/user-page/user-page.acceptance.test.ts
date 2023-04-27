import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { ListOwnerId } from '../../../src/types/list-owner-id';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { Ports, userPage } from '../../../src/html-pages/user-page';
import { arbitraryDate, arbitraryString } from '../../helpers';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryUserDetails } from '../../types/user-details.helper';
import { arbitraryCandidateUserHandle } from '../../types/candidate-user-handle.helper';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

const listId = arbitraryListId();

const defaultAdapters: Ports = {
  getGroup: () => O.some(arbitraryGroup()),
  getAllEvents: T.of([]),
  getFollowers: () => [],
  getGroupsFollowedBy: () => [arbitraryGroupId()],
  lookupUserByHandle: () => O.some(arbitraryUserDetails()),
  selectAllListsOwnedBy: (ownerId: ListOwnerId) => [{
    id: listId,
    ownerId,
    articleIds: [],
    updatedAt: arbitraryDate(),
    name: arbitraryString(),
    description: arbitraryString(),
  }],
};

const defaultParams = { handle: arbitraryCandidateUserHandle(), user: O.none };

describe('user-page', () => {
  describe('lists tab', () => {
    it('shows a card linking to the saved-articles list page', async () => {
      const page = await pipe(
        defaultParams,
        userPage(defaultAdapters)('lists'),
        contentOf,
        T.map(JSDOM.fragment),
      )();
      const link = page.querySelector('.tab-panel a');

      expect(link?.getAttribute('href')).toBe(`/lists/${listId}`);
    });
  });
});
