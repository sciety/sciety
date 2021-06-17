import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { Page } from '../../../src/types/page';
import { RenderPageError } from '../../../src/types/render-page-error';
import { followedGroupsPage } from '../../../src/user-page/followed-groups-page/followed-groups-page';
import { arbitraryString, arbitraryUri, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryUserId } from '../../types/user-id.helper';

const contentOf = (page: TE.TaskEither<RenderPageError, Page>) => pipe(
  page,
  TE.match(
    (errorPage) => errorPage.message,
    (p) => p.content,
  ),
);

describe('followed-groups-page', () => {
  it('shows groups as the active tab', async () => {
    const ports = {
      follows: shouldNotBeCalled,
      getGroup: shouldNotBeCalled,
      getUserDetails: () => TE.right({
        avatarUrl: arbitraryUri(),
        displayName: arbitraryString(),
        handle: arbitraryWord(),
      }),
      getAllEvents: T.of([]),
    };
    const params = { id: arbitraryUserId(), user: O.none };
    const page = await pipe(
      params,
      followedGroupsPage(ports),
      contentOf,
      T.map(JSDOM.fragment),
    )();
    const tabHeading = page.querySelector('.user-page-tab--heading')?.innerHTML;

    expect(tabHeading).toContain('Followed groups');
  });

  it.todo('shows the articles tab as the inactive tab');
});
