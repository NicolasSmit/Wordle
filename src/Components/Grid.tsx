import { useEffect } from "react";
import { useGameProvider } from "../context/gameContext";
import { LetterStatus } from "../@types/global";

export default ():React.ReactElement => {
  const {state, dispatch} = useGameProvider();
  
  function onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return
    }
    dispatch({type: 'keypress', value: e.key})
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
  
  return <div id="grid">
    {state.gameRows.map((row, rowIndex) => (
      <div className="grid-row" key={rowIndex}>
        {row.letters.map((letter, letterIndex) => (
          <div className="grid-letter" key={letterIndex} style={{backgroundColor: letter.status === LetterStatus.Correct ? 'green' : letter.status === LetterStatus.Incorrect ? 'orange' : letter.status === LetterStatus.NotPresent ? 'dimgrey' : 'black'}}>
            {letter.letter}
          </div>
        ))}
      </div>
    ))}
  </div>
}