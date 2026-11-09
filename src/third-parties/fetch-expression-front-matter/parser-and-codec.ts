import { XMLParser } from 'fast-xml-parser';
import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Logger } from '../../logger';

// Crossref expresses a contributor's role either as a `contributor_role` attribute
// (older deposits) or as one or more `<role type="..."/>` child elements (newer deposits).
const contributorRoleCodec = t.partial({
  '@_contributor_role': t.string,
  role: t.readonlyArray(t.partial({
    '@_type': t.string,
  })),
});

const personNameCodec = t.exact(t.intersection([
  t.type({
    given_name: tt.optionFromNullable(t.string),
    surname: tt.optionFromNullable(t.string),
  }),
  contributorRoleCodec,
]));

const organizationCodec = t.exact(t.intersection([
  t.type({
    '#text': t.string,
  }),
  contributorRoleCodec,
]));

export const orgOrPersonCodec = t.union([organizationCodec, personNameCodec]);

const commonFrontmatterCodec = t.strict({
  titles: t.readonlyArray(t.strict({
    title: t.string,
  })),
  abstract: tt.optionFromNullable(t.readonlyArray(t.string)),
  contributors: tt.optionFromNullable(
    t.strict({
      _org_or_person: t.readonlyArray(orgOrPersonCodec),
    }),
  ),
});

export type CommonFrontMatter = t.TypeOf<typeof commonFrontmatterCodec>;

const postedContentCodec = t.strict({
  posted_content: commonFrontmatterCodec,
});

const journalCodec = t.strict({
  journal: t.strict({
    journal_article: commonFrontmatterCodec,
  }),
});

export const frontMatterCrossrefXmlResponseCodec = t.strict({
  doi_records: t.strict({
    doi_record: t.strict({
      crossref: t.union([
        journalCodec, postedContentCodec,
      ]),
    }),
  }),
}, 'frontMatterCrossrefXmlResponseCodec');

export type JournalOrPostedContent = t.TypeOf<typeof frontMatterCrossrefXmlResponseCodec>['doi_records']['doi_record']['crossref'];

const parser = new XMLParser({
  stopNodes: ['*.title', '*.abstract', '*.given_name', '*.surname'],
  transformTagName: (tagName) => ((['organization', 'person_name']).includes(tagName) ? '_org_or_person' : tagName),
  ignoreAttributes: (aName, jPath) => !(
    aName === 'contributor_role'
    || (aName === 'type' && typeof jPath === 'string' && jPath.endsWith('._org_or_person.role'))
  ),
  isArray: (tagNameOfItem) => ['_org_or_person', 'titles', 'abstract', 'role'].includes(tagNameOfItem),
  parseTagValue: false,
});

export const parseXmlDocument = (
  logger: Logger, contextForLogs: Record<string, unknown>,
) => (s: string): E.Either<string, unknown> => E.tryCatch(
  () => parser.parse(s) as unknown,
  () => {
    logger('error', 'crossref/fetch-expression-front-matter: parser failed to transform XML into JSON object', contextForLogs);
    return 'Failed to parse XML';
  },
);
