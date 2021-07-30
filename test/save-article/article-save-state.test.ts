/* eslint-disable jest/lowercase-name */
import { articleSaveState } from '../../src/save-article/article-save-state';
import { DomainEvent, userSavedArticle, userUnsavedArticle } from '../../src/types/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('article-save-state', () => {
  it('Bob has not saved any articles: false', () => {
    const events: ReadonlyArray<DomainEvent> = [];
    const articleInList = articleSaveState(events, arbitraryUserId(), arbitraryDoi());

    expect(articleInList).toBe('not-saved');
  });

  it('UserSavedArticle Bob, 1: saved', () => {
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId),
    ];
    const articleInList = articleSaveState(events, bob, articleId);

    expect(articleInList).toBe('saved');
  });

  it('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1: not-saved', () => {
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId),
      userUnsavedArticle(bob, articleId),
    ];
    const articleInList = articleSaveState(events, bob, articleId);

    expect(articleInList).toBe('not-saved');
  });

  it('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1; UserSavedArticle Bob, 1: saved', () => {
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId),
      userUnsavedArticle(bob, articleId),
      userSavedArticle(bob, articleId),
    ];
    const articleInList = articleSaveState(events, bob, articleId);

    expect(articleInList).toBe('saved');
  });

  it('Alice saved article 1 but Bob has not: not-saved', () => {
    const alice = arbitraryUserId();
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(alice, articleId),
    ];
    const articleInList = articleSaveState(events, bob, articleId);

    expect(articleInList).toBe('not-saved');
  });

  it('Bob has saved article 2: not-saved', () => {
    const bob = arbitraryUserId();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const articleId1 = arbitraryDoi();
    const articleId2 = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId2),
    ];
    const articleInList = articleSaveState(events, bob, articleId1);

    expect(articleInList).toBe('not-saved');
  });
});
