export enum LetterStatus {Unknown, Correct, Incorrect, NotPresent}
export type letterType = {letter: string | null, status: LetterStatus};
export type rowType = {letters: letterType[]};
export type GameStateType = {
  currentRowIndex: number,
  gameRows: rowType[]
}

export type ActionType = {
  type: string,
  value?: string
}
export type Dispatch = (action: ActionType) => void