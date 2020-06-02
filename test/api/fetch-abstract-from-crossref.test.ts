import { createFetchAbstractFromCrossref, MakeHttpRequest } from '../../src/api/fetch-article';
import Doi from '../../src/data/doi';

describe('fetch-abstract-from-crossref', (): void => {
  it('returns the abstract for a real DOI', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record>
    <crossref>
      <posted_content>
        <abstract>
          Article abstract text.
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('Article abstract text.'));
  });
});
