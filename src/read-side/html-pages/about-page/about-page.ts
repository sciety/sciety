import * as TE from 'fp-ts/TaskEither';
import { renderPage } from './render-page';
import { ConstructPage } from '../../../html-pages/construct-page';
import { toHtmlPage } from '../../../html-pages/html-page';

export const aboutPage: ConstructPage = () => TE.right(toHtmlPage({
  title: 'About',
  content: renderPage(),
}));
