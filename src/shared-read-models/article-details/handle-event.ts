/* eslint-disable no-param-reassign */
import {
  DomainEvent,
} from '../../domain-events';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ArticleDetails = {};

export type ReadModel = Map<string, ArticleDetails>;

export const initialState = (): ReadModel => new Map();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => readmodel;
