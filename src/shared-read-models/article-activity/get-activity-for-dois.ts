import { DomainEvent } from '../../domain-events';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

type GetActivityForDois = (dois: ReadonlyArray<Doi>)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<ArticleActivity>;

// ts-unused-exports:disable-next-line
export const getActivityForDois: GetActivityForDois = () => () => [];
