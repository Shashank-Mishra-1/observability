import { pages } from '../data/demoData'
import { PanelsTopLeft, MousePointerClick, AlertTriangle } from 'lucide-react'

export default function PagesPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Frontend Pages (Engineering Prioritization)</h1>
        <p>Prioritizes which pages to optimize by multiplying usage volume by P95 latency. A slow page nobody visits is low priority. A medium-slow page everyone visits is critical.</p>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title"><PanelsTopLeft size={16} /> Pages by Impact ({pages.length})</span>
        </div>
        <div className="section-body-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>Page Path</th>
                <th>App</th>
                <th className="right">Usage/day</th>
                <th className="right">Avg Render</th>
                <th className="right">P95 Render</th>
                <th className="right">Impact Score</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => {
                const impactScore = Math.round(page.usagePerDay * page.p95Ms / 1000);
                return (
                <tr key={page.name} style={{ background: page.priority === 'critical' ? 'rgba(248,81,73,.03)' : undefined }}>
                  <td className="primary mono" style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {page.priority === 'critical' && <AlertTriangle size={14} color="var(--status-error)" />}
                    {page.name}
                  </td>
                  <td className="text-muted">{page.app}</td>
                  <td className="right mono"><MousePointerClick size={12} style={{ marginRight: 4, opacity: 0.5 }} />{page.usagePerDay.toLocaleString()}</td>
                  <td className="right mono">{page.avgMs}ms</td>
                  <td className="right mono" style={{ color: page.p95Ms > 3000 ? 'var(--status-error)' : page.p95Ms > 1000 ? 'var(--status-warn)' : 'var(--status-ok)' }}>
                    {page.p95Ms >= 1000 ? (page.p95Ms / 1000).toFixed(1) + 's' : page.p95Ms + 'ms'}
                  </td>
                  <td className="right mono" style={{ fontWeight: 600, color: page.priority === 'critical' ? 'var(--status-error)' : undefined }}>
                    {impactScore.toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge badge-${page.priority === 'critical' ? 'error' : page.priority === 'high' ? 'warn' : 'info'}`}>
                      {page.priority}
                    </span>
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
