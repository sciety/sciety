import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

export type Page = {
  title: string,
  content: HtmlFragment,
};

type Components = {
  header: HtmlFragment,
  followList: HtmlFragment,
  userDisplayName: string,
  savedArticlesList: HtmlFragment,
};

export const renderPage = ({
  header, followList, savedArticlesList, userDisplayName,
}: Components): Page => (
  {
    title: `${userDisplayName}`,
    content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--user">
        ${header}
        <div class="user-page-contents">
          ${followList}
          ${savedArticlesList}
        </div>
      </div>
    `),
  }
);

export const renderErrorPage = (e: 'not-found' | 'unavailable'): RenderPageError => {
  if (e === 'not-found') {
    return {
      type: 'not-found',
      message: toHtmlFragment('User not found'),
    };
  }
  return {
    type: 'unavailable',
    message: toHtmlFragment('User information unavailable'),
  };
};
