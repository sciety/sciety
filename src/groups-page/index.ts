import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const groupsPage = (): TE.TaskEither<never, Page> => pipe(
  'Groups',
  toHtmlFragment,
  (content) => ({
    title: 'Groups',
    content,
    openGraph: {
      title: 'Groups',
      description: 'Groups',
    },
  }),
  TE.right,
);
