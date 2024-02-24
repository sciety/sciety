import * as DE from '../../src/types/data-error.js';
import { arbitraryBoolean } from '../helpers.js';

export const arbitraryDataError = (): DE.DataError => (arbitraryBoolean() ? DE.unavailable : DE.notFound);
