import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { toDisplayString } from '../../../shared-components/date.js';
import { ViewModel } from '../view-model.js';

export const renderDescriptionMetaTagContent = (viewmodel: ViewModel): string => `${viewmodel.evaluationCount} evaluations
${pipe(viewmodel.latestVersion, O.fold(constant(''), (latestVersion) => `Latest version ${toDisplayString(latestVersion)}`))}
${pipe(viewmodel.latestActivity, O.fold(constant(''), (latestActivity) => `Latest activity ${toDisplayString(latestActivity)}`))}`;
