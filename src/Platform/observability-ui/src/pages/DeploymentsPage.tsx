import { deployments } from '../data/demoData'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { TrendingDown, Zap, AlertTriangle, CheckCircle } from 'lucide-react'

const regressionData = [
  { time: '04:00', p95: 720 }, { time: '04:30', p95: 740 }, { time: '05:00', p95: 730 },
  { time: '05:01', p95: 730 }, // deployment
  { time: '05:15', p95: 1200 }, { time: '05:30', p95: 2100 }, { time: '06:00', p95: 2800 },
  { time: '07:00', p95: 4200 }, { time: '08:00', p95: 5100 }, { time: '09:00', p95: 5900 },
  { time: '10:00', p95: 6100 }, { time: '11:00', p95: 6900 },
]

export default function DeploymentsPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Deployments</h1>
        <p>Deployment events correlated with performance changes. Regressions detected automatically using pre/post P95 comparison.</p>
      </div>

      {/* Regression chart */}
      <div className="section" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title"><TrendingDown size={16} /> Deployment Regression Visualization — v2.7.4 (Scenario 2)</span>
          <span className="badge badge-error">Regression Detected</span>
        </div>
        <div className="section-body">
          <div className="bottleneck-callout" style={{ marginBottom: 20 }}>
            <div className="bottleneck-callout-icon"><Zap size={20} /></div>
            <div>
              <h3>Performance Regression Observed After v2.7.4</h3>
              <p>
                P95 latency for Claims APIs increased from <strong>720ms → 6900ms (+858%)</strong> following deployment at 05:01 UTC.
                This is a <em>correlation</em>, not confirmed causation. Investigation recommended: review commit a3f9b2c for database schema changes or stored procedure modifications.
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={regressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="regrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f85149" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f85149" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6e7681' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6e7681' }} unit="ms" />
              <Tooltip contentStyle={{ background: '#21262d', border: '1px solid #30363d', borderRadius: 6, fontSize: 11 }} />
              <ReferenceLine x="05:01" stroke="#d29922" strokeDasharray="4 4" label={{ value: 'v2.7.4 Deployed', fill: '#d29922', fontSize: 11, position: 'top' }} />
              <Area type="monotone" dataKey="p95" stroke="#f85149" fill="url(#regrGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All deployments */}
      {deployments.map(dep => (
        <div key={dep.id} style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          marginBottom: 16,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            background: 'rgba(22, 27, 34, 0.4)',
            borderBottom: '1px solid var(--border)'
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{dep.version}</span>
            <span className={`badge badge-${dep.health === 'regression' ? 'error' : dep.health === 'healthy' ? 'ok' : 'warn'}`}>
              {dep.health === 'regression' ? 'Regression' : dep.health === 'healthy' ? 'Healthy' : 'Unknown'}
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {new Date(dep.deployedAt).toLocaleString()}
            </span>
          </div>
          <div style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 16
          }}>
            <div><label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>Project</label><span style={{ color: 'var(--text-primary)' }}>{dep.project}</span></div>
            <div><label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>Application</label><span style={{ color: 'var(--text-primary)' }}>{dep.app}</span></div>
            <div><label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>Environment</label><span className="badge badge-info">{dep.env}</span></div>
            <div><label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>Commit</label><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>{dep.commit}</span></div>
            <div><label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>Deployed By</label><span style={{ color: 'var(--text-primary)' }}>{dep.deployedBy}</span></div>
            {dep.p95Before && (
              <div>
                <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>P95 Before</label>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{dep.p95Before}ms</span>
              </div>
            )}
            {dep.p95After && (
              <div>
                <label style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>P95 After</label>
                <span style={{ fontFamily: 'var(--font-mono)', color: dep.health === 'regression' ? 'var(--status-error)' : 'var(--status-ok)', fontWeight: dep.health === 'regression' ? 700 : undefined }}>
                  {dep.p95After}ms {dep.p95Before && dep.health === 'regression' && `(+${Math.round((dep.p95After / dep.p95Before - 1) * 100)}%)`}
                </span>
              </div>
            )}
          </div>
          {dep.note && (
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12, color: dep.health === 'regression' ? 'var(--status-warn)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {dep.health === 'regression' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
              {dep.note}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
