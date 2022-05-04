import { pipe } from 'fp-ts/function';
import { annotationCreated } from '../../../src/domain-events';
import { getAnnotationContentByUserListTarget } from '../../../src/shared-read-models/annotations';
import { Doi } from '../../../src/types/doi';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import * as LID from '../../../src/types/list-id';
import { toUserId } from '../../../src/types/user-id';
import { arbitraryHtmlFragment } from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryUserId } from '../../types/user-id.helper';

describe('get-annotation-content-by-user-list-target', () => {
  const avasthiReadingUserId = toUserId('1412019815619911685');

  describe('existing hardcoded behavior', () => {
    describe('when an article in the AvasthiReading list has been annotated', () => {
      const annotationContent = toHtmlFragment('Interesting role for ARP2/3 complex in peroxisome autophagy in plants!');
      const result = getAnnotationContentByUserListTarget(
        new Doi('10.1101/2022.04.07.487451'),
        avasthiReadingUserId,
      )([]);

      it('returns the annotation content as HTML', () => {
        expect(result).toBe(annotationContent);
      });
    });

    describe('when an article in the AvasthiReading list has not been annotated', () => {
      const result = getAnnotationContentByUserListTarget(
        arbitraryArticleId(),
        avasthiReadingUserId,
      )([]);

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when an article in any other user list is the target', () => {
      const result = getAnnotationContentByUserListTarget(
        arbitraryArticleId(),
        arbitraryUserId(),
      )([]);

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

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
        expect(result).toBe(annotationContent);
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

      it('returns undefined', () => {
        expect(result).toBeUndefined();
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

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
