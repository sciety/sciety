import { pipe } from 'fp-ts/function';
import { executeCreateAnnotationCommand } from '../../src/annotations/execute-create-annotation-command';
import { annotationCreated } from '../../src/domain-events/annotation-created-event';
import { arbitraryHtmlFragment } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-create-annotation-command', () => {
  const target = {
    articleId: arbitraryArticleId(),
    listId: arbitraryListId(),
  };
  const content = arbitraryHtmlFragment();
  const command = {
    content,
    target,
  };

  describe('given the target does not have an annotation, when the command is executed', () => {
    const result = pipe(
      [],
      executeCreateAnnotationCommand(command),
    );

    it('returns an AnnotationCreated event that matches the intent of the command', () => {
      expect(result).toStrictEqual([expect.objectContaining({
        target,
        content,
      })]);
    });
  });

  describe('given the target already has an annotation, when the command is executed', () => {
    const result = pipe(
      [
        annotationCreated(target, arbitraryHtmlFragment()),
      ],
      executeCreateAnnotationCommand(command),
    );

    it('returns no events', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
