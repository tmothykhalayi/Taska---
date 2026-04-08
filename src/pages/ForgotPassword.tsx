import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { useForgotPasswordMutation } from '../features/Auth/PasswordResetApi'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export function ForgotPassword() {
  const navigate = useNavigate()
  const [forgotPassword] = useForgotPasswordMutation()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const validateForm = () => {
    const newErrors: { email?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
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
      await forgotPassword({ email }).unwrap()
      setSubmitted(true)
      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 2000)
    } catch (error: any) {
      setGeneralError(error?.data?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </motion.button>

            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Reset Your Password</h1>
              <p className="text-slate-600">Enter your email to receive a password reset code</p>
            </motion.div>

            {/* Success Message */}
            {submitted && (
              <motion.div
                variants={fadeInUp}
                className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">Email sent successfully!</p>
                  <p className="text-sm text-green-700 mt-1">Check your email for the reset code.</p>
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

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">📧 How it works:</span> We'll send a reset code to your email. 
                    Use that code to create a new password.
                  </p>
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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Code'
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

          {/* Help Text */}
          <motion.div variants={fadeInUp} className="mt-8 text-center text-sm text-slate-600">
            <p>Don't receive the email? Check your spam folder or{' '}
              <a href="mailto:support@taska.app" className="text-blue-600 hover:text-blue-700 font-semibold">
                contact support
              </a>
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
