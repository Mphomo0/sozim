'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface StatusChartData {
  _id: number
  pending: number
  approved: number
  rejected: number
  count: number
}

interface Props {
  data: StatusChartData[]
  year: number
}

export default function ApplicationStatusChart({ data }: Props) {
  const { pending = 0, approved = 0, rejected = 0 } = data[0] || {}

  // Transform for Recharts
  const chartData = [
    { name: 'Pending', value: data[0]?.pending || 0 },
    { name: 'Approved', value: data[0]?.approved || 0 },
    { name: 'Rejected', value: data[0]?.rejected || 0 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
