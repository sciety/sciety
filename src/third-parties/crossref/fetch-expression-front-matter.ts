import { DOMParser } from '@xmldom/xmldom';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import {
  getAbstract, getAuthors, getTitle,
} from './parse-crossref-article';
import { Logger } from '../../shared-ports';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';
import { ExpressionDoi } from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';

const parseResponseAndConstructDomainObject = (document: string, logger: Logger, expressionDoi: ExpressionDoi) => {
  if (document.length === 0) {
    logger('error', 'Empty response from Crossref', { doi: expressionDoi, document });
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
    authors = getAuthors(parsedXml);

    if (O.isNone(authors)) {
      logger('warn', 'Unable to find authors', { expressionDoi, document });
    }

    abstract = getAbstract(parsedXml);

    title = getTitle(parsedXml);
    if (O.isNone(title)) {
      logger('error', 'Did not find title', { expressionDoi, document });
      return E.left(DE.unavailable);
    }
  } catch (error: unknown) {
    logger('error', 'Unable to parse document', { expressionDoi, document, error });
    // - what happens if the title cannot be parsed (e.g. it's missing from the XML)?
    // - what happens if the abstract cannot be parsed (e.g. it has unforeseen tags)?
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
