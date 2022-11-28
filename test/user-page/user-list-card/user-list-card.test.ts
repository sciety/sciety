import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { userListCard } from '../../../src/user-page/user-list-card';
import { arbitraryString } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryListOwnerId } from '../../types/list-owner-id.helper';

describe('user-list-card', () => {
  const listName = arbitraryString();
  const listDescription = arbitraryString();
  const list = {
    listId: arbitraryListId(),
    ownerId: arbitraryListOwnerId(),
    articleIds: [arbitraryArticleId().value, arbitraryArticleId().value],
    lastUpdated: new Date('2021-07-23'),
    name: listName,
    description: listDescription,
  };

  it('displays the name of the list as card title', () => {
    const rendered = pipe(
      userListCard(list),
      JSDOM.fragment,
    );

    expect(rendered?.textContent).toContain(listName);
  });

  it('displays the list description', () => {
    const rendered = pipe(
      userListCard(list),
      JSDOM.fragment,
    );
    const description = rendered.querySelector('p');

    expect(description?.textContent).toContain(listDescription);
  });

  it('displays when the list was last updated', () => {
    const rendered = pipe(
      userListCard(list),
      JSDOM.fragment,
    );
    const meta = rendered.querySelector('.list-card__meta');

    expect(meta?.textContent).toContain('Last updated Jul 23, 2021');
  });

  it('displays the number of articles in the list', () => {
    const rendered = pipe(
      userListCard(list),
      JSDOM.fragment,
    );
    const meta = rendered.querySelector('.list-card__meta');

    expect(meta?.textContent).toContain('2 articles');
  });
});
