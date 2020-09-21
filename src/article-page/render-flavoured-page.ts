type Flavour = 'a' | 'b';

type RenderFlavouredPage = (flavour: Flavour) => string;

export default (): RenderFlavouredPage => (
  (flavour) => {
    switch (flavour) {
      case 'a': return 'Flavour A';
      case 'b': return 'Flavour B';
    }
  }
);
