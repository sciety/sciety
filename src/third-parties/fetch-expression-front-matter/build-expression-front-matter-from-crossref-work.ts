// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
import { auth } from '@googleapis/sheets';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getAbstract } from './get-abstract';
import { getAuthors } from './get-authors';
import { getTitle } from './get-title';
import { JournalOrPostedContent, parseXmlDocument, frontMatterCrossrefXmlResponseCodec } from './parser-and-codec';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { ExpressionFrontMatter } from '../../types/expression-front-matter';
import { decodeAndLogFailures } from '../decode-and-log-failures';

const extractCommonFrontmatter = (journalOrPostedContent: JournalOrPostedContent) => {
  if ('journal' in journalOrPostedContent) {
    return journalOrPostedContent.journal.journal_article;
  }
  return journalOrPostedContent.posted_content;
};

const warnAboutMissingOptionalFrontmatterParts = (
  logger: Logger, context: Record<string, unknown>,
) => (res: ExpressionFrontMatter) => {
  if (O.isNone(res.abstract)) {
    logger('warn', 'build-expression-front-matter-from-crossref-work: Unable to find abstract', context);
  }
  if (O.isNone(res.authors)) {
    logger('warn', 'build-expression-front-matter-from-crossref-work: Unable to find authors', context);
  }
  return E.right(undefined);
};

export const buildExpressionFrontMatterFromCrossrefWork = (
  crossrefWorkXml: string,
  logger: Logger,
  expressionDoi: ExpressionDoi,
): E.Either<DE.DataError, ExpressionFrontMatter> => pipe(
  crossrefWorkXml,
  parseXmlDocument,
  E.chainW(decodeAndLogFailures(
    logger,
    frontMatterCrossrefXmlResponseCodec,
    { expressionDoi, crossrefWorkXml },
  )),
  E.map((decodedWork) => decodedWork.doi_records.doi_record.crossref),
  E.map(extractCommonFrontmatter),
  E.map((commonFrontmatter) => ({
    title: getTitle(commonFrontmatter),
    abstract: getAbstract(commonFrontmatter),
    authors: getAuthors(commonFrontmatter),
  })),
  E.mapLeft(() => {
    logger('error', 'crossref/fetch-expression-front-matter: Failed to parse XML', { doi: expressionDoi, crossrefWorkXml });
    return DE.unavailable;
  }),
  E.tap(warnAboutMissingOptionalFrontmatterParts(logger, { expressionDoi, crossrefWorkXml })),
);
