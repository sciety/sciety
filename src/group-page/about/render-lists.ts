import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export const renderLists = (): HtmlFragment => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return toHtmlFragment('Placeholder for group lists');
  }

  return toHtmlFragment('');
};
