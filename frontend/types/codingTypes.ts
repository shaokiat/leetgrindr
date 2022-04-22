export type CodeState = {
  code: string;
};

export type SaveCode = {
  roomId: string;
  codeState: CodeState;
};

export type ModifiedCode = {
  roomId: string;
  codeState: CodeState;
};

export type OutputType = {
  error: boolean;
  execOutput: string;
};

export type Users = Array<string>;
