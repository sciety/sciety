import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userSavedArticle } from '../../../src/domain-events';
import { userListCard } from '../../../src/user-page/user-list-card';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

const arbitraryList = () => ({
  listId: arbitraryListId(),
  ownerId: arbitraryListOwnerId(),
  articleIds: [],
});

describe('user-list-card', () => {
  it('displays the title of the list', async () => {
    const rendered = await pipe(
      userListCard(T.of([]))(arbitraryWord(), arbitraryUserId(), arbitraryList()),
      T.map(JSDOM.fragment),
    )();

    expect(rendered?.textContent).toContain('Saved articles');
  });

  it('displays the list owner\'s handle in the description', async () => {
    const handle = arbitraryWord();
    const rendered = await pipe(
      userListCard(T.of([]))(handle, arbitraryUserId(), arbitraryList()),
      T.map(JSDOM.fragment),
    )();
    const description = rendered.querySelector('p');

    expect(description?.textContent).toContain(handle);
  });

  describe('when list contains articles', () => {
    it('displays when the list was last updated', async () => {
      const handle = arbitraryWord();
      const userId = arbitraryUserId();
      const events = [
        userSavedArticle(userId, arbitraryArticleId(), new Date('2021-01-01')),
        userSavedArticle(userId, arbitraryArticleId(), new Date('2021-07-23')),
      ];
      const rendered = await pipe(
        userListCard(T.of(events))(handle, userId, arbitraryList()),
        T.map(JSDOM.fragment),
      )();
      const meta = rendered.querySelector('.list-card__meta');

      expect(meta?.textContent).toContain('Last updated Jul 23, 2021');
    });

    it('displays the number of articles in the list', async () => {
      const handle = arbitraryWord();
      const userId = arbitraryUserId();
      const list = {
        ...arbitraryList(),
        articleIds: [arbitraryArticleId().value, arbitraryArticleId().value],
      };
      const rendered = await pipe(
        userListCard(T.of([]))(handle, userId, list),
        T.map(JSDOM.fragment),
      )();
      const meta = rendered.querySelector('.list-card__meta');

      expect(meta?.textContent).toContain('2 articles');
    });
  });

  describe('when list is empty', () => {
    const handle = arbitraryWord();
    const userId = arbitraryUserId();

    it('does not display last updated date', async () => {
      const rendered = await pipe(
        userListCard(T.of([]))(handle, userId, arbitraryList()),
        T.map(JSDOM.fragment),
      )();
      const meta = rendered.querySelector('.list-card__meta');

      expect(meta?.textContent).not.toContain('Last updated');
    });

    it('displays an article count of 0', async () => {
      const list = {
        ...arbitraryList(),
        articleIds: [],
      };
      const rendered = await pipe(
        userListCard(T.of([]))(handle, userId, list),
        T.map(JSDOM.fragment),
      )();
      const meta = rendered.querySelector('.list-card__meta');

      expect(meta?.textContent).toContain('0 articles');
    });
  });
});
