// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports-ts
import { DOMParser } from '@xmldom/xmldom';
import { load } from 'cheerio';
import { XMLParser } from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
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

const personNameCodec = t.strict({
  given_name: tt.optionFromNullable(t.string),
  surname: tt.optionFromNullable(t.string),
  '@_contributor_role': t.string,
});

const organizationCodec = t.strict({
  '#text': t.string,
  '@_contributor_role': t.string,
});

const orgOrPersonCodec = t.union([organizationCodec, personNameCodec]);

const commonFrontmatterCodec = t.strict({
  titles: t.readonlyArray(t.strict({
    title: t.string,
  })),
  abstract: tt.optionFromNullable(t.string),
  contributors: tt.optionFromNullable(
    t.strict({
      _org_or_person: t.readonlyArray(orgOrPersonCodec),
    }),
  ),
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

const constructAuthorName = (author: t.TypeOf<typeof orgOrPersonCodec>) => {
  if ('given_name' in author) {
    if (O.isNone(author.surname)) {
      return O.none;
    }
    const given = pipe(
      author.given_name,
      O.match(() => '', (value) => `${value} `),
    );
    return O.some(`${given}${author.surname.value}`);
  }
  return O.some(author['#text']);
};

const getAuthors = (commonFrontmatter: CommonFrontMatter): ArticleAuthors => pipe(
  commonFrontmatter.contributors,
  O.map((contributors) => contributors._org_or_person),
  O.map(RA.filter((person) => person['@_contributor_role'] === 'author')),
  O.chain(O.traverseArray(constructAuthorName)),
  O.map(RA.map((name) => name.replace(/<[^>]*>/g, ''))),
);

const parser = new XMLParser({
  stopNodes: ['*.title', '*.abstract', '*.given_name', '*.surname'],
  transformTagName: (tagName) => ((['organization', 'person_name']).includes(tagName) ? '_org_or_person' : tagName),
  ignoreAttributes: (aName) => aName !== 'contributor_role',
  isArray: (tagNameOfItem) => ['_org_or_person', 'titles'].includes(tagNameOfItem),
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
