(()=>{"use strict";var e,t,r,a,o,n={},d={};function f(e){var t=d[e];if(void 0!==t)return t.exports;var r=d[e]={id:e,loaded:!1,exports:{}};return n[e].call(r.exports,r,r.exports,f),r.loaded=!0,r.exports}f.m=n,f.c=d,e=[],f.O=(t,r,a,o)=>{if(!r){var n=1/0;for(c=0;c<e.length;c++){r=e[c][0],a=e[c][1],o=e[c][2];for(var d=!0,i=0;i<r.length;i++)(!1&o||n>=o)&&Object.keys(f.O).every((e=>f.O[e](r[i])))?r.splice(i--,1):(d=!1,o<n&&(n=o));if(d){e.splice(c--,1);var b=a();void 0!==b&&(t=b)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[r,a,o]},f.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return f.d(t,{a:t}),t},r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,f.t=function(e,a){if(1&a&&(e=this(e)),8&a)return e;if("object"==typeof e&&e){if(4&a&&e.__esModule)return e;if(16&a&&"function"==typeof e.then)return e}var o=Object.create(null);f.r(o);var n={};t=t||[null,r({}),r([]),r(r)];for(var d=2&a&&e;"object"==typeof d&&!~t.indexOf(d);d=r(d))Object.getOwnPropertyNames(d).forEach((t=>n[t]=()=>e[t]));return n.default=()=>e,f.d(o,n),o},f.d=(e,t)=>{for(var r in t)f.o(t,r)&&!f.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},f.f={},f.e=e=>Promise.all(Object.keys(f.f).reduce(((t,r)=>(f.f[r](e,t),t)),[])),f.u=e=>"assets/js/"+({48:"a94703ab",61:"1f391b9e",98:"a7bd4aaa",134:"393be207",233:"6bd74171",235:"a7456010",241:"927b1586",279:"1244586d",401:"17896441",449:"5835e8d6",517:"a7247669",541:"b46a7d2d",617:"1e440a45",647:"5e95c892",660:"abc6bdc1",672:"65fa64a2",742:"aba21aa0",830:"d0ddc376",838:"72e08f9d",955:"6f809326",969:"14eb3368",976:"0e384e19"}[e]||e)+"."+{48:"9db4238e",61:"6b8fd131",98:"d6f839bf",134:"b191ce62",233:"c6cb6a10",235:"8b3b4544",237:"5ebfbea8",241:"ebd2e353",279:"0891ed83",401:"4e4301eb",449:"211c68fe",517:"23957d13",541:"31ba15c2",617:"69402bea",647:"abda2442",660:"ee116057",672:"86caf986",742:"c73d7858",830:"b15495bf",838:"fb2d5dec",888:"470baa84",955:"7c8c4451",969:"65bb12ae",976:"28c9db91"}[e]+".js",f.miniCssF=e=>{},f.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),f.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),a={},o="off-sec-labs:",f.l=(e,t,r,n)=>{if(a[e])a[e].push(t);else{var d,i;if(void 0!==r)for(var b=document.getElementsByTagName("script"),c=0;c<b.length;c++){var l=b[c];if(l.getAttribute("src")==e||l.getAttribute("data-webpack")==o+r){d=l;break}}d||(i=!0,(d=document.createElement("script")).charset="utf-8",d.timeout=120,f.nc&&d.setAttribute("nonce",f.nc),d.setAttribute("data-webpack",o+r),d.src=e),a[e]=[t];var u=(t,r)=>{d.onerror=d.onload=null,clearTimeout(s);var o=a[e];if(delete a[e],d.parentNode&&d.parentNode.removeChild(d),o&&o.forEach((e=>e(r))),t)return t(r)},s=setTimeout(u.bind(null,void 0,{type:"timeout",target:d}),12e4);d.onerror=u.bind(null,d.onerror),d.onload=u.bind(null,d.onload),i&&document.head.appendChild(d)}},f.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},f.p="/kb/",f.gca=function(e){return e={17896441:"401",a94703ab:"48","1f391b9e":"61",a7bd4aaa:"98","393be207":"134","6bd74171":"233",a7456010:"235","927b1586":"241","1244586d":"279","5835e8d6":"449",a7247669:"517",b46a7d2d:"541","1e440a45":"617","5e95c892":"647",abc6bdc1:"660","65fa64a2":"672",aba21aa0:"742",d0ddc376:"830","72e08f9d":"838","6f809326":"955","14eb3368":"969","0e384e19":"976"}[e]||e,f.p+f.u(e)},(()=>{var e={354:0,869:0};f.f.j=(t,r)=>{var a=f.o(e,t)?e[t]:void 0;if(0!==a)if(a)r.push(a[2]);else if(/^(354|869)$/.test(t))e[t]=0;else{var o=new Promise(((r,o)=>a=e[t]=[r,o]));r.push(a[2]=o);var n=f.p+f.u(t),d=new Error;f.l(n,(r=>{if(f.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var o=r&&("load"===r.type?"missing":r.type),n=r&&r.target&&r.target.src;d.message="Loading chunk "+t+" failed.\n("+o+": "+n+")",d.name="ChunkLoadError",d.type=o,d.request=n,a[1](d)}}),"chunk-"+t,t)}},f.O.j=t=>0===e[t];var t=(t,r)=>{var a,o,n=r[0],d=r[1],i=r[2],b=0;if(n.some((t=>0!==e[t]))){for(a in d)f.o(d,a)&&(f.m[a]=d[a]);if(i)var c=i(f)}for(t&&t(r);b<n.length;b++)o=n[b],f.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return f.O(c)},r=self.webpackChunkoff_sec_labs=self.webpackChunkoff_sec_labs||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})()})();