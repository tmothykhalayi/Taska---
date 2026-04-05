import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, MapPin } from 'lucide-react'
import type { LocationProfile } from './LocationCard'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  location: LocationProfile | null
}

export function BookingModal({ isOpen, onClose, location }: BookingModalProps) {
  if (!location) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  Book Your Session
                </h2>
                <p className="text-sm text-slate-600 mt-1">{location.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Coach Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-slate-700">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm">{location.name}</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-700">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm">${location.sessionRate}/hour</span>
              </div>

              {location.specializations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {location.specializations.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="space-y-4 mb-6">
              {/* Session Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Session Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Session Focus */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Focus (Optional)
                </label>
                <textarea
                  placeholder="e.g., Help with project planning, weekly goals, habit building..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Book Session
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
