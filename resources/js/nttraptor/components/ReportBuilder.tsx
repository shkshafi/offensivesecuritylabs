import React, { useState, useEffect, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import axios from 'axios';
import {
  ArrowLeft,
  Save,
  Printer,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Terminal,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  GripVertical,
  FileText,
  Sparkles,
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Building2,
  Calendar,
  User,
  Hash,
  Search,
  Clock,
  Target,
  Database,
  BookOpen,
  AlertCircle,
  X,
  Copy,
  Eye,
  Check
} from 'lucide-react';

interface FindingScreenshot {
  id: string;
  name: string;
  data: string; // base64
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

type CustomAnchor =
  | 'executive-summary'
  | 'table-of-contents'
  | 'document-control'
  | 'technical-summary'
  | 'technical-details'
  | 'supplemental-data'
  | 'appendices';

interface CustomSection {
  id: string;
  title: string;
  content?: string;
  subSections: CustomSubSection[];
  /** The fixed section after which this custom section is rendered. */
  insertAfter: CustomAnchor;
}

const CUSTOM_ANCHOR_OPTIONS: { id: CustomAnchor; label: string }[] = [
  { id: 'executive-summary', label: 'After Executive Summary' },
  { id: 'table-of-contents', label: 'After Table of Contents' },
  { id: 'document-control', label: 'After Document Control' },
  { id: 'technical-summary', label: 'After Technical Summary' },
  { id: 'technical-details', label: 'After Technical Details (Findings)' },
  { id: 'supplemental-data', label: 'After Supplemental Data' },
  { id: 'appendices', label: 'After Appendices (default)' }
];

const CUSTOM_ANCHOR_PLACEHOLDERS: Record<CustomAnchor, string> = {
  'executive-summary': '{{custom_after_executive_summary}}',
  'table-of-contents': '{{custom_after_table_of_contents}}',
  'document-control': '{{custom_after_document_control}}',
  'technical-summary': '{{custom_after_technical_summary}}',
  'technical-details': '{{custom_after_technical_details}}',
  'supplemental-data': '{{custom_after_supplemental_data}}',
  'appendices': '{{custom_after_appendices}}'
};

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

interface ReportBuilderProps {
  report: Report;
  htmlTemplate: string;
  onSaveReport: (updatedReport: Report) => void;
  onClose: () => void;
}

const A4_BASE_WIDTH = 800;
const A4_BASE_HEIGHT = 1130;
const PAGE_GAP = 24; // px gap between pages in the preview (outside the iframe)

const SEVERITY_COLORS = {
  Critical: '#FF4D6D',
  High: '#FF7A45',
  Medium: '#FFB020',
  Low: '#00C853',
  Info: '#3B82F6'
};

interface AITextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  fieldType:
    | 'executiveSummary'
    | 'goalDetails'
    | 'findingDescription'
    | 'poc'
    | 'remediation'
    | 'strategicRecommendations'
    | 'usingThisReport'
    | 'scope'
    | 'caveats'
    | 'cleanup'
    | 'supplemental'
    | 'methodologyKeyInfo'
    | 'methodologyHighlights'
    | 'methodologyMoreDetails'
    | 'methodologyDetailed';
  model: string;
  /** Optional: fired when the user finalizes the edit (blur or Ctrl/Cmd+Enter) or
   *  when an AI rewrite completes. Used by the parent to scroll the preview to
   *  the corresponding section. */
  onCommit?: () => void;
}

function AITextarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  fieldType,
  model,
  onCommit
}: AITextareaProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [history, setHistory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleRewrite = async () => {
    if (!value || isRewriting) return;
    setHistory(value);
    setIsRewriting(true);

    let systemContext = '';
    switch (fieldType) {
      case 'executiveSummary':
        systemContext = 'Act as a red team expert. Rewrite the following executive summary for a professional cybersecurity report. Ensure it is written in a formal, professional tone suitable for C-level executives. Use bullet points where appropriate to highlight key security concerns or recommendations. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'goalDetails':
        systemContext = 'Act as a red team expert. Rewrite the following goal/scenario description to make it professional, clear, and technical for a client report. Detail the objectives and potential impact clearly. Use bullet points where appropriate. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'findingDescription':
        systemContext = 'Act as a red team expert. Rewrite the following vulnerability description to make it professional, clear, and technically precise. Structure the explanation to clearly define the vulnerability, the impact, and the root cause. Use bullet points where appropriate. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'poc':
        systemContext = 'Act as a red team expert. Format and clarify the following proof of concept (PoC) steps or terminal outputs. Ensure the steps are clean, professional, and easy for the client\'s remediation team to follow. Keep commands or payloads intact. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'remediation':
        systemContext = 'Act as a red team expert. Rewrite the following remediation steps to make them clear, professional, and highly actionable for the client\'s engineering team. Use bullet points to list step-by-step resolution instructions. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'strategicRecommendations':
        systemContext = 'Act as a red team expert. Rewrite the strategic recommendations to be clear, impactful, and professional for C-level and technical leadership. Use bullet points where appropriate. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'usingThisReport':
        systemContext = 'Act as a red team expert. Rewrite the section about how to use this report to be clear, professional, and easy to understand for the readers. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'scope':
        systemContext = 'Act as a red team expert. Rewrite the engagement scope description to be highly professional, structured, and precise. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'caveats':
        systemContext = 'Act as a red team expert. Rewrite the assessment caveats and limitations to be professional, formal, and clear. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'cleanup':
        systemContext = 'Act as a red team expert. Rewrite the post-assessment cleanup details to be professional, detailed, and reassuring to the client. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'supplemental':
        systemContext = 'Act as a red team expert. Rewrite the following technical section content to be clear, professional, and technical. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'methodologyKeyInfo':
        systemContext = 'Act as a red team expert. Rewrite the methodology key information to be clear, professional, and concise. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'methodologyHighlights':
        systemContext = 'Act as a red team expert. Rewrite the methodology highlights to be impactful, professional, and structured. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'methodologyMoreDetails':
        systemContext = 'Act as a red team expert. Rewrite the methodology details to be technically precise and formal. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
      case 'methodologyDetailed':
        systemContext = 'Act as a red team expert. Rewrite the detailed methodology description to be professional, thorough, and structured. Do not include any intro, outro, or explanation—respond ONLY with the updated text.';
        break;
    }

    const fullPrompt = `${systemContext}\n\nOriginal Text:\n${value}`;

    try {
      const response = await axios.post('/admin/groqai/query', {
        prompt: fullPrompt,
        model: model
      });

      if (response.data?.success && response.data?.answer) {
        onChange(response.data.answer);
        if (onCommit) onCommit();
      } else {
        throw new Error(response.data?.message || 'Failed to rewrite via backend');
      }
    } catch (err: any) {
      console.warn('Backend Groq query failed or unauthenticated, trying direct Groq API query...', err);
      try {
        const directResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: model || 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'user',
                content: fullPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1500
          },
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY || ''}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (directResponse.data?.choices?.[0]?.message?.content) {
          onChange(directResponse.data.choices[0].message.content.trim());
          if (onCommit) onCommit();
        } else {
          alert('Failed to get answer from Groq AI.');
        }
      } catch (directErr: any) {
        console.error(directErr);
        const errMsg = directErr.response?.data?.error?.message || directErr.message || 'Failed to connect to Groq AI directly.';
        alert(`AI Rewrite failed:\n- Backend error: ${err.response?.data?.message || err.message}\n- Direct API error: ${errMsg}`);
      }
    } finally {
      setIsRewriting(false);
    }
  };

  const handleFormat = (type: 'bold' | 'italic' | 'bullet' | 'number') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case 'bullet':
        if (!selectedText) {
          replacement = `\n- `;
        } else {
          replacement = selectedText
            .split('\n')
            .map(line => (line.startsWith('- ') ? line : `- ${line}`))
            .join('\n');
        }
        break;
      case 'number':
        if (!selectedText) {
          replacement = `\n1. `;
        } else {
          replacement = selectedText
            .split('\n')
            .map((line, idx) => (line.match(/^\d+\.\s/) ? line : `${idx + 1}. ${line}`))
            .join('\n');
        }
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        const newCursorPos = start + replacement.length - cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className="relative w-full group flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 bg-[#0f1424] border border-white/[0.06] rounded-t-lg p-1.5 w-full">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-1 hover:bg-white/[0.08] active:bg-white/[0.12] rounded text-slate-400 hover:text-white transition-colors"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-1 hover:bg-white/[0.08] active:bg-white/[0.12] rounded text-slate-400 hover:text-white transition-colors"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-3.5 bg-white/[0.1] mx-1"></div>
        <button
          type="button"
          onClick={() => handleFormat('bullet')}
          className="p-1 hover:bg-white/[0.08] active:bg-white/[0.12] rounded text-slate-400 hover:text-white transition-colors"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('number')}
          className="p-1 hover:bg-white/[0.08] active:bg-white/[0.12] rounded text-slate-400 hover:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            adjustHeight();
          }}
          onBlur={() => { if (onCommit) onCommit(); }}
          onKeyDown={(e) => {
            // Plain Enter inside a textarea creates a newline; Ctrl/Cmd+Enter commits.
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              if (onCommit) onCommit();
            }
          }}
          placeholder={placeholder}
          className={`${className} pr-32 !rounded-t-none`}
        />
        {value && value.trim() && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {history !== null && history !== value && (
              <button
                type="button"
                onClick={() => {
                  onChange(history);
                  setHistory(null);
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/30 rounded-md text-amber-400 transition-all cursor-pointer select-none"
                title="Undo AI Rewrite"
              >
                <span>Undo</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleRewrite}
              disabled={isRewriting}
              className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/30 border border-blue-500/30 rounded-md text-blue-400 transition-all cursor-pointer select-none disabled:opacity-50"
              title="Rewrite with AI"
            >
              {isRewriting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{isRewriting ? 'Rewriting...' : 'Rewrite with AI'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportBuilder({
  report: initialReport,
  htmlTemplate,
  onSaveReport,
  onClose
}: ReportBuilderProps) {
  const [report, setReport] = useState<Report>({ ...initialReport });
  const [aiModel, setAiModel] = useState<string>('llama-3.3-70b-versatile');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axios.get('/admin/groqai/models');
        if (res.data?.success && Array.isArray(res.data.models) && res.data.models.length > 0) {
          setAvailableModels(res.data.models);
          const preferred = res.data.models.find((m: string) => m.includes('llama-3.3-70b-versatile') || m.includes('llama3-70b') || m.includes('llama-3.3'));
          setAiModel(preferred || res.data.models[0]);
        }
      } catch (err) {
        console.warn('Failed to fetch Groq models, using default Llama model', err);
      }
    };
    fetchModels();
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [expandedGoalScenario, setExpandedGoalScenario] = useState<string | null>(null);
  const shadowContainerRef = useRef<HTMLIFrameElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [showAddFindingModal, setShowAddFindingModal] = useState(false);
  const [selectedLibraryIndex, setSelectedLibraryIndex] = useState<number | null>(null);



  const containerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Split-screen drag state
  const [leftWidth, setLeftWidth] = useState(50); // % default

  // Collapsable panel states (Report Details selected on load)
  const [activeSection, setActiveSection] = useState<'info' | 'summary' | 'goals_scenarios' | 'findings' | 'supplemental' | 'appendices' | 'custom'>('info');
  const [expandedCustomSection, setExpandedCustomSection] = useState<string | null>(null);
  const [isCustomSaved, setIsCustomSaved] = useState(false);

  // Pagination & Zooming states
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomMode, setZoomMode] = useState<'width' | 'height' | 'custom'>('width');
  const [customZoom, setCustomZoom] = useState(100);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const isSummaryComplete = useMemo(() => {
    return !!(
      report.executiveSummary?.trim() &&
      report.scope?.trim() &&
      report.caveats?.trim() &&
      report.cleanup?.trim() &&
      report.strategicRecommendations?.trim() &&
      report.usingThisReport?.trim()
    );
  }, [report.executiveSummary, report.scope, report.caveats, report.cleanup, report.strategicRecommendations, report.usingThisReport]);

  const isGoalsComplete = useMemo(() => {
    const list = report.goalsAndScenarios || [];
    if (list.length === 0) return false;
    return list.every(gs => gs.title?.trim() && gs.description?.trim());
  }, [report.goalsAndScenarios]);

  const isFindingsComplete = useMemo(() => {
    const list = report.findings || [];
    if (list.length === 0) return false;
    return list.every(f => f.title?.trim() && f.category?.trim() && f.cvss?.trim() && f.description?.trim() && f.poc?.trim() && f.remediation?.trim());
  }, [report.findings]);

  const isSupplementalComplete = useMemo(() => {
    const list = report.supplementalSections || [];
    if (list.length === 0) return false;
    return list.every(sec => 
      sec.title?.trim() && 
      (sec.subSections || []).every(sub => sub.title?.trim() && sub.content?.trim())
    );
  }, [report.supplementalSections]);

  const isAppendicesComplete = useMemo(() => {
    const app = report.appendices;
    if (!app) return false;
    const team = app.assessmentTeam || [];
    if (team.length === 0) return false;
    return !!(
      app.methodologyKeyInfo?.trim() &&
      app.methodologyHighlights?.trim() &&
      app.methodologyMoreDetails?.trim() &&
      app.methodologyDetailed?.trim() &&
      team.every(m => m.name?.trim() && m.role?.trim() && m.org?.trim())
    );
  }, [report.appendices]);

  const isCustomComplete = useMemo(() => {
    const list = report.customSections || [];
    if (list.length === 0) return true;
    return list.every(sec => 
      sec.title?.trim() && 
      (sec.subSections || []).every(sub => sub.title?.trim() && sub.content?.trim())
    );
  }, [report.customSections]);

  const sectionsStatus = useMemo(() => {
    return {
      info: 'Complete',
      summary: isSummaryComplete ? 'Complete' : (report.executiveSummary?.trim() || report.scope?.trim() || report.caveats?.trim() || report.cleanup?.trim() || report.strategicRecommendations?.trim() || report.usingThisReport?.trim()) ? 'In Progress' : 'Incomplete',
      goals_scenarios: isGoalsComplete ? 'Complete' : (report.goalsAndScenarios && report.goalsAndScenarios.length > 0) ? 'In Progress' : 'Incomplete',
      findings: isFindingsComplete ? 'Complete' : (report.findings && report.findings.length > 0) ? 'In Progress' : 'Incomplete',
      supplemental: isSupplementalComplete ? 'Complete' : (report.supplementalSections && report.supplementalSections.length > 0) ? 'In Progress' : 'Incomplete',
      appendices: isAppendicesComplete ? 'Complete' : (report.appendices?.methodologyKeyInfo?.trim() || report.appendices?.methodologyHighlights?.trim() || (report.appendices?.assessmentTeam && report.appendices.assessmentTeam.length > 0)) ? 'In Progress' : 'Incomplete',
      custom: isCustomComplete ? 'Complete' : 'In Progress',
    };
  }, [
    isSummaryComplete, report.executiveSummary, report.scope, report.caveats, report.cleanup, report.strategicRecommendations, report.usingThisReport,
    isGoalsComplete, report.goalsAndScenarios,
    isFindingsComplete, report.findings,
    isSupplementalComplete, report.supplementalSections,
    isAppendicesComplete, report.appendices,
    isCustomComplete
  ]);

  const { completeCount, inProgressCount, incompleteCount, progressPercent } = useMemo(() => {
    const statusValues = Object.values(sectionsStatus);
    const complete = statusValues.filter(s => s === 'Complete').length;
    const inProgress = statusValues.filter(s => s === 'In Progress').length;
    const incomplete = statusValues.filter(s => s === 'Incomplete').length;
    const total = statusValues.length;
    const percent = Math.round((complete / total) * 100);
    return {
      completeCount: complete,
      inProgressCount: inProgress,
      incompleteCount: incomplete,
      progressPercent: percent
    };
  }, [sectionsStatus]);

  const SECTION_ORDER = ['info', 'summary', 'goals_scenarios', 'findings', 'supplemental', 'appendices', 'custom'] as const;

  const handleSaveAndContinue = () => {
    const currentIndex = SECTION_ORDER.indexOf(activeSection as any);
    if (currentIndex < SECTION_ORDER.length - 1) {
      setActiveSection(SECTION_ORDER[currentIndex + 1] as any);
    }
  };

  const sectionMeta = {
    info: {
      title: 'Report Details',
      desc: 'Manage the basic information and settings for your report.'
    },
    summary: {
      title: 'Executive Summary',
      desc: 'Outline the high-level findings, strategic recommendations, scope, constraints, and cleanup.'
    },
    goals_scenarios: {
      title: 'Goals & Scenarios',
      desc: 'Define the primary objectives, execution parameters, and scenarios for the assessment.'
    },
    findings: {
      title: 'Findings Repository',
      desc: 'Catalog and detail the security vulnerabilities and findings discovered during the engagement.'
    },
    supplemental: {
      title: 'Supplemental Data',
      desc: 'Provide any supplemental data, logs, or walkthrough steps.'
    },
    appendices: {
      title: 'Appendices',
      desc: 'Manage assessment team details and standard assessment methodologies.'
    },
    custom: {
      title: 'Custom Sections',
      desc: 'Create and order custom assessment sections to include in the report.'
    }
  };

  const activeMeta = sectionMeta[activeSection as keyof typeof sectionMeta] || sectionMeta.info;

  // Custom vertical scrollbar state and refs
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const sliderThumbRef = useRef<HTMLDivElement>(null);
  const isDraggingSlider = useRef(false);

  // Calculate active zoom value (must be declared before references in handlers)
  let calculatedZoom = 1;
  if (zoomMode === 'width') {
    calculatedZoom = (containerSize.width - 32) / A4_BASE_WIDTH;
  } else if (zoomMode === 'height') {
    calculatedZoom = (containerSize.height - 32) / A4_BASE_HEIGHT;
  } else {
    calculatedZoom = customZoom / 100;
  }
  calculatedZoom = Math.max(0.1, Math.min(3, calculatedZoom));

  const isProgrammaticScroll = useRef(false);
  const targetPage = useRef<number | null>(null);

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(clampedPage);
    targetPage.current = clampedPage;
    isProgrammaticScroll.current = true;

    const container = previewContainerRef.current;
    if (container) {
      // Try to measure actual page positions from iframe DOM for variable-height pages
      const iframe = shadowContainerRef.current;
      let scrollTarget = (clampedPage - 1) * (A4_BASE_HEIGHT + PAGE_GAP) * calculatedZoom;

      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const allPages = doc.querySelectorAll('.page');
          const topLevelPages: Element[] = [];
          allPages.forEach(p => {
            if (p.parentElement && !p.parentElement.classList.contains('page')) {
              topLevelPages.push(p);
            }
          });
          const targetEl = topLevelPages[clampedPage - 1] as HTMLElement;
          if (targetEl) {
            scrollTarget = targetEl.offsetTop * calculatedZoom;
          }
        }
      }

      container.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    const maxScroll = scrollHeight - clientHeight;
    const pct = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Direct DOM manipulation for maximum performance (60fps)
    const thumb = sliderThumbRef.current;
    if (thumb) {
      thumb.style.top = `calc(${pct * 100}% - ${pct * 56}px)`;
    }

    // Determine current page based on actual page offsets in iframe
    let scrolledPage = 1;
    const iframe = shadowContainerRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const allPages = doc.querySelectorAll('.page');
        const scrollTopUnscaled = scrollTop / calculatedZoom;
        let bestPage = 1;
        let idx = 0;
        allPages.forEach(p => {
          const parent = p.parentElement;
          if (parent && !parent.classList.contains('page')) {
            idx++;
            const el = p as HTMLElement;
            if (el.offsetTop <= scrollTopUnscaled + A4_BASE_HEIGHT / 2) {
              bestPage = idx;
            }
          }
        });
        scrolledPage = bestPage;
      }
    } else {
      const pageHeight = (A4_BASE_HEIGHT + PAGE_GAP) * calculatedZoom;
      scrolledPage = Math.floor(scrollTop / pageHeight) + 1;
    }

    const clampedPage = Math.max(1, Math.min(totalPages, scrolledPage));

    if (isProgrammaticScroll.current) {
      if (clampedPage === targetPage.current) {
        isProgrammaticScroll.current = false;
        targetPage.current = null;
      }
      return;
    }

    if (clampedPage !== currentPage) {
      setCurrentPage(clampedPage);
    }
  };

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingSlider.current = true;

    const track = sliderTrackRef.current;
    const container = previewContainerRef.current;
    if (!track || !container) return;

    const trackRect = track.getBoundingClientRect();
    const thumbHeight = 56;
    const maxTrackTravel = trackRect.height - thumbHeight;

    const updateScroll = (clientY: number) => {
      let relativeY = clientY - trackRect.top - (thumbHeight / 2);
      relativeY = Math.max(0, Math.min(maxTrackTravel, relativeY));
      const pct = maxTrackTravel > 0 ? relativeY / maxTrackTravel : 0;

      const maxScroll = container.scrollHeight - container.clientHeight;
      container.scrollTop = pct * maxScroll;

      // Update thumb position instantly for zero-latency dragging feel
      const thumb = sliderThumbRef.current;
      if (thumb) {
        thumb.style.top = `calc(${pct * 100}% - ${pct * thumbHeight}px)`;
      }
    };

    updateScroll(e.clientY);

    let animationFrameId: number;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (isDraggingSlider.current) {
          updateScroll(moveEvent.clientY);
        }
      });
    };

    const handleMouseUp = () => {
      isDraggingSlider.current = false;
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Sync scroll slider handle position on dimension, page, or zoom updates
  useEffect(() => {
    const container = previewContainerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      const pct = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const thumb = sliderThumbRef.current;
      if (thumb) {
        thumb.style.top = `calc(${pct * 100}% - ${pct * 56}px)`;
      }
    }
  }, [totalPages, currentPage, calculatedZoom]);

  const handleFitToggle = () => {
    if (zoomMode === 'width') {
      setZoomMode('custom');
      setCustomZoom(100);
    } else {
      setZoomMode('width');
    }
  };

  // Keep active page aligned when zoom changes
  useEffect(() => {
    goToPage(currentPage);
  }, [calculatedZoom]);

  // Autosave report locally when it changes
  useEffect(() => {
    onSaveReport(report);
  }, [report]);

  // Update internal state if initialReport changes
  useEffect(() => {
    if (initialReport.id !== report.id) {
      setReport({ ...initialReport });
    }
  }, [initialReport]);

  useEffect(() => {
    setIsCustomSaved(false);
  }, [activeSection]);

  // Observe container size to compute auto-zoom factors
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Track the most-recently-edited section so we can auto-scroll the preview to it.
  const [editTarget, setEditTarget] = useState<{ id: string; ts: number } | null>(null);
  const editScrollTimer = useRef<number | null>(null);

  const notifyEdit = (sectionId: string | null | undefined) => {
    if (!sectionId) return;
    setEditTarget({ id: sectionId, ts: Date.now() });
  };

  // Locate an element by id inside the iframe and scroll the preview container to it.
  // Retries briefly because iframe content is rewritten on every state change and the
  // reflow script runs asynchronously inside the iframe (50–200ms).
  const scrollPreviewToId = (sectionId: string, attempt: number = 0) => {
    const iframe = shadowContainerRef.current;
    const container = previewContainerRef.current;
    if (!iframe || !container) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    const target = doc.getElementById(sectionId);
    if (!target) {
      if (attempt < 6) {
        window.setTimeout(() => scrollPreviewToId(sectionId, attempt + 1), 200);
      }
      return;
    }
    // Walk up to compute absolute offset within the report wrapper (post-pagination).
    let topUnscaled = 0;
    let el: HTMLElement | null = target as HTMLElement;
    while (el) {
      topUnscaled += el.offsetTop || 0;
      el = el.offsetParent as HTMLElement | null;
    }
    const scrollTop = Math.max(0, (topUnscaled * calculatedZoom) - 24);
    isProgrammaticScroll.current = true;
    // Compute the page index that target belongs to so handleScroll can clear the flag
    // when the smooth scroll lands.
    const doc2 = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc2) {
      const allPages = doc2.querySelectorAll('.page');
      let idx = 0;
      let landingPage = 1;
      allPages.forEach(p => {
        const parent = p.parentElement;
        if (parent && !parent.classList.contains('page')) {
          idx++;
          const el = p as HTMLElement;
          if (el.offsetTop <= topUnscaled + A4_BASE_HEIGHT / 2) {
            landingPage = idx;
          }
        }
      });
      targetPage.current = landingPage;
      setCurrentPage(Math.max(1, Math.min(totalPages, landingPage)));
    }
    container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    // Failsafe: clear the programmatic-scroll flag even if the page heuristic doesn't match.
    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
      targetPage.current = null;
    }, 800);
  };

  // Debounced auto-scroll on edit. Waits for the reflow inside the iframe to settle
  // (mutations are processed by the template's reflow script ~30-200ms after content change).
  useEffect(() => {
    if (!editTarget) return;
    if (editScrollTimer.current) {
      window.clearTimeout(editScrollTimer.current);
    }
    editScrollTimer.current = window.setTimeout(() => {
      scrollPreviewToId(editTarget.id);
    }, 350);
    return () => {
      if (editScrollTimer.current) {
        window.clearTimeout(editScrollTimer.current);
      }
    };
  }, [editTarget]);

  // Listen for messages from the iframe bridge script: TOC clicks + forwarded wheel events.
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== 'report-creator-report') return;
      if (data.type === 'toc-nav' && typeof data.targetId === 'string') {
        scrollPreviewToId(data.targetId);
      } else if (data.type === 'wheel') {
        const container = previewContainerRef.current;
        if (!container) return;
        // DOM_DELTA_LINE = 1 (~16px/line), DOM_DELTA_PAGE = 2 (~container height).
        let dy = Number(data.deltaY) || 0;
        let dx = Number(data.deltaX) || 0;
        if (data.deltaMode === 1) { dy *= 16; dx *= 16; }
        else if (data.deltaMode === 2) { dy *= container.clientHeight; dx *= container.clientWidth; }
        container.scrollTop += dy;
        container.scrollLeft += dx;
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [calculatedZoom]);

  const updateReportField = (field: keyof Report, value: any) => {
    setReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ── Commit-based auto-scroll: triggered on Enter (inputs), Ctrl/Cmd+Enter (textareas),
  //     blur, and AI rewrite completion. NOT on every keystroke.
  const commitHandlers = (sectionId: string) => ({
    onBlur: () => notifyEdit(sectionId),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const isTextarea = (e.currentTarget.tagName || '').toLowerCase() === 'textarea';
      if (e.key === 'Enter') {
        if (!isTextarea || e.ctrlKey || e.metaKey) {
          // Plain Enter commits for inputs; Ctrl/Cmd+Enter commits for textareas.
          if (!isTextarea) e.preventDefault();
          notifyEdit(sectionId);
        }
      }
    }
  });

  const addDistributionItem = () => {
    const newItem: DistributionItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      role: '',
      organization: '',
      copyNo: String((report.distributionList?.length || 0) + 1)
    };
    updateReportField('distributionList', [...(report.distributionList || []), newItem]);
  };
  const updateDistributionItem = (id: string, field: keyof DistributionItem, value: any) => {
    const updated = (report.distributionList || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    updateReportField('distributionList', updated);
  };
  const deleteDistributionItem = (id: string) => {
    updateReportField('distributionList', (report.distributionList || []).filter(item => item.id !== id));
  };

  const addVersionHistoryItem = () => {
    const newItem: VersionHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      version: '1.0',
      date: new Date().toISOString().split('T')[0],
      author: report.author || '',
      description: ''
    };
    updateReportField('versionHistory', [...(report.versionHistory || []), newItem]);
  };
  const updateVersionHistoryItem = (id: string, field: keyof VersionHistoryItem, value: any) => {
    const updated = (report.versionHistory || []).map(item => item.id === id ? { ...item, [field]: value } : item);
    updateReportField('versionHistory', updated);
  };
  const deleteVersionHistoryItem = (id: string) => {
    updateReportField('versionHistory', (report.versionHistory || []).filter(item => item.id !== id));
  };

  const addSupplementalSection = () => {
    const newSec: SupplementalSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Supplemental Section',
      content: '',
      subSections: []
    };
    updateReportField('supplementalSections', [...(report.supplementalSections || []), newSec]);
  };
  const updateSupplementalSectionField = (id: string, field: keyof SupplementalSection, value: any) => {
    const updated = (report.supplementalSections || []).map(sec => sec.id === id ? { ...sec, [field]: value } : sec);
    updateReportField('supplementalSections', updated);
  };
  const deleteSupplementalSection = (id: string) => {
    updateReportField('supplementalSections', (report.supplementalSections || []).filter(sec => sec.id !== id));
  };

  const addSupplementalSubSection = (secId: string) => {
    const newSub: SupplementalSubSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Sub-heading',
      content: ''
    };
    const updated = (report.supplementalSections || []).map(sec => {
      if (sec.id === secId) {
        return { ...sec, subSections: [...sec.subSections, newSub] };
      }
      return sec;
    });
    updateReportField('supplementalSections', updated);
  };
  const updateSupplementalSubSectionField = (secId: string, subId: string, field: keyof SupplementalSubSection, value: any) => {
    const updated = (report.supplementalSections || []).map(sec => {
      if (sec.id === secId) {
        const updatedSub = sec.subSections.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub);
        return { ...sec, subSections: updatedSub };
      }
      return sec;
    });
    updateReportField('supplementalSections', updated);
  };
  const deleteSupplementalSubSection = (secId: string, subId: string) => {
    const updated = (report.supplementalSections || []).map(sec => {
      if (sec.id === secId) {
        return { ...sec, subSections: sec.subSections.filter(sub => sub.id !== subId) };
      }
      return sec;
    });
    updateReportField('supplementalSections', updated);
  };

  // ── Custom (Dynamic) Sections ──
  const addCustomSection = () => {
    const newSec: CustomSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Custom Section',
      content: '',
      subSections: [],
      insertAfter: 'appendices'
    };
    updateReportField('customSections', [...(report.customSections || []), newSec]);
    notifyEdit(`cust-sec-${newSec.id}`);
  };
  const updateCustomSectionField = (id: string, field: keyof CustomSection, value: any) => {
    const updated = (report.customSections || []).map(sec => sec.id === id ? { ...sec, [field]: value } : sec);
    updateReportField('customSections', updated);
  };
  const deleteCustomSection = (id: string) => {
    updateReportField('customSections', (report.customSections || []).filter(sec => sec.id !== id));
  };
  const moveCustomSection = (index: number, direction: 'up' | 'down') => {
    const list = report.customSections || [];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;
    const next = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    updateReportField('customSections', next);
    notifyEdit(`cust-sec-${next[targetIndex].id}`);
  };
  const addCustomSubSection = (secId: string) => {
    const newSub: CustomSubSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Sub-heading',
      content: ''
    };
    const updated = (report.customSections || []).map(sec => {
      if (sec.id === secId) return { ...sec, subSections: [...sec.subSections, newSub] };
      return sec;
    });
    updateReportField('customSections', updated);
    notifyEdit(`cust-sub-${newSub.id}`);
  };
  const updateCustomSubSectionField = (secId: string, subId: string, field: keyof CustomSubSection, value: any) => {
    const updated = (report.customSections || []).map(sec => {
      if (sec.id === secId) {
        const subs = sec.subSections.map(sub => sub.id === subId ? { ...sub, [field]: value } : sub);
        return { ...sec, subSections: subs };
      }
      return sec;
    });
    updateReportField('customSections', updated);
  };
  const deleteCustomSubSection = (secId: string, subId: string) => {
    const updated = (report.customSections || []).map(sec => {
      if (sec.id === secId) return { ...sec, subSections: sec.subSections.filter(sub => sub.id !== subId) };
      return sec;
    });
    updateReportField('customSections', updated);
  };
  const moveCustomSubSection = (secId: string, index: number, direction: 'up' | 'down') => {
    const updated = (report.customSections || []).map(sec => {
      if (sec.id !== secId) return sec;
      const subs = [...sec.subSections];
      if (direction === 'up' && index === 0) return sec;
      if (direction === 'down' && index === subs.length - 1) return sec;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [subs[index], subs[targetIndex]] = [subs[targetIndex], subs[index]];
      return { ...sec, subSections: subs };
    });
    updateReportField('customSections', updated);
  };

  const updateAppendicesField = (field: keyof Omit<Appendices, 'assessmentTeam'>, value: string) => {
    const currentAppendices = report.appendices || {
      methodologyKeyInfo: '',
      methodologyHighlights: '',
      methodologyMoreDetails: '',
      methodologyDetailed: '',
      assessmentTeam: []
    };
    updateReportField('appendices', {
      ...currentAppendices,
      [field]: value
    });
  };
  const addTeamMember = () => {
    const currentAppendices = report.appendices || {
      methodologyKeyInfo: '',
      methodologyHighlights: '',
      methodologyMoreDetails: '',
      methodologyDetailed: '',
      assessmentTeam: []
    };
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      role: '',
      org: ''
    };
    updateReportField('appendices', {
      ...currentAppendices,
      assessmentTeam: [...(currentAppendices.assessmentTeam || []), newMember]
    });
  };
  const updateTeamMemberField = (id: string, field: 'name' | 'role' | 'org', value: string) => {
    const currentAppendices = report.appendices || {
      methodologyKeyInfo: '',
      methodologyHighlights: '',
      methodologyMoreDetails: '',
      methodologyDetailed: '',
      assessmentTeam: []
    };
    const updatedTeam = (currentAppendices.assessmentTeam || []).map(member =>
      member.id === id ? { ...member, [field]: value } : member
    );
    updateReportField('appendices', {
      ...currentAppendices,
      assessmentTeam: updatedTeam
    });
  };
  const deleteTeamMember = (id: string) => {
    const currentAppendices = report.appendices || {
      methodologyKeyInfo: '',
      methodologyHighlights: '',
      methodologyMoreDetails: '',
      methodologyDetailed: '',
      assessmentTeam: []
    };
    updateReportField('appendices', {
      ...currentAppendices,
      assessmentTeam: (currentAppendices.assessmentTeam || []).filter(member => member.id !== id)
    });
  };

  const addFinding = () => {
    setShowAddFindingModal(true);
    setSelectedLibraryIndex(null);
  };

  const addCustomFinding = () => {
    const newFinding: Finding = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Security Finding',
      severity: 'Medium',
      cvss: '5.0',
      category: 'Web Application',
      status: 'Open',
      description: 'Describe the vulnerability here...',
      poc: 'Provide the steps or payload to reproduce the issue...',
      remediation: 'Detail how to patch this vulnerability...',
      screenshots: []
    };
    const updatedFindings = [...(report.findings || []), newFinding];
    setReport(prev => ({ ...prev, findings: updatedFindings }));
    setExpandedFinding(newFinding.id);
    setShowAddFindingModal(false);
  };

  const addPrefilledFinding = (prefilled: Omit<Finding, 'id'>) => {
    const newFinding: Finding = {
      ...prefilled,
      id: Math.random().toString(36).substr(2, 9),
      screenshots: []
    };
    const updatedFindings = [...(report.findings || []), newFinding];
    setReport(prev => ({ ...prev, findings: updatedFindings }));
    setExpandedFinding(newFinding.id);
    setShowAddFindingModal(false);
  };

  const updateFindingField = (id: string, field: keyof Finding, value: any) => {
    const updatedFindings = report.findings.map(f => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    });
    setReport(prev => ({ ...prev, findings: updatedFindings }));
  };

  const deleteFinding = (id: string) => {
    const updatedFindings = report.findings.filter(f => f.id !== id);
    setReport(prev => ({ ...prev, findings: updatedFindings }));
    if (expandedFinding === id) setExpandedFinding(null);
  };

  const moveFinding = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === report.findings.length - 1) return;

    const newFindings = [...report.findings];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFindings[index];
    newFindings[index] = newFindings[targetIndex];
    newFindings[targetIndex] = temp;

    setReport(prev => ({ ...prev, findings: newFindings }));
  };

  const addGoalScenario = () => {
    const newGS: GoalScenario = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Goal / Scenario',
      description: 'Describe the scenario objective and execution details...'
    };
    const updatedGS = [...(report.goalsAndScenarios || []), newGS];
    setReport(prev => ({ ...prev, goalsAndScenarios: updatedGS }));
    setExpandedGoalScenario(newGS.id);
  };

  const updateGoalScenarioField = (id: string, field: keyof GoalScenario, value: any) => {
    const updatedGS = (report.goalsAndScenarios || []).map(gs => {
      if (gs.id === id) {
        return { ...gs, [field]: value };
      }
      return gs;
    });
    setReport(prev => ({ ...prev, goalsAndScenarios: updatedGS }));
  };

  const deleteGoalScenario = (id: string) => {
    const updatedGS = (report.goalsAndScenarios || []).filter(gs => gs.id !== id);
    setReport(prev => ({ ...prev, goalsAndScenarios: updatedGS }));
    if (expandedGoalScenario === id) setExpandedGoalScenario(null);
  };

  const moveGoalScenario = (index: number, direction: 'up' | 'down') => {
    const gsList = report.goalsAndScenarios || [];
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === gsList.length - 1) return;

    const newGS = [...gsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newGS[index];
    newGS[index] = newGS[targetIndex];
    newGS[targetIndex] = temp;

    setReport(prev => ({ ...prev, goalsAndScenarios: newGS }));
  };

  // HTML helpers for rendering the template live
  const escapeHtml = (text: string) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const formatText = (text: string) => {
    if (!text) return '';

    const lines = text.split('\n');
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    let inCodeBlock = false;
    const formattedLines: string[] = [];

    const escapeLocalHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    const applyInlineFormatting = (str: string) => {
      // Bold
      str = str.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      str = str.replace(/__(.*?)__/g, '<strong>$1</strong>');
      // Italic
      str = str.replace(/\*(.*?)\*/g, '<em>$1</em>');
      str = str.replace(/_(.*?)_/g, '<em>$1</em>');
      // Inline code
      str = str.replace(/`(.*?)`/g, '<code style="background-color: var(--bg-alt, #F3F7FC); padding: 2px 4px; border: 1px solid var(--border, #BAD2EE); border-radius: 3px; font-family: \'IBM Plex Mono\', monospace; font-size: 0.9em; color: var(--critical, #6E0C1A);">$1</code>');
      // Links
      str = str.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--primary, #0D6EFD); text-decoration: underline;">$1</a>');
      return str;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check code block markers
      if (trimmed.startsWith('```')) {
        if (inList) {
          formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        if (inCodeBlock) {
          formattedLines.push('</pre>');
          inCodeBlock = false;
        } else {
          formattedLines.push('<pre style="background-color: var(--bg-alt, #F3F7FC); border: 1px solid var(--border, #BAD2EE); border-radius: 4px; padding: 12px; font-family: \'IBM Plex Mono\', monospace; font-size: 13px; color: var(--navy, #070F26); overflow-x: auto; margin: 12px 0; line-height: 1.5; white-space: pre-wrap; word-break: break-all;">');
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        formattedLines.push(escapeLocalHtml(line));
        continue;
      }

      // Check for headings starting with #
      if (trimmed.startsWith('### ')) {
        if (inList) {
          formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        const content = applyInlineFormatting(escapeLocalHtml(trimmed.substring(4)));
        formattedLines.push(`<h4 style="font-weight: 700; font-size: 14px; color: var(--navy, #070F26); margin-top: 16px; margin-bottom: 8px;">${content}</h4>`);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        if (inList) {
          formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        const content = applyInlineFormatting(escapeLocalHtml(trimmed.substring(3)));
        formattedLines.push(`<h3 style="font-weight: 700; font-size: 16px; color: var(--navy, #070F26); margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid var(--border, #BAD2EE); padding-bottom: 4px;">${content}</h3>`);
        continue;
      }
      if (trimmed.startsWith('# ')) {
        if (inList) {
          formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        const content = applyInlineFormatting(escapeLocalHtml(trimmed.substring(2)));
        formattedLines.push(`<h2 style="font-weight: 700; font-size: 18px; color: var(--navy, #070F26); margin-top: 24px; margin-bottom: 12px;">${content}</h2>`);
        continue;
      }

      // Detect bold sub-headings e.g. **Vulnerability Description:** or **Remediation Recommendation:**
      // It can be the entire line, or followed by a colon/dash with optional trailing text
      let boldHeadingMatch = trimmed.match(/^\*\*(.*?)\*\*(?::|-)\s*(.*)$/);
      let headingTitle = '';
      let headingRest = '';
      if (boldHeadingMatch) {
        headingTitle = boldHeadingMatch[1].trim();
        headingRest = boldHeadingMatch[2].trim();
      } else {
        const entireBoldMatch = trimmed.match(/^\*\*(.*?)\*\*$/);
        if (entireBoldMatch) {
          headingTitle = entireBoldMatch[1].trim();
        }
      }

      if (headingTitle && headingTitle.split(/\s+/).length <= 5) { // Keep it reasonably short to avoid matching long sentences
        if (inList) {
          formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }

        // Render the heading block as a professional subheading
        formattedLines.push(`<h5 style="font-weight: 700; font-size: 13.5px; color: var(--navy, #070F26); margin-top: 16px; margin-bottom: 6px; display: block;">${escapeLocalHtml(headingTitle)}</h5>`);

        // If there's rest of the text, render it as a paragraph (which might also contain inline formatting)
        if (headingRest) {
          const content = applyInlineFormatting(escapeLocalHtml(headingRest));
          formattedLines.push(`<p style="margin-bottom: 8px; line-height: 1.65; color: var(--text, #070F26);">${content}</p>`);
        }
        continue;
      }

      // Check for unordered lists (*, -, +, â€¢, â–ª, â—¦ followed by space)
      const ulMatch = trimmed.match(/^(?:[\*\-\+\u2022\u25aa\u25e6])\s+(.*)$/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) {
            formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          }
          formattedLines.push('<ul style="list-style-type: disc; margin-left: 20px; margin-top: 6px; margin-bottom: 6px; padding-left: 0;">');
          inList = true;
          listType = 'ul';
        }
        const content = applyInlineFormatting(escapeLocalHtml(ulMatch[1]));
        formattedLines.push(`<li style="margin-bottom: 4px; line-height: 1.65; color: var(--text, #070F26);">${content}</li>`);
        continue;
      }

      // Check for ordered lists (numbers followed by dot or parenthesis and space)
      const olMatch = trimmed.match(/^(\d+)(?:\.|\))\s+(.*)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) {
            formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          }
          formattedLines.push('<ol style="list-style-type: decimal; margin-left: 20px; margin-top: 6px; margin-bottom: 6px; padding-left: 0;">');
          inList = true;
          listType = 'ol';
        }
        const content = applyInlineFormatting(escapeLocalHtml(olMatch[2]));
        formattedLines.push(`<li style="margin-bottom: 4px; line-height: 1.65; color: var(--text, #070F26);">${content}</li>`);
        continue;
      }

      // If empty line, close list
      if (trimmed === '') {
        if (inList) {
          formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
          inList = false;
          listType = null;
        }
        formattedLines.push('<div style="height: 8px;"></div>');
        continue;
      }

      // Normal line
      if (inList) {
        formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
        listType = null;
      }
      const content = applyInlineFormatting(escapeLocalHtml(line));
      formattedLines.push(`<p style="margin-bottom: 8px; line-height: 1.65; color: var(--text, #070F26);">${content}</p>`);
    }

    if (inList) {
      formattedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }
    if (inCodeBlock) {
      formattedLines.push('</pre>');
    }

    return formattedLines.join('\n');
  };

  // Compile final HTML for display & print
  const compileReportHtml = () => {
    let html = htmlTemplate;

    // Severity counts
    const critical = report.findings?.filter(f => f.severity === 'Critical').length || 0;
    const high = report.findings?.filter(f => f.severity === 'High').length || 0;
    const medium = report.findings?.filter(f => f.severity === 'Medium').length || 0;
    const low = report.findings?.filter(f => f.severity === 'Low').length || 0;
    const info = report.findings?.filter(f => f.severity === 'Info').length || 0;

    // Helper: apply all simple token replacements
    const applySimpleReplacements = (inputHtml: string): string => {
      let temp = inputHtml;
      // Build date range string: "start – end" or just start if no end date
      const dateRangeStr = report.dateEnd && report.dateEnd !== report.date
        ? `${report.date} – ${report.dateEnd}`
        : report.date;
      const reportDateStr = report.reportDate || report.date;
      temp = temp.replace(/{{title}}/g, () => escapeHtml(report.name));
      temp = temp.replace(/{{client}}/g, () => escapeHtml(report.client));
      temp = temp.replace(/{{date}}/g, () => escapeHtml(dateRangeStr));
      temp = temp.replace(/{{report_date}}/g, () => escapeHtml(reportDateStr));
      temp = temp.replace(/{{author}}/g, () => escapeHtml(report.author));
      temp = temp.replace(/{{version}}/g, () => escapeHtml(report.version));
      temp = temp.replace(/{{classification}}/g, () => escapeHtml((report.classification || '').toUpperCase()));
      temp = temp.replace(/{{status}}/g, () => escapeHtml((report.status || 'Draft').toUpperCase()));
      temp = temp.replace(/{{executive_summary}}/g, () => formatText(report.executiveSummary));
      temp = temp.replace(/{{strategic_recommendations}}/g, () => formatText(report.strategicRecommendations || ''));
      temp = temp.replace(/{{using_this_report}}/g, () => formatText(report.usingThisReport || ''));
      temp = temp.replace(/{{scope}}/g, () => formatText(report.scope));
      temp = temp.replace(/{{caveats}}/g, () => formatText(report.caveats || ''));
      temp = temp.replace(/{{cleanup}}/g, () => formatText(report.cleanup || ''));

      temp = temp.replace(/{{count_critical}}/g, () => String(critical));
      temp = temp.replace(/{{count_high}}/g, () => String(high));
      temp = temp.replace(/{{count_medium}}/g, () => String(medium));
      temp = temp.replace(/{{count_low}}/g, () => String(low));
      temp = temp.replace(/{{count_info}}/g, () => String(info));

      // Appendices replacements
      temp = temp.replace(/{{appendices_key_info}}/g, () => formatText(report.appendices?.methodologyKeyInfo || ''));
      temp = temp.replace(/{{appendices_test_highlights}}/g, () => formatText(report.appendices?.methodologyHighlights || ''));
      temp = temp.replace(/{{appendices_more_details}}/g, () => formatText(report.appendices?.methodologyMoreDetails || ''));
      temp = temp.replace(/{{appendices_detailed_methodology}}/g, () => formatText(report.appendices?.methodologyDetailed || ''));
      return temp;
    };

    // Pass 1: replace tokens already in the base template
    html = applySimpleReplacements(html);

    // Map to hold computed numbers for each section and sub-section.
    const nums: Record<string, string> = {};
    let nextMajor = 1;

    // 1. Executive Summary
    const numExecSummary = String(nextMajor++);
    nums['executive-summary'] = numExecSummary;
    nums['executive-summary-overview'] = `${numExecSummary}.1`;
    nums['executive-summary-assessment'] = `${numExecSummary}.2`;
    nums['executive-summary-recommendation'] = `${numExecSummary}.3`;
    nums['executive-summary-recommendations'] = `${numExecSummary}.3`;

    // Group custom sections by their insertion anchor, preserving their relative ordering.
    const groupedCustom: Record<CustomAnchor, CustomSection[]> = {
      'executive-summary': [],
      'table-of-contents': [],
      'document-control': [],
      'technical-summary': [],
      'technical-details': [],
      'supplemental-data': [],
      'appendices': []
    };
    (report.customSections || []).forEach(sec => {
      const anchor: CustomAnchor = (sec.insertAfter && groupedCustom[sec.insertAfter])
        ? sec.insertAfter
        : 'appendices';
      groupedCustom[anchor].push(sec);
    });

    // Helper to number a list of custom sections
    const numberCustomGroup = (anchor: CustomAnchor) => {
      groupedCustom[anchor].forEach((sec) => {
        const secNum = String(nextMajor++);
        nums[`cust-sec-${sec.id}`] = secNum;
        (sec.subSections || []).forEach((sub, subIdx) => {
          nums[`cust-sub-${sub.id}`] = `${secNum}.${subIdx + 1}`;
        });
      });
    };

    // Custom sections after Executive Summary
    numberCustomGroup('executive-summary');

    // 2. Table of Contents (No major number for TOC itself, but custom sections after it get numbered)
    numberCustomGroup('table-of-contents');

    // 3. Using This Report
    nums['using-this-report'] = String(nextMajor++);

    // 4. Document Control
    nums['document-control'] = String(nextMajor++);
    numberCustomGroup('document-control');

    // 5. Technical Summary
    const numTechSummary = String(nextMajor++);
    nums['technical-summary'] = numTechSummary;
    nums['scope'] = `${numTechSummary}.1`;
    nums['caveats'] = `${numTechSummary}.2`;
    nums['cleanup'] = `${numTechSummary}.3`;
    nums['risk-ratings'] = `${numTechSummary}.4`;
    nums['findings-overview'] = `${numTechSummary}.5`;
    numberCustomGroup('technical-summary');

    // 6. Technical Details
    const numTechDetails = String(nextMajor++);
    nums['technical-details'] = numTechDetails;
    nums['detailed-findings'] = `${numTechDetails}.1`;
    numberCustomGroup('technical-details');

    // 7. Supplemental Data
    const numSuppData = String(nextMajor++);
    nums['supplemental-data'] = numSuppData;
    numberCustomGroup('supplemental-data');

    // 8. Appendices
    const numAppendices = String(nextMajor++);
    nums['appendices'] = numAppendices;
    nums['tailored-methodologies'] = `${numAppendices}.1`;
    nums['assessment-team'] = `${numAppendices}.2`;
    numberCustomGroup('appendices');

    // ── Compile Table of Contents in DOCUMENT ORDER ──
    // Render each row as a real anchor so clicks navigate (intercepted by the bridge script
    // for in-app scrolling) AND so the exported PDF gets proper internal hyperlinks.
    const tocRow = (level: 1 | 2 | 3 | 4, target: string, num: string, label: string) =>
      `<a class="toc-row h${level}" href="#${target}" data-toc-target="${target}"><span class="toc-num">${num}</span><span class="toc-lbl">${label}</span><span class="toc-pg"></span></a>`;

    const tocCustomGroup = (anchor: CustomAnchor): string => {
      const list = groupedCustom[anchor];
      if (!list.length) return '';
      let out = '';
      list.forEach((sec) => {
        const secNum = nums[`cust-sec-${sec.id}`];
        out += tocRow(1, `cust-sec-${sec.id}`, secNum, escapeHtml(sec.title || 'Custom Section'));
        (sec.subSections || []).forEach((sub) => {
          const subNum = nums[`cust-sub-${sub.id}`];
          out += tocRow(2, `cust-sub-${sub.id}`, subNum, escapeHtml(sub.title || 'Sub-heading'));
        });
      });
      return out;
    };

    let tocHtml = '';
    
    // Executive Summary
    tocHtml += tocRow(1, 'executive-summary', nums['executive-summary'], 'Executive Summary');
    tocHtml += tocRow(2, 'executive-summary', nums['executive-summary-overview'], 'Overview');
    tocHtml += tocRow(2, 'executive-summary', nums['executive-summary-assessment'], 'Assessment Summary');
    tocHtml += tocRow(2, 'executive-summary', nums['executive-summary-recommendation'], 'Strategic Recommendations');
    tocHtml += tocCustomGroup('executive-summary');

    // Table of Contents is omitted from Table of Contents!
    // "do not include table of content page number and entry in table of content"
    tocHtml += tocCustomGroup('table-of-contents');

    // Using This Report
    tocHtml += tocRow(1, 'using-this-report', nums['using-this-report'], 'Using This Report');

    // Document Control
    tocHtml += tocRow(1, 'document-control', nums['document-control'], 'Document Control');
    tocHtml += tocCustomGroup('document-control');

    // Technical Summary
    tocHtml += tocRow(1, 'technical-summary', nums['technical-summary'], 'Technical Summary');
    tocHtml += tocRow(2, 'scope', nums['scope'], 'Scope');
    tocHtml += tocRow(2, 'caveats', nums['caveats'], 'Caveats');
    tocHtml += tocRow(2, 'cleanup', nums['cleanup'], 'Post Assessment Cleanup');
    tocHtml += tocRow(2, 'risk-ratings', nums['risk-ratings'], 'Risk Ratings');
    tocHtml += tocRow(2, 'findings-overview', nums['findings-overview'], 'Findings Overview');
    tocHtml += tocCustomGroup('technical-summary');

    // Technical Details
    tocHtml += tocRow(1, 'technical-details', nums['technical-details'], 'Technical Details');
    tocHtml += tocRow(2, 'detailed-findings', nums['detailed-findings'], 'Detailed Findings');

    // Goals and Scenarios inside Technical Details
    (report.goalsAndScenarios || []).forEach((gs, gsIdx) => {
      const subNum = `${nums['detailed-findings']}.${gsIdx + 1}`;
      tocHtml += tocRow(3, `scenario-${gs.id}`, subNum, `Scenario ${gsIdx + 1} - ${escapeHtml(gs.title)}`);
      const fs = (report.findings || []).filter(f => f.scenarioId === gs.id);
      fs.forEach(f => {
        tocHtml += tocRow(4, `finding-${f.id}`, '—', escapeHtml(f.title));
      });
    });

    const generalFindings = (report.findings || []).filter(f => !f.scenarioId);
    if (generalFindings.length > 0) {
      const nextIdx = (report.goalsAndScenarios?.length || 0) + 1;
      const subNum = `${nums['detailed-findings']}.${nextIdx}`;
      tocHtml += tocRow(3, 'scenario-general', subNum, 'General Findings');
      generalFindings.forEach(f => {
        tocHtml += tocRow(4, `finding-${f.id}`, '—', escapeHtml(f.title));
      });
    }

    tocHtml += tocCustomGroup('technical-details');

    // Supplemental Data
    tocHtml += tocRow(1, 'supplemental-data', nums['supplemental-data'], 'Supplemental Data');
    (report.supplementalSections || []).forEach((sec, secIdx) => {
      const secNum = `${nums['supplemental-data']}.${secIdx + 1}`;
      tocHtml += tocRow(2, `supp-sec-${sec.id}`, secNum, escapeHtml(sec.title));
      (sec.subSections || []).forEach((sub, subIdx) => {
        tocHtml += tocRow(3, `supp-sub-${sub.id}`, `${secNum}.${subIdx + 1}`, escapeHtml(sub.title));
      });
    });
    tocHtml += tocCustomGroup('supplemental-data');

    // Appendices
    tocHtml += tocRow(1, 'appendices', nums['appendices'], 'Appendices');
    tocHtml += tocRow(2, 'tailored-methodologies', nums['tailored-methodologies'], 'Tailored Methodologies');
    tocHtml += tocRow(3, 'red-teaming-assessment', `${nums['tailored-methodologies']}.1`, 'Red-teaming/Simulated Attack Assessment');
    tocHtml += tocRow(4, 'red-teaming-assessment', '—', 'Key Information');
    tocHtml += tocRow(4, 'red-teaming-assessment', '—', 'Test Highlights');
    tocHtml += tocRow(4, 'red-teaming-assessment', '—', 'More Details');
    tocHtml += tocRow(4, 'red-teaming-assessment', '—', 'Detailed Methodology');
    tocHtml += tocRow(2, 'assessment-team', nums['assessment-team'], 'Assessment Team');
    tocHtml += tocCustomGroup('appendices');

    html = html.replace(/{{table_of_contents}}/g, () => tocHtml);

    // Render the per-anchor custom-section HTML blocks into their template placeholders.
    const renderCustomGroup = (anchor: CustomAnchor): string => {
      const list = groupedCustom[anchor];
      if (!list.length) return '';
      let out = '';
      list.forEach((sec) => {
        const secNum = nums[`cust-sec-${sec.id}`];
        const title = escapeHtml(sec.title || 'Custom Section');
        out += `<div class="sec-title page-break-before" id="cust-sec-${sec.id}" data-header-right="${secNum} - ${title}">${secNum} &nbsp; ${title}</div>`;
        if (sec.content) {
          out += `<p>${formatText(sec.content)}</p>`;
        }
        (sec.subSections || []).forEach((sub) => {
          const subNum = nums[`cust-sub-${sub.id}`];
          out += `<div class="sec-sub" id="cust-sub-${sub.id}">${subNum} &nbsp; ${escapeHtml(sub.title || 'Sub-heading')}</div>`;
          out += `<p>${formatText(sub.content)}</p>`;
        });
      });
      return out;
    };

    // Ensure all custom placeholders are present in the HTML.
    // If some are missing (e.g. because of an older cached template in localStorage),
    // inject them dynamically before the start of the next section.
    const placeholderInserts: { placeholder: string; beforePattern: RegExp }[] = [
      {
        placeholder: '{{custom_after_executive_summary}}',
        beforePattern: /id="table-of-contents"/i
      },
      {
        placeholder: '{{custom_after_table_of_contents}}',
        beforePattern: /id="using-this-report"/i
      },
      {
        placeholder: '{{custom_after_document_control}}',
        beforePattern: /id="technical-summary"/i
      },
      {
        placeholder: '{{custom_after_technical_summary}}',
        beforePattern: /id="technical-details"/i
      },
      {
        placeholder: '{{custom_after_technical_details}}',
        beforePattern: /id="supplemental-data"/i
      },
      {
        placeholder: '{{custom_after_supplemental_data}}',
        beforePattern: /id="appendices"/i
      },
      {
        placeholder: '{{custom_after_appendices}}',
        beforePattern: /id="end-of-report-page"/i
      }
    ];

    placeholderInserts.forEach(({ placeholder, beforePattern }) => {
      if (!html.includes(placeholder)) {
        const match = html.match(beforePattern);
        if (match && match.index !== undefined) {
          const beforeIndex = html.lastIndexOf('<', match.index);
          if (beforeIndex !== -1) {
            html = html.substring(0, beforeIndex) + `\n    ${placeholder}\n    ` + html.substring(beforeIndex);
          }
        }
      }
    });

    // Unwrap any custom anchor placeholders that might have been wrapped in <p> or <div> tags
    (Object.keys(CUSTOM_ANCHOR_PLACEHOLDERS) as CustomAnchor[]).forEach(anchor => {
      const placeholder = CUSTOM_ANCHOR_PLACEHOLDERS[anchor];
      const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(`<p>\\s*${escaped}\\s*</p>`, 'gi'), placeholder);
      html = html.replace(new RegExp(`<div>\\s*${escaped}\\s*</div>`, 'gi'), placeholder);
    });

    (Object.keys(CUSTOM_ANCHOR_PLACEHOLDERS) as CustomAnchor[]).forEach(anchor => {
      const placeholder = CUSTOM_ANCHOR_PLACEHOLDERS[anchor];
      const rendered = renderCustomGroup(anchor);
      // Escape regex meta characters in the placeholder literal.
      const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(new RegExp(escaped, 'g'), () => rendered);
    });
    // Safety: strip any unresolved custom-anchor token so it never renders as literal text.
    html = html.replace(/{{custom_after_[a-z_]+}}/g, '');

    // ── Compile Version History, Distribution List, Findings Overview, and Team ──
    const vhRows = (report.versionHistory || []).map(vh => `
      <tr>
        <td>${escapeHtml(vh.version)}</td>
        <td>${escapeHtml(vh.date)}</td>
        <td>${escapeHtml(vh.author)}</td>
        <td>${escapeHtml(vh.description)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center;color:#64748b;font-style:italic;">No version history recorded.</td></tr>';
    html = html.replace(/{{version_history_rows}}/g, () => vhRows);

    const dlRows = (report.distributionList || []).map(dl => `
      <tr>
        <td>${escapeHtml(dl.name)}</td>
        <td>${escapeHtml(dl.role)}</td>
        <td>${escapeHtml(dl.organization)}</td>
        <td>${escapeHtml(dl.copyNo)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center;color:#64748b;font-style:italic;">No distribution list recorded.</td></tr>';
    html = html.replace(/{{distribution_list_rows}}/g, () => dlRows);

    const findingsOverviewRows = (report.findings || []).map(f => `
      <tr>
        <td><span class="fid">F-${f.id.slice(0, 4).toUpperCase()}</span></td>
        <td style="font-weight:500;">${escapeHtml(f.title)}</td>
        <td><span class="rb rb-${f.severity.toLowerCase()}">${(f.severity || '').toUpperCase()}</span></td>
        <td>${f.cvss || 'N/A'}</td>
        <td style="font-weight:500;">${escapeHtml(f.status)}</td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;color:#64748b;font-style:italic;">No findings recorded.</td></tr>';
    html = html.replace(/{{findings_overview_rows}}/g, () => findingsOverviewRows);

    const teamRows = (report.appendices?.assessmentTeam || []).map(member => `
      <tr>
        <td>${escapeHtml(member.name)}</td>
        <td>${escapeHtml(member.role)}</td>
        <td>${escapeHtml(member.org)}</td>
      </tr>
    `).join('') || '<tr><td colspan="3" style="text-align:center;color:#64748b;font-style:italic;">No assessment team members recorded.</td></tr>';
    html = html.replace(/{{appendices_team_rows}}/g, () => teamRows);

    // ── Extract Sub-templates ──
    const gsTemplateMatch = html.match(/<!-- GOAL_SCENARIO_TEMPLATE_START -->([\s\S]*?)<!-- GOAL_SCENARIO_TEMPLATE_END -->/);
    let gsSubTemplate = '';
    if (gsTemplateMatch && gsTemplateMatch[1]) {
      gsSubTemplate = gsTemplateMatch[1].trim();
    }

    const findingTemplateMatch = html.match(/<!-- FINDING_TEMPLATE_START -->([\s\S]*?)<!-- FINDING_TEMPLATE_END -->/);
    let findingSubTemplate = '';
    if (findingTemplateMatch && findingTemplateMatch[1]) {
      findingSubTemplate = findingTemplateMatch[1].trim();
    }

    // Helper to compile a single finding html block
    const compileFindingHtml = (finding: Finding, id: string) => {
      let fHtml = findingSubTemplate || `
        <div class="finding-block" id="finding-{{finding_id}}">
          <div class="fb-head">
            <div class="fb-head-left">
              <span class="fb-id">F-{{finding_index}}</span>
              <span class="fb-title">{{finding_title}}</span>
            </div>
            <span class="rb rb-{{finding_severity_class}}">{{finding_severity}}</span>
          </div>
          <div class="fb-body">
            <div class="fb-meta">
              <div class="fb-meta-item"><label>FINDING ID</label><span>F-{{finding_index}}</span></div>
              <div class="fb-meta-item"><label>RISK RATING</label><span><span class="rb rb-{{finding_severity_class}}">{{finding_severity}}</span></span></div>
              <div class="fb-meta-item"><label>AFFECTED SYSTEM(S)</label><span>{{finding_category}}</span></div>
              <div class="fb-meta-item"><label>CVSSv3.1 SCORE</label><span>{{finding_cvss}}</span></div>
            </div>
            <div class="fb-section">
              <div class="fb-section-lbl">DESCRIPTION</div>
              <p>{{finding_description}}</p>
            </div>
            <div class="fb-section">
              <div class="fb-section-lbl">EVIDENCE</div>
              {{finding_poc}}
            </div>
            <div class="fb-section" style="margin-bottom:0;">
              <div class="fb-section-lbl">RECOMMENDATION</div>
              <p>{{finding_remediation}}</p>
            </div>
          </div>
        </div>
      `;

      let pocHtml = formatText(finding.poc || '');
      let screenshotsHtml = '';
      if (finding.screenshots && finding.screenshots.length > 0) {
        const sortedScreenshots = [...finding.screenshots].sort((a, b) => a.order - b.order);
        
        // Generate html for each screenshot and store in maps
        const inlineReplacements: Record<string, string> = {};
        const replacedIds = new Set<string>();

        sortedScreenshots.forEach((scr, scrIdx) => {
          const widthStyle = scr.width ? (scr.width.toString().includes('%') || scr.width.toString().includes('px') ? scr.width : `${scr.width}px`) : 'auto';
          const heightStyle = scr.height ? (scr.height.toString().includes('%') || scr.height.toString().includes('px') ? scr.height : `${scr.height}px`) : 'auto';
          
          const imgHtml = `
            <div class="evidence-screenshot" style="text-align: center; margin: 16px 0; page-break-inside: avoid;">
              <img src="${scr.data}" style="max-width: 100%; width: ${widthStyle}; height: ${heightStyle}; display: block; margin: 0 auto; border: 1px solid rgba(0,0,0,0.1); border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" alt="${escapeHtml(scr.caption || '')}" />
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-style: italic; font-family: 'Inter', sans-serif;">Figure ${scrIdx + 1}: ${escapeHtml(scr.caption || 'Evidence Screenshot')}</div>
            </div>
          `;

          // Define placeholders for replacement
          const placeholders = [
            `[image-${scrIdx + 1}]`,
            `[screenshot-${scrIdx + 1}]`,
            `[fig-${scrIdx + 1}]`
          ];

          placeholders.forEach(placeholder => {
            inlineReplacements[placeholder] = imgHtml;
          });
        });

        // Perform inline replacement in the pocHtml
        Object.keys(inlineReplacements).forEach(placeholder => {
          if (pocHtml.includes(placeholder)) {
            // Find which screenshot this placeholder corresponds to by its index (represented in the tag)
            const match = placeholder.match(/\d+/);
            if (match) {
              const idx = parseInt(match[0], 10) - 1;
              const targetScr = sortedScreenshots[idx];
              if (targetScr) {
                replacedIds.add(targetScr.id);
              }
            }
            pocHtml = pocHtml.split(placeholder).join(inlineReplacements[placeholder]);
          }
        });

        // Append any screenshots that were not placed inline
        sortedScreenshots.forEach((scr, scrIdx) => {
          if (!replacedIds.has(scr.id)) {
            const widthStyle = scr.width ? (scr.width.toString().includes('%') || scr.width.toString().includes('px') ? scr.width : `${scr.width}px`) : 'auto';
            const heightStyle = scr.height ? (scr.height.toString().includes('%') || scr.height.toString().includes('px') ? scr.height : `${scr.height}px`) : 'auto';
            
            screenshotsHtml += `
              <div class="evidence-screenshot" style="text-align: center; margin: 16px 0; page-break-inside: avoid;">
                <img src="${scr.data}" style="max-width: 100%; width: ${widthStyle}; height: ${heightStyle}; display: block; margin: 0 auto; border: 1px solid rgba(0,0,0,0.1); border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);" alt="${escapeHtml(scr.caption || '')}" />
                <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-style: italic; font-family: 'Inter', sans-serif;">Figure ${scrIdx + 1}: ${escapeHtml(scr.caption || 'Evidence Screenshot')}</div>
              </div>
            `;
          }
        });
      }
      const combinedPocHtml = pocHtml + screenshotsHtml;

      fHtml = fHtml.replace(/{{finding_id}}/g, () => id);
      fHtml = fHtml.replace(/{{finding_index}}/g, () => id.slice(0, 4).toUpperCase());
      fHtml = fHtml.replace(/{{finding_title}}/g, () => escapeHtml(finding.title));
      fHtml = fHtml.replace(/{{finding_severity}}/g, () => escapeHtml((finding.severity || '').toUpperCase()));
      fHtml = fHtml.replace(/{{finding_severity_class}}/g, () => finding.severity?.toLowerCase() || 'info');
      fHtml = fHtml.replace(/{{finding_cvss}}/g, () => escapeHtml(finding.cvss));
      fHtml = fHtml.replace(/{{finding_category}}/g, () => escapeHtml(finding.category));
      fHtml = fHtml.replace(/{{finding_status}}/g, () => escapeHtml(finding.status));
      fHtml = fHtml.replace(/{{finding_description}}/g, () => formatText(finding.description));
      fHtml = fHtml.replace(/{{finding_poc}}/g, () => combinedPocHtml);
      fHtml = fHtml.replace(/{{finding_remediation}}/g, () => formatText(finding.remediation));
      return fHtml;
    };

    // ── Group Detailed Findings by Scenario ──
    let detailedGroupedHtml = '';
    (report.goalsAndScenarios || []).forEach((gs, gsIdx) => {
      let sHtml = gsSubTemplate || `
        <div class="finding-block" style="border-color: var(--border);" id="scenario-{{goal_scenario_id}}">
          <div class="fb-head" style="background: var(--navy-mid);">
            <div class="fb-head-left">
              <span class="fb-id">GS-{{goal_scenario_index}}</span>
              <span class="fb-title">{{goal_scenario_title}}</span>
            </div>
          </div>
          <div class="fb-body">
            <div class="fb-section" style="margin-bottom: 0;">
              <div class="fb-section-lbl">SCENARIO DETAILS</div>
              <p>{{goal_scenario_description}}</p>
            </div>
          </div>
        </div>
      `;
      sHtml = sHtml.replace(/{{goal_scenario_index}}/g, () => String(gsIdx + 1));
      sHtml = sHtml.replace(/{{goal_scenario_title}}/g, () => escapeHtml(gs.title));
      sHtml = sHtml.replace(/{{goal_scenario_description}}/g, () => formatText(gs.description));
      sHtml = sHtml.replace(/{{goal_scenario_id}}/g, () => gs.id);
      detailedGroupedHtml += sHtml;

      // Append findings for this scenario
      const scenarioFindings = (report.findings || []).filter(f => f.scenarioId === gs.id);
      scenarioFindings.forEach(f => {
        detailedGroupedHtml += compileFindingHtml(f, f.id);
      });
    });

    const generalFs = (report.findings || []).filter(f => !f.scenarioId);
    if (generalFs.length > 0) {
      const nextIdx = (report.goalsAndScenarios?.length || 0) + 1;
      const generalNum = `${nums['detailed-findings']}.${nextIdx}`;
      detailedGroupedHtml += `
        <div class="sec-title" id="scenario-general" style="margin-top: 30px; font-size:16px;">${generalNum} &nbsp; General Findings</div>
        <p style="margin-bottom: 20px;">Vulnerabilities not directly associated with a specific attack execution path.</p>
      `;
      generalFs.forEach(f => {
        detailedGroupedHtml += compileFindingHtml(f, f.id);
      });
    }

    if (gsTemplateMatch) {
      html = html.replace(/<!-- GOAL_SCENARIO_TEMPLATE_START -->[\s\S]*?<!-- GOAL_SCENARIO_TEMPLATE_END -->/, '');
    }
    if (findingTemplateMatch) {
      html = html.replace(/<!-- FINDING_TEMPLATE_START -->[\s\S]*?<!-- FINDING_TEMPLATE_END -->/, '');
    }

    html = html.replace(/{{detailed_findings_grouped}}/g, () => detailedGroupedHtml);

    // ── Compile Supplemental Sections ──
    let suppHtml = '';
    if (report.supplementalSections && report.supplementalSections.length > 0) {
      report.supplementalSections.forEach((sec, secIdx) => {
        const secNum = `${nums['supplemental-data']}.${secIdx + 1}`;
        suppHtml += `<div class="sec-sub" id="supp-sec-${sec.id}">${secNum} &nbsp; ${escapeHtml(sec.title)}</div>`;
        if (sec.content) {
          suppHtml += `<p>${formatText(sec.content)}</p>`;
        }
        if (sec.subSections && sec.subSections.length > 0) {
          sec.subSections.forEach((sub, subIdx) => {
            suppHtml += `<div class="sec-h3" id="supp-sub-${sub.id}">${secNum}.${subIdx + 1} &nbsp; ${escapeHtml(sub.title).toUpperCase()}</div>`;
            suppHtml += `<p>${formatText(sub.content)}</p>`;
          });
        }
      });
    } else {
      suppHtml = '<p style="color:#64748b;font-style:italic;">No supplemental data recorded.</p>';
    }
    html = html.replace(/{{supplemental_data_sections}}/g, () => suppHtml);

    // Pass 2: replace any remaining tokens
    html = applySimpleReplacements(html);

    // Replace section number placeholders in the HTML template.
    Object.keys(nums).forEach(key => {
      const placeholder = `{{num_${key.replace(/-/g, '_')}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), () => nums[key]);
    });

    return html;
  };

  const compiledHtml = compileReportHtml();


  // Programmatically determine total page count inside iframe
  const [totalIframeHeight, setTotalIframeHeight] = useState<number>(A4_BASE_HEIGHT);
  const [isGeneratingPlaywrightPDF, setIsGeneratingPlaywrightPDF] = useState<boolean>(false);

  const calculateTotalPages = () => {
    const iframe = shadowContainerRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        // Count only direct children of body or top-level wrappers that are .page divs
        // to avoid counting nested pages if template structure is unexpected
        const allPages = doc.querySelectorAll('.page');
        let topLevelPageCount = 0;
        allPages.forEach(page => {
          const parent = page.parentElement;
          if (parent && !parent.classList.contains('page')) {
            topLevelPageCount++;
          }
        });
        const count = Math.max(1, topLevelPageCount);
        setTotalPages(count);

        // Measure actual scrollHeight of the report wrapper for variable-height pages
        const wrapper = doc.querySelector('.report-wrapper') as HTMLElement;
        if (wrapper) {
          const actualH = wrapper.scrollHeight + 64; // 64 = top + bottom margin
          setTotalIframeHeight(Math.max(actualH, A4_BASE_HEIGHT));
        } else {
          setTotalIframeHeight((A4_BASE_HEIGHT * count) + (PAGE_GAP * Math.max(0, count - 1)));
        }
      }
    }
  };

  useEffect(() => {
    const iframe = shadowContainerRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(compiledHtml);
        doc.close();

        // Ensure no scrollbars inside the iframe
        if (doc.documentElement) {
          doc.documentElement.style.overflow = 'hidden';
        }
        if (doc.body) {
          doc.body.style.overflow = 'hidden';
        }

        // Calculate pages once rendering finishes
        // Reflow script runs at 30ms inside the iframe, so we wait longer
        const handleLoad = () => {
          setTimeout(calculateTotalPages, 200);
        };
        iframe.addEventListener('load', handleLoad);

        setTimeout(calculateTotalPages, 300);

        const observer = new MutationObserver(calculateTotalPages);
        if (doc.body) {
          observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
        }

        return () => {
          iframe.removeEventListener('load', handleLoad);
          observer.disconnect();
        };
      }
    }
  }, [compiledHtml]);

  // Adjust page clamp logic if totalPages is modified
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);



  const handleExportPlaywrightPDF = async () => {
    const iframe = shadowContainerRef.current;
    if (!iframe) {
      alert('Iframe preview reference not found');
      return;
    }
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      alert('Iframe document not accessible');
      return;
    }

    const pages = doc.querySelectorAll('.page');
    if (pages.length === 0) {
      alert('No pages found to export');
      return;
    }

    // Save current zoom settings
    const prevZoomMode = zoomMode;
    const prevCustomZoom = customZoom;

    try {
      setIsGeneratingPlaywrightPDF(true);

      // Reset zoom to 100% (1.0) so html2canvas renders letter-spacing and layout accurately
      setZoomMode('custom');
      setCustomZoom(100);

      // Wait a short duration (250ms) for the iframe zoom to apply in the DOM
      await new Promise(resolve => setTimeout(resolve, 250));

      // Make sure fonts are fully loaded inside both the iframe and parent document
      await doc.fonts.ready;
      await document.fonts.ready;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i] as HTMLElement;

        // Render each page to canvas
        const canvas = await html2canvas(pageEl, {
          scale: 2.2, // high-res crispness
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: null,
          letterRendering: true
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }

      // Generate filename following the convention
      let dateStr = '';
      try {
        const parts = (report.date || '').split('-');
        if (parts.length === 3) {
          const year = parts[0].slice(-2);
          const month = parts[1];
          const day = parts[2];
          dateStr = `${day}_${month}_${year}`;
        }
      } catch (e) {}
      
      if (!dateStr) {
        const d = new Date();
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);
        dateStr = `${day}_${month}_${year}`;
      }
      
      const cleanClient = (report.client || 'Client')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
        
      const cleanVersion = (report.version || '1.0')
        .replace(/[^a-zA-Z0-9.]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
        
      const filename = `${dateStr}_Red_Team_Report_${cleanClient}_${cleanVersion}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      // Restore previous zoom settings
      setZoomMode(prevZoomMode);
      setCustomZoom(prevCustomZoom);
      setIsGeneratingPlaywrightPDF(false);
    }
  };



  // Column split drag behavior
  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidthPx = moveEvent.clientX - containerRect.left;
      let newWidthPct = (newWidthPx / containerRect.width) * 100;

      newWidthPct = Math.max(20, Math.min(80, newWidthPct));
      setLeftWidth(newWidthPct);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };



  const sections = [
    { id: 'info', label: 'Report Details', icon: FileText, complete: true, noBadge: true },
    { id: 'summary', label: 'Executive Summary', icon: FileText, complete: isSummaryComplete },
    { id: 'goals_scenarios', label: 'Goals & Scenarios', icon: Target, complete: isGoalsComplete },
    { id: 'findings', label: 'Findings Repository', icon: AlertCircle, complete: isFindingsComplete },
    { id: 'supplemental', label: 'Supplemental Data', icon: Database, complete: isSupplementalComplete },
    { id: 'appendices', label: 'Appendices', icon: BookOpen, complete: isAppendicesComplete },
    { id: 'custom', label: 'Custom Sections', icon: Plus, complete: isCustomComplete }
  ];

  return (
    <div className="min-h-screen bg-transparent text-zinc-800 dark:text-zinc-100 font-sans flex flex-col h-screen overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Top Action Bar */}
      <header className="bg-slate-100 dark:bg-[#0B101E] border-b border-slate-200 dark:border-white/[0.05] h-16 flex items-center justify-between px-6 flex-shrink-0 z-40">
        <div className="flex items-center gap-4 flex-1 min-w-0 max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 bg-slate-200/50 dark:bg-white/[0.02] hover:bg-slate-200 dark:hover:bg-white/[0.06] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Report Builder</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded font-semibold uppercase tracking-wider flex-shrink-0">
                {report.classification}
              </span>
            </div>
            <input
              type="text"
              value={report.name}
              onChange={(e) => updateReportField('name', e.target.value)}
              className="bg-transparent border-none p-0 text-base font-extrabold text-slate-800 dark:text-white tracking-tight leading-tight mt-0.5 focus:outline-none focus:ring-0 focus:border-b focus:border-slate-300 dark:focus:border-white/10 w-full"
            />
          </div>
        </div>

        {/* Redesigned Progress Indicator */}
        <div className="hidden lg:flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 hover:bg-white/[0.04] transition-all duration-200">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progress</span>
            <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-white">{progressPercent}%</span>
          </div>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" title={`${completeCount} sections complete`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"></span>
              <span className="text-[10px] font-bold text-slate-300">{completeCount}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${inProgressCount} sections in progress`}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"></span>
              <span className="text-[10px] font-bold text-slate-300">{inProgressCount}</span>
            </div>
            <div className="flex items-center gap-1.5" title={`${incompleteCount} sections incomplete`}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]"></span>
              <span className="text-[10px] font-bold text-slate-300">{incompleteCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.05] rounded-lg p-1">
            <button
              className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomMode('custom');
                setCustomZoom(prev => Math.max(25, prev - 10));
              }}
              className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="px-1 min-w-[40px] text-center">
              <span className="text-[11px] font-bold text-slate-300">{Math.round(calculatedZoom * 100)}%</span>
            </div>
            <button
              onClick={() => {
                setZoomMode('custom');
                setCustomZoom(prev => Math.min(300, prev + 10));
              }}
              className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-white/10 mx-1"></div>
            <button
              onClick={handleFitToggle}
              className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${zoomMode === 'width' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'hover:bg-white/[0.05] text-slate-400 hover:text-white border border-transparent'}`}
              title="Fit to Width"
            >
              Fit
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/[0.05] rounded-lg text-slate-400 hover:text-white border border-transparent transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleExportPlaywrightPDF}
            disabled={isGeneratingPlaywrightPDF}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
              isGeneratingPlaywrightPDF 
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed border border-white/[0.05]' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
            }`}
          >
            {isGeneratingPlaywrightPDF ? (
              <>
                <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5" />
                <span>Export to PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">

        {/* Column 2: Center Editor Panel (hidden in fullscreen preview) */}
        <div
          style={{ width: isFullscreen ? '0%' : `${leftWidth}%` }}
          className={`flex flex-col bg-white dark:bg-[#0B101E] h-full border-r border-slate-200 dark:border-white/[0.05] ${isFullscreen ? 'hidden' : ''}`}
        >
          {/* Chrome-style tabs */}
          {!isFullscreen && (
            <div className="flex items-end bg-slate-200 dark:bg-[#070913] px-2 pt-2 border-b border-slate-300 dark:border-white/[0.05] overflow-x-auto no-scrollbar flex-nowrap flex-shrink-0 select-none">
              {sections.map((sec, idx) => {
                const isActive = activeSection === sec.id;
                const status = sectionsStatus[sec.id as keyof typeof sectionsStatus];
                
                let dotColor = "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]";
                if (sec.noBadge || status === 'Complete') {
                  dotColor = "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]";
                } else if (status === 'In Progress') {
                  dotColor = "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]";
                }

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl transition-all relative z-10 flex-shrink-0 -mb-[1px] border-t-2 border-x ${
                      isActive 
                        ? 'bg-white dark:bg-[#0B101E] border-t-blue-500 border-x-slate-300 dark:border-x-white/[0.08] border-b-transparent text-blue-600 dark:text-blue-400 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.25)] z-20 scale-105 origin-bottom' 
                        : 'bg-slate-100/70 dark:bg-[#0B101E]/40 border-t-transparent border-x-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0B101E]/70 border-b-slate-200 dark:border-b-white/[0.05] hover:scale-[1.02] origin-bottom'
                    }`}
                    style={{
                      minWidth: '120px',
                    }}
                  >
                    <span className="text-[9px] text-slate-550 dark:text-slate-500 font-mono">0{idx + 1}</span>
                    <span className="truncate max-w-[90px]">{sec.label}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${isActive ? 'ring-2 ring-blue-400/50 animate-pulse' : ''}`} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Editor Header */}
          <div className="p-6 pb-4 border-b border-slate-200 dark:border-white/[0.05] flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{activeMeta.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeMeta.desc}</p>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Auto-saved</span>
            </div>
          </div>

          {/* Form Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {activeSection === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Client / Target */}
                  <div className="border border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-[#0F1424] rounded-xl p-3 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors">
                    <Building2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Client / Target</label>
                      <input
                        type="text"
                        value={report.client}
                        onChange={(e) => updateReportField('client', e.target.value)}
                        placeholder="Client Name"
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {/* Document Version */}
                  <div className="border border-white/[0.05] bg-[#0F1424] rounded-xl p-3 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors">
                    <Hash className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Document Version</label>
                      <input
                        type="text"
                        value={report.version}
                        onChange={(e) => updateReportField('version', e.target.value)}
                        placeholder="1.0"
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {/* Assessment Date Range */}
                  <div className="border border-white/[0.05] bg-[#0F1424] rounded-xl p-3 flex items-start gap-3 focus-within:border-blue-500/50 transition-colors">
                    <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assessment Date Range</label>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider w-8 flex-shrink-0">From</span>
                          <input
                            type="date"
                            value={report.date}
                            onChange={(e) => updateReportField('date', e.target.value)}
                            className="flex-1 bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 [color-scheme:dark]"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider w-8 flex-shrink-0">To</span>
                          <input
                            type="date"
                            value={report.dateEnd || report.date}
                            min={report.date}
                            onChange={(e) => updateReportField('dateEnd', e.target.value)}
                            className="flex-1 bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 [color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Report Date */}
                  <div className="border border-white/[0.05] bg-[#0F1424] rounded-xl p-3 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors">
                    <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Report Date</label>
                      <input
                        type="date"
                        value={report.reportDate || report.date}
                        onChange={(e) => updateReportField('reportDate', e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="border border-white/[0.05] bg-[#0F1424] rounded-xl p-3 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors relative">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      report.status === 'Final' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                      report.status === 'Review in progress' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                      'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Status</label>
                      <select
                        value={report.status || 'Draft'}
                        onChange={(e) => updateReportField('status', e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 cursor-pointer appearance-none pr-6 font-sans"
                        style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                      >
                        <option value="Draft" className="bg-[#131A2B] text-white">Draft</option>
                        <option value="Review in progress" className="bg-[#131A2B] text-white">Review in progress</option>
                        <option value="Final" className="bg-[#131A2B] text-white">Final</option>
                      </select>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>

                  {/* Lead Analyst */}
                  <div className="border border-white/[0.05] bg-[#0F1424] rounded-xl p-3 flex items-center gap-3 focus-within:border-blue-500/50 transition-colors sm:col-span-2">
                    <User className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Lead Analyst</label>
                      <input
                        type="text"
                        value={report.author}
                        onChange={(e) => updateReportField('author', e.target.value)}
                        placeholder="Analyst Name"
                        className="w-full bg-transparent border-none p-0 text-sm font-semibold text-white focus:outline-none focus:ring-0 placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Additional Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setShowVersionHistoryModal(true)}
                      className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <div>
                          <div className="text-[10px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors tracking-wider">VERSION HISTORY</div>
                          <div className="text-[9px] text-slate-500 mt-0.5">Manage document versions</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-505 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDistributionModal(true)}
                      className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <List className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <div>
                          <div className="text-[10px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors tracking-wider">DISTRIBUTION LIST</div>
                          <div className="text-[9px] text-slate-500 mt-0.5">Manage recipients</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-505 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase text-slate-500 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    EXECUTIVE SUMMARY
                  </h3>
                  <AITextarea
                    rows={6}
                    value={report.executiveSummary}
                    onChange={(val) => updateReportField('executiveSummary', val)}
                    onCommit={() => notifyEdit('executive-summary')}
                    placeholder="Provide a high-level summary of findings, security posture, and engagement summary..."
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                    fieldType="executiveSummary"
                    model={aiModel}
                  />
                </div>

                <div>
                  <h3 className="text-[10px] uppercase text-slate-505 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    STRATEGIC RECOMMENDATIONS
                  </h3>
                  <AITextarea
                    rows={3}
                    value={report.strategicRecommendations || ''}
                    onChange={(val) => updateReportField('strategicRecommendations', val)}
                    onCommit={() => notifyEdit('executive-summary')}
                    placeholder="Enter strategic recommendations for remediation..."
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                    fieldType="strategicRecommendations"
                    model={aiModel}
                  />
                </div>

                <div>
                  <h3 className="text-[10px] uppercase text-slate-505 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    USING THIS REPORT
                  </h3>
                  <AITextarea
                    rows={3}
                    value={report.usingThisReport || ''}
                    onChange={(val) => updateReportField('usingThisReport', val)}
                    onCommit={() => notifyEdit('using-this-report')}
                    placeholder="Enter details on how to use this report..."
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                    fieldType="usingThisReport"
                    model={aiModel}
                  />
                </div>

                <div>
                  <h3 className="text-[10px] uppercase text-slate-505 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    1.1 ENGAGEMENT SCOPE
                  </h3>
                  <AITextarea
                    rows={4}
                    value={report.scope}
                    onChange={(val) => updateReportField('scope', val)}
                    onCommit={() => notifyEdit('scope')}
                    placeholder="Enter tested hostnames, CIDRs, API endpoints, domains, and timeframe..."
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                    fieldType="scope"
                    model={aiModel}
                  />
                </div>

                <div>
                  <h3 className="text-[10px] uppercase text-slate-505 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    1.2 CAVEATS
                  </h3>
                  <AITextarea
                    rows={3}
                    value={report.caveats || ''}
                    onChange={(val) => updateReportField('caveats', val)}
                    onCommit={() => notifyEdit('caveats')}
                    placeholder="Enter assessment constraints and caveats..."
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                    fieldType="caveats"
                    model={aiModel}
                  />
                </div>

                <div>
                  <h3 className="text-[10px] uppercase text-slate-550 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    1.3 POST ASSESSMENT CLEANUP
                  </h3>
                  <AITextarea
                    rows={3}
                    value={report.cleanup || ''}
                    onChange={(val) => updateReportField('cleanup', val)}
                    onCommit={() => notifyEdit('cleanup')}
                    placeholder="Enter details about accounts and tools cleanup..."
                    className="w-full rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                    fieldType="cleanup"
                    model={aiModel}
                  />
                </div>
              </div>
            )}

            {activeSection === 'goals_scenarios' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                    GOALS & SCENARIOS LIST
                  </h3>
                  <button
                    onClick={addGoalScenario}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs hover:bg-emerald-500/20 text-emerald-400 transition-colors font-semibold shadow-sm animate-in"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Goal / Scenario</span>
                  </button>
                </div>

                {!report.goalsAndScenarios || report.goalsAndScenarios.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-505 text-xs">
                    No goals or scenarios recorded. Click "Add Goal / Scenario" to begin.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.goalsAndScenarios.map((gs, idx) => {
                      const isExpanded = expandedGoalScenario === gs.id;
                      return (
                        <div
                          key={gs.id}
                          className={`bg-[#0B101E] border border-white/[0.05] rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-1 ring-white/20 shadow-lg' : 'hover:border-white/10'}`}
                        >
                          {/* Collapsible Header */}
                          <div className="p-4 flex items-center justify-between cursor-pointer border-l-4 border-l-emerald-500 bg-[#131A2B]/40"
                            onClick={() => setExpandedGoalScenario(isExpanded ? null : gs.id)}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="text-xs font-semibold text-slate-505">{idx + 1}.</span>
                              <span className={`font-semibold text-sm ${isExpanded ? 'text-white' : 'text-slate-300'} truncate max-w-[200px] sm:max-w-[280px]`}>
                                {gs.title || 'Untitled Goal/Scenario'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => moveGoalScenario(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 hover:bg-white/5 rounded-md disabled:opacity-30 text-slate-400 transition-colors"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => moveGoalScenario(idx, 'down')}
                                disabled={idx === (report.goalsAndScenarios?.length || 0) - 1}
                                className="p-1.5 hover:bg-white/5 rounded-md disabled:opacity-30 text-slate-400 transition-colors"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setExpandedGoalScenario(isExpanded ? null : gs.id)}
                                className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Fields */}
                          {isExpanded && (
                            <div className="p-5 border-t border-white/[0.05] bg-[#131A2B] space-y-5">
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Heading</label>
                                <input
                                  type="text"
                                  value={gs.title}
                                  onChange={(e) => updateGoalScenarioField(gs.id, 'title', e.target.value)}
                                  {...commitHandlers(`scenario-${gs.id}`)}
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 font-semibold bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all text-emerald-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Details</label>
                                <AITextarea
                                  rows={4}
                                  value={gs.description}
                                  onChange={(val) => updateGoalScenarioField(gs.id, 'description', val)}
                                  onCommit={() => notifyEdit(`scenario-${gs.id}`)}
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                                  placeholder="Describe the goals and scenario execution details here..."
                                  fieldType="goalDetails"
                                  model={aiModel}
                                />
                              </div>

                              <div className="flex justify-end pt-3 border-t border-white/[0.05]">
                                <button
                                  onClick={() => deleteGoalScenario(gs.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 rounded-md transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Goal / Scenario
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'findings' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                    VULNERABILITY CATALOG
                  </h3>
                  <button
                    onClick={addFinding}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 rounded-lg text-xs hover:bg-[#FF4D6D]/20 text-[#FF4D6D] transition-colors font-semibold shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Finding</span>
                  </button>
                </div>

                {report.findings.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-505 text-xs">
                    No findings recorded. Click "Add Finding" to begin cataloging.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.findings.map((finding, idx) => {
                      const isExpanded = expandedFinding === finding.id;
                      const sevColors = {
                        Critical: 'border-l-[#FF4D6D]',
                        High: 'border-l-[#FF7A45]',
                        Medium: 'border-l-[#FFB020]',
                        Low: 'border-l-[#00C853]',
                        Info: 'border-l-[#3B82F6]'
                      };
                      const sevTextColors = {
                        Critical: 'text-[#FF4D6D]',
                        High: 'text-[#FF7A45]',
                        Medium: 'text-[#FFB020]',
                        Low: 'text-[#00C853]',
                        Info: 'text-[#3B82F6]'
                      };

                      return (
                        <div
                          key={finding.id}
                          className={`bg-[#0B101E] border border-white/[0.05] rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-1 ring-white/20 shadow-lg' : 'hover:border-white/10'}`}
                        >
                          {/* Collapsible Header */}
                          <div className={`p-4 flex items-center justify-between cursor-pointer border-l-4 ${sevColors[finding.severity]} bg-[#131A2B]/40`}
                            onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="text-xs font-semibold text-slate-505">{idx + 1}.</span>
                              <span className={`font-semibold text-sm ${isExpanded ? 'text-white' : 'text-slate-300'} truncate max-w-[200px] sm:max-w-[280px]`}>
                                {finding.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => moveFinding(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 hover:bg-white/5 rounded-md disabled:opacity-30 text-slate-400 transition-colors"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => moveFinding(idx, 'down')}
                                disabled={idx === report.findings.length - 1}
                                className="p-1.5 hover:bg-white/5 rounded-md disabled:opacity-30 text-slate-400 transition-colors"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                                className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Fields */}
                          {isExpanded && (
                            <div className="p-5 border-t border-white/[0.05] bg-[#131A2B] space-y-5">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Finding Title</label>
                                  <input
                                    type="text"
                                    value={finding.title}
                                    onChange={(e) => updateFindingField(finding.id, 'title', e.target.value)}
                                    {...commitHandlers(`finding-${finding.id}`)}
                                    className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 font-semibold bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all ${sevTextColors[finding.severity]}`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Category</label>
                                  <input
                                    type="text"
                                    value={finding.category}
                                    onChange={(e) => updateFindingField(finding.id, 'category', e.target.value)}
                                    placeholder="e.g. Injection, Auth Bypass"
                                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Associated Goal / Scenario</label>
                                <select
                                  value={finding.scenarioId || ''}
                                  onChange={(e) => updateFindingField(finding.id, 'scenarioId', e.target.value || undefined)}
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] transition-all"
                                >
                                  <option value="">General / Unassociated</option>
                                  {report.goalsAndScenarios?.map(gs => (
                                    <option key={gs.id} value={gs.id}>{gs.title}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Severity</label>
                                  <select
                                    value={finding.severity}
                                    onChange={(e) => updateFindingField(finding.id, 'severity', e.target.value)}
                                    className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 font-semibold bg-[#0B101E] border border-white/[0.1] transition-all ${sevTextColors[finding.severity]}`}
                                  >
                                    <option value="Critical" className="text-[#FF4D6D]">Critical</option>
                                    <option value="High" className="text-[#FF7A45]">High</option>
                                    <option value="Medium" className="text-[#FFB020]">Medium</option>
                                    <option value="Low" className="text-[#00C853]">Low</option>
                                    <option value="Info" className="text-[#3B82F6]">Info</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">CVSS Base</label>
                                  <input
                                    type="text"
                                    value={finding.cvss}
                                    onChange={(e) => updateFindingField(finding.id, 'cvss', e.target.value)}
                                    placeholder="e.g. 8.9"
                                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Status</label>
                                  <select
                                    value={finding.status}
                                    onChange={(e) => updateFindingField(finding.id, 'status', e.target.value)}
                                    className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] transition-all"
                                  >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Risk Accepted">Risk Accepted</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Vulnerability Description</label>
                                <AITextarea
                                  rows={4}
                                  value={finding.description}
                                  onChange={(val) => updateFindingField(finding.id, 'description', val)}
                                  onCommit={() => notifyEdit(`finding-${finding.id}`)}
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                                  fieldType="findingDescription"
                                  model={aiModel}
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Proof of Concept / Output</label>
                                <AITextarea
                                  rows={3}
                                  value={finding.poc}
                                  onChange={(val) => updateFindingField(finding.id, 'poc', val)}
                                  onCommit={() => notifyEdit(`finding-${finding.id}`)}
                                  className="w-full font-mono text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#090D14] text-[#A5B4FC] border border-white/[0.1] placeholder-slate-700 transition-all"
                                  placeholder="Paste terminal output, HTTP requests, or exploitation steps here..."
                                  fieldType="poc"
                                  model={aiModel}
                                />
                              </div>

                              <div className="mt-4 border border-white/[0.05] rounded-lg p-4 bg-[#0B101E]/50 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
                                    Evidence Screenshots
                                  </h4>
                                  <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-xs hover:border-blue-500/50 text-blue-400 cursor-pointer transition-colors font-semibold shadow-sm">
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Upload Image</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          const base64Data = reader.result as string;
                                          const currentScreenshots = finding.screenshots || [];
                                          const newScreenshot: FindingScreenshot = {
                                            id: Math.random().toString(36).substr(2, 9),
                                            name: file.name,
                                            data: base64Data,
                                            caption: 'Evidence Screenshot',
                                            width: 'auto',
                                            height: 'auto',
                                            order: currentScreenshots.length
                                          };
                                          updateFindingField(finding.id, 'screenshots', [...currentScreenshots, newScreenshot]);
                                        };
                                        reader.readAsDataURL(file);
                                      }}
                                    />
                                  </label>
                                </div>

                                {(!finding.screenshots || finding.screenshots.length === 0) ? (
                                  <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-white/5 rounded-lg">
                                    No screenshots added. Upload image files as visual proof of concept.
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {[...finding.screenshots]
                                      .sort((a, b) => a.order - b.order)
                                      .map((screenshot, sIdx) => {
                                        const updateScreenshotField = (field: keyof FindingScreenshot, value: any) => {
                                          const updatedScreenshots = finding.screenshots?.map(s => {
                                            if (s.id === screenshot.id) {
                                              return { ...s, [field]: value };
                                            }
                                            return s;
                                          });
                                          updateFindingField(finding.id, 'screenshots', updatedScreenshots);
                                        };

                                        const deleteScreenshot = () => {
                                          const updatedScreenshots = finding.screenshots?.filter(s => s.id !== screenshot.id)
                                            .map((s, idx) => ({ ...s, order: idx }));
                                          updateFindingField(finding.id, 'screenshots', updatedScreenshots);
                                        };

                                        const moveScreenshot = (dir: 'up' | 'down') => {
                                          const list = [...(finding.screenshots || [])].sort((a, b) => a.order - b.order);
                                          const sIndex = list.findIndex(s => s.id === screenshot.id);
                                          if (dir === 'up' && sIndex === 0) return;
                                          if (dir === 'down' && sIndex === list.length - 1) return;

                                          const targetIndex = dir === 'up' ? sIndex - 1 : sIndex + 1;
                                          const temp = list[sIndex];
                                          list[sIndex] = list[targetIndex];
                                          list[targetIndex] = temp;

                                          const updated = list.map((s, idx) => ({ ...s, order: idx }));
                                          updateFindingField(finding.id, 'screenshots', updated);
                                        };

                                        return (
                                          <div key={screenshot.id} className="flex flex-col md:flex-row gap-3 bg-[#0B101E] border border-white/[0.05] p-3 rounded-lg relative group">
                                            <div className="w-full md:w-28 h-20 bg-black/40 border border-white/[0.05] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                              <img src={screenshot.data} className="max-w-full max-h-full object-contain" alt="preview" />
                                            </div>

                                            <div className="flex-1 space-y-2">
                                              <div className="flex flex-col sm:flex-row gap-2">
                                                <div className="flex-1">
                                                  <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-bold mb-1">Figure Caption</label>
                                                  <input
                                                    type="text"
                                                    value={screenshot.caption}
                                                    onChange={(e) => updateScreenshotField('caption', e.target.value)}
                                                    className="w-full text-xs rounded px-2.5 py-1.5 bg-[#131A2B] text-white border border-white/[0.08] focus:outline-none focus:border-white/20 transition-all font-semibold"
                                                    placeholder="e.g. Exploitation console output"
                                                  />
                                                </div>
                                                <div className="w-full sm:w-20">
                                                  <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-bold mb-1">Width</label>
                                                  <input
                                                    type="text"
                                                    value={screenshot.width || ''}
                                                    onChange={(e) => updateScreenshotField('width', e.target.value)}
                                                    className="w-full text-xs rounded px-2.5 py-1.5 bg-[#131A2B] text-white border border-white/[0.08] focus:outline-none focus:border-white/20 transition-all text-center font-semibold"
                                                    placeholder="auto"
                                                  />
                                                </div>
                                                <div className="w-full sm:w-20">
                                                  <label className="block text-[9px] uppercase tracking-wider text-slate-550 font-bold mb-1">Height</label>
                                                  <input
                                                    type="text"
                                                    value={screenshot.height || ''}
                                                    onChange={(e) => updateScreenshotField('height', e.target.value)}
                                                    className="w-full text-xs rounded px-2.5 py-1.5 bg-[#131A2B] text-white border border-white/[0.08] focus:outline-none focus:border-white/20 transition-all text-center font-semibold"
                                                    placeholder="auto"
                                                  />
                                                </div>
                                              </div>
                                              <div className="text-[10px] text-slate-550 flex flex-wrap items-center gap-2 italic">
                                                <span>File: {screenshot.name}</span>
                                                <span>•</span>
                                                <span>Figure {sIdx + 1}</span>
                                                <span>•</span>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(`[image-${sIdx + 1}]`);
                                                  }}
                                                  className="px-1.5 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded text-[9px] text-blue-400 hover:text-blue-300 font-semibold not-italic flex items-center gap-1 transition-all"
                                                  title="Copy inline placeholder tag to clipboard"
                                                >
                                                  <Copy className="w-2.5 h-2.5" />
                                                  <span>Tag: [image-{sIdx + 1}]</span>
                                                </button>
                                              </div>
                                            </div>

                                            <div className="flex sm:flex-col items-center justify-end gap-1.5 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-white/[0.05] pt-2 sm:pt-0 sm:pl-3">
                                              <button
                                                type="button"
                                                onClick={() => moveScreenshot('up')}
                                                disabled={sIdx === 0}
                                                className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                                                title="Move Step Up"
                                              >
                                                <ArrowUp className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => moveScreenshot('down')}
                                                disabled={sIdx === (finding.screenshots?.length || 0) - 1}
                                                className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                                                title="Move Step Down"
                                              >
                                                <ArrowDown className="w-3.5 h-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={deleteScreenshot}
                                                className="p-1 hover:bg-red-500/15 text-slate-400 hover:text-red-400 rounded transition-colors"
                                                title="Delete Screenshot"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>

                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Remediation Steps</label>
                                <AITextarea
                                  rows={3}
                                  value={finding.remediation}
                                  onChange={(val) => updateFindingField(finding.id, 'remediation', val)}
                                  onCommit={() => notifyEdit(`finding-${finding.id}`)}
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                                  fieldType="remediation"
                                  model={aiModel}
                                />
                              </div>

                              <div className="flex justify-end pt-3 border-t border-white/[0.05]">
                                <button
                                  onClick={() => deleteFinding(finding.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 rounded-md transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Finding
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'supplemental' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                    SUPPLEMENTAL SECTIONS
                  </h3>
                  <button
                    type="button"
                    onClick={addSupplementalSection}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-lg text-xs hover:bg-pink-500/20 text-pink-400 transition-colors font-semibold shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {!report.supplementalSections || report.supplementalSections.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-505 text-xs">
                    No supplemental sections. Click "Add Section" to begin.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {report.supplementalSections.map((sec, idx) => (
                      <div key={sec.id} className="bg-[#0B101E] border border-white/[0.05] rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Heading 3.{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => deleteSupplementalSection(sec.id)}
                            className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition-colors"
                            title="Delete section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Section Title</label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => updateSupplementalSectionField(sec.id, 'title', e.target.value)}
                            {...commitHandlers(`supp-sec-${sec.id}`)}
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Introductory Content (Optional)</label>
                          <AITextarea
                            rows={3}
                            value={sec.content || ''}
                            onChange={(val) => updateSupplementalSectionField(sec.id, 'content', val)}
                            onCommit={() => notifyEdit(`supp-sec-${sec.id}`)}
                            placeholder="General section description..."
                            className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1]"
                            fieldType="supplemental"
                            model={aiModel}
                          />
                        </div>

                        {/* Subsections */}
                        <div className="border-t border-white/[0.05] pt-3 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-350">Sub-headings (3.{idx + 1}.x)</span>
                            <button
                              type="button"
                              onClick={() => addSupplementalSubSection(sec.id)}
                              className="flex items-center gap-1 px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded text-[10px] text-slate-300 hover:bg-white/[0.08]"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Sub-heading</span>
                            </button>
                          </div>

                          {(sec.subSections || []).map((sub, sIdx) => (
                            <div key={sub.id} className="bg-[#131A2B] border border-white/[0.05] rounded-lg p-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">Sub-heading 3.{idx + 1}.{sIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => deleteSupplementalSubSection(sec.id, sub.id)}
                                  className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Sub-heading Title</label>
                                <input
                                  type="text"
                                  value={sub.title}
                                  onChange={(e) => updateSupplementalSubSectionField(sec.id, sub.id, 'title', e.target.value)}
                                  {...commitHandlers(`supp-sub-${sub.id}`)}
                                  className="w-full rounded-lg px-3 py-1.5 text-xs bg-[#0B101E] text-white border border-white/[0.1]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Relevant Details</label>
                                <AITextarea
                                  rows={3}
                                  value={sub.content}
                                  onChange={(val) => updateSupplementalSubSectionField(sec.id, sub.id, 'content', val)}
                                  onCommit={() => notifyEdit(`supp-sub-${sub.id}`)}
                                  placeholder="Enter technical details, findings, or walkthrough steps..."
                                  className="w-full rounded-lg px-3 py-1.5 text-xs bg-[#0B101E] text-white border border-white/[0.1]"
                                  fieldType="goalDetails"
                                  model={aiModel}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'appendices' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase text-slate-505 font-bold border-b border-white/[0.05] pb-2 mb-3 tracking-widest">
                    4.1 TAILORED METHODOLOGIES
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Key Information</label>
                      <AITextarea
                        rows={3}
                        value={report.appendices?.methodologyKeyInfo || ''}
                        onChange={(val) => updateAppendicesField('methodologyKeyInfo', val)}
                        onCommit={() => notifyEdit('red-teaming-assessment')}
                        className="w-full rounded-lg px-3 py-2 text-sm bg-[#0B101E] text-white border border-white/[0.1]"
                        fieldType="methodologyKeyInfo"
                        model={aiModel}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Test Highlights</label>
                      <AITextarea
                        rows={3}
                        value={report.appendices?.methodologyHighlights || ''}
                        onChange={(val) => updateAppendicesField('methodologyHighlights', val)}
                        onCommit={() => notifyEdit('red-teaming-assessment')}
                        className="w-full rounded-lg px-3 py-2 text-sm bg-[#0B101E] text-white border border-white/[0.1]"
                        fieldType="methodologyHighlights"
                        model={aiModel}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">More Details</label>
                      <AITextarea
                        rows={3}
                        value={report.appendices?.methodologyMoreDetails || ''}
                        onChange={(val) => updateAppendicesField('methodologyMoreDetails', val)}
                        onCommit={() => notifyEdit('red-teaming-assessment')}
                        className="w-full rounded-lg px-3 py-2 text-sm bg-[#0B101E] text-white border border-white/[0.1]"
                        fieldType="methodologyMoreDetails"
                        model={aiModel}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Detailed Methodology</label>
                      <AITextarea
                        rows={4}
                        value={report.appendices?.methodologyDetailed || ''}
                        onChange={(val) => updateAppendicesField('methodologyDetailed', val)}
                        onCommit={() => notifyEdit('red-teaming-assessment')}
                        className="w-full rounded-lg px-3 py-2 text-sm bg-[#0B101E] text-white border border-white/[0.1]"
                        fieldType="methodologyDetailed"
                        model={aiModel}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/[0.05] pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-[10px] uppercase text-slate-505 font-bold tracking-widest">
                      4.2 ASSESSMENT TEAM
                    </h3>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 border border-violet-500/30 rounded text-xs text-violet-400 hover:bg-violet-500/20"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Analyst</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(report.appendices?.assessmentTeam || []).map((member, mIdx) => (
                      <div key={member.id} className="bg-[#0B101E] border border-white/[0.05] rounded-xl p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">Analyst #{mIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => deleteTeamMember(member.id)}
                            className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Name</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMemberField(member.id, 'name', e.target.value)}
                              className="w-full rounded px-2 py-1 text-xs bg-[#131A2B] text-white border border-white/[0.05]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Title / Role</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => updateTeamMemberField(member.id, 'role', e.target.value)}
                              className="w-full rounded px-2 py-1 text-xs bg-[#131A2B] text-white border border-white/[0.05]"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Organisation</label>
                            <input
                              type="text"
                              value={member.org}
                              onChange={(e) => updateTeamMemberField(member.id, 'org', e.target.value)}
                              className="w-full rounded px-2 py-1 text-xs bg-[#131A2B] text-white border border-white/[0.05]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'custom' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-2 border-b border-white/[0.03] pb-2">
                  <h3 className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                    DYNAMIC SECTIONS (RENDERED AFTER APPENDICES)
                  </h3>
                  <button
                    type="button"
                    onClick={addCustomSection}
                    className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Section</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-505 leading-relaxed">
                  Add any extra section with its own heading and sub-headings. Use the arrows to reorder; the report numbers (5, 6, 7…) and the Table of Contents will update automatically.
                </p>

                {!report.customSections || report.customSections.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-505 text-xs">
                    No custom sections yet. Click "Add Section" to create one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.customSections.map((sec, idx) => {
                      const isExpanded = expandedCustomSection === sec.id;
                      const secNum = 5 + idx;
                      return (
                        <div
                          key={sec.id}
                          className={`bg-[#0B101E] border border-white/[0.05] rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-1 ring-white/20 shadow-lg' : 'hover:border-white/10'}`}
                        >
                          <div
                            className="p-4 flex items-center justify-between cursor-pointer border-l-4 border-l-cyan-500 bg-[#131A2B]/40"
                            onClick={() => setExpandedCustomSection(isExpanded ? null : sec.id)}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="text-xs font-semibold text-slate-550">{secNum}.</span>
                              <span className="font-semibold text-sm text-slate-300 truncate max-w-[200px] sm:max-w-[280px]">
                                {sec.title || 'Untitled Custom Section'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => moveCustomSection(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 hover:bg-white/5 rounded disabled:opacity-30 text-slate-400 transition-colors"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveCustomSection(idx, 'down')}
                                disabled={idx === report.customSections.length - 1}
                                className="p-1.5 hover:bg-white/5 rounded disabled:opacity-30 text-slate-400 transition-colors"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setExpandedCustomSection(isExpanded ? null : sec.id)}
                                className="p-1.5 hover:bg-white/5 rounded text-slate-400 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="p-5 border-t border-white/[0.05] bg-[#131A2B] space-y-5">
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Section Title</label>
                                <input
                                  type="text"
                                  value={sec.title}
                                  onChange={(e) => updateCustomSectionField(sec.id, 'title', e.target.value)}
                                  {...commitHandlers(`cust-sec-${sec.id}`)}
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] font-semibold text-cyan-400"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Introductory Content (Optional)</label>
                                <AITextarea
                                  rows={3}
                                  value={sec.content || ''}
                                  onChange={(val) => updateCustomSectionField(sec.id, 'content', val)}
                                  onCommit={() => notifyEdit(`cust-sec-${sec.id}`)}
                                  placeholder="Section description or introduction..."
                                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 bg-[#0B101E] text-white border border-white/[0.1] placeholder-slate-600 transition-all"
                                  fieldType="supplemental"
                                  model={aiModel}
                                />
                              </div>

                              <div className="border-t border-white/[0.05] pt-3 space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-semibold text-slate-300">Sub-headings ({secNum}.x)</span>
                                  <button
                                    type="button"
                                    onClick={() => addCustomSubSection(sec.id)}
                                    className="flex items-center gap-1 px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded text-[10px] text-slate-300 hover:bg-white/[0.08]"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add Sub-heading</span>
                                  </button>
                                </div>

                                {(sec.subSections || []).map((sub, sIdx) => (
                                  <div key={sub.id} className="bg-[#0B101E] border border-white/[0.05] rounded-lg p-3 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-400">Sub-heading {secNum}.{sIdx + 1}</span>
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => moveCustomSubSection(sec.id, sIdx, 'up')}
                                          disabled={sIdx === 0}
                                          className="p-1 hover:bg-white/5 rounded disabled:opacity-30 text-slate-400 transition-colors"
                                          title="Move sub up"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => moveCustomSubSection(sec.id, sIdx, 'down')}
                                          disabled={sIdx === (sec.subSections?.length || 0) - 1}
                                          className="p-1 hover:bg-white/5 rounded disabled:opacity-30 text-slate-400 transition-colors"
                                          title="Move sub down"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteCustomSubSection(sec.id, sub.id)}
                                          className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded transition-colors"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Sub-heading Title</label>
                                      <input
                                        type="text"
                                        value={sub.title}
                                        onChange={(e) => updateCustomSubSectionField(sec.id, sub.id, 'title', e.target.value)}
                                        {...commitHandlers(`cust-sub-${sub.id}`)}
                                        className="w-full rounded-lg px-3 py-1.5 text-xs bg-[#131A2B] text-white border border-white/[0.05]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1">Content</label>
                                      <AITextarea
                                        rows={3}
                                        value={sub.content}
                                        onChange={(val) => updateCustomSubSectionField(sec.id, sub.id, 'content', val)}
                                        onCommit={() => notifyEdit(`cust-sub-${sub.id}`)}
                                        placeholder="Enter content for this sub-section..."
                                        className="w-full rounded-lg px-3 py-1.5 text-xs bg-[#131A2B] text-white border border-white/[0.05]"
                                        fieldType="supplemental"
                                        model={aiModel}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-end pt-3 border-t border-white/[0.05]">
                                <button
                                  onClick={() => deleteCustomSection(sec.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 rounded-md transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Custom Section
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Editor Footer with Save & Continue or Finish */}
          <div className="p-4 border-t border-white/[0.05] flex justify-end items-center gap-3 bg-[#0B101E] flex-shrink-0">
            {activeSection === 'custom' ? (
              <button
                onClick={() => {
                  onSaveReport(report);
                  setIsCustomSaved(true);
                  setTimeout(() => setIsCustomSaved(false), 3000);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 text-white text-xs font-bold rounded-lg transition-all ${
                  isCustomSaved 
                    ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                    : 'bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                }`}
              >
                <span>{isCustomSaved ? 'Saved' : 'Save'}</span>
                {isCustomSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleSaveAndContinue}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white text-xs font-bold rounded-lg transition-all"
              >
                <span>Save & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Drag Handle (Hidden in fullscreen) */}
        {!isFullscreen && (
          <div
            className="w-[2px] bg-[#070913] hover:bg-blue-500 active:bg-blue-500 cursor-col-resize transition-colors z-30"
            onMouseDown={startDrag}
          />
        )}

        {/* Right Side: Live HTML Preview */}
        <div className="flex-1 bg-[#070913] flex flex-col relative overflow-hidden">

          {/* Custom Translucent Vertical Slider */}
          <div
            ref={sliderTrackRef}
            onMouseDown={handleSliderMouseDown}
            className="absolute right-4 top-6 bottom-6 w-8 z-20 flex items-center justify-center cursor-pointer select-none group/track"
            title="Drag to scroll report"
          >
            {/* The track line */}
            <div className="w-2 h-full bg-white/15 group-hover/track:bg-white/25 active:bg-white/35 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-inner" />

            {/* Draggable thumb/handle */}
            <div
              ref={sliderThumbRef}
              className="absolute left-1/2 -translate-x-1/2 w-8 h-14 bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-blue-500/50 active:bg-blue-600 rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center text-slate-300 hover:text-white cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-all select-none"
              style={{
                top: '0px'
              }}
            >
              <GripVertical className="w-4 h-4" />
            </div>
          </div>

          {/* Pagination Controls Overlay - Relocated to Bottom Left */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-[#131A2B]/90 backdrop-blur-md border border-white/[0.1] rounded-full px-4 py-2 shadow-2xl">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-white/[0.1] rounded-full disabled:opacity-30 text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white tracking-wider">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-white/[0.1] rounded-full disabled:opacity-30 text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preview Container */}
          <div
            ref={previewContainerRef}
            className="flex-1 overflow-y-auto overflow-x-auto w-full relative bg-[#E8EDF2] no-scrollbar"
            onScroll={handleScroll}
          >
            {/*
              Scale fix: outer div is sized to post-scale visual dimensions
              so the scroll container never creates unwanted scrollbars.
              iframe is full unscaled size + scale(zoom) with origin top-left.
              PAGE_GAP (24px) lives inside the iframe template (gap between .page elements).
            */}
            <div
              style={{
                // outer container has scaled layout size
                width: `${A4_BASE_WIDTH * calculatedZoom}px`,
                height: `${totalIframeHeight * calculatedZoom}px`,
                margin: '32px auto',
                position: 'relative',
                flexShrink: 0,
                backgroundColor: '#E8EDF2',
                overflow: 'hidden'
              }}
            >
              <iframe
                ref={shadowContainerRef}
                className="border-none"
                title="PDF Preview"
                scrolling="no"
                style={{
                  width: `${A4_BASE_WIDTH}px`,
                  height: `${totalIframeHeight}px`,
                  zoom: calculatedZoom,
                  // pointerEvents auto so TOC anchor clicks reach the iframe bridge script;
                  // wheel events inside the iframe are forwarded to the parent container.
                  pointerEvents: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.22))',
                  overflow: 'hidden',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-[#070913]/85 backdrop-blur-md z-[100] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/[0.05]"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <div className="text-sm font-semibold tracking-wider text-slate-300 uppercase">Generating PDF Report...</div>
          <div className="text-xs text-slate-500">This might take a few seconds for multi-page captures</div>
        </div>
      )}

      {showVersionHistoryModal && (
        <div className="fixed inset-0 bg-[#0B101E]/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-2xl bg-[#131A2B] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Manage Version History
              </h3>
              <button
                onClick={() => setShowVersionHistoryModal(false)}
                className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Track and log iterations of the report.</p>
                <button
                  type="button"
                  onClick={addVersionHistoryItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Version</span>
                </button>
              </div>

              {(report.versionHistory || []).length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-500 text-xs">
                  No version history recorded. Click "Add Version" to log changes.
                </div>
              ) : (
                <div className="space-y-3">
                  {(report.versionHistory || []).map((vh) => (
                    <div key={vh.id} className="bg-[#0B101E] border border-white/[0.05] p-4 rounded-xl space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Version {vh.version || 'New'}</span>
                        <button
                          type="button"
                          onClick={() => deleteVersionHistoryItem(vh.id)}
                          className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                          title="Delete Version"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Version</label>
                          <input
                            type="text"
                            value={vh.version}
                            onChange={(e) => updateVersionHistoryItem(vh.id, 'version', e.target.value)}
                            placeholder="e.g. 1.0"
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Date</label>
                          <input
                            type="date"
                            value={vh.date}
                            onChange={(e) => updateVersionHistoryItem(vh.id, 'date', e.target.value)}
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Author</label>
                          <input
                            type="text"
                            value={vh.author}
                            onChange={(e) => updateVersionHistoryItem(vh.id, 'author', e.target.value)}
                            placeholder="Author Name"
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Change Summary</label>
                        <input
                          type="text"
                          value={vh.description}
                          onChange={(e) => updateVersionHistoryItem(vh.id, 'description', e.target.value)}
                          placeholder="e.g. Initial Draft for Internal Review"
                          className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/[0.05] flex justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowVersionHistoryModal(false)}
                className="px-4 py-2 bg-white text-[#0B101E] hover:bg-slate-100 text-xs font-semibold rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDistributionModal && (
        <div className="fixed inset-0 bg-[#0B101E]/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-2xl bg-[#131A2B] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <List className="w-5 h-5 text-blue-500" />
                Manage Distribution List
              </h3>
              <button
                onClick={() => setShowDistributionModal(false)}
                className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">Manage individuals authorized to receive copies of this document.</p>
                <button
                  type="button"
                  onClick={addDistributionItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Recipient</span>
                </button>
              </div>

              {(report.distributionList || []).length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-slate-500 text-xs">
                  No distribution recipients recorded. Click "Add Recipient" to begin.
                </div>
              ) : (
                <div className="space-y-3">
                  {(report.distributionList || []).map((dl) => (
                    <div key={dl.id} className="bg-[#0B101E] border border-white/[0.05] p-4 rounded-xl space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Recipient Copy #{dl.copyNo || 'N/A'}</span>
                        <button
                          type="button"
                          onClick={() => deleteDistributionItem(dl.id)}
                          className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                          title="Delete Recipient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Name</label>
                          <input
                            type="text"
                            value={dl.name}
                            onChange={(e) => updateDistributionItem(dl.id, 'name', e.target.value)}
                            placeholder="Recipient Name"
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Title / Role</label>
                          <input
                            type="text"
                            value={dl.role}
                            onChange={(e) => updateDistributionItem(dl.id, 'role', e.target.value)}
                            placeholder="e.g. Chief Information Security Officer"
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Organisation</label>
                          <input
                            type="text"
                            value={dl.organization}
                            onChange={(e) => updateDistributionItem(dl.id, 'organization', e.target.value)}
                            placeholder="Organisation"
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Copy Number</label>
                          <input
                            type="text"
                            value={dl.copyNo}
                            onChange={(e) => updateDistributionItem(dl.id, 'copyNo', e.target.value)}
                            placeholder="e.g. 1"
                            className="w-full rounded-lg px-3 py-2 text-xs bg-[#131A2B] text-white border border-white/[0.05] focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/[0.05] flex justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowDistributionModal(false)}
                className="px-4 py-2 bg-white text-[#0B101E] hover:bg-slate-100 text-xs font-semibold rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFindingModal && (
        <div className="fixed inset-0 bg-[#0B101E]/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-4xl bg-[#131A2B] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0 bg-[#131A2B]">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Vulnerability Catalog / Add Finding
              </h3>
              <button
                onClick={() => setShowAddFindingModal(false)}
                className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-1 overflow-hidden min-h-0 bg-[#131A2B]">
              {/* Left Column: Vulnerability list */}
              <div className="w-1/3 border-r border-white/[0.05] overflow-y-auto p-4 space-y-2.5">
                <button
                  type="button"
                  onClick={addCustomFinding}
                  className="w-full text-left p-3.5 bg-[#FF4D6D]/10 hover:bg-[#FF4D6D]/20 border border-[#FF4D6D]/20 hover:border-[#FF4D6D]/40 rounded-lg text-xs font-bold text-[#FF4D6D] flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Custom Finding</span>
                </button>

                <div className="w-full h-px bg-white/[0.05] my-2"></div>

                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest px-1.5 pb-1">
                  OWASP TOP 10 (2021)
                </div>

                {OWASP_TOP_10_LIBRARY.map((item, index) => {
                  const isSelected = selectedLibraryIndex === index;
                  const sevColors = {
                    Critical: 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/20',
                    High: 'bg-[#FF7A45]/10 text-[#FF7A45] border-[#FF7A45]/20',
                    Medium: 'bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20',
                    Low: 'bg-[#00C853]/10 text-[#00C853] border-[#00C853]/20',
                    Info: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                  };
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedLibraryIndex(index)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${isSelected ? 'bg-blue-600/10 border-blue-500 text-blue-400 font-semibold' : 'bg-[#0B101E]/50 border-white/[0.03] hover:border-white/[0.1] text-slate-300 hover:text-white'}`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="font-semibold truncate flex-1 leading-tight">{item.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${sevColors[item.severity]}`}>
                          {item.severity}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500 leading-none">{item.category.split('-')[0]}</div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Vulnerability details preview */}
              <div className="w-2/3 overflow-y-auto p-6 flex flex-col justify-between bg-[#0B101E]/30 min-h-0">
                {selectedLibraryIndex === null ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-8">
                    <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
                    <span className="text-xs font-semibold uppercase tracking-wider mb-1">Select a Template</span>
                    <span className="text-[11px] max-w-xs leading-relaxed">Choose an OWASP Top 10 vulnerability from the catalog to preview prefilled data, or create a custom finding.</span>
                  </div>
                ) : (() => {
                  const selected = OWASP_TOP_10_LIBRARY[selectedLibraryIndex];
                  const sevTextColors = {
                    Critical: 'text-[#FF4D6D]',
                    High: 'text-[#FF7A45]',
                    Medium: 'text-[#FFB020]',
                    Low: 'text-[#00C853]',
                    Info: 'text-[#3B82F6]'
                  };
                  return (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="space-y-4 flex-1 pr-1.5">
                        <div>
                          <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">{selected.category}</span>
                          <h4 className="text-base font-bold text-white mt-1 leading-snug">{selected.title}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-slate-400">Severity: <strong className={sevTextColors[selected.severity]}>{selected.severity}</strong></span>
                            <span className="text-xs text-slate-400">CVSS Base Score: <strong>{selected.cvss}</strong></span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2 text-xs border-t border-white/[0.05]">
                          <div>
                            <strong className="block text-[10px] uppercase text-slate-400 tracking-wider font-bold mb-1">Description</strong>
                            <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">{selected.description}</p>
                          </div>
                          <div>
                            <strong className="block text-[10px] uppercase text-slate-400 tracking-wider font-bold mb-1">Proof of Concept / Output</strong>
                            <pre className="text-[#A5B4FC] bg-[#090D14] p-3 rounded-lg leading-relaxed font-mono text-[10.5px] overflow-x-auto whitespace-pre-wrap">{selected.poc}</pre>
                          </div>
                          <div>
                            <strong className="block text-[10px] uppercase text-slate-400 tracking-wider font-bold mb-1">Remediation Steps</strong>
                            <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">{selected.remediation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="pt-4 border-t border-white/[0.05] flex justify-end gap-3 flex-shrink-0 mt-4">
                        <button
                          type="button"
                          onClick={() => addPrefilledFinding(selected)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                        >
                          Add Selected Finding
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const OWASP_TOP_10_LIBRARY: Omit<Finding, 'id'>[] = [
  {
    title: 'Insecure Direct Object Reference (IDOR) in User Details Access',
    severity: 'High',
    cvss: '7.5',
    category: 'A01:2021-Broken Access Control',
    status: 'Open',
    description: 'The application fails to validate if the currently logged-in user is authorized to access the requested resource. An authenticated user can access private details of other accounts simply by changing the ID parameter in the request URI.',
    poc: '1. Authenticate as User A (ID: 1002).\n2. Send a request to view account details: GET /api/v1/profile?id=1002.\n3. Modify the ID parameter in the request to 1001: GET /api/v1/profile?id=1001.\n4. Note that the server returns the profile details of User B (ID: 1001) without authorization.',
    remediation: 'Implement server-side authorization checks verifying that the requesting user owns or has access rights to the resource mapping to the requested ID. Never trust client-controlled identifiers without validation.'
  },
  {
    title: 'Cleartext Transmission of Credentials over Insecure Protocol',
    severity: 'High',
    cvss: '7.4',
    category: 'A02:2021-Cryptographic Failures',
    status: 'Open',
    description: 'Sensitive credentials and transaction data are transmitted over unencrypted HTTP channels. This exposes user passwords, session tokens, and personal details to interception or injection by network-level attackers.',
    poc: '1. Monitor traffic on the network gateway using an analysis tool (e.g., Wireshark).\n2. Navigate to the login portal and enter credentials.\n3. Observe the login POST payload transmitted in cleartext HTTP without TLS/SSL wrapping: POST /auth/login HTTP/1.1.',
    remediation: 'Force HTTPS on all pages and API endpoints. Implement HTTP Strict Transport Security (HSTS) with secure TLS configurations (TLS 1.2 or TLS 1.3 only).'
  },
  {
    title: 'SQL Injection in Search Input Field',
    severity: 'Critical',
    cvss: '9.8',
    category: 'A03:2021-Injection',
    status: 'Open',
    description: 'The application constructs dynamic database queries by directly concatenating user-supplied input. Attackers can submit database commands to manipulate the logic of queries, permitting authentication bypass and unauthorized extraction of sensitive schema records.',
    poc: '1. Go to the search input text area.\n2. Submit the following SQL query payload: \' UNION SELECT username, password_hash, null FROM users--\n3. Observe the usernames and security hashes output on the search results display.',
    remediation: 'Use parameterized queries (Prepared Statements) or an ORM for all database operations. Never sanitize input using client-side checks or escape functions alone.'
  },
  {
    title: 'Insecure Password Reset Logic (Brute Force Vulnerability)',
    severity: 'Medium',
    cvss: '5.3',
    category: 'A04:2021-Insecure Design',
    status: 'Open',
    description: 'The password reset flow utilizes a 4-digit verification code sent via email but lacks rate limiting on validation requests. Attackers can compromise user accounts by guessing all combinations within minutes.',
    poc: '1. Initiate a password reset request for a target account.\n2. Intercept the verification request to /reset/verify.\n3. Run a brute-force script (e.g. Burp Intruder) to iterate all 10,000 combinations (0000-9999).\n4. With no rate-limiting, the system eventually returns a 200 OK status on the correct code.',
    remediation: 'Enforce strict rate-limiting on verification endpoints (e.g., maximum 5 failed attempts per hour per IP/email). Transition to using cryptographically secure high-entropy reset tokens.'
  },
  {
    title: 'Debug Mode Enabled Exposing Stack Traces',
    severity: 'Medium',
    cvss: '5.3',
    category: 'A05:2021-Security Misconfiguration',
    status: 'Open',
    description: 'The application is running with active debug flags in production. Database queries, local system file paths, and server environment settings are exposed when errors or exceptions are encountered.',
    poc: '1. Supply an unexpected input structure (e.g., /invoice?id[]=test) to cause an internal exception.\n2. Observe the resulting HTTP 500 error page. It exposes database query structure, environment variables, and specific backend lines of code.',
    remediation: 'Disable application debug configurations in production environments. Implement structured error logging and direct safe, generic errors to the client UI.'
  },
  {
    title: 'Use of Library Component with Known Vulnerability (jQuery XSS)',
    severity: 'Medium',
    cvss: '6.1',
    category: 'A06:2021-Vulnerable and Outdated Components',
    status: 'Open',
    description: 'The application imports an outdated version of jQuery (v1.12.4) containing known vulnerabilities that permit DOM-based Cross-Site Scripting (XSS) via location hashes and event handlers.',
    poc: '1. Locate jQuery source path /assets/js/jquery-1.12.4.js in use.\n2. Execute a payload targeting CVE-2015-9251: GET /pages/index.html#<img src=x onerror=alert(document.domain)>.\n3. The script executes within the context of the user\'s active browser session.',
    remediation: 'Establish a software inventory policy and upgrade jQuery to the latest stable secure version (v3.x or newer). Deploy automated dependency updates.'
  },
  {
    title: 'Credential Stuffing Vulnerability (Lack of Login Rate Limiting)',
    severity: 'Medium',
    cvss: '4.8',
    category: 'A07:2021-Identification and Authentication Failures',
    status: 'Open',
    description: 'The authentication endpoint does not implement rate-limiting or anti-automation controls. Attackers can automate credential validation attempts using leaked password lists to gain unauthorized account access.',
    poc: '1. Send multiple automated POST login requests to /api/auth/login using incorrect credentials.\n2. Observe that the server responds consistently to every request with 401 Unauthorized, without blocking the source IP or requiring verification checks.',
    remediation: 'Implement IP-based and account-based rate limiting on authentication routes. Use CAPTCHA controls or multi-factor authentication (MFA) to prevent brute-force automation.'
  },
  {
    title: 'Insecure Object Deserialization in Session Manager',
    severity: 'High',
    cvss: '8.1',
    category: 'A08:2021-Software and Data Integrity Failures',
    status: 'Open',
    description: 'The application deserializes cookie-based session parameters directly from the client without verifying signature integrity. Attackers can tamper with serialized parameters to execute arbitrary system code on the host server.',
    poc: '1. Retrieve the session cookie value, which is a base64 encoded serialized object.\n2. Craft a malicious payload that calls system commands during object lifecycle execution.\n3. Replace the session cookie in your browser and reload the page to trigger remote command execution.',
    remediation: 'Avoid passing serialized objects to client-controlled layers. Implement session identifiers mapped to server-side stores or cryptographically sign token states (e.g., using JWS/JWT).'
  },
  {
    title: 'Absence of Security Audit Logs for Administrative Tasks',
    severity: 'Low',
    cvss: '3.1',
    category: 'A09:2021-Security Logging and Monitoring Failures',
    status: 'Open',
    description: 'Administrative status modifications, user privilege upgrades, and authentication failures are not logged by the server. This prevents threat hunting, real-time alert triggers, and post-breach forensic analysis.',
    poc: '1. Log in to the administrator portal and change organization config options.\n2. Review system logs (/var/log/audit/ or equivalent).\n3. Notice that no records were created capturing the user ID, timestamp, source IP, or specific actions executed.',
    remediation: 'Configure a security audit mechanism to record all privileged modifications, authorization checks, and account status transitions. Direct log output to write-only secure syslog aggregates.'
  },
  {
    title: 'Server-Side Request Forgery (SSRF) in Image URL Uploader',
    severity: 'High',
    cvss: '8.6',
    category: 'A10:2021-Server-Side Request Forgery (SSRF)',
    status: 'Open',
    description: 'The application downloads external image files by passing a user-supplied URL directly to server-side socket calls. This permits attackers to scan local ports, map internal networks, or query cloud metadata services (e.g., AWS IMDSv2).',
    poc: '1. Access the custom avatar uploader page.\n2. Supply the AWS metadata query URL as the avatar path: http://169.254.169.254/latest/meta-data/.\n3. Submit the form and observe internal configuration details returned within the server response body.',
    remediation: 'Validate input URLs against a strict domain whitelist. Block queries targeting internal IP address spaces (RFC 1918) and host loopbacks. Disable protocol wrappers other than HTTP/HTTPS.'
  }
];
