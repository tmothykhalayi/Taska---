import { CheckCircle, Calendar, Zap, Star } from 'lucide-react';

export const Dashboard = () => {
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
			<div className="mx-auto max-w-6xl space-y-6">
				<header className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
					<h1 className="text-2xl font-bold text-slate-900">Tasker Dashboard</h1>
					<p className="text-sm text-slate-600">Track your tasks, streaks, and rewards</p>
				</header>

				<div className="grid gap-6 md:grid-cols-3">
					<div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
						<CheckCircle className="h-8 w-8 text-blue-600" />
						<p className="mt-4 text-sm text-slate-600">Active Tasks</p>
						<p className="text-3xl font-bold text-slate-900">0</p>
					</div>
					<div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
						<Calendar className="h-8 w-8 text-purple-600" />
						<p className="mt-4 text-sm text-slate-600">Upcoming</p>
						<p className="text-3xl font-bold text-slate-900">0</p>
					</div>
					<div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
						<Zap className="h-8 w-8 text-amber-600" />
						<p className="mt-4 text-sm text-slate-600">Streak</p>
						<p className="text-3xl font-bold text-slate-900">0</p>
					</div>
				</div>
			</div>
		</div>
	);
};

// import { motion } from "framer-motion";
// import {
//   CheckCircle,
//   Calendar,
//   Zap,
//   MapPin,
//   Star,
//   Menu,
//   Plus,
//   Settings,
//   Bell,
// } from "lucide-react";
// import { useState } from "react";
// import { Header } from "../../components/layout/Header";
// import { Card } from "../../components/ui/Card";
// import LoadingSpinner from "../../components/ui/LoadingSpinner";
// import { useGetUserTasksQuery } from "../../features/Tasks/tasksApi";

// export const Dashboard = () => {
//   const { data: tasks = [], isLoading, error } = useGetUserTasksQuery({});
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const quickActions = [
//     {
//       icon: Plus,
//       title: "Create Task",
//       description: "Add a new task",
//       color: "from-blue-500 to-blue-600",
//       href: "#",
//     },
//     {
//       icon: Calendar,
//       title: "My Tasks",
//       description: "View all tasks",
//       color: "from-purple-500 to-purple-600",
//       href: "#",
//     },
//     {
//       icon: MapPin,
//       title: "Daily Check-in",
//       description: "Complete wellness check",
//       color: "from-green-500 to-green-600",
//       href: "#",
//     },
//     {
//       icon: Zap,
//       title: "Streak Progress",
//       description: "Track your streaks",
//       color: "from-orange-500 to-orange-600",
//       href: "#",
//     },
//     {
//       icon: Star,
//       title: "Badges",
//       description: "View achievements",
//       color: "from-teal-500 to-teal-600",
//       href: "#",
//     },
//     {
//       icon: Settings,
//       title: "Settings",
//       description: "Account preferences",
//       color: "from-slate-500 to-slate-600",
//       href: "#",
//     },
//   ];

//   // Filter tasks by status
//   const activeTasks = tasks?.filter((t: any) => t.status === 'in-progress') || [];
//   const completedTasks = tasks?.filter((t: any) => t.status === 'completed') || [];
  
//   // Calculate stats
//   const dailyStreak = 7; // This could come from user profile API

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600 text-lg mb-2">Error loading dashboard</p>
//           <p className="text-slate-600">Please try again later</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <Header />
        
//         {/* Top Bar */}
//         <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
//           >
//             <Menu className="w-6 h-6 text-slate-600" />
//           </button>
          
//           <h2 className="text-xl font-semibold text-slate-800 hidden md:block">My Dashboard</h2>
          
//           <div className="flex items-center space-x-4">
//             <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
//               <Bell className="w-5 h-5 text-slate-600" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>
//             <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
//               <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                 JD
//               </div>
//               <div className="hidden md:block">
//                 <p className="font-semibold text-slate-800 text-sm">John Doe</p>
//                 <p className="text-xs text-slate-500">Member</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Welcome Section */}
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-8"
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <h1 className="text-3xl font-bold text-slate-800">Welcome back, John!</h1>
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
//                   <Plus className="w-4 h-4" />
//                   <span>New Booking</span>
//                 </button>
//               </div>
//               <p className="text-slate-600">Manage your rentals and discover new vehicles</p>
//             </motion.div>

//             {/* Stats Overview */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
//             >
//               <Card className="bg-linear-to-br from-blue-500 to-blue-600 text-white">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-blue-100 text-sm mb-1">Active Rentals</p>
//                     <p className="text-3xl font-bold">1</p>
//                   </div>
//                   <CheckCircle className="w-12 h-12 text-blue-200" />
//                 </div>
//               </Card>

//               <Card className="bg-linear-to-br from-purple-500 to-purple-600 text-white">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-purple-100 text-sm mb-1">Upcoming</p>
//                     <p className="text-3xl font-bold">1</p>
//                   </div>
//                   <Calendar className="w-12 h-12 text-purple-200" />
//                 </div>
//               </Card>

//               <Card className="bg-linear-to-br from-green-500 to-green-600 text-white">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-green-100 text-sm mb-1">Rewards Points</p>
//                     <p className="text-3xl font-bold">{activeTasks.length * 10}</p>
//                   </div>
//                   <Star className="w-12 h-12 text-green-200" />
//                 </div>
//               </Card>
//             </motion.div>





//             {/* Quick Actions Grid */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {quickActions.map((action, index) => (
//                   <motion.a
//                     key={action.title}
//                     href={action.href}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.1 * (index + 5) }}
//                     className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all group hover:scale-105"
//                   >
//                     <div className={`bg-linear-to-br ${action.color} p-3 rounded-xl inline-block mb-4`}>
//                       <action.icon className="w-6 h-6 text-white" />
//                     </div>
//                     <h3 className="text-lg font-bold text-slate-800 mb-2">
//                       {action.title}
//                     </h3>
//                     <p className="text-slate-600 text-sm">{action.description}</p>
//                   </motion.a>
//                 ))}
//               </div>
//             </motion.div>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8 }}
//               className="text-center text-slate-500 text-sm mt-12"
//             >
//               � Keep up with your daily tasks and maintain your streaks!
//             </motion.p>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };