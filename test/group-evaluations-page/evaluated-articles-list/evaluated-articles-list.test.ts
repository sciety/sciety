import { performance } from 'perf_hooks';
import * as T from 'fp-ts/Task';
import { evaluatedArticlesList } from '../../../src/group-evaluations-page/evaluated-articles-list';
import { editorialCommunityReviewedArticle } from '../../../src/types/domain-events';
import { arbitraryDate, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const numberOfEvents = 15000;

const events = (
  [...Array(numberOfEvents)].map(() => editorialCommunityReviewedArticle(
    arbitraryGroupId(),
    arbitraryDoi(),
    arbitraryReviewId(),
    arbitraryDate(),
  ))
);

describe('evaluated-articles-list', () => {
  describe('given a large set of evaluation events', () => {
    it('performs acceptably', async () => {
      const ports = {
        fetchArticle: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
        getAllEvents: T.of(events),
      };
      const group = {
        id: arbitraryGroupId(),
        name: arbitraryWord(),
        avatarPath: arbitraryWord(),
        descriptionPath: arbitraryWord(),
        shortDescription: arbitraryWord(),
      };
      const startTime = performance.now();
      await evaluatedArticlesList(ports)(group, 1)();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(350);
    });
  });
});
