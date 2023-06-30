import Header from './Header'; 
import Grid from './Grid';
import Keyboard from './Keyboard';
import {GameProvider} from '../context/gameContext';

export default ():React.ReactElement => {
  return <GameProvider>
    <Header/>
    <Grid/>
    <Keyboard/>
  </GameProvider>
}