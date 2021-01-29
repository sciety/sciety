import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { constant, pipe } from 'fp-ts/lib/function';
import striptags from 'striptags';
import { Result } from 'true-myth';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { UserId } from '../types/user-id';

type Page = {
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
  server: ArticleServer,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<'not-found' | 'unavailable', ArticleDetails>;

type RenderAbstract = (doi: Doi) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>;
type RenderFeed = (doi: Doi, server: ArticleServer, userId: O.Option<UserId>) => TE.TaskEither<'no-content', HtmlFragment>;
export type RenderPage = (doi: Doi, userId: O.Option<UserId>) => TE.TaskEither<RenderPageError, Page>;

const toErrorPage = (error: 'not-found' | 'unavailable'): RenderPageError => {
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
};

export const createRenderPage = (
  renderPageHeader: (doi: Doi, userId: O.Option<UserId>) => TE.TaskEither<'not-found' | 'unavailable', HtmlFragment>,
  renderAbstract: RenderAbstract,
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
    const abstractResult = pipe(
      renderAbstract(doi),
      T.map(E.fold(
        (error) => Result.err<string, 'not-found' | 'unavailable'>(error),
        (success) => Result.ok<string, 'not-found' | 'unavailable'>(success),
      )),
    )();
    const pageHeaderResult = pipe(
      renderPageHeader(doi, userId),
      T.map(E.fold(
        (error) => Result.err<HtmlFragment, 'not-found' | 'unavailable'>(error),
        (success) => Result.ok<HtmlFragment, 'not-found' | 'unavailable'>(success),
      )),
    )();
    const articleDetails = getArticleDetails(doi);
    const articleDetailsResult = pipe(
      articleDetails,
      T.map(E.fold(
        (error) => Result.err<ArticleDetails, 'not-found' | 'unavailable'>(error),
        (success) => Result.ok<ArticleDetails, 'not-found' | 'unavailable'>(success),
      )),
    )();
    const feedResult = pipe(
      articleDetails,
      T.map(E.fold(
        constant<ArticleServer>('biorxiv'),
        ({ server }) => server,
      )),
      T.chain((server) => renderFeed(doi, server, userId)),
      T.map(E.getOrElse(constant(''))),
      T.map((feed) => Result.ok<string, never>(feed)),
    )();

    return Result.ok<typeof template, 'not-found' | 'unavailable'>(template)
      .ap(await abstractResult)
      .ap(await pageHeaderResult)
      .ap(await feedResult)
      .ap(await articleDetailsResult)
      .mapErr(toErrorPage)
      .mapOrElse<E.Either<RenderPageError, Page>>(E.left, E.right);
  };
};
