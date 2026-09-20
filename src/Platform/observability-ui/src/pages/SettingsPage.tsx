import { Settings, Shield, Clock, Users, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h1>Platform Settings</h1>
        <p>Administrative configuration, data retention policies, and compliance settings.</p>
      </div>

      <div className="section" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title"><Shield size={16} /> HIPAA Compliance Configuration</span>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Telemetry Field</th>
                <th>Capture Status</th>
                <th>Justification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="primary mono">http.url</td>
                <td><span className="badge badge-error">Stripped (Path Only)</span></td>
                <td className="text-muted">Prevents PHI leakage in URL query parameters.</td>
              </tr>
              <tr>
                <td className="primary mono">http.request.body</td>
                <td><span className="badge badge-error">Disabled</span></td>
                <td className="text-muted">Strictly prohibited. Contains raw payload data.</td>
              </tr>
              <tr>
                <td className="primary mono">db.statement</td>
                <td><span className="badge badge-error">Disabled</span></td>
                <td className="text-muted">Strictly prohibited. Raw SQL contains PII/PHI.</td>
              </tr>
              <tr>
                <td className="primary mono">db.procedure.name</td>
                <td><span className="badge badge-ok">Enabled</span></td>
                <td className="text-muted">Safe. Static procedure names only.</td>
              </tr>
              <tr>
                <td className="primary mono">user.id</td>
                <td><span className="badge badge-warn">Hashed (SHA-256)</span></td>
                <td className="text-muted">Required for impact analysis, but pseudonymized.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="section">
          <div className="section-header">
            <span className="section-title"><Clock size={16} /> Data Retention</span>
          </div>
          <div className="section-body">
            <div className="metric-pair"><span className="metric-pair-label">Distributed Traces (100% sampling)</span><span className="metric-pair-value">30 Days</span></div>
            <div className="metric-pair"><span className="metric-pair-label">Aggregated Metrics</span><span className="metric-pair-value">90 Days</span></div>
            <div className="metric-pair"><span className="metric-pair-label">Error Snapshots</span><span className="metric-pair-value">90 Days</span></div>
            <div className="metric-pair"><span className="metric-pair-label">Application Logs</span><span className="metric-pair-value">14 Days</span></div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <span className="section-title"><Database size={16} /> Sampling Strategy</span>
          </div>
          <div className="section-body">
            <div className="metric-pair"><span className="metric-pair-label">Production Environments</span><span className="metric-pair-value">20%</span></div>
            <div className="metric-pair"><span className="metric-pair-label">QA / Staging Environments</span><span className="metric-pair-value">100%</span></div>
            <div className="metric-pair"><span className="metric-pair-label">Error / Exception Traces</span><span className="metric-pair-value">100%</span></div>
            <div className="metric-pair"><span className="metric-pair-label">Synthetic Journeys</span><span className="metric-pair-value">100%</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
