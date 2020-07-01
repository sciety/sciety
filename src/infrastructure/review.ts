import { Maybe } from 'true-myth';

export interface Review {
  publicationDate: Maybe<Date>;
  summary: Maybe<string>;
  url: URL;
}
