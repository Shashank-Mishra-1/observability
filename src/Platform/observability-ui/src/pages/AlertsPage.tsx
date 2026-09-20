import { alerts } from '../data/demoData'
import { Bell, AlertOctagon, AlertTriangle, CheckCircle, Plus } from 'lucide-react'

export default function AlertsPage() {
  const active = alerts.filter(a => !a.acknowledged)
  const acked = alerts.filter(a => a.acknowledged)

  return (
    <div>
      <div className="page-header">
        <h1>Alerts</h1>
        <p>Configurable threshold-based alerts. Rules evaluate against P95/P99 latency, error rates, and stored procedure timeout rates.</p>
      </div>

      <div className="stat-grid stat-grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card critical"><div className="stat-card-label"><AlertOctagon size={14} /> Active Critical</div><div className="stat-card-value" style={{ color: 'var(--status-error)' }}>{active.filter(a => a.severity === 'critical').length}</div></div>
        <div className="stat-card warning"><div className="stat-card-label"><AlertTriangle size={14} /> Active Warnings</div><div className="stat-card-value" style={{ color: 'var(--status-warn)' }}>{active.filter(a => a.severity === 'warning').length}</div></div>
        <div className="stat-card ok"><div className="stat-card-label"><CheckCircle size={14} /> Acknowledged</div><div className="stat-card-value">{acked.length}</div></div>
        <div className="stat-card info"><div className="stat-card-label"><Bell size={14} /> Total Today</div><div className="stat-card-value">{alerts.length}</div></div>
      </div>

      <div className="section">
        <div className="section-header"><span className="section-title"><AlertOctagon size={16} color="var(--status-error)" /> Active Alerts ({active.length})</span></div>
        <div className="section-body-0">
          {active.map(al => (
            <div key={al.id} className={`alert-item ${al.severity}`}>
              <div className="alert-icon">
                {al.severity === 'critical' ? <AlertOctagon size={18} color="var(--status-error)" /> : <AlertTriangle size={18} color="var(--status-warn)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="alert-message">{al.message}</div>
                <div className="alert-meta">
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{al.app}</span>
                  <span>Fired: {new Date(al.firedAt).toLocaleString()}</span>
                  {al.actual && <span className="text-mono" style={{ background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Current: {al.actual} | Threshold: {al.threshold}</span>}
                </div>
              </div>
              <button className="btn btn-secondary btn-sm"><CheckCircle size={14} /> Acknowledge</button>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-header"><span className="section-title"><CheckCircle size={16} color="var(--status-ok)" /> Acknowledged Alerts ({acked.length})</span></div>
        <div className="section-body-0">
          {acked.map(al => (
            <div key={al.id} className="alert-item" style={{ opacity: 0.7 }}>
              <div className="alert-icon"><CheckCircle size={18} color="var(--status-ok)" /></div>
              <div>
                <div className="alert-message">{al.message}</div>
                <div className="alert-meta">
                  <span>{al.app}</span>
                  <span>Fired: {new Date(al.firedAt).toLocaleString()}</span>
                  {al.acknowledgedBy && <span>Ack'd by: {al.acknowledgedBy}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Rules */}
      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-header">
          <span className="section-title">Alert Rules Configuration</span>
          <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Rule</button>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr><th>Rule</th><th>Metric</th><th>Threshold</th><th>Severity</th><th>Status</th></tr>
            </thead>
            <tbody>
              {[
                { name: 'Claims Monthly P95', metric: 'GET /api/claims/monthly → P95', threshold: '> 5000ms', severity: 'critical' },
                { name: 'Submit Error Rate', metric: 'POST /api/claims/submit → Error Rate', threshold: '> 5%', severity: 'critical' },
                { name: 'usp_GenerateMonthlySummary Timeout Rate', metric: 'usp_GenerateMonthlySummary → Timeout %', threshold: '> 10%', severity: 'critical' },
                { name: 'Deployment Regression', metric: 'Any API → P95 change after deploy', threshold: '> 50% increase', severity: 'warning' },
                { name: 'Application Availability', metric: 'Synthetic Journey → Availability', threshold: 'Any failure', severity: 'critical' },
              ].map((rule, i) => (
                <tr key={i}>
                  <td className="primary">{rule.name}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{rule.metric}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{rule.threshold}</td>
                  <td><span className={`badge badge-${rule.severity === 'critical' ? 'error' : 'warn'}`}>{rule.severity}</span></td>
                  <td><span className="badge badge-ok">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
