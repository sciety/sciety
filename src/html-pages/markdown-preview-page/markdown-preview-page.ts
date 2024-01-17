import * as TE from 'fp-ts/TaskEither';
import { ConstructPage } from '../construct-page';
import { renderPage } from './render-page';

export const markdownPreviewPage: ConstructPage = () => TE.right({
  title: 'Markdown Preview',
  content: renderPage(),
});
