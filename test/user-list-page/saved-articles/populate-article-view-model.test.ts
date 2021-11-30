import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, groupCreated } from '../../../src/domain-events';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { populateArticleViewModel } from '../../../src/user-list-page/saved-articles/populate-article-view-model';
import { arbitraryDate } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('populate-article-view-model', () => {
  it('returns a correct view model', async () => {
    const group = arbitraryGroup();
    const articleId = arbitraryDoi();
    const latestVersionDate = new Date();
    const earlierPublicationDate = new Date('1970');
    const laterPublicationDate = new Date('2020');
    const ports = {
      getAllEvents: T.of([
        groupCreated(group),
        evaluationRecorded(group.id, articleId, arbitraryReviewId(), arbitraryDate(), [], earlierPublicationDate),
        evaluationRecorded(group.id, articleId, arbitraryReviewId(), arbitraryDate(), [], laterPublicationDate),
      ]),
      getLatestArticleVersionDate: () => TO.some(latestVersionDate),
    };

    const article = {
      doi: articleId,
      server: 'biorxiv' as const,
      title: pipe('', toHtmlFragment, sanitise),
      authors: O.none,
    };
    const viewModel = await pipe(
      article,
      populateArticleViewModel(ports),
      TE.getOrElseW(() => T.of(shouldNotBeCalled)),
    )();

    expect(viewModel).toStrictEqual(expect.objectContaining({
      evaluationCount: 2,
      latestVersionDate: O.some(latestVersionDate),
      latestActivityDate: O.some(laterPublicationDate),
    }));
  });
});
