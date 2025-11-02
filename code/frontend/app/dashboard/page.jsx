import { PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts'

export default function DashboardPage() {
  const [data, setData] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [demo, setDemo] = useState({ age: [], gender: [] })

  useEffect(() => {
    async function load() {
      try {
        const perfRes = await api.get('/api/metrics', { headers: authHeader() })
        const rows = perfRes.data.data.map(r => ({
          date: r.attributes.date,
          impressions: r.attributes.impressions,
          clicks: r.attributes.clicks,
          spend: r.attributes.spend,
        }))
        setData(rows)

        const kpiRes = await api.get('/api/ads-fetcher/metrics/1', { headers: authHeader() })
        setMetrics(kpiRes.data)

        const demoRes = await api.get('/api/ads-fetcher/demographics/1', { headers: authHeader() })
        setDemo(demoRes.data)
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      }
    }
    load()
  }, [])

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658']

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold">📊 Marketing Dashboard</h1>

      {/* KPI CARDS */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <KpiCard title="Accounts Reached (5m)" value={metrics.accountsReachedLast5Months} />
          <KpiCard title="Impressions (Last Month)" value={metrics.impressionsLastMonth} />
          <KpiCard title="Engagements" value={metrics.engagements} />
          <KpiCard title="Followers Gained (5m)" value={metrics.followersGained} />
          <KpiCard title="Leads (30d)" value={metrics.leadsLast30Days} />
          <KpiCard title="CPM" value={`$${metrics.CPM.toFixed(2)}`} />
          <KpiCard title="CTR (%)" value={metrics.CTR.toFixed(2)} />
          <KpiCard title="Total Spend" value={`$${metrics.totalSpend.toFixed(2)}`} />
          <KpiCard title="Cost per Message" value={`$${metrics.costPerMessage.toFixed(2)}`} />
        </div>
      )}

      {/* PERFORMANCE CHART */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
            <Line type="monotone" dataKey="spend" stroke="#ffc658" name="Spend" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* DEMOGRAPHICS */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demo.gender}
                dataKey="reach"
                nameKey="gender"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {demo.gender.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Age Range Reach</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demo.age}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageRange" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reach" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-md text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value ?? '--'}</p>
    </div>
  )
}
