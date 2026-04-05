import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Award,
  Zap,
  TrendingUp,
  Users,
  Lightbulb,
  Trophy,
} from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.6,
  },
}
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
export function Landing() {
  return (
    <div className="w-full">
      <Header />
      {/* Hero Section */}
      <section className="relative min-h-[900px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"
            alt="Productivity and goals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/85 to-blue-900/80"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto py-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              variants={fadeInUp}
            >
              Master your tasks,{' '}
              <span className="text-blue-400">transform your life</span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed"
              variants={fadeInUp}
            >
              Taska is the task management app that combines productivity with
              psychological motivation. Complete tasks, earn badges, build
              consistent habits, and unlock your full potential.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/locations">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg px-8 py-4 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-linear-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why choose <span className="text-blue-600">Taska</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Unlike other task managers, Taska bridges productivity and behavioral
              psychology to keep you motivated and consistent.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full transition-all duration-300 hover:shadow-2xl bg-white border-t-4 border-blue-600">
                <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Smart Task Management
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Create, organize, and track tasks with ease. Prioritize what matters,
                  set deadlines, and watch your productivity soar.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full transition-all duration-300 hover:shadow-2xl bg-white border-t-4 border-purple-600">
                <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">
                  Earn Badges & Rewards
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Complete tasks and unlock achievement badges. Celebrate milestones
                  and build momentum with our reward system.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full transition-all duration-300 hover:shadow-2xl bg-white border-t-4 border-green-600">
                <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  Daily Inspiration
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Get personalized daily quotes and motivation. Stay inspired
                  to accomplish your goals consistently.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80"
            alt="Team productivity"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Build Lasting Habits
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Designed for students, professionals, and entrepreneurs
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            variants={staggerContainer}
          >
            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  Boost Productivity
                </h3>
                <p className="text-slate-600">
                  Organize your workload and focus on high-impact tasks. Clear priorities
                  lead to faster completion and better results.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  Track Progress
                </h3>
                <p className="text-slate-600">
                  Visualize your accomplishments with detailed progress reports. Watch
                  your productivity metrics improve over time.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  Stay Motivated
                </h3>
                <p className="text-slate-600">
                  Every completed task brings you closer to badges and milestones.
                  Feel the satisfaction of consistent achievement.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl"
              variants={fadeInUp}
            >
              <div className="bg-blue-50 p-3 rounded-lg shrink-0">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  Join a Community
                </h3>
                <p className="text-slate-600">
                  Connect with students, professionals, and entrepreneurs all working
                  toward their goals with Taska.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Productivity?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Start managing your tasks with Taska today. Completely free to begin.
              No credit card required.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-10 py-4 bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Your Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
