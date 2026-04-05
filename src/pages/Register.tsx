import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

interface PasswordStrength {
  score: number
  label: string
  color: string
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const strengths: PasswordStrength[] = [
    { score: 0, label: 'Too weak', color: 'from-red-500 to-red-600' },
    { score: 1, label: 'Weak', color: 'from-orange-500 to-orange-600' },
    { score: 2, label: 'Fair', color: 'from-yellow-500 to-yellow-600' },
    { score: 3, label: 'Good', color: 'from-lime-500 to-lime-600' },
    { score: 4, label: 'Strong', color: 'from-green-500 to-green-600' },
  ]

  return strengths[Math.min(score, 4)]
}

export function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const passwordStrength = calculatePasswordStrength(password)

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
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

      // For demo, save user and redirect
      localStorage.setItem('user', JSON.stringify({ fullName, email, id: Date.now() }))
      localStorage.setItem('token', 'demo-token-' + Date.now())

      navigate('/dashboard/customer')
    } catch (error) {
      setGeneralError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      {/* Registration Section */}
      <main className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 h-screen lg:h-[calc(100vh-4rem)] overflow-hidden">
          {/* Content Side */}
          <div className="hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-12">
            <motion.div className="space-y-8 text-white max-w-md" initial="initial" animate="animate" variants={fadeInUp}>
              {/* Logo/Branding */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="text-5xl font-bold">Taska</div>
                <h2 className="text-4xl font-bold leading-tight">Start Your Productivity Journey</h2>
              </motion.div>

              {/* Features */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-100">What you'll get:</h3>
                <ul className="space-y-3">
                  {[
                    { icon: '🎯', text: 'Intelligent task management' },
                    { icon: '🏆', text: 'Unlock achievements & badges' },
                    { icon: '💡', text: 'Daily motivation & insights' },
                    { icon: '📊', text: 'Track habits & build momentum' },
                    { icon: '🔒', text: 'Secure & privacy-first' },
                  ].map((item, i) => (
                    <motion.li key={i} variants={fadeInUp} className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-blue-50">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={fadeInUp} className="pt-8 border-t border-blue-400">
                <p className="text-sm text-blue-100 mb-3">⭐ Trusted by thousands</p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-blue-400 rounded-full border-2 border-blue-500 flex items-center justify-center text-white text-sm font-bold"
                    >
                      {i}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Quote */}
              <motion.p variants={fadeInUp} className="italic text-blue-100 pt-4">
                "The only way to do great work is to love what you do." – Steve Jobs
              </motion.p>
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto max-h-screen lg:max-h-[calc(100vh-4rem)]">
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
                  <h1 className="text-3xl font-bold text-slate-900">Create Your Account</h1>
                  <p className="text-slate-600">Join thousands mastering their productivity</p>
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
                <motion.form onSubmit={handleSubmit} className="space-y-5" variants={fadeInUp}>
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value)
                          setErrors({ ...errors, fullName: undefined })
                        }}
                        placeholder="John Doe"
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors ${
                          errors.fullName
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-200 bg-white focus:border-blue-500'
                        } focus:outline-none text-slate-900 placeholder-slate-500`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

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
                        placeholder="Create a strong password"
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

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                i < passwordStrength.score
                                  ? `bg-gradient-to-r ${passwordStrength.color}`
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-semibold bg-gradient-to-r ${passwordStrength.color} bg-clip-text text-transparent`}>
                          {passwordStrength.label}
                        </p>
                        <ul className="text-xs text-slate-600 space-y-1">
                          <li className="flex items-center gap-2">
                            {password.length >= 8 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-slate-400" />
                            )}
                            At least 8 characters
                          </li>
                          <li className="flex items-center gap-2">
                            {/[A-Z]/.test(password) ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-slate-400" />
                            )}
                            One uppercase letter
                          </li>
                          <li className="flex items-center gap-2">
                            {/[0-9]/.test(password) ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-slate-400" />
                            )}
                            One number
                          </li>
                        </ul>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-900">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setErrors({ ...errors, confirmPassword: undefined })
                        }}
                        placeholder="Re-enter your password"
                        className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-colors ${
                          errors.confirmPassword
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-200 bg-white focus:border-blue-500'
                        } focus:outline-none text-slate-900 placeholder-slate-500`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className="space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked)
                          setErrors({ ...errors, terms: undefined })
                        }}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 mt-0.5"
                      />
                      <span className="text-sm text-slate-600">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.terms}
                      </p>
                    )}
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
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>
                </motion.form>

                {/* Footer CTA */}
                <motion.div variants={fadeInUp} className="text-center">
                  <p className="text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in here
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
