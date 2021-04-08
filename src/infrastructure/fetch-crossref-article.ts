import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { DOMParser } from 'xmldom';
import { Logger } from './logger';
import {
  getAbstract, getAuthors, getPublicationDate, getServer, getTitle,
} from './parse-crossref-article';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FetchCrossrefArticleError = 'not-found' | 'unavailable';

export type FetchCrossrefArticle = (doi: Doi) => TE.TaskEither<
FetchCrossrefArticleError,
{
  abstract: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  doi: Doi,
  title: SanitisedHtmlFragment,
  publicationDate: Date,
  server: ArticleServer,
}
>;

type GetXml = (doi: Doi, acceptHeader: string) => Promise<string>;

export const fetchCrossrefArticle = (getXml: GetXml, logger: Logger): FetchCrossrefArticle => {
  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });

  return (doi) => async () => {
    // TODO:
    // pipe(
    //   fetch the xml,
    //   parse it,
    //   transform to our own Domain Model for an Article
    // )
    let response: string;
    try {
      response = await getXml(doi, 'application/vnd.crossref.unixref+xml');
    } catch (error: unknown) {
      const payload: Record<string, unknown> = {
        doi,
        error,
      };
      let errorType: FetchCrossrefArticleError = 'not-found';
      if (error instanceof Error) {
        payload.message = error.message;
        if (error.message === 'Empty response from Crossref') {
          errorType = 'unavailable';
        }
      }
      logger('error', 'Failed to fetch article', payload);
      return E.left(errorType);
    }

    try {
      const doc = parser.parseFromString(response, 'text/xml');
      return E.right({
        abstract: getAbstract(doc, doi, logger),
        authors: getAuthors(doc, doi, logger),
        doi,
        title: getTitle(doc, doi, logger),
        publicationDate: getPublicationDate(doc),
        server: getServer(doc),
      });
    } catch (error: unknown) {
      logger('error', 'Unable to parse document', { doi, response, error });

      // TODO: decide a product direction covering all scenarios:
      // - what happens with a 404?
      // - what happens with a 50x?
      // - what happens if the XML is corrupted?
      // - what happens if the title cannot be parsed (e.g. it's missing from the XML)?
      // - what happens if the abstract cannot be parsed (e.g. it has unforeseen tags)?
      // - ...
      return E.left('unavailable');
    }
  };
};
