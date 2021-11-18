import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderComponent } from '../list-page/header/render-component';
import { Page } from '../types/page';

const header = {
  name: 'Featured articles',
  description: 'Articles that have been identified as high-impact by NCRC editors.',
  ownerName: 'NCRC',
  ownerHref: '/groups/ncrc',
  ownerAvatarPath: '/static/groups/ncrc--62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg',
  articleCount: 0,
  lastUpdated: O.some(new Date('2021-11-18T11:33:00Z')),
};

export const page = (): TE.TaskEither<never, Page> => TE.right({
  title: 'Featured articles',
  content: pipe(
    header,
    renderComponent,
  ),
});
