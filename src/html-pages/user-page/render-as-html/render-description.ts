import { ViewModel } from '../view-model';

const pluralise = (count: number) => (count === 1 ? '' : 's');

export const renderDescription = (viewmodel: ViewModel): string => `${viewmodel.listCount} list${pluralise(viewmodel.listCount)} | Following ${viewmodel.groupIds.length} group${pluralise(viewmodel.groupIds.length)}`;
