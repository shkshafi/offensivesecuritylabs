import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Search, 
  X, 
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Loader2,
  Check
} from 'lucide-react';
import { DEFAULT_TEMPLATE } from '../utils/defaultTemplate';

interface TemplateEditorProps {
  currentTemplate: string;
  onSaveTemplate: (newTemplate: string) => void;
  onClose: () => void;
}

interface Finding {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cvss: string;
  vector?: string;
  category: string;
  status: string;
  description: string;
  poc: string;
  remediation: string;
}

interface GoalScenario {
  id: string;
  title: string;
  description: string;
}

interface DummyReport {
  name: string;
  client: string;
  date: string;
  reportDate?: string;
  author: string;
  version: string;
  classification: string;
  executiveSummary: string;
  scope: string;
  findings: Finding[];
  goalsAndScenarios: GoalScenario[];
}

const dummyReport: DummyReport = {
  name: 'TACTICAL EXERCISE PHANTOM RAPTOR',
  client: 'Aether Cybernetics Ltd',
  date: '2026-05-30',
  reportDate: '2026-05-30',
  author: 'Operative Alpha-9',
  version: '2.14',
  classification: 'CONFIDENTIAL',
  executiveSummary: 'During the simulated engagement, Aether Cybernetics corporate portal and external APIs were subjected to simulated red team attacks. Serious credential hygiene and remote exploit vulnerabilities were uncovered, leading to full domain administrator compromise.',
  scope: 'Internal Subnets: 172.16.12.0/24\nExternal Webapps: portal.aether.org, api.aether.org\nSocial Engineering scope: 15 target users',
  goalsAndScenarios: [
    {
      id: 'dummy-gs-1',
      title: 'Compromise Internal Domain Controller',
      description: 'Obtain domain administrator privilege access on the primary Domain Controller (DC-01) by leveraging compromised service account hashes.'
    },
    {
      id: 'dummy-gs-2',
      title: 'Exfiltrate Sensitive Customer Records',
      description: 'Locate and exfiltrate simulated PII database from the billing environment database server to external command and control (C2) servers.'
    }
  ],
  findings: [
    {
      id: 'dummy-1',
      title: 'Remote Code Execution in Core API Service',
      severity: 'Critical',
      cvss: '9.8',
      category: 'Remote Code Execution',
      status: 'Open',
      description: 'A deserialization flaw in the REST API input validation handler allows arbitrary OS command injection via cookie header payloads.',
      poc: 'GET /api/v2/stats HTTP/1.1\nCookie: session=eyJhY3Rpb24iOiJidWlsZCIsInBheWxvYWQiOiJjYXQgL2V0Yy9wYXNzd2QifQ==\nHost: api.aether.org',
      remediation: 'Enforce strict type validation, avoid unsafe deserialization libraries, and run the service container with unprivileged privileges.'
    },
    {
      id: 'dummy-2',
      title: 'Active Directory Domain Controller Password Spraying Success',
      severity: 'High',
      cvss: '8.1',
      category: 'Weak Credentials',
      status: 'In Progress',
      description: 'Using common seasonal passwords, our red team successfully authenticated to 4 employee accounts, one of which belonged to a member of the Domain Admins group.',
      poc: './sprayer.py -u employees.txt -p Summer2026! -d aether.org',
      remediation: 'Implement multi-factor authentication, set account lockout thresholds, and enforce a complex, non-seasonal password policy.'
    }
  ]
};

const A4_BASE_WIDTH = 800;
const A4_BASE_HEIGHT = 1130;

export default function TemplateEditor({
  currentTemplate,
  onSaveTemplate,
  onClose
}: TemplateEditorProps) {
  const [templateCode, setTemplateCode] = useState(currentTemplate);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const lastSavedTemplateCodeRef = useRef<string>(templateCode);
  const saveTimeoutRef = useRef<any>(null);
  const shadowContainerRef = useRef<HTMLIFrameElement>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  // Custom widths for the three panels in percentage
  const [col1Width, setCol1Width] = useState(12); // placeholders
  const [col2Width, setCol2Width] = useState(38); // html editor
  
  // Pagination & Zooming states
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomMode, setZoomMode] = useState<'width' | 'height' | 'custom'>('height');
  const [customZoom, setCustomZoom] = useState(100);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Calculate active zoom value
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
      container.scrollTo({
        top: (clampedPage - 1) * A4_BASE_HEIGHT * calculatedZoom,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const pageHeight = A4_BASE_HEIGHT * calculatedZoom;
    const scrolledPage = Math.floor((scrollTop + pageHeight / 2) / pageHeight) + 1;
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

  const handleFitHeightToggle = () => {
    if (zoomMode === 'height') {
      setZoomMode('custom');
      setCustomZoom(100);
    } else {
      setZoomMode('height');
    }
  };

  // Keep active page aligned when zoom changes
  useEffect(() => {
    const container = previewContainerRef.current;
    if (container) {
      container.scrollTo({
        top: (currentPage - 1) * A4_BASE_HEIGHT * calculatedZoom,
      });
    }
  }, [calculatedZoom]);

  // Auto-save template when templateCode changes with a debounce of 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSaveTemplate(templateCode);
    }, 500);
    return () => clearTimeout(timer);
  }, [templateCode, onSaveTemplate]);

  // Sync lastSavedTemplateCodeRef when template changes/loads
  useEffect(() => {
    lastSavedTemplateCodeRef.current = currentTemplate;
    setSaveStatus('idle');
  }, [currentTemplate]);

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

  const handleFieldBlur = () => {
    setTimeout(() => {
      setTemplateCode(currentCode => {
        if (lastSavedTemplateCodeRef.current !== currentCode) {
          setSaveStatus('saving');
          
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
          
          const timerId = setTimeout(() => {
            setSaveStatus('saved');
            
            const resetTimerId = setTimeout(() => {
              setSaveStatus('idle');
            }, 2000);
            
            saveTimeoutRef.current = resetTimerId;
          }, 800);

          saveTimeoutRef.current = timerId;
          lastSavedTemplateCodeRef.current = currentCode;
        }
        return currentCode;
      });
    }, 50);
  };

  // Programmatically determine total page count inside iframe
  const calculateTotalPages = () => {
    const iframe = shadowContainerRef.current;
    if (iframe) {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc && doc.body) {
        const originalHeight = iframe.style.height;
        // Temporarily collapse the iframe height to 100px to get the true content scrollHeight
        iframe.style.height = '100px';
        const contentHeight = Math.max(
          doc.documentElement.scrollHeight,
          doc.body.scrollHeight,
          doc.documentElement.offsetHeight,
          doc.body.offsetHeight
        );
        iframe.style.height = originalHeight;

        const pages = Math.max(1, Math.ceil(contentHeight / A4_BASE_HEIGHT));
        setTotalPages(pages);
      }
    }
  };

  // Find and replace states
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');

  // Keyboard shortcut Ctrl+F / Cmd+F to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowFindReplace(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const getVectorUrl = (vector?: string) => {
    if (!vector || !vector.trim()) return '';
    let version = '4.0';
    if (vector.includes('4.0')) version = '4.0';
    else if (vector.includes('3.1')) version = '3.1';
    else if (vector.includes('3.0')) version = '3.0';
    return `https://www.first.org/cvss/calculator/${version}#${vector.trim()}`;
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

      // Check for unordered lists (*, -, +, •, ▪, ◦ followed by space)
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

  // HTML scanner to inject source character indices into opening tags
  const injectSourceIndices = (code: string) => {
    let result = '';
    let i = 0;
    while (i < code.length) {
      if (code.substring(i, i + 4) === '<!--') {
        const endComment = code.indexOf('-->', i + 4);
        if (endComment === -1) {
          result += code.substring(i);
          break;
        }
        result += code.substring(i, endComment + 3);
        i = endComment + 3;
      } else if (code.substring(i, i + 7).toLowerCase() === '<style') {
        const endStyle = code.toLowerCase().indexOf('</style>', i + 7);
        if (endStyle === -1) {
          result += code.substring(i);
          break;
        }
        result += code.substring(i, endStyle + 8);
        i = endStyle + 8;
      } else if (code.substring(i, i + 8).toLowerCase() === '<script') {
        const endScript = code.toLowerCase().indexOf('</script>', i + 8);
        if (endScript === -1) {
          result += code.substring(i);
          break;
        }
        result += code.substring(i, endScript + 9);
        i = endScript + 9;
      } else if (code[i] === '<' && code[i + 1] !== '/' && code[i + 1] !== '!' && code[i + 1] !== '?') {
        let endTag = i;
        let inQuote = false;
        let quoteChar = '';
        while (endTag < code.length) {
          const char = code[endTag];
          if (inQuote) {
            if (char === quoteChar) {
              inQuote = false;
            }
          } else {
            if (char === '"' || char === "'") {
              inQuote = true;
              quoteChar = char;
            } else if (char === '>') {
              break;
            }
          }
          endTag++;
        }
        
        if (endTag < code.length) {
          const tagContent = code.substring(i + 1, endTag);
          const matchName = tagContent.match(/^([a-zA-Z1-6-]+)/);
          if (matchName) {
            const tagName = matchName[1];
            const index = i;
            let rest = tagContent.substring(tagName.length);
            let isSelfClosing = rest.endsWith('/');
            if (isSelfClosing) {
              rest = rest.substring(0, rest.length - 1);
            }
            const newTag = `<${tagName} data-source-index="${index}"${rest}${isSelfClosing ? '/' : ''}>`;
            result += newTag;
          } else {
            result += code.substring(i, endTag + 1);
          }
          i = endTag + 1;
        } else {
          result += code[i];
          i++;
        }
      } else {
        result += code[i];
        i++;
      }
    }
    return result;
  };

  const compileTemplateWithDummyData = () => {
    // Inject source indices into visual HTML tags
    let html = injectSourceIndices(templateCode);

    // Severity counts
    const critical = dummyReport.findings?.filter(f => f.severity === 'Critical').length || 0;
    const high = dummyReport.findings?.filter(f => f.severity === 'High').length || 0;
    const medium = dummyReport.findings?.filter(f => f.severity === 'Medium').length || 0;
    const low = dummyReport.findings?.filter(f => f.severity === 'Low').length || 0;
    const info = dummyReport.findings?.filter(f => f.severity === 'Info').length || 0;

    // General replacements
    html = html.replace(/{{title}}/g, escapeHtml(dummyReport.name));
    html = html.replace(/{{client}}/g, escapeHtml(dummyReport.client));
    html = html.replace(/{{date}}/g, escapeHtml(dummyReport.date));
    html = html.replace(/{{report_date}}/g, escapeHtml(dummyReport.reportDate || dummyReport.date));
    html = html.replace(/{{author}}/g, escapeHtml(dummyReport.author));
    html = html.replace(/{{version}}/g, escapeHtml(dummyReport.version));
    html = html.replace(/{{classification}}/g, escapeHtml(dummyReport.classification));
    html = html.replace(/{{executive_summary}}/g, formatText(dummyReport.executiveSummary));
    html = html.replace(/{{scope}}/g, formatText(dummyReport.scope));
    
    html = html.replace(/{{count_critical}}/g, String(critical));
    html = html.replace(/{{count_high}}/g, String(high));
    html = html.replace(/{{count_medium}}/g, String(medium));
    html = html.replace(/{{count_low}}/g, String(low));
    html = html.replace(/{{count_info}}/g, String(info));

    // Ensure template has goals and scenarios section if it doesn't already
    if (!html.includes('{{goals_scenarios_list}}')) {
      const targetTitle = '<div class="sec-title">2 &nbsp; Technical Details</div>';
      const index = html.indexOf(targetTitle);
      if (index !== -1) {
        const pageStartIndex = html.lastIndexOf('<div class="page">', index);
        if (pageStartIndex !== -1) {
          const gsSectionHtml = `
  <!-- GOALS_AND_SCENARIOS_SECTION_START -->
  <div class="page">
    <div class="doc-header">
      <div class="doc-header-left">
        <img class="header-logo-img" src="https://www.nttdata.com/global/en/-/media/assets/images/header_logo.svg?iar=0&rev=010dc1bd851f4d2aaaaf407cf338776b" alt="Logo">
        <span>Red Team Assessment Report</span>
      </div>
      <div class="doc-header-right">2.1 – Goals & Scenarios</div>
    </div>
    <div class="page-content">
      <div class="sec-title">2 &nbsp; Goals & Scenarios</div>
      <div class="sec-sub">2.1 &nbsp; Detailed Goals & Scenarios</div>
      <p>This section outlines the specific goals and simulated attack scenarios planned and executed during the red team assessment.</p>
    </div>
    <div class="doc-footer">
      <div class="doc-footer-text">Version {{version}} – {{date}}</div>
      <div class="confid-stamp">{{classification}}</div>
      <div class="doc-footer-text"><span class="page-num"></span></div>
    </div>
  </div>

  {{goals_scenarios_list}}
  <!-- GOALS_AND_SCENARIOS_SECTION_END -->
          `;
          html = html.substring(0, pageStartIndex) + gsSectionHtml + html.substring(pageStartIndex);
        }
      }
    }

    if (!html.includes('<!-- GOAL_SCENARIO_TEMPLATE_START -->')) {
      const closingBodyIndex = html.toLowerCase().indexOf('</body>');
      if (closingBodyIndex !== -1) {
        const gsTemplateHtml = `
<!-- GOAL_SCENARIO_TEMPLATE_START -->
<div class="page">
  <div class="doc-header">
    <div class="doc-header-left">
      <img class="header-logo-img" src="https://www.nttdata.com/global/en/-/media/assets/images/header_logo.svg?iar=0&rev=010dc1bd851f4d2aaaaf407cf338776b" alt="Logo">
      <span>Red Team Assessment Report</span>
    </div>
    <div class="doc-header-right">2.1 – Goals & Scenarios</div>
  </div>
  <div class="page-content">
    <div class="finding-block" style="border-color: var(--border);">
      <div class="fb-head" style="background: var(--navy-mid);">
        <div class="fb-head-left">
          <span class="fb-id">GS-{{goal_scenario_index}}</span>
          <span class="fb-title">{{goal_scenario_title}}</span>
        </div>
      </div>
      <div class="fb-body">
        <div class="fb-section" style="margin-bottom: 0;">
          <div class="fb-section-lbl">Scenario Details</div>
          <p>{{goal_scenario_description}}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="doc-footer">
    <div class="doc-footer-text">Version {{version}} – {{date}}</div>
    <div class="confid-stamp">{{classification}}</div>
    <div class="doc-footer-text"><span class="page-num"></span></div>
  </div>
</div>
<!-- GOAL_SCENARIO_TEMPLATE_END -->
        `;
        html = html.substring(0, closingBodyIndex) + gsTemplateHtml + html.substring(closingBodyIndex);
      }
    }

    // Compile goals and scenarios
    const gsTemplateMatch = html.match(/<!-- GOAL_SCENARIO_TEMPLATE_START -->([\s\S]*?)<!-- GOAL_SCENARIO_TEMPLATE_END -->/);
    let gsSubTemplate = '';
    if (gsTemplateMatch && gsTemplateMatch[1]) {
      gsSubTemplate = gsTemplateMatch[1];
    }

    let gsHtml = '';
    if (dummyReport.goalsAndScenarios && dummyReport.goalsAndScenarios.length > 0) {
      dummyReport.goalsAndScenarios.forEach((gs, index) => {
        let gHtml = gsSubTemplate || `
          <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px;">
            <h4>Goal/Scenario {{goal_scenario_index}}: {{goal_scenario_title}}</h4>
            <p>{{goal_scenario_description}}</p>
          </div>
        `;

        gHtml = gHtml.replace(/{{goal_scenario_index}}/g, String(index + 1));
        gHtml = gHtml.replace(/{{goal_scenario_title}}/g, escapeHtml(gs.title));
        gHtml = gHtml.replace(/{{goal_scenario_description}}/g, formatText(gs.description));

        gsHtml += gHtml;
      });
    } else {
      gsHtml = '<p style="color: #64748b; font-style: italic;">No goals or scenarios recorded for this assessment.</p>';
    }

    if (gsTemplateMatch) {
      html = html.replace(/<!-- GOAL_SCENARIO_TEMPLATE_START -->[\s\S]*?<!-- GOAL_SCENARIO_TEMPLATE_END -->/, '');
    }
    html = html.replace(/{{goals_scenarios_list}}/g, gsHtml);

    // Section number dynamic shifting
    const tdSectionNum = '3';
    html = html.replace(/2\.1 – Detailed Findings/g, `${tdSectionNum}.1 – Detailed Findings`);
    html = html.replace(/2 &nbsp; Technical Details/g, `${tdSectionNum} &nbsp; Technical Details`);
    html = html.replace(/2\.1 &nbsp; Detailed Findings/g, `${tdSectionNum}.1 &nbsp; Detailed Findings`);
    html = html.replace(/2\.1\.1 &nbsp; Technical Findings List/g, `${tdSectionNum}.1.1 &nbsp; Technical Findings List`);

    // Update TOC page numbers & items dynamically
    const gCount = dummyReport.goalsAndScenarios?.length || 0;
    const technicalDetailsStartPage = 7 + gCount;

    html = html.replace(
      /<div\s+class="toc-row\s+h1">\s*<span\s+class="toc-num">2<\/span>\s*<span\s+class="toc-lbl">Technical\s+Details<\/span>\s*<span\s+class="toc-pg">6<\/span>\s*<\/div>\s*<div\s+class="toc-row\s+h2">\s*<span\s+class="toc-num">2\.1<\/span>\s*<span\s+class="toc-lbl">Detailed\s+Findings<\/span>\s*<span\s+class="toc-pg">6<\/span>\s*<\/div>/gi,
      `<div class="toc-row h1"><span class="toc-num">2</span><span class="toc-lbl">Goals & Scenarios</span><span class="toc-pg">6</span></div>
        <div class="toc-row h2"><span class="toc-num">2.1</span><span class="toc-lbl">Goals & Scenarios Overview</span><span class="toc-pg">6</span></div>
        <div class="toc-row h1"><span class="toc-num">3</span><span class="toc-lbl">Technical Details</span><span class="toc-pg">${technicalDetailsStartPage}</span></div>
        <div class="toc-row h2"><span class="toc-num">3.1</span><span class="toc-lbl">Detailed Findings</span><span class="toc-pg">${technicalDetailsStartPage}</span></div>`
    );

    // Compile findings
    const findingTemplateMatch = html.match(/<!-- FINDING_TEMPLATE_START -->([\s\S]*?)<!-- FINDING_TEMPLATE_END -->/);
    let findingSubTemplate = '';
    if (findingTemplateMatch && findingTemplateMatch[1]) {
      findingSubTemplate = findingTemplateMatch[1];
    }

    let findingsHtml = '';
    dummyReport.findings.forEach((finding, index) => {
      let fHtml = findingSubTemplate || `
        <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px;">
          <h4>Finding {{finding_index}}: {{finding_title}}</h4>
          <p>{{finding_description}}</p>
        </div>
      `;

      fHtml = fHtml.replace(/{{finding_index}}/g, String(index + 1));
      fHtml = fHtml.replace(/{{finding_title}}/g, escapeHtml(finding.title));
      fHtml = fHtml.replace(/{{finding_severity}}/g, escapeHtml(finding.severity));
      fHtml = fHtml.replace(/{{finding_severity_class}}/g, finding.severity?.toLowerCase() || 'info');
      fHtml = fHtml.replace(/{{finding_cvss}}/g, escapeHtml(finding.cvss));
      fHtml = fHtml.replace(/{{finding_vector}}/g, escapeHtml(finding.vector || 'N/A'));
      fHtml = fHtml.replace(/{{finding_vector_url}}/g, escapeHtml(getVectorUrl(finding.vector)));
      fHtml = fHtml.replace(/{{finding_category}}/g, escapeHtml(finding.category));
      fHtml = fHtml.replace(/{{finding_status}}/g, escapeHtml(finding.status));
      fHtml = fHtml.replace(/{{finding_description}}/g, formatText(finding.description));
      fHtml = fHtml.replace(/{{finding_poc}}/g, escapeHtml(finding.poc));
      fHtml = fHtml.replace(/{{finding_remediation}}/g, formatText(finding.remediation));

      findingsHtml += fHtml;
    });

    // Replace the findings list placeholder
    if (findingTemplateMatch) {
      html = html.replace(/<!-- FINDING_TEMPLATE_START -->[\s\S]*?<!-- FINDING_TEMPLATE_END -->/, '');
    }
    html = html.replace(/{{findings_list}}/g, findingsHtml);

    return html;
  };

  const compiledHtml = compileTemplateWithDummyData();

  // States for copy actions
  const [copiedPlaceholder, setCopiedPlaceholder] = useState<string | null>(null);

  // Update iframe preview dynamically and attach click-to-edit coordination
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
        const handleLoad = () => {
          calculateTotalPages();
        };
        iframe.addEventListener('load', handleLoad);
        
        setTimeout(calculateTotalPages, 100);

        const observer = new MutationObserver(calculateTotalPages);
        if (doc.body) {
          observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
        }

        // Listen for element click inside iframe to navigate source cursor
        const handleIframeClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          let target = e.target as HTMLElement | null;
          while (target && !target.getAttribute?.('data-source-index')) {
            target = target.parentElement;
          }
          if (target) {
            const indexStr = target.getAttribute('data-source-index');
            if (indexStr) {
              const index = parseInt(indexStr, 10);
              const textarea = textareaRef.current;
              if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(index, index);
                
                // Delay scroll slightly to override browser's default focus scroll
                setTimeout(() => {
                  const textBefore = textarea.value.substring(0, index);
                  const linesBefore = textBefore.split('\n').length;
                  textarea.scrollTop = (linesBefore - 1) * 20 + 16; // Align as the absolute first line (with 16px padding)
                }, 20);
              }
            }
          }
        };

        // Scroll the parent container when mouse wheel is used inside the iframe
        const handleIframeWheel = (e: WheelEvent) => {
          e.preventDefault();
          const container = previewContainerRef.current;
          if (container) {
            container.scrollTop += e.deltaY;
          }
        };

        // Sync text selection from preview to HTML editor
        const handleIframeMouseUp = () => {
          setTimeout(() => {
            const selection = doc.getSelection();
            if (!selection || selection.isCollapsed) return;

            const selectedText = selection.toString().trim();
            if (!selectedText) return;

            let anchorNode = selection.anchorNode;
            if (anchorNode && anchorNode.nodeType === Node.TEXT_NODE) {
              anchorNode = anchorNode.parentElement;
            }
            let target = anchorNode as HTMLElement | null;
            while (target && !target.getAttribute?.('data-source-index')) {
              target = target.parentElement;
            }

            if (target) {
              const indexStr = target.getAttribute('data-source-index');
              if (indexStr) {
                const elementSourceIndex = parseInt(indexStr, 10);
                const textarea = textareaRef.current;
                if (textarea) {
                  const code = textarea.value;
                  let matchIndex = code.indexOf(selectedText, elementSourceIndex);
                  if (matchIndex === -1) {
                    matchIndex = code.indexOf(selectedText);
                  }

                  if (matchIndex !== -1) {
                    textarea.focus();
                    textarea.setSelectionRange(matchIndex, matchIndex + selectedText.length);
                    
                    // Delay scroll to run after browser auto-scroll
                    setTimeout(() => {
                      const textBefore = code.substring(0, matchIndex);
                      const linesBefore = textBefore.split('\n').length;
                      textarea.scrollTop = (linesBefore - 1) * 20 + 16; // Align selected text to the top
                    }, 20);
                  }
                }
              }
            }
          }, 50);
        };

        doc.addEventListener('click', handleIframeClick);
        doc.addEventListener('wheel', handleIframeWheel, { passive: false });
        doc.addEventListener('mouseup', handleIframeMouseUp);
        doc.addEventListener('keyup', handleIframeMouseUp);

        return () => {
          iframe.removeEventListener('load', handleLoad);
          observer.disconnect();
          doc.removeEventListener('click', handleIframeClick);
          doc.removeEventListener('wheel', handleIframeWheel);
          doc.removeEventListener('mouseup', handleIframeMouseUp);
          doc.removeEventListener('keyup', handleIframeMouseUp);
        };
      }
    }
  }, [compiledHtml]);

  const handleSave = () => {
    onSaveTemplate(templateCode);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlaceholder(text);
    setTimeout(() => setCopiedPlaceholder(null), 1500);
  };

  // Find & Replace helper functions
  const getMatchIndices = () => {
    if (!searchQuery) return [];
    const indices: number[] = [];
    let idx = templateCode.toLowerCase().indexOf(searchQuery.toLowerCase());
    while (idx !== -1) {
      indices.push(idx);
      idx = templateCode.toLowerCase().indexOf(searchQuery.toLowerCase(), idx + 1);
    }
    return indices;
  };

  const matches = getMatchIndices();
  const currentCursor = textareaRef.current?.selectionStart || 0;
  const currentMatchIdx = matches.findIndex(idx => idx >= currentCursor);
  const displayMatchNum = matches.length > 0 
    ? (currentMatchIdx === -1 ? matches.length : currentMatchIdx + 1)
    : 0;

  const handleFindNext = () => {
    const textarea = textareaRef.current;
    if (!textarea || matches.length === 0) return;
    
    let nextIdx = 0;
    if (currentMatchIdx !== -1) {
      const currentSelectionStart = textarea.selectionStart;
      const indexUnderCursor = matches[currentMatchIdx];
      
      if (currentSelectionStart === indexUnderCursor && currentMatchIdx + 1 < matches.length) {
        nextIdx = matches[currentMatchIdx + 1];
      } else {
        nextIdx = matches[currentMatchIdx];
      }
    } else {
      nextIdx = matches[0];
    }

    textarea.focus();
    textarea.setSelectionRange(nextIdx, nextIdx + searchQuery.length);
    
    const textBefore = textarea.value.substring(0, nextIdx);
    const linesBefore = textBefore.split('\n').length;
    textarea.scrollTop = (linesBefore - 5) * 16;
  };

  const handleFindPrev = () => {
    const textarea = textareaRef.current;
    if (!textarea || matches.length === 0) return;

    let prevIdx = matches[matches.length - 1];
    if (currentMatchIdx !== -1) {
      if (currentMatchIdx > 0) {
        prevIdx = matches[currentMatchIdx - 1];
      }
    }

    textarea.focus();
    textarea.setSelectionRange(prevIdx, prevIdx + searchQuery.length);

    const textBefore = textarea.value.substring(0, prevIdx);
    const linesBefore = textBefore.split('\n').length;
    textarea.scrollTop = (linesBefore - 5) * 16;
  };

  const handleReplace = () => {
    const textarea = textareaRef.current;
    if (!textarea || !searchQuery) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = textarea.value.substring(start, end);
    
    if (selection.toLowerCase() === searchQuery.toLowerCase()) {
      const before = templateCode.substring(0, start);
      const after = templateCode.substring(end);
      const newCode = before + replaceQuery + after;
      setTemplateCode(newCode);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + replaceQuery.length);
      }, 0);
    } else {
      handleFindNext();
    }
  };

  const handleReplaceAll = () => {
    if (!searchQuery) return;
    const regex = new RegExp(searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    const newCode = templateCode.replace(regex, replaceQuery);
    setTemplateCode(newCode);
  };

  // Resizable drag actions
  const startDrag1 = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidthPx = moveEvent.clientX - containerRect.left;
      let newWidthPct = (newWidthPx / containerRect.width) * 100;
      
      newWidthPct = Math.max(5, Math.min(25, newWidthPct));
      if (newWidthPct + col2Width <= 85) {
        setCol1Width(newWidthPct);
      }
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const startDrag2 = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const col2StartPx = (col1Width / 100) * containerRect.width;
      const newWidthPx = moveEvent.clientX - containerRect.left - col2StartPx;
      let newWidthPct = (newWidthPx / containerRect.width) * 100;
      
      newWidthPct = Math.max(20, Math.min(60, newWidthPct));
      if (col1Width + newWidthPct <= 85) {
        setCol2Width(newWidthPct);
      }
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderPlaceholderButton = (label: string, placeholder: string) => {
    const isCopied = copiedPlaceholder === placeholder;
    return (
      <div className="mb-2.5">
        <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">{label}</span>
        <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-md bg-[#090D14] border border-white/[0.05]">
          <span className="text-[11px] text-slate-300 font-mono select-all truncate ml-1">{placeholder}</span>
          <button
            type="button"
            onClick={() => handleCopy(placeholder)}
            className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all flex-shrink-0 ${isCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white'}`}
          >
            {isCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-700 dark:text-slate-200 font-sans flex flex-col h-screen overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-6 right-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg shadow-2xl z-[100] animate-bounce uppercase font-bold">
          GLOBAL TEMPLATE REGISTERED SUCCESSFULLY
        </div>
      )}

      {/* Editor Header */}
      <header className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 h-16 flex items-center justify-between px-6 flex-shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-500 font-bold uppercase tracking-wider block">Template Configuration</span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                saveStatus === 'saving'
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.1)]'
                  : saveStatus === 'saved'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}>
                {saveStatus === 'saving' ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-500 dark:text-blue-400" />
                ) : saveStatus === 'saved' ? (
                  <Check className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400 stroke-[3]" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
                <span>
                  {saveStatus === 'saving' ? 'Saving' : saveStatus === 'saved' ? 'Saved' : 'Auto-saved'}
                </span>
              </div>
            </div>
            <h2 className="text-sm font-semibold text-slate-850 dark:text-white leading-tight mt-0.5">Edit Report Template</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('RESET TEMPLATE: Are you sure you want to revert to the default template? This will overwrite your current template customization.')) {
                setTemplateCode(DEFAULT_TEMPLATE);
                onSaveTemplate(DEFAULT_TEMPLATE);
              }
            }}
            className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 text-xs font-semibold rounded-lg transition-all"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Default</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(96,165,250,0.3)]"
          >
            <Save className="w-4 h-4" />
            <span>Save Template</span>
          </button>
        </div>
      </header>

      {/* 3-Column Workspace */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        
        {/* Column 1: Available Placeholders */}
        <div
          style={{ width: `${col1Width}%`, flexShrink: 0 }}
          className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 flex flex-col h-full overflow-y-auto p-5"
        >
          <h3 className="text-xs text-slate-555 dark:text-slate-400 uppercase tracking-widest font-bold mb-5 flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Placeholders</span>
          </h3>

          <div className="space-y-6">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">Metadata</span>
              {renderPlaceholderButton('Report Title', '{{title}}')}
              {renderPlaceholderButton('Client Name', '{{client}}')}
              {renderPlaceholderButton('Assessment Date', '{{date}}')}
              {renderPlaceholderButton('Report Date', '{{report_date}}')}
              {renderPlaceholderButton('Lead Analyst', '{{author}}')}
              {renderPlaceholderButton('Document Version', '{{version}}')}
              {renderPlaceholderButton('Classification', '{{classification}}')}
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">Sections</span>
              {renderPlaceholderButton('Executive Summary', '{{executive_summary}}')}
              {renderPlaceholderButton('Assessment Scope', '{{scope}}')}
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">Goals & Scenarios</span>
              {renderPlaceholderButton('Goals & Scenarios Container', '{{goals_scenarios_list}}')}
              <div className="mt-3 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/50 rounded-lg leading-relaxed">
                <span className="text-[#FF4D6D] font-bold uppercase block mb-1.5">LOOP TAG BLOCK:</span>
                Wrap goals/scenarios placeholders between these HTML comments:
                <span className="text-blue-400 select-all block mt-2 font-mono font-bold">{"<!-- GOAL_SCENARIO_TEMPLATE_START -->"}</span>
                <span className="text-slate-500 block my-1">... (inside loops) ...</span>
                <span className="text-blue-400 select-all block font-mono font-bold">{"<!-- GOAL_SCENARIO_TEMPLATE_END -->"}</span>
                <div className="mt-3 space-y-2">
                  {renderPlaceholderButton('Goal/Scenario Index', '{{goal_scenario_index}}')}
                  {renderPlaceholderButton('Goal/Scenario Title', '{{goal_scenario_title}}')}
                  {renderPlaceholderButton('Goal/Scenario Details', '{{goal_scenario_description}}')}
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">Metrics Stats</span>
              {renderPlaceholderButton('Critical Count', '{{count_critical}}')}
              {renderPlaceholderButton('High Count', '{{count_high}}')}
              {renderPlaceholderButton('Medium Count', '{{count_medium}}')}
              {renderPlaceholderButton('Low Count', '{{count_low}}')}
              {renderPlaceholderButton('Info Count', '{{count_info}}')}
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-3 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">Vulnerabilities</span>
              {renderPlaceholderButton('Findings List Container', '{{findings_list}}')}
              <div className="mt-3 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700/50 rounded-lg leading-relaxed">
                <span className="text-[#FF4D6D] font-bold uppercase block mb-1.5">LOOP TAG BLOCK:</span>
                Wrap findings placeholders between these HTML comments:
                <span className="text-blue-400 select-all block mt-2 select-all font-mono font-bold">{"<!-- FINDING_TEMPLATE_START -->"}</span>
                <span className="text-slate-500 block my-1">... (inside loops) ...</span>
                <span className="text-blue-400 select-all block font-mono font-bold">{"<!-- FINDING_TEMPLATE_END -->"}</span>
                <div className="mt-3 space-y-2">
                  {renderPlaceholderButton('Finding Title', '{{finding_title}}')}
                  {renderPlaceholderButton('Severity Label', '{{finding_severity}}')}
                  {renderPlaceholderButton('Severity Color Class', '{{finding_severity_class}}')}
                  {renderPlaceholderButton('CVSS Score', '{{finding_cvss}}')}
                  {renderPlaceholderButton('CVSS Vector', '{{finding_vector}}')}
                  {renderPlaceholderButton('CVSS Vector URL', '{{finding_vector_url}}')}
                  {renderPlaceholderButton('Category', '{{finding_category}}')}
                  {renderPlaceholderButton('Status', '{{finding_status}}')}
                  {renderPlaceholderButton('Description', '{{finding_description}}')}
                  {renderPlaceholderButton('Proof of Concept', '{{finding_poc}}')}
                  {renderPlaceholderButton('Remediation', '{{finding_remediation}}')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drag Handle 1 */}
        <div 
          className="w-1.5 bg-slate-250 dark:bg-slate-950 hover:bg-blue-400 active:bg-blue-400 cursor-col-resize transition-colors flex items-center justify-center z-10"
          onMouseDown={startDrag1}
        >
          <div className="w-0.5 h-8 bg-white/20 rounded-full"></div>
        </div>

        {/* Column 2: HTML Editor */}
        <div 
          style={{ width: `${col2Width}%`, flexShrink: 0 }}
          className="bg-slate-950 flex flex-col h-full border-r border-slate-200 dark:border-slate-700/50 relative"
        >
          {/* Find & Replace Bar */}
          {showFindReplace && (
            <div className="absolute top-0 left-0 right-0 z-20 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/50 p-3 shadow-lg flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Find..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-md px-2.5 py-1 text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
                  autoFocus
                />
                <span className="text-xs text-slate-500 min-w-[50px] text-center">
                  {searchQuery ? `${displayMatchNum}/${matches.length}` : ''}
                </span>
                <button onClick={handleFindPrev} disabled={!searchQuery} className="p-1 hover:bg-white/10 rounded disabled:opacity-50 text-slate-350 dark:text-slate-300">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={handleFindNext} disabled={!searchQuery} className="p-1 hover:bg-white/10 rounded disabled:opacity-50 text-slate-350 dark:text-slate-300">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => setShowFindReplace(false)} className="p-1 hover:bg-white/10 rounded ml-2 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-md px-2.5 py-1 text-sm text-slate-850 dark:text-slate-100 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
                />
                <button 
                  onClick={handleReplace} 
                  disabled={!searchQuery}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-750 dark:text-slate-300 disabled:opacity-50 transition-colors"
                >
                  Replace
                </button>
                <button 
                  onClick={handleReplaceAll} 
                  disabled={!searchQuery}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-750 dark:text-slate-300 disabled:opacity-50 transition-colors"
                >
                  All
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={templateCode}
            onChange={(e) => setTemplateCode(e.target.value)}
            onBlur={handleFieldBlur}
            className="flex-1 w-full bg-slate-955 dark:bg-slate-950 text-slate-300 font-mono text-sm p-5 focus:outline-none resize-none leading-relaxed"
            placeholder="<html>...</html>"
            spellCheck="false"
          />
        </div>

        {/* Drag Handle 2 */}
        <div 
          className="w-1.5 bg-slate-250 dark:bg-slate-950 hover:bg-blue-400 active:bg-blue-400 cursor-col-resize transition-colors flex items-center justify-center z-10"
          onMouseDown={startDrag2}
        >
          <div className="w-0.5 h-8 bg-white/20 rounded-full"></div>
        </div>

        {/* Column 3: Live Preview */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-955 flex flex-col relative overflow-hidden">
          
          {/* Zoom & Page Controls Overlay */}
          <div className="absolute top-4 right-6 z-20 flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-300 dark:border-slate-700/50 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => {
                setZoomMode('custom');
                setCustomZoom(prev => Math.max(25, prev - 10));
              }}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="px-2 min-w-[60px] text-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{Math.round(calculatedZoom * 100)}%</span>
            </div>
            <button
              onClick={() => {
                setZoomMode('custom');
                setCustomZoom(prev => Math.min(300, prev + 10));
              }}
              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700/50 mx-1"></div>
            <button
              onClick={handleFitHeightToggle}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${zoomMode === 'height' ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
              title="Fit to Height"
            >
              Fit
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-300 dark:border-slate-700/50 rounded-full px-4 py-2 shadow-2xl">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full disabled:opacity-30 text-slate-850 dark:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-850 dark:text-white tracking-wider">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full disabled:opacity-30 text-slate-850 dark:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Warning Banner */}
          <div className="absolute top-0 left-0 right-0 bg-[#FFB020]/10 border-b border-[#FFB020]/20 text-[#FFB020] text-[10px] px-4 py-1.5 flex items-center justify-center gap-2 z-10 font-bold tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Click elements in the preview to select their code in the editor</span>
          </div>

          {/* Preview Container */}
          <div 
            ref={previewContainerRef}
            className="flex-1 overflow-y-auto w-full pt-10 pb-8 px-4 flex flex-col items-center no-scrollbar"
            onScroll={handleScroll}
          >
            <div 
              className="bg-white shadow-[0_0_30px_rgba(0,0,0,0.5)] origin-top flex-shrink-0 relative group"
              style={{ 
                width: `${A4_BASE_WIDTH}px`, 
                height: `${A4_BASE_HEIGHT * totalPages}px`,
                transform: `scale(${calculatedZoom})`
              }}
            >
              <iframe
                ref={shadowContainerRef}
                className="w-full h-full border-none bg-white absolute inset-0 z-10"
                title="Template Preview"
                scrolling="no"
                style={{ 
                  cursor: 'crosshair',
                  overflow: 'hidden',
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
