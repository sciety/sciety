import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { annotationCreated } from '../../../src/domain-events';
import { getAnnotationContentByUserListTarget } from '../../../src/shared-read-models/annotations-stateless';
import * as LID from '../../../src/types/list-id';
import { userIdCodec } from '../../../src/types/user-id';
import { arbitraryHtmlFragment } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('get-annotation-content-by-user-list-target', () => {
  const avasthiReadingUserId = pipe(
    '1412019815619911685',
    userIdCodec.decode,
    E.getOrElseW(shouldNotBeCalled),
  );

  describe('hardcoded knowledge of user ids and user list ids, but content from events', () => {
    const listIdForAvasthiReadingUser = LID.fromValidatedString('1af5b971-162e-4cf3-abdf-57e3bbfcd0d7');
    const target = {
      articleId: arbitraryArticleId(),
      listId: listIdForAvasthiReadingUser,
    };
    const annotationContent = arbitraryHtmlFragment();
    const events = [annotationCreated(target, annotationContent)];

    describe('when an article in the AvasthiReading list has been annotated', () => {
      const result = pipe(
        events,
        getAnnotationContentByUserListTarget(
          target.articleId,
          avasthiReadingUserId,
        ),
      );

      it('returns the annotation content as HTML', () => {
        expect(result).toStrictEqual(O.some(annotationContent));
      });
    });

    describe('when an article in the AvasthiReading list has not been annotated', () => {
      const result = pipe(
        events,
        getAnnotationContentByUserListTarget(
          arbitraryArticleId(),
          avasthiReadingUserId,
        ),
      );

      it('returns no annotation', () => {
        expect(result).toStrictEqual(O.none);
      });
    });

    describe('when the target refers to a user list that doesn\'t support annotations', () => {
      const result = pipe(
        events,
        getAnnotationContentByUserListTarget(
          target.articleId,
          arbitraryUserId(),
        ),
      );

      it('returns no annotation', () => {
        expect(result).toStrictEqual(O.none);
      });
    });
  });
});
