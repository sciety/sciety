import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListCard } from '../../../../shared-components/list-card';
import * as LID from '../../../../types/list-id';
import { rawUserInput } from '../../../../read-models/annotations/handle-event';

export const renderCollectionsSection = (): HtmlFragment => toHtmlFragment(`
  <ol class="card-list" role="list">
    <li role="listitem">
      ${renderListCard({
    listId: LID.fromValidatedString(''),
    articleCount: 0,
    updatedAt: O.none,
    title: 'My collection',
    description: rawUserInput('My description'),
    avatarUrl: O.some('https://pbs.twimg.com/profile_images/1417582635040317442/jYHfOlh6_normal.jpg'),
  })}
    </li>
  </ol>
`);
