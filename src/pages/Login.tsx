import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo, just navigate to dashboard
      // In real app, this would authenticate against backend
      localStorage.setItem('user', JSON.stringify({ email, id: Date.now() }))
      localStorage.setItem('token', 'demo-token-' + Date.now())
      
      navigate('/dashboard/customer')
    } catch (error) {
      setGeneralError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      {/* Login Section */}
      <main className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 h-screen lg:h-[calc(100vh-4rem)] overflow-hidden">
          {/* Content Side */}
          <div className="hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12">
            <motion.div className="space-y-8 text-white max-w-md" initial="initial" animate="animate" variants={fadeInUp}>
              {/* Logo/Branding */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="text-5xl font-bold">Taska</div>
                <h2 className="text-4xl font-bold leading-tight">Master Your Tasks, Transform Your Life</h2>
              </motion.div>

              {/* Benefits */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-100">Why join Taska?</h3>
                <ul className="space-y-3">
                  {[
                    { icon: '✓', text: 'Smart task management tailored to your goals' },
                    { icon: '✓', text: 'Earn achievements and motivational badges' },
                    { icon: '✓', text: 'Daily quotes & psychology-driven insights' },
                    { icon: '✓', text: 'Track progress and build unshakeable habits' },
                  ].map((item, i) => (
                    <motion.li key={i} variants={fadeInUp} className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-blue-50">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 pt-8 border-t border-blue-400">
                {[
                  { number: '50K+', label: 'Active Users' },
                  { number: '1M+', label: 'Tasks Completed' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Quote */}
              <motion.p variants={fadeInUp} className="italic text-blue-100">
                "The secret of getting ahead is getting started." – Mark Twain
              </motion.p>
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
            <motion.div
              className="w-full max-w-md"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              {/* Card */}
              <div className="space-y-8">
                {/* Header */}
                <motion.div variants={fadeInUp} className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                  <p className="text-slate-600">Sign in to continue managing your tasks</p>
                </motion.div>

                {/* General Error */}
                {generalError && (
                  <motion.div
                    variants={fadeInUp}
                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{generalError}</p>
                  </motion.div>
                )}

                {/* Form */}
                <motion.form onSubmit={handleSubmit} className="space-y-6" variants={fadeInUp}>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-900">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setErrors({ ...errors, email: undefined })
                        }}
                        placeholder="you@example.com"
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.email
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-200 bg-white focus:border-blue-500'
                        } focus:outline-none text-slate-900 placeholder-slate-500`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setErrors({ ...errors, password: undefined })
                        }}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-colors ${
                          errors.password
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-200 bg-white focus:border-blue-500'
                        } focus:outline-none text-slate-900 placeholder-slate-500`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                      <span className="text-slate-600">Remember me</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </motion.form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or</span>
                  </div>
                </div>

                {/* Social Login (Demo) */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="py-3 px-4 border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-colors font-semibold text-slate-700 flex items-center justify-center gap-2">
                    <span className="text-lg">🔵</span>
                    Google
                  </button>
                  <button className="py-3 px-4 border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-colors font-semibold text-slate-700 flex items-center justify-center gap-2">
                    <span className="text-lg">🔗</span>
                    GitHub
                  </button>
                </div>

                {/* Footer CTA */}
                <motion.div variants={fadeInUp} className="text-center">
                  <p className="text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign up free
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
