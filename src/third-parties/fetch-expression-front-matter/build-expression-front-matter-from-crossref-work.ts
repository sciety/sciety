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

const extractCommonFrontmatter = (journalOrPostedContent: JournalOrPostedContent) => {
  if ('journal' in journalOrPostedContent) {
    return journalOrPostedContent.journal.journal_article;
  }
  return journalOrPostedContent.posted_content;
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

const stripEmptySections = (html: string) => pipe(
  html,
  toHtmlFragment,
  sanitise,
  (sanitised) => sanitised.replace(/<section>\s*<\/section>/g, ''),
);

const getAbstract = (
  commonFrontmatter: CommonFrontMatter,
): O.Option<SanitisedHtmlFragment> => pipe(
  commonFrontmatter.abstract,
  O.map(transformXmlToHtml),
  O.map(removeSuperfluousTitles),
  O.map(stripEmptySections),
  O.map((output) => output.trim()),
  O.map(toHtmlFragment),
  O.map(sanitise),
);

const commonFrontmatterCodec = t.strict({
  titles: t.readonlyArray(t.strict({
    title: t.string,
  })),
  abstract: tt.optionFromNullable(t.string),
});

const postedContentCodec = t.strict({
  posted_content: commonFrontmatterCodec,
});

const journalCodec = t.strict({
  journal: t.strict({
    journal_article: commonFrontmatterCodec,
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

type JournalOrPostedContent = t.TypeOf<typeof frontMatterCrossrefXmlResponseCodec>['doi_records']['doi_record']['crossref'];

type CommonFrontMatter = t.TypeOf<typeof commonFrontmatterCodec>;

const getTitle = (
  commonFrontmatter: CommonFrontMatter,
): SanitisedHtmlFragment => pipe(
  commonFrontmatter.titles[0].title,
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
