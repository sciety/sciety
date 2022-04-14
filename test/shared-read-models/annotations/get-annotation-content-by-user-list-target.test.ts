import { getAnnotationContentByUserListTarget } from '../../../src/shared-read-models/annotations';
import { Doi } from '../../../src/types/doi';
import { toUserId } from '../../../src/types/user-id';
import { arbitraryDoi } from '../../types/doi.helper';

describe('get-annotation-content-by-user-list-target', () => {
  const avasthiReadingUserId = toUserId('1412019815619911685');

  describe('when an article in the AvasthiReading list has been annotated', () => {
    const annotationContent = 'Interesting role for ARP2/3 complex in peroxisome autophagy in plants!';
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
      arbitraryDoi(),
      avasthiReadingUserId,
    )([]);

    it('returns undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when an article in any other list is the target', () => {
    it.todo('returns undefined');
  });
});
