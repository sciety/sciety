import * as T from 'fp-ts/lib/Task';
import { Result } from 'true-myth';
import { DOMParser } from 'xmldom';
import { Logger } from './logger';
import {
  getAbstract, getAuthors, getPublicationDate, getTitle,
} from './parse-crossref-article';
import Doi from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

type FetchCrossrefArticleError = 'not-found' | 'unavailable';

export type FetchCrossrefArticle = (doi: Doi) => T.Task<Result<{
  abstract: SanitisedHtmlFragment;
  authors: Array<string>;
  doi: Doi;
  title: SanitisedHtmlFragment;
  publicationDate: Date;
}, FetchCrossrefArticleError>>;

export type GetXml = (doi: Doi, acceptHeader: string) => Promise<string>;

export default (getXml: GetXml, logger: Logger): FetchCrossrefArticle => {
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
      if (error instanceof Error) {
        payload.message = error.message;
      }
      logger('error', 'Failed to fetch article', payload);

      return Result.err('not-found');
    }

    try {
      const doc = parser.parseFromString(response, 'text/xml');
      return Result.ok({
        abstract: sanitise(toHtmlFragment(getAbstract(doc, doi, logger))), // TODO: push sanitisation down
        authors: getAuthors(doc, doi, logger),
        doi,
        title: getTitle(doc, doi, logger),
        publicationDate: getPublicationDate(doc),
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
      return Result.err('unavailable');
    }
  };
};
