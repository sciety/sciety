import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

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
  authors: Array<string>,
  server: ArticleServer,
};

type RenderPage = (
  doi: Doi,
  userId: O.Option<UserId>,
  abstract: HtmlFragment,
  articleDetails: ArticleDetails,
  saveArticle: HtmlFragment,
  tweetThis: HtmlFragment,
) => Page;

const render = (components: {
  articleDetails: ArticleDetails,
  abstract: HtmlFragment,
  doi: Doi,
  saveArticle: string,
  tweetThis: string,
}): Page => (
  {
    title: `${striptags(components.articleDetails.title)}`,
    content: toHtmlFragment(`
<article class="sciety-grid sciety-grid--article">
  <header class="page-header page-header--article">
    <h1>${components.articleDetails.title}</h1>
    <div class="article-actions">
      ${components.tweetThis}
      ${components.saveArticle}
    </div>
  </header>

  <div class="article-tabs">
    <h2 class="article-tabs__tab article-tabs__heading">Article</h2>
    <a class="article-tabs__tab article-tabs__link" href="/articles/activity/${components.doi.value}" aria-label="Discover article activity">Activity</a>
  </div>

  <div class="main-content main-content--article">
    <section class="article-meta">
      <h2>Authors</h2>
      <ol aria-label="Authors of this article" class="article-author-list" role="list">
        ${components.articleDetails.authors.map((author) => `<li>${author}</li>`).join('')}
      </ol>
      <ul aria-label="Publication details" class="article-meta-data-list" role="list">
        <li>
          <a href="https://doi.org/${components.doi.value}">https://doi.org/${components.doi.value}</a>
        </li>
      </ul>
    </section>

    ${components.abstract}
  </div>

</article>
    `),
    openGraph: {
      title: striptags(components.articleDetails.title),
      description: striptags(components.articleDetails.abstract),
    },
  }
);

export const renderMetaPage = (
): RenderPage => (doi, userId, abstract, articleDetails, saveArticle, tweetThis) => {
  const components = {
    articleDetails,
    doi,
    abstract,
    saveArticle,
    tweetThis,
  };

  return pipe(
    components,
    render,
  );
};
