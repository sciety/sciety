import { arbitraryString } from '../../../helpers';
import { createTestFramework, TestFramework } from '../../../framework';
import { ViewModel } from '../../../../src/html-pages/article-page/view-model';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';
import {
  arbitraryRecordEvaluationPublicationCommand,
} from '../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import {
  constructReviewingGroups,
} from '../../../../src/html-pages/article-page/construct-view-model/construct-reviewing-groups';

describe('construct-reviewing-groups', () => {
  const reviewedArticle = arbitraryArticleId();
  let framework: TestFramework;
  let result: ViewModel['reviewingGroups'];

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when an article has been reviewed by one group once', () => {
    const reviewingGroupName = arbitraryString();
    const addGroupCommand = {
      ...arbitraryAddGroupCommand(),
      name: reviewingGroupName,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroupCommand.groupId,
      });
      result = constructReviewingGroups(framework.dependenciesForViews, reviewedArticle);
    });

    it('returns an array containing the reviewing group\'s name once', () => {
      expect(result).toStrictEqual([reviewingGroupName]);
    });
  });

  describe('when an article has been reviewed by one group twice', () => {
    const reviewingGroupName = arbitraryString();
    const addGroupCommand = {
      ...arbitraryAddGroupCommand(),
      name: reviewingGroupName,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroupCommand.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroupCommand.groupId,
      });
      result = constructReviewingGroups(framework.dependenciesForViews, reviewedArticle);
    });

    it.skip('returns an array containing the reviewing group\'s name once', () => {
      expect(result).toStrictEqual([reviewingGroupName]);
    });
  });

  describe('when an article has been reviewed by more than one group', () => {
    it.todo('returns an array containing all the reviewing groups\' names once');
  });

  describe('when an article has not been reviewed by any groups', () => {
    it.todo('returns an empty array');
  });

  describe('when an article has a curation statement by a group', () => {
    it.todo('the group\'s name is not in the array returned');
  });
});
