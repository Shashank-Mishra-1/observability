import { syntheticJourneys as synthetics } from '../data/demoData'
import { RefreshCw, PlayCircle, CheckCircle2, XCircle, Timer, AlertTriangle } from 'lucide-react'

export default function SyntheticsPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Synthetic Monitoring</h1>
        <p>Proactive black-box testing. Simulates user journeys on a schedule to catch regressions before real users report them.</p>
      </div>

      <div className="stat-grid stat-grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card warning"><div className="stat-card-label"><RefreshCw size={14} /> Total Journeys</div><div className="stat-card-value">2</div></div>
        <div className="stat-card critical"><div className="stat-card-label"><AlertTriangle size={14} /> Failing</div><div className="stat-card-value" style={{ color: 'var(--status-error)' }}>1</div></div>
        <div className="stat-card ok"><div className="stat-card-label"><CheckCircle2 size={14} /> Passing</div><div className="stat-card-value">1</div></div>
        <div className="stat-card info"><div className="stat-card-label"><Timer size={14} /> Run Frequency</div><div className="stat-card-value mono">5m</div></div>
      </div>

      {synthetics.map(syn => (
        <div key={syn.id} className="section" style={{ marginBottom: 20, borderColor: syn.status === 'failing' ? 'rgba(248,81,73,.3)' : undefined }}>
          <div className="section-header" style={{ background: syn.status === 'failing' ? 'rgba(248,81,73,.05)' : undefined }}>
            {syn.status === 'failing' ? <XCircle size={18} color="var(--status-error)" /> : <CheckCircle2 size={18} color="var(--status-ok)" />}
            <span className="section-title" style={{ color: syn.status === 'failing' ? 'var(--status-error)' : 'var(--text-primary)' }}>{syn.name}</span>
            <span className={`badge badge-${syn.status === 'failing' ? 'error' : 'ok'}`}>{syn.status.toUpperCase()}</span>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}><PlayCircle size={14} /> Run Now</button>
          </div>
          <div className="section-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Project</label><div style={{ color: 'var(--text-primary)' }}>{syn.project}</div></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Environment</label><div className="badge badge-info">{syn.env}</div></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Last Run</label><div style={{ fontFamily: 'var(--font-mono)' }}>{new Date(syn.lastRun).toLocaleString()}</div></div>
              <div><label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Duration</label><div style={{ fontFamily: 'var(--font-mono)' }}>{syn.durationMs}ms</div></div>
            </div>

            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 12 }}>Journey Steps</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {syn.steps.map((step, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', 
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${step.status === 'pass' ? 'var(--status-ok)' : 'var(--status-error)'}`
                }}>
                  {step.status === 'pass' ? <CheckCircle2 size={16} color="var(--status-ok)" /> : <XCircle size={16} color="var(--status-error)" />}
                  <span style={{ width: 30, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{(i + 1).toString().padStart(2, '0')}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{step.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: step.status === 'fail' ? 'var(--status-error)' : 'var(--text-secondary)' }}>{step.durationMs}ms</span>
                  {step.error && (
                    <span style={{ fontSize: 12, color: 'var(--status-error)', background: 'rgba(248,81,73,.1)', padding: '2px 8px', borderRadius: 4 }}>
                      {step.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
