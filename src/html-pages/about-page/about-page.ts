import * as TE from 'fp-ts/TaskEither';
import { ConstructPage } from '../construct-page.js';
import { renderPage } from './render-page.js';

export const aboutPage: ConstructPage = () => TE.right({
  title: 'About',
  content: renderPage(),
});
