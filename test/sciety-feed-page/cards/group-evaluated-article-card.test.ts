import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, groupCreated } from '../../../src/domain-events';
import { groupEvaluatedArticleCard } from '../../../src/sciety-feed-page/cards';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import * as DE from '../../../src/types/data-error';
import { arbitraryHtmlFragment } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const group = arbitraryGroup();

describe('group-evaluated-article-card', () => {
  describe('when the article can be fetched', () => {
    const article = {
      doi: arbitraryDoi(),
      title: arbitraryHtmlFragment(),
      authors: O.none,
    };
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      const fetchArticle = () => TE.right(article);
      const createCard = pipe(
        evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticleCard({
          getAllEvents: T.of([groupCreated(group)]),
          fetchArticle,
        }),
        TE.getOrElse(shouldNotBeCalled),
      );
      viewModel = await createCard();
    });

    it('adds the group name to the titleText', async () => {
      expect(viewModel.titleText).toContain(group.name);
    });

    it('adds the article title to the card details', async () => {
      expect(viewModel.details?.title).toStrictEqual(article.title);
    });
  });

  describe('when the article cannot be fetched', () => {
    const fetchArticle = () => TE.left(DE.unavailable);
    const createCard = pipe(
      evaluationRecorded(group.id, arbitraryDoi(), arbitraryReviewId()),
      groupEvaluatedArticleCard({
        getAllEvents: T.of([groupCreated(group)]),
        fetchArticle,
      }),
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
