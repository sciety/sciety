import * as O from 'fp-ts/Option';

export const validationRecoveryTitlePrefix = (
  recovery: O.Option<unknown>,
  title: string,
): string => `${O.isSome(recovery) ? 'Error: ' : ''}${title}`;
