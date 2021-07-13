import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { toDisplayString } from '../../shared-components/date';

export type MetaDescription = {
  evaluationCount: number,
  latestVersion: O.Option<Date>,
  latestActivity: O.Option<Date>,
};

export const renderDescriptionMetaTagContent = (meta: MetaDescription): string => `${meta.evaluationCount} evaluations
${pipe(meta.latestVersion, O.fold(constant(''), (latestVersion) => `Latest version ${toDisplayString(latestVersion)}`))}
${pipe(meta.latestActivity, O.fold(constant(''), (latestActivity) => `Latest activity ${toDisplayString(latestActivity)}`))}`;
