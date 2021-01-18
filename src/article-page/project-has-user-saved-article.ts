import Doi from '../types/doi';
import { DomainEvent, isUserSavedArticleEvent } from '../types/domain-events';
import { UserId } from '../types/user-id';

type ProjectHasUserSavedArticle = (doi: Doi, userId: UserId) => (getEvents: ReadonlyArray<DomainEvent>) => boolean;

export const projectHasUserSavedArticle: ProjectHasUserSavedArticle = (doi, userId) => (events) => (
  events
    .filter(isUserSavedArticleEvent)
    .filter((event) => event.userId === userId)
    .map((event) => event.articleId.value)
    .includes(doi.value)
);
