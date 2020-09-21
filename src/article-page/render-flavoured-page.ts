type Flavour = 'a';

type RenderFlavouredPage = (flavour: Flavour) => string;

export default (): RenderFlavouredPage => (
  (flavour) => `
  Flavoured page of flavour ${flavour}
  `
);
