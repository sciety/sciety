import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryDoi } from './doi.helper';
import { CommandFromString } from '../../src/types/command';

describe('command', () => {
  it('encodes and decodes tranparently', () => {
    const command = {
      type: 'SaveArticle' as const,
      articleId: arbitraryDoi(),
    };

    const result = pipe(
      command,
      CommandFromString.encode,
      CommandFromString.decode,
    );

    expect(result).toStrictEqual(E.right(command));
  });
});
