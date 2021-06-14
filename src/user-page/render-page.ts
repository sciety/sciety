import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Components = {
  header: HtmlFragment,
  followList: HtmlFragment,
  userDisplayName: string,
  savedArticles: HtmlFragment,
};

export const renderPage = ({
  header, followList, savedArticles, userDisplayName,
}: Components): Page => (
  {
    title: userDisplayName,
    content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--user">
        ${header}
        <div class="user-page-contents">
          ${savedArticles}
          ${followList}
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
