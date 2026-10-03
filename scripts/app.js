// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  renderNews();
  startPeriodicFeedUpdates();
});

// Curated Initial Articles
let articles = [
  {
    id: 1,
    title: "India Eases Non-Basmati White Rice Export Curbs as Domestic Harvest Hits Record 138M Tonnes",
    source: "Reuters Commodities",
    time: "2 mins ago",
    commodity: "Grains",
    region: "India & APAC",
    dealSize: "Infrastructure",
    sentiment: "BULLISH",
    summary: "Government reduces minimum export price to $490/MT. Indian trading houses secure forward supply contracts across Southeast Asia and Africa, putting downward pressure on Thai and Vietnamese export quotes.",
    metric: "Impact: Indian Agricultural Export Volume +18% QoQ",
    link: "#"
  },
  {
    id: 2,
    title: "Autonomous Swarm Weeding Robotics Firm 'Verdant AI' Closes $28M Series B Led by Temasek AgTech",
    source: "AgFunder News",
    time: "14 mins ago",
    commodity: "AgTech",
    region: "North America",
    dealSize: "Growth",
    sentiment: "CAPITAL EVENT",
    summary: "Field-tested across 120,000 acres in California and the Midwest, the solar-autonomous platform reduces crop chemical input expenditure by 74% with sub-centimeter computer vision precision.",
    metric: "Capital: $28.0M Series B | Valuation: $110M Post",
    link: "#"
  },
  {
    id: 3,
    title: "Brazil Soybean Port Congestion Clears: Santos Shipments Accelerate Ahead of US Harvest Peak",
    source: "Bloomberg Agri",
    time: "42 mins ago",
    commodity: "Grains",
    region: "Latin America",
    dealSize: "Infrastructure",
    sentiment: "BEARISH",
    summary: "Logistics bottlenecks at Paranaguá and Santos ease with 24/7 automated rail throughput. Record South American supply buffers global crushing margins.",
    metric: "CBOT Soy Contract Impact: -12.50 cents/bu",
    link: "#"
  },
  {
    id: 4,
    title: "Indo-Gangetic Basin Farmland Trust Files for ₹650 Cr Green REIT Listing on NSE",
    source: "The Economic Times Ag",
    time: "1 hour ago",
    commodity: "Farmland",
    region: "India & APAC",
    dealSize: "Infrastructure",
    sentiment: "CAPITAL EVENT",
    summary: "India's first institutional agricultural REIT aggregates 8,400 irrigated acres across Haryana and Punjab with long-term organic pulse procurement contracts.",
    metric: "Yield: Projected 11.2% Net Distribution Yield",
    link: "#"
  },
  {
    id: 5,
    title: "Biochar Carbon Removal Standard Verra Certifies 450,000t Soil Carbon Sequestration Facility",
    source: "Financial Times Energy & Ag",
    time: "2 hours ago",
    commodity: "Carbon",
    region: "EMEA",
    dealSize: "Growth",
    sentiment: "BULLISH",
    summary: "Institutional buyers including Microsoft and Shopify prepay for 7-year voluntary carbon removal credits at $92/tonne from European corn stover pyrolyzers.",
    metric: "Carbon Offsets: $92/t Forward Delivery Price",
    link: "#"
  },
  {
    id: 6,
    title: "Smart Methane-Reducing Seaweed Feed Additive Producer Secures $6.5M Seed Expansion",
    source: "AgTech Capital Wire",
    time: "3 hours ago",
    commodity: "Livestock",
    region: "North America",
    dealSize: "Seed",
    sentiment: "BULLISH",
    summary: "Asparagopsis-derived feed supplement demonstrates 82% enteric methane reduction across commercial dairy herds with zero decline in butterfat concentration.",
    metric: "Deal: $6.5M Seed | Lead: Khosla Ventures",
    link: "#"
  }
];

// Active Filters State
let currentCommodity = 'all';
let currentRegion = 'all';
let currentDealSize = 'all';
let currentSearch = '';

// Render News Feed
function renderNews() {
  const feed = document.getElementById('newsFeed');
  if (!feed) return;

  const filtered = articles.filter(item => {
    const matchesCommodity = (currentCommodity === 'all') || (item.commodity.toLowerCase() === currentCommodity.toLowerCase());
    const matchesRegion = (currentRegion === 'all') || (item.region.toLowerCase() === currentRegion.toLowerCase());
    const matchesDealSize = (currentDealSize === 'all') || (item.dealSize.toLowerCase() === currentDealSize.toLowerCase());
    const matchesSearch = !currentSearch || 
      item.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(currentSearch.toLowerCase()) ||
      item.source.toLowerCase().includes(currentSearch.toLowerCase());

    return matchesCommodity && matchesRegion && matchesDealSize && matchesSearch;
  });

  const countBadge = document.getElementById('articleCountBadge');
  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} Stor${filtered.length === 1 ? 'y' : 'ies'}`;
  }

  if (filtered.length === 0) {
    feed.innerHTML = `
      <div class="investor-card p-10 text-center text-slate-400 font-mono text-xs">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-500"></i>
        No dispatches matching current filter parameters.<br>
        <button onclick="resetFilters()" class="text-emerald-400 underline mt-2 inline-block">Reset All Filters</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  feed.innerHTML = filtered.map(item => {
    let sentimentBadge = '';
    if (item.sentiment === 'BULLISH') {
      sentimentBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">BULLISH ▲</span>`;
    } else if (item.sentiment === 'BEARISH') {
      sentimentBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-500/30">BEARISH ▼</span>`;
    } else {
      sentimentBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-sky-400 border border-sky-500/30">CAPITAL DEAL</span>`;
    }

    return `
      <article class="investor-card p-5 sm:p-6 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="text-white font-bold">${item.source}</span>
            <span class="text-slate-500">·</span>
            <span class="text-slate-400">${item.time}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-700">${item.commodity}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">${item.region}</span>
            ${sentimentBadge}
          </div>
        </div>

        <h3 class="text-lg sm:text-xl font-bold text-white headline-serif hover:text-emerald-300 transition-colors cursor-pointer">
          ${item.title}
        </h3>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          ${item.summary}
        </p>

        <div class="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span class="text-emerald-400 font-semibold">${item.metric}</span>
          <div class="flex items-center gap-4">
            <button onclick="bookmarkStory('${escapeHtml(item.title)}')" class="text-slate-400 hover:text-white flex items-center gap-1">
              <i data-lucide="bookmark" class="w-3.5 h-3.5"></i> Save
            </button>
            <button onclick="shareStory('${escapeHtml(item.title)}')" class="text-slate-400 hover:text-white flex items-center gap-1">
              <i data-lucide="share-2" class="w-3.5 h-3.5"></i> Share
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Filter triggers
function filterByCommodity(val) {
  currentCommodity = val;
  const select = document.getElementById('commodityFilter');
  if (select) select.value = val;
  renderNews();
}

function applyAllFilters() {
  currentCommodity = document.getElementById('commodityFilter').value;
  currentRegion = document.getElementById('regionFilter').value;
  currentDealSize = document.getElementById('dealSizeFilter').value;
  renderNews();
}

function searchNews() {
  currentSearch = document.getElementById('searchInput').value;
  renderNews();
}

function resetFilters() {
  currentCommodity = 'all';
  currentRegion = 'all';
  currentDealSize = 'all';
  currentSearch = '';
  document.getElementById('commodityFilter').value = 'all';
  document.getElementById('regionFilter').value = 'all';
  document.getElementById('dealSizeFilter').value = 'all';
  document.getElementById('searchInput').value = '';
  renderNews();
  showToast('Filters cleared');
}

// Interactive Market Analysis Chart Switcher
const chartData = {
  grains: {
    label: "Global Grains Composite (CBOT/MDEX)",
    val: "+18.4% YTD",
    path: "M 0 60 Q 50 40, 100 50 T 200 25 T 300 15",
    area: "M 0 60 Q 50 40, 100 50 T 200 25 T 300 15 L 300 80 L 0 80 Z",
    color: "#10B981"
  },
  vc: {
    label: "Global AgTech Venture Capital Volume ($B)",
    val: "$12.8B Annualized (+24%)",
    path: "M 0 70 Q 70 65, 120 45 T 220 30 T 300 10",
    area: "M 0 70 Q 70 65, 120 45 T 220 30 T 300 10 L 300 80 L 0 80 Z",
    color: "#3B82F6"
  },
  fert: {
    label: "DAP / Urea Fertilizer Input Index",
    val: "$545/MT (-14.2% YoY)",
    path: "M 0 20 Q 80 25, 150 45 T 240 60 T 300 68",
    area: "M 0 20 Q 80 25, 150 45 T 240 60 T 300 68 L 300 80 L 0 80 Z",
    color: "#F59E0B"
  }
};

function switchChart(mode) {
  ['chartGrainsBtn', 'chartVcBtn', 'chartFertBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.className = 'py-1 px-2 rounded text-slate-400 hover:text-white text-center';
  });

  const activeBtn = document.getElementById(`chart${mode.charAt(0).toUpperCase() + mode.slice(1)}Btn`);
  if (activeBtn) activeBtn.className = 'py-1 px-2 rounded bg-emerald-500 text-slate-950 font-bold text-center';

  const d = chartData[mode];
  if (!d) return;

  document.getElementById('chartLabel').textContent = d.label;
  document.getElementById('chartValue').textContent = d.val;
  document.getElementById('chartValue').style.color = d.color;

  const path = document.getElementById('chartPath');
  const area = document.getElementById('chartArea');
  path.setAttribute('d', d.path);
  path.setAttribute('stroke', d.color);
  area.setAttribute('d', d.area);
  area.setAttribute('fill', `${d.color}22`);
}

// Cms Posting Handler (Proves Back-End Ease to Client)
function handleCmsPost(e) {
  e.preventDefault();
  const title = document.getElementById('cmsTitle').value;
  const commodity = document.getElementById('cmsCommodity').value;
  const region = document.getElementById('cmsRegion').value;
  const dealSize = document.getElementById('cmsDealSize').value;
  const source = document.getElementById('cmsSource').value;
  const summary = document.getElementById('cmsSummary').value;

  const newArticle = {
    id: Date.now(),
    title,
    source,
    time: "Just now",
    commodity,
    region,
    dealSize,
    sentiment: "CAPITAL EVENT",
    summary,
    metric: "Status: Live Curation via Back-End CMS",
    link: "#"
  };

  articles.unshift(newArticle);
  renderNews();
  closeCmsModal();
  e.target.reset();
  showToast('Headline published live to investor stream!');
}

// Feed Refresh Simulation
function triggerFeedRefresh() {
  const syncLabel = document.getElementById('liveSyncStatus');
  const lastUpdated = document.getElementById('lastUpdatedTime');
  syncLabel.textContent = 'Syncing...';
  syncLabel.className = 'text-sky-400 animate-pulse';

  setTimeout(() => {
    syncLabel.textContent = 'Live Sync (15s)';
    syncLabel.className = 'text-emerald-400';
    if (lastUpdated) lastUpdated.textContent = 'Just now';
    showToast('Feed refreshed: 0 new dispatches in buffer');
  }, 600);
}

function startPeriodicFeedUpdates() {
  // Minor simulated ticker fluctuation every 12 seconds
  setInterval(() => {
    const lastUpdated = document.getElementById('lastUpdatedTime');
    if (lastUpdated && Math.random() > 0.6) {
      lastUpdated.textContent = 'Just now';
    }
  }, 15000);
}

// Modals Handling
function openAlertModal() {
  document.getElementById('alertModal').classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}
function closeAlertModal() {
  document.getElementById('alertModal').classList.remove('active');
}
function closeAlertOutside(e) {
  if (e.target.id === 'alertModal') closeAlertModal();
}

function openCmsModal() {
  document.getElementById('cmsModal').classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}
function closeCmsModal() {
  document.getElementById('cmsModal').classList.remove('active');
}
function closeCmsOutside(e) {
  if (e.target.id === 'cmsModal') closeCmsModal();
}

function openProposalModal() {
  document.getElementById('proposalModal').classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}
function closeProposalModal() {
  document.getElementById('proposalModal').classList.remove('active');
}
function closeProposalOutside(e) {
  if (e.target.id === 'proposalModal') closeProposalModal();
}

function handleAlertSubmit(e) {
  e.preventDefault();
  closeAlertModal();
  showToast('Investor Alert subscription active! Check inbox for confirmation.');
}

function subscribeSidebarEmail() {
  const input = document.getElementById('sidebarEmailInput');
  if (!input || !input.value) return;
  input.value = '';
  showToast('Subscribed to Daily Agri-Capital Memo!');
}

function requestDeck(name) {
  showToast(`Deal teaser deck for "${name}" sent to verified investor email.`);
}

function bookmarkStory(title) {
  showToast(`Story bookmarked to investor briefcase.`);
}

function shareStory(title) {
  navigator.clipboard.writeText(window.location.href);
  showToast('Article link copied to clipboard.');
}

function copyProposalText() {
  const content = document.getElementById('proposalContent');
  if (!content) return;
  navigator.clipboard.writeText(content.textContent.trim()).then(() => {
    const btn = document.getElementById('copyProposalBtnText');
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = 'Copy Proposal';
    }, 2000);
    showToast('Proposal text copied to clipboard!');
  });
}

function escapeHtml(str) {
  return String(str).replace(/'/g, "\\'");
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
