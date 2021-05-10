import { v4 } from 'uuid';
import * as N from '../../src/types/ncrc-id';

export const arbitraryNcrcId = (): N.NcrcId => N.fromString(v4());
