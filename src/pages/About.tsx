
import { Header } from '../components/layout/Header'
import { Card } from '../components/ui/Card'
import { Heart, Target, Users, Brain, Trophy, Lightbulb, Zap, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
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
    duration: 0.5,
  },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function About() {
  return (
    <div className="w-full">
      <Header />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[800px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"
            alt="Productivity and goals"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-slate-900/80 to-blue-900/70"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center py-20"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Taska
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            We're revolutionizing task management by combining productivity tools with behavioral psychology to keep you motivated, consistent, and successful.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center bg-linear-to-br from-blue-50 to-white border-t-4 border-blue-600">
                <div className="bg-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Transform productivity through psychology. We empower students, professionals, and entrepreneurs to master their tasks while building sustainable habits and achieving their full potential.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center bg-linear-to-br from-purple-50 to-white border-t-4 border-purple-600">
                <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-3">
                  Our Approach
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Grounded in behavioral psychology, we combine task management with gamification, daily motivation, and community support to keep you engaged and consistent.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center bg-linear-to-br from-green-50 to-white border-t-4 border-green-600">
                <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  Our Promise
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Simple, intuitive task management. Meaningful rewards. Daily inspiration. A supportive community. Everything you need to become the best version of yourself.
                </p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Story Section */}
          <motion.div
            className="max-w-3xl mx-auto bg-linear-to-br from-blue-50 via-white to-slate-50 rounded-2xl p-8 md:p-12 shadow-lg border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-1 h-12 bg-blue-600 mr-4 rounded-full"></span>
              Our Story
            </h2>
            <div className="space-y-5 text-slate-700 leading-relaxed text-lg">
              <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-blue-600 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                Taska was born in 2024 from a realization: millions of people struggle to manage their tasks not because they lack tools, but because they lack motivation. We saw incredible task management apps that felt cold and mechanical—no connection to human psychology, no celebration of progress, no real sense of community.
              </p>
              <p>
                Our founders, passionate about both <span className="font-semibold text-blue-700">productivity and behavioral psychology</span>, created Taska to be different. We believed that task management should be more than just checking boxes—it should be a transformative experience that builds confidence, celebrates growth, and fosters lasting habits.
              </p>
              <p>
                Today, thousands of users trust Taska to help them master their tasks, earn badges, and transform their lives. From college students managing coursework to entrepreneurs scaling their businesses to professionals balancing work and life, Taska has become more than an app—it's a companion in your success journey.
              </p>
              <p className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg italic">
                Whether you're tackling a simple daily checklist or orchestrating a major life goal, Taska is here to keep you motivated, productive, and inspired every single day. Your success is our mission.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-linear-to-br from-slate-100 to-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              What Sets Taska Apart
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover the Taska difference with our commitment to psychology-driven task management
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-blue-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <Brain className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                      Psychology-Based
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-blue-700">Built on behavioral science</span>, every feature is designed to leverage motivation, habit formation, and the psychology of progress to keep you engaged.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-green-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <Trophy className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-3">
                      Gamification System
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-green-700">Earn real achievements.</span> Complete tasks, unlock badges, climb leaderboards, and celebrate every milestone on your journey to mastery.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-purple-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <Lightbulb className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900 mb-3">
                      Daily Inspiration
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-purple-700">Start every day motivated.</span> Personalized quotes, motivational insights, and reminders keep your mindset positive and your goals in focus.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full shadow-lg bg-white border-l-4 border-orange-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900 mb-3">
                      Community Support
                    </h3>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-orange-700">You're not alone.</span> Join thousands of task masters in our supportive community dedicated to growth, consistency, and mutual encouragement.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
