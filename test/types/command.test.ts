import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryDoi } from './doi.helper';
import { arbitraryReviewId } from './review-id.helper';
import { CommandFromString } from '../../src/types/command';

describe('command', () => {
  it('encodes and decodes SaveArticle tranparently', () => {
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

  it('encodes and decodes respond-helpful tranparently', () => {
    const command = {
      type: 'respond-helpful' as const,
      reviewId: arbitraryReviewId(),
    };

    const result = pipe(
      command,
      CommandFromString.encode,
      CommandFromString.decode,
    );

    expect(result).toStrictEqual(E.right(command));
  });
});
