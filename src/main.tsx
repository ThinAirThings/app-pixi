import ReactDOM from 'react-dom/client'
import { ThinAirRouter } from './views/Router';
import './global.scss'
import { enableMapSet } from 'immer'

enableMapSet()
// Disable right click
window.addEventListener("contextmenu", e => e.preventDefault());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ThinAirRouter/>
)
