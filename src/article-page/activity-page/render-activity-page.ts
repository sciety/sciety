import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

// TODO: title should be HtmlFragment and sanitized outside of here
type ArticleDetails = {
  title: string,
};

// TODO: replace string with HtmlFragment
export const renderActivityPage = (components: {
  articleDetails: ArticleDetails,
  doi: Doi,
  feed: string,
  saveArticle: string,
  tweetThis: string,
}): HtmlFragment => toHtmlFragment(`
  <div class="page-content__background">
    <article class="sciety-grid sciety-grid--article">
      <header class="page-header page-header--article">
        <h1 class="page-header__title" >${components.articleDetails.title}</h1>
        <div class="article-actions">
          ${components.tweetThis}
          ${components.saveArticle}
        </div>
      </header>
      <div class="article-tabs-container">
        <a class="article-tab article-tab--link" href="/articles/meta/${components.doi.value}" aria-label="Discover article information and abstract">Article</a>
        <h2 class="article-tab article-tab--heading">Activity</h2>
      </div>
      <div class="main-content">
        ${components.feed}
      </div>
    </article>
  </div>
`);
