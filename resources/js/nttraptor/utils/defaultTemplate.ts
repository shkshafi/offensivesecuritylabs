export const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<!-- TEMPLATE_VERSION: 1.29 -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Assessment Report Template</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Brand Color System applied precisely */
      --navy:         #070F26; /* Black Pearl - Deep Primary */
      --navy-mid:     #0d193b; /* Mid Deep Pearl */
      --navy-light:   #142554; /* Light Accent Pearl */
      --accent:       #0072BB; /* Lochmara - Vivid Brand Accent */
      --accent-dim:   #00558c; /* Lochmara Shadow */
      --text:         #070F26; /* High Contrast Primary Text */
      --text-light:   #4e5d78; /* Secondary Text Tone */
      --border:       #BAD2EE; /* Spindle - Light Structural Borders */
      --bg:           #FFFFFF; 
      --bg-alt:       #F3F7FC; /* Tinted Spindle Neutral Contrast */
      
      /* Risk Severity Palette */
      --critical:     #6E0C1A;
      --high:         #CC2936;
      --medium:       #D4700A;
      --low:          #2B7A0B;
      --info:         #0072BB; /* Unified with Brand Accent */
    }

    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    body {
      font-family: 'IBM Plex Sans', sans-serif;
      background: #E8EDF2;
      color: var(--text);
      font-size: 13px;
      line-height: 1.65;
    }

    /* Automatic Page Numbering */
    body {
      counter-reset: page 1;
    }
    .page {
      counter-increment: page;
    }
    .page-num::after {
      content: "";
    }

    /* ══════════════════════════════════
        PAGE LAYOUT
       ══════════════════════════════════ */
    .report-wrapper {
      margin-top: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .page {
      width: 800px;
      min-height: 1130px;
      height: 1130px;
      background: white;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    /* ══════════════════════════════════
        REPORT BODY (continuous flow before reflow)
       ══════════════════════════════════ */
    .report-body {
      width: 800px;
      background: white;
      padding: 36px 48px 80px;
    }

    /* Mark elements that force a page break before them */
    .page-break-before {
      /* Handled by reflow script */
    }

    /* ══════════════════════════════════
        COVER PAGE
       ══════════════════════════════════ */
    .cover-page {
      background: #000000;
      display: flex;
      flex-direction: column;
      color: #FFFFFF;
      position: relative;
    }

    .cover-bg-pattern {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
    }

    .cover-bg-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .cover-inner {
      flex: 1;
      padding: 56px 60px 40px 110px;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 2;
    }

    .cover-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 90px;
      z-index: 2;
    }
    .cover-logo-img {
      height: 52px;
      width: auto;
      max-width: 180px;
      display: block;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }
    .cover-confidential {
      background: #1E70F0;
      color: white;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 6px 16px;
      border-radius: 4px;
    }

    .cover-eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #3B82F6;
      margin-bottom: 12px;
    }
    .cover-eyebrow-rule {
      display: none;
    }
    .cover-h1 {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.1;
      color: #FFFFFF;
      margin-bottom: 20px;
      letter-spacing: -1px;
    }
    .cover-h1 span { color: #1E70F0; }
    .cover-sub {
      font-size: 18px;
      font-weight: 500;
      color: #94A3B8;
      margin-bottom: auto; /* allows push */
    }

    .cover-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px 48px;
      margin-top: 40px;
      margin-bottom: 40px;
      z-index: 2;
    }
    .cover-meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cover-meta-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(30, 112, 240, 0.15);
      color: #3B82F6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cover-meta-divider {
      width: 1px;
      height: 34px;
      background: rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
    }
    .cover-meta-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .cover-meta-item label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #94A3B8;
      margin: 0;
    }
    .cover-meta-item span {
      font-size: 13px;
      color: #FFFFFF;
      font-weight: 600;
    }

    .cover-footer-lock {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .cover-footer {
      background: var(--navy);
      padding: 18px 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
    }
    .cover-footer-text {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: white;
      opacity: 0.9;
    }

    /* ══════════════════════════════════
        INNER PAGE CHROME
       ══════════════════════════════════ */
    .doc-header {
      padding: 18px 48px 14px;
      border-bottom: 2px solid var(--navy);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-header-left {
      font-size: 11px; font-weight: 600;
      letter-spacing: 0.6px;
      color: var(--navy);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-logo-img {
      height: 28px;
      width: auto;
    }
    .doc-header-right {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px; color: var(--text-light);
    }

    .doc-footer {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 12px 48px;
      border-top: 1px solid var(--border);
      background: var(--bg-alt);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-footer-text {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px; color: var(--text-light);
    }
    .confid-stamp {
      font-size: 9px; font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--accent);
      border: 1px solid var(--accent);
      padding: 2px 7px; border-radius: 2px;
    }

    /* ══════════════════════════════════
        CONTENT
       ══════════════════════════════════ */
    .page-content { padding: 36px 48px 44px; }

    .sec-title {
      font-size: 22px; font-weight: 700;
      color: var(--navy);
      padding-bottom: 10px;
      border-bottom: 2px solid var(--navy);
      margin-bottom: 24px;
    }

    .sec-sub {
      font-size: 15px; font-weight: 600;
      color: var(--navy);
      margin: 28px 0 12px;
      padding-left: 10px;
      border-left: 3px solid var(--accent);
    }

    .sec-h3 {
      font-size: 12.5px; font-weight: 700;
      color: var(--text);
      letter-spacing: 0.8px;
      margin: 22px 0 8px;
    }

    p { color: var(--text); margin-bottom: 10px; line-height: 1.7; }

    .ph {
      color: var(--text-light);
      font-style: italic;
      background: var(--bg-alt);
      padding: 11px 15px;
      border-left: 3px solid var(--border);
      border-radius: 0 3px 3px 0;
      font-size: 12px;
      margin-bottom: 12px;
    }

    /* ══════════════════════════════════
        RISK BADGES
       ══════════════════════════════════ */
    .rb {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 2px;
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.5px;
      color: white;
    }
    .rb-c, .rb-critical { background: var(--critical); }
    .rb-h, .rb-high { background: var(--high); }
    .rb-m, .rb-medium { background: var(--medium); }
    .rb-l, .rb-low { background: var(--low); }
    .rb-i, .rb-info { background: var(--info); }

    /* ══════════════════════════════════
        RISK SUMMARY BOXES
       ══════════════════════════════════ */
    .risk-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin: 20px 0 24px;
    }
    .risk-card {
      text-align: center;
      padding: 18px 6px 14px;
      border-radius: 4px;
      color: white;
    }
    .risk-card .rc-num { font-size: 36px; font-weight: 700; line-height: 1; }
    .risk-card .rc-lbl { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; margin-top: 4px; opacity: 0.85; }
    .risk-card.c, .risk-card.critical { background: var(--critical); }
    .risk-card.h, .risk-card.high { background: var(--high); }
    .risk-card.m, .risk-card.medium { background: var(--medium); }
    .risk-card.l, .risk-card.low { background: var(--low); }
    .risk-card.i, .risk-card.info { background: var(--info); }

    /* ══════════════════════════════════
        TABLES
       ══════════════════════════════════ */
    .rt {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
    }
    .rt th {
      background: var(--navy);
      color: white;
      padding: 9px 12px;
      text-align: left;
      font-size: 10px; font-weight: 600;
      letter-spacing: 0.6px;
    }
    .rt td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }
    .rt tr:nth-child(even) td { background: var(--bg-alt); }
    .rt tr:hover td { background: var(--bg-alt); filter: brightness(0.95); }
    .rt td.mid { font-weight: 500; width: 180px; }

    .fid { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-light); }

    /* ══════════════════════════════════
        TOC
       ══════════════════════════════════ */
    .toc-row {
      display: flex;
      align-items: baseline;
      padding: 5px 0;
      border-bottom: 1px dotted var(--border);
      text-decoration: none !important;
      color: inherit;
      cursor: pointer;
    }
    a.toc-row,
    a.toc-row:link,
    a.toc-row:visited,
    a.toc-row:hover,
    a.toc-row:active,
    a.toc-row:focus {
      text-decoration: none !important;
      color: inherit !important;
      border-bottom: 1px dotted var(--border);
    }
    a.toc-row * { text-decoration: none !important; }
    a.toc-row:hover .toc-lbl { color: var(--primary) !important; }
    @media print {
      a.toc-row,
      a.toc-row:link,
      a.toc-row:visited,
      a.toc-row:hover {
        text-decoration: none !important;
        color: inherit !important;
        border-bottom: 1px dotted var(--border) !important;
      }
      a.toc-row .toc-lbl { color: var(--text) !important; }
      a.toc-row .toc-num,
      a.toc-row .toc-pg { color: var(--text-light) !important; }
    }
    .toc-num  { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-light); min-width: 42px; }
    .toc-lbl  { flex: 1; font-size: 12.5px; color: var(--text); padding: 0 8px; }
    .toc-pg   { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--text-light); text-align: right; }
    .toc-row.h1 .toc-lbl { font-weight: 600; font-size: 13px; }
    .toc-row.h2 { padding-left: 18px; }
    .toc-row.h3 { padding-left: 36px; }
    .toc-row.h3 .toc-lbl { font-size: 11.5px; color: var(--text-light); }
    .toc-row.h4 { padding-left: 54px; }
    .toc-row.h4 .toc-lbl { font-size: 11.0px; color: var(--text-light); font-style: italic; }

    /* ══════════════════════════════════
        FINDING BLOCK
       ══════════════════════════════════ */
    .finding-block {
      border: 1px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
      margin: 20px 0;
    }
    .fb-head {
      background: var(--navy);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }
    .fb-head-left { display: flex; align-items: center; gap: 10px; }
    .fb-id { font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.5; }
    .fb-title { font-size: 13px; font-weight: 600; }
    .fb-body { padding: 18px 20px; }
    .fb-meta {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      width: 100%;
      gap: 14px;
      padding-bottom: 14px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .fb-meta-item label {
      font-size: 9px; font-weight: 700;
      letter-spacing: 1.5px;
      color: var(--text-light); display: block; margin-bottom: 3px;
    }
    .fb-meta-item span { font-size: 12px; font-weight: 500; }
    .fb-section { margin-bottom: 14px; }
    .fb-section-lbl {
      font-size: 10px; font-weight: 700;
      letter-spacing: 1px;
      color: var(--text-light); margin-bottom: 5px;
    }
    .poc-box {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      background: var(--bg-alt);
      border: 1px solid var(--border);
      padding: 12px;
      border-radius: 3px;
      overflow-x: auto;
    }

    /* ══════════════════════════════════
        ALERT BOXES
       ══════════════════════════════════ */
    .alert {
      padding: 11px 15px;
      border-radius: 3px;
      font-size: 12px;
      margin-bottom: 14px;
    }
    .alert-info { background: #EAF2FC; border-left: 3px solid var(--info); color: #1A3E6E; }
    .alert-warn { background: #FEF7EC; border-left: 3px solid var(--medium); color: #6B3A0A; }

    /* ══════════════════════════════════
        PRINT / PDF
       ══════════════════════════════════ */
    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: white !important; margin: 0 !important; padding: 0 !important; }
      .report-wrapper { margin-top: 0 !important; padding: 0 !important; gap: 0 !important; width: 800px !important; }
      .page {
        width: 800px !important;
        height: 1130px !important;
        min-height: 1130px !important;
        max-height: 1130px !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        position: relative !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        border: none !important;
      }
      .page:last-child { page-break-after: avoid !important; break-after: avoid !important; }
      .doc-footer { position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; }
      .cover-page {
        height: 1130px !important;
        min-height: 1130px !important;
        max-height: 1130px !important;
      }
      .cover-page:not(#end-of-report-page) { background: #000000 !important; color: #FFFFFF !important; }
      #end-of-report-page { background: var(--navy) !important; color: #FFFFFF !important; }
      .cover-inner { background: transparent !important; }
      .cover-footer { background-color: #070F26 !important; }
      .cover-footer-bar { display: none !important; }
      .finding-block, pre, table, .poc-box, .risk-row, .alert {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      h1, h2, h3, h4, h5, .sec-title, .sec-sub, .sec-h3 {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
    }
  </style>
</head>
<body>

<div class="report-wrapper">

  <div class="page cover-page">
    <div class="cover-bg-pattern">
      <svg class="cover-bg-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="stripeGrad1" x1="0" y1="0.8" x2="1" y2="0.2">
            <stop offset="0%" stop-color="#1E70F0" />
            <stop offset="100%" stop-color="#050E24" />
          </linearGradient>
          <linearGradient id="stripeGrad2" x1="0" y1="0.8" x2="1" y2="0.2">
            <stop offset="0%" stop-color="#1E70F0" />
            <stop offset="100%" stop-color="#0052D4" />
          </linearGradient>
          <linearGradient id="stripeGrad3" x1="0" y1="0.8" x2="1" y2="0.2">
            <stop offset="0%" stop-color="#0052D4" />
            <stop offset="100%" stop-color="#1E70F0" />
          </linearGradient>
          <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
        </defs>

        <!-- Pure Black Background -->
        <rect width="800" height="1130" fill="#000000" />

        <!-- Vertical accent bar -->
        <rect x="80" y="380" width="6" height="36" fill="#1E70F0" rx="3" />

        <!-- 4x5 grid of dots -->
        <g fill="rgba(255, 255, 255, 0.15)">
          <circle cx="80" cy="540" r="2" />
          <circle cx="95" cy="540" r="2" />
          <circle cx="110" cy="540" r="2" />
          <circle cx="125" cy="540" r="2" />

          <circle cx="80" cy="555" r="2" />
          <circle cx="95" cy="555" r="2" />
          <circle cx="110" cy="555" r="2" />
          <circle cx="125" cy="555" r="2" />

          <circle cx="80" cy="570" r="2" />
          <circle cx="95" cy="570" r="2" />
          <circle cx="110" cy="570" r="2" />
          <circle cx="125" cy="570" r="2" />

          <circle cx="80" cy="585" r="2" />
          <circle cx="95" cy="585" r="2" />
          <circle cx="110" cy="585" r="2" />
          <circle cx="125" cy="585" r="2" />

          <circle cx="80" cy="600" r="2" />
          <circle cx="95" cy="600" r="2" />
          <circle cx="110" cy="600" r="2" />
          <circle cx="125" cy="600" r="2" />
        </g>

        <!-- Slanted Stripes -->
        <!-- Top Stripe -->
        <polygon points="390,550 800,315 800,465 390,700" fill="url(#stripeGrad1)" />
        <circle cx="750" cy="410" r="80" fill="#000000" filter="url(#blurFilter)" opacity="0.9" />

        <!-- Middle Stripe -->
        <polygon points="390,725 800,490 800,640 390,875" fill="url(#stripeGrad2)" />

        <!-- Bottom Stripe -->
        <polygon points="80,1078 800,665 800,865 80,1278" fill="url(#stripeGrad3)" />
        <circle cx="450" cy="965" r="90" fill="#000000" filter="url(#blurFilter)" opacity="0.9" />
      </svg>
    </div>
    <div class="cover-inner">
      <div class="cover-topbar">
        <img class="cover-logo-img" src="/images/ntt-logo.png" alt="Company Logo">
        <div class="cover-confidential">{{status}}</div>
      </div>
      <div class="cover-eyebrow">SIMULATED ATTACK ASSESSMENT</div>
      <div class="cover-eyebrow-rule"></div>
      <div class="cover-h1">Red Team<br>Assessment<br><span>Report</span></div>
      <div class="cover-sub">{{title}}</div>
      <div class="cover-meta">
        <!-- Client -->
        <div class="cover-meta-item">
          <div class="cover-meta-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <line x1="9" y1="22" x2="9" y2="16"></line>
              <line x1="15" y1="22" x2="15" y2="16"></line>
              <line x1="9" y1="16" x2="15" y2="16"></line>
              <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"></path>
            </svg>
          </div>
          <div class="cover-meta-divider"></div>
          <div class="cover-meta-text">
            <label>CLIENT</label>
            <span>{{client}}</span>
          </div>
        </div>

        <!-- Version -->
        <div class="cover-meta-item">
          <div class="cover-meta-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div class="cover-meta-divider"></div>
          <div class="cover-meta-text">
            <label>VERSION</label>
            <span>{{version}}</span>
          </div>
        </div>

        <!-- Assessment Period -->
        <div class="cover-meta-item">
          <div class="cover-meta-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
            </svg>
          </div>
          <div class="cover-meta-divider"></div>
          <div class="cover-meta-text">
            <label>ASSESSMENT PERIOD</label>
            <span>{{date}}</span>
          </div>
        </div>

        <!-- Report Date -->
        <div class="cover-meta-item">
          <div class="cover-meta-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
            </svg>
          </div>
          <div class="cover-meta-divider"></div>
          <div class="cover-meta-text">
            <label>REPORT DATE</label>
            <span>{{report_date}}</span>
          </div>
        </div>

        <!-- Classification -->
        <div class="cover-meta-item">
          <div class="cover-meta-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <rect x="10" y="11" width="4" height="4" rx="1"></rect>
              <path d="M11 11V9.5a1 1 0 0 1 2 0V11"></path>
            </svg>
          </div>
          <div class="cover-meta-divider"></div>
          <div class="cover-meta-text">
            <label>CLASSIFICATION</label>
            <span>{{classification}}</span>
          </div>
        </div>

        <!-- Prepared By -->
        <div class="cover-meta-item">
          <div class="cover-meta-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="cover-meta-divider"></div>
          <div class="cover-meta-text">
            <label>PREPARED BY</label>
            <span>{{author}}</span>
          </div>
        </div>
      </div>
    </div>
    </div>

  <!-- ═══════ CONTINUOUS REPORT BODY (will be reflowed into pages) ═══════ -->
  <div class="report-body">

    <!-- Table of Contents -->
    <div class="sec-title page-break-before" id="table-of-contents" data-header-right="Table of Contents">Table of Contents</div>
    {{table_of_contents}}

    {{custom_after_table_of_contents}}

    <!-- Executive Summary -->
    <div class="sec-title page-break-before" id="executive-summary" data-header-right="{{num_executive_summary}} – Executive Summary">{{num_executive_summary}} &nbsp; Executive Summary</div>

    <div class="sec-sub">{{num_executive_summary_overview}} &nbsp; Overview</div>
    <p>{{executive_summary}}</p>

    <table class="rt" style="margin-bottom:24px;">
      <tr><th colspan="2">Engagement Details</th></tr>
      <tr><td class="mid">Client Organisation</td><td>{{client}}</td></tr>
      <tr><td class="mid">Engagement Type</td><td>Red Team / Simulated Attack Assessment</td></tr>
      <tr><td class="mid">Assessment Period</td><td>{{date}}</td></tr>
      <tr><td class="mid">Report Date</td><td>{{report_date}}</td></tr>
      <tr><td class="mid">Report Version</td><td>{{version}}</td></tr>
      <tr><td class="mid">Classification</td><td><span class="confid-stamp">{{classification}}</span></td></tr>
    </table>

    <div class="sec-sub">{{num_executive_summary_assessment}} &nbsp; Assessment Summary</div>
    <div class="risk-row">
      <div class="risk-card critical"><div class="rc-num">{{count_critical}}</div><div class="rc-lbl">CRITICAL</div></div>
      <div class="risk-card high"><div class="rc-num">{{count_high}}</div><div class="rc-lbl">HIGH</div></div>
      <div class="risk-card medium"><div class="rc-num">{{count_medium}}</div><div class="rc-lbl">MEDIUM</div></div>
      <div class="risk-card low"><div class="rc-num">{{count_low}}</div><div class="rc-lbl">LOW</div></div>
      <div class="risk-card info"><div class="rc-num">{{count_info}}</div><div class="rc-lbl">INFO</div></div>
    </div>

    <div class="sec-sub">{{num_executive_summary_recommendations}} &nbsp; Strategic Recommendations</div>
    <p>{{strategic_recommendations}}</p>

    {{custom_after_executive_summary}}

    <!-- Using This Report + Document Control (flow together) -->
    <div class="sec-title page-break-before" id="using-this-report" data-header-right="{{num_using_this_report}} – Using This Report">{{num_using_this_report}} &nbsp; Using This Report</div>
    <div class="alert alert-warn"><strong>Classification Notice:</strong> This report is classified as <em>{{classification}}</em> and must only be distributed to authorized personnel. Unauthorized disclosure may expose sensitive security data.</div>
    <p>{{using_this_report}}</p>

    <div class="sec-title" id="document-control" style="margin-top:40px;">{{num_document_control}} &nbsp; Document Control</div>
    <div class="sec-h3">VERSION HISTORY</div>
    <table class="rt">
      <thead>
        <tr><th>VERSION</th><th>DATE</th><th>AUTHOR</th><th>DESCRIPTION</th></tr>
      </thead>
      <tbody>
        {{version_history_rows}}
      </tbody>
    </table>

    <div class="sec-h3">DISTRIBUTION LIST</div>
    <table class="rt">
      <thead>
        <tr><th>NAME</th><th>TITLE / ROLE</th><th>ORGANISATION</th><th>COPY NO.</th></tr>
      </thead>
      <tbody>
        {{distribution_list_rows}}
      </tbody>
    </table>

    {{custom_after_document_control}}

    <!-- Technical Summary -->
    <div class="sec-title page-break-before" id="technical-summary" data-header-right="{{num_technical_summary}} – Technical Summary">{{num_technical_summary}} &nbsp; Technical Summary</div>

    <div class="sec-sub" id="scope">{{num_scope}} &nbsp; Scope</div>
    <p>{{scope}}</p>

    <div class="sec-sub" id="caveats">{{num_caveats}} &nbsp; Caveats</div>
    <p>{{caveats}}</p>

    <div class="sec-sub" id="cleanup">{{num_cleanup}} &nbsp; Post Assessment Cleanup</div>
    <p>{{cleanup}}</p>

    <div class="sec-sub" id="risk-ratings">{{num_risk_ratings}} &nbsp; Risk Ratings</div>
    <table class="rt" style="margin-top:14px;">
      <tr><th style="width:90px;">RATING</th><th>DESCRIPTION</th><th style="width:110px;">CVSSv3.1 RANGE</th></tr>
      <tr>
        <td><span class="rb rb-critical">CRITICAL</span></td>
        <td>Exploitation results in full system or domain compromise. Requires immediate action.</td>
        <td>9.0 – 10.0</td>
      </tr>
      <tr>
        <td><span class="rb rb-high">HIGH</span></td>
        <td>Significant security risk that could lead to major exposure. Prioritize for rapid remediation.</td>
        <td>7.0 – 8.9</td>
      </tr>
      <tr>
        <td><span class="rb rb-medium">MEDIUM</span></td>
        <td>Moderate risk that could contribute to compromise chains. Plan within normal cycles.</td>
        <td>4.0 – 6.9</td>
      </tr>
      <tr>
        <td><span class="rb rb-low">LOW</span></td>
        <td>Limited direct risk. Best practice improvements.</td>
        <td>0.1 – 3.9</td>
      </tr>
      <tr>
        <td><span class="rb rb-info">INFO</span></td>
        <td>Informational observations with no direct exploitable risk. awareness only.</td>
        <td>N/A</td>
      </tr>
    </table>

    <div class="sec-sub" id="findings-overview">{{num_findings_overview}} &nbsp; Findings Overview</div>
    <table class="rt">
      <thead>
        <tr>
          <th>ID</th>
          <th>TITLE</th>
          <th>SEVERITY</th>
          <th>CVSS</th>
          <th>STATUS</th>
        </tr>
      </thead>
      <tbody>
        {{findings_overview_rows}}
      </tbody>
    </table>

    {{custom_after_technical_summary}}

    <!-- Section 2: Technical Details -->
    <div class="sec-title page-break-before" id="technical-details" data-header-right="{{num_technical_details}} – Technical Details">{{num_technical_details}} &nbsp; Technical Details</div>
    <div class="sec-sub" id="detailed-findings">{{num_detailed_findings}} &nbsp; Detailed Findings</div>
    <p>This section details the vulnerabilities and configuration issues identified during the assessment, grouped by execution scenarios.</p>

    {{detailed_findings_grouped}}

    {{custom_after_technical_details}}

    <!-- Section 3: Supplemental Data -->
    <div class="sec-title page-break-before" id="supplemental-data" data-header-right="{{num_supplemental_data}} – Supplemental Data">{{num_supplemental_data}} &nbsp; Supplemental Data</div>
    
    {{supplemental_data_sections}}

    {{custom_after_supplemental_data}}

    <!-- Section 4: Appendices -->
    <div class="sec-title page-break-before" id="appendices" data-header-right="{{num_appendices}} – Appendices">{{num_appendices}} &nbsp; Appendices</div>
    
    <div class="sec-sub" id="tailored-methodologies">{{num_tailored_methodologies}} &nbsp; Tailored Methodologies</div>
    <div class="sec-h3" id="red-teaming-assessment">{{num_tailored_methodologies}}.1 &nbsp; RED-TEAMING/SIMULATED ATTACK ASSESSMENT</div>
    
    <div class="sec-h3" style="font-weight: 700; font-size: 13.5px; color: var(--navy); margin-top: 16px; margin-bottom: 6px;">KEY INFORMATION</div>
    <p>{{appendices_key_info}}</p>
    
    <div class="sec-h3" style="font-weight: 700; font-size: 13.5px; color: var(--navy); margin-top: 16px; margin-bottom: 6px;">TEST HIGHLIGHTS</div>
    <p>{{appendices_test_highlights}}</p>
    
    <div class="sec-h3" style="font-weight: 700; font-size: 13.5px; color: var(--navy); margin-top: 16px; margin-bottom: 6px;">MORE DETAILS</div>
    <p>{{appendices_more_details}}</p>
    
    <div class="sec-h3" style="font-weight: 700; font-size: 13.5px; color: var(--navy); margin-top: 16px; margin-bottom: 6px;">DETAILED METHODOLOGY</div>
    <p>{{appendices_detailed_methodology}}</p>
    
    <div class="sec-sub" id="assessment-team" style="margin-top: 30px;">{{num_assessment_team}} &nbsp; Assessment Team</div>
    <table class="rt">
      <thead>
        <tr>
          <th>NAME</th>
          <th>TITLE / ROLE</th>
          <th>ORGANISATION</th>
        </tr>
      </thead>
      <tbody>
        {{appendices_team_rows}}
      </tbody>
    </table>

    {{custom_after_appendices}}

  </div>

  <div class="page cover-page" id="end-of-report-page" style="background: var(--navy); display: flex; flex-direction: column; position: relative;">
    <div class="cover-inner" style="display: flex; flex-direction: column; justify-content: center; align-items: center; flex: 1; padding: 56px 60px 40px;">
      <div style="text-align: center;">
        <div class="cover-rule" style="margin: 0 auto 24px;"></div>
        <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 500; letter-spacing: 4px; color: white; margin-bottom: 12px;">— END OF REPORT —</div>
        
      </div>
    </div>
  </div>

</div>

<!-- Page chrome prototype (hidden, used by reflow script) -->
<template id="page-header-proto">
  <div class="doc-header">
    <div class="doc-header-left">
      <img class="header-logo-img" src="/images/ntt-logo.png" alt="Logo">
    </div>
    <div class="doc-header-right"></div>
  </div>
</template>
<template id="page-footer-proto">
  <div class="doc-footer">
    <div class="doc-footer-text">Version {{version}}</div>
    <div class="confid-stamp">{{classification}}</div>
    <div class="doc-footer-text"><span class="page-num"></span></div>
  </div>
</template>

<!-- REFLOW_SCRIPT_START -->
<script>
(function() {
  var PAGE_HEIGHT = 1130;
  var HEADER_HEIGHT = 54;
  var FOOTER_HEIGHT = 42;
  var MAX_SCROLL_HEIGHT = PAGE_HEIGHT - HEADER_HEIGHT;

  function getHeaderHtml(headerRightText) {
    var tmpl = document.getElementById('page-header-proto');
    if (!tmpl) return '';
    var clone = tmpl.content ? tmpl.content.cloneNode(true) : tmpl.cloneNode(true);
    var div = document.createElement('div');
    div.appendChild(clone);
    var rightEl = div.querySelector('.doc-header-right');
    if (rightEl && headerRightText) {
      rightEl.textContent = headerRightText;
    }
    return div.innerHTML;
  }

  function getFooterHtml() {
    var tmpl = document.getElementById('page-footer-proto');
    if (!tmpl) return '';
    var clone = tmpl.content ? tmpl.content.cloneNode(true) : tmpl.cloneNode(true);
    var div = document.createElement('div');
    div.appendChild(clone);
    return div.innerHTML;
  }

  function createPage(headerRightText) {
    var page = document.createElement('div');
    page.className = 'page';
    page.innerHTML = getHeaderHtml(headerRightText) +
      '<div class="page-content" style="padding: 36px 48px 44px;"></div>' +
      getFooterHtml();
    return page;
  }

  function getPageContent(page) {
    return page.querySelector('.page-content');
  }

  function updateHeaderRight(page, text) {
    var el = page.querySelector('.doc-header-right');
    if (el && text) el.textContent = text;
  }

  // ─── Build a flat queue of renderable items from the report-body ───
  function buildQueue(bodyEl) {
    var children = Array.prototype.slice.call(bodyEl.children);
    var queue = [];

    children.forEach(function(child) {
      if (child.classList.contains('finding-block')) {
        // Decompose finding-block into granular items for per-piece pagination
        var fbHead = child.querySelector('.fb-head');
        var headHtml = fbHead ? fbHead.outerHTML : '';
        var fbMeta = child.querySelector('.fb-meta');
        var metaHtml = fbMeta ? fbMeta.outerHTML : '';
        var fbSections = child.querySelectorAll('.fb-section');

        queue.push({ type: 'finding-block-start', headHtml: headHtml, el: child });
        if (metaHtml) {
          queue.push({ type: 'finding-block-meta', metaHtml: metaHtml });
        }

        fbSections.forEach(function(section) {
          var lbl = section.querySelector('.fb-section-lbl');
          var lblHtml = lbl ? lbl.outerHTML : '';
          var sectionTitle = lbl ? lbl.textContent.trim() : '';

          queue.push({ type: 'finding-section-start', lblHtml: lblHtml, sectionTitle: sectionTitle });

          var sectionChildren = Array.prototype.slice.call(section.children);
          sectionChildren.forEach(function(secChild) {
            if (secChild.classList.contains('fb-section-lbl')) return;
            queue.push({ type: 'finding-section-child', childEl: secChild, sectionTitle: sectionTitle });
          });
        });

        queue.push({ type: 'finding-block-end' });
      } else {
        // Check for page-break-before
        var isPageBreak = child.classList.contains('page-break-before');
        var headerRight = child.getAttribute('data-header-right') || '';
        queue.push({ type: 'element', el: child, isPageBreak: isPageBreak, headerRight: headerRight });
      }
    });

    return queue;
  }

  function updateTocPageNumbers() {
    function getPageNumber(el) {
      var parent = el.parentElement;
      while (parent) {
        if (parent.classList.contains('page')) {
          var pages = Array.prototype.slice.call(parent.parentElement.querySelectorAll('.page'));
          return pages.indexOf(parent);
        }
        parent = parent.parentElement;
      }
      return null;
    }

    var tocRows = document.querySelectorAll('[data-toc-target]');
    tocRows.forEach(function(row) {
      var targetId = row.getAttribute('data-toc-target');
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        var pageNum = getPageNumber(targetEl);
        var pgSpan = row.querySelector('.toc-pg');
        if (pgSpan && pageNum) {
          pgSpan.textContent = pageNum;
        }
      }
    });
  }

  // ─── Main reflow: paginate flat content into A4 pages ───
  function reflowBody() {
    var reportBody = document.querySelector('.report-body');
    if (!reportBody) return;

    var wrapper = document.querySelector('.report-wrapper');
    if (!wrapper) return;

    var queue = buildQueue(reportBody);

    // Remove report-body from the wrapper immediately so new pages are attached to the active DOM
    if (reportBody.parentNode) {
      reportBody.parentNode.removeChild(reportBody);
    }

    // Current state
    var currentHeaderRight = 'Red Team Assessment Report';
    var currentPage = createPage(currentHeaderRight);
    wrapper.appendChild(currentPage);
    var currentContent = getPageContent(currentPage);
    var pages = [currentPage];
    var currentHeight = 0;

    // Finding block tracking
    var openFindingBlock = null;
    var openFbBody = null;
    var openSection = null;
    var originalHeaderHtml = '';
    var contHeadHtml = '';
    var findingId = '';
    var findingTitle = '';
    var findingSeverity = '';
    var isGoal = false;
    var isFirstPageOfFinding = true;

    function closeContainers() {
      openSection = null;
      openFbBody = null;
      openFindingBlock = null;
    }

    function newPage() {
      closeContainers();
      var page = createPage(currentHeaderRight);
      wrapper.appendChild(page);
      pages.push(page);
      currentPage = page;
      currentContent = getPageContent(page);
      currentHeight = 0;
      isFirstPageOfFinding = false;
    }

    function openFindingBlockOnCurrentPage() {
      if (openFindingBlock) return;

      var block = document.createElement('div');
      block.className = 'finding-block';
      if (isGoal) {
        block.style.borderColor = 'var(--border)';
      }

      var headerHtmlToUse = isFirstPageOfFinding ? originalHeaderHtml : contHeadHtml;
      block.innerHTML = headerHtmlToUse + '<div class="fb-body"></div>';
      currentContent.appendChild(block);

      openFindingBlock = block;
      openFbBody = block.querySelector('.fb-body');
    }

    // ─── Splitting helpers ───

    function splitParagraph(childEl, targetParent) {
      var pClone = childEl.cloneNode(false);
      var innerHtml = childEl.innerHTML;
      var hasHtmlContent = childEl.children.length > 0;

      if (hasHtmlContent) {
        targetParent.appendChild(childEl.cloneNode(true));
        currentHeight = currentContent.scrollHeight;
        if (currentHeight > MAX_SCROLL_HEIGHT) {
          var isPageEmpty = (currentContent.children.length === 1) ||
            (currentContent.children.length === 1 && currentContent.children[0] === (openFindingBlock || targetParent.lastChild));
          if (!isPageEmpty) {
            targetParent.removeChild(targetParent.lastChild);
            newPage();
            if (openFindingBlock) {
              openFindingBlockOnCurrentPage();
              if (openSection) {
                var sec = document.createElement('div');
                sec.className = 'fb-section';
                openFbBody.appendChild(sec);
                openSection = sec;
              }
            }
            targetParent = openSection || currentContent;
            targetParent.appendChild(childEl.cloneNode(true));
          }
        }
        return;
      }

      targetParent.appendChild(pClone);
      var words = (childEl.textContent || '').split(' ');
      var wordIndex = 0;
      var currentWords = [];

      while (wordIndex < words.length) {
        currentWords.push(words[wordIndex]);
        pClone.textContent = currentWords.join(' ');
        currentHeight = currentContent.scrollHeight;

        if (currentHeight > MAX_SCROLL_HEIGHT) {
          currentWords.pop();
          if (currentWords.length > 0) {
            pClone.textContent = currentWords.join(' ');
            newPage();
            if (openFindingBlock) openFindingBlockOnCurrentPage();
            pClone = childEl.cloneNode(false);
            (openSection || currentContent).appendChild(pClone);
            currentWords = [];
          } else {
            pClone.textContent = words[wordIndex];
            wordIndex++;
          }
        } else {
          wordIndex++;
        }
      }
    }

    function splitPreformatted(childEl, targetParent) {
      var pocClone = childEl.cloneNode(false);
      var textContent = childEl.textContent || '';
      var lines = textContent.split('\\n');

      targetParent.appendChild(pocClone);
      var currentLines = [];
      var lineIndex = 0;

      while (lineIndex < lines.length) {
        currentLines.push(lines[lineIndex]);
        pocClone.textContent = currentLines.join('\\n');
        currentHeight = currentContent.scrollHeight;

        if (currentHeight > MAX_SCROLL_HEIGHT) {
          currentLines.pop();
          if (currentLines.length > 0) {
            pocClone.textContent = currentLines.join('\\n');
            newPage();
            if (openFindingBlock) openFindingBlockOnCurrentPage();
            pocClone = childEl.cloneNode(false);
            (openSection || currentContent).appendChild(pocClone);
            currentLines = [];
          } else {
            pocClone.textContent = lines[lineIndex];
            lineIndex++;
          }
        } else {
          lineIndex++;
        }
      }
      if (pocClone.textContent.trim() === '' && pocClone.parentNode) {
        pocClone.parentNode.removeChild(pocClone);
      }
    }

    function splitList(childEl, targetParent) {
      var listClone = childEl.cloneNode(false);
      targetParent.appendChild(listClone);
      var lis = Array.prototype.slice.call(childEl.querySelectorAll('li'));
      var liIndex = 0;

      while (liIndex < lis.length) {
        var liClone = lis[liIndex].cloneNode(true);
        listClone.appendChild(liClone);
        currentHeight = currentContent.scrollHeight;

        if (currentHeight > MAX_SCROLL_HEIGHT) {
          var isPageEmpty = (currentContent.children.length === 1);
          if (isPageEmpty && listClone.children.length === 1) {
            liIndex++;
          } else {
            listClone.removeChild(liClone);
            newPage();
            if (openFindingBlock) openFindingBlockOnCurrentPage();
            listClone = childEl.cloneNode(false);
            (openSection || currentContent).appendChild(listClone);
          }
        } else {
          liIndex++;
        }
      }
    }

    function splitTable(childEl, targetParent) {
      var tableClone = childEl.cloneNode(false);
      targetParent.appendChild(tableClone);
      var rows = Array.prototype.slice.call(childEl.querySelectorAll('tr'));
      var hasHeader = rows.length > 0 && (rows[0].querySelector('th') !== null);
      var headerRow = hasHeader ? rows[0] : null;
      var bodyRows = hasHeader ? rows.slice(1) : rows;

      if (headerRow) {
        tableClone.appendChild(headerRow.cloneNode(true));
      }

      var rowIndex = 0;
      while (rowIndex < bodyRows.length) {
        var rowClone = bodyRows[rowIndex].cloneNode(true);
        tableClone.appendChild(rowClone);
        currentHeight = currentContent.scrollHeight;

        if (currentHeight > MAX_SCROLL_HEIGHT) {
          var expectedMinChildren = headerRow ? 2 : 1;
          var isPageEmpty = (currentContent.children.length === 1);
          if (isPageEmpty && tableClone.children.length === expectedMinChildren) {
            rowIndex++;
          } else {
            tableClone.removeChild(rowClone);
            newPage();
            if (openFindingBlock) openFindingBlockOnCurrentPage();
            tableClone = childEl.cloneNode(false);
            (openSection || currentContent).appendChild(tableClone);
            if (headerRow) {
              tableClone.appendChild(headerRow.cloneNode(true));
            }
          }
        } else {
          rowIndex++;
        }
      }
    }

    function splitElement(childEl, targetParent) {
      var tagName = childEl.tagName.toLowerCase();
      var isPreformatted = childEl.classList.contains('poc-box') || tagName === 'pre';
      var isList = tagName === 'ul' || tagName === 'ol';
      var isTable = tagName === 'table' || childEl.classList.contains('rt');
      var isParagraph = tagName === 'p';

      if (isPreformatted) {
        splitPreformatted(childEl, targetParent);
      } else if (isList) {
        splitList(childEl, targetParent);
      } else if (isTable) {
        splitTable(childEl, targetParent);
      } else if (isParagraph) {
        splitParagraph(childEl, targetParent);
      } else {
        targetParent.appendChild(childEl.cloneNode(true));
      }
    }

    // ─── Append a top-level element to the current page ───
    function appendElement(childEl) {
      currentContent.appendChild(childEl);
      currentHeight = currentContent.scrollHeight;

      if (currentHeight > MAX_SCROLL_HEIGHT) {
        var isPageEmpty = (currentContent.children.length === 1);
        if (!isPageEmpty) {
          currentContent.removeChild(childEl);
          newPage();
          appendElement(childEl);
          return;
        }
        // Single oversized element on empty page — split it
        currentContent.removeChild(childEl);
        splitElement(childEl, currentContent);
      }
    }

    // ─── Append a child inside a finding section ───
    function appendFindingChild(childEl, sectionTitle) {
      openFindingBlockOnCurrentPage();
      if (!openSection) {
        openSection = document.createElement('div');
        openSection.className = 'fb-section';
        openFbBody.appendChild(openSection);
      }

      openSection.appendChild(childEl);
      currentHeight = currentContent.scrollHeight;

      if (currentHeight > MAX_SCROLL_HEIGHT) {
        var isPageEmpty = false;
        if (currentContent.children.length === 1 && currentContent.children[0] === openFindingBlock) {
          if (openFbBody && openFbBody.children.length === 1 && openFbBody.children[0] === openSection) {
            if (openSection.children.length === 1 && openSection.children[0] === childEl) {
              isPageEmpty = true;
            } else if (openSection.children.length === 2 && openSection.children[1] === childEl) {
              isPageEmpty = true;
            }
          }
        }

        if (!isPageEmpty) {
          openSection.removeChild(childEl);
          newPage();
          appendFindingChild(childEl, sectionTitle);
          return;
        }

        // Split oversized element within finding section
        openSection.removeChild(childEl);
        splitFindingChild(childEl, sectionTitle);
      }
    }

    function splitFindingChild(childEl, sectionTitle) {
      var tagName = childEl.tagName.toLowerCase();
      var isPreformatted = childEl.classList.contains('poc-box') || tagName === 'pre';
      var isList = tagName === 'ul' || tagName === 'ol';
      var isTable = tagName === 'table' || childEl.classList.contains('rt');
      var isParagraph = tagName === 'p';

      // Helper to create continuation section on new page
      function makeContinuationSection() {
        newPage();
        openFindingBlockOnCurrentPage();
        openSection = document.createElement('div');
        openSection.className = 'fb-section';
        openSection.innerHTML = '<div class="fb-section-lbl">' + sectionTitle + ' (Continued)</div>';
        openFbBody.appendChild(openSection);
      }

      if (isPreformatted) {
        var pocClone = childEl.cloneNode(false);
        var textContent = childEl.textContent || '';
        var lines = textContent.split('\\n');

        openSection.appendChild(pocClone);
        var currentLines = [];
        var lineIndex = 0;

        while (lineIndex < lines.length) {
          currentLines.push(lines[lineIndex]);
          pocClone.textContent = currentLines.join('\\n');
          currentHeight = currentContent.scrollHeight;

          if (currentHeight > MAX_SCROLL_HEIGHT) {
            currentLines.pop();
            if (currentLines.length > 0) {
              pocClone.textContent = currentLines.join('\\n');
              makeContinuationSection();
              pocClone = childEl.cloneNode(false);
              openSection.appendChild(pocClone);
              currentLines = [];
            } else {
              pocClone.textContent = lines[lineIndex];
              lineIndex++;
            }
          } else {
            lineIndex++;
          }
        }
        if (pocClone.textContent.trim() === '') {
          openSection.removeChild(pocClone);
        }
      } else if (isList) {
        var listClone = childEl.cloneNode(false);
        openSection.appendChild(listClone);
        var lis = Array.prototype.slice.call(childEl.querySelectorAll('li'));
        var liIndex = 0;

        while (liIndex < lis.length) {
          var liClone = lis[liIndex].cloneNode(true);
          listClone.appendChild(liClone);
          currentHeight = currentContent.scrollHeight;

          if (currentHeight > MAX_SCROLL_HEIGHT) {
            if (listClone.children.length === 1) {
              liIndex++;
            } else {
              listClone.removeChild(liClone);
              makeContinuationSection();
              listClone = childEl.cloneNode(false);
              openSection.appendChild(listClone);
            }
          } else {
            liIndex++;
          }
        }
      } else if (isTable) {
        var tableClone = childEl.cloneNode(false);
        openSection.appendChild(tableClone);
        var rows = Array.prototype.slice.call(childEl.querySelectorAll('tr'));
        var hasHeader = rows.length > 0 && (rows[0].querySelector('th') !== null);
        var headerRow = hasHeader ? rows[0] : null;
        var bodyRows = hasHeader ? rows.slice(1) : rows;

        if (headerRow) tableClone.appendChild(headerRow.cloneNode(true));

        var rowIndex = 0;
        while (rowIndex < bodyRows.length) {
          var rowClone = bodyRows[rowIndex].cloneNode(true);
          tableClone.appendChild(rowClone);
          currentHeight = currentContent.scrollHeight;

          if (currentHeight > MAX_SCROLL_HEIGHT) {
            var expectedMinChildren = headerRow ? 2 : 1;
            if (tableClone.children.length === expectedMinChildren) {
              rowIndex++;
            } else {
              tableClone.removeChild(rowClone);
              makeContinuationSection();
              tableClone = childEl.cloneNode(false);
              openSection.appendChild(tableClone);
              if (headerRow) tableClone.appendChild(headerRow.cloneNode(true));
            }
          } else {
            rowIndex++;
          }
        }
      } else if (isParagraph) {
        var pClone = childEl.cloneNode(false);
        openSection.appendChild(pClone);
        var words = (childEl.textContent || '').split(' ');
        var wordIndex = 0;
        var currentWords = [];

        while (wordIndex < words.length) {
          currentWords.push(words[wordIndex]);
          pClone.textContent = currentWords.join(' ');
          currentHeight = currentContent.scrollHeight;

          if (currentHeight > MAX_SCROLL_HEIGHT) {
            currentWords.pop();
            if (currentWords.length > 0) {
              pClone.textContent = currentWords.join(' ');
              makeContinuationSection();
              pClone = childEl.cloneNode(false);
              openSection.appendChild(pClone);
              currentWords = [];
            } else {
              pClone.textContent = words[wordIndex];
              wordIndex++;
            }
          } else {
            wordIndex++;
          }
        }
      } else {
        openSection.appendChild(childEl.cloneNode(true));
      }
    }

    // ─── Process the queue ───
    queue.forEach(function(item) {
      if (item.type === 'element') {
        // Handle page-break-before
        if (item.isPageBreak) {
          // Update the header-right text for all subsequent pages
          if (item.headerRight) {
            currentHeaderRight = item.headerRight;
          }
          // If current page has content, start a new page
          if (currentContent.children.length > 0) {
            newPage();
          }
          // Update the current page's header-right
          updateHeaderRight(currentPage, currentHeaderRight);
        } else if (item.headerRight) {
          currentHeaderRight = item.headerRight;
          updateHeaderRight(currentPage, currentHeaderRight);
        }

        // Remove the page-break-before class and data attribute before appending
        var el = item.el;
        el.classList.remove('page-break-before');
        el.removeAttribute('data-header-right');

        appendElement(el);
      } else if (item.type === 'finding-block-start') {
        originalHeaderHtml = item.headHtml;
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHeaderHtml;
        var idEl = tempDiv.querySelector('.fb-id');
        var titleEl = tempDiv.querySelector('.fb-title');
        var severityEl = tempDiv.querySelector('.rb');

        findingId = idEl ? idEl.textContent.trim() : '';
        findingTitle = titleEl ? titleEl.textContent.trim() : '';
        findingSeverity = severityEl ? severityEl.textContent.trim() : '';
        isGoal = findingId.indexOf('GS') !== -1;

        if (isGoal) {
          contHeadHtml =
            '<div class="fb-head" style="background: var(--navy-mid);">' +
              '<div class="fb-head-left">' +
                '<span class="fb-id">' + findingId + ' (Cont.)</span>' +
                '<span class="fb-title">' + findingTitle + ' (Continuation)</span>' +
              '</div>' +
            '</div>';
        } else {
          var severityBadge = severityEl ? '<span class="' + severityEl.className + '">' + findingSeverity + '</span>' : '';
          contHeadHtml =
            '<div class="fb-head">' +
              '<div class="fb-head-left">' +
                '<span class="fb-id">' + findingId + ' (Cont.)</span>' +
                '<span class="fb-title">' + findingTitle + ' (Continuation)</span>' +
              '</div>' +
              severityBadge +
            '</div>';
        }

        isFirstPageOfFinding = true;
        openFindingBlockOnCurrentPage();

        currentHeight = currentContent.scrollHeight;
        if (currentHeight > MAX_SCROLL_HEIGHT) {
          currentContent.removeChild(openFindingBlock);
          newPage();
          openFindingBlockOnCurrentPage();
          currentHeight = currentContent.scrollHeight;
        }
      } else if (item.type === 'finding-block-meta') {
        openFindingBlockOnCurrentPage();
        var temp = document.createElement('div');
        temp.innerHTML = item.metaHtml;
        var innerMeta = temp.querySelector('.fb-meta');
        var metaEl = document.createElement('div');
        metaEl.className = 'fb-meta';
        metaEl.innerHTML = innerMeta ? innerMeta.innerHTML : item.metaHtml;
        openFbBody.appendChild(metaEl);

        currentHeight = currentContent.scrollHeight;
        if (currentHeight > MAX_SCROLL_HEIGHT) {
          openFbBody.removeChild(metaEl);
          newPage();
          openFindingBlockOnCurrentPage();
          openFbBody.appendChild(metaEl);
          currentHeight = currentContent.scrollHeight;
        }
      } else if (item.type === 'finding-section-start') {
        openFindingBlockOnCurrentPage();
        openSection = document.createElement('div');
        openSection.className = 'fb-section';
        if (item.sectionTitle.toLowerCase() === 'recommendation') {
          openSection.style.marginBottom = '0';
        }
        openSection.innerHTML = item.lblHtml;
        openFbBody.appendChild(openSection);

        currentHeight = currentContent.scrollHeight;
        if (currentHeight > MAX_SCROLL_HEIGHT) {
          openFbBody.removeChild(openSection);
          newPage();
          openFindingBlockOnCurrentPage();

          openSection = document.createElement('div');
          openSection.className = 'fb-section';
          if (item.sectionTitle.toLowerCase() === 'recommendation') {
            openSection.style.marginBottom = '0';
          }
          var contLblHtml = item.lblHtml.replace(item.sectionTitle, item.sectionTitle + ' (Continued)');
          openSection.innerHTML = contLblHtml;
          openFbBody.appendChild(openSection);
          currentHeight = currentContent.scrollHeight;
        }
      } else if (item.type === 'finding-section-child') {
        appendFindingChild(item.childEl, item.sectionTitle);
      } else if (item.type === 'finding-block-end') {
        closeContainers();
      }
    });

    // Run dynamic TOC generation
    try {
      updateTocPageNumbers();
    } catch (e) {
      console.error('TOC generation failed:', e);
    }

    var endPage = document.getElementById('end-of-report-page');
    if (endPage) {
      wrapper.appendChild(endPage);
    }

    // Set page x of y numbering for all pages except cover, TOC page, and last page
    var allPages = wrapper.querySelectorAll('.page');
    var totalPagesCount = allPages.length;
    allPages.forEach(function(page, idx) {
      if (idx === 0 || idx === totalPagesCount - 1) {
        return;
      }
      var pageNumEl = page.querySelector('.page-num');
      if (page.querySelector('#table-of-contents')) {
        if (pageNumEl) {
          pageNumEl.textContent = '';
        }
        return;
      }
      if (pageNumEl) {
        pageNumEl.textContent = 'Page ' + idx + ' of ' + (totalPagesCount - 1);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reflowBody);
  } else {
    setTimeout(reflowBody, 50);
  }
})();
</script>
<!-- REFLOW_SCRIPT_END -->

<!-- GOAL_SCENARIO_TEMPLATE_START -->
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
<!-- GOAL_SCENARIO_TEMPLATE_END -->

<!-- FINDING_TEMPLATE_START -->
<div class="finding-block">
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
<!-- FINDING_TEMPLATE_END -->

<!-- PARENT_BRIDGE_SCRIPT_START -->
<script>
(function(){
  function attach(){
    // Forward in-iframe TOC anchor clicks to the parent so the preview container scrolls.
    document.addEventListener('click', function(e){
      var a = e.target && e.target.closest ? e.target.closest('a[data-toc-target], a.toc-row, a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute('data-toc-target') || (a.getAttribute('href') || '').replace(/^#/, '');
      if (!id) return;
      // Allow native behavior in print/PDF; intercept only on interactive viewing.
      e.preventDefault();
      try {
        window.parent.postMessage({ source: 'report-creator-report', type: 'toc-nav', targetId: id }, '*');
      } catch (err) {}
    }, true);

    // Forward wheel events to the parent preview container so vertical scrolling still works
    // even though the iframe needs pointer-events:auto for click handling.
    window.addEventListener('wheel', function(e){
      try {
        window.parent.postMessage({ source: 'report-creator-report', type: 'wheel', deltaY: e.deltaY, deltaX: e.deltaX, deltaMode: e.deltaMode }, '*');
      } catch (err) {}
    }, { passive: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
</script>
<!-- PARENT_BRIDGE_SCRIPT_END -->

</body>
</html>
`;
