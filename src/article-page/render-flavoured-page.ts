type RenderFlavouredPage = (flavour: string) => string;

export default (): RenderFlavouredPage => (
  (flavour) => `
  Flavoured page of flavour ${flavour}
  `
);
