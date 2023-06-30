import { useGameProvider } from "../context/gameContext"


export default ():React.ReactElement => {
  const {dispatch} = useGameProvider(); 
  
  return <div id="header">
    <h1>Wordle</h1>

    <div className="retry-button" onClick={() => dispatch({type: 'retry'})}>Recommencer</div>
  </div>
}