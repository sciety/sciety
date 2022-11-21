import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userListCard } from '../../../src/user-page/user-list-card';
import { arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('user-list-card', () => {
  const list = {
    listId: arbitraryListId(),
    ownerId: arbitraryListOwnerId(),
    articleIds: [arbitraryArticleId().value, arbitraryArticleId().value],
    lastUpdated: new Date('2021-07-23'),
  };

  it('displays the title of the list', async () => {
    const rendered = await pipe(
      userListCard(T.of([]))(arbitraryWord(), arbitraryUserId(), list),
      T.map(JSDOM.fragment),
    )();

    expect(rendered?.textContent).toContain('Saved articles');
  });

  it('displays the list owner\'s handle in the description', async () => {
    const handle = arbitraryWord();
    const rendered = await pipe(
      userListCard(T.of([]))(handle, arbitraryUserId(), list),
      T.map(JSDOM.fragment),
    )();
    const description = rendered.querySelector('p');

    expect(description?.textContent).toContain(handle);
  });

  it.failing('displays when the list was last updated', async () => {
    const handle = arbitraryWord();
    const userId = arbitraryUserId();
    const rendered = await pipe(
      userListCard(T.of([]))(handle, userId, list),
      T.map(JSDOM.fragment),
    )();
    const meta = rendered.querySelector('.list-card__meta');

    expect(meta?.textContent).toContain('Last updated Jul 23, 2021');
  });

  it('displays the number of articles in the list', async () => {
    const handle = arbitraryWord();
    const userId = arbitraryUserId();
    const rendered = await pipe(
      userListCard(T.of([]))(handle, userId, list),
      T.map(JSDOM.fragment),
    )();
    const meta = rendered.querySelector('.list-card__meta');

    expect(meta?.textContent).toContain('2 articles');
  });
});
