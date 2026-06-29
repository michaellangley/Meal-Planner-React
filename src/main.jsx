import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { PlannerProvider } from './context/PlannerContext.jsx'



createRoot(document.getElementById('root')).render(
<StrictMode>
  <BrowserRouter>
    <FavoritesProvider>
      <PlannerProvider>
        <App />
      </PlannerProvider>
    </FavoritesProvider>
  </BrowserRouter>
</StrictMode>,
)