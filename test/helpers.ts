import { Doi } from '../src/types/doi';

export const arbitraryDoi = (): Doi => new Doi('10.1101/arbitrary.doi.1');

export const arbitraryString = (): string => 'Lorem ipsum';

export const arbitraryUri = (): string => 'http://something.com/example';

export const arbitraryTextLongerThan = (min: number): string => 'xy '.repeat(min);
