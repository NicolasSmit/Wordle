import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { LetterStatus, GameStateType, Dispatch, ActionType } from "../@types/global";

const GameContext = createContext<{state: GameStateType; dispatch: Dispatch} | undefined>(undefined); 
const WORDS = ['PIANO', 'LITRE', 'VENDU', 'JAPON', 'BACHE', 'SIROP', 'POULE', 'TASSE', 'ROUTE', 'CHIEN'];

const GameProvider = ({children}) => {
  const [secretWord, setSecretWord] = useState<string>(''); 

  const [state, dispatch] = useReducer(
    gameReducer, 
    {
      currentRowIndex: 0, 
      gameRows: Array.apply(null, Array(6)).map(i => ({letters: Array.apply(null, Array(5)).map(j => ({letter: ' ', status: LetterStatus.Unknown}))}))
    }
  )

  useEffect(() => {
    initSecretWord(); 
  }, []);

  function initSecretWord() {
    let secretNumber = Math.round(Math.random()*10).toString()
    setSecretWord(WORDS[secretNumber]); 
  }

  function gameReducer(state: GameStateType, action: ActionType) {
    if (action.type === 'retry') {
      initSecretWord();

      return {
        currentRowIndex: 0, 
        gameRows: Array.apply(null, Array(6)).map(i => ({letters: Array.apply(null, Array(5)).map(j => ({letter: ' ', status: LetterStatus.Unknown}))}))
      }
    }

    if (action.type === 'click' || action.type === 'keypress') {
      let letter = action.value.toLowerCase();
      let currentRow = [...state.gameRows[state.currentRowIndex].letters];
      const currentAttempt = getWordFromRow(currentRow.map(r => r.letter));
  
      if (letter === 'enter') {
        if (currentAttempt.trim().length < 5) {
          return state;
        }
        else if (currentAttempt === secretWord) {
          currentRow = currentRow.map(letter => (
            {
              ...letter, 
              status: LetterStatus.Correct
            }
          ))

          alert('GAGNÉ !');
          return {
            ...state,
            gameRows: state.gameRows.map((p, i) => i === state.currentRowIndex ? {letters: currentRow} : p)
          }
        }
        else if (state.currentRowIndex === 5) {
          currentRow = currentRow.map((letter, index) => (
            {...letter, 
              status: secretWord[index] === letter.letter ? LetterStatus.Correct : secretWord.indexOf(letter.letter) >= 0 ? LetterStatus.Incorrect : LetterStatus.NotPresent
            }
          ))

          alert('PERDU !')

          return {
            ...state,
            gameRows: state.gameRows.map((p, i) => i === state.currentRowIndex ? {letters: currentRow} : p)
          }
        }
        else {
          currentRow = currentRow.map((letter, index) => (
            {...letter, 
              status: secretWord[index] === letter.letter ? LetterStatus.Correct : secretWord.indexOf(letter.letter) >= 0 ? LetterStatus.Incorrect : LetterStatus.NotPresent
            }
          ))

          return {
            ...state,
            gameRows: state.gameRows.map((p, i) => i === state.currentRowIndex ? {letters: currentRow} : p),
            currentRowIndex: state.currentRowIndex + 1
          }
        }
      }
      else if (letter === 'backspace') {
        let firstEmpty = currentAttempt.indexOf(' ');
        
        if (firstEmpty >= 0)
          currentRow[firstEmpty - 1] = {letter: ' ', status: LetterStatus.Unknown};
        else 
          currentRow[4] = {letter: ' ', status: LetterStatus.Unknown};
  
        return {
          ...state,
          gameRows: state.gameRows.map((p, i) => i === state.currentRowIndex ? {letters: currentRow} : p)
        }
      }
      else if (/^[a-z]$/.test(letter)) {
        if (currentAttempt.trim().length < 5) {
          let firstEmpty = currentAttempt.indexOf(' ');
          currentRow[firstEmpty] = {letter: letter.toUpperCase(), status: LetterStatus.Unknown};
  
          return {
            ...state,
            gameRows: state.gameRows.map((p, i) => i === state.currentRowIndex ? {letters: currentRow} : p)
          }
        }
      }
      else {
        return state;
      }
    }
    return state;
  }

  const value = {state, dispatch};

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

const GameConsumer = ({children}) => {
  return (
    <GameContext.Consumer>
      {(context) => {
        if (context === undefined) {
          throw new Error('GameConsumer must be used within GameProvider');
        }
        return children(context)
      }}
    </GameContext.Consumer>
  )
}

const useGameProvider = () => {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error('useGameProvider must be used within GameProvider');
  return context;
}

export {
  GameProvider,
  GameConsumer,
  useGameProvider
}

const getWordFromRow = (row) => row.join('')