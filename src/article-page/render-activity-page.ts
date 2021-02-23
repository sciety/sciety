import striptags from 'striptags';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type Page = {
  title: string,
  content: HtmlFragment,
  openGraph: {
    title: string,
    description: string,
  },
};

type ArticleDetails = {
  title: string,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
};

export const renderActivityPage = (components: {
  articleDetails: ArticleDetails,
  doi: Doi,
  feed: string,
  saveArticle: string,
  tweetThis: string,
}): Page => (
  {
    title: `${striptags(components.articleDetails.title)}`,
    content: toHtmlFragment(`
<article class="sciety-grid sciety-grid--activity">
  <header class="page-header page-header--article">
    <h1>${components.articleDetails.title}</h1>
    <div class="article-actions">
      ${components.tweetThis}
      ${components.saveArticle}
    </div>
  </header>
  <div class="article-tabs">
    <a class="article-tabs__tab article-tabs__link" href="/articles/meta/${components.doi.value}" aria-label="Discover article information and abstract">Article</a>
    <h2 class="article-tabs__tab article-tabs__heading">Activity</h2>
  </div>
  <div class="main-content main-content--article">
    ${components.feed}
  </div>

</article>
    `),
    openGraph: {
      title: striptags(components.articleDetails.title),
      description: striptags(components.articleDetails.abstract),
    },
  }
);
