type PaperIdThatIsAUuid = string & { readonly PaperIdThatIsAUuid: unique symbol };

export const isUuid = (input: unknown): input is PaperIdThatIsAUuid => typeof input === 'string' && input.startsWith('uuid:');
