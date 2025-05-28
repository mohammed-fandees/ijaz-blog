import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { name: 'السبت', views: 400, visitors: 240 },
  { name: 'الأحد', views: 300, visitors: 139 },
  { name: 'الإثنين', views: 200, visitors: 980 },
  { name: 'الثلاثاء', views: 278, visitors: 390 },
  { name: 'الأربعاء', views: 189, visitors: 480 },
  { name: 'الخميس', views: 239, visitors: 380 },
  { name: 'الجمعة', views: 349, visitors: 430 },
]

export function DashboardChart() {
  return (
    <div className="h-[300px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            strokeWidth={2}
            name="المشاهدات"
          />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="#82ca9d"
            strokeWidth={2}
            name="الزوار"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 