'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  totalFeedback: number
  averageRating: number
  ratingDistribution: { rating: number; count: number }[]
  feedbackByCategory: { category: string; count: number }[]
  feedbackByBranch: { branchName: string; count: number; averageRating: number }[]
  feedbackOverTime: { date: string; count: number }[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.ratingDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="rating"
              label={{ value: 'Rating', position: 'insideBottom', offset: -5 }}
            />
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback by Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Feedback by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.feedbackByCategory}
              cx="50%"
              cy="50%"
              labelLine={false}
              nameKey="category"
              label={({ name, percent }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {data.feedbackByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Branches */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top 10 Branches by Feedback</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.feedbackByBranch} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="branchName" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10B981" name="Feedback Count" />
            <Bar dataKey="averageRating" fill="#F59E0B" name="Avg Rating" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feedback Trend */}
      {data.feedbackOverTime.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Feedback Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.feedbackOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Feedback Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
