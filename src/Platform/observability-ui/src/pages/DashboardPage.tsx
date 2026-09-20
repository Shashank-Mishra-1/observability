import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { alerts, applications, storedProcedures, errors, deployments, traces, weeklyTrend, pages } from '../data/demoData'
import { useNavigate } from 'react-router-dom'
import { Activity, Bell, Database, ServerCrash, Zap, ArrowUp, ArrowRight, AlertTriangle, AlertCircle } from 'lucide-react'

const trendData = weeklyTrend.labels.map((label, i) => ({
  label,
  p95: weeklyTrend.claimsMonthlyP95[i],
  errorRate: weeklyTrend.errorRate[i],
}))

export default function DashboardPage() {
  const navigate = useNavigate()
  const activeAlerts = alerts.filter(a => !a.acknowledged)
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length
  const totalRequests = applications.reduce((s, a) => s + a.requestsPerMin * 60 * 24, 0)

  return (
    <div>
      <div className="page-header">
        <h1>Overview Dashboard</h1>
        <p>Platform-wide performance intelligence — Last 24h. 3 projects, 4 applications monitored.</p>
      </div>

      {/* Top-level stat cards */}
      <div className="stat-grid stat-grid-4">
        <div className="stat-card info">
          <div className="stat-card-label"><Activity size={14} /> Total Requests (24h)</div>
          <div className="stat-card-value">{(totalRequests / 1000).toFixed(0)}k</div>
          <div className="stat-card-sub"><span className="trend-up"><ArrowUp size={12}/> 8%</span> vs yesterday</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-card-label"><AlertCircle size={14} /> Active Critical Alerts</div>
          <div className="stat-card-value" style={{ color: 'var(--status-error)' }}>{criticalCount}</div>
          <div className="stat-card-sub"><span className="trend-up"><ArrowUp size={12}/> 3</span> since yesterday</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-card-label"><Zap size={14} /> P95 Latency (Claims)</div>
          <div className="stat-card-value" style={{ color: 'var(--status-error)' }}>6.9s</div>
          <div className="stat-card-sub"><span className="trend-up"><ArrowUp size={12}/> +858%</span> vs baseline</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-card-label"><ServerCrash size={14} /> Error Rate (Claims)</div>
          <div className="stat-card-value" style={{ color: 'var(--status-error)' }}>8.2%</div>
          <div className="stat-card-sub"><span className="trend-up"><ArrowUp size={12}/> +7.8pp</span> vs baseline</div>
        </div>
      </div>

      {/* Second row */}
      <div className="stat-grid stat-grid-4" style={{ marginTop: 16 }}>
        <div className="stat-card ok">
          <div className="stat-card-label">Projects Monitored</div>
          <div className="stat-card-value">3</div>
          <div className="stat-card-sub">Claims, HR, Finance</div>
        </div>
        <div className="stat-card ok">
          <div className="stat-card-label">Applications</div>
          <div className="stat-card-value">4</div>
          <div className="stat-card-sub">2 critical, 2 healthy</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-card-label">SP Timeouts (24h)</div>
          <div className="stat-card-value" style={{ color: 'var(--status-warn)' }}>84</div>
          <div className="stat-card-sub">usp_GenerateMonthlySummary</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-card-label">Recent Deployments</div>
          <div className="stat-card-value">4</div>
          <div className="stat-card-sub"><span className="trend-up">1 regression</span> detected</div>
        </div>
      </div>

      <div className="page-row page-row-23">
        {/* P95 Trend Chart */}
        <div className="section">
          <div className="section-header">
            <span className="section-title"><Activity size={16} /> P95 Latency Trend — Claims Monthly Report</span>
            <span className="badge badge-error">Regression</span>
          </div>
          <div className="section-body">
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
              Deployment v2.7.4 marker shown. P95 increased from 720ms → 6900ms post-deployment.
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f85149" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f85149" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6e7681' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6e7681' }} unit="ms" />
                <Tooltip
                  contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 11 }}
                  formatter={(v: number) => [`${v.toLocaleString()}ms`, 'P95']}
                />
                <Area type="monotone" dataKey="p95" stroke="#f85149" fill="url(#p95Grad)" strokeWidth={2} dot={{ r: 3, fill: '#f85149' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="section">
          <div className="section-header">
            <span className="section-title"><Bell size={16} /> Active Alerts</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/alerts')}>View All</button>
          </div>
          <div className="section-body-0">
            {activeAlerts.slice(0, 3).map(al => (
              <div key={al.id} className={`alert-item ${al.severity}`}>
                <div className="alert-icon">
                  {al.severity === 'critical' ? <AlertCircle size={16} color="var(--status-error)" /> : <AlertTriangle size={16} color="var(--status-warn)" />}
                </div>
                <div>
                  <div className="alert-message">{al.message}</div>
                  <div className="alert-meta">
                    <span>{al.app}</span>
                    <span>{new Date(al.firedAt).toLocaleTimeString()}</span>
                    {al.actual && <span className="text-mono">{al.actual} / {al.threshold}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-row page-row-2">
        {/* Top Slow APIs */}
        <div className="section">
          <div className="section-header">
            <span className="section-title"><Zap size={16} /> Slowest APIs (P95)</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/apis')}>View All</button>
          </div>
          <div className="section-body-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th className="right">P95</th>
                  <th className="right">Error Rate</th>
                  <th className="right">Req/day</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { method: 'GET', ep: '/api/claims/monthly-summary', p95: '8500ms', err: '15.0%', req: '560', status: 'critical' },
                  { method: 'GET', ep: '/api/claims/monthly', p95: '5900ms', err: '1.2%', req: '1840', status: 'critical' },
                  { method: 'GET', ep: '/api/claims/dashboard', p95: '1800ms', err: '0.4%', req: '12400', status: 'warning' },
                  { method: 'POST', ep: '/api/claims/submit', p95: '850ms', err: '8.2%', req: '720', status: 'warning' },
                ].map((row, i) => (
                  <tr key={i} onClick={() => navigate('/apis')} style={{ cursor: 'pointer' }}>
                    <td className="primary"><span className="badge badge-info" style={{ marginRight: 6 }}>{row.method}</span>{row.ep}</td>
                    <td className="right mono" style={{ color: row.status === 'critical' ? 'var(--status-error)' : 'var(--status-warn)' }}>{row.p95}</td>
                    <td className="right mono">{row.err}</td>
                    <td className="right mono">{row.req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Slow Procedures */}
        <div className="section">
          <div className="section-header">
            <span className="section-title"><Database size={16} /> Slowest Stored Procedures (P95)</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/database')}>View All</button>
          </div>
          <div className="section-body-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Procedure</th>
                  <th className="right">P95</th>
                  <th className="right">Timeouts</th>
                  <th className="right">Change</th>
                </tr>
              </thead>
              <tbody>
                {storedProcedures.slice(0, 4).map(sp => (
                  <tr key={sp.name} onClick={() => navigate('/database')} style={{ cursor: 'pointer' }}>
                    <td className="primary mono" style={{ fontSize: 11 }}>{sp.name}</td>
                    <td className="right mono" style={{ color: sp.p95Ms > 2000 ? 'var(--status-error)' : 'var(--text-secondary)' }}>{sp.p95Ms.toLocaleString()}ms</td>
                    <td className="right mono">{sp.timeouts}</td>
                    <td className="right mono" style={{ color: 'var(--status-error)' }}>{sp.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-row page-row-2">
        {/* High-Usage Slow Pages */}
        <div className="section">
          <div className="section-header">
            <span className="section-title"><ArrowRight size={16} /> Engineering Prioritization (Usage × Performance)</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/pages')}>View All</button>
          </div>
          <div className="section-body-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th className="right">Usage/day</th>
                  <th className="right">P95</th>
                  <th className="right">Priority</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(p => (
                  <tr key={p.name}>
                    <td className="primary">{p.name}</td>
                    <td className="right mono">{p.usagePerDay.toLocaleString()}</td>
                    <td className="right mono" style={{ color: p.p95Ms > 3000 ? 'var(--status-error)' : p.p95Ms > 1500 ? 'var(--status-warn)' : 'var(--status-ok)' }}>{p.p95Ms.toLocaleString()}ms</td>
                    <td className="right"><span className={`badge badge-${p.priority === 'critical' ? 'error' : p.priority === 'high' ? 'warn' : 'info'}`}>{p.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="section">
          <div className="section-header">
            <span className="section-title"><ServerCrash size={16} /> Recent Errors</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/errors')}>View All</button>
          </div>
          <div className="section-body-0">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Error Type</th>
                  <th className="right">Count</th>
                  <th className="right">Severity</th>
                </tr>
              </thead>
              <tbody>
                {errors.map(e => (
                  <tr key={e.id} onClick={() => navigate('/errors')} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="primary" style={{ fontSize: 11 }}>{e.type.split('.').pop()}</div>
                      <div className="text-muted" style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}>{e.endpoint}</div>
                    </td>
                    <td className="right mono">{e.count}</td>
                    <td className="right"><span className={`badge badge-${e.severity}`}>{e.severity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Traces */}
      <div className="section">
        <div className="section-header">
          <span className="section-title"><Activity size={16} /> Recent Traces</span>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/traces')}>View All</button>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trace ID</th>
                <th>Operation</th>
                <th>App</th>
                <th>Status</th>
                <th className="right">Duration</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {traces.map(t => (
                <tr key={t.traceId} onClick={() => navigate(`/traces/${t.traceId}`)} style={{ cursor: 'pointer' }}>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--accent-blue)' }}>{t.traceId.slice(0, 14)}…</td>
                  <td className="primary">{t.operation}</td>
                  <td className="text-muted">{t.app}</td>
                  <td><span className={`badge badge-${t.status === 'ok' ? 'ok' : t.status === 'error' ? 'error' : 'timeout'}`}>{t.status}</span></td>
                  <td className="right mono" style={{ color: t.durationMs > 5000 ? 'var(--status-error)' : 'var(--text-secondary)' }}>{(t.durationMs / 1000).toFixed(1)}s</td>
                  <td className="text-muted mono" style={{ fontSize: 11 }}>{new Date(t.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
