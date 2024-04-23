import { EventOfType, constructEvent } from '../../src/domain-events';
import { arbitraryString } from '../helpers';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
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

export const arbitraryListPromotionCretedEvent = (): EventOfType<'ListPromotionCreated'> => constructEvent('ListPromotionCreated')({
  featuredFor: arbitraryGroupId(),
  listId: arbitraryListId(),
});
