import { getAnnotationContentByUserListTarget } from '../../../src/shared-read-models/annotations';
import { Doi } from '../../../src/types/doi';
import { toUserId } from '../../../src/types/user-id';

describe('get-annotation-content-by-user-list-target', () => {
  describe('when an article in the AvasthiReading list has been annotated', () => {
    const annotationContent = 'Interesting role for ARP2/3 complex in peroxisome autophagy in plants!';
    const result = getAnnotationContentByUserListTarget(
      new Doi('10.1101/2022.04.07.487451'),
      toUserId('1412019815619911685'),
    )([]);

    it('returns the annotation content as HTML', () => {
      expect(result).toBe(annotationContent);
    });
  });

  describe('when an article in the AvasthiReading list has not been annotated', () => {
    it.todo('returns undefined');
  });

  describe('when an article in any other list is the target', () => {
    it.todo('returns undefined');
  });
});
