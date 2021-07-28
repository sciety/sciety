/* eslint-disable jest/lowercase-name */
import { DomainEvent } from '../../src/types/domain-events';
import { stateManager } from '../../src/user-list/state-manager';

describe('state-manager', () => {
  it('Bob has not saved any articles: false', () => {
    const events: ReadonlyArray<DomainEvent> = [];
    const articleInList = stateManager(events);

    expect(articleInList).toBe(false);
  });

  it.todo('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1: false');

  it.todo('UserSavedArticle Bob, 1: true');

  it.todo('UserSavedArticle Bob, 1; ArticleRemovedFromUserList Bob, 1; UserSavedArticle Bob, 1: true');

  it.todo('Alice saved article 1 but Bob has not: false');

  it.todo('Bob has saved article 2: false');
});
