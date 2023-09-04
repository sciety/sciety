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
import { arbitraryDoi } from '../../../types/doi.helper';

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
        evaluationType: 'review',
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
        evaluationType: 'review',
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroupCommand.groupId,
        evaluationType: 'review',
      });
      result = constructReviewingGroups(framework.dependenciesForViews, reviewedArticle);
    });

    it('returns an array containing the reviewing group\'s name once', () => {
      expect(result).toStrictEqual([reviewingGroupName]);
    });
  });

  describe('when an article has been reviewed by more than one group', () => {
    const reviewingGroup1Name = arbitraryString();
    const reviewingGroup2Name = arbitraryString();
    const addGroup1Command = {
      ...arbitraryAddGroupCommand(),
      name: reviewingGroup1Name,
    };
    const addGroup2Command = {
      ...arbitraryAddGroupCommand(),
      name: reviewingGroup2Name,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1Command);
      await framework.commandHelpers.addGroup(addGroup2Command);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroup1Command.groupId,
        evaluationType: 'review',
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroup2Command.groupId,
        evaluationType: 'review',
      });
      result = constructReviewingGroups(framework.dependenciesForViews, reviewedArticle);
    });

    it('returns an array containing all the reviewing groups\' names once', () => {
      expect(new Set(result)).toStrictEqual(new Set([reviewingGroup1Name, reviewingGroup2Name]));
    });
  });

  describe('when an article has not been reviewed by any groups', () => {
    beforeEach(async () => {
      result = constructReviewingGroups(framework.dependenciesForViews, arbitraryDoi());
    });

    it('returns an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when an article has a curation statement by a group', () => {
    const addGroupCommand = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: reviewedArticle,
        groupId: addGroupCommand.groupId,
        evaluationType: 'curation-statement',
      });
      result = constructReviewingGroups(framework.dependenciesForViews, reviewedArticle);
    });

    it('the group\'s name is not in the array returned', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
