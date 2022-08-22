import { arbitraryUserId } from './user-id.helper';
import * as LOID from '../../src/types/list-owner-id';

type ArbitraryListOwnerId = () => LOID.ListOwnerId;

export const arbitraryListOwnerId: ArbitraryListOwnerId = () => LOID.fromUserId(arbitraryUserId());
