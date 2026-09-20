import { useState } from 'react'
import { Sparkles, Database, Zap, ServerCrash, Bot } from 'lucide-react'

export default function AiAnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<boolean>(false)

  const runAnalysis = () => {
    setAnalyzing(true)
    setResult(false)
    setTimeout(() => {
      setAnalyzing(false)
      setResult(true)
    }, 1500)
  }

  return (
    <div>
      <div className="page-header">
        <h1>AI Root Cause Analysis</h1>
        <p>Synthesizes metrics, traces, and deployment events to suggest potential root causes using hedged, evidence-based language.</p>
      </div>

      <div className="section" style={{ marginBottom: 24 }}>
        <div className="section-body">
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={runAnalysis} disabled={analyzing}>
              {analyzing ? 'Analyzing Telemetry...' : <><Sparkles size={16} /> Why is the Claims Report slow this week?</>}
            </button>
            <button className="btn btn-secondary" disabled>Analyze Error Spike (HR Portal)</button>
            <button className="btn btn-secondary" disabled>Investigate Connection Pool</button>
          </div>

          {!result && !analyzing && (
            <div className="empty-state">
              <Bot size={32} opacity={0.5} />
              <div>Select a preset investigation to run the analysis engine.</div>
            </div>
          )}

          {analyzing && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: 16 }}><Sparkles className="animate-spin" size={24} /></div>
              <div>Correlating distributed traces with deployment events...</div>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <div className="ai-disclaimer">
                <Sparkles size={16} style={{ marginTop: 2 }} />
                <div>
                  <strong>AI Generated Analysis</strong><br />
                  This analysis is based on correlated telemetry over the last 7 days. These are likely contributors, not confirmed causal relationships.
                </div>
              </div>

              <div className="ai-finding">
                <div className="ai-finding-header">
                  <Database size={16} color="var(--bottleneck)" />
                  <span className="ai-finding-category" style={{ color: 'var(--bottleneck)' }}>High Probability: Database Performance Degradation</span>
                </div>
                <div className="ai-finding-observation">
                  The stored procedure <strong>usp_GetMonthlyClaims</strong> was observed taking significantly longer than baseline. This is the primary bottleneck in 84% of the slow traces.
                </div>
                <div className="ai-evidence">
                  <span className="ai-evidence-chip">Avg: 2100ms</span>
                  <span className="ai-evidence-chip" style={{ color: 'var(--status-error)', borderColor: 'rgba(248,81,73,.3)' }}>P95: 4800ms (+880%)</span>
                  <span className="ai-evidence-chip">Timeouts: 84 (15%)</span>
                </div>
              </div>

              <div className="ai-finding">
                <div className="ai-finding-header">
                  <Zap size={16} color="var(--status-warn)" />
                  <span className="ai-finding-category" style={{ color: 'var(--status-warn)' }}>Medium Probability: Deployment Correlation</span>
                </div>
                <div className="ai-finding-observation">
                  The latency increase strongly correlates with deployment <strong>v2.7.4</strong>. P95 latency increased by 858% immediately following this release on Thursday at 05:01 UTC.
                </div>
                <div className="ai-evidence">
                  <span className="ai-evidence-chip">Pre-deploy P95: 720ms</span>
                  <span className="ai-evidence-chip" style={{ color: 'var(--status-warn)', borderColor: 'rgba(210,153,34,.3)' }}>Post-deploy P95: 6900ms</span>
                </div>
              </div>

              <div className="ai-finding">
                <div className="ai-finding-header">
                  <ServerCrash size={16} color="var(--status-error)" />
                  <span className="ai-finding-category" style={{ color: 'var(--status-error)' }}>Secondary Impact: Cascading Errors</span>
                </div>
                <div className="ai-finding-observation">
                  The slow database queries are likely causing the .NET connection pool to exhaust, resulting in <strong>InvalidOperationException</strong> errors on completely unrelated lightweight queries.
                </div>
                <div className="ai-evidence">
                  <span className="ai-evidence-chip" style={{ color: 'var(--status-error)', borderColor: 'rgba(248,81,73,.3)' }}>Error Rate: 8.2%</span>
                  <span className="ai-evidence-chip">Occurrences: 14</span>
                </div>
              </div>

              <div className="ai-recommendation">
                <strong>Recommended Action:</strong> Inspect commit <code>a3f9b2c</code> (v2.7.4) for missing database indexes or `JOIN` regressions in `usp_GetMonthlyClaims`.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
