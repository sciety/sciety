import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { renderListCard } from '../../../../shared-components/list-card';
import * as LID from '../../../../types/list-id';
import { rawUserInput } from '../../../../read-models/annotations/handle-event';

export const renderCollectionsSection = (): HtmlFragment => toHtmlFragment(`
  <section class="group-page-collections">
    <h2>Collections</h2>
    <ol class="card-list" role="list">
        <li role="listitem">
        ${renderListCard({
    listId: LID.fromValidatedString('454ba80f-e0bc-47ed-ba76-c8f872c303d2'),
    articleCount: 706,
    updatedAt: O.some(new Date('2024-02-22')),
    title: 'Reading list',
    description: rawUserInput('Articles that are being read by Biophysics Colab.'),
    avatarUrl: O.some('https://pbs.twimg.com/profile_images/1417582635040317442/jYHfOlh6_normal.jpg'),
  })}
        </li>
    </ol>
  </section>
`);
