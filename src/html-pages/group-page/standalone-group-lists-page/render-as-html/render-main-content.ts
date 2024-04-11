import { pipe } from 'fp-ts/function';
import { HtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';
import { renderListOfListCardsWithFallback } from './render-list-of-list-cards-with-fallback';

export const renderMainContent = (viewmodel: ViewModel): HtmlFragment => pipe(
  renderListOfListCardsWithFallback(viewmodel.listCards),
);
