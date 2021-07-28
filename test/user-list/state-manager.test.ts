/* eslint-disable jest/lowercase-name */
import { articleRemovedFromUserList, DomainEvent, userSavedArticle } from '../../src/types/domain-events';
import { stateManager } from '../../src/user-list/state-manager';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('state-manager', () => {
  it('Bob has not saved any articles: false', () => {
    const events: ReadonlyArray<DomainEvent> = [];
    const articleInList = stateManager(events, arbitraryUserId(), arbitraryDoi());

    expect(articleInList).toBe('not-saved');
  });

  it('UserSavedArticle Bob, 1: saved', () => {
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId),
    ];
    const articleInList = stateManager(events, bob, articleId);

    expect(articleInList).toBe('saved');
  });

  it('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1: not-saved', () => {
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId),
      articleRemovedFromUserList(bob, articleId),
    ];
    const articleInList = stateManager(events, bob, articleId);

    expect(articleInList).toBe('not-saved');
  });

  it('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1; UserSavedArticle Bob, 1: saved', () => {
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, articleId),
      articleRemovedFromUserList(bob, articleId),
      userSavedArticle(bob, articleId),
    ];
    const articleInList = stateManager(events, bob, articleId);

    expect(articleInList).toBe('saved');
  });

  it('Alice saved article 1 but Bob has not: not-saved', () => {
    const alice = arbitraryUserId();
    const bob = arbitraryUserId();
    const articleId = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(alice, articleId),
    ];
    const articleInList = stateManager(events, bob, articleId);

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
    const articleInList = stateManager(events, bob, articleId1);

    expect(articleInList).toBe('not-saved');
  });
});
