import { GetEndorsements } from './render-endorsements';
import Doi from '../types/doi';

export type GetEndorsement = (doi: Doi) => Promise<{
  date: Date,
  title: string,
  content: string,
}>;

export default (
  getEndorsement: GetEndorsement,
): GetEndorsements => (
  async (doi) => {
    if (doi.value === '10.1101/2020.06.03.20119925') {
      return [
        await getEndorsement(new Doi('10.24072/pci.evolbiol.100107')),
      ];
    }
    return [];
  }
);
