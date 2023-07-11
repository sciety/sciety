import { DOMParser } from '@xmldom/xmldom';
import { formatValidationErrors } from 'io-ts-reporters';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { flow, pipe } from 'fp-ts/function';
import {
  getAbstract, getAuthors, getServer, getTitle,
} from './parse-crossref-article';
import { FetchArticle, Logger } from '../../shared-ports';
import { ArticleAuthors } from '../../types/article-authors';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { SanitisedHtmlFragment, sanitise } from '../../types/sanitised-html-fragment';
import { Doi } from '../../types/doi';
import { QueryExternalService } from '../query-external-service';
import { toHtmlFragment } from '../../types/html-fragment';

const parseResponseAndConstructDomainObject = (response: string, logger: Logger, doi: Doi) => {
  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });
  let abstract: SanitisedHtmlFragment;
  let authors: ArticleAuthors;
  let server: O.Option<ArticleServer>;
  let title: SanitisedHtmlFragment;
  try {
    if (response.length === 0) {
      throw new Error('Empty response from Crossref');
    }
    const doc = parser.parseFromString(response, 'text/xml');
    authors = getAuthors(doc);
    server = getServer(doc);

    if (O.isNone(authors)) {
      logger('error', 'Unable to find authors', { doi, response });
    }

    if (O.isNone(server)) {
      logger('warn', 'Unable to find server', { doi, response });
      return E.left(DE.unavailable);
    }

    abstract = getAbstract(doc, doi, logger);
    title = getTitle(doc, doi, logger);
  } catch (error: unknown) {
    logger('error', 'Unable to parse document', { doi, response, error });

    // TODO: decide a product direction covering all scenarios:
    // - what happens with a 404?
    // - what happens with a 50x?
    // - what happens if the XML is corrupted?
    // - what happens if the title cannot be parsed (e.g. it's missing from the XML)?
    // - what happens if the abstract cannot be parsed (e.g. it has unforeseen tags)?
    // - ...
    return E.left(DE.unavailable);
  }
  return E.right({
    abstract,
    title,
    authors,
    server: server.value,
    doi,
  });
};

const fetchFromCrossRef = (doi: Doi,
  queryExternalService: QueryExternalService,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>) => {
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

const dataCiteResponseCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      titles: t.array(t.strict({
        title: t.string,
      })),
      creators: t.readonlyArray(t.strict({
        name: t.string,
      })),
      publisher: t.string,
      descriptions: t.array(t.strict({
        description: t.string,
        descriptionType: t.literal('Abstract'),
      })),
    }),
  }),
});

const fetchFromDataCite = (
  queryExternalService: QueryExternalService,
): FetchArticle => (
  doi: Doi,
) => {
  const url = `https://api.datacite.org/dois/${doi.value}`;
  return pipe(
    url,
    queryExternalService(),
    TE.chainEitherKW(dataCiteResponseCodec.decode),
    TE.bimap(
      () => DE.unavailable,
      (validatedResponse) => ({
        abstract: pipe(
          validatedResponse.data.attributes.descriptions[0].description,
          toHtmlFragment,
          sanitise,
        ),
        authors: pipe(
          validatedResponse.data.attributes.creators,
          RA.map((creator) => creator.name),
          O.some,
        ),
        doi,
        title: pipe(
          validatedResponse.data.attributes.titles[0].title,
          toHtmlFragment,
          sanitise,
        ),
        server: 'osf',
      }),
    ),
  );
};

export const fetchCrossrefArticle = (
  queryExternalService: QueryExternalService,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
): FetchArticle => (doi) => {
  if (doi.value.startsWith('10.48550')) {
    return fetchFromDataCite(queryExternalService)(doi);
  }
  return fetchFromCrossRef(doi, queryExternalService, logger, crossrefApiBearerToken);
};
