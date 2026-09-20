import { ShieldCheck, CheckCircle2, Copy, Clock } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h1>Project Onboarding</h1>
        <p>Integrate a new application into the observability platform. Follow the steps below to configure the SDKs.</p>
      </div>

      <div className="section" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <span className="section-title"><ShieldCheck size={16} /> Integration Status: Claims Portal</span>
        </div>
        <div className="section-body">
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
              <CheckCircle2 size={24} color="var(--status-ok)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Frontend Connected</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last heartbeat: 2 seconds ago</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
              <CheckCircle2 size={24} color="var(--status-ok)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Backend Connected</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last heartbeat: 5 seconds ago</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: '1px solid rgba(210,153,34,.3)', borderRadius: 'var(--radius-md)', background: 'rgba(210,153,34,.05)' }}>
              <Clock size={24} color="var(--status-warn)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--status-warn)' }}>Database Connected (Waiting for Queries)</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Provider connected, waiting for first instrumented query to execute.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Integration Code Snippets</h3>

      <div className="section" style={{ marginBottom: 20 }}>
        <div className="section-header">
          <span className="section-title">.NET Core Backend</span>
          <button className="btn btn-secondary btn-sm"><Copy size={12} /> Copy</button>
        </div>
        <div className="section-body-0">
          <pre style={{ margin: 0, padding: 20, background: '#0d1117', overflowX: 'auto', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            <code style={{ color: '#e6edf3' }}>
<span style={{ color: '#ff7b72' }}>using</span> Company.Observability.AspNetCore;<br/><br/>
<span style={{ color: '#ff7b72' }}>var</span> builder = WebApplication.CreateBuilder(args);<br/><br/>
<span style={{ color: '#8b949e' }}>// Add Enterprise Observability</span><br/>
builder.Services.AddCompanyObservability(options =&gt; {'{'}<br/>
{'    '}options.Project = <span style={{ color: '#a5d6ff' }}>"ClaimsPortal"</span>;<br/>
{'    '}options.Application = <span style={{ color: '#a5d6ff' }}>"ClaimsAPI"</span>;<br/>
{'    '}options.CollectorEndpoint = builder.Configuration[<span style={{ color: '#a5d6ff' }}>"Observability:CollectorEndpoint"</span>];<br/>
{'    '}options.UsePostgres = <span style={{ color: '#79c0ff' }}>true</span>;<br/>
{'}'});
            </code>
          </pre>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">React / TypeScript Frontend</span>
          <button className="btn btn-secondary btn-sm"><Copy size={12} /> Copy</button>
        </div>
        <div className="section-body-0">
          <pre style={{ margin: 0, padding: 20, background: '#0d1117', overflowX: 'auto', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            <code style={{ color: '#e6edf3' }}>
<span style={{ color: '#ff7b72' }}>import</span> {'{'} Observability {'}'} <span style={{ color: '#ff7b72' }}>from</span> <span style={{ color: '#a5d6ff' }}>'company-observability-web'</span>;<br/><br/>
<span style={{ color: '#8b949e' }}>// Initialize before rendering the React tree</span><br/>
Observability.initialize({'{'}<br/>
{'    '}serviceName: <span style={{ color: '#a5d6ff' }}>'ClaimsWeb'</span>,<br/>
{'    '}otlpEndpoint: process.env.VITE_OTLP_ENDPOINT,<br/>
{'    '}environment: process.env.NODE_ENV<br/>
{'}'});
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
