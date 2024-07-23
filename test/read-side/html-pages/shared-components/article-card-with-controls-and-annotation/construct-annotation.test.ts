import * as O from 'fp-ts/Option';

import { pipe } from 'fp-ts/function';
import { rawUserInput } from '../../../../../src/read-side';
import {
  constructAnnotation,
} from '../../../../../src/read-side/html-pages/shared-components/article-card-with-controls-and-annotation/construct-annotation';
import { unknownAuthor } from '../../../../../src/read-side/html-pages/shared-components/article-card-with-controls-and-annotation/static-content';
import { Annotation } from '../../../../../src/read-side/html-pages/shared-components/article-card-with-controls-and-annotation/view-model';
import { ArticleId } from '../../../../../src/types/article-id';
import * as LOID from '../../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../../types/list-id.helper';
import { arbitraryUnsafeUserInput } from '../../../../types/unsafe-user-input.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

describe('construct-annotation', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is no annotation', () => {
    it('returns none', () => {
      const result = constructAnnotation(framework.dependenciesForViews)(arbitraryListId(), arbitraryExpressionDoi());

      expect(result).toStrictEqual(O.none);
    });
  });

  describe('when there is an annotation', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const content = arbitraryUnsafeUserInput();
    let result: Annotation;

    describe('on a list owned by a user', () => {
      const createUserAccountCommand = arbitraryCreateUserAccountCommand();
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(createUserAccountCommand.userId),
      };

      beforeEach(async () => {
        await framework.commandHelpers.createUserAccount(createUserAccountCommand);
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList({ expressionDoi, listId: createListCommand.listId });
        await framework.commandHelpers.createAnnotation({
          annotationContent: content,
          articleId: new ArticleId(expressionDoi),
          listId: createListCommand.listId,
        });
        result = pipe(
          constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, expressionDoi),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('returns its content', async () => {
        expect(result.content).toStrictEqual(rawUserInput(content));
      });

      it('returns its author', () => {
        expect(result.author).toStrictEqual(createUserAccountCommand.displayName);
      });
    });

    describe('on a list owned by a group', () => {
      const addGroupCommand = arbitraryAddGroupCommand();
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromGroupId(addGroupCommand.groupId),
      };

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroupCommand);
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList({ expressionDoi, listId: createListCommand.listId });
        await framework.commandHelpers.createAnnotation({
          annotationContent: content,
          articleId: new ArticleId(expressionDoi),
          listId: createListCommand.listId,
        });
        result = pipe(
          constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, expressionDoi),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('returns its content', () => {
        expect(result.content).toStrictEqual(rawUserInput(content));
      });

      it('returns the group name as the author', () => {
        expect(result.author).toStrictEqual(addGroupCommand.name);
      });
    });

    describe('but the list owner information is not available', () => {
      const createListCommand = arbitraryCreateListCommand();

      beforeEach(async () => {
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList({ expressionDoi, listId: createListCommand.listId });
        await framework.commandHelpers.createAnnotation({
          annotationContent: content,
          articleId: new ArticleId(expressionDoi),
          listId: createListCommand.listId,
        });
        result = pipe(
          constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, expressionDoi),
          O.getOrElseW(shouldNotBeCalled),
        );
      });

      it('returns its content', () => {
        expect(result.content).toStrictEqual(rawUserInput(content));
      });

      it('returns a static value as the author', () => {
        expect(result.author).toBe(unknownAuthor);
      });
    });
  });
});
