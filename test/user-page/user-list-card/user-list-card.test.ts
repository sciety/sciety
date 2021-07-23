import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userSavedArticle } from '../../../src/types/domain-events';
import { userListCard } from '../../../src/user-page/user-list-card';
import { arbitraryWord } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-list-card', () => {
  it('displays the title of the list', async () => {
    const rendered = await pipe(
      userListCard(T.of([]))(arbitraryWord(), arbitraryUserId()),
      T.map(JSDOM.fragment),
    )();

    expect(rendered?.textContent).toContain('Saved articles');
  });

  it('the title holds a link', async () => {
    const rendered = await pipe(
      userListCard(T.of([]))(arbitraryWord(), arbitraryUserId()),
      T.map(JSDOM.fragment),
    )();

    expect(rendered.querySelector('h3 a')).not.toBeNull();
  });

  it('displays the list owner\'s handle in the description', async () => {
    const handle = arbitraryWord();
    const rendered = await pipe(
      userListCard(T.of([]))(handle, arbitraryUserId()),
      T.map(JSDOM.fragment),
    )();
    const description = rendered.querySelector('p');

    expect(description?.textContent).toContain(handle);
  });

  describe('when list contains articles', () => {
    it.todo('displays when the list was last updated');

    it('displays the number of articles in the list', async () => {
      const handle = arbitraryWord();
      const userId = arbitraryUserId();
      const events = [
        userSavedArticle(userId, arbitraryDoi()),
        userSavedArticle(userId, arbitraryDoi()),
      ];
      const rendered = await pipe(
        userListCard(T.of(events))(handle, userId),
        T.map(JSDOM.fragment),
      )();
      const meta = rendered.querySelector('.list-card__meta');

      expect(meta?.textContent).toContain('2 articles');
    });
  });

  describe('when list is empty', () => {
    it.todo('does not display last updated date');

    it.todo('displays an article count of 0');
  });
});
