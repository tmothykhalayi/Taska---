import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { Landing } from './pages/Landing'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Locations } from './pages/Locations'
import { Blog } from './pages/Blog'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
//import { Dashboard as TaskerDashboard } from './Dashboards/Tasker/Dashboard'
//import { AdminDashboard } from './Dashboards/Admin/Dashboard'
import ErrorBoundary from './components/layout/ErrorBoundary'
import './App.css'

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Routes - To be implemented */}
            {/* <Route path="/dashboard/tasker" element={<TaskerDashboard />} /> */}
            {/* <Route path="/dashboard/admin" element={<AdminDashboard />} /> */}
          </Routes>
        </Router>
      </ErrorBoundary>
    </Provider>
  )
}

export default App
