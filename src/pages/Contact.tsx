import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

import { Mail, Send, Clock, Phone, Headphones, Heart } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { motion } from 'framer-motion'

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

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <div className="w-full">
      <Header />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[800px] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"
            alt="Customer service"
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
            Get in Touch with Taska
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Have questions about task management, gamification, or your Taska journey? Our team is here to support you and help you succeed.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Contact Methods Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center group cursor-pointer">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Call Us</h3>
                <p className="text-slate-600 mb-2">+1 (555) 123-4567</p>
                <p className="text-sm text-slate-500">Available during business hours</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center group cursor-pointer">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Email Us</h3>
                <p className="text-slate-600 mb-2">support@taska.app</p>
                <p className="text-sm text-slate-500">Response within 24 hours</p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full text-center group cursor-pointer">
                <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <Send className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">In-App Support</h3>
                <p className="text-slate-600 mb-2">Message Us</p>
                <p className="text-sm text-slate-500">Direct support in the app</p>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Send us a message</h2>
              <Card className="shadow-lg">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      Message sent successfully!
                    </h3>
                    <p className="text-slate-600 mb-8">
                      Thank you for contacting us. Our team will respond within 24 hours.
                    </p>
                    <Button variant="primary" onClick={() => setSubmitted(false)}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />

                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <Input
                      label="Subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                    />

                    <Input
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your question or feedback..."
                      multiline
                      rows={6}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </motion.div>

            {/* Additional Info & Business Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">About Taska Support</h2>
                <Card className="shadow-lg">
                  <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">We're Here for You</h3>
                  <p className="text-slate-600 mb-4">
                    Our support team is passionate about helping you master your tasks and achieve your goals. Whether you have a technical question or need motivation, we're here to help.
                  </p>
                  <a href="#contact-form" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                    Send us a message below
                    <span className="ml-2">→</span>
                  </a>
                </Card>
              </div>

              <Card className="shadow-lg">
                <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Response Times</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Email Support</span>
                    <span className="font-medium">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In-App Support</span>
                    <span className="font-medium">Within 48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Forum</span>
                    <span className="font-medium">Instant peer help</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 flex items-center">
                    <Headphones className="w-4 h-4 mr-2 text-blue-600" />
                    Active community support 24/7
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quick answers to common questions about Taska
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-blue-50 to-white border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  How do I earn badges in Taska?
                </h3>
                <p className="text-slate-700">
                  Badges are earned by completing tasks, maintaining streaks, and hitting milestones. Each completed task brings you closer to the next badge. Keep building momentum!
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-purple-50 to-white border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Can I organize tasks by category?
                </h3>
                <p className="text-slate-700">
                  Yes! You can create and customize categories for your tasks like Work, Learning, Health, Personal, and more. Filter your dashboard by category to stay organized.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-green-50 to-white border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  What are the priority levels?
                </h3>
                <p className="text-slate-700">
                  Taska uses three priority levels: Low, Medium, and High. Set priorities to focus on what matters most. Color-coded indicators make it easy to see your workload at a glance.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-orange-50 to-white border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  How do daily quotes help motivation?
                </h3>
                <p className="text-slate-700">
                  Every day, Taska provides personalized inspirational quotes designed to keep you motivated and focused. These psychology-backed messages help build consistency and mental resilience.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-teal-50 to-white border-l-4 border-teal-500">
                <h3 className="text-lg font-semibold text-teal-900 mb-3">
                  Can I track my productivity over time?
                </h3>
                <p className="text-slate-700">
                  Yes! Taska shows your completion rate, task trends, and progress analytics. Watch your productivity metrics improve as you build consistent habits and complete more tasks.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card hover className="h-full bg-linear-to-br from-pink-50 to-white border-l-4 border-pink-500">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">
                  Is there a community feature?
                </h3>
                <p className="text-slate-700">
                  Yes! Connect with thousands of task masters in our community. Share your progress, celebrate wins together, and get motivation from others on their productivity journey.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80"
            alt="Productivity"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/95 to-slate-900/90"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Master Your Tasks?
          </h2>
          <p className="text-xl text-slate-200 mb-10 leading-relaxed">
            Join thousands of task masters transforming their lives with Taska. Start your free account today and begin your journey to success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
              <button className="bg-orange-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 text-lg">
                Start Free Today
              </button>
            </a>
            <a href="/locations">
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 text-lg border border-white/20">
                View Dashboard
              </button>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
