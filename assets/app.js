
/**
 * Predictions Service — User Demo (SPA)
 * Single folder, open index.html. Hash routes for GitHub Pages compatibility.
 * NOTE: This is a clickable prototype with stubbed data, no backend.
 */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

const STORAGE_KEY = "ps_user_demo_v1";
const DEFAULT_TODAY = "2026-02-06";

const state = loadState();

/* -----------------------------
   Stub data (minimal but rich)
------------------------------ */
const DATA = {
  sports: ["Football","Basketball","Tennis","MMA"],
contests: [
  {
    id: "c1",
    title: "Европейская Суперлига",
    subtitle: "Турнир прогнозов",
    hero: "50000₽ • 6–9 февраля",
    sport: "Football",
    leagues: ["Premier League", "La Liga", "Serie A", "Bundesliga"],
    dateFrom: "2026-02-06",
    dateTo: "2026-02-09",
    visibility: "Public",
    rankBy: "Profit",
    prizes: [
      {place:"1 место", value:"3 000 ₽"},
      {place:"2–11 место", value:"2 500 ₽"},
      {place:"12–18 место", value:"2 000 ₽"},
      {place:"19–20 место", value:"1 500 ₽"},
      {place:"21–25 место", value:"1 000 ₽"},
      {place:"26–125 место", value:"1 000 баллов"}
    ],
    rules: [
      {title:"Основные", body:[
        "Даты: 6–9 февраля.",
        "Тип турнира: по прибыли.",
        "Кэфы: до 3.00.",
        "Лиги: Premier League, La Liga, Serie A, Bundesliga.",
        "Один прогноз на матч. Только одиночные."
      ]}
    ],
    rulesNote: `Турнир прогнозов “Европейская Суперлига” – турнир прогнозов на матчи топ чемпионатов. Чтобы ваши прогнозы попали в зачет, нужно осознанно вступить в конкурс — нажать кнопку "Участвовать" на странице турнира. Прогнозы, сделанные до вступления, не засчитываются. Открывайте страницу матча (ссылки дублируются для удобства под таблицей), выбирайте любой из доступных рынков с коэффициентом от 1.70 в линии и оставляйте прогноз с обоснованием от 50 символов в пользу своего выбора.

Ваша цель – совершить как можно больше точных прогнозов с кэфом от 1.70 на предстоящие 8 конкурсных матчей, но немаловажную роль в распределении призовых мест будет играть и показатель прибыли. Даже результат 7 из 8 точных прогнозов по итогам турнира может оставить вас за пределами топ-20 турнирной таблицы, если показатель прибыли будет невысоким. Поэтому не нужно подбирать в каждом матче кэф. в районе 1.70 – таких прогнозистов будет немало. Старайтесь брать коэффициенты чуть выше, чтобы при одинаковом количестве точных и совершенных прогнозов превзойти своих соперников по дополнительному показателю – прибыль. Учитывайте эту рекомендацию при планировании своей стратегии.

Ещё один плюс для участников: если вы не попадете в денежные призы, но покажете хороший результат, мы начислим 1000 баллов. Для этого обязательно нужно опубликовать прогнозы на все 8 матчей согласно условиям турнира, а итоговый результат в таблице должен составить не менее 5 плюсов.`,
    participants: [
      {rank:1, name:"Майк М.", profit:3000, open:5, won:2, lost:0, void:0, winrate:"100%"},
      {rank:2, name:"Костя C", profit:2500, open:5, won:0, lost:0, void:0, winrate:"80%"},
      {rank:3, name:"Alan Dzgoev", profit:2500, open:0, won:0, lost:0, void:0, winrate:"80%"},
      {rank:4, name:"ставочка с", profit:2500, open:0, won:0, lost:0, void:0, winrate:"—"},
      {rank:5, name:"Денис М.", profit:2500, open:0, won:0, lost:0, void:0, winrate:"—"},
      {rank:6, name:"Александр Иванов", profit:2500, open:13, won:0, lost:0, void:0, winrate:"—"},
      {rank:7, name:"Андрей Кузнецов", profit:2500, open:13, won:0, lost:0, void:0, winrate:"—"},
      {rank:8, name:"Андрей Вовс", profit:2500, open:0, won:0, lost:0, void:0, winrate:"—"},
      {rank:9, name:"Andrey_Smolensk 67", profit:2500, open:0, won:0, lost:0, void:0, winrate:"—"},
      {rank:10, name:"Александр Лыхварев", profit:2500, open:0, won:0, lost:0, void:0, winrate:"—"}
    ]
  },
  {
    id: "c2",
    title: "Ежедневник (7 февраля)",
    subtitle: "Турнир прогнозов",
    hero: "20 000₽ • 7 февраля",
    sport: "Football",
    leagues: ["Premier League", "La Liga"],
    dateFrom: "2026-02-07",
    dateTo: "2026-02-07",
    visibility: "Public",
    rankBy: "Points",
    prizes: [{place:"1 место", value:"20 000 ₽"}],
    rules: [{title:"Основные", body:["Демо конкурс на 1 день."]}],
    participants: []
  },
  {
    id: "c3",
    title: "Тотализатор (7 февраля)",
    subtitle: "За бонусные баллы",
    hero: "20 000 баллов • 7 февраля",
    sport: "Football",
    leagues: ["Serie A", "Bundesliga"],
    dateFrom: "2026-02-07",
    dateTo: "2026-02-07",
    visibility: "Public",
    rankBy: "Profit",
    prizes: [{place:"1 место", value:"20 000 баллов"}],
    rules: [{title:"Основные", body:["Демо: рейтинг по прибыли."]}],
    participants: []
  },
  {
    id: "c4",
    title: "Бустер баллов",
    subtitle: "За бонусные баллы",
    hero: "x500 баллов • 6–8 февраля",
    sport: "Football",
    leagues: ["La Liga", "Premier League"],
    dateFrom: "2026-02-06",
    dateTo: "2026-02-08",
    visibility: "Public",
    rankBy: "Points",
    prizes: [{place:"1 место", value:"500 баллов"}],
    rules: [{title:"Основные", body:["Демо: начисление по очкам."]}],
    participants: []
  },
  {
    id: "c5",
    title: "Ежедневник (6 февраля)",
    subtitle: "Турнир прогнозов",
    hero: "75 000 баллов • 6 февраля",
    sport: "Football",
    leagues: ["Premier League"],
    dateFrom: "2026-02-06",
    dateTo: "2026-02-06",
    visibility: "Public",
    rankBy: "Profit",
    prizes: [{place:"1 место", value:"75 000 баллов"}],
    rules: [{title:"Основные", body:["Демо конкурс на 1 день."]}],
    participants: []
  }
],
  // Games belong to contests; in real life games come from an odds API by league+date.
  games: [
    // 6 Feb
    {id:"g1", contestId:"c1", dt:"2026-02-06T20:30:00", league:"Premier League", home:"Arsenal", away:"Chelsea", status:"planned",
      odds:{ "1":2.13, "X":3.64, "2":3.68 }, crowd:542},
    {id:"g2", contestId:"c1", dt:"2026-02-06T20:45:00", league:"Serie A", home:"Verona", away:"Pisa", status:"planned",
      odds:{ "1":2.53, "X":3.07, "2":3.40 }, crowd:481},
    {id:"g3", contestId:"c1", dt:"2026-02-06T21:00:00", league:"La Liga", home:"Sevilla", away:"Girona", status:"planned",
      odds:{ "1":2.20, "X":3.46, "2":3.70 }, crowd:49},
    // 7 Feb
    {id:"g4", contestId:"c1", dt:"2026-02-07T13:30:00", league:"Premier League", home:"Man Utd", away:"Tottenham", status:"planned",
      odds:{ "1":1.62, "X":4.83, "2":5.28 }, crowd:123},
    {id:"g5", contestId:"c1", dt:"2026-02-07T16:00:00", league:"Premier League", home:"Fulham", away:"Everton", status:"planned",
      odds:{ "1":2.14, "X":3.56, "2":3.23 }, crowd:79},
    {id:"g6", contestId:"c1", dt:"2026-02-07T18:30:00", league:"Bundesliga", home:"Dortmund", away:"Bayern", status:"planned",
      odds:{ "1":3.64, "X":3.88, "2":2.07 }, crowd:53},
    // results examples (used in Events → Results)
    // 6 Feb
    {id:"g7", contestId:"c1", dt:"2026-02-06T18:00:00", league:"Premier League", home:"Leeds", away:"Nottingham Forest", status:"finished",
      score:"1:0", odds:{ "1":2.27, "X":3.41, "2":3.05 }, crowd:493},
    {id:"g8", contestId:"c1", dt:"2026-02-06T19:00:00", league:"La Liga", home:"Barcelona", away:"Mallorca", status:"finished",
      score:"2:2", odds:{ "1":1.22, "X":9.05, "2":11.90 }, crowd:39},
    {id:"g9", contestId:"c1", dt:"2026-02-06T20:45:00", league:"Serie A", home:"Roma", away:"Lazio", status:"finished",
      score:"0:1", odds:{ "1":2.05, "X":3.18, "2":3.62 }, crowd:38},

    // 7 Feb
    {id:"g10", contestId:"c1", dt:"2026-02-07T18:00:00", league:"Premier League", home:"Fulham", away:"Everton", status:"finished",
      score:"1:1", odds:{ "1":2.14, "X":3.56, "2":3.23 }, crowd:79},
    {id:"g11", contestId:"c1", dt:"2026-02-07T18:30:00", league:"Bundesliga", home:"Dortmund", away:"Bayern", status:"finished",
      score:"0:3", odds:{ "1":3.64, "X":3.88, "2":2.07 }, crowd:53},
    {id:"g12", contestId:"c1", dt:"2026-02-07T21:00:00", league:"Premier League", home:"Arsenal", away:"Chelsea", status:"finished",
      score:"—", odds:{ "1":2.13, "X":3.64, "2":3.68 }, crowd:542},
  ],
  tipsters: [
    {username:"PesPatron", country:"Ukraine", club:"Barcelona", profit:17030, yield:24.3, won:6, lost:1, void:0, tips:7, avgOdds:1.75, winrate:86, rankOverall:1058},
    {username:"Suono Suono", country:"Italy", profit:280000, yield:43.08, won:36, lost:29, void:0, tips:65, avgOdds:1.88, winrate:55, rankOverall:1},
    {username:"Юрий фатин", country:"Russia", profit:273500, yield:27.35, won:62, lost:31, void:0, tips:93, avgOdds:1.92, winrate:67, rankOverall:2},
    {username:"Максим Погодин", country:"Russia", profit:271000, yield:48.45, won:35, lost:21, void:0, tips:56, avgOdds:1.71, winrate:63, rankOverall:3},
  ],
};

// User tips are stored in state.tips: { [gameId]: { pick, odds, market, createdAt, status, profitDelta } }
function ensureTipsIntegrity(){
  state.tips = state.tips || {};

  // Seed a few demo tips (only if user has no saved tips yet).
  // This is used to demonstrate different result states in Events → Results.
  if (Object.keys(state.tips).length === 0) {
    state.tips = {
      // upcoming example (so some rows show "Your Bet" on upcoming lists)
      g2:  {market:"DOUBLE CHANCE: X2", pick:"X2", odds:3.07, createdAt:"2026-02-06T10:00:00", status:"open"},

      // Results: seed different outcomes, but show bet details only for TWO games (g7, g11).
      // 6 Feb
      g7:  {market:"Match Result", pick:"1", odds:2.27, createdAt:"2026-02-06T12:10:00", final:"won"},   // show bet
      g8:  {final:"void", createdAt:"2026-02-06T12:12:00"},                                               // icon only
      g9:  {final:"lost", createdAt:"2026-02-06T12:14:00"},                                               // icon only

      // 7 Feb
      g10: {final:"void", createdAt:"2026-02-07T10:05:00"},                                               // icon only
      g11: {market:"Match Result", pick:"2", odds:2.07, createdAt:"2026-02-07T10:07:00", final:"won"},   // show bet
      g12: {final:"lost", createdAt:"2026-02-07T10:09:00"},                                               // icon only
    };
  }
}

/* -----------------------------
   Router
------------------------------ */
const routes = [
  {re:/^#\/?$/, go:() => navTo("#/contests")},
  {re:/^#\/contests\/?$/, go:() => viewContests()},
  {re:/^#\/contests\/([^\/]+)\/?$/, go:(m) => viewContest(m[1])},
  {re:/^#\/contests\/([^\/]+)\/leaderboard\/?$/, go:(m) => viewContestLeaderboard(m[1])},
  {re:/^#\/contests\/([^\/]+)\/events\/?$/, go:(m) => viewContestEvents(m[1])},
  {re:/^#\/events\/?$/, go:() => viewEvents()},
  {re:/^#\/tipsters\/?$/, go:() => viewTipsters()},
  {re:/^#\/tipsters\/([^\/]+)\/?$/, go:(m) => viewTipsterProfile(m[1])},
  {re:/^#\/tipsters\/([^\/]+)\/tips\/?$/, go:(m) => viewTipsterTips(m[1])},
  {re:/^#\/tipsters\/([^\/]+)\/stats\/?$/, go:(m) => viewTipsterStats(m[1])},
  {re:/^#\/me\/matches\/?$/, go:() => viewMyMatches()},
  {re:/^#\/me\/tips\/?$/, go:() => viewMyTips()},
  {re:/^#\/me\/stats\/?$/, go:() => viewMyStats()},
];

window.addEventListener("hashchange", render);
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  // 1) Close tip modal first
  if (state.ui.modalOpen) { closeModal(); return; }
  // 2) Then hide demo controls (desktop) to avoid overlap
  if (state.ui.showControls) {
    state.ui.showControls = false;
    saveState();
    render();
  }
});

// If anything crashes, show a visible error box (avoid "blank page" debugging).
window.addEventListener("error", (e) => {
  try { showCrash(e.error || e.message || e); } catch(_){}
});
window.addEventListener("unhandledrejection", (e) => {
  try { showCrash(e.reason || e); } catch(_){}
});
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-nav]");
  if (!a) return;
  e.preventDefault();
  navTo(a.getAttribute("href"));
});

/* -----------------------------
   Rendering shell
------------------------------ */
function showCrash(err){
  try{ console.error("Demo crashed:", err); }catch(_){ }
  const app = document.getElementById("app");
  if (!app) return;
  const msg = (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err);
  app.innerHTML = `
    <div class="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div class="w-full max-w-3xl bg-white border border-rose-200 rounded-2xl shadow-sm p-6">
        <div class="text-rose-700 font-semibold text-lg">Demo crashed</div>
        <div class="text-slate-600 mt-1">Open DevTools → Console for details.</div>
        <pre class="mt-4 text-xs bg-rose-50 border border-rose-200 rounded-xl p-4 whitespace-pre-wrap overflow-auto">${escapeHtml(msg)}</pre>
      </div>
    </div>`;
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function render(){
  try{
    const app = document.getElementById("app");
    if (!app) return;
    ensureTipsIntegrity();

    // "API mode" simulation
    if (state.ui.apiMode === "loading"){
      app.innerHTML = shell(`<div class="p-10 text-center text-slate-600">Loading…</div>`);
      attachShellHandlers();
      return;
    }
    if (state.ui.apiMode === "error"){
      app.innerHTML = shell(errorState());
      attachShellHandlers();
      return;
    }

    // Important: allow query params in hash routes (e.g. #/me/matches?tab=results)
    // by matching only the path part against route regex.
    const fullHash = location.hash || "#/contests";
    const hashPath = fullHash.split("?")[0];
    for (const r of routes){
      const m = hashPath.match(r.re);
      if (m){
        const content = r.go(m) || "";
        app.innerHTML = shell(content);
        attachShellHandlers();
        return;
      }
    }

    // fallback
    navTo("#/contests");
  }catch(e){
    showCrash(e);
  }
}

function shell(mainHtml){
  const rightPad = state.ui.showControls ? "lg:pr-[320px]" : "";
  return `
  <div class="min-h-screen flex">
    ${leftNav()}
    <div class="flex-1 flex flex-col ${rightPad}">
      ${topBar()}
      <main class="flex-1 px-6 py-5">
        ${mainHtml}
      </main>
      ${footer()}
    </div>
    ${demoControls()}
    ${modalRoot()}
  </div>`;
}

function leftNav(){
  const active = (p) => (location.hash || "#/contests").startsWith(p) ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-100";
  const meProfileHref = `#/tipsters/${encodeURIComponent(state.ui.username || "")}`;
  return `
  <aside class="w-[240px] hidden md:flex flex-col border-r bg-white">
    <div class="px-4 py-4 flex items-center gap-2">
      <div class="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">T</div>
      <div class="leading-tight">
        <div class="font-semibold">Tipstr</div>
        <div class="text-xs text-slate-500">Predictions demo</div>
      </div>
    </div>
    <nav class="px-3 py-2 space-y-1">
      <a data-nav href="#/contests" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active("#/contests")}">
        <span class="text-slate-500">🏆</span><span>Турниры прогнозов</span>
      </a>
      <a data-nav href="#/tipsters" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active("#/tipsters")}">
        <span class="text-slate-500">📈</span><span>Прогнозисты</span>
      </a>
      <a data-nav href="#/events" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active("#/events")} ${state.ui.authenticated ? "" : "opacity-50 pointer-events-none"}">
        <span class="text-slate-500">🗓️</span><span>Events</span>
      </a>
      <div class="pt-2 mt-2 border-t">
        <div class="px-3 pb-2 text-xs text-slate-500 uppercase tracking-wide">My</div>
        <a data-nav href="${meProfileHref}" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active(meProfileHref)} ${state.ui.authenticated ? "" : "opacity-50 pointer-events-none"}">
          <span class="text-slate-500">👤</span><span>Profile</span>
        </a>
        <a data-nav href="#/me/matches" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active("#/me/matches")} ${state.ui.authenticated ? "" : "opacity-50 pointer-events-none"}">
          <span class="text-slate-500">⚽</span><span>My matches</span>
        </a>
        <a data-nav href="#/me/tips" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active("#/me/tips")} ${state.ui.authenticated ? "" : "opacity-50 pointer-events-none"}">
          <span class="text-slate-500">🧾</span><span>My tips</span>
        </a>
        <a data-nav href="#/me/stats" class="flex items-center gap-3 px-3 py-2 rounded-xl ${active("#/me/stats")} ${state.ui.authenticated ? "" : "opacity-50 pointer-events-none"}">
          <span class="text-slate-500">📊</span><span>My stats</span>
        </a>
      </div>
    </nav>
    <div class="mt-auto px-4 py-4 text-xs text-slate-400">
      Demo only. No backend.
    </div>
  </aside>`;
}

function topBar(){
  const user = state.ui.username;
  return `
  <header class="bg-white border-b">
    <div class="px-6 h-16 flex items-center gap-4">
      <div class="flex-1">
        <div class="relative max-w-xl">
          <input id="q" placeholder="Поиск" class="w-full pl-10 pr-3 py-2 rounded-full border bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200" />
          <span class="absolute left-3 top-2.5 text-slate-400">🔎</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button id="btnToggleControls" class="hidden lg:inline-flex btn-soft px-3 py-2 rounded-xl text-sm">${state.ui.showControls ? "Hide controls" : "Show controls"}</button>
        <button id="btnAuth" class="btn-soft px-3 py-2 rounded-xl text-sm">${state.ui.authenticated ? "Logout" : "Login"}</button>
        <div class="flex items-center gap-2">
          <div class="h-9 w-9 rounded-full bg-slate-900 text-white grid place-items-center font-semibold">${(user||"U")[0].toUpperCase()}</div>
          <div class="leading-tight hidden sm:block">
            <div class="text-sm font-semibold">${escapeHtml(user)}</div>
            <div class="text-xs text-slate-500">${state.ui.authenticated ? "My account" : "Guest"}</div>
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

function footer(){
  return `<footer class="px-6 py-4 text-xs text-slate-400">Predictions Service — User demo prototype</footer>`;
}

/* -----------------------------
   Demo controls
------------------------------ */
function demoControls(){
  if (!state.ui.showControls) return "";
  const modeBtn = (m, label) => `
    <button data-api-mode="${m}" class="px-3 py-2 rounded-xl border text-sm ${state.ui.apiMode===m ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}">${label}</button>
  `;
  return `
  <aside class="hidden lg:block fixed right-5 top-20 w-[300px] z-40">
    <div class="bg-white border rounded-2xl shadow-soft p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="font-semibold">Demo Controls</div>
        <div class="flex items-center gap-2">
          <div class="text-xs text-slate-500 demo-mono">local</div>
          <button id="btnHideControls" class="h-7 w-7 rounded-lg border bg-white hover:bg-slate-50 grid place-items-center" title="Hide">
            ✕
          </button>
        </div>
      </div>

      <div class="text-xs text-slate-500 mb-2">API Mode</div>
      <div class="flex gap-2 flex-wrap mb-4">
        ${modeBtn("ok","ok")}
        ${modeBtn("loading","loading")}
        ${modeBtn("error","error")}
        ${modeBtn("empty","empty")}
      </div>

      <div class="text-xs text-slate-500 mb-2">Today</div>
      <div class="flex gap-2 mb-4">
        <input id="today" type="date" class="flex-1 px-3 py-2 rounded-xl border bg-white" value="${state.ui.today}" />
        <button id="btnToday" class="btn-soft px-3 py-2 rounded-xl text-sm">Reset</button>
      </div>

      <div class="text-xs text-slate-500 mb-2">User</div>
      <div class="flex gap-2 mb-4">
        <select id="selUser" class="flex-1 px-3 py-2 rounded-xl border bg-white text-sm">
          ${DATA.tipsters.map(t => `<option value="${escapeAttr(t.username)}" ${t.username===state.ui.username ? "selected":""}>${escapeHtml(t.username)}</option>`).join("")}
        </select>
        <button id="btnProfile" class="btn-soft px-3 py-2 rounded-xl text-sm">Profile</button>
      </div>

      <div class="flex items-center justify-between mb-4">
        <div class="text-sm">
          <div class="font-medium">Show odds</div>
          <div class="text-xs text-slate-500">Affects match lists</div>
        </div>
        <input id="chkOdds" type="checkbox" class="h-5 w-5" ${state.ui.showOdds ? "checked":""}/>
      </div>

      <div class="flex gap-2">
        <button id="btnResetTips" class="btn-soft px-3 py-2 rounded-xl text-sm w-full">Reset tips</button>
      </div>

      <div class="mt-4 text-xs text-slate-500">
        Tip modal: press <span class="kbd">Esc</span> to close.
      </div>
    </div>
  </aside>`;
}

/* -----------------------------
   Modal
------------------------------ */
function modalRoot(){
  if (!state.ui.modalOpen) return "";
  const m = state.ui.modal;
  return `
  <div class="fixed inset-0 z-50 flex items-center justify-center modal-backdrop px-4">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-soft overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b">
        <div class="font-semibold text-lg">Выбери исход</div>
        <div class="flex items-center gap-2">
          <button data-modal-min class="btn-soft px-3 py-1.5 rounded-xl text-sm">—</button>
          <button data-modal-close class="btn-soft px-3 py-1.5 rounded-xl text-sm">✕</button>
        </div>
      </div>

      <div class="px-5 py-4">
        <div class="text-sm text-slate-500 mb-3">${escapeHtml(m.game.home)} — ${escapeHtml(m.game.away)} • ${fmtDateTime(m.game.dt)}</div>

        <div class="text-xs font-semibold text-slate-500 mb-2">ОСНОВНЫЕ ИСХОДЫ</div>
        <div class="grid grid-cols-3 gap-3 mb-5">
          ${["1","X","2"].map(code => {
            const label = code==="1" ? "Победа 1" : code==="X" ? "Ничья" : "Победа 2";
            const selected = m.pick?.code === code && m.pick?.market === "Match Result";
            return `
              <button data-pick-market="Match Result" data-pick-code="${code}" class="border rounded-2xl p-4 text-center hover:bg-slate-50 ${selected ? "ring-4 ring-blue-100 border-blue-400" : ""}">
                <div class="text-slate-600 font-medium">${label}</div>
                <div class="text-blue-600 font-semibold mt-1">${m.game.odds[code].toFixed(2)}</div>
              </button>`;
          }).join("")}
        </div>

        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-semibold text-slate-500">ТОЧНЫЙ СЧЁТ</div>
          <button data-accordion class="text-slate-400 hover:text-slate-600">⌃</button>
        </div>

        <div class="grid grid-cols-2 gap-2">
          ${correctScoreOptions().map(o => {
            const selected = m.pick?.code === o.code && m.pick?.market === "Correct Score";
            return `
              <button data-pick-market="Correct Score" data-pick-code="${o.code}" data-pick-odds="${o.odds}"
                class="flex items-center justify-between px-4 py-2 rounded-xl border hover:bg-slate-50 ${selected ? "ring-4 ring-blue-100 border-blue-400" : ""}">
                <div class="font-medium text-slate-700">${o.code}</div>
                <div class="font-semibold">${o.odds.toFixed(2)}</div>
              </button>`;
          }).join("")}
        </div>

        <div class="mt-5 flex items-center justify-between">
          <div class="text-sm text-slate-500">
            One tip per game. Submitting again replaces the previous tip.
          </div>
          <div class="flex gap-2">
            <button data-modal-cancel class="btn-soft px-4 py-2 rounded-xl text-sm">Cancel</button>
            <button data-modal-save class="btn-primary px-4 py-2 rounded-xl text-sm ${m.pick ? "" : "opacity-50 pointer-events-none"}">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function openTipModal(gameId){
  if (!state.ui.authenticated){
    toast("Login required to submit tips (demo).");
    return;
  }
  const game = DATA.games.find(g => g.id === gameId);
  if (!game) return;
  const existing = state.tips[gameId] || null;
  state.ui.modalOpen = true;
  state.ui.modal = {
    game,
    pick: existing ? { market: existing.market, code: existing.pick, odds: existing.odds } : null
  };
  saveState();
  render();
}

function closeModal(){
  state.ui.modalOpen = false;
  state.ui.modal = null;
  saveState();
  render();
}

/* -----------------------------
   Views
------------------------------ */
// Archive list under contests list (static for demo)
function archiveRows(){
  const rows = [
    {title:"Ежедневник (5 февраля)", note:"Не участвовал", range:"05 фев – 05 фев"},
    {title:"Ежедневник (4 февраля)", note:"Не участвовал", range:"04 фев – 04 фев"},
    {title:"Ежедневник (3 февраля)", note:"Не участвовал", range:"03 фев – 03 фев"},
    {title:"Ежедневник (2 февраля)", note:"Не участвовал", range:"02 фев – 02 фев"},
    {title:"MMA", note:"Не участвовал", range:"01 фев – 01 фев"},
    {title:"Тотализатор (1 февраля)", note:"Не участвовал", range:"01 фев – 01 фев"},
    {title:"Спринт №31", note:"Не участвовал", range:"31 янв – 31 янв"},
    {title:"Европейская Суперлига", note:"Не участвовал", range:"30 янв – 03 фев"},
  ];
  return rows.map(r => `
    <a data-nav href="#/contests/c1" class="py-3 flex items-center justify-between hover:bg-slate-50 px-2 -mx-2 rounded-xl">
      <div>
        <div class="font-medium">${escapeHtml(r.title)}</div>
        <div class="text-xs text-slate-500">${escapeHtml(r.note)} · ${escapeHtml(r.range)}</div>
      </div>
      <div class="w-16 h-10 rounded-lg bg-slate-100 border"></div>
    </a>
  `);
}

function viewContests(){
  if (state.ui.apiMode === "empty"){
    return emptyState("Нет активных турниров", "Попробуй поменять фильтры или верни режим API в ok.");
  }

  const active = DATA.contests;
  const featured = active[0];

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-2">Турниры прогнозов</div>
    <div class="text-2xl font-semibold mb-4">Конкурсы прогнозов на спорт</div>

    <div class="bg-white border rounded-2xl p-4 mb-4">
      <div class="flex flex-wrap gap-2">
        <button class="btn-primary px-3 py-2 rounded-xl text-sm">Все турниры прогнозов</button>
        <select class="px-3 py-2 rounded-xl border bg-white text-sm">
          <option>Вид спорта</option><option>Football</option><option>Basketball</option>
        </select>
        <select class="px-3 py-2 rounded-xl border bg-white text-sm">
          <option>Публичные</option><option>Private</option>
        </select>
        <select class="px-3 py-2 rounded-xl border bg-white text-sm">
          <option>За бонусные баллы</option><option>За деньги</option>
        </select>
      </div>
    </div>

    <div class="bg-white border rounded-2xl overflow-hidden mb-5">
      <div class="h-44 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 relative">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 30%, #60a5fa, transparent 50%), radial-gradient(circle at 80% 60%, #22c55e, transparent 45%);"></div>
        <div class="absolute bottom-4 left-5 text-white">
          <div class="text-xs uppercase tracking-wider opacity-80">${escapeHtml(featured.subtitle)}</div>
          <a data-nav href="#/contests/${featured.id}" class="text-2xl font-bold hover:underline">${escapeHtml(featured.title)}</a>
          <div class="text-sm opacity-90 mt-1">${escapeHtml(featured.hero)}</div>
        </div>
      </div>

      <div class="p-4 flex items-center justify-between">
        <div class="flex gap-3 flex-wrap">
          <span class="pill">💰 ${featured.hero.split("•")[0].trim()}</span>
          <span class="pill">👥 ${featured.participants.length || 767} участников</span>
          <span class="pill">🏆 по прибыли</span>
        </div>
        <a data-nav href="#/contests/${featured.id}" class="btn-primary px-4 py-2 rounded-xl text-sm">УЧАСТВОВАТЬ</a>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4 mb-8">
      ${active.slice(1).map(c => contestCard(c)).join("")}
    </div>

    ${(() => {
      // Homepage: show user's nearest upcoming games (1 nearest day only)
      if (!state.ui.authenticated) return "";
      const todayISO = (state.ui.today || "2026-02-06");
      const today = new Date(todayISO + "T00:00:00");

      const activeContestIds = new Set(
        DATA.contests
          .filter(c => (c.visibility || "Public") === "Public")
          .filter(c => new Date((c.dateTo || "2099-12-31") + "T23:59:59") >= today)
          .map(c => c.id)
      );

      const upcomingGames = DATA.games
        .filter(g => activeContestIds.has(g.contestId))
        .filter(g => isUpcoming(g));

      const groups = groupedByDay(upcomingGames, todayISO);
      const nearest = groups[0];

      return `
        <div class="mb-8">
          <div class="text-sm text-slate-500 mb-1">Турниры прогнозов</div>
          <div class="text-xl font-semibold mb-3">События</div>
          <div class="text-sm text-slate-500 mb-4">Ближайшие матчи на ближайший день из всех активных публичных турниров, в которых вы участвуете.</div>

          ${nearest ? `
            <div class="space-y-3">
              ${dayGroup(nearest.dayLabel, nearest.games, "upcoming", {showContest:true, compact:true})}
            </div>
          ` : `
            <div class="bg-white border rounded-2xl p-6 text-sm text-slate-600">
              Нет ближайших матчей. Попробуйте поменять дату в Demo Controls.
            </div>
          `}

          <div class="mt-4">
            <a data-nav href="#/events" class="btn-soft px-4 py-2 rounded-xl text-sm inline-flex items-center gap-2">
              All games <span class="text-slate-400">→</span>
            </a>
          </div>
        </div>
      `;
    })()}



    <div class="bg-white border rounded-2xl p-4">
      <div class="font-semibold mb-3">Архив турниров прогнозов</div>
      <div class="divide-y">
        ${archiveRows().join("")}
      </div>
      <div class="mt-3 text-sm text-slate-500">Смотреть архив →</div>
    </div>
  </div>`;
}

function contestCard(c){
  return `
  <div class="bg-white border rounded-2xl overflow-hidden">
    <div class="h-28 bg-gradient-to-r from-indigo-600 to-sky-500 relative">
      <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle at 20% 30%, #fff, transparent 55%);"></div>
      <div class="absolute bottom-3 left-4 text-white">
        <div class="text-xs uppercase opacity-80">${escapeHtml(c.subtitle)}</div>
        <a data-nav href="#/contests/${c.id}" class="font-bold hover:underline">${escapeHtml(c.title)}</a>
      </div>
    </div>
    <div class="p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm text-slate-500">${fmtRange(c.dateFrom, c.dateTo)}</div>
        <div class="text-xs text-slate-500">${c.rankBy === "Profit" ? "по прибыли" : "по очкам"}</div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <a data-nav href="#/contests/${c.id}" class="btn-soft px-4 py-2 rounded-xl text-sm">УЧАСТВОВАТЬ</a>
        <span class="pill">🏅 ${c.prizes?.[0]?.value || "Призы"}</span>
      </div>
    </div>
  </div>`;
}

function viewContest(contestId){
  const c = DATA.contests.find(x => x.id === contestId);
  if (!c) return notFound("Contest not found");

  const games = DATA.games.filter(g => g.contestId === c.id);
  const upcoming = games.filter(g => isUpcoming(g));
  const selectedTop = c.participants.slice(0,10);

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-3">
      <a data-nav class="text-slate-500 hover:text-slate-800" href="#/contests">Турниры прогнозов</a> / ${escapeHtml(c.title)}
    </div>

    <div class="bg-white border rounded-2xl overflow-hidden mb-5">
      <div class="h-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 relative">
        <div class="absolute inset-0 opacity-25" style="background-image: radial-gradient(circle at 30% 40%, #60a5fa, transparent 55%), radial-gradient(circle at 70% 60%, #22c55e, transparent 55%);"></div>
        <div class="absolute top-4 left-5 flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white text-xs font-semibold">LOGO</div>
          <div class="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-md">Призовой фонд: ${escapeHtml((c.hero || '').split('•')[0].trim().replace('₽',''))}</div>
          <div class="bg-white/15 border border-white/20 text-white text-sm font-semibold px-3 py-1 rounded-md">Участников: ${c.participants.length}</div>
        </div>
        <div class="absolute top-4 right-5">
          <button data-join-contest="${c.id}" class="btn-primary px-4 py-2 rounded-xl text-sm">УЧАСТВОВАТЬ</button>
        </div>
        <div class="absolute bottom-4 left-5 text-white">
          <div class="text-2xl font-bold">Турнир прогнозов “${escapeHtml(c.title)}”</div>
          <div class="text-sm opacity-90 mt-1">${fmtRange(c.dateFrom, c.dateTo)} • ${c.rankBy === "Profit" ? "По прибыли" : "По очкам"}</div>
        </div>
      </div>

      <div class="p-5">
        <div>
          <p class="text-slate-700">
            “${escapeHtml(c.title)}” — турнир прогнозов на матчи топ-5 лиг. Нажми “УЧАСТВОВАТЬ” и публикуй прогнозы с коротким обоснованием (от 50 символов).
          </p>
          <div class="mt-4 flex gap-2">
            <button data-nav class="btn-soft px-4 py-2 rounded-xl text-sm" href="#/contests/${c.id}/events">Матчи</button>
            <button data-nav class="btn-soft px-4 py-2 rounded-xl text-sm" href="#/contests/${c.id}/leaderboard">Лидерборд</button>
          </div>
        </div>

        <div class="mt-5">
          <div class="font-semibold mb-2">Участники турнира</div>
          ${participantsTable(selectedTop)}
          <div class="mt-2 text-center">
            <button class="btn-soft px-4 py-2 rounded-xl text-sm">ПОКАЗАТЬ ЕЩЁ</button>
          </div>
        </div>

        <div class="mt-8">
          <div class="font-semibold mb-3">Матчи, участвующие в турнире</div>
          <div class="space-y-4">
            ${groupedByDay(upcoming.slice(0,18)).length ? groupedByDay(upcoming.slice(0,18)).map(gr => dayGroup(gr.dayLabel, gr.games, "upcoming")).join("") : `
              <div class="bg-white border rounded-2xl p-10 text-center">
                <div class="font-semibold mb-1">Нет матчей</div>
                <div class="text-sm text-slate-500">В этом турнире пока нет ближайших матчей.</div>
              </div>
            `}
          </div>
        </div>

        <div class="mt-8 space-y-4">
          <div class="bg-white border rounded-2xl p-4">
            <div class="font-semibold mb-2">Призы</div>
            <div class="divide-y">
              ${c.prizes.map(p => `
                <div class="py-2 flex items-center justify-between text-sm">
                  <div>${escapeHtml(p.place)}</div>
                  <div class="font-semibold">${escapeHtml(p.value)}</div>
                </div>`).join("")}
            </div>
          </div>

          <div class="bg-white border rounded-2xl p-4">
            <div class="font-semibold mb-2">Условия турнира</div>
            ${accordion(c.rules)}
            ${c.rulesNote ? `<div class="mt-4 text-sm text-slate-700 whitespace-pre-line leading-7">${escapeHtml(c.rulesNote)}</div>` : ""}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function viewContestLeaderboard(contestId){
  const c = DATA.contests.find(x => x.id === contestId);
  if (!c) return notFound("Contest not found");

  const rows = (c.participants.length ? c.participants : DATA.tipsters.map((t, i) => ({
    rank: i+1,
    name: t.username,
    profit: Math.round(t.profit/10),
    open: Math.max(0, 10 - t.tips),
    won: t.won,
    lost: t.lost,
    void: t.void,
    winrate: `${t.winrate}%`,
  })));

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-3">
      <a data-nav class="text-slate-500 hover:text-slate-800" href="#/contests/${c.id}">${escapeHtml(c.title)}</a> / Leaderboard
    </div>
    <div class="bg-white border rounded-2xl p-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Leaderboard</div>
        <div class="text-sm text-slate-500">Rank by <span class="font-semibold">${c.rankBy}</span></div>
      </div>
      ${participantsTable(rows.slice(0,50), true)}
    </div>
  </div>`;
}

function viewContestEvents(contestId){
  const c = DATA.contests.find(x => x.id === contestId);
  if (!c) return notFound("Contest not found");
  const tab = (new URLSearchParams(location.hash.split("?")[1] || "")).get("tab") || "upcoming";
  const games = DATA.games.filter(g => g.contestId === c.id);
  const list = tab === "results" ? games.filter(g => g.status === "finished") : games.filter(g => g.status !== "finished");

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-3">
      <a data-nav class="text-slate-500 hover:text-slate-800" href="#/contests/${c.id}">${escapeHtml(c.title)}</a> / Events
    </div>

    <div class="bg-white border rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="text-xl font-semibold">Events</div>
        <div class="flex gap-2">
          <a data-nav href="#/contests/${c.id}/events?tab=upcoming" class="px-4 py-2 rounded-xl text-sm border ${tab==="upcoming" ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}">Upcoming</a>
          <a data-nav href="#/contests/${c.id}/events?tab=results" class="px-4 py-2 rounded-xl text-sm border ${tab==="results" ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}">Results</a>
        </div>
      </div>

      <div class="bg-white border rounded-2xl overflow-hidden">
        ${matchListTable(list, {showPlus: tab==="upcoming", mode: tab, showScore: tab==="results"})}
      </div>
    </div>
  </div>`;
}

function viewEvents(){
  if (!state.ui.authenticated){
    return authRequired("Events");
  }

  const tab = state.ui.eventsTab || "upcoming";
  const today = new Date((state.ui.today || "2026-02-06") + "T00:00:00");

  const activeContestIds = new Set(
    DATA.contests
      .filter(c => (c.visibility || "Public") === "Public")
      .filter(c => new Date((c.dateTo || "2099-12-31") + "T23:59:59") >= today)
      .map(c => c.id)
  );

  const gamesAll = DATA.games.filter(g => activeContestIds.has(g.contestId));
  const games = gamesAll.filter(g => tab === "results" ? isFinished(g) : isUpcoming(g));
  const groups = groupedByDay(games);

  return `
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="text-sm text-slate-500">Турниры прогнозов</div>
        <div class="text-2xl font-semibold">События</div>
        <div class="text-sm text-slate-500 mt-1">Матчи из всех активных публичных турниров, в которых вы участвуете.</div>
      </div>
      <div class="flex gap-2">
        <button data-events-tab="upcoming" class="px-4 py-2 rounded-xl text-sm border ${tab==="upcoming" ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}">Upcoming</button>
        <button data-events-tab="results" class="px-4 py-2 rounded-xl text-sm border ${tab==="results" ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}">Results</button>
      </div>
    </div>

    <div class="space-y-4">
      ${groups.length ? groups.map(gr => dayGroup(gr.dayLabel, gr.games, tab, {showContest:true})).join("") : `
        <div class="bg-white border rounded-2xl p-10 text-center">
          <div class="font-semibold mb-1">Нет матчей</div>
          <div class="text-sm text-slate-500">Поменяйте вкладку или дату в Demo Controls.</div>
        </div>
      `}
    </div>
  </div>`;
}

function viewTipsters(){
  if (state.ui.apiMode === "empty"){
    return emptyState("Нет данных по прогнозистам", "Переключи API Mode в ok.");
  }

  const month = "Текущий месяц";
  const rows = buildTipstersRows();

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-2">Прогнозисты</div>
    <div class="text-2xl font-semibold mb-4">Рейтинг прогнозистов</div>

    <div class="bg-white border rounded-2xl p-4 mb-4">
      <div class="flex flex-wrap items-center gap-2">
        <button class="btn-primary px-3 py-2 rounded-xl text-sm">Весь спорт</button>
        ${DATA.sports.slice(0,10).map(s => `<button class="btn-soft px-3 py-2 rounded-xl text-sm">${s}</button>`).join("")}
        <div class="flex-1"></div>
        <select class="px-3 py-2 rounded-xl border bg-white text-sm">
          <option>${month}</option><option>Январь</option><option>Февраль</option>
        </select>
        <select class="px-3 py-2 rounded-xl border bg-white text-sm">
          <option>Турниры</option><option>Все</option>
        </select>
      </div>
    </div>

    <div class="bg-white border rounded-2xl overflow-hidden">
      <div class="table-sticky overflow-auto" style="max-height: 70vh;">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-slate-500">
              <th class="text-left px-4 py-3 w-14">№</th>
              <th class="text-left px-4 py-3">Прогнозист</th>
              <th class="text-left px-4 py-3">Profit</th>
              <th class="text-center px-4 py-3 w-16">+</th>
              <th class="text-center px-4 py-3 w-16">-</th>
              <th class="text-center px-4 py-3 w-16">0</th>
              <th class="text-left px-4 py-3">Yield</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            ${rows.map(r => `
              <tr class="hover:bg-slate-50">
                <td class="px-4 py-3">${r.rank}</td>
                <td class="px-4 py-3">
                  <a data-nav href="#/tipsters/${encodeURIComponent(r.username)}" class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full bg-slate-200 grid place-items-center font-semibold text-slate-700">${escapeHtml(r.username[0])}</div>
                    <div>
                      <div class="font-semibold">${escapeHtml(r.username)}</div>
                      <div class="text-xs text-slate-500">${escapeHtml(r.country)}</div>
                    </div>
                  </a>
                </td>
                <td class="px-4 py-3 font-semibold text-green-600">+${fmtInt(r.profit)}</td>
                <td class="px-4 py-3 text-center">${r.won}</td>
                <td class="px-4 py-3 text-center">${r.lost}</td>
                <td class="px-4 py-3 text-center">${r.void}</td>
                <td class="px-4 py-3">${r.yield.toFixed(2)}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="p-3 text-center">
        <button class="btn-soft px-4 py-2 rounded-xl text-sm">ПОКАЗАТЬ ЕЩЁ</button>
      </div>
    </div>
  </div>`;
}

function viewTipsterProfile(username){
  const t = findTipster(username);
  if (!t) return notFound("Tipster not found");
  const isMe = state.ui.authenticated && state.ui.username === t.username;

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-3">My profile</div>

    <div class="bg-white border rounded-2xl overflow-hidden">
      ${profileHero(t, isMe)}
      <div class="px-6 py-5">
        <div class="grid lg:grid-cols-[2fr_1fr] gap-6">
          <div>
            <div class="font-semibold mb-3">LATEST ACTIVITY</div>
            ${activityFeed(t.username)}

            <div class="mt-6 bg-white border rounded-2xl p-5">
              <div class="font-semibold mb-3">LEADERBOARDS</div>
              <div class="divide-y">
                ${[
                  {label:"Overall", value:`${t.rankOverall} of 6842`},
                  {label:t.country, value:`21 of 76`},
                  {label:t.club, value:`25 of 133`},
                  {label:"Football", value:`927 of 6094`},
                ].map(r => `
                  <div class="py-3 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="h-9 w-9 rounded-full bg-slate-100 grid place-items-center">🏅</div>
                      <div class="font-medium">${escapeHtml(r.label)}</div>
                    </div>
                    <div class="text-sm text-slate-600 font-semibold">${escapeHtml(r.value)}</div>
                  </div>
                `).join("")}
              </div>
              <div class="mt-4 text-center">
                <button class="btn-soft px-4 py-2 rounded-xl text-sm">SHOW MORE</button>
              </div>
            </div>
          </div>
          <div class="space-y-4">
            <div class="bg-slate-50 border rounded-2xl p-4">
              <div class="font-semibold mb-3">ABOUT</div>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div class="text-slate-500">Country</div>
                  <div class="font-semibold">${escapeHtml(t.country)}</div>
                </div>
                <div>
                  <div class="text-slate-500">Member since</div>
                  <div class="font-semibold">22 Nov 2024</div>
                </div>
                <div>
                  <div class="text-slate-500">Profit</div>
                  <div class="font-semibold text-green-600">+${fmtInt(t.profit)}</div>
                </div>
                <div>
                  <div class="text-slate-500">Win rate</div>
                  <div class="font-semibold">${t.winrate}%</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function viewTipsterTips(username){
  const t = findTipster(username);
  if (!t) return notFound("Tipster not found");
  const tips = listTipsForUser(username);

  const tab = (new URLSearchParams(location.hash.split("?")[1] || "")).get("tab") || "all";
  const filtered = tab==="all" ? tips : tips.filter(x => x.status === tab);

  return `
  <div class="max-w-6xl mx-auto">
    <div class="text-sm text-slate-500 mb-3">
      <a data-nav href="#/tipsters/${encodeURIComponent(username)}" class="text-slate-500 hover:text-slate-800">${escapeHtml(username)}</a> / Tips
    </div>

    <div class="bg-white border rounded-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <div class="text-xl font-semibold">Tips</div>
        <div class="flex gap-2">
          ${["all","won","lost","void","open"].map(x => `
            <a data-nav href="#/tipsters/${encodeURIComponent(username)}/tips?tab=${x}" class="px-3 py-2 rounded-xl text-sm border ${tab===x ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}">${x}</a>`).join("")}
        </div>
      </div>

      <div class="space-y-3">
        ${filtered.map(tipCard).join("") || `<div class="text-slate-500 text-sm">No tips.</div>`}
      </div>
    </div>
  </div>`;
}

function viewTipsterStats(username){
  const t = findTipster(username);
  if (!t) return notFound("Tipster not found");
  return tipStatsScreen(t, false);
}

function viewMyMatches(){
  guardAuth();
  const today = state.ui.today;
  const games = DATA.games.filter(g => g.contestId === "c1");
  const upcoming = games.filter(g => !isFinished(g));
  const results = games.filter(g => isFinished(g));

  const tab = (new URLSearchParams(location.hash.split("?")[1] || "")).get("tab") || "upcoming";
  const list = tab==="results" ? results : upcoming;

  return `
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border rounded-2xl overflow-hidden">
      ${profileHero(findTipster(state.ui.username), true)}
      <div class="px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="text-xl font-semibold">MY MATCHES</div>
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input id="chkOddsInline" type="checkbox" class="h-4 w-4" ${state.ui.showOdds ? "checked":""} />
            Show odds
          </label>
        </div>

        <div class="mt-4 bg-slate-50 border rounded-2xl p-2 flex gap-2">
          <a data-nav href="#/me/matches?tab=upcoming" class="flex-1 text-center px-4 py-2 rounded-xl text-sm ${tab==="upcoming" ? "bg-slate-900 text-white" : "hover:bg-white"}">Upcoming</a>
          <a data-nav href="#/me/matches?tab=results" class="flex-1 text-center px-4 py-2 rounded-xl text-sm ${tab==="results" ? "bg-slate-900 text-white" : "hover:bg-white"}">Results</a>
        </div>

        <div class="mt-4 space-y-4">
          ${groupedByDay(list, today).map(group => dayGroup(group.dayLabel, group.games, tab)).join("")}
        </div>
      </div>
    </div>
  </div>`;
}

function viewMyTips(){
  guardAuth();
  const tips = listTipsForUser(state.ui.username);
  const open = tips.filter(t => t.status === "open");
  const closed = tips.filter(t => t.status !== "open");
  const tab = (new URLSearchParams(location.hash.split("?")[1] || "")).get("tab") || "all";

  const closedFiltered = tab==="all" ? closed : closed.filter(x => x.status === tab);

  return `
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border rounded-2xl overflow-hidden">
      ${profileHero(findTipster(state.ui.username), true)}
      <div class="px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="text-xl font-semibold">TIPS</div>
        </div>

        <div class="mt-6">
          <div class="font-semibold mb-3">ACTIVE TIPS <span class="text-slate-400">${open.length}</span></div>
          <div class="space-y-3">
            ${open.map(tipCard).join("") || `<div class="text-sm text-slate-500">No open tips.</div>`}
          </div>
        </div>

        <div class="mt-8">
          <div class="flex items-center justify-between mb-3">
            <div class="font-semibold">CLOSED TIPS <span class="text-slate-400">${closed.length}</span></div>
            <div class="flex gap-2 bg-slate-50 border rounded-xl p-1">
              ${["all","won","lost","void"].map(x => `
                <a data-nav href="#/me/tips?tab=${x}" class="px-4 py-2 rounded-lg text-sm ${tab===x ? "bg-slate-900 text-white" : "hover:bg-white"}">${x === "void" ? "Push" : x[0].toUpperCase()+x.slice(1)}</a>
              `).join("")}
            </div>
          </div>

          <div class="space-y-3">
            ${closedFiltered.map(tipCard).join("") || `<div class="text-sm text-slate-500">No closed tips.</div>`}
          </div>

          <div class="mt-4 text-center">
            <button class="btn-soft px-4 py-2 rounded-xl text-sm">SHOW MORE</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function viewMyStats(){
  guardAuth();
  const t = findTipster(state.ui.username);
  return tipStatsScreen(t, true);
}

function tipStatsScreen(t, isMe){
  return `
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border rounded-2xl overflow-hidden">
      ${profileHero(t, isMe)}
      <div class="px-6 py-5">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xl font-semibold">TIPS STATISTICS</div>
            <div class="text-sm text-slate-500 mt-1">1 December 2025 – 28 February 2026</div>
          </div>
          <div class="flex gap-2 text-sm text-slate-600">
            <button class="btn-soft px-3 py-2 rounded-xl">BY SEASON ▼</button>
            <button class="btn-soft px-3 py-2 rounded-xl">ALL SPORTS ▼</button>
          </div>
        </div>

        <div class="mt-6 grid md:grid-cols-4 gap-3">
          ${statTile("+17.03","PROFIT")}
          ${statTile("+24.3%","YIELD")}
          ${statTile(t.avgOdds.toFixed(2),"Average Odds")}
          ${statTile("●●●●○","FORM")}
        </div>

        <div class="mt-6 bg-slate-50 border rounded-2xl p-5">
          <div class="text-center text-5xl font-bold">${t.winrate}%</div>
          <div class="text-center text-sm text-slate-500 mt-2">WIN RATE</div>
          <div class="grid grid-cols-4 gap-3 mt-5 text-center">
            ${miniStat(t.tips,"TIPS")}
            ${miniStat(t.won,"WON")}
            ${miniStat(t.lost,"LOST")}
            ${miniStat(t.void,"PUSH")}
          </div>
        </div>

        <div class="mt-6 bg-white border rounded-2xl p-5">
          <div class="text-center font-semibold mb-3">OVERALL TRACK RECORD</div>
          <div class="text-center text-xs text-slate-500 mb-3">Profit / Yield toggle is visual only in demo</div>
          <div class="h-48 rounded-2xl bg-gradient-to-b from-slate-50 to-white border flex items-end justify-end p-4">
            <div class="text-xs text-slate-400">Chart placeholder</div>
          </div>

        </div>

      </div>
    </div>
  </div>`;
}

/* -----------------------------
   Components
------------------------------ */
function participantsTable(rows, full=false){
  const list = full ? rows : rows.slice(0,10);
  return `
  <div class="bg-white border rounded-2xl overflow-hidden">
    <div class="table-sticky overflow-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-slate-500">
            <th class="px-4 py-3 text-left w-12">№</th>
            <th class="px-4 py-3 text-left">Прогнозист</th>
            <th class="px-4 py-3 text-left">Profit</th>
            <th class="px-4 py-3 text-left">Open Tips</th>
            <th class="px-4 py-3 text-center w-12">+</th>
            <th class="px-4 py-3 text-center w-12">-</th>
            <th class="px-4 py-3 text-center w-12">0</th>
            <th class="px-4 py-3 text-left">WinRate</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          ${list.map(r => `
            <tr class="hover:bg-slate-50">
              <td class="px-4 py-3">${r.rank}</td>
              <td class="px-4 py-3">
                <a data-nav href="#/tipsters/${encodeURIComponent(r.name || r.username || r.username)}" class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-full bg-slate-200 grid place-items-center font-semibold text-slate-700">${escapeHtml((r.name||r.username)[0]||"U")}</div>
                  <div class="font-medium">${escapeHtml(r.name || r.username)}</div>
                </a>
              </td>
              <td class="px-4 py-3 font-semibold">${fmtMoney(r.profit)}</td>
              <td class="px-4 py-3">${r.open}</td>
              <td class="px-4 py-3 text-center">${r.won}</td>
              <td class="px-4 py-3 text-center">${r.lost}</td>
              <td class="px-4 py-3 text-center">${r.void}</td>
              <td class="px-4 py-3">${escapeHtml(r.winrate)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function matchListTable(games, opts){
  if (!games.length) return `<div class="p-6 text-sm text-slate-500">No events.</div>`;
  const showScore = !!opts?.showScore;
  const showPlus = !!opts?.showPlus;
  const mode = opts?.mode || "upcoming";
  const showOdds = !!state.ui.showOdds;

  const rows = games.map(g => {
    const t = timeHHMM(g.dt);
    const dateLabel = dateDM(g.dt);
    const tip = state.tips[g.id];
    const tipBadge = tip ? `<span class="pill">✅ ${escapeHtml(tip.market)}: ${escapeHtml(tip.pick)} @ ${tip.odds.toFixed(2)}</span>` : "";
    const tipFinal = tip ? (tip.final || tip.status || null) : null;
    const resultIcon = (tipFinal === "won")
      ? `<span class="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-emerald-50 text-emerald-700 font-bold">✓</span>`
      : (tipFinal === "lost")
        ? `<span class="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-rose-50 text-rose-700 font-bold">✕</span>`
        : (tipFinal === "void")
          ? `<span class="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-slate-50 text-slate-700 font-bold">=</span>`
          : `<span class="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-slate-50 text-slate-400">–</span>`;

    return `
      <div class="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 ${mode==="results" ? "" : "hover:bg-slate-50"}">
        <div class="w-24 text-xs text-slate-500">
          <div class="font-semibold text-slate-700">${t}</div>
          <div>${dateLabel}</div>
        </div>
        <div class="flex-1">
          <div class="text-xs text-slate-500 mb-1">${escapeHtml(g.league)}</div>
          <div class="font-medium">${escapeHtml(g.home)} <span class="text-slate-400">vs</span> ${escapeHtml(g.away)}</div>
          ${showScore && g.score ? `<div class="text-xs text-slate-500 mt-1">FT • ${escapeHtml(g.score)}</div>` : ""}
          ${tip ? `<div class="mt-2">${tipBadge}</div>` : ""}
        </div>

        ${showOdds ? `
          <div class="hidden sm:flex items-center gap-2">
            ${["1","X","2"].map(k => `<button class="odds-btn ${tip && tip.pick===k && tip.market==='Match Result' ? "selected":""}" data-quick-pick="${g.id}" data-code="${k}">${g.odds[k].toFixed(2)}</button>`).join("")}
          </div>` : `<div class="hidden sm:block text-xs text-slate-400">odds hidden</div>`}

        ${showPlus ? `
          <button class="h-9 w-9 rounded-xl border bg-white hover:bg-slate-50 grid place-items-center" data-open-tip="${g.id}" title="Add tip">+</button>
        ` : (mode==="results" ? resultIcon : "")}
      </div>`;
  }).join("");

  return `<div>${rows}</div>`;
}

function accordion(items){
  return `
    <div class="space-y-2">
      ${items.map((it, idx) => `
        <details class="group border rounded-2xl p-3 bg-slate-50" ${idx===0 ? "open":""}>
          <summary class="cursor-pointer flex items-center justify-between font-medium">
            <span>${escapeHtml(it.title)}</span>
            <span class="text-slate-400 group-open:rotate-180 transition">⌃</span>
          </summary>
          <div class="mt-2 text-sm text-slate-600 space-y-1">
            ${it.body.map(line => `<div>• ${escapeHtml(line)}</div>`).join("")}
          </div>
        </details>
      `).join("")}
    </div>`;
}

function profileHero(t, isMe=false){
  const username = t?.username || "User";
  const tabs = [
    {label:"HOME", href:`#/tipsters/${encodeURIComponent(username)}`},
    {label:"MATCHES", href:`#/me/matches`, me:true},
    {label:"TIPS", href:`#/me/tips`, me:true},
    {label:"STATS", href:`#/me/stats`, me:true},
  ];
  const active = (h) => (location.hash || "").startsWith(h.replace("#","")) ? "border-b-4 border-sky-500 text-white" : "text-slate-200 hover:text-white";
  return `
  <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 relative">
    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 30% 30%, #60a5fa, transparent 50%), radial-gradient(circle at 70% 60%, #22c55e, transparent 55%);"></div>
    <div class="relative px-6 pt-6 pb-5">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="h-20 w-20 rounded-full bg-white/10 border border-white/20 grid place-items-center text-3xl font-bold text-white">${escapeHtml(username[0]||"U")}</div>
          <div>
            <div class="text-white text-2xl font-semibold">${escapeHtml(username)}</div>
            <div class="flex gap-2 mt-2 text-xs text-white/80">
              <span class="pill bg-white/10 border-white/20 text-white">0 FOLLOWING</span>
              <span class="pill bg-white/10 border-white/20 text-white">1 FOLLOWERS</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-white/80">
          <button class="h-9 w-9 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15">↗</button>
          <button class="h-9 w-9 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15">⋯</button>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-5 gap-4 text-xs">
        ${tabs.filter(x => !x.me || isMe).map(tab => `
          <a data-nav href="${tab.href}" class="text-center py-3 ${active(tab.href)}">${tab.label}</a>
        `).join("")}
      </div>
    </div>
  </div>`;
}

function activityFeed(username){
  const items = [
    {ago:"a minute ago", match:"Lechia Gdansk - Cracovia", pick:"FULL TIME RESULT: DRAW", odds:3.40, status:"open"},
    {ago:"3 minutes ago", match:"Union Berlin - Eintracht Frankfurt", pick:"FULL TIME RESULT: UNION BERLIN", odds:2.05, status:"open"},
    {ago:"15 days ago", match:"Freiburg - Maccabi Tel Aviv", pick:"FULL TIME RESULT: FREIBURG", odds:1.22, status:"won"},
    {ago:"a month ago", match:"Ivory Coast - Burkina Faso", pick:"1ST HALF TOTAL GOALS: OVER 0.75", odds:1.88, status:"won"},
    {ago:"a month ago", match:"West Ham - Nottingham Forest", pick:"1ST HALF TOTAL GOALS: OVER 0.75", odds:1.55, status:"won"},
  ];
  return `
    <div class="space-y-3">
      ${items.map(i => activityCard(username, i)).join("")}
      <div class="text-center">
        <button class="btn-soft px-4 py-2 rounded-xl text-sm">SHOW OLDER POSTS</button>
      </div>
    </div>`;
}

function activityCard(username, item){
  const color = item.status==="won" ? "border-green-300" : item.status==="lost" ? "border-red-300" : "border-slate-200";
  const chip = item.status==="won" ? "bg-green-500" : item.status==="lost" ? "bg-red-500" : "bg-sky-500";
  return `
    <div class="bg-white border rounded-2xl overflow-hidden">
      <div class="px-4 py-3 flex items-center justify-between text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full bg-slate-200 grid place-items-center font-semibold text-slate-700">${escapeHtml(username[0])}</div>
          <div>
            <div class="font-semibold text-slate-700">${escapeHtml(username)}</div>
            <div class="text-slate-500">+17.03 • 8 Tips</div>
          </div>
        </div>
        <div>${escapeHtml(item.ago)}</div>
      </div>

      <div class="px-4 py-3 border-t ${color}">
        <div class="text-xs text-slate-500">${escapeHtml(item.match)}</div>
        <div class="font-semibold text-slate-700">${escapeHtml(item.pick)}</div>
      </div>

      <div class="px-4 py-3 border-t flex items-center justify-between">
        <div class="flex items-center gap-3 text-sm text-slate-600">
          <button class="btn-soft px-3 py-1.5 rounded-xl text-xs">👍 Support</button>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center justify-center h-9 w-20 rounded-xl text-white font-semibold ${chip}">${item.odds.toFixed(2)}</span>
          <button class="btn-soft px-3 py-1.5 rounded-xl text-xs">Reply</button>
        </div>
      </div>
    </div>`;
}

function tipCard(t){
  const status = t.status;
  const color = status==="won" ? "border-green-400" : status==="lost" ? "border-red-400" : "border-slate-200";
  const badge = status==="won" ? "bg-green-500" : status==="lost" ? "bg-red-500" : status==="void" ? "bg-slate-500" : "bg-sky-500";
  const statusMark = status === "won"
    ? `<span class="text-green-600 font-bold text-xl leading-none">✓</span>`
    : status === "lost"
      ? `<span class="text-red-500 font-bold text-xl leading-none">✕</span>`
      : status === "void"
        ? `<span class="text-slate-500 font-bold text-xs uppercase tracking-wide">Push</span>`
        : ``;
  return `
    <div class="bg-white border rounded-2xl overflow-hidden">
      <div class="px-4 py-3 flex items-center justify-between text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-full bg-slate-200 grid place-items-center font-semibold text-slate-700">${escapeHtml(t.username[0])}</div>
          <div>
            <div class="font-semibold text-slate-700">${escapeHtml(t.username)}</div>
            <div class="text-slate-500">${fmtSigned(t.profitDelta)}</div>
          </div>
        </div>
        <div>${escapeHtml(t.ago)}</div>
      </div>

      <div class="px-4 py-3 border-t ${color} flex items-center justify-between gap-4">
        <div class="min-w-0">
          <div class="text-xs text-slate-500">${escapeHtml(t.match)}</div>
          <div class="font-semibold text-slate-700">${escapeHtml(t.market)}: ${escapeHtml(t.pickLabel)}</div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          ${statusMark}
          <span class="inline-flex items-center justify-center h-9 w-20 rounded-xl text-white font-semibold ${badge}">${t.odds.toFixed(2)}</span>
        </div>
      </div>
    </div>`;
}

function dayGroup(dayLabel, games, mode="upcoming", opts={}){
  const isResults = mode === "results";
  const showContest = !!opts.showContest;
  return `
    <section class="bg-white border rounded-2xl overflow-hidden">
      <div class="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
        <div class="font-semibold italic">${escapeHtml(dayLabel)}</div>
        <div class="text-xs opacity-80">${games.length} events</div>
      </div>
      <div class="px-4 py-3 text-sm font-semibold text-slate-700 flex items-center gap-2">
        <span class="text-slate-500">⚽</span> Football
      </div>
      <div class="border-t">
        ${games.map(g => {
          const contestTitle = showContest ? ((DATA.contests.find(c => c.id === g.contestId)?.title) || "") : "";
          const contestPrefix = (showContest && contestTitle) ? `${escapeHtml(contestTitle)} • ` : "";
          const tip = (state.tips || {})[g.id];
          const derivedStatus = isResults && tip ? deriveTipFinalStatus(g, tip) : (tip?.status);
          const resIcon = (!derivedStatus || derivedStatus === "open") ? `
              <div class="h-10 w-10 rounded-xl border bg-white grid place-items-center text-slate-300">—</div>
            ` : (derivedStatus === "won" ? `
              <div class="h-10 w-10 rounded-xl border bg-white grid place-items-center text-green-600 font-bold">✓</div>
            ` : `
              <div class="h-10 w-10 rounded-xl border bg-white grid place-items-center text-red-600 font-bold">✕</div>
            `);
          return `
            <div class="flex items-center justify-between px-4 py-4 border-b last:border-b-0 ${isResults ? "" : "hover:bg-slate-50"}">
              <div class="flex items-center gap-4">
                <div class="w-16 text-xs text-slate-500">${timeHHMM(g.dt)}</div>
                <div>
                  <div class="text-xs text-slate-500">${contestPrefix}${escapeHtml(g.league)}${isResults && g.score ? ` • <span class=\"text-slate-700\">${escapeHtml(g.score)}</span>` : ""}</div>
                  <div class="font-medium">${escapeHtml(g.home)} <span class="text-slate-400">vs</span> ${escapeHtml(g.away)}</div>
                </div>
              </div>
	              <div class="flex items-center gap-3">
	                ${(((!isResults && state.ui.showOdds && tip) || (isResults && state.ui.showOdds && tip && tip.market && (tip.odds != null))) ) ? `<div class="text-right text-xs">
	                  <div class="font-semibold text-slate-700">Your Bet</div>
	                  <div class="text-slate-500">${escapeHtml(tip.market || "")}</div>
	                </div>
	                <div class="h-12 w-20 rounded-xl border bg-white grid place-items-center font-semibold">${Number(tip.odds || pickRandomOdds(g)).toFixed(2)}</div>` : ``}
	                ${isResults ? resIcon : `<button class="h-10 w-10 rounded-xl border bg-white hover:bg-slate-50 grid place-items-center" data-open-tip="${g.id}">+</button>`}
	              </div>
            </div>
          `;
        }).join("")}
      </div>
    </section>`;
}

function statTile(value, label){
  return `
    <div class="bg-slate-50 border rounded-2xl p-4 text-center">
      <div class="text-xl font-bold text-green-600">${escapeHtml(value)}</div>
      <div class="text-xs text-slate-500">${escapeHtml(label)}</div>
    </div>`;
}
function miniStat(value, label){
  return `
    <div class="bg-white border rounded-2xl p-3">
      <div class="text-xl font-bold">${escapeHtml(String(value))}</div>
      <div class="text-xs text-slate-500">${escapeHtml(label)}</div>
    </div>`;
}

/* -----------------------------
   Events & handlers binding
------------------------------ */
function attachShellHandlers(){
  // topbar auth
  const btnAuth = $("#btnAuth");
  if (btnAuth) btnAuth.onclick = () => {
    state.ui.authenticated = !state.ui.authenticated;
    if (!state.ui.authenticated){
      state.ui.modalOpen = false;
      state.ui.modal = null;
    }
    saveState(); render();
  };

  // show/hide demo controls (desktop)
  const btnToggleControls = $("#btnToggleControls");
  if (btnToggleControls) btnToggleControls.onclick = () => {
    state.ui.showControls = !state.ui.showControls;
    saveState(); render();
  };
  const btnHideControls = $("#btnHideControls");
  if (btnHideControls) btnHideControls.onclick = () => {
    state.ui.showControls = false;
    saveState(); render();
  };

  // demo controls
  $$("#app [data-api-mode]").forEach(b => b.onclick = () => {
    state.ui.apiMode = b.getAttribute("data-api-mode");
    saveState(); render();
  });

  const today = $("#today");
  if (today) today.onchange = () => { state.ui.today = today.value || DEFAULT_TODAY; saveState(); render(); };
  const btnToday = $("#btnToday");
  if (btnToday) btnToday.onclick = () => { state.ui.today = DEFAULT_TODAY; saveState(); render(); };

  const selUser = $("#selUser");
  if (selUser) selUser.onchange = () => { state.ui.username = selUser.value; saveState(); render(); };

  const btnProfile = $("#btnProfile");
  if (btnProfile) btnProfile.onclick = () => navTo(`#/tipsters/${encodeURIComponent(state.ui.username)}`);

  const chkOdds = $("#chkOdds");
  if (chkOdds) chkOdds.onchange = () => { state.ui.showOdds = chkOdds.checked; saveState(); render(); };

  const chkOddsInline = $("#chkOddsInline");
  if (chkOddsInline) chkOddsInline.onchange = () => { state.ui.showOdds = chkOddsInline.checked; saveState(); render(); };

  const btnResetTips = $("#btnResetTips");
  if (btnResetTips) btnResetTips.onclick = () => {
    if (!confirm("Reset all saved tips in this demo?")) return;
    state.tips = {};
    saveState(); render();
  };

  // tip modal open buttons
  $$("#app [data-open-tip]").forEach(btn => {
    btn.onclick = () => openTipModal(btn.getAttribute("data-open-tip"));
  });

  // quick pick odds buttons (selects Match Result in modal then opens it)
  $$("#app [data-quick-pick]").forEach(btn => {
    btn.onclick = () => {
      openTipModal(btn.getAttribute("data-quick-pick"));
      // after render modal, auto-select pick
      const code = btn.getAttribute("data-code");
      state.ui.modal.pick = { market:"Match Result", code, odds: state.ui.modal.game.odds[code] };
      saveState(); render();
    };
  });

  // join contest (demo)
  $$("#app [data-join-contest]").forEach(btn => {
    btn.onclick = () => {
      if (!state.ui.authenticated){
        toast("Login required to join (demo).");
        return;
      }
      toast("Joined contest (demo).");
    };
  });

  // events page tabs
  $$("#app [data-events-tab]").forEach(btn => {
    btn.onclick = () => {
      state.ui.eventsTab = btn.getAttribute("data-events-tab") || "upcoming";
      saveState();
      render();
    };
  });

  // modal handlers
  if (state.ui.modalOpen){
    $$("#app [data-modal-close], #app [data-modal-cancel]").forEach(b => b.onclick = () => closeModal());
    const saveBtn = $("#app [data-modal-save]");
    if (saveBtn) saveBtn.onclick = () => {
      const m = state.ui.modal;
      if (!m?.pick) return;
      // save tip
      state.tips[m.game.id] = {
        id: uid(),
        username: state.ui.username,
        gameId: m.game.id,
        market: m.pick.market,
        pick: m.pick.code,
        odds: m.pick.odds ?? deriveOddsFromPick(m.game, m.pick),
        createdAt: new Date().toISOString(),
        status: isFinished(m.game) ? "won" : "open",
        stake: 100,
        profitDelta: isFinished(m.game) ? Math.round(100*(m.pick.odds-1)) : 0,
      };
      saveState();
      closeModal();
      toast("Tip submitted (demo).");
    };

    $$("#app [data-pick-market]").forEach(b => b.onclick = () => {
      const market = b.getAttribute("data-pick-market");
      const code = b.getAttribute("data-pick-code");
      const oddsAttr = b.getAttribute("data-pick-odds");
      const odds = oddsAttr ? Number(oddsAttr) : (state.ui.modal.game.odds[code] || 2.00);
      state.ui.modal.pick = { market, code, odds };
      saveState(); render();
    });
  }
}

/* -----------------------------
   Helpers: tips, dates, filters
------------------------------ */
function listTipsForUser(username){
  // merge saved tips + some filler "history"
  const base = Object.values(state.tips || {}).filter(t => t.username === username).map(t => {
    const g = DATA.games.find(x => x.id === t.gameId);
    return {
      id: t.id,
      username,
      match: g ? `${g.home} - ${g.away}` : "Match",
      market: t.market,
      pickLabel: labelPick(t.market, t.pick),
      odds: t.odds,
      status: t.status,
      stake: t.stake,
      profitDelta: t.profitDelta,
      ago: "just now",
    };
  });

  const filler = [
    {id:"f1", username, match:"Freiburg - Maccabi Tel Aviv", market:"FULL TIME RESULT", pickLabel:"FREIBURG", odds:1.22, status:"won", stake:100, profitDelta:22, ago:"15 days ago"},
    {id:"f2", username, match:"Montpellier - Dunkerque", market:"TOTAL GOALS", pickLabel:"UNDER 3.25", odds:1.30, status:"lost", stake:100, profitDelta:-100, ago:"a month ago"},
    {id:"f3", username, match:"Galatasaray - Trabzonspor", market:"1ST HALF TOTAL GOALS", pickLabel:"OVER 0.75", odds:1.34, status:"won", stake:100, profitDelta:34, ago:"a month ago"},
  ];

  const combined = [...base, ...filler];
  // de-dup by match+market+pick
  const seen = new Set();
  return combined.filter(t => {
    const k = `${t.match}|${t.market}|${t.pickLabel}|${t.odds}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function findTipster(username){
  return DATA.tipsters.find(t => t.username.toLowerCase() === String(username).toLowerCase());
}

function buildTipstersRows(){
  // demo: big list by duplicating seed
  const seed = DATA.tipsters;
  const out = [];
  let rank = 1;
  for (let i=0;i<50;i++){
    const s = seed[i % seed.length];
    out.push({
      rank,
      username: s.username + (i>=seed.length ? ` ${i}` : ""),
      country: s.country,
      profit: s.profit + i*1200,
      won: s.won + (i%5),
      lost: s.lost + (i%3),
      void: s.void,
      yield: s.yield + (i%7)*1.1,
    });
    rank++;
  }
  return out;
}

function groupedByDay(games, todayISO){
  // build Today/Tomorrow headings similar to screenshot
  const today = new Date(todayISO + "T00:00:00");
  const tomorrow = new Date(today.getTime()+86400000);
  const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());
  const safeISO = (d) => isValidDate(d) ? d.toISOString().slice(0,10) : null;
  const label = (d) => {
    const ds = safeISO(d);
    if (!ds) return "—";
    if (ds === todayISO) return "Today";
    if (ds === safeISO(tomorrow)) return "Tomorrow";
    return d.toLocaleDateString(undefined,{day:"2-digit",month:"short"});
  };

  const groups = new Map();
  for (const g of games){
    // Some demo rows may not have dt. Try common fallbacks.
    const d = new Date(g.dt || g.date || g.kickoff || g.startAt || "");
    const k = safeISO(d);
    if (!k) continue; // skip invalid rows instead of crashing the whole page
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(g);
  }
  const sorted = Array.from(groups.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  const dtStr = (x) => (x.dt || x.date || x.kickoff || x.startAt || "").toString();
  return sorted.map(([day, list]) => ({
    dayLabel: label(new Date(day+"T00:00:00")),
    games: list.sort((a,b)=>dtStr(a).localeCompare(dtStr(b)))
  }));
}

function isFinished(g){ return g.status === "finished"; }

// Derive a stable Won/Lost result for a finished game tip.
// In the real product this comes from the backend (settlement). In demo we infer it.
function deriveTipFinalStatus(game, tip){
  if (!tip) return "open";
  if (!isFinished(game)) return tip.status || "open";

  // If already finalized, respect persisted status.
  if (tip.status === "won" || tip.status === "lost") return tip.status;

  // Try to infer for Match Result (1/X/2).
  const pickCode = (tip.pickCode || tip.pick || "").toString().trim();
  if (pickCode && game.score && /^(1|x|2)$/i.test(pickCode)){
    const [hg, ag] = game.score.split(":").map(n => Number(n));
    if (Number.isFinite(hg) && Number.isFinite(ag)){
      const actual = hg > ag ? "1" : (hg === ag ? "X" : "2");
      return actual.toUpperCase() === pickCode.toUpperCase() ? "won" : "lost";
    }
  }

  // Fallback: deterministic pseudo-random for demo.
  const seed = `${state.ui.user || "guest"}:${game.id}:${pickCode}`;
  let h = 0; for (let i=0;i<seed.length;i++) h = (h*31 + seed.charCodeAt(i)) >>> 0;
  return (h % 2 === 0) ? "won" : "lost";
}
function isUpcoming(g){ return !isFinished(g); }

function fmtRange(from, to){
  const a = new Date(from + "T00:00:00");
  const b = new Date(to + "T00:00:00");
  const opts = {day:"2-digit",month:"short"};
  return `${a.toLocaleDateString(undefined,opts)} — ${b.toLocaleDateString(undefined,opts)}`;
}

function fmtDateTime(dt){
  const d = new Date(dt);
  return d.toLocaleString(undefined,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
}
function timeHHMM(dt){
  const d = new Date(dt);
  return d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});
}
function dateDM(dt){
  const d = new Date(dt);
  return d.toLocaleDateString(undefined,{day:"2-digit",month:"2-digit"});
}

function fmtMoney(n){
  const v = Number(n||0);
  const s = v.toLocaleString(undefined);
  return `${v>=0?"+":""}${s} ₽`;
}
function fmtInt(n){ return Number(n||0).toLocaleString(undefined); }
function fmtSigned(n){ const v=Number(n||0); return `${v>=0?"+":""}${v.toLocaleString(undefined)}`; }

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,"&quot;"); }

function correctScoreOptions(){
  // copied feel from screenshot
  return [
    {code:"0:0", odds:8.70},
    {code:"0:1", odds:10.00},
    {code:"0:2", odds:15.00},
    {code:"0:3", odds:41.00},
    {code:"1:0", odds:7.50},
    {code:"1:1", odds:6.50},
    {code:"1:2", odds:11.00},
    {code:"1:3", odds:23.00},
    {code:"2:0", odds:9.50},
    {code:"2:1", odds:8.00},
    {code:"2:2", odds:12.00},
    {code:"2:3", odds:26.00},
    {code:"3:0", odds:15.00},
    {code:"3:1", odds:14.00},
    {code:"3:3", odds:50.00},
    {code:"4:0", odds:41.00},
    {code:"4:1", odds:36.00},
  ];
}

function deriveOddsFromPick(game, pick){
  if (pick.market === "Match Result") return game.odds[pick.code] || 2.0;
  if (pick.market === "Correct Score"){
    const o = correctScoreOptions().find(x => x.code === pick.code);
    return o ? o.odds : 10.0;
  }
  return 2.0;
}

function labelPick(market, code){
  if (market === "Match Result"){
    return code === "1" ? "Home" : code === "X" ? "Draw" : "Away";
  }
  return code;
}

function pickRandomOdds(game){
  const arr = Object.values(game.odds);
  return arr[Math.floor(Math.random()*arr.length)] || 1.9;
}

/* -----------------------------
   States for empty/error
------------------------------ */
function emptyState(title, desc){
  return `
  <div class="max-w-6xl mx-auto">
    <div class="bg-white border rounded-2xl p-10 text-center">
      <div class="text-2xl font-semibold mb-2">${escapeHtml(title)}</div>
      <div class="text-slate-500">${escapeHtml(desc)}</div>
    </div>
  </div>`;
}

function errorState(){
  return `
  <div class="max-w-4xl mx-auto">
    <div class="bg-white border rounded-2xl p-8">
      <div class="text-xl font-semibold text-red-600 mb-2">API error (demo)</div>
      <div class="text-slate-600">Switch Demo Controls → API Mode to <b>ok</b>.</div>
      <div class="mt-4 text-xs text-slate-500 demo-mono">This is a simulated failure state.</div>
    </div>
  </div>`;
}

function notFound(msg){
  return `<div class="max-w-4xl mx-auto"><div class="bg-white border rounded-2xl p-8"><div class="text-xl font-semibold mb-2">${escapeHtml(msg)}</div><a data-nav href="#/contests" class="text-blue-600 underline">Go to contests</a></div></div>`;
}

function guardAuth(){
  if (!state.ui.authenticated){
    navTo("#/contests");
    toast("Login required to access My pages (demo).");
  }
}

/* -----------------------------
   Simple toast
------------------------------ */
let toastTimer = null;
function toast(text){
  const id = "toast";
  const old = document.getElementById(id);
  if (old) old.remove();
  const el = document.createElement("div");
  el.id = id;
  el.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white text-sm px-4 py-2 rounded-xl shadow-soft";
  el.textContent = text;
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.remove(); }, 2200);
}

/* -----------------------------
   State persistence
------------------------------ */
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      const parsed = JSON.parse(raw);
      return normalizeState(parsed);
    }
  }catch(e){}
  return normalizeState({
    ui: {
      apiMode: "ok",
      today: DEFAULT_TODAY,
      authenticated: true,
      username: "PesPatron",
      showOdds: true,
      showControls: true,
      modalOpen: false,
      modal: null,
    },
    tips: {}
  });
}

function normalizeState(s){
  s.ui = s.ui || {};
  return {
    ui: {
      apiMode: s.ui.apiMode || "ok",
      today: s.ui.today || DEFAULT_TODAY,
      authenticated: !!s.ui.authenticated,
      username: s.ui.username || "PesPatron",
      showOdds: s.ui.showOdds !== false,
      showControls: s.ui.showControls !== false,
      modalOpen: !!s.ui.modalOpen,
      modal: s.ui.modal || null,
    },
    tips: s.tips || {}
  };
}

function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
}

function navTo(h){
  if (location.hash === h){ render(); return; }
  location.hash = h;
}

/* -----------------------------
   Init
------------------------------ */
render();
