import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ReportBuilder from './components/ReportBuilder';
import TemplateEditor from './components/TemplateEditor';
import { DEFAULT_TEMPLATE } from './utils/defaultTemplate';


interface FindingScreenshot {
  id: string;
  name: string;
  data: string;
  caption: string;
  width?: string;
  height?: string;
  order: number;
}

interface Finding {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cvss: string;
  category: string;
  status: string;
  description: string;
  poc: string;
  remediation: string;
  scenarioId?: string; // Associated Scenario/Goal
  screenshots?: FindingScreenshot[];
}

interface GoalScenario {
  id: string;
  title: string;
  description: string;
}

interface DistributionItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  copyNo: string;
}

interface VersionHistoryItem {
  id: string;
  version: string;
  date: string;
  author: string;
  description: string;
}

interface SupplementalSubSection {
  id: string;
  title: string;
  content: string;
}

interface SupplementalSection {
  id: string;
  title: string;
  content?: string;
  subSections: SupplementalSubSection[];
}

interface CustomSubSection {
  id: string;
  title: string;
  content: string;
}

interface CustomSection {
  id: string;
  title: string;
  content?: string;
  subSections: CustomSubSection[];
  insertAfter: 'executive-summary' | 'table-of-contents' | 'document-control' | 'technical-summary' | 'technical-details' | 'supplemental-data' | 'appendices';
}

interface Appendices {
  methodologyKeyInfo: string;
  methodologyHighlights: string;
  methodologyMoreDetails: string;
  methodologyDetailed: string;
  assessmentTeam: { id: string; name: string; role: string; org: string; }[];
}

interface Report {
  id: string;
  name: string;
  client: string;
  date: string;
  dateEnd?: string;
  reportDate?: string;
  author: string;
  version: string;
  classification: string;
  status: 'Draft' | 'Review in progress' | 'Final';
  executiveSummary: string;
  scope: string;
  findings: Finding[];
  goalsAndScenarios?: GoalScenario[];
  strategicRecommendations?: string;
  usingThisReport?: string;
  distributionList?: DistributionItem[];
  versionHistory?: VersionHistoryItem[];
  caveats?: string;
  cleanup?: string;
  supplementalSections?: SupplementalSection[];
  customSections?: CustomSection[];
  appendices?: Appendices;
  createdAt?: string;
  updatedAt?: string;
}

const SAMPLE_REPORT: Report = {
  id: 'sample-report-id-1',
  name: 'OMNI CONSU-PORTAL EXTERNAL PENETRATION REPORT',
  client: 'Omni Consumer Products',
  date: '2026-05-01',
  dateEnd: '2026-05-30',
  reportDate: '2026-05-30',
  author: 'Analyst Delta-4',
  version: '1.0',
  classification: 'CONFIDENTIAL',
  status: 'Draft',
  executiveSummary: 'Report Creator performed an external security evaluation of Omni Consumer Products exposure. The assessment revealed several serious entry points, including unauthenticated console exposure and weak parameter handling that allowed direct data extraction.',
  scope: 'Primary Web Gateway: gateway.ocp.com\nAuthentication APIs: api.ocp.com/v1\nSubnets: 198.51.100.0/24',
  strategicRecommendations: 'Establish robust identity perimeter defenses, disable weak credential caching, patch serialization endpoints, and strictly segregate corporate/guest networks.',
  usingThisReport: 'This report is structured chronologically, outlining our findings and strategic recommendations for remediation based on criticality.',
  caveats: 'The assessment was conducted within agreed rules, assuming standard operational constraints. No live user data was intentionally compromised.',
  cleanup: 'All accounts and tools deployed during evaluation have been deleted and cleaned from targeted endpoints.',
  versionHistory: [
    { id: 'vh-1', version: '1.0', date: '2026-05-30', author: 'Analyst Delta-4', description: 'Initial release' }
  ],
  distributionList: [
    { id: 'dl-1', name: 'Bob Morton', role: 'Security Head', organization: 'Omni Consumer Products', copyNo: '1' }
  ],
  goalsAndScenarios: [
    {
      id: 'gs-1',
      title: 'Obtain Access to the Corporate Network (Wireless)',
      description: 'Leverage external and guest wireless presence to access the corporate network segment.'
    },
    {
      id: 'gs-2',
      title: 'Compromise the Domain and Obtain Source Code/Payroll Data (Insider)',
      description: 'Obtain domain administrator privilege access on the primary Domain Controller (DC-01) by leveraging compromised service account hashes.'
    }
  ],
  findings: [
    {
      id: 'f-1',
      title: 'SQL Injection on Core Billing Portal',
      severity: 'Critical',
      cvss: '9.8',
      category: 'Injection',
      status: 'Open',
      description: 'The billing profile controller failed to sanitize the account parameter. An attacker can construct malicious payloads to extract the entire customer database, including plain text credentials and session hashes.',
      poc: 'GET /portal/invoice?id=123\' UNION SELECT username, password FROM users--',
      remediation: 'Utilize parameterized SQL execution blocks or input sanitization filters within the gateway routing middleware.',
      scenarioId: 'gs-2'
    },
    {
      id: 'f-2',
      title: 'Default Credentials on SSH Terminal Gateway',
      severity: 'High',
      cvss: '8.7',
      category: 'Authentication Bypass',
      status: 'In Progress',
      description: 'The SSH console at gateway.ocp.com was found to allow connections using factory-default parameters (operator/operator), allowing immediate shell access to the internal network segment.',
      poc: 'ssh operator@gateway.ocp.com\npassword: operator',
      remediation: 'Disable standard default accounts, enforce key-based SSH authentication exclusively, and modify passwords before exposing ports.',
      scenarioId: 'gs-1'
    }
  ],
  supplementalSections: [
    {
      id: 'ss-1',
      title: 'SSID Exposure Details',
      content: 'Supplemental measurements collected regarding corporate wireless signals from public spaces.',
      subSections: [
        { id: 'sss-1', title: 'SSIDs Visible from the Meeting Room at Reception', content: 'During reconnaissance, we identified several corporate networks visible from the guest reception area with strong signal levels.' }
      ]
    }
  ],
  appendices: {
    methodologyKeyInfo: 'The assessment followed a structured black-box methodology, starting with external reconnaissance, moving to vulnerability analysis, exploitation, and post-exploitation validation.',
    methodologyHighlights: 'Identified SQL injection within 2 hours of starting the assessment. Gained domain admin within 24 hours.',
    methodologyMoreDetails: 'Further details on the specific exploitation toolsets used (Metasploit, BurpSuite, Nmap) are archived in our internal assessment logs.',
    methodologyDetailed: 'A detailed walkthrough of red-teaming methodologies is standardized across all security assessments.',
    assessmentTeam: [
      { id: 'tm-1', name: 'Analyst Delta-4', role: 'Lead Red Team Operator', org: 'Report Creator' }
    ]
  },
  createdAt: '2026-05-30T10:00:00.000Z',
  updatedAt: '2026-05-30T14:30:00.000Z'
};


export default function ReportCreatorIndex() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [page, setPage] = useState<'login' | 'dashboard' | 'builder' | 'template_editor'>('dashboard');
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [htmlTemplate, setHtmlTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('shafi@admin.com');

  // Initialize and load from LocalStorage
  useEffect(() => {
    try {
      // Set Auth Status
      setIsLoggedIn(true);
      setPage('dashboard');
      const container = document.getElementById('report-creator-root');
      const email = container?.getAttribute('data-username');
      if (email) {
        setUsername(email);
      }

      // 2. Load Reports
      const savedReports = localStorage.getItem('report_creator_reports');
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      } else {
        // Prepopulate with a beautiful sample
        setReports([SAMPLE_REPORT]);
        localStorage.setItem('report_creator_reports', JSON.stringify([SAMPLE_REPORT]));
      }

      // 3. Load HTML Template
      const savedTemplate = localStorage.getItem('report_creator_template');
      const CURRENT_VERSION = '<!-- TEMPLATE_VERSION: 1.29 -->';
      if (savedTemplate && savedTemplate.includes('<!-- FINDING_TEMPLATE_START -->') && savedTemplate.includes(CURRENT_VERSION)) {
        setHtmlTemplate(savedTemplate);
      } else {
        setHtmlTemplate(DEFAULT_TEMPLATE);
        localStorage.setItem('report_creator_template', DEFAULT_TEMPLATE);
      }
    } catch (err) {
      console.error('Failed to load Report Creator state from local storage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoginSuccess = (usr: string) => {
    setIsLoggedIn(true);
    setUsername(usr);
    localStorage.setItem('report_creator_auth', 'true');
    localStorage.setItem('report_creator_username', usr);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('report_creator_auth');
    localStorage.removeItem('report_creator_username');
    setPage('login');
  };

  const handleCreateReport = (name: string, client: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    const finalClient = client || 'Internal';
    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.toUpperCase(),
      client: finalClient,
      date: today,
      dateEnd: today,
      reportDate: today,
      author: 'Tactical Operator',
      version: '1.0',
      classification: 'CONFIDENTIAL',
      status: 'Draft',
      executiveSummary: 'This is the executive summary for the security assessment of ' + finalClient + '.',
      scope: 'In scope:\n- Target systems under ' + finalClient,
      findings: [],
      goalsAndScenarios: [],
      createdAt: now,
      updatedAt: now
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('report_creator_reports', JSON.stringify(updatedReports));
    setActiveReportId(newReport.id);
    setPage('builder');
  };

  const handleSaveReport = (updatedReport: Report) => {
    const now = new Date().toISOString();
    const updatedWithTimestamp = {
      ...updatedReport,
      updatedAt: now
    };
    const updatedReports = reports.map(r => (r.id === updatedReport.id ? updatedWithTimestamp : r));
    setReports(updatedReports);
    localStorage.setItem('report_creator_reports', JSON.stringify(updatedReports));
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter(r => r.id !== id);
    setReports(updatedReports);
    localStorage.setItem('report_creator_reports', JSON.stringify(updatedReports));
    if (activeReportId === id) setActiveReportId(null);
  };

  const handleSaveTemplate = (newTemplate: string) => {
    setHtmlTemplate(newTemplate);
    localStorage.setItem('report_creator_template', newTemplate);
  };

  // Export database backup
  const handleExportData = () => {
    const dataStr = JSON.stringify({
      reports,
      htmlTemplate,
      version: '1.0',
      exportedAt: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-creator-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import database backup
  const handleImportData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.reports) && typeof parsed.htmlTemplate === 'string') {
        setReports(parsed.reports);
        setHtmlTemplate(parsed.htmlTemplate);
        localStorage.setItem('report_creator_reports', JSON.stringify(parsed.reports));
        localStorage.setItem('report_creator_template', parsed.htmlTemplate);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex flex-col justify-center items-center font-sans text-zinc-500">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#3B82F6] mb-4"></div>
        <span className="text-sm font-medium tracking-wider">LAUNCHING SYSTEMS...</span>
      </div>
    );
  }

  const activeReport = reports.find(r => r.id === activeReportId);

  return (
    <>
      {page === 'dashboard' && (
        <Dashboard
          reports={reports}
          onCreateReport={handleCreateReport}
          onSelectReport={(id) => {
            setActiveReportId(id);
            setPage('builder');
          }}
          onDeleteReport={handleDeleteReport}
          onEditTemplate={() => setPage('template_editor')}
          onLogout={() => {}}
          username={username}
        />
      )}

      {page === 'builder' && activeReport && (
        <ReportBuilder
          report={activeReport}
          htmlTemplate={htmlTemplate}
          onSaveReport={handleSaveReport}
          onClose={() => {
            setActiveReportId(null);
            setPage('dashboard');
          }}
        />
      )}

      {page === 'template_editor' && (
        <TemplateEditor
          currentTemplate={htmlTemplate}
          onSaveTemplate={handleSaveTemplate}
          onClose={() => setPage('dashboard')}
        />
      )}
    </>
  );
}
