import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { OtpInput } from '../components/ui/OtpInput'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError('')

    if (!otp) {
      setError('Reset code is required')
      return
    }

    if (otp.length !== 6) {
      setError('Reset code must be 6 digits')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Add API call to verify OTP
      // For now, we'll just proceed to the next step
      // await verifyOTP({ email, otp }).unwrap()

      // Navigate to password reset with OTP verified
      navigate('/reset-password', {
        state: { email, otp, otpVerified: true },
      })
    } catch (error: any) {
      setGeneralError(error?.data?.message || 'Invalid OTP. Please try again.')
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
              onClick={() => navigate('/forgot-password')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-semibold"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>

            {/* Header */}
            <motion.div variants={fadeInUp} className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Verify Your Identity</h1>
              <p className="text-slate-600">Enter the code sent to your email</p>
              <p className="text-sm text-slate-500">{email}</p>
            </motion.div>

            {/* General Error */}
            {generalError && (
              <motion.div
                variants={fadeInUp}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{generalError}</p>
              </motion.div>
            )}

            {/* Form */}
            <motion.form onSubmit={handleVerifyOtp} className="space-y-6" variants={fadeInUp}>
              {/* OTP Input */}
              <OtpInput
                value={otp}
                onChange={(value) => {
                  setOtp(value)
                  setError('')
                }}
                error={error}
                length={6}
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Continue'
                )}
              </motion.button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </motion.form>

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
