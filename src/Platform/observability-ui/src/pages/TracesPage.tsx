import { useNavigate, useParams } from 'react-router-dom'
import { traces } from '../data/demoData'
import { Activity } from 'lucide-react'

export default function TracesPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <h1>Distributed Traces</h1>
        <p>End-to-end request journeys. Each trace shows Frontend → API → Database timings correlated by Trace ID.</p>
      </div>
      <div className="section">
        <div className="section-header">
          <span className="section-title"><Activity size={16} /> Recent Traces ({traces.length})</span>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trace ID</th>
                <th>Operation / Page</th>
                <th>App</th>
                <th>Env</th>
                <th>Version</th>
                <th>Status</th>
                <th className="right">Duration</th>
                <th className="right">DB</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {traces.map(t => {
                const dbSpan = t.spans.find(s => s.type === 'db' && (s as any).isBottleneck)
                const dbMs = dbSpan?.durationMs ?? t.spans.find(s => s.type === 'db')?.durationMs
                return (
                  <tr key={t.traceId} onClick={() => navigate(`/traces/${t.traceId}`)} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="trace-link">{t.traceId}</span>
                    </td>
                    <td>
                      <div className="primary">{t.operation}</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>{t.page}</div>
                    </td>
                    <td className="text-muted">{t.app}</td>
                    <td className="text-muted">{t.env}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{t.version}</td>
                    <td><span className={`badge badge-${t.status === 'ok' ? 'ok' : t.status === 'error' ? 'error' : 'timeout'}`}>{t.status}</span></td>
                    <td className="right mono" style={{ color: t.durationMs > 5000 ? 'var(--status-error)' : t.durationMs > 2000 ? 'var(--status-warn)' : 'var(--status-ok)' }}>
                      {t.durationMs >= 1000 ? (t.durationMs / 1000).toFixed(1) + 's' : t.durationMs + 'ms'}
                    </td>
                    <td className="right mono" style={{ fontSize: 11, color: dbMs && dbMs > 2000 ? 'var(--bottleneck)' : 'var(--text-secondary)' }}>
                      {dbMs ? (dbMs >= 1000 ? (dbMs / 1000).toFixed(1) + 's' : dbMs + 'ms') : '—'}
                    </td>
                    <td className="text-muted mono" style={{ fontSize: 11 }}>{new Date(t.timestamp).toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
