import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { XMLParser } from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { detectUnrecoverableError } from './detect-unrecoverable-error';
import { getElement } from './get-element';
import { Logger } from '../../logger';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { ExpressionDoi } from '../../types/expression-doi';
import { ExpressionFrontMatter } from '../../types/expression-front-matter';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise, SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

const getAbstract = (
  doc: Document,
): O.Option<SanitisedHtmlFragment> => {
  const abstractElement = getElement(doc, 'abstract');

  if (typeof abstractElement?.textContent !== 'string') {
    return O.none;
  }

  const titleElement = getElement(abstractElement, 'title');
  if (titleElement) {
    abstractElement.removeChild(titleElement);
  }

  const titles = Array.from(abstractElement.getElementsByTagName('title'));
  titles.forEach((title) => {
    if (title.textContent === 'Graphical abstract') {
      abstractElement.removeChild(title);
    }
  });

  const abstract = new XMLSerializer().serializeToString(abstractElement);

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

  return pipe(
    abstract,
    transformXmlToHtml,
    toHtmlFragment,
    sanitise,
    stripEmptySections,
    toHtmlFragment,
    sanitise,
    O.some,
  );
};

const getTitle = (doc: Document): O.Option<SanitisedHtmlFragment> => {
  const titlesElement = getElement(doc, 'titles');
  const titleElement = titlesElement?.getElementsByTagName('title')[0];
  if (titleElement) {
    const title = new XMLSerializer()
      .serializeToString(titleElement)
      .replace(/^<title(?:.?)>([\s\S]*)<\/title>$/, '$1')
      .trim();
    return pipe(
      title,
      toHtmlFragment,
      sanitise,
      O.some,
    );
  }
  return O.none;
};

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

const parser = new XMLParser({});

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
  const parsedCrossrefWork = parseXmlDocument(crossrefWorkXml);
  if (E.isLeft(parsedCrossrefWork)) {
    logger('error', 'crossref/fetch-expression-front-matter: Failed to parse XML', { doi: expressionDoi, crossrefWorkXml });
    return E.left(DE.unavailable);
  }

  const legacyParser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });
  let abstract: O.Option<SanitisedHtmlFragment>;
  let authors: ArticleAuthors;
  let title: O.Option<SanitisedHtmlFragment>;
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

    abstract = getAbstract(parsedXml);
    if (O.isNone(abstract)) {
      logger('warn', 'build-expression-front-matter-from-crossref-work: Unable to find abstract', { expressionDoi, crossrefWorkXml });
    }

    title = getTitle(parsedXml);
    if (O.isNone(title)) {
      logger('error', 'build-expression-front-matter-from-crossref-work: Unable to find title', { expressionDoi, crossrefWorkXml });
      return E.left(DE.unavailable);
    }
  } catch (error: unknown) {
    logger('error', 'build-expression-front-matter-from-crossref-work: Unable to parse document', { expressionDoi, crossrefWorkXml, error });
    return E.left(DE.unavailable);
  }
  return E.right({
    abstract,
    title: title.value,
    authors,
  });
};
