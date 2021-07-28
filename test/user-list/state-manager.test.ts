/* eslint-disable jest/lowercase-name */
import { articleRemovedFromUserList, DomainEvent, userSavedArticle } from '../../src/types/domain-events';
import { stateManager } from '../../src/user-list/state-manager';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryUserId } from '../types/user-id.helper';

describe('state-manager', () => {
  it('Bob has not saved any articles: false', () => {
    const events: ReadonlyArray<DomainEvent> = [];
    const articleInList = stateManager(events);

    expect(articleInList).toBe(false);
  });

  it.skip('UserSavedArticle Bob, 1: true', () => {
    const bob = arbitraryUserId();
    const article1 = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, article1),
    ];
    const articleInList = stateManager(events);

    expect(articleInList).toBe(true);
  });

  it.skip('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1: false', () => {
    const bob = arbitraryUserId();
    const article1 = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, article1),
      articleRemovedFromUserList(bob, article1),
    ];
    const articleInList = stateManager(events);

    expect(articleInList).toBe(false);
  });

  it.skip('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1; UserSavedArticle Bob, 1: true', () => {
    const bob = arbitraryUserId();
    const article1 = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(bob, article1),
      articleRemovedFromUserList(bob, article1),
      userSavedArticle(bob, article1),
    ];
    const articleInList = stateManager(events);

    expect(articleInList).toBe(true);
  });

  it.skip('Alice saved article 1 but Bob has not: false', () => {
    const alice = arbitraryUserId();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bob = arbitraryUserId();
    const article1 = arbitraryDoi();
    const events: ReadonlyArray<DomainEvent> = [
      userSavedArticle(alice, article1),
    ];
    const articleInList = stateManager(events);

    expect(articleInList).toBe(true);
  });

  it.todo('Bob has saved article 2: false');
});
