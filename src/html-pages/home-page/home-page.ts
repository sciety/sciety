import { pipe } from 'fp-ts/function';
import { Page } from '../../types/page';
import { renderHomepage } from './render-home-page';
import { constructViewModel, Ports } from './construct-view-model/construct-view-model';

export const homePage = (ports: Ports): Page => pipe(
  constructViewModel(ports),
  renderHomepage,
  (content) => ({
    title: 'Sciety: the home of public preprint evaluation',
    content,
  }),
);
