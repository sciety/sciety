import { pipe } from 'fp-ts/function';
import { executeCreateAnnotationCommand } from '../../src/annotations/execute-create-annotation-command';
import { annotationCreated } from '../../src/domain-events/annotation-created-event';
import { arbitraryHtmlFragment } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';

describe('execute-create-annotation-command', () => {
  describe('given the target does not have an annotation, when the command is executed', () => {
    const target = {
      articleId: arbitraryArticleId(),
      listId: arbitraryListId(),
    };
    const content = arbitraryHtmlFragment();
    const command = {
      content,
      target,
    };
    const result = pipe(
      [],
      executeCreateAnnotationCommand(command),
    );

    it.skip('returns an AnnotationCreated event', () => {
      expect(result).toStrictEqual(annotationCreated(target, content));
    });
  });

  describe('given the target already has an annotation, when the command is executed', () => {
    it.todo('returns no events');
  });
});
