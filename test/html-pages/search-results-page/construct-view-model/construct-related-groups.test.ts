import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ArticlesCategoryViewModel, SomeRelatedGroups } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryDoi } from '../../../types/doi.helper';
import { Doi } from '../../../../src/types/doi';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../write-side/commands/record-evaluation-publication-command.helper';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';
import { constructRelatedGroups } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-related-groups';

const isSomeRelatedGroups = (value: ArticlesCategoryViewModel['relatedGroups']): value is SomeRelatedGroups => value.tag === 'some-related-groups';

const ensureThereAreSomeRelatedGroups = (value: ArticlesCategoryViewModel['relatedGroups']): SomeRelatedGroups => pipe(
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

  const findNamesOfRelatedGroups = async (articleIds: ReadonlyArray<Doi>) => pipe(
    articleIds,
    constructRelatedGroups(defaultDependencies),
    ensureThereAreSomeRelatedGroups,
    (someRelatedGroups) => someRelatedGroups.items,
    RA.map((item) => item.groupName),
  );

  describe('and there is a page of results, containing an evaluated article, evaluated once by two different groups', () => {
    const articleId = arbitraryDoi();
    let groupNames: ReadonlyArray<string>;
    const addGroup1Command = arbitraryAddGroupCommand();
    const addGroup2Command = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1Command);
      await framework.commandHelpers.addGroup(addGroup2Command);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroup1Command.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroup2Command.groupId,
      });
      groupNames = await findNamesOfRelatedGroups([articleId]);
    });

    it('displays the evaluating groups as being related', () => {
      expect(groupNames).toStrictEqual([addGroup1Command.name, addGroup2Command.name]);
    });
  });

  describe('and there is a page of results, containing two evaluated articles, each evaluated once by the same group', () => {
    const articleId1 = arbitraryDoi();
    const articleId2 = arbitraryDoi();
    let groupNames: ReadonlyArray<string>;
    const addGroup1Command = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1Command);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: articleId1,
        groupId: addGroup1Command.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId: articleId2,
        groupId: addGroup1Command.groupId,
      });
      groupNames = await findNamesOfRelatedGroups([articleId1, articleId2]);
    });

    it('displays the evaluating group once as being related', () => {
      expect(groupNames).toStrictEqual([addGroup1Command.name]);
    });
  });

  describe('and there is a page of results, containing an evaluated article, evaluated twice by the same group', () => {
    const articleId = arbitraryDoi();
    let groupNames: ReadonlyArray<string>;
    const addGroup1Command = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroup1Command);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroup1Command.groupId,
      });
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        articleId,
        groupId: addGroup1Command.groupId,
      });
      groupNames = await findNamesOfRelatedGroups([articleId]);
    });

    it('displays the evaluating group once as being related', () => {
      expect(groupNames).toStrictEqual([addGroup1Command.name]);
    });
  });

  describe('and there are results, with no evaluated articles', () => {
    const articleId = arbitraryDoi();
    let relatedGroups: ArticlesCategoryViewModel['relatedGroups'];

    beforeEach(() => {
      relatedGroups = constructRelatedGroups(defaultDependencies)([articleId]);
    });

    it('no related groups are displayed', () => {
      expect(relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
    });
  });

  describe('and there are no results', () => {
    let relatedGroups: ArticlesCategoryViewModel['relatedGroups'];

    beforeEach(async () => {
      relatedGroups = constructRelatedGroups(defaultDependencies)([]);
    });

    it('no related groups are displayed', () => {
      expect(relatedGroups.tag).toBe('no-groups-evaluated-the-found-articles');
    });
  });
});
