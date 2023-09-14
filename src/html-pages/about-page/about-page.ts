import * as TE from 'fp-ts/TaskEither';
import { ConstructPage } from '../construct-page';
import { renderPage } from './render-page';

export const aboutPage: ConstructPage = () => TE.right({
  title: 'About',
  content: renderPage(),
});
