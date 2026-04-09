import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useResetPasswordMutation } from '../features/Auth/PasswordResetApi'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const [resetPassword] = useResetPasswordMutation()

  const [email] = useState(location.state?.email || '')
  const [otp] = useState(location.state?.otp || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    // Redirect if OTP not verified or email missing
    if (!email || !otp) {
      navigate('/forgot-password')
    }
  }, [email, otp, navigate])

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = 'Password must contain a lowercase letter'
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Password must contain an uppercase letter'
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain a number'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await resetPassword({
        email,
        otp,
        newPassword: password,
      }).unwrap()
      setSubmitted(true)
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      setGeneralError(error?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/\d/.test(pwd)) strength++
    if (/[^a-zA-Z\d]/.test(pwd)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600', 'text-green-700']

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <motion.div
          className="w-full max-w-md"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Back Button */}
            <motion.button
              onClick={() => navigate('/verify-otp', { state: { email } })}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>

            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Create New Password</h1>
              <p className="text-slate-600">Set a new password for your account</p>
            </motion.div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                variants={fadeInUp}
                className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Password reset successfully!</p>
                  <p className="text-sm text-green-700 mt-1">Redirecting to login...</p>
                </div>
              </motion.div>
            )}

            {/* General Error */}
            {generalError && !submitted && (
              <motion.div
                variants={fadeInUp}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{generalError}</p>
              </motion.div>
            )}

            {/* Form */}
            {!submitted && (
              <motion.form onSubmit={handleSubmit} className="space-y-6" variants={fadeInUp}>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-900">
                    New Password
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
                  {password && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            passwordStrength === 0 ? 'w-0' :
                            passwordStrength === 1 ? 'w-1/5 bg-red-500' :
                            passwordStrength === 2 ? 'w-2/5 bg-orange-500' :
                            passwordStrength === 3 ? 'w-3/5 bg-yellow-500' :
                            passwordStrength === 4 ? 'w-4/5 bg-blue-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${strengthColors[Math.max(0, passwordStrength - 1)]}`}>
                        {strengthLabels[Math.max(0, passwordStrength - 1)]}
                      </span>
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
                      placeholder="Confirm your password"
                      className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 transition-colors ${
                        errors.confirmPassword
                          ? 'border-red-300 bg-red-50'
                          : confirmPassword && confirmPassword === password
                          ? 'border-green-300 bg-green-50'
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
                  {confirmPassword && confirmPassword === password && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      ✓ Passwords match
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Password requirements:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li className={password.length >= 8 ? 'text-green-600' : ''}>✓ At least 8 characters</li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>✓ Lowercase letter</li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>✓ Uppercase letter</li>
                    <li className={/\d/.test(password) ? 'text-green-600' : ''}>✓ Number</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Footer CTA */}
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-slate-600">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
