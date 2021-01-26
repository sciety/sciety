import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import striptags from 'striptags';
import { Result } from 'true-myth';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

export type Page = {
  title: string,
  content: HtmlFragment,
  openGraph: {
    title: string,
    description: string,
  }
};

type ArticleDetails = {
  title: string,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: 'biorxiv' | 'medrxiv',
};

type GetArticleDetails = (doi: Doi) => T.Task<Result<ArticleDetails, 'not-found'|'unavailable'>>;

type Component = (doi: Doi) => T.Task<Result<string, 'not-found' | 'unavailable'>>;
type RenderFeed = (doi: Doi, server: 'biorxiv' | 'medrxiv', userId: O.Option<UserId>) => Promise<Result<string, 'no-content'>>;
export type RenderPage = (doi: Doi, userId: O.Option<UserId>) => T.Task<Result<Page, RenderPageError>>;

export const createRenderPage = (
  renderPageHeader: (doi: Doi, userId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>,
  renderAbstract: Component,
  renderFeed: RenderFeed,
  getArticleDetails: GetArticleDetails,
): RenderPage => {
  const template = (
    abstract: string,
  ) => (pageHeader: string) => (feed: string) => (articleDetails: ArticleDetails) => (
    {
      title: `${striptags(articleDetails.title)}`,
      content: toHtmlFragment(`
<article class="sciety-grid sciety-grid--article">
  ${pageHeader}

  <div class="main-content main-content--article">
    ${abstract}
    ${feed}
  </div>

</article>
    `),
      openGraph: {
        title: striptags(articleDetails.title),
        description: striptags(articleDetails.abstract),
      },
    }
  );

  return (doi, userId) => async () => {
    const abstractResult = renderAbstract(doi)();
    const pageHeaderResult = pipe(
      renderPageHeader(doi, userId),
      T.map(E.fold(
        (error) => Result.err<HtmlFragment, 'not-found' | 'unavailable'>(error),
        (success) => Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(success),
      )),
    )();
    const articleDetailsResult = getArticleDetails(doi);
    const server = (await articleDetailsResult()).mapOr('biorxiv', (articleDetails) => articleDetails.server);
    const feedResult = renderFeed(doi, server, userId)
      .then((feed) => (
        feed.or(Result.ok<string, never>(''))
      ));

    return Result.ok<typeof template, 'not-found' | 'unavailable'>(template)
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
      .ap(await articleDetailsResult())
      .mapErr((error) => {
        switch (error) {
          case 'not-found':
            return {
              type: 'not-found',
              message: toHtmlFragment(`
                We’re having trouble finding this information.
                Ensure you have the correct URL, or try refreshing the page.
                You may need to come back later.
              `),
            };
          case 'unavailable':
            return {
              type: 'unavailable',
              message: toHtmlFragment(`
                We’re having trouble finding this information.
                Ensure you have the correct URL, or try refreshing the page.
                You may need to come back later.
              `),
            };
        }
      });
  };
};
