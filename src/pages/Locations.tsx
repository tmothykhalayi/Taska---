import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, CheckCircle2, Clock, AlertCircle, Trophy } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
  category: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish and submit the Q2 project proposal to stakeholders',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2026-04-10',
    category: 'Work',
  },
  {
    id: '2',
    title: 'Review team presentation',
    description: 'Go through the slides for the upcoming client meeting',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-04-08',
    category: 'Work',
  },
  {
    id: '3',
    title: 'Finish React course module',
    description: 'Complete module 5 of the React mastery course',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2026-04-15',
    category: 'Learning',
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update API docs with new endpoints',
    priority: 'low',
    status: 'pending',
    dueDate: '2026-04-20',
    category: 'Work',
  },
  {
    id: '5',
    title: 'Morning workout',
    description: '30 min running + stretching routine',
    priority: 'medium',
    status: 'completed',
    dueDate: '2026-04-05',
    category: 'Health',
  },
]

export function Locations() {
  const [tasks] = useState<Task[]>(mockTasks)
  const [filter, setFilter] = useState<string>('all')

  const filteredTasks =
    filter === 'all'
      ? tasks
      : tasks.filter((t) => {
          if (filter === 'completed') return t.status === 'completed'
          if (filter === 'pending') return t.status === 'pending'
          if (filter === 'in-progress') return t.status === 'in-progress'
          return true
        })

  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'in-progress':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-slate-50 border-slate-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-green-600 bg-green-50'
    }
  }

  return (
    <div className="w-full">
      <Header />

      {/* Hero/Stats Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Task Dashboard</h1>
              <p className="text-xl text-blue-100">Stay organized and accomplish your goals</p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-blue-100">Completed</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-blue-100">In Progress</p>
                    <p className="text-2xl font-bold">
                      {tasks.filter((t) => t.status === 'in-progress').length}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-blue-100">Pending</p>
                    <p className="text-2xl font-bold">
                      {tasks.filter((t) => t.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-blue-100">Completion</p>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tasks Section */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">All Tasks</h2>
              <p className="text-slate-600">Manage and track your tasks</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Task
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', 'pending', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Tasks Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {filteredTasks.map((task) => (
              <motion.div key={task.id} variants={fadeInUp}>
                <Card
                  hover
                  className={`h-full border-l-4 
                  ${
                    task.status === 'completed'
                      ? 'border-l-green-500'
                      : task.status === 'in-progress'
                        ? 'border-l-blue-500'
                        : 'border-l-slate-400'
                  }
                  ${getStatusColor(task.status)}`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-600">{task.description}</p>
                    </div>
                    {task.status === 'completed' && (
                      <div className="ml-2">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                      {task.category}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{task.dueDate}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredTasks.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600 mb-4">No tasks in this category</p>
              <Button variant="secondary">Create Your First Task</Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
