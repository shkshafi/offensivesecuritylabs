import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, FolderGit2, ShieldAlert, Terminal, LogOut, Activity, Lock, Globe, FileText, ChevronRight, Clock, Shield, Target, AlertTriangle, ChevronUp, Users, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

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
}

interface Template {
  id: string;
  name: string;
  html: string;
  isDefault: boolean;
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
  createdAt?: string;
  updatedAt?: string;
  templateId?: string;
}

interface DashboardProps {
  reports: Report[];
  templates: Template[];
  onCreateReport: (name: string, client: string, templateId?: string) => void;
  onSelectReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onEditTemplate: () => void;
  onLogout: () => void;
  username: string;
}

const SEVERITY_COLORS = {
  Critical: '#FF4D6D',
  High: '#FF7A45',
  Medium: '#FFB020',
  Low: '#00C853',
  Info: '#3B82F6'
};

const STATUS_COLORS = {
  Draft: '#3B82F6',
  'Review in progress': '#FFB020',
  Final: '#00C853'
};

function formatTimeAgo(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'just now';

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  } catch (e) {
    return 'recently';
  }
}

export default function Dashboard({
  reports,
  templates,
  onCreateReport,
  onSelectReport,
  onDeleteReport,
  onEditTemplate,
  onLogout,
  username
}: DashboardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newReportName, setNewReportName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('default');
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const reportBeingDeleted = useMemo(() => reports.find(r => r.id === reportToDelete), [reports, reportToDelete]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName.trim()) return;
    onCreateReport(newReportName, '', selectedTemplateId);
    setNewReportName('');
    setNewClientName('');
    setSelectedTemplateId('default');
    setShowCreateModal(false);
  };

  // Calculate statistics across all reports
  const totalFindings = reports.reduce((sum, r) => sum + (r.findings?.length || 0), 0);
  const totalReports = reports.length;
  const statusCounts = useMemo(() => reports.reduce(
    (acc, r) => {
      const status = r.status || 'Draft';
      if (acc[status] !== undefined) {
        acc[status]++;
      }
      return acc;
    },
    { Draft: 0, 'Review in progress': 0, Final: 0 } as Record<string, number>
  ), [reports]);

  const uniqueClients = useMemo(() => {
    const clients = new Set(reports.map(r => r.client));
    return clients.size;
  }, [reports]);

  const chartOptions = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#131A2B',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: { color: '#F8FAFC', fontFamily: 'Inter, sans-serif' },
      padding: [8, 12],
      borderRadius: 8,
      shadowBlur: 20,
      shadowColor: 'rgba(0,0,0,0.5)',
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'Report Status Metrics',
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0B101E',
          borderWidth: 4
        },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: statusCounts.Draft, name: 'Draft', itemStyle: { color: STATUS_COLORS.Draft } },
          { value: statusCounts['Review in progress'], name: 'Review in progress', itemStyle: { color: STATUS_COLORS['Review in progress'] } },
          { value: statusCounts.Final, name: 'Final', itemStyle: { color: STATUS_COLORS.Final } }
        ]
      }
    ]
  }), [statusCounts]);

  const recentActivities = useMemo(() => {
    const activities: { id: string; action: string; target: string; time: string; timestamp: number; icon: any; color: string }[] = [];

    reports.forEach(r => {
      if (r.createdAt) {
        activities.push({
          id: `create-${r.id}`,
          action: 'Created report',
          target: r.name,
          time: formatTimeAgo(r.createdAt),
          timestamp: new Date(r.createdAt).getTime(),
          icon: Target,
          color: 'text-blue-400'
        });
      } else {
        activities.push({
          id: `create-${r.id}`,
          action: 'Created report',
          target: r.name,
          time: 'recently',
          timestamp: 0,
          icon: Target,
          color: 'text-blue-400'
        });
      }

      if (r.updatedAt && r.updatedAt !== r.createdAt) {
        activities.push({
          id: `update-${r.id}`,
          action: 'Modified report details',
          target: r.name,
          time: formatTimeAgo(r.updatedAt),
          timestamp: new Date(r.updatedAt).getTime(),
          icon: Edit3,
          color: 'text-emerald-400'
        });
      }
    });

    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  }, [reports]);

  return (
    <div className="min-h-screen bg-transparent text-slate-700 dark:text-slate-200 font-sans selection:bg-blue-500/30">
      <main className="w-full px-6 py-8">

        {/* Page Header (Lifestack Task Page style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pt-4 pb-2 mb-8 border-b border-slate-200 dark:border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-500/30 shadow-inner hidden sm:block">
              <Shield size={28} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                Report
                <span className="bg-gradient-to-br from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Creator
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Design, customize, and export professional security and pentesting reports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:w-auto justify-end">
            <button
              onClick={onEditTemplate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.05] text-sm font-medium transition-all text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <Terminal className="w-4 h-4" />
              <span>Template Settings</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="ntt-btn-glowing w-auto shrink-0"
            >
              <span className="ntt-btn-glowing-inner py-2 px-4 h-full">
                <Plus className="w-4 h-4" />
                <span>Create New Report</span>
              </span>
            </button>
          </div>
        </div>

        {/* 12-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* Left Column: Stats & Charts (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* High-Level Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-2 mb-3">
                  <FolderGit2 className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Engagements</span>
                </div>
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{reports.length}</span>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Clients</span>
                </div>
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{uniqueClients}</span>
              </div>
            </div>

            {/* Severity Analytics Chart */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 flex flex-col shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Report Status Distribution
              </h3>

              {totalReports === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-500">
                  <FolderGit2 className="w-8 h-8 mb-3 opacity-20" />
                  <p className="text-xs">No report data available</p>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="w-[160px] h-[160px] flex-shrink-0 relative">
                    <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                      <span className="text-2xl font-bold text-slate-800 dark:text-white">{totalReports}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Reports</span>
                    </div>
                  </div>

                  {/* Custom Legend */}
                  <div className="flex-1 flex flex-col gap-3">
                    {[
                      { label: 'Draft', count: statusCounts.Draft, color: STATUS_COLORS.Draft },
                      { label: 'Review', count: statusCounts['Review in progress'], color: STATUS_COLORS['Review in progress'] },
                      { label: 'Final', count: statusCounts.Final, color: STATUS_COLORS.Final },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Recent Activity Feed */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-5 border-b border-slate-200 dark:border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Recent Activity
                </h3>
              </div>
              <div className="p-5 flex flex-col gap-5">
                {recentActivities.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">No recent activity recorded.</div>
                ) : (
                  recentActivities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-4 relative">
                      {idx !== recentActivities.length - 1 && (
                        <div className="absolute top-6 left-3.5 bottom-[-20px] w-px bg-slate-200 dark:bg-slate-700/50"></div>
                      )}
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center z-10">
                        <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {activity.action} <span className="font-medium text-slate-900 dark:text-slate-100">{activity.target}</span>
                        </p>
                        <span className="text-xs text-slate-500 mt-1 block">{activity.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Active Reports (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Active Reports</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Sort by:</span>
                <button className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1">
                  Last Updated <ChevronUp className="w-3 h-3" />
                </button>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center mb-4">
                  <FolderGit2 className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-2">No Active Reports</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">Initialize a new report to begin cataloging vulnerabilities and generating reports.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white dark:text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  Create New Report
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {reports.map((report) => {
                  const status = report.status || 'Draft';
                  const critCount = report.findings?.filter(f => f.severity === 'Critical').length || 0;
                  const highCount = report.findings?.filter(f => f.severity === 'High').length || 0;
                  const medCount = report.findings?.filter(f => f.severity === 'Medium').length || 0;
                  const lowCount = report.findings?.filter(f => f.severity === 'Low').length || 0;
                  const infoCount = report.findings?.filter(f => f.severity === 'Info').length || 0;

                  return (
                    <div
                      key={report.id}
                      className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl p-5 transition-all flex flex-col sm:flex-row gap-5 relative overflow-hidden shadow-sm"
                    >
                      {/* Subtle gradient hover effect on cards */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-blue-400/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-1.5 mb-2">
                          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 break-words">{report.name}</h4>
                          <div className="flex items-center gap-2">
                            {status === 'Final' && (
                              <span className="text-[10px] uppercase tracking-wider font-bold text-[#00C853] bg-[#00C853]/10 border border-[#00C853]/20 px-2 py-0.5 rounded-full">Final</span>
                            )}
                            {status === 'Review in progress' && (
                              <span className="text-[10px] uppercase tracking-wider font-bold text-[#FFB020] bg-[#FFB020]/10 border border-[#FFB020]/20 px-2 py-0.5 rounded-full">Review</span>
                            )}
                            {status === 'Draft' && (
                              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 px-2 py-0.5 rounded-full">Draft</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-5">
                          <div className="flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span className="truncate max-w-[200px]">{report.client}</span>
                          </div>
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span>{report.date}</span>
                          </div>
                        </div>

                        {/* Severity Badges (Linear Style) */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {critCount > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.Critical }}></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{critCount} Critical</span>
                            </div>
                          )}
                          {highCount > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.High }}></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{highCount} High</span>
                            </div>
                          )}
                          {medCount > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.Medium }}></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{medCount} Medium</span>
                            </div>
                          )}
                          {lowCount > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.Low }}></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{lowCount} Low</span>
                            </div>
                          )}
                          {infoCount > 0 && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS.Info }}></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{infoCount} Info</span>
                            </div>
                          )}
                          {report.findings.length === 0 && (
                            <span className="text-xs text-slate-500">No findings logged</span>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700/50 pt-4 sm:pt-0 sm:pl-5 mt-2 sm:mt-0 relative z-10">
                        <button
                          onClick={() => setReportToDelete(report.id)}
                          className="p-1.5 text-slate-500 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 rounded-md transition-all"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onSelectReport(report.id)}
                          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/50 px-4 py-2 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-100 transition-all group-hover:border-slate-300 dark:group-hover:border-slate-600"
                        >
                          Editor <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                Create New Report
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Create a new report to begin cataloging vulnerabilities and findings.</p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Report Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReportName}
                    onChange={(e) => setNewReportName(e.target.value)}
                    placeholder="e.g. Q3 External Pentest"
                    className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-blue-400/20 transition-all hover:bg-slate-100 dark:hover:bg-slate-750"
                  />
                </div>
                {templates && templates.length > 1 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Select Template
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="w-full rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 dark:focus:ring-blue-400/20 transition-all hover:bg-slate-100 dark:hover:bg-slate-750"
                    >
                      {templates.map((t) => (
                        <option key={t.id} value={t.id} className="text-slate-800 dark:text-slate-100">
                          {t.name} {t.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => {
                      setNewReportName('');
                      setNewClientName('');
                      setShowCreateModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 text-white dark:bg-blue-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-blue-400 text-sm font-bold rounded-lg transition-all shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    Create Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Report
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">"{reports.find(r => r.id === reportToDelete)?.name}"</span>? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setReportToDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (reportToDelete) {
                      onDeleteReport(reportToDelete);
                      setReportToDelete(null);
                    }
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
