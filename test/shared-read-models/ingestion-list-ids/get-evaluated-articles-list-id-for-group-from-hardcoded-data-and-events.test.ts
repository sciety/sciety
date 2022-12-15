import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { groupIngestionListIdentified } from '../../../src/domain-events';
import {
  getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents, handleEvent,
  initialState,
} from '../../../src/shared-read-models/ingestion-list-ids';
import * as Gid from '../../../src/types/group-id';
import * as Lid from '../../../src/types/list-id';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';

describe('get-evaluated-articles-list-id-for-group-from-hardcoded-data-and-events', () => {
  describe('given a group Id for which the information is hard coded', () => {
    const knownHardcodedListId = Lid.fromValidatedString('ee7e738a-a1f1-465b-807c-132d273ca952');
    const knownHardcodedGroupId = Gid.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2');

    const result = getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents({})(knownHardcodedGroupId);

    it('returns the list Id', () => {
      expect(result).toStrictEqual(O.some(knownHardcodedListId));
    });
  });

  describe('given a group Id for which the information is stored in an event', () => {
    it.failing('returns the list Id', () => {
      const listId = arbitraryListId();
      const groupId = arbitraryGroupId();
      const readModel = pipe(
        [
          groupIngestionListIdentified(listId, groupId),
        ],
        RA.reduce(initialState(), handleEvent),
      );
      const result = getEvaluatedArticlesListIdForGroupFromHardcodedDataAndEvents(readModel)(groupId);

      expect(result).toStrictEqual(O.some(listId));
    });
  });

  describe('given a group Id for which no evaluated articles list is known', () => {
    it.todo('returns nothing');
  });
});
