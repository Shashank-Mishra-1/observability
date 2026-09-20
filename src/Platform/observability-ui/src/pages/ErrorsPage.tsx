import { errors } from '../data/demoData'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, AlertTriangle, AlertCircle, Search } from 'lucide-react'

export default function ErrorsPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="page-header">
        <h1>Error Tracking</h1>
        <p>Grouped error events with occurrence counts, first/last seen, and affected traces. PHI is never captured in error messages or stack traces.</p>
      </div>

      <div className="stat-grid stat-grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card critical"><div className="stat-card-label"><AlertOctagon size={14} /> Critical Errors</div><div className="stat-card-value" style={{ color: 'var(--status-error)' }}>2</div></div>
        <div className="stat-card warning"><div className="stat-card-label"><AlertTriangle size={14} /> High Errors</div><div className="stat-card-value" style={{ color: 'var(--status-warn)' }}>1</div></div>
        <div className="stat-card ok"><div className="stat-card-label">Medium/Low</div><div className="stat-card-value">2</div></div>
        <div className="stat-card info"><div className="stat-card-label">Total Occurrences</div><div className="stat-card-value mono">46</div></div>
      </div>

      {errors.map(err => (
        <div key={err.id} className="section" style={{ marginBottom: 16 }}>
          <div className="section-header">
            {err.severity === 'critical' ? <AlertOctagon size={16} color="var(--status-error)" /> : 
             err.severity === 'high' ? <AlertTriangle size={16} color="var(--status-warn)" /> :
             <AlertCircle size={16} color="var(--status-info)" />}
            <span className="section-title mono" style={{ fontSize: 13, flex: 0, marginRight: 12 }}>{err.type}</span>
            <span className={`badge badge-${err.severity === 'critical' ? 'error' : err.severity === 'high' ? 'warn' : 'info'}`}>{err.severity}</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{err.count} occurrences</span>
          </div>
          <div className="section-body">
            <div style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 16, background: 'var(--bg-primary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>
              {err.message}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Application</label><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{err.app}</span></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Endpoint</label><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{err.endpoint}</span></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>HTTP Status</label><span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: err.httpStatus >= 500 ? 'var(--status-error)' : 'var(--status-warn)' }}>{err.httpStatus}</span></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>First Seen</label><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{new Date(err.firstSeen).toLocaleString()}</span></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Last Seen</label><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{new Date(err.lastSeen).toLocaleString()}</span></div>
            </div>
            {err.traceId && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Investigate in Trace:</span>
                <span className="trace-link" onClick={() => navigate(`/traces/${err.traceId}`)}>
                  <Search size={12} /> {err.traceId}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
