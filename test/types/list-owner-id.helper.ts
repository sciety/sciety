import { arbitraryUserId } from './user-id.helper.js';
import * as LOID from '../../src/types/list-owner-id.js';
import { arbitraryNumber } from '../helpers.js';
import { arbitraryGroupId } from './group-id.helper.js';

type ArbitraryListOwnerId = () => LOID.ListOwnerId;

export const arbitraryListOwnerId: ArbitraryListOwnerId = () => {
  const choice = arbitraryNumber(0, 1);
  return choice === 0 ? LOID.fromUserId(arbitraryUserId()) : LOID.fromGroupId(arbitraryGroupId());
};
