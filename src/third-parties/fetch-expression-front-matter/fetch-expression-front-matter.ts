import { DOMParser } from '@xmldom/xmldom';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../logger';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { detectUnrecoverableError } from '../crossref/detect-unrecoverable-error';
import {
  getAbstract, getAuthors, getTitle,
} from '../crossref/parse-crossref-article';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

const parseResponseAndConstructDomainObject = (document: string, logger: Logger, expressionDoi: ExpressionDoi) => {
  if (document.length === 0) {
    logger('error', 'crossref/fetch-expression-front-matter: Empty document', { doi: expressionDoi, document });
    return E.left(DE.unavailable);
  }
  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });
  let abstract: O.Option<SanitisedHtmlFragment>;
  let authors: ArticleAuthors;
  let title: O.Option<SanitisedHtmlFragment>;
  try {
    const parsedXml = parser.parseFromString(document, 'text/xml');

    const unrecoverableError = detectUnrecoverableError(parsedXml);
    if (O.isSome(unrecoverableError)) {
      logger('error', 'crossref/fetch-expression-front-matter: Unrecoverable error', { expressionDoi, document, reason: unrecoverableError.value });
      return E.left(DE.unavailable);
    }

    authors = getAuthors(parsedXml);
    if (O.isNone(authors)) {
      logger('warn', 'crossref/fetch-expression-front-matter: Unable to find authors', { expressionDoi, document });
    }

    abstract = getAbstract(parsedXml);
    if (O.isNone(abstract)) {
      logger('warn', 'crossref/fetch-expression-front-matter: Unable to find abstract', { expressionDoi, document });
    }

    title = getTitle(parsedXml);
    if (O.isNone(title)) {
      logger('error', 'crossref/fetch-expression-front-matter: Unable to find title', { expressionDoi, document });
      return E.left(DE.unavailable);
    }
  } catch (error: unknown) {
    logger('error', 'crossref/fetch-expression-front-matter: Unable to parse document', { expressionDoi, document, error });
    return E.left(DE.unavailable);
  }
  return E.right({
    abstract,
    title: title.value,
    authors,
  });
};

const crossrefWorksTransformEndpoint = (expressionDoi: ExpressionDoi): string => `https://api.crossref.org/works/${expressionDoi}/transform`;

const crossrefHeaders = (crossrefApiBearerToken: O.Option<string>) => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.crossref.unixref+xml',
  };
  if (O.isSome(crossrefApiBearerToken)) {
    headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
  }
  return headers;
};

export const fetchExpressionFrontMatter = (
  queryExternalService: QueryExternalService,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
) => (expressionDoi: ExpressionDoi): ReturnType<ExternalQueries['fetchExpressionFrontMatter']> => pipe(
  expressionDoi,
  crossrefWorksTransformEndpoint,
  queryExternalService('warn', crossrefHeaders(crossrefApiBearerToken)),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, t.string, { expressionDoi }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.chainEitherKW((response) => parseResponseAndConstructDomainObject(
    response,
    logger,
    expressionDoi,
  )),
);
