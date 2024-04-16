import { arbitraryGroupId } from './group-id.helper';
import { arbitraryUserId } from './user-id.helper';
import * as LOID from '../../src/types/list-owner-id';
import { arbitraryNumber } from '../helpers';

type ArbitraryListOwnerId = () => LOID.ListOwnerId;

export const arbitraryListOwnerId: ArbitraryListOwnerId = () => {
  const choice = arbitraryNumber(0, 1);
  return choice === 0 ? LOID.fromUserId(arbitraryUserId()) : LOID.fromGroupId(arbitraryGroupId());
};
