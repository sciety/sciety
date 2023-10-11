import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { createAnnotation } from '../../../../src/write-side/resources/list/create-annotation';
import { arbitraryHtmlFragment } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { constructEvent } from '../../../../src/domain-events';
import { CreateAnnotationCommand } from '../../../../src/write-side/commands';
import { arbitraryUserGeneratedInput } from '../../../types/user-generated-input.helper';

describe('create-annotation', () => {
  const articleId = arbitraryArticleId();
  const listId = arbitraryListId();
  const target = {
    articleId,
    listId,
  };
  const content = arbitraryUserGeneratedInput();
  const command: CreateAnnotationCommand = {
    content,
    articleId,
    listId,
  };

  describe('given the target does not have an annotation, when the command is executed', () => {
    const result = pipe(
      [],
      createAnnotation(command),
      E.getOrElseW(shouldNotBeCalled),
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
        constructEvent('AnnotationCreated')({ target, content: arbitraryHtmlFragment() }),
      ],
      createAnnotation(command),
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns no events', () => {
      expect(result).toStrictEqual([]);
    });
  });
});
