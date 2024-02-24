import { EventOfType, constructEvent } from '../../src/domain-events/index.js';
import { arbitraryString } from '../helpers.js';
import { arbitraryArticleId } from '../types/article-id.helper.js';
import { arbitraryListId } from '../types/list-id.helper.js';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper.js';
import { arbitraryUnsafeUserInput } from '../types/unsafe-user-input.helper.js';

export const arbitraryListCreatedEvent = (): EventOfType<'ListCreated'> => constructEvent('ListCreated')({
  listId: arbitraryListId(),
  name: arbitraryString(),
  description: arbitraryString(),
  ownerId: arbitraryListOwnerId(),
});

export const arbitraryArticleAddedToListEvent = (): EventOfType<'ArticleAddedToList'> => constructEvent('ArticleAddedToList')({
  articleId: arbitraryArticleId(),
  listId: arbitraryListId(),
});

export const arbitraryArticleRemovedFromListEvent = (): EventOfType<'ArticleRemovedFromList'> => constructEvent('ArticleRemovedFromList')({
  articleId: arbitraryArticleId(),
  listId: arbitraryListId(),
});

export const arbitraryArticleInListAnnotatedEvent = (): EventOfType<'ArticleInListAnnotated'> => constructEvent('ArticleInListAnnotated')({
  articleId: arbitraryArticleId(),
  listId: arbitraryListId(),
  content: arbitraryUnsafeUserInput(),
});
