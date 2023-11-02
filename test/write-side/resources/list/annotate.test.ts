import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { annotate } from '../../../../src/write-side/resources/list';
import { arbitraryUserGeneratedInput } from '../../../types/user-generated-input.helper';
import { EventOfType, constructEvent } from '../../../../src/domain-events';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryHtmlFragment, arbitraryString } from '../../../helpers';
import { arbitraryListOwnerId } from '../../../types/list-owner-id.helper';

const arbitraryListCreatedEvent = (): EventOfType<'ListCreated'> => constructEvent('ListCreated')({
  listId: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  ownerId: arbitraryListOwnerId(),
});

const arbitraryArticleAddedToListEvent = (): EventOfType<'ArticleAddedToList'> => constructEvent('ArticleAddedToList')({
  articleId: arbitraryArticleId(),
  listId: arbitraryListId(),
});

const arbitraryArticleRemovedFromListEvent = (): EventOfType<'ArticleRemovedFromList'> => constructEvent('ArticleRemovedFromList')({
  articleId: arbitraryArticleId(),
  listId: arbitraryListId(),
});

const arbitraryArticleInListAnnotatedEvent = (): EventOfType<'ArticleInListAnnotated'> => constructEvent('ArticleInListAnnotated')({
  articleId: arbitraryArticleId(),
  listId: arbitraryListId(),
  content: arbitraryHtmlFragment(),
});

describe('annotate', () => {
  const articleId = arbitraryArticleId();
  const listId = arbitraryListId();
  const content = arbitraryUserGeneratedInput();
  const annotateArticleInListCommand = {
    content,
    articleId,
    listId,
  };

  describe('when the list exists', () => {
    const listCreatedEvent = {
      ...arbitraryListCreatedEvent(),
      listId,
    };

    describe('and the article is in the list without an annotation', () => {
      const relevantEvents = [
        listCreatedEvent,
        {
          ...arbitraryArticleAddedToListEvent(),
          articleId,
          listId,
        },
      ];
      const result = pipe(
        relevantEvents,
        annotate(annotateArticleInListCommand),
      );

      it('succeeds, raising a relevant event', () => {
        expect(result).toStrictEqual(E.right([expect.objectContaining({
          type: 'ArticleInListAnnotated',
          articleId,
          listId,
          content,
        })]));
      });
    });

    describe('and the article is in the list with an annotation', () => {
      const relevantEvents = [
        listCreatedEvent,
        {
          ...arbitraryArticleAddedToListEvent(),
          articleId,
          listId,
        },
        {
          ...arbitraryArticleInListAnnotatedEvent(),
          articleId,
          listId,
        },
      ];
      const result = pipe(
        relevantEvents,
        annotate(annotateArticleInListCommand),
      );

      it('succeeds, without raising any event', () => {
        expect(result).toStrictEqual(E.right([]));
      });
    });

    describe('and the article is not in the list', () => {
      const result = pipe(
        [
          listCreatedEvent,
        ],
        annotate(annotateArticleInListCommand),
      );

      it('fails', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });

    describe('and the article has been added to the list and then removed', () => {
      const result = pipe(
        [
          listCreatedEvent,
          {
            ...arbitraryArticleAddedToListEvent(),
            articleId,
            listId,
          },
          {
            ...arbitraryArticleRemovedFromListEvent(),
            articleId,
            listId,
          },
        ],
        annotate(annotateArticleInListCommand),
      );

      it('fails', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });

  describe('when the list does not exist', () => {
    it.todo('fails');
  });
});
