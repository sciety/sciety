import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { annotate } from '../../../../src/write-side/resources/list';
import { arbitraryUserGeneratedInput } from '../../../types/user-generated-input.helper';
import { EventOfType, constructEvent } from '../../../../src/domain-events';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryString } from '../../../helpers';
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

describe('annotate', () => {
  describe('when the list exists', () => {
    const articleId = arbitraryArticleId();
    const listId = arbitraryListId();
    const content = arbitraryUserGeneratedInput();
    const relevantEvents = [
      {
        ...arbitraryListCreatedEvent(),
        listId,
      },
      {
        ...arbitraryArticleAddedToListEvent(),
        articleId,
        listId,
      },
    ];
    const result = pipe(
      relevantEvents,
      annotate({
        content,
        articleId,
        listId,
      }),
    );

    describe('and the article is in the list', () => {
      it('succeeds, raising a relevant event', () => {
        expect(result).toStrictEqual(E.right([expect.objectContaining({
          type: 'AnnotationCreated',
          target: {
            articleId,
            listId,
          },
          content,
        })]));
      });
    });

    describe('and the article is not in the list', () => {
      it.todo('fails');
    });
  });

  describe('when the list does not exist', () => {
    it.todo('fails');
  });
});
