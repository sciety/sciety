import * as TE from 'fp-ts/TaskEither';
import { ConstructPage } from '../construct-page.js';
import { renderPage } from './render-page.js';
import { toHtmlPage } from '../html-page.js';

export const aboutPage: ConstructPage = () => TE.right(toHtmlPage({
  title: 'About',
  content: renderPage(),
}));
