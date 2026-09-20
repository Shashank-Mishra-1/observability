import { Box, ServerCrash, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { applications } from '../data/demoData'

export default function ApplicationsPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Applications</h1>
        <p>List of all monitored application instances across all projects.</p>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title"><Box size={16} /> Applications ({applications.length})</span>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>App Name</th>
                <th>Project</th>
                <th>Type</th>
                <th>Env</th>
                <th>Version</th>
                <th className="right">Req/min</th>
                <th className="right">P95</th>
                <th className="right">Error%</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => {
                const type = app.tech.includes('API') ? 'backend' : 'frontend';
                return (
                <tr key={app.id}>
                  <td className="primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {type === 'frontend' ? <Box size={14} color="#58a6ff" /> : <Box size={14} color="#3fb950" />}
                    {app.name}
                  </td>
                  <td className="text-muted">{app.project}</td>
                  <td><span className="badge badge-info">{type.toUpperCase()}</span></td>
                  <td><span className="badge badge-warn">{app.env}</span></td>
                  <td className="mono" style={{ fontSize: 11 }}>{app.version}</td>
                  <td className="right mono">{app.requestsPerMin.toLocaleString()}</td>
                  <td className="right mono" style={{ color: app.status === 'critical' ? 'var(--status-error)' : 'var(--status-ok)' }}>
                    {app.p95Ms >= 1000 ? (app.p95Ms / 1000).toFixed(1) + 's' : app.p95Ms + 'ms'}
                  </td>
                  <td className="right mono" style={{ color: app.status === 'critical' ? 'var(--status-error)' : 'var(--status-ok)' }}>
                    {app.errorRate.toFixed(1)}%
                  </td>
                  <td>
                    {app.status === 'critical' ? 
                      <span className="badge badge-error"><AlertTriangle size={12} /> Degraded</span> : 
                      <span className="badge badge-ok"><CheckCircle2 size={12} /> Healthy</span>}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
