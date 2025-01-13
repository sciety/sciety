import { DOMParser } from '@xmldom/xmldom';
import { load } from 'cheerio';
import { XMLParser } from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { detectUnrecoverableError } from './detect-unrecoverable-error';
import { getElement } from './get-element';
import { Logger } from '../../logger';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { ExpressionFrontMatter } from '../../types/expression-front-matter';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { decodeAndLogFailures } from '../decode-and-log-failures';

const extractAbstract = (journalOrPostedContent: DoiRecord['crossref']) => {
  if ('journal' in journalOrPostedContent) {
    return journalOrPostedContent.journal.journal_article.abstract;
  }
  return journalOrPostedContent.posted_content.abstract;
};

const removeSuperfluousTitles = (html: string) => {
  const model = load(html);
  model('h3').first().remove();
  model('h3:contains("Graphical abstract")').remove();
  return model.html();
};

const transformXmlToHtml = (xml: string) => (
  xml
    .replace(/<abstract[^>]*>/, '')
    .replace(/<\/abstract>/, '')
    .replace(/<italic[^>]*>/g, '<i>')
    .replace(/<\/italic>/g, '</i>')
    .replace(/<list[^>]* list-type=['"]bullet['"][^>]*/g, '<ul')
    .replace(/<\/list>/g, '</ul>')
    .replace(/<list-item[^>]*/g, '<li')
    .replace(/<\/list-item>/g, '</li>')
    .replace(/<sec[^>]*/g, '<section')
    .replace(/<\/sec>/g, '</section>')
    .replace(/<title[^>]*/g, '<h3')
    .replace(/<\/title>/g, '</h3>')
);

const stripEmptySections = (html: string) => (
  html.replace(/<section>\s*<\/section>/g, '')
);

const getAbstract = (
  record: DoiRecord,
): O.Option<SanitisedHtmlFragment> => pipe(
  record.crossref,
  extractAbstract,
  O.map(transformXmlToHtml),
  O.map(removeSuperfluousTitles),
  O.map(toHtmlFragment),
  O.map(sanitise),
  O.map(stripEmptySections),
  O.map((output) => output.trim()),
  O.map(toHtmlFragment),
  O.map(sanitise),
);

const postedContentCodec = t.strict({
  posted_content: t.strict({
    titles: t.readonlyArray(t.strict({
      title: t.string,
    })),
    abstract: tt.optionFromNullable(t.string),
  }),
});

const journalCodec = t.strict({
  journal: t.strict({
    journal_article: t.strict({
      titles: t.readonlyArray(t.strict({
        title: t.string,
      })),
      abstract: tt.optionFromNullable(t.string),
    }),
  }),
});

const frontMatterCrossrefXmlResponseCodec = t.strict({
  doi_records: t.strict({
    doi_record: t.strict({
      crossref: t.union([
        journalCodec, postedContentCodec,
      ]),
    }),
  }),
}, 'frontMatterCrossrefXmlResponseTitleCodec');

type DoiRecord = t.TypeOf<typeof frontMatterCrossrefXmlResponseCodec>['doi_records']['doi_record'];

const extractTitle = (journalOrPostedContent: DoiRecord['crossref']) => {
  if ('journal' in journalOrPostedContent) {
    return journalOrPostedContent.journal.journal_article.titles[0].title;
  }
  return journalOrPostedContent.posted_content.titles[0].title;
};

const getTitle = (
  record: DoiRecord,
): SanitisedHtmlFragment => pipe(
  record.crossref,
  extractTitle,
  (title) => title.trim(),
  toHtmlFragment,
  sanitise,
);

const personAuthor = (person: Element) => {
  const givenName = person.getElementsByTagName('given_name')[0]?.textContent;
  const surname = person.getElementsByTagName('surname')[0]?.textContent;

  if (!surname) {
    return O.none;
  }

  if (!givenName) {
    return O.some(surname);
  }

  return O.some(`${givenName} ${surname}`);
};

const organisationAuthor = (organisation: Element) => O.fromNullable(organisation.textContent);

const getAuthors = (doc: Document): ArticleAuthors => {
  const contributorsElement = getElement(doc, 'contributors');

  if (!contributorsElement || typeof contributorsElement?.textContent !== 'string') {
    return O.none;
  }

  const authors = Array.from(contributorsElement.childNodes)
    .filter((node): node is Element => node.nodeType === node.ELEMENT_NODE)
    .filter((contributor) => contributor.getAttribute('contributor_role') === 'author')
    .map((contributor) => {
      switch (contributor.tagName) {
        case 'person_name':
          return personAuthor(contributor);
        case 'organization':
          return organisationAuthor(contributor);
      }

      return O.none;
    });

  return pipe(authors, O.sequenceArray);
};

const parser = new XMLParser({
  stopNodes: ['*.title', '*.abstract'],
  isArray: (name) => name === 'titles',
});

const parseXmlDocument = (s: string) => E.tryCatch(
  () => parser.parse(s) as unknown,
  () => 'Failed to parse XML',
);

export const buildExpressionFrontMatterFromCrossrefWork = (
  crossrefWorkXml: string,
  logger: Logger,
  expressionDoi: ExpressionDoi,
): E.Either<DE.DataError, ExpressionFrontMatter> => {
  if (crossrefWorkXml.length === 0) {
    logger('error', 'crossref/fetch-expression-front-matter: Empty document', { doi: expressionDoi, crossrefWorkXml });
    return E.left(DE.unavailable);
  }

  const doiRecord = pipe(
    crossrefWorkXml,
    parseXmlDocument,
    E.chainW(decodeAndLogFailures(
      logger,
      frontMatterCrossrefXmlResponseCodec,
      { expressionDoi, crossrefWorkXml },
    )),
  );

  if (E.isLeft(doiRecord)) {
    logger('error', 'crossref/fetch-expression-front-matter: Failed to parse XML', { doi: expressionDoi, crossrefWorkXml });
    return E.left(DE.unavailable);
  }

  const title = getTitle(doiRecord.right.doi_records.doi_record);
  const abstract = getAbstract(doiRecord.right.doi_records.doi_record);

  const legacyParser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });

  let authors: ArticleAuthors;
  try {
    const parsedXml = legacyParser.parseFromString(crossrefWorkXml, 'text/xml');

    const unrecoverableError = detectUnrecoverableError(parsedXml);
    if (O.isSome(unrecoverableError)) {
      logger('error', 'build-expression-front-matter-from-crossref-work: Unrecoverable error', { expressionDoi, crossrefWorkXml, reason: unrecoverableError.value });
      return E.left(DE.unavailable);
    }

    authors = getAuthors(parsedXml);
    if (O.isNone(authors)) {
      logger('warn', 'build-expression-front-matter-from-crossref-work: Unable to find authors', { expressionDoi, crossrefWorkXml });
    }
  } catch (error: unknown) {
    logger('error', 'build-expression-front-matter-from-crossref-work: Unable to parse document', { expressionDoi, crossrefWorkXml, error });
    return E.left(DE.unavailable);
  }

  return E.right({
    abstract,
    title,
    authors,
  });
};
