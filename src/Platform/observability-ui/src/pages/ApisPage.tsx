import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { apiEndpoints } from '../data/demoData'
import { ArrowRightLeft, TrendingUp } from 'lucide-react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function ApisPage() {
  return (
    <div>
      <div className="page-header">
        <h1>API Endpoints</h1>
        <p>P50/P75/P95/P99 latency, error rates, and 7-day performance trends for all instrumented endpoints.</p>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title"><ArrowRightLeft size={16} /> All Endpoints ({apiEndpoints.length})</span>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>App</th>
                <th className="right">Req/day</th>
                <th className="right">Avg</th>
                <th className="right">P50</th>
                <th className="right">P95</th>
                <th className="right">P99</th>
                <th className="right">Error%</th>
                <th className="right">Timeout%</th>
                <th>Trend (P95)</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map(api => {
                const trendData = days.map((d, i) => ({ day: d, p95: api.trend[i] }))
                const isSlowP95 = api.p95Ms > 2000
                const hasHighErrors = api.errorRate > 2
                const hasTimeouts = api.timeoutRate > 5
                return (
                  <tr key={api.id} style={{ background: isSlowP95 || hasHighErrors ? 'rgba(248,81,73,.03)' : undefined }}>
                    <td>
                      <span className={`badge badge-${api.method === 'GET' ? 'info' : api.method === 'POST' ? 'ok' : 'warn'}`}>{api.method}</span>
                    </td>
                    <td className="primary mono" style={{ fontSize: 11 }}>{api.endpoint}</td>
                    <td className="text-muted">{api.app}</td>
                    <td className="right mono">{api.requestCount.toLocaleString()}</td>
                    <td className="right mono">{api.avgMs}ms</td>
                    <td className="right mono">{api.p50Ms}ms</td>
                    <td className="right mono" style={{ color: isSlowP95 ? 'var(--status-error)' : api.p95Ms > 1000 ? 'var(--status-warn)' : 'var(--status-ok)', fontWeight: isSlowP95 ? 700 : undefined }}>
                      {api.p95Ms >= 1000 ? (api.p95Ms / 1000).toFixed(1) + 's' : api.p95Ms + 'ms'}
                    </td>
                    <td className="right mono" style={{ color: api.p99Ms > 5000 ? 'var(--status-error)' : 'var(--text-secondary)' }}>
                      {api.p99Ms >= 1000 ? (api.p99Ms / 1000).toFixed(1) + 's' : api.p99Ms + 'ms'}
                    </td>
                    <td className="right mono" style={{ color: hasHighErrors ? 'var(--status-error)' : 'var(--text-secondary)' }}>
                      {api.errorRate.toFixed(1)}%
                    </td>
                    <td className="right mono" style={{ color: hasTimeouts ? 'var(--status-timeout)' : 'var(--text-secondary)' }}>
                      {api.timeoutRate.toFixed(1)}%
                    </td>
                    <td style={{ width: 120 }}>
                      <ResponsiveContainer width={110} height={32}>
                        <LineChart data={trendData}>
                          <Line type="monotone" dataKey="p95" stroke={isSlowP95 ? '#f85149' : '#58a6ff'} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed view for the slowest one */}
      <div className="section" style={{ marginTop: 16 }}>
        <div className="section-header">
          <span className="section-title"><TrendingUp size={16} /> 7-Day P95 Trend — GET /api/claims/monthly (Scenario 2: Deployment Regression)</span>
          <span className="badge badge-error">Regression After v2.7.4</span>
        </div>
        <div className="section-body">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Deployment v2.7.4 was released on Thursday. P95 jumped from 740ms → 5900ms. The average (1900ms) would not have revealed this severity.
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={days.map((d, i) => ({ day: d, p95: apiEndpoints[0].trend[i], avg: apiEndpoints[0].avgMs }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6e7681' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6e7681' }} unit="ms" />
              <Tooltip
                contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 11 }}
                formatter={(v: number, name: string) => [`${v}ms`, name === 'p95' ? 'P95' : 'Average']}
              />
              <Line type="monotone" dataKey="p95" name="p95" stroke="#f85149" strokeWidth={2.5} dot={{ r: 4, fill: '#f85149' }} />
              <Line type="monotone" dataKey="avg" name="avg" stroke="#6e7681" strokeWidth={1} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12, fontStyle: 'italic', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 6 }}>
            Note: Average (dashed) appears stable while P95 (solid) reveals the true severity. This demonstrates why P95/P99 matter more than averages.
          </div>
        </div>
      </div>
    </div>
  )
}
