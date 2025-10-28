'use client'
import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { authHeader } from '../../lib/auth'


export default function DashboardPage() {
const [data, setData] = useState([])


useEffect(() => {
async function load() {
try {
const res = await api.get('/api/metrics', { headers: authHeader() })
// adapt the response to chart format
const rows = res.data.data.map(r => ({
date: r.attributes.date,
impressions: r.attributes.impressions,
clicks: r.attributes.clicks,
spend: r.attributes.spend,
}))
setData(rows)
} catch (err) {
console.error(err)
}
}
load()
}, [])


return (
<div className="p-6">
<h1 className="text-xl font-semibold mb-4">Ad Performance</h1>
<LineChart width={900} height={380} data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Line type="monotone" dataKey="impressions" />
<Line type="monotone" dataKey="clicks" />
</LineChart>
</div>
)
}