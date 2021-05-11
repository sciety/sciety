import { performance } from 'perf_hooks';
import * as T from 'fp-ts/Task';
import { recentActivity } from '../../../src/group-page/recent-activity/recent-activity';
import { arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('recent-activity', () => {
  describe('given a large set of events', () => {
    it('performs acceptably', async () => {
      const ports = {
        fetchArticle: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
        getAllEvents: T.of([]),
      };
      const group = {
        id: arbitraryGroupId(),
        name: arbitraryWord(),
        avatarPath: arbitraryWord(),
        descriptionPath: arbitraryWord(),
        shortDescription: arbitraryWord(),
      };
      const startTime = performance.now();
      await recentActivity(ports)(group)();
      const endTime = performance.now();
      const runtime = endTime - startTime;

      expect(runtime).toBeLessThan(1000);
    });
  });
});
