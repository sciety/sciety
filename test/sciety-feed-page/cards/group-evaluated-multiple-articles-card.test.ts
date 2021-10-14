import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedMultipleArticlesCard } from '../../../src/sciety-feed-page/cards';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import * as DE from '../../../src/types/data-error';
import { arbitraryDate, arbitraryNumber } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';

describe('group-evaluated-multiple-articles-card', () => {
  describe('when the group details are available', () => {
    const group = arbitraryGroup();
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      viewModel = await pipe(
        {
          groupId: arbitraryGroupId(),
          articleCount: arbitraryNumber(2, 10),
          date: arbitraryDate(),
        },
        groupEvaluatedMultipleArticlesCard({
          getGroup: () => TE.right(group),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('adds the group name to the titleText', () => {
      expect(viewModel.titleText).toContain(group.name);
    });

    it('links to the groups evaluated articles list page', () => {
      expect(viewModel.linkUrl).toStrictEqual(`/groups/${group.slug}/evaluated-articles`);
    });
  });

  describe('when the group details are unavailable', () => {
    let result: E.Either<DE.DataError, ScietyFeedCard>;

    beforeEach(async () => {
      result = await pipe(
        {
          groupId: arbitraryGroupId(),
          articleCount: arbitraryNumber(2, 10),
          date: arbitraryDate(),
        },
        groupEvaluatedMultipleArticlesCard({
          getGroup: () => TE.left(DE.notFound),
        }),
      )();
    });

    it('returns unavailable', () => {
      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
