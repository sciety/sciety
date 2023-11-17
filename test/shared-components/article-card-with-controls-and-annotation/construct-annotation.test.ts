import * as O from 'fp-ts/Option';

import { pipe } from 'fp-ts/function';
import * as LOID from '../../../src/types/list-owner-id.js';
import { arbitraryCreateUserAccountCommand } from '../../write-side/commands/create-user-account-command.helper.js';
import { TestFramework, createTestFramework } from '../../framework/index.js';
import {
  constructAnnotation,
} from '../../../src/shared-components/article-card-with-controls-and-annotation/construct-annotation.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryListId } from '../../types/list-id.helper.js';
import { shouldNotBeCalled } from '../../should-not-be-called.js';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper.js';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper.js';
import { unknownAuthor } from '../../../src/shared-components/article-card-with-controls-and-annotation/static-content.js';
import { arbitraryUnsafeUserInput } from '../../types/unsafe-user-input.helper.js';
import { Annotation } from '../../../src/shared-components/article-card-with-controls-and-annotation/article-card-with-controls-and-annotation-view-model.js';
import { rawUserInput } from '../../../src/read-models/annotations/handle-event.js';

describe('construct-annotation', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is no annotation', () => {
    it('returns none', () => {
      const result = constructAnnotation(framework.dependenciesForViews)(arbitraryListId(), arbitraryArticleId());

      expect(result).toStrictEqual(O.none);
    });
  });

  describe('when there is an annotation', () => {
    const articleId = arbitraryArticleId();
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
        await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
        await framework.commandHelpers.createAnnotation({
          annotationContent: content,
          articleId,
          listId: createListCommand.listId,
        });
        result = pipe(
          constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, articleId),
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
        await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
        await framework.commandHelpers.createAnnotation({
          annotationContent: content,
          articleId,
          listId: createListCommand.listId,
        });
        result = pipe(
          constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, articleId),
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
        await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
        await framework.commandHelpers.createAnnotation({
          annotationContent: content,
          articleId,
          listId: createListCommand.listId,
        });
        result = pipe(
          constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, articleId),
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
