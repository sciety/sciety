import * as O from 'fp-ts/Option';

import { pipe } from 'fp-ts/function';
import { createTestFramework } from '../../framework';
import {
  constructAnnotation,
} from '../../../src/shared-components/article-card-with-controls-and-annotation/construct-annotation';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryCreateListCommand } from '../../write-side/commands/create-list-command.helper';
import { arbitraryHtmlFragment } from '../../helpers';

describe('construct-annotation', () => {
  describe('when there is no annotation', () => {
    it('returns none', () => {
      const framework = createTestFramework();
      const result = constructAnnotation(framework.dependenciesForViews)(arbitraryListId(), arbitraryArticleId());

      expect(result).toStrictEqual(O.none);
    });
  });

  describe('when there is an annotation', () => {
    it('returns its content', async () => {
      const framework = createTestFramework();
      const createListCommand = arbitraryCreateListCommand();
      const articleId = arbitraryArticleId();
      const content = arbitraryHtmlFragment();
      await framework.commandHelpers.createList(createListCommand);
      await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
      await framework.commandHelpers.createAnnotation({
        content,
        target: { listId: createListCommand.listId, articleId },
      });
      const result = pipe(
        constructAnnotation(framework.dependenciesForViews)(createListCommand.listId, articleId),
        O.getOrElseW(shouldNotBeCalled),
      );

      expect(result.content).toStrictEqual(content);
    });

    it.todo('returns its author');
  });
});
