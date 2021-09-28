import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedMultipleArticlesCard } from '../../../src/sciety-feed-page/cards';
import { ScietyFeedCard } from '../../../src/sciety-feed-page/cards/sciety-feed-card';
import { arbitraryDate, arbitraryNumber } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryGroup } from '../../types/group.helper';

describe('group-evaluated-multiple-articles-card', () => {
  describe('when the group details are available', () => {
    const group = arbitraryGroup();
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      const createCard = pipe(
        {
          groupId: arbitraryGroupId(),
          articleCount: arbitraryNumber(2, 10),
          date: arbitraryDate(),
        },
        groupEvaluatedMultipleArticlesCard({
          getGroup: () => TO.some(group),
        }),
        TE.getOrElse(shouldNotBeCalled),
      );
      viewModel = await createCard();
    });

    it('adds the group name to the titleText', async () => {
      expect(viewModel.titleText).toContain(group.name);
    });
  });
});
