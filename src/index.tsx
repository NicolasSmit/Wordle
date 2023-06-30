import {createRoot} from 'react-dom/client';
import Wordle from './Components/Wordle';

let root = createRoot(document.getElementById('root'))
root.render(<Wordle/>);