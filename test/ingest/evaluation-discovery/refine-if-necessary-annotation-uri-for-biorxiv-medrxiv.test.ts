describe('refine-if-necessary-annotation-uri-for-biorxiv-medrxiv', () => {
  describe('given the annotation`s uri can be parsed as a url', () => {
    describe('when the uri contains the biorxiv hostname', () => {
      describe('and the uri contains the Cold Spring Harbor Press DOI prefix', () => {
        it.todo('does not refine the uri of the annotation');
      });

      describe('and the uri contains the openrxiv DOI prefix', () => {
        it.todo('does not refine the uri of the annotation');
      });

      describe('and the uri contains neither the DOI prefixes for openrxiv nor Cold Spring Harbor Press', () => {
        it.todo('refines the uri of the annotation');
      });
    });

    describe('when the uri contains the medrxiv hostname', () => {
      describe('and the uri contains the Cold Spring Harbor Press DOI prefix', () => {
        it.todo('does not refine the uri of the annotation');
      });

      describe('and the uri contains the openrxiv DOI prefix', () => {
        it.todo('does not refine the uri of the annotation');
      });

      describe('and the uri contains neither the DOI prefixes for openrxiv nor Cold Spring Harbor Press', () => {
        it.todo('refines the uri of the annotation');
      });
    });

    describe('when the uri does not contain the biorxiv nor medrxiv hostname', () => {
      it.todo('does not refine the uri of the annotation');
    });
  });

  describe('given the annotation\'s uri cannot be parsed as a url', () => {
    it.todo('does not refine the uri of the annotation');
  });
});
