describe('to-jats-xml-url-of-publisher', () => {
  describe.each([
    ['10.1099/acmi.0.000530.v1.3', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000530.v1/acmi.0.000530.v1.xml'],
    ['10.1099/acmi.0.000569.v1.4', 'https://www.microbiologyresearch.org/docserver/fulltext/acmi/10.1099/acmi.0.000569.v1/acmi.0.000569.v1.xml'],
  ])('given an ACMI evaluation DOI: %s', () => {
    it.todo('returns an inferred url');
  });
});
