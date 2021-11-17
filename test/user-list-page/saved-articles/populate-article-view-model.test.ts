import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../../src/types/doi';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { populateArticleViewModel } from '../../../src/user-list-page/saved-articles/populate-article-view-model';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('populate-article-view-model', () => {
  it('returns a correct view model', async () => {
    const latestVersionDate = new Date();
    const latestActivityDate = new Date('2021-01-02');
    const ports = {
      findReviewsForArticleDoi: () => TE.right([
        {
          reviewId: arbitraryReviewId(),
          groupId: arbitraryGroupId(),
          occurredAt: new Date('2021-01-01'),
        },
        {
          reviewId: new Doi('10.1101/222222'),
          groupId: arbitraryGroupId(),
          occurredAt: latestActivityDate,
        },
      ]),
      getLatestArticleVersionDate: () => TO.some(latestVersionDate),
    };

    const article = {
      doi: new Doi('10.1101/222222'),
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
      latestActivityDate: O.some(latestActivityDate),
    }));
  });
});
