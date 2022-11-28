import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userListCard } from '../../../src/user-page/user-list-card';
import { arbitraryString, arbitraryWord } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('user-list-card', () => {
  const listName = arbitraryString();
  const list = {
    listId: arbitraryListId(),
    ownerId: arbitraryListOwnerId(),
    articleIds: [arbitraryArticleId().value, arbitraryArticleId().value],
    lastUpdated: new Date('2021-07-23'),
    name: listName,
    description: arbitraryString(),
  };

  it('displays the title of the list', () => {
    const rendered = pipe(
      userListCard(arbitraryWord(), list),
      JSDOM.fragment,
    );

    expect(rendered?.textContent).toContain(listName);
  });

  it('displays the list owner\'s handle in the description', () => {
    const handle = arbitraryWord();
    const rendered = pipe(
      userListCard(handle, list),
      JSDOM.fragment,
    );
    const description = rendered.querySelector('p');

    expect(description?.textContent).toContain(handle);
  });

  it('displays when the list was last updated', () => {
    const handle = arbitraryWord();
    const rendered = pipe(
      userListCard(handle, list),
      JSDOM.fragment,
    );
    const meta = rendered.querySelector('.list-card__meta');

    expect(meta?.textContent).toContain('Last updated Jul 23, 2021');
  });

  it('displays the number of articles in the list', () => {
    const handle = arbitraryWord();
    const rendered = pipe(
      userListCard(handle, list),
      JSDOM.fragment,
    );
    const meta = rendered.querySelector('.list-card__meta');

    expect(meta?.textContent).toContain('2 articles');
  });
});
