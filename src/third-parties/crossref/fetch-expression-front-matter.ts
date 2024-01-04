import { DOMParser } from '@xmldom/xmldom';
import { formatValidationErrors } from 'io-ts-reporters';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import {
  getAbstract, getAuthors, getServer, getTitle,
} from './parse-crossref-article';
import { Logger } from '../../shared-ports';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';
import { ArticleId } from '../../types/article-id';
import { QueryExternalService } from '../query-external-service';
import { toHtmlFragment } from '../../types/html-fragment';
import { ExternalQueries } from '../external-queries';

const parseResponseAndConstructDomainObject = (response: string, logger: Logger, doi: ArticleId) => {
  if (response.length === 0) {
    logger('error', 'Empty response from Crossref', { doi, response });
    return E.left(DE.unavailable);
  }
  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });
  let abstract: O.Option<SanitisedHtmlFragment>;
  let authors: ArticleAuthors;
  let server: O.Option<ArticleServer>;
  let title: O.Option<SanitisedHtmlFragment>;
  try {
    const doc = parser.parseFromString(response, 'text/xml');
    authors = getAuthors(doc);
    server = getServer(doc);

    if (O.isNone(authors)) {
      logger('warn', 'Unable to find authors', { doi, response });
    }

    if (O.isNone(server)) {
      logger('warn', 'Unable to find server', { doi, response });
      return E.left(DE.unavailable);
    }

    abstract = getAbstract(doc, doi, logger);
    if (O.isNone(abstract)) {
      logger('warn', 'Did not find abstract', { doi });
    }

    title = getTitle(doc);
    if (O.isNone(title)) {
      logger('warn', 'Did not find title', { doi });
    }
  } catch (error: unknown) {
    logger('error', 'Unable to parse document', { doi, response, error });
    // - what happens if the title cannot be parsed (e.g. it's missing from the XML)?
    // - what happens if the abstract cannot be parsed (e.g. it has unforeseen tags)?
    return E.left(DE.unavailable);
  }
  return E.right({
    abstract: pipe(
      abstract,
      O.getOrElse(() => sanitise(toHtmlFragment(`No abstract for ${doi.value} available`))),
    ),
    title: pipe(
      title,
      // TODO: the decision as to what to display on error should live with the rendering component
      O.getOrElse(() => sanitise(toHtmlFragment('Unknown title'))),
    ),
    authors,
    server: server.value,
    doi,
  });
};

const fetchCrossrefArticle = (
  queryExternalService: QueryExternalService,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
) => (doi: ArticleId): ReturnType<ExternalQueries['fetchExpressionFrontMatter']> => {
  const url = `https://api.crossref.org/works/${doi.value}/transform`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.crossref.unixref+xml',
  };
  if (O.isSome(crossrefApiBearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
  }
  return pipe(
    url,
    queryExternalService('warn', headers),
    TE.chainEitherKW(flow(
      t.string.decode,
      E.mapLeft(formatValidationErrors),
      E.mapLeft((errors) => {
        logger('error', 'Crossref response is not a string', { errors, doi: doi.value });
        return DE.unavailable;
      }),
    )),
    TE.chainEitherKW((response) => parseResponseAndConstructDomainObject(response, logger, doi)),
  );
};

export const fetchExpressionFrontMatter = (
  queryExternalService: QueryExternalService,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
): ExternalQueries['fetchExpressionFrontMatter'] => (expressionDoi) => pipe(
  new ArticleId(expressionDoi),
  fetchCrossrefArticle(queryExternalService, logger, crossrefApiBearerToken),
);