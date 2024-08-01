import { Dependencies } from '../discover-published-evaluations';

export type SelectedPage = { rows: number, offset: number };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const determinePagesToSelect = (dependencies: Dependencies): ReadonlyArray<SelectedPage> => [
  { rows: 1000, offset: 0 },
  { rows: 1000, offset: 1000 },
];
