import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import { groupEvaluatedArticleCard } from '../../../src/sciety-feed-page/cards';
import * as DE from '../../../src/types/data-error';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('group-evaluated-article-card', () => {
  describe('when the article details cannot be fetched', () => {
    const fetchArticle = () => TE.left(DE.unavailable);
    const createCard = pipe(
      groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticleCard(
        () => TO.some(arbitraryGroup()),
        fetchArticle,
      ),
    );

    it('returns a Right', async () => {
      const viewModel = await createCard();

      expect(E.isRight(viewModel)).toBe(true);
    });

    it('contains no card details', async () => {
      const viewModel = pipe(
        await createCard(),
        E.getOrElseW(shouldNotBeCalled),
      );

      expect(viewModel.details).toBeUndefined();
    });
  });
});
