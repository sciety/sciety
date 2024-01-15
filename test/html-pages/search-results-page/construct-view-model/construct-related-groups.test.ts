import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { SomeRelatedGroups, ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { ArticleId } from '../../../../src/types/article-id';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';
import { constructRelatedGroups } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-related-groups';
import { ExpressionDoi } from '../../../../src/types/expression-doi';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { toExpressionDoi } from '../../../types/article-id.helper';

const isSomeRelatedGroups = (value: ViewModel['relatedGroups']): value is SomeRelatedGroups => value.tag === 'some-related-groups';

const ensureThereAreSomeRelatedGroups = (value: ViewModel['relatedGroups']): SomeRelatedGroups => pipe(
  value,
  O.fromPredicate(isSomeRelatedGroups),
  O.getOrElseW(() => { throw new Error(`${value.tag} is not SomeRelatedGroups`); }),
);

describe('construct-related-groups', () => {
  let framework: TestFramework;
  let defaultDependencies: TestFramework['dependenciesForViews'];

  beforeEach(() => {
    framework = createTestFramework();
    defaultDependencies = framework.dependenciesForViews;
  });

  const findNamesOfRelatedGroups = (expressionDois: ReadonlyArray<ExpressionDoi>) => pipe(
    expressionDois,
    constructRelatedGroups(defaultDependencies),
    ensureThereAreSomeRelatedGroups,
    (someRelatedGroups) => someRelatedGroups.items,
    RA.map((item) => item.groupName),
  );

  describe('when the results consist of one article evaluated once by two different groups', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const articleId = new ArticleId(expressionDoi);
    let groupNames: ReadonlyArray<string>;
    const addGroup1Command = arbitraryAddGroupCommand();
    const addGroup2Command = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1Command);
      await framework.commandHelpers.addGroup(addGroup2Command);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: toExpressionDoi(articleId),
        groupId: addGroup1Command.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: toExpressionDoi(articleId),
        groupId: addGroup2Command.groupId,
      });
      groupNames = findNamesOfRelatedGroups([expressionDoi]);
    });

    it('displays the evaluating groups as being related', () => {
      expect(groupNames).toStrictEqual([addGroup1Command.name, addGroup2Command.name]);
    });
  });

  describe('when the results consist of two articles that have been evaluated once by the same group', () => {
    const expressionDoi1 = arbitraryExpressionDoi();
    const expressionDoi2 = arbitraryExpressionDoi();
    const articleId1 = new ArticleId(expressionDoi1);
    const articleId2 = new ArticleId(expressionDoi2);
    let groupNames: ReadonlyArray<string>;
    const addGroupCommand = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: toExpressionDoi(articleId1),
        groupId: addGroupCommand.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: toExpressionDoi(articleId2),
        groupId: addGroupCommand.groupId,
      });
      groupNames = findNamesOfRelatedGroups([expressionDoi1, expressionDoi2]);
    });

    it('displays the evaluating group once as being related', () => {
      expect(groupNames).toStrictEqual([addGroupCommand.name]);
    });
  });

  describe('when the results consist of an article that has been evaluated twice by the same group', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const articleId = new ArticleId(expressionDoi);
    let groupNames: ReadonlyArray<string>;
    const addGroupCommand = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: toExpressionDoi(articleId),
        groupId: addGroupCommand.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: toExpressionDoi(articleId),
        groupId: addGroupCommand.groupId,
      });
      groupNames = findNamesOfRelatedGroups([expressionDoi]);
    });

    it('displays the evaluating group once as being related', () => {
      expect(groupNames).toStrictEqual([addGroupCommand.name]);
    });
  });

  describe('when there are results, with no evaluated articles', () => {
    const expressionDoi = arbitraryExpressionDoi();
    let relatedGroups: ViewModel['relatedGroups'];

    beforeEach(() => {
      relatedGroups = constructRelatedGroups(defaultDependencies)([expressionDoi]);
    });

    it('no related groups are displayed', () => {
      expect(relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
    });
  });

  describe('when there are no results', () => {
    let relatedGroups: ViewModel['relatedGroups'];

    beforeEach(async () => {
      relatedGroups = constructRelatedGroups(defaultDependencies)([]);
    });

    it('no related groups are displayed', () => {
      expect(relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
    });
  });
});
