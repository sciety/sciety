import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  flow, pipe,
} from 'fp-ts/function';

const groupAbbreviationPatter = /^10.24072\/pci\.([a-z]+)\./;

export const extractPciGroupAbbreviation = (key: string): E.Either<string, string> => pipe(
  groupAbbreviationPatter.exec(key),
  E.fromNullable('regex failure'),
  E.chain(
    flow(
      RA.lookup(1),
      E.fromOption(() => 'no first capture group in regex match'),
    ),
  ),
);
