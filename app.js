// ===== 表示する都市の一覧 =====
// name: 表示名 / region: 地域名 / query: wttr.in に渡す地名（英語）
// ここに行を足すだけで都市を増やせます。
const CITIES = [
  { name: "高松", region: "香川県", query: "Takamatsu" },
  { name: "東京", region: "東京都", query: "Tokyo" },
];

// ===== 天気コード（数字）を絵文字に変換する対応表 =====
// wttr.in は天気を数字（WWOコード）で返すので、絵文字に置き換えます。
const ICON = {
  113: "☀️", 116: "🌤️", 119: "☁️", 122: "☁️",
  143: "🌫️", 248: "🌫️", 260: "🌫️",
  176: "🌦️", 263: "🌦️", 266: "🌦️", 293: "🌦️", 296: "🌧️", 299: "🌧️", 302: "🌧️",
  305: "🌧️", 308: "🌧️", 353: "🌦️", 356: "🌧️", 359: "🌧️",
  179: "🌨️", 182: "🌨️", 227: "🌨️", 230: "❄️", 323: "🌨️", 326: "🌨️", 329: "🌨️",
  332: "🌨️", 335: "❄️", 338: "❄️", 368: "🌨️", 371: "❄️",
  185: "🌧️", 281: "🌧️", 284: "🌧️", 311: "🌧️", 314: "🌧️",
  317: "🌨️", 320: "🌨️", 362: "🌨️", 365: "🌨️",
  350: "🧊", 374: "🧊", 377: "🧊",
  200: "⛈️", 386: "⛈️", 389: "⛈️", 392: "⛈️", 395: "⛈️",
};

// コードに対応する絵文字を返す（未対応なら温度計マーク）
function icon(code) {
  return ICON[code] || "🌡️";
}

// 曜日の表示用
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// APIから返る日本語の天気説明を取り出す
function jaDesc(obj) {
  if (obj.lang_ja && obj.lang_ja[0]) return obj.lang_ja[0].value;
  if (obj.weatherDesc && obj.weatherDesc[0]) return obj.weatherDesc[0].value;
  return "";
}

// ===== 1都市の天気データを取得する =====
async function loadCity(city) {
  const url = `https://wttr.in/${encodeURIComponent(city.query)}?format=j1&lang=ja`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

// ===== 取得したデータをHTML（カード）に組み立てる =====
function renderCity(city, data) {
  const cur = data.current_condition[0];             // 現在の天気
  const windMs = Math.round(Number(cur.windspeedKmph) / 3.6); // km/h → m/s

  // 3日ぶんの予報を作る
  const days = data.weather.slice(0, 3).map(function (w) {
    const dt = new Date(w.date + "T00:00:00");
    const noon = w.hourly[Math.min(4, w.hourly.length - 1)]; // 正午ごろの天気
    return `<div class="day">
      <div class="d">${dt.getMonth() + 1}/${dt.getDate()}(${WEEK[dt.getDay()]})</div>
      <div class="di">${icon(Number(noon.weatherCode))}</div>
      <div class="t"><span class="max">${w.maxtempC}°</span>
        <span class="min">${w.mintempC}°</span></div>
    </div>`;
  }).join("");

  return `<div class="card">
    <div class="city">${city.name}</div>
    <div class="region">${city.region}</div>
    <div class="now">
      <div class="icon">${icon(Number(cur.weatherCode))}</div>
      <div>
        <div class="temp">${cur.temp_C}°</div>
        <div class="desc">${jaDesc(cur)}</div>
      </div>
    </div>
    <div class="meta">
      <div>体感 <b>${cur.FeelsLikeC}°</b></div>
      <div>湿度 <b>${cur.humidity}%</b></div>
      <div>風速 <b>${windMs} m/s</b></div>
    </div>
    <div class="forecast">${days}</div>
  </div>`;
}

// ===== すべての都市を取得して画面に表示する =====
async function loadAll() {
  const grid = document.getElementById("grid");
  const updated = document.getElementById("updated");
  grid.innerHTML = `<div class="loading">読み込み中…</div>`;

  try {
    // すべての都市を同時に取得
    const results = await Promise.all(CITIES.map(loadCity));
    // 取得したデータをカードに変換して並べる
    grid.innerHTML = CITIES.map(function (c, i) {
      return renderCity(c, results[i]);
    }).join("");

    // 更新時刻を表示
    const now = new Date();
    updated.textContent = `更新: ${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} `
      + `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  } catch (e) {
    grid.innerHTML = `<div class="error">取得に失敗しました: ${e.message}<br>時間をおいて「更新」を押してください。</div>`;
    updated.textContent = "";
  }
}

// 「更新」ボタンから呼べるように、グローバルに登録
window.loadAll = loadAll;

// ページを開いたとき最初に1回実行
loadAll();
