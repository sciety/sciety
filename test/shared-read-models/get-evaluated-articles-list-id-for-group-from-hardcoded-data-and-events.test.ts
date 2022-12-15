import * as O from 'fp-ts/Option';
import { getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents } from '../../src/shared-read-models/get-evaluated-articles-list-id-for-group-from-hardcoded-data-and-events';
import * as Gid from '../../src/types/group-id';
import * as Lid from '../../src/types/list-id';

describe('get-evaluated-articles-list-id-for-group-from-hardcoded-data-and-events', () => {
  describe('given a group Id for which the information is hard coded', () => {
    const knownHardcodedListId = Lid.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952');
    const knownHardcodedGroupId = Gid.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2');

    const result = getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents(knownHardcodedGroupId);

    it('returns the list Id', () => {
      expect(result).toStrictEqual(O.some(knownHardcodedListId));
    });
  });

  describe('given a group Id for which the information is stored in an event', () => {
    it.todo('returns the list Id');
  });

  describe('given a group Id for which no evaluated articles list is known', () => {
    it.todo('returns nothing');
  });
});
