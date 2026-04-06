import { useState } from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Card } from '../components/ui/Card'
import { BookOpen, Lightbulb, Target, Brain, Clock, Trophy, Search, ArrowRight, X } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'Productivity' | 'Motivation' | 'Tips' | 'Psychology'
  readTime: string
  icon: React.ReactNode
  color: string
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Power of Task Batching: Complete More in Less Time',
    excerpt: 'Learn how grouping similar tasks together can dramatically increase your productivity and reduce context switching.',
    content: `Task batching is one of the most powerful productivity techniques you can implement today. It involves grouping similar tasks together and completing them in focused blocks of time.

## Why Task Batching Works

When you switch between different types of tasks, your brain needs time to adjust. This context switching can cost you up to 40% of your productive time. By batching similar tasks, you maintain focus and momentum.

## The Science Behind It

Research shows that our brains are optimized to handle repetitive, similar tasks in sequence. When you batch tasks:
- Your mental state stays consistent
- You build momentum naturally
- Fewer interruptions occur
- You achieve a "flow state" more easily

## How to Implement Task Batching

1. **Identify Task Categories** - Group tasks by type: emails, calls, deep work, administrative tasks
2. **Schedule Batch Blocks** - Dedicate specific times for each batch
3. **Remove Distractions** - Turn off notifications during batch time
4. **Complete the Batch** - Don't switch tasks until the batch is done

## Real-World Example

A consultant might batch all client calls from 10 AM to 12 PM, then deep work from 1 PM to 5 PM, and administrative tasks from 5 PM to 6 PM. This approach increases both productivity and satisfaction.

Start implementing task batching this week and watch your productivity soar!`,
    category: 'Productivity',
    readTime: '5 min read',
    icon: <Clock className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: '2',
    title: 'Behavioral Psychology: Why We Procrastinate and How to Fix It',
    excerpt: 'Understand the psychological roots of procrastination and discover evidence-based techniques to overcome it.',
    content: `Procrastination isn't a sign of laziness—it's a sign that something about the task is triggering an emotion we want to avoid.

## The True Cause of Procrastination

Psychologist Tim Pychyl's research reveals that procrastination is primarily an emotional regulation problem, not a time management problem. We delay tasks that make us feel:
- Anxious or overwhelmed
- Bored or unstimulated
- Uncertain about how to proceed
- Judged or pressured

## The Procrastination Cycle

1. **Task appears** - A task that triggers negative emotions
2. **Avoidance** - We escape the negative feeling temporarily
3. **Short-term relief** - Feels good to avoid
4. **Long-term stress** - Guilt and pressure mounting
5. **Panic mode** - Finally doing the task under stress

## Evidence-Based Solutions

**Start with implementation intentions**: Instead of "I'll exercise," say "After my morning coffee, I'll do 10 pushups in my bedroom."

**Use the 2-minute rule**: If a task takes less than 2 minutes, do it immediately.

**Temptation bundling**: Pair challenging tasks with something you enjoy.

**Self-compassion breaks**: When you notice procrastination, treat yourself with kindness, not criticism.

## Breaking the Pattern

The key is addressing the emotional aspect. By naming what you're feeling and using these techniques, you can break the procrastination cycle and build lasting productivity habits.`,
    category: 'Psychology',
    readTime: '8 min read',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: '3',
    title: 'Setting Goals That Actually Stick: The Art of Realistic Planning',
    excerpt: 'Master the science of goal setting with practical tips to make your tasks meaningful and achievable.',
    content: `Most goal-setting approaches fail because they ignore the psychology of behavior change. Here's what actually works.

## The SMART vs. SMARTER Framework

While SMART goals are helpful (Specific, Measurable, Achievable, Relevant, Time-bound), they miss the emotional component.

SMARTER goals add:
- **Exciting**: Does it inspire you?
- **Recorded**: Is it written down and visible?

## The Goal Hierarchy

Effective goal setting requires three levels:

**Level 1: Vision** (1-5 years)
Your big picture: "Become a master of my craft"

**Level 2: Goals** (3-12 months)
Major milestones: "Complete professional certification"

**Level 3: Habits** (Daily/Weekly)
Concrete daily actions: "Study 30 minutes every morning"

## Making Goals Stick

1. **Connect to values** - Your goals must align with what matters to you
2. **Create accountability** - Share with someone who will support you
3. **Build momentum** - Start small and celebrate wins
4. **Track progress** - Visual progress is incredibly motivating

## The Psychology of Goal Success

Research shows that public commitment combined with tracking increases success rates by 65%. This is why Taska's gamification features—badges, progress visualization, and streak tracking—are so powerful.

Set your goals with intention, track them with purpose, and watch your life transform.`,
    category: 'Tips',
    readTime: '6 min read',
    icon: <Target className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
  },
  {
    id: '4',
    title: 'Daily Rituals of High Achievers: Build Your Success Routine',
    excerpt: 'Discover the morning and evening routines of productive people and how to implement them in your life.',
    content: `Your daily rituals are more important than your goals. They're the actual vehicle for success.

## The Morning Ritual Framework

Successful people don't leave their mornings to chance. They follow a structured routine that primes their mind for excellence.

**The Ideal Morning Sequence:**
1. **Hydration First** (5 min) - Water rehydrates your brain after sleep
2. **Movement** (10-20 min) - Exercise, yoga, or stretching
3. **Reflection** (10 min) - Journaling or meditation
4. **Planning** (10-15 min) - Review today's priorities
5. **Learning** (15 min) - Read or listen to something valuable

Total time: ~60 minutes, but it sets your entire day.

## The Power of Evening Rituals

What you do before bed determines sleep quality, which determines tomorrow's success.

**Optimal Evening Routine:**
- 2 hours before bed: Stop intense work
- 1 hour before: Dim lights, reduce screen time
- 30 min before: Reflect on wins from today
- Plan tomorrow's top 3 priorities
- Sleep 7-9 hours

## Real Examples

**Bill Gates**: Reads for 1 hour before bed and reviews his calendar weekly

**Oprah Winfrey**: Meditates, exercises, journals, and plans her day every morning

**Jeff Bezos**: Prioritizes 8 hours of sleep and never schedules meetings before 10 AM

## Your Personal Ritual

You don't need to copy anyone else's routine. Start with:
1. Pick ONE morning activity
2. Do it for 30 days
3. Add another when it feels natural

Build your success ritual piece by piece, and let consistency compound over time.`,
    category: 'Motivation',
    readTime: '7 min read',
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: '5',
    title: 'The Pomodoro Technique Explained: Work Smarter, Not Harder',
    excerpt: 'A deep dive into one of the most effective time management methods and how to master it.',
    content: `Created by Francesco Cirillo in the late 1980s, the Pomodoro Technique is deceptively simple yet remarkably effective.

## The Basic Method

1. **Choose a task** (2 min)
2. **Set a timer for 25 minutes** - This is one "Pomodoro"
3. **Work with full focus** - No distractions
4. **Take a 5-minute break**
5. **After 4 Pomodoros, take a 15-30 minute break**

That's it. The genius lies in the timing and consistency.

## Why 25 Minutes?

Research shows that:
- 25 minutes is long enough to make real progress
- 25 minutes is short enough to maintain peak focus
- Our attention naturally dips around 25 minutes
- The frequent breaks prevent burnout

## Advanced Pomodoro Strategies

**Timeboxing for estimation**: Use Pomodoros to estimate how long tasks really take. This builds better planning skills.

**Batching with Pomodoros**: Use consecutive Pomodoros for one task type, then switch.

**Break quality matters**: Your 5-minute breaks should be genuinely restful (stretch, water, brief walk).

## The Science of Focus

When you know a break is coming, your brain finds focus easier. You're not trying to focus forever—just for 25 minutes.

The timer also creates "Parkinson's Law pressure"—work expands to fill time, but with a deadline, you work more efficiently.

## Getting Started

Download any timer app, choose one task, and commit to just ONE Pomodoro session today. Most people who try it become immediately hooked on the results.

Your future self will thank you for this simple but powerful technique.`,
    category: 'Productivity',
    readTime: '5 min read',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'from-red-500 to-red-600',
  },
  {
    id: '6',
    title: 'Building Unshakeable Discipline: From Theory to Practice',
    excerpt: 'Learn the science of discipline and practical strategies to build habits that last a lifetime.',
    content: `Discipline isn't about willpower—it's about building systems that make the right choice the easy choice.

## The Discipline Mirage

Most people think discipline is:
- Fighting against your nature
- Constant struggle and willpower
- White-knuckling through difficult tasks

But research by psychologists like Roy Baumeister shows that true discipline is about design, not struggle.

## The Four Pillars of Discipline

**1. Environment Design**
Your environment is stronger than your willpower. If you want to eat healthier, don't keep junk food visible. This is why working in a focused environment beats trying harder mentally.

**2. Identity Alignment**
Instead of "I should work out," become "I'm someone who prioritizes my health." This shifts discipline from willpower to identity.

**3. Motivation Cultivation**
Connect your daily habits to your deeper values. Why do you want discipline? Connect that reason to every action.

**4. Consistency Over Perfection**
Research from Atomic Habits shows that small, consistent actions create exponential results. 1% better daily = 37x better annually.

## The Discipline Compound Effect

Day 1: Small effort seems pointless
Week 1: Still no visible change
Month 1: You notice small improvements
Year 1: You're shocked at the transformation

## Building Discipline Daily

1. **Start ridiculously small** - One Pomodoro, five pushups, one page
2. **Never miss twice** - Missing once is life, missing twice is the start of a new (bad) habit
3. **Track everything** - What gets measured gets managed
4. **Celebrate consistency** - Your goal is the chain, not perfection

## The Dark Side of Pure Willpower

Willpower depletes. By day 3 of pure effort-based goals, most people quit.

The solution? Build systems where discipline becomes effortless through smart design and identity alignment.

Start today with one small discipline. Make it so easy you can't fail. Then compound it over time.`,
    category: 'Psychology',
    readTime: '9 min read',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-indigo-500 to-indigo-600',
  },
]

const categories = ['All', 'Productivity', 'Motivation', 'Tips', 'Psychology']

const tipsHighlights = [
  {
    title: 'Start Small',
    description: 'Break large tasks into smaller, manageable chunks. Small wins build momentum.',
    icon: '🎯',
  },
  {
    title: 'Priority Matrix',
    description: 'Use the Eisenhower Matrix to prioritize urgent vs. important tasks.',
    icon: '📊',
  },
  {
    title: 'The Rule of 3',
    description: 'Focus on only 3 main tasks per day. Quality over quantity.',
    icon: '3️⃣',
  },
  {
    title: 'Time Blocking',
    description: 'Schedule specific times for specific tasks. Eliminate distractions.',
    icon: '⏰',
  },
  {
    title: 'Regular Reviews',
    description: 'Weekly reviews help you track progress and adjust strategies.',
    icon: '📈',
  },
  {
    title: 'Celebrate Wins',
    description: 'Acknowledge completed tasks. Small celebrations boost motivation.',
    icon: '🎉',
  },
]

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const filteredPosts = blogPosts.filter((post) => {
    const matchCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="w-full">
      <Header />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="space-y-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Resources & Guides</h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Tips, tricks, and motivational content to help you master productivity and transform your life.
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="relative max-w-2xl">
              <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div key={post.id} variants={fadeInUp}>
                  <Card
                    hover
                    className="h-full flex flex-col overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all group"
                  >
                    {/* Post Header with Icon */}
                    <div className={`bg-linear-to-br ${post.color} p-6 text-white flex items-center justify-between`}>
                      <div className="opacity-90 group-hover:opacity-100 transition-opacity">
                        {post.icon}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                        {post.category}
                      </span>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-xs text-slate-500 font-medium">{post.readTime}</span>
                        <button 
                          onClick={() => setSelectedPost(post)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group/btn"
                        >
                          Read
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-16"
                variants={fadeInUp}
              >
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-600">No articles found matching your search.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-16 px-4 bg-linear-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold text-slate-900">Quick Productivity Tips</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Key strategies you can implement today to boost your productivity
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
            >
              {tipsHighlights.map((tip) => (
                <motion.div key={tip.title} variants={fadeInUp}>
                  <Card hover className="h-full p-8 text-center space-y-4">
                    <div className="text-4xl">{tip.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900">{tip.title}</h3>
                    <p className="text-slate-600">{tip.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Productivity?
          </motion.h2>
          <motion.p
            className="text-lg text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Start managing your tasks with Taska today and put these tips into action.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Your Free Trial
          </motion.button>
        </div>
      </section>

      {/* Article Modal */}
      {selectedPost && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`bg-linear-to-br ${selectedPost.color} p-8 text-white sticky top-0 z-10`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {selectedPost.icon}
                    <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                      {selectedPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold">{selectedPost.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-white/90">
                <span>{selectedPost.readTime}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="prose prose-sm max-w-none text-slate-700 space-y-6">
                {selectedPost.content.split('\n').map((line, idx) => {
                  if (line.startsWith('##')) {
                    return (
                      <h3 key={idx} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                        {line.replace('## ', '')}
                      </h3>
                    )
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={idx} className="font-semibold text-slate-900">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    )
                  }
                  if (line.startsWith('-')) {
                    return (
                      <li key={idx} className="ml-6 text-slate-700">
                        {line.replace('- ', '')}
                      </li>
                    )
                  }
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />
                  }
                  return (
                    <p key={idx} className="text-slate-700 leading-relaxed">
                      {line}
                    </p>
                  )
                })}
              </div>

              {/* Modal Footer */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}
