import { FolderOpen, Activity, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { applications } from '../data/demoData'

const projects = [
  { id: 'p1', name: 'Claims Portal', envs: ['Production', 'QA'], health: 'critical', apps: 2 },
  { id: 'p2', name: 'HR Portal', envs: ['Production'], health: 'healthy', apps: 1 },
  { id: 'p3', name: 'Finance Dashboard', envs: ['UAT'], health: 'healthy', apps: 1 },
]

export default function ProjectsPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Projects</h1>
        <p>Top-level organizational view. A Project contains multiple Applications (e.g. Frontend + API) across multiple Environments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {projects.map(proj => (
          <div key={proj.id} className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: proj.health === 'critical' ? 'var(--status-error-bg)' : 'var(--status-ok-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: proj.health === 'critical' ? 'var(--status-error)' : 'var(--status-ok)' }}>
                <FolderOpen size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{proj.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{proj.apps} Applications</div>
              </div>
              {proj.health === 'critical' ? <ShieldAlert size={20} color="var(--status-error)" /> : <CheckCircle2 size={20} color="var(--status-ok)" />}
            </div>
            <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {proj.envs.map(env => <span key={env} className="badge badge-info">{env}</span>)}
              </div>
              
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {applications.filter(a => a.project === proj.name).map(app => (
                  <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <span>{app.name}</span>
                    {app.health === 'critical' ? <span style={{ color: 'var(--status-error)' }}>Degraded</span> : <span style={{ color: 'var(--status-ok)' }}>Healthy</span>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>View Telemetry <Activity size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
