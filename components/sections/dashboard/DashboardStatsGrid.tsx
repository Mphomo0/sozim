'use client'

import { motion } from 'framer-motion'
import { Users, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface DashboardStatsGridProps {
  totalUsers: number
  totalPending: number
  totalApproved: number
  totalRejected: number
  pendingPercent: number
  approvedPercent: number
  rejectedPercent: number
}

export default function DashboardStatsGrid({
  totalUsers,
  totalPending,
  totalApproved,
  totalRejected,
  pendingPercent,
  approvedPercent,
  rejectedPercent,
}: DashboardStatsGridProps) {
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'blue', percent: totalUsers > 0 ? 100 : 0, subTitle: 'Growth' },
    { label: 'Pending', value: totalPending, icon: Clock, color: 'amber', percent: pendingPercent, subTitle: 'Current' },
    { label: 'Approved', value: totalApproved, icon: CheckCircle2, color: 'emerald', percent: approvedPercent, subTitle: 'Success' },
    { label: 'Rejected', value: totalRejected, icon: XCircle, color: 'rose', percent: rejectedPercent, subTitle: 'Rejection' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="group glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity`}>
            <item.icon className="w-24 h-24" />
          </div>
          
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-xl bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest text-${item.color}-600/60 dark:text-${item.color}-400/60`}>
                {item.subTitle}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {item.label}
              </h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {item.value.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percent}%` }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  className={`h-full rounded-full bg-${item.color}-500 shadow-[0_0_12px_rgba(var(--${item.color}-500-rgb),0.4)]`}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Rate</span>
                <span className={`text-${item.color}-600 dark:text-${item.color}-400`}>{item.percent}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
