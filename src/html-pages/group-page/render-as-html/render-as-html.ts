import { pipe } from 'fp-ts/function';
import { Group } from '../../../types/group';
import { toHtmlFragment } from '../../../types/html-fragment';
import { Page } from '../../../types/page';
import { ViewModel } from '../view-model';
import { renderPage } from './render-page';

export const renderAsHtml = (group: Group) => (viewmodel: ViewModel): Page => ({
  title: group.name,
  content: pipe(viewmodel, renderPage, toHtmlFragment),
});
