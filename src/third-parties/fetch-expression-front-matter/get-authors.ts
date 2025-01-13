import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { orgOrPersonCodec, CommonFrontMatter } from './parser-and-codec';
import { ArticleAuthors } from '../../types/article-authors';

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

export const getAuthors = (commonFrontmatter: CommonFrontMatter): ArticleAuthors => pipe(
  commonFrontmatter.contributors,
  O.map((contributors) => contributors._org_or_person),
  O.map(RA.filter((person) => person['@_contributor_role'] === 'author')),
  O.chain(O.traverseArray(constructAuthorName)),
  O.map(RA.map((name) => name.replace(/<[^>]*>/g, ''))),
);
