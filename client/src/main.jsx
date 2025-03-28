// client/src/main.jsx 

import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Toaster } from './components/ui/toaster.jsx'
import { ToastProvider } from '@radix-ui/react-toast'
import './index.css'
import store from './store/store'; // Import the store



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>
   
  </BrowserRouter>,
)
