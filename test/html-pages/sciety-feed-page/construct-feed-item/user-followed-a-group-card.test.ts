import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { userFollowedAGroupCard } from '../../../../src/html-pages/sciety-feed-page/construct-view-model/user-followed-a-group-card';
import { arbitraryDate } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { TestFramework, createTestFramework } from '../../../framework';
import { ScietyFeedCard } from '../../../../src/html-pages/sciety-feed-page/view-model';
import { constructEvent } from '../../../../src/domain-events';
import { Dependencies } from '../../../../src/html-pages/sciety-feed-page/construct-view-model';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';
import { rawUserInput } from '../../../../src/read-side';

describe('user-followed-a-group-card', () => {
  const createUserAccountCommand = arbitraryCreateUserAccountCommand();
  const date = arbitraryDate();
  const addGroupCommand = arbitraryAddGroupCommand();
  const event = constructEvent('UserFollowedEditorialCommunity')({
    userId: createUserAccountCommand.userId,
    editorialCommunityId: addGroupCommand.groupId,
    date,
  });
  let framework: TestFramework;
  let dependencies: Dependencies;

  beforeEach(async () => {
    framework = createTestFramework();
    dependencies = {
      ...framework.dependenciesForViews,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('happy path', () => {
    let viewModel: ScietyFeedCard;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      viewModel = pipe(
        event,
        userFollowedAGroupCard(dependencies),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('displays the user\'s avatar', async () => {
      expect(viewModel.avatarUrl).toContain(createUserAccountCommand.handle);
    });

    it('displays the user\'s handle in the title', async () => {
      expect(viewModel.titleText).toContain(createUserAccountCommand.handle);
    });

    it('displays the date of the event', async () => {
      expect(viewModel.date).toStrictEqual(date);
    });

    it('links to the group page', async () => {
      expect(viewModel.feedItemHref).toBe(`/groups/${addGroupCommand.slug}`);
    });

    it('includes the group\'s name in the details title', () => {
      expect(viewModel.details?.title).toContain(addGroupCommand.name);
    });

    it('includes the group\'s short description in the details content', () => {
      expect(viewModel.details?.content).toStrictEqual(rawUserInput(addGroupCommand.shortDescription));
    });
  });

  describe('when the group cannot be found', () => {
    let viewModel: O.Option<ScietyFeedCard>;

    beforeEach(() => {
      viewModel = pipe(
        event,
        userFollowedAGroupCard(dependencies),
      );
    });

    it('fails the card', async () => {
      expect(viewModel).toStrictEqual(O.none);
    });
  });
});
