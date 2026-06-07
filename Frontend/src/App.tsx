import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage.tsx'
import { AppHeader } from './components/layout/AppHeader.tsx'
import { AppFooter } from './components/layout/AppFooter.tsx'
import QuestionnairePage from './pages/QuestionnairePage.tsx'
function App() {

  return (
    <BrowserRouter>
    <AppHeader/>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/questionnaire' element={<QuestionnairePage/>}/>
    </Routes>
    <AppFooter/>
    </BrowserRouter>
  )
}

export default App
