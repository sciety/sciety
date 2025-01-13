// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
import { DOMParser } from '@xmldom/xmldom';
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

export const buildExpressionFrontMatterFromCrossrefWork = (
  crossrefWorkXml: string,
  logger: Logger,
  expressionDoi: ExpressionDoi,
): E.Either<DE.DataError, ExpressionFrontMatter> => {
  const commonFrontmatter = pipe(
    crossrefWorkXml,
    parseXmlDocument,
    E.chainW(decodeAndLogFailures(
      logger,
      frontMatterCrossrefXmlResponseCodec,
      { expressionDoi, crossrefWorkXml },
    )),
    E.map((decodedWork) => decodedWork.doi_records.doi_record.crossref),
    E.map(extractCommonFrontmatter),
  );

  if (E.isLeft(commonFrontmatter)) {
    logger('error', 'crossref/fetch-expression-front-matter: Failed to parse XML', { doi: expressionDoi, crossrefWorkXml });
    return E.left(DE.unavailable);
  }

  const title = getTitle(commonFrontmatter.right);

  const abstract = getAbstract(commonFrontmatter.right);
  if (O.isNone(abstract)) {
    logger('warn', 'build-expression-front-matter-from-crossref-work: Unable to find abstract', { expressionDoi, crossrefWorkXml });
  }

  const authors = getAuthors(commonFrontmatter.right);
  if (O.isNone(authors)) {
    logger('warn', 'build-expression-front-matter-from-crossref-work: Unable to find authors', { expressionDoi, crossrefWorkXml });
  }

  return E.right({
    abstract,
    title,
    authors,
  });
};
