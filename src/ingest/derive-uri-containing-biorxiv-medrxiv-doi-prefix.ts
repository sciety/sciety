import * as E from 'fp-ts/Either';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deriveUriContainingBiorxivMedrxivDoiPrefix = (uri: string): E.Either<string, string> => E.left('Unable to derive a URI containing the full DOI.');
