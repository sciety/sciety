import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { followSomething, noEvaluationsYet } from '../../../src/home-page/your-feed/render-feed';
import { yourFeed } from '../../../src/home-page/your-feed/your-feed';
import { userFollowedEditorialCommunity } from '../../../src/types/domain-events';
import { GroupId } from '../../../src/types/group-id';
import { toUserId } from '../../../src/types/user-id';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('followed-groups-activities-acceptance', () => {
  describe('following groups that have no evaluations', () => {
    it('displays the calls to action to follow other groups or return later', async () => {
      const userId = toUserId('alice');
      const adapters = {
        fetchArticle: shouldNotBeCalled,
        getGroup: shouldNotBeCalled,
        getAllEvents: T.of([userFollowedEditorialCommunity(userId, new GroupId('NCRC'))]),
        follows: () => T.of(true),
      };

      const html = await yourFeed(adapters)(O.some(userId))();

      expect(html).toContain(noEvaluationsYet);
    });
  });

  // Your feed is empty! Start following some groups to see their most recent evaluations right here.
  describe('not following any groups', () => {
    it('displays call to action to follow groups', async () => {
      const userId = toUserId('alice');
      const adapters = {
        fetchArticle: shouldNotBeCalled,
        getGroup: shouldNotBeCalled,
        getAllEvents: T.of([]),
        follows: () => T.of(false),
      };
      const html = await yourFeed(adapters)(O.some(userId))();

      expect(html).toContain(followSomething);
    });
  });

  describe('following groups with evaluations', () => {
    it.todo('display a maximum of 20 articles');

    it.todo('displays the articles in order of latest activity in descending order');

    it.todo('latest activity is based off of activity by any group');

    it.todo('displayed articles have to have been evaluated by a followed group');

    it.todo('each article is only displayed once');

    describe('when details of an article cannot be fetched', () => {
      it.todo('display the other 19 articles only');
    });

    describe('when details of all articles cannot be fetched', () => {
      it.todo('display only an error message');
    });
  });
});
