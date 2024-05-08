import * as O from 'fp-ts/Option';
import { ViewModel } from './view-model';

export const validationRecoveryTitlePrefix = (recovery: ViewModel, title: string): string => `${O.isSome(recovery) ? 'Error: ' : ''}${title}`;
