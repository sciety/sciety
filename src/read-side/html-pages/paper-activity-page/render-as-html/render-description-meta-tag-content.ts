import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { toDisplayString } from '../../shared-components/date';
import { ViewModel } from '../view-model';

export const renderDescriptionMetaTagContent = (viewmodel: ViewModel): string => `${viewmodel.evaluationCount} evaluations
${pipe(viewmodel.latestVersion, O.match(constant(''), (latestVersion) => `Latest version ${toDisplayString(latestVersion)}`))}
${pipe(viewmodel.latestActivity, O.match(constant(''), (latestActivity) => `Latest activity ${toDisplayString(latestActivity)}`))}`;
