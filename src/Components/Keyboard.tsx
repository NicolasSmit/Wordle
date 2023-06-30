import { LetterStatus, rowType } from "../@types/global";
import { useGameProvider } from "../context/gameContext";

function getLetterColor(key: string, rows: rowType[]): string {
  let result = 'darkgray';
  rows.forEach(row => row.letters.forEach(letter => {
    if (letter.letter === key) {
      if (letter.status === LetterStatus.Correct)
        result = 'green'
      else if (letter.status === LetterStatus.Incorrect && result !== 'green')
        result = 'orange'
      else if (letter.status === LetterStatus.NotPresent && (result !== 'green' && result !== 'orange'))
        result = 'dimgrey'
    }
  }))

  return result;
}

export default ():React.ReactElement => {
  const keyboard: string[][] = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["W", "X", "C", "V", "B", "N"]
  ];

  const {state, dispatch} = useGameProvider();

  return <div id="keyboard">
    {keyboard.map((row, rowIndex) => (
      <div className="keyboard-row" key={rowIndex}>
        {row.map((letter, letterIndex) => (
          <div className="keyboard-letter" key={letterIndex} onClick={() => dispatch({type: 'click', value: letter})} style={{backgroundColor: getLetterColor(letter, state.gameRows)}}>
            {letter}
          </div>
        ))}
      </div>
    ))}
  </div>
}