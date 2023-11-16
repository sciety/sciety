import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export const renderSuccessBanner = (): HtmlFragment => (
  process.env.EXPERIMENT_ENABLED
    ? toHtmlFragment('foo')
    : toHtmlFragment('')
);
