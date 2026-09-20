import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, FolderOpen, Box, PanelsTopLeft, 
  Activity, ArrowRightLeft, Database, AlertOctagon, 
  Bell, UploadCloud, RefreshCw, Sparkles, Settings,
  ShieldCheck, CheckCircle2, Target
} from 'lucide-react'
import { alerts } from './data/demoData'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import PagesPage from './pages/PagesPage'
import TracesPage from './pages/TracesPage'
import TraceDetailPage from './pages/TraceDetailPage'
import ApisPage from './pages/ApisPage'
import DatabasePage from './pages/DatabasePage'
import ErrorsPage from './pages/ErrorsPage'
import AlertsPage from './pages/AlertsPage'
import DeploymentsPage from './pages/DeploymentsPage'
import SyntheticsPage from './pages/SyntheticsPage'
import AiAnalysisPage from './pages/AiAnalysisPage'
import SettingsPage from './pages/SettingsPage'
import OnboardingPage from './pages/OnboardingPage'

const pageTitles: Record<string, string> = {
  '/': 'Overview Dashboard',
  '/projects': 'Projects',
  '/applications': 'Applications',
  '/pages': 'Pages',
  '/traces': 'Distributed Traces',
  '/apis': 'API Endpoints',
  '/database': 'Database & Stored Procedures',
  '/errors': 'Error Tracking',
  '/alerts': 'Alerts',
  '/deployments': 'Deployments',
  '/synthetics': 'Synthetic Monitoring',
  '/ai': 'AI Analysis',
  '/settings': 'Settings',
  '/onboarding': 'Project Onboarding',
}

const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length

export default function App() {
  const location = useLocation()
  const matchedTitle = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => location.pathname === path || location.pathname.startsWith(path + '/'))
  const pageTitle = matchedTitle?.[1] ?? 'Observability Platform'

  return (
    <div className="app-layout">
      {/* ── SIDEBAR ── */}
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Target size={18} strokeWidth={2.5} />
          </div>
          <div>
            <div className="sidebar-brand-text">Observability</div>
            <div className="sidebar-brand-sub">Performance Intelligence</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Platform</div>
          <SidebarLink to="/" label="Dashboard" icon={LayoutDashboard} exact />
          <SidebarLink to="/projects" label="Projects" icon={FolderOpen} />
          <SidebarLink to="/applications" label="Applications" icon={Box} />
          <SidebarLink to="/pages" label="Pages" icon={PanelsTopLeft} />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Telemetry</div>
          <SidebarLink to="/traces" label="Traces" icon={Activity} />
          <SidebarLink to="/apis" label="APIs" icon={ArrowRightLeft} />
          <SidebarLink to="/database" label="Database" icon={Database} />
          <SidebarLink to="/errors" label="Errors" icon={AlertOctagon} badge={3} />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Operations</div>
          <SidebarLink to="/alerts" label="Alerts" icon={Bell} badge={criticalAlerts || undefined} />
          <SidebarLink to="/deployments" label="Deployments" icon={UploadCloud} />
          <SidebarLink to="/synthetics" label="Synthetics" icon={RefreshCw} />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Intelligence</div>
          <SidebarLink to="/ai" label="AI Analysis" icon={Sparkles} />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Admin</div>
          <SidebarLink to="/onboarding" label="Onboarding" icon={ShieldCheck} />
          <SidebarLink to="/settings" label="Settings" icon={Settings} />
        </div>
      </nav>

      {/* ── MAIN AREA ── */}
      <div className="main-area">
        <header className="topbar">
          <span className="topbar-page-title">{pageTitle}</span>
          <div className="topbar-demo-badge">
            <CheckCircle2 size={12} />
            DEMO DATA
          </div>
          <div className="topbar-filter-bar">
            <select className="topbar-select">
              <option>All Projects</option>
              <option>Claims Portal</option>
              <option>HR Portal</option>
              <option>Finance Dashboard</option>
            </select>
            <select className="topbar-select">
              <option>Production</option>
              <option>QA</option>
              <option>UAT</option>
              <option>Development</option>
            </select>
            <select className="topbar-select">
              <option>Last 24h</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/pages" element={<PagesPage />} />
            <Route path="/traces" element={<TracesPage />} />
            <Route path="/traces/:traceId" element={<TraceDetailPage />} />
            <Route path="/apis" element={<ApisPage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/errors" element={<ErrorsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/deployments" element={<DeploymentsPage />} />
            <Route path="/synthetics" element={<SyntheticsPage />} />
            <Route path="/ai" element={<AiAnalysisPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ to, label, icon: Icon, exact, badge }: { to: string; label: string; icon: React.ElementType; exact?: boolean; badge?: number }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
    >
      <Icon size={16} strokeWidth={2} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge ? <span className="sidebar-badge">{badge}</span> : null}
    </NavLink>
  )
}
