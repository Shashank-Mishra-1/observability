import { useParams, useNavigate } from 'react-router-dom'
import { traces } from '../data/demoData'
import { ArrowLeft, AlertTriangle, AlertCircle, CheckCircle2, CornerDownRight, XCircle, Timer, ServerCrash } from 'lucide-react'

const spanTypeColors: Record<string, string> = {
  frontend: '#1f6feb',
  http:     '#1b4f8a',
  api:      '#1a7f37',
  service:  '#116329',
  db:       '#b45309',
  render:   '#6e40c9',
}

const spanTypeLabels: Record<string, string> = {
  frontend: 'FRONTEND',
  http:     'HTTP',
  api:      'API',
  service:  'SERVICE',
  db:       'DATABASE',
  render:   'RENDER',
}

export default function TraceDetailPage() {
  const { traceId } = useParams()
  const navigate = useNavigate()
  const trace = traces.find(t => t.traceId === traceId)

  if (!trace) return (
    <div>
      <button className="btn btn-secondary" onClick={() => navigate('/traces')}><ArrowLeft size={14} /> Back to Traces</button>
      <div className="empty-state">Trace not found.</div>
    </div>
  )

  const totalMs = trace.durationMs
  const bottleneckSpan = trace.spans.find(s => (s as any).isBottleneck || (s as any).isError)
  const pct = (ms: number) => `${Math.max(1, (ms / totalMs) * 100).toFixed(1)}%`
  const off = (offsetMs: number) => `${((offsetMs / totalMs) * 100).toFixed(1)}%`

  const fmtMs = (ms: number) => ms >= 1000 ? (ms / 1000).toFixed(2) + 's' : ms + 'ms'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/traces')}><ArrowLeft size={14} /> Back</button>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Trace Detail</h2>
        <span className={`badge badge-${trace.status === 'ok' ? 'ok' : trace.status === 'error' ? 'error' : 'timeout'}`}>{trace.status.toUpperCase()}</span>
        <span className="topbar-demo-badge"><CheckCircle2 size={12} /> DEMO DATA</span>
      </div>

      {/* Trace Metadata */}
      <div className="detail-header">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent-blue)', fontWeight: 600 }}>{trace.traceId}</span>
          <span className={`badge badge-${trace.status === 'ok' ? 'ok' : trace.status === 'error' ? 'error' : 'timeout'}`}>{trace.status}</span>
        </div>
        <div className="detail-meta-grid">
          <div className="detail-meta-item"><label>Operation</label><span className="value">{trace.operation}</span></div>
          <div className="detail-meta-item"><label>Page</label><span className="value">{trace.page}</span></div>
          <div className="detail-meta-item"><label>Application</label><span className="value">{trace.app}</span></div>
          <div className="detail-meta-item"><label>Environment</label><span className="value">{trace.env}</span></div>
          <div className="detail-meta-item"><label>Version</label><span className="value">{trace.version}</span></div>
          <div className="detail-meta-item"><label>Total Duration</label><span className="value" style={{ color: trace.durationMs > 5000 ? 'var(--status-error)' : 'var(--text-primary)' }}>{fmtMs(totalMs)}</span></div>
          <div className="detail-meta-item"><label>Timestamp</label><span className="value">{new Date(trace.timestamp).toLocaleString()}</span></div>
          <div className="detail-meta-item"><label>Spans</label><span className="value">{trace.spans.length}</span></div>
        </div>
      </div>

      {/* Bottleneck Callout */}
      {bottleneckSpan && (
        <div className="bottleneck-callout" style={{ borderColor: (bottleneckSpan as any).isError ? 'rgba(248,81,73,.3)' : 'rgba(240,136,62,.3)', background: (bottleneckSpan as any).isError ? 'rgba(248,81,73,.1)' : 'var(--bottleneck-bg)' }}>
          <div className="bottleneck-callout-icon" style={{ color: (bottleneckSpan as any).isError ? 'var(--status-error)' : 'var(--bottleneck)' }}>
            {(bottleneckSpan as any).isError ? <ServerCrash size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div>
            <h3 style={{ color: (bottleneckSpan as any).isError ? 'var(--status-error)' : 'var(--bottleneck)' }}>
              {(bottleneckSpan as any).isError ? 'Error Detected' : 'Primary Bottleneck Observed'}
            </h3>
            <p>
              <strong>{bottleneckSpan.operation}</strong> took <strong>{fmtMs(bottleneckSpan.durationMs)}</strong> —&nbsp;
              {((bottleneckSpan.durationMs / totalMs) * 100).toFixed(0)}% of total request time.&nbsp;
              {(bottleneckSpan as any).isError
                ? `Error: ${(bottleneckSpan as any).tags?.['exception.message'] ?? 'Unknown error'}`
                : `This is ${spanTypeLabels[bottleneckSpan.type]} time. Investigate this component first.`}
            </p>
          </div>
        </div>
      )}

      {/* Summary Bar */}
      {trace.summary && (
        <div className="section" style={{ marginBottom: 16 }}>
          <div className="section-header">
            <span className="section-title">Time Distribution</span>
          </div>
          <div className="section-body">
            <div style={{ display: 'flex', gap: 0, height: 32, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              {Object.entries(trace.summary).filter(([, ms]) => ms > 0).map(([key, ms]) => {
                const colors: Record<string, string> = { frontend: '#1f6feb', network: '#1b4f8a', api: '#1a7f37', service: '#116329', database: '#b45309' }
                const labels: Record<string, string> = { frontend: 'FE', network: 'NET', api: 'API', service: 'SVC', database: 'DB' }
                return (
                  <div key={key} title={`${key}: ${fmtMs(ms as number)}`} style={{ flex: ms as number, background: colors[key] ?? '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', minWidth: 2 }}>
                    {(ms as number) > totalMs * 0.08 ? `${labels[key]} ${fmtMs(ms as number)}` : ''}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {Object.entries(trace.summary).map(([key, ms]) => {
                const colors: Record<string, string> = { frontend: '#1f6feb', network: '#1b4f8a', api: '#1a7f37', service: '#116329', database: '#b45309' }
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[key] ?? '#444' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{key}: <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{fmtMs(ms as number)}</strong></span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Waterfall */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Span Waterfall — {trace.spans.length} spans</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total: {fmtMs(totalMs)}</span>
        </div>
        <div className="section-body-0">
          {/* Header */}
          <div className="waterfall-header">
            <div style={{ width: 280, padding: '0 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>Span</div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: 10, color: 'var(--text-muted)' }}>
              <span>0ms</span>
              <span>{fmtMs(totalMs / 2)}</span>
              <span>{fmtMs(totalMs)}</span>
            </div>
            <div style={{ width: 80, textAlign: 'right', paddingRight: 16, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>DURATION</div>
          </div>

          <div className="waterfall-container">
            {trace.spans.map((span) => {
              const isBottleneck = (span as any).isBottleneck
              const isError = (span as any).isError || span.status === 'error'
              const isTimeout = span.status === 'timeout'
              const leftPct = off((span as any).startOffsetMs ?? 0)
              const widthPct = pct(span.durationMs)
              const color = isError ? 'var(--status-error)' : isTimeout ? 'var(--status-timeout)' : isBottleneck ? 'var(--bottleneck)' : spanTypeColors[span.type] ?? '#444'
              const indent = { parent: 0, child: 20, grandchild: 40 }
              const parentId = (span as any).parentId
              const grandparent = parentId ? trace.spans.find(s => s.id === trace.spans.find(s2 => s2.id === parentId)?.parentId) : null
              const indentPx = parentId ? (grandparent ? 40 : 20) : 0

              return (
                <div key={span.id} className="waterfall-row" style={{ background: isBottleneck ? 'rgba(240,136,62,.05)' : isError ? 'rgba(248,81,73,.04)' : undefined }}>
                  <div className="waterfall-label" style={{ paddingLeft: 12 + indentPx }}>
                    {indentPx > 0 && <span style={{ color: 'var(--border)', fontSize: 11, display: 'flex', alignItems: 'center' }}><CornerDownRight size={12} style={{ marginRight: 4 }} /></span>}
                    <span className={`span-type span-type-${span.type}`}>{spanTypeLabels[span.type]}</span>
                    <span style={{ fontSize: 12, color: isBottleneck ? 'var(--bottleneck)' : isError ? 'var(--status-error)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {span.operation}
                      {isBottleneck && <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 2 }}><AlertTriangle size={12} /> Bottleneck</span>}
                      {isError && <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 2 }}><XCircle size={12} /> Error</span>}
                      {isTimeout && <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 2 }}><Timer size={12} /> Timeout</span>}
                    </span>
                  </div>
                  <div className="waterfall-track">
                    <div
                      className={`waterfall-bar`}
                      style={{
                        left: leftPct,
                        width: widthPct,
                        background: color,
                        boxShadow: isBottleneck ? `0 0 10px ${color}60` : undefined,
                      }}
                    >
                      {span.durationMs > totalMs * 0.1 ? fmtMs(span.durationMs) : ''}
                    </div>
                  </div>
                  <div className="waterfall-duration" style={{ color: isBottleneck ? 'var(--bottleneck)' : isError ? 'var(--status-error)' : undefined, fontWeight: isBottleneck ? 700 : undefined }}>
                    {fmtMs(span.durationMs)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Span Tags */}
      {trace.spans.some(s => (s as any).tags && Object.keys((s as any).tags).length > 0) && (
        <div className="section" style={{ marginTop: 16 }}>
          <div className="section-header">
            <span className="section-title">Span Attributes</span>
          </div>
          <div className="section-body">
            {trace.spans.filter(s => (s as any).tags && Object.keys((s as any).tags).length > 0).map(span => (
              <div key={span.id} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                  {span.operation}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries((span as any).tags ?? {}).map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--accent-blue)' }}>{k}</span>
                      <span style={{ color: 'var(--text-muted)' }}> = </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
