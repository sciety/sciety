import * as TE from 'fp-ts/TaskEither';

export const stubbedFetchData = (
  stubbedResponse: unknown,
) => <D>(): TE.TaskEither<never, D> => TE.right(stubbedResponse as unknown as D);
