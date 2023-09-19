import * as O from 'fp-ts/Option';

import { pipe } from 'fp-ts/function';
import * as LOID from '../../../src/types/list-owner-id';
import { arbitraryCreateUserAccountCommand } from '../../write-side/commands/create-user-account-command.helper';
import { createTestFramework } from '../../framework';
import {
  constructAnnotation,
} from '../../../src/shared-components/article-card-with-controls-and-annotation/construct-annotation';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper';
import { arbitraryHtmlFragment } from '../../helpers';
import { HtmlFragment } from '../../../src/types/html-fragment';

describe('construct-annotation', () => {
  describe('when there is no annotation', () => {
    it('returns none', () => {
      const framework = createTestFramework();
      const result = constructAnnotation(framework.dependenciesForViews)(arbitraryListId(), arbitraryArticleId());

      expect(result).toStrictEqual(O.none);
    });
  });

  describe('when there is an annotation', () => {
    const framework = createTestFramework();
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();
    const createListCommand = {
      ...arbitraryCreateListCommand(),
      ownerId: LOID.fromUserId(createUserAccountCommand.userId),
    };
    const articleId = arbitraryArticleId();
    const content = arbitraryHtmlFragment();
    let result: {
      author: string,
      content: HtmlFragment,
    };

    beforeAll(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      await framework.commandHelpers.createList(createListCommand);
      await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
      await framework.commandHelpers.createAnnotation({
        content,
        target: { listId: createListCommand.listId, articleId },
      });
      result = pipe(
        constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, articleId),
        O.getOrElseW(shouldNotBeCalled),
      );
    });

    it('returns its content', async () => {
      expect(result.content).toStrictEqual(content);
    });

    it.failing('returns its author', () => {
      expect(result.author).toStrictEqual(createUserAccountCommand.displayName);
    });
  });
});
