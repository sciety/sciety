import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const groupsPage = (): TE.TaskEither<never, Page> => TE.right(
  {
    title: 'Groups',
    content: toHtmlFragment('Groups'),
    openGraph: {
      title: 'Groups',
      description: 'Groups',
    },
  },
);
