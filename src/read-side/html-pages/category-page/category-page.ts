import * as TE from 'fp-ts/TaskEither';
import { Dependencies } from './dependencies';
import { toHtmlFragment } from '../../../types/html-fragment';
import { ConstructPage } from '../construct-page';
import { toHtmlPage } from '../html-page';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const categoryPage = (dependencies: Dependencies): ConstructPage => () => TE.right(toHtmlPage({
  title: 'Category page',
  content: toHtmlFragment('Category page'),
}));
