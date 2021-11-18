import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const page = (): TE.TaskEither<never, Page> => TE.right({
  title: 'Articles featured by NCRC',
  content: toHtmlFragment(''),
});
