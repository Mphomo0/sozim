'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TrendData {
  _id: number
  pending: number
  approved: number
  rejected: number
  count: number
}

interface Props {
  data: TrendData[]
}

export default function ApplicationYearTrendChart({ data }: Props) {
  const chartData = data.map((d) => ({
    year: d._id,
    Pending: d.pending,
    Approved: d.approved,
    Rejected: d.rejected,
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="Pending"
          stackId="a"
          fill="#FBBF24"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Approved"
          stackId="a"
          fill="#10B981"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Rejected"
          stackId="a"
          fill="#EF4444"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
