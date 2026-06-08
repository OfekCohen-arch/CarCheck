import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage.tsx'
import { AppHeader } from './components/layout/AppHeader.tsx'
import { AppFooter } from './components/layout/AppFooter.tsx'
import QuestionnairePage from './pages/QuestionnairePage.tsx'
import ResultsPage from './pages/ResultsPage.tsx'
import CarCheckPage from './pages/CarCheckPage.tsx'
import { PlateCheckPage } from './pages/PlateCheckPage.tsx'
function App() {

  return (
    <BrowserRouter>
    <AppHeader/>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/questionnaire' element={<QuestionnairePage/>}/>
      <Route path='/results' element={<ResultsPage/>}/>
      <Route path='/car-check' element={<CarCheckPage/>}/>
      <Route path='/plate-check' element={<PlateCheckPage/>}/>
    </Routes>
    <AppFooter/>
    </BrowserRouter>
  )
}

export default App
