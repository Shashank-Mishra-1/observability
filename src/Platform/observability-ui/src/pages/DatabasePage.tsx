import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { storedProcedures } from '../data/demoData'
import { Database, Lock, AlertTriangle, Activity } from 'lucide-react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DatabasePage() {
  return (
    <div>
      <div className="page-header">
        <h1>Database & Stored Procedures</h1>
        <p>Execution time, percentiles, timeouts, and error rates per stored procedure. PHI-safe — procedure metadata only, no data captured.</p>
      </div>

      {/* PHI Safety Banner */}
      <div style={{ background: 'var(--status-info-bg)', border: '1px solid rgba(56,139,253,.2)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Lock size={18} color="var(--accent-blue)" style={{ marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 2 }}>HIPAA-Safe Telemetry</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Only procedure name, duration, row count, and status are captured. No query parameters, no result set contents, no PHI.</div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title"><Database size={16} /> Stored Procedures ({storedProcedures.length})</span>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Procedure</th>
                <th>App</th>
                <th>DB</th>
                <th className="right">Executions</th>
                <th className="right">Avg</th>
                <th className="right">P95</th>
                <th className="right">P99</th>
                <th className="right">Timeouts</th>
                <th className="right">Errors</th>
                <th className="right">Avg Rows</th>
                <th className="right">Change</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {storedProcedures.map(sp => {
                const isCritical = sp.p95Ms > 3000 || sp.timeouts > 20
                const trendData = days.map((d, i) => ({ day: d, p95: sp.trend[i] }))
                return (
                  <tr key={sp.name} style={{ background: isCritical ? 'rgba(248,81,73,.03)' : undefined }}>
                    <td className="primary mono" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isCritical && <AlertTriangle size={14} color="var(--status-error)" />}
                      {sp.name}
                    </td>
                    <td className="text-muted">{sp.app}</td>
                    <td><span className="badge badge-info">{sp.db}</span></td>
                    <td className="right mono">{sp.execCount.toLocaleString()}</td>
                    <td className="right mono">{sp.avgMs >= 1000 ? (sp.avgMs / 1000).toFixed(2) + 's' : sp.avgMs + 'ms'}</td>
                    <td className="right mono" style={{ color: sp.p95Ms > 3000 ? 'var(--status-error)' : sp.p95Ms > 1000 ? 'var(--status-warn)' : 'var(--status-ok)', fontWeight: sp.p95Ms > 3000 ? 700 : undefined }}>
                      {sp.p95Ms >= 1000 ? (sp.p95Ms / 1000).toFixed(2) + 's' : sp.p95Ms + 'ms'}
                    </td>
                    <td className="right mono" style={{ color: sp.p99Ms > 10000 ? 'var(--status-timeout)' : 'var(--text-secondary)' }}>
                      {sp.p99Ms >= 1000 ? (sp.p99Ms / 1000).toFixed(1) + 's' : sp.p99Ms + 'ms'}
                    </td>
                    <td className="right mono" style={{ color: sp.timeouts > 10 ? 'var(--status-error)' : 'var(--text-secondary)', fontWeight: sp.timeouts > 10 ? 700 : undefined }}>
                      {sp.timeouts}
                    </td>
                    <td className="right mono" style={{ color: sp.errors > 0 ? 'var(--status-error)' : 'var(--text-secondary)' }}>
                      {sp.errors}
                    </td>
                    <td className="right mono">{sp.avgRows.toLocaleString()}</td>
                    <td className="right mono" style={{ color: 'var(--status-error)', fontWeight: 700 }}>{sp.change}</td>
                    <td style={{ width: 110 }}>
                      <ResponsiveContainer width={100} height={30}>
                        <LineChart data={trendData}>
                          <Line type="monotone" dataKey="p95" stroke={isCritical ? '#f85149' : '#58a6ff'} strokeWidth={1.5} dot={false} />
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

      {/* Detailed view - Scenario 5: Average hides P99 timeout problem */}
      <div className="section" style={{ marginTop: 16 }}>
        <div className="section-header">
          <span className="section-title"><Activity size={16} /> usp_GenerateMonthlySummary — Scenario 5: Why Average Lies</span>
          <span className="badge badge-timeout">15% Timeout Rate</span>
        </div>
        <div className="section-body">
          <div className="bottleneck-callout" style={{ marginBottom: 20, background: 'var(--status-timeout-bg)', borderColor: 'rgba(163,113,247,.3)' }}>
            <div className="bottleneck-callout-icon" style={{ color: 'var(--status-timeout)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ color: 'var(--status-timeout)' }}>Intermittent Timeout Pattern</h3>
              <p>
                Average execution time appears <strong>acceptable at 2.1s</strong>. However, P99 reveals <strong>30s timeouts</strong> occurring 15% of the time.
                Monitoring averages alone would have completely hidden this issue. 84 timeouts recorded in the past 24h.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Percentile Breakdown</div>
              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 8, padding: '4px 16px', border: '1px solid var(--border)' }}>
                {[
                  { label: 'Average', value: '2,100ms', highlight: false },
                  { label: 'P50 (median)', value: '1,400ms', highlight: false },
                  { label: 'P75', value: '2,800ms', highlight: false },
                  { label: 'P90', value: '6,200ms', highlight: true },
                  { label: 'P95', value: '8,500ms', highlight: true },
                  { label: 'P99', value: '30,000ms (timeout)', highlight: true },
                ].map(row => (
                  <div key={row.label} className="metric-pair">
                    <span className="metric-pair-label">{row.label}</span>
                    <span className="metric-pair-value" style={{ color: row.highlight ? 'var(--status-timeout)' : undefined }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>7-Day P95 Trend</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={days.map((d, i) => ({ day: d, p95: storedProcedures[1].trend[i] }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6e7681' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6e7681' }} unit="ms" />
                  <Tooltip contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 11 }} />
                  <Line type="monotone" dataKey="p95" stroke="#a371f7" strokeWidth={2.5} dot={{ r: 4, fill: '#a371f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
