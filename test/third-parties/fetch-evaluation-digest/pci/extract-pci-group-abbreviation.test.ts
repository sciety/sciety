import * as E from 'fp-ts/Either';
import { extractPciGroupAbbreviation } from '../../../../src/third-parties/fetch-evaluation-digest/pci/extract-pci-group-abbreviation';

describe('extract-pci-group-abbreviation', () => {
  describe('given supported input', () => {
    describe.each([
      ['10.24072/pci.neuro.100228.rev21', 'neuro'],
      ['10.24072/pci.evolbiol.100128', 'evolbiol'],
      ['10.24072/pci.archaeo.100459', 'archaeo'],
      ['doi:10.24072/pci.zool.100006.d2', 'zool'],
    ])('%s', (input, expectedAbbreviation) => {
      it('extracts the abbreviation', () => {
        const result = extractPciGroupAbbreviation(input);

        expect(result).toStrictEqual(E.right(expectedAbbreviation));
      });
    });
  });
});
