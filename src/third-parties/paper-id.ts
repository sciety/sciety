export type PaperIdThatIsADoi = string & { readonly PaperIdThatIsADoi: unique symbol };

export type PaperId = PaperIdThatIsADoi;
