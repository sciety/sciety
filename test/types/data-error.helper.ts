import * as DE from '../../src/types/data-error';
import { arbitraryBoolean } from '../helpers';

export const arbitraryDataError = (): DE.DataError => (arbitraryBoolean() ? DE.unavailable : DE.notFound);
