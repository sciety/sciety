import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
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
  crossrefWorkXml: tt.NonEmptyString,
  logger: Logger,
  expressionDoi: ExpressionDoi,
): E.Either<DE.DataError, ExpressionFrontMatter> => {
  const contextForLogs = { expressionDoi, crossrefWorkXml };

  return pipe(
    crossrefWorkXml,
    parseXmlDocument(logger, contextForLogs),
    E.flatMap(decodeAndLogFailures(logger, frontMatterCrossrefXmlResponseCodec, contextForLogs)),
    E.mapLeft(() => DE.unavailable),
    E.map((decodedWork) => decodedWork.doi_records.doi_record.crossref),
    E.map(extractCommonFrontmatter),
    E.map((commonFrontmatter) => ({
      title: getTitle(commonFrontmatter),
      abstract: getAbstract(commonFrontmatter),
      authors: getAuthors(commonFrontmatter),
    })),
    E.tap(warnAboutMissingOptionalFrontmatterParts(logger, contextForLogs)),
  );
};
