import { EventOfType, constructEvent } from '../../src/domain-events';
import { ArticleId } from '../../src/types/article-id';
import { arbitraryString } from '../helpers';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';
import { arbitraryUnsafeUserInput } from '../types/unsafe-user-input.helper';

export const arbitraryListCreatedEvent = (): EventOfType<'ListCreated'> => constructEvent('ListCreated')({
  listId: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  ownerId: arbitraryListOwnerId(),
});

export const arbitraryArticleAddedToListEvent = (): EventOfType<'ArticleAddedToList'> => constructEvent('ArticleAddedToList')({
  articleId: new ArticleId(arbitraryExpressionDoi()),
  listId: arbitraryListId(),
});

export const arbitraryArticleRemovedFromListEvent = (): EventOfType<'ArticleRemovedFromList'> => constructEvent('ArticleRemovedFromList')({
  articleId: new ArticleId(arbitraryExpressionDoi()),
  listId: arbitraryListId(),
});

export const arbitraryArticleInListAnnotatedEvent = (): EventOfType<'ArticleInListAnnotated'> => constructEvent('ArticleInListAnnotated')({
  articleId: new ArticleId(arbitraryExpressionDoi()),
  listId: arbitraryListId(),
  content: arbitraryUnsafeUserInput(),
});
