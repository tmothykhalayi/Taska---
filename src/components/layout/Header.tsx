import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'
import { CheckCheck, Menu, X, ChevronDown } from 'lucide-react'
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false)
  const location = useLocation()
  const navLinks = [
    {
      path: '/',
      label: 'Home',
    },
    {
      path: '/about',
      label: 'About',
    },
    {
      path: '/contact',
      label: 'Support',
    },
  ]
  
  const dashboards = [
    {
      path: '/dashboard/customer',
      label: 'Customer Dashboard',
      description: 'Manage your tasks',
    },
    {
      path: '/dashboard/admin',
      label: 'Admin Dashboard',
      description: 'System overview',
    },
  ]
  
  const isActive = (path: string) => location.pathname === path
  const isDashboardActive = location.pathname.includes('/dashboard')
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 mb-8">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <CheckCheck className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">Taska</span>
              <span className="text-xs text-slate-500 leading-none">Master Your Tasks</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Dashboards Dropdown */}
            <div className="relative group">
              <button className={`text-sm font-medium transition-colors flex items-center gap-1 ${isDashboardActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                Dashboards
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                {dashboards.map((dashboard) => (
                  <Link
                    key={dashboard.path}
                    to={dashboard.path}
                    className="flex flex-col px-4 py-3 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className={`text-sm font-medium ${isActive(dashboard.path) ? 'text-blue-600' : 'text-slate-900'}`}>
                      {dashboard.label}
                    </span>
                    <span className="text-xs text-slate-500">{dashboard.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium ${isActive(link.path) ? 'text-blue-600' : 'text-slate-600'}`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Dashboards */}
              <div className="py-2 border-t border-slate-200">
                <button
                  onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                  className={`text-base font-medium flex items-center gap-2 ${isDashboardActive ? 'text-blue-600' : 'text-slate-600'}`}
                >
                  Dashboards
                  <ChevronDown className={`w-4 h-4 transition-transform ${dashboardDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dashboardDropdownOpen && (
                  <div className="pl-4 mt-3 space-y-3">
                    {dashboards.map((dashboard) => (
                      <Link
                        key={dashboard.path}
                        to={dashboard.path}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setDashboardDropdownOpen(false)
                        }}
                        className={`flex flex-col text-sm ${isActive(dashboard.path) ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
                      >
                        <span>{dashboard.label}</span>
                        <span className="text-xs text-slate-500">{dashboard.description}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
