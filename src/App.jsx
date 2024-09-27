import NotePage from './pages/NotePage.JSX'
import NotProvider from "./context/NoteContext";

function App() {

  return (
    <div id='app'>
      <NotProvider>
        <NotePage />
      </NotProvider>
    </div>
  )
}

export default App
