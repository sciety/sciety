import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';

const arbitraryNumber = (min: number, max: number): number => (
  Math.floor(Math.random() * (max - min + 1) + min)
);

export const arbitraryWord = (length: number): string => (
  [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
);

export const arbitraryString = (): string => pipe(
  [...Array(arbitraryNumber(3, 20))],
  A.map(() => arbitraryNumber(2, 10)),
  A.map((n) => arbitraryWord(n)),
).join(' ');

export const arbitraryUri = (): string => 'http://something.com/example';

export const arbitraryTextLongerThan = (min: number): string => 'xy '.repeat(min);

export const arbitraryDate = (): Date => (
  new Date(`${arbitraryNumber(2000, 2021)}-${arbitraryNumber(1, 12)}-${arbitraryNumber(1, 28)}`)
);
