import { createFetchAbstractFromCrossref, MakeHttpRequest } from '../../src/api/fetch-article';
import Doi from '../../src/data/doi';

describe('fetch-abstract-from-crossref', (): void => {
  it('extracts the abstract text from the XML response', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record>
    <crossref>
      <posted_content>
        <abstract>
          Some random nonsense.
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.stringContaining('Some random nonsense.'));
  });

  it('removes the title if present', async () => {
    const doi = new Doi('10.1101/339747');
    const makeHttpRequest: MakeHttpRequest = async () => `
<?xml version="1.0" encoding="UTF-8"?>
<doi_records>
  <doi_record>
    <crossref>
      <posted_content>
        <abstract>
          <title>Abstract</title>
          Some random nonsense.
        </abstract>
      </posted_content>
    </crossref>
  </doi_record>
</doi_records>
`;
    const abstract = await createFetchAbstractFromCrossref(makeHttpRequest)(doi);

    expect(abstract).toStrictEqual(expect.not.stringContaining('Abstract'));
  });
});
