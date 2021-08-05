import { pipe } from 'fp-ts/function';
import { arbitraryDoi } from './doi.helper';
import { CommandFromString } from '../../src/types/command';

describe('command', () => {
  it.skip('encodes and decodes tranparently', () => {
    const command = {
      type: 'SaveArticle' as const,
      articleId: arbitraryDoi(),
    };

    const result = pipe(
      command,
      CommandFromString.encode,
      CommandFromString.decode,
    );

    expect(result).toStrictEqual(command);
  });
});
