import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, CheckCircle2, Clock, Zap, CalendarDays, Target, Flame } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { TaskModal } from '../components/TaskModal'

// Motivational quotes for daily inspiration
const dailyQuotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The only impossible task is the one you never attempt.", author: "Andy Andrews" },
  { text: "Progress over perfection. Every task completed is a victory.", author: "Taska Wisdom" },
  { text: "Your future self will thank you for the tasks you complete today.", author: "Unknown" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "Done is better than perfect. Complete one task today.", author: "Sheryl Sandberg" },
]

const getTodaysQuote = () => {
  const today = new Date().getDate()
  return dailyQuotes[today % dailyQuotes.length]
}

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
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filter, setFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleAddTask = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t))
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
      }
      setTasks([...tasks, newTask])
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  const filteredTasks = tasks.filter((t) => {
    // Status filter
    const statusMatch = filter === 'all' || t.status === filter
    // Category filter
    const categoryMatch = categoryFilter === 'all' || t.category === categoryFilter
    return statusMatch && categoryMatch
  })

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(tasks.map(t => t.category)))]

  // Calculate stats
  const completedCount = tasks.filter((t) => t.status === 'completed').length
  const totalCount = tasks.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length
  const pendingCount = tasks.filter((t) => t.status === 'pending').length

  // Find tasks due soon (next 3 days)
  const today = new Date()
  const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
  const urgentTasks = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate)
    return dueDate <= threeDaysLater && dueDate >= today && t.status !== 'completed'
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Get today's tasks (reserved for future use)
  // const todaysTasks = tasks.filter((t) => {
  //   const dueDate = new Date(t.dueDate).toDateString()
  //   const todayDate = today.toDateString()
  //   return dueDate === todayDate && t.status !== 'completed'
  // })

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

      {/* Motivational Quote Section */}
      <section className="bg-linear-to-r from-purple-500 via-pink-500 to-red-500 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <p className="text-xl md:text-2xl font-semibold italic">"{getTodaysQuote().text}"</p>
            <p className="text-sm text-white/80">— {getTodaysQuote().author}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats & Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Header */}
            <motion.div variants={fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Task Dashboard</h1>
              <p className="text-xl text-blue-100">Stay focused, stay motivated, stay on track</p>
            </motion.div>

            {/* Stats Grid - Enhanced */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
            >
              {/* Completed */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Completed</p>
                    <p className="text-3xl font-bold mt-1">{completedCount}</p>
                  </div>
                  <div className="bg-green-400/20 p-3 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-300" />
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <p className="text-xs text-blue-100 mt-2">{completionRate}% completion rate</p>
              </motion.div>

              {/* In Progress */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-blue-100 font-medium">In Progress</p>
                    <p className="text-3xl font-bold mt-1">{inProgressCount}</p>
                  </div>
                  <div className="bg-blue-400/20 p-3 rounded-lg">
                    <Zap className="w-6 h-6 text-blue-300" />
                  </div>
                </div>
                <p className="text-xs text-blue-100 mt-4">Active tasks running</p>
              </motion.div>

              {/* Pending */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Pending</p>
                    <p className="text-3xl font-bold mt-1">{pendingCount}</p>
                  </div>
                  <div className="bg-amber-400/20 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-300" />
                  </div>
                </div>
                <p className="text-xs text-blue-100 mt-4">Waiting to start</p>
              </motion.div>

              {/* Total */}
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Total Tasks</p>
                    <p className="text-3xl font-bold mt-1">{totalCount}</p>
                  </div>
                  <div className="bg-purple-400/20 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                <p className="text-xs text-blue-100 mt-4">Tasks on your plate</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Urgent Tasks Section */}
      {urgentTasks.length > 0 && (
        <section className="bg-linear-to-r from-orange-50 to-red-50 border-t-4 border-orange-400 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-slate-900">Due Soon</h2>
                <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {urgentTasks.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {urgentTasks.slice(0, 3).map((task) => (
                  <motion.div key={task.id} whileHover={{ scale: 1.02 }}>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleEditTask(task)}
                    >
                      <Card className="bg-white border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow h-full">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Tasks Section */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">All Tasks</h2>
              <p className="text-slate-600">Manage and track your progress</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center gap-2"
              onClick={handleAddTask}
            >
              <Plus className="w-5 h-5" />
              Add New Task
            </Button>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">Filter by Status:</p>
            <div className="flex flex-wrap gap-2">
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
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <p className="text-sm font-medium text-slate-700 mb-3">Filter by Category:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    categoryFilter === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
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
                <div
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => handleEditTask(task)}
                >
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
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-2">
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                      </div>
                      {task.status === 'completed' && (
                        <div className="ml-2">
                          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
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
                </div>
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
              <p className="text-xl text-slate-600 mb-4">
                {filter !== 'all' || categoryFilter !== 'all' 
                  ? 'No tasks match your filters' 
                  : 'No tasks yet!'}
              </p>
              <Button variant="secondary" onClick={handleAddTask}>Create Your First Task</Button>
            </motion.div>
          )}
        </div>
      </section>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
      />

      <Footer />
    </div>
  )
}
