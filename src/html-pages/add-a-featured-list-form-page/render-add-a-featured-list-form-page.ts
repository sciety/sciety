import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';

export const renderAddAFeaturedListFormPage = (): HtmlPage => toHtmlPage({
  title: 'Add a featured list form',
  content: toHtmlFragment('Form'),
});
