const STORAGE_KEY = "concert-calendar-events-v1";

const SUBMISSION_SHEET_URL = "https://docs.qq.com/sheet/DT1BqUkdwWEpPbnJ5?tab=000001";

const officialRows = [
  { dateText: "2026.06.12-2026.06.14", artist: "蔡依林", tour: "Pleasure世界巡回演唱会", venue: "国家体育场（鸟巢）", city: "北京", province: "北京" },
  { dateText: "2026.06.20", artist: "蔡依林", tour: "Pleasure世界巡回演唱会", venue: "沈阳奥林匹克体育中心体育场", city: "沈阳", province: "辽宁" },
  { dateText: "2026.06.26-2026.06.28", artist: "周杰伦", tour: "嘉年华II世界巡回演唱会 龙拳北京站", venue: "国家体育场（鸟巢）", city: "北京", province: "北京" },
  { dateText: "2026.07.04", artist: "蔡依林", tour: "Pleasure世界巡回演唱会", venue: "山西体育中心体育场", city: "太原", province: "山西" },
  { dateText: "2026.07.10-2026.07.12", artist: "邓紫棋", tour: "I AM GLORIA 2.0世界巡回演唱会", venue: "杭州奥体中心体育场", city: "杭州", province: "浙江" },
  { dateText: "2026.07.11", artist: "蔡依林", tour: "Pleasure世界巡回演唱会", venue: "南昌国际体育中心体育场", city: "南昌", province: "江西" },
  { dateText: "2026.07.11-2026.07.12", artist: "黎明", tour: "LEON LAI ROBBABA巡回演唱会", venue: "宝能国际体育演艺中心", city: "广州", province: "广东" },
  { dateText: "2026.07.17、2026.07.19", artist: "蔡依林", tour: "Pleasure世界巡回演唱会", venue: "东安湖体育公园主体育场", city: "成都", province: "四川" },
  { dateText: "2026.07.24-2026.07.26", artist: "邓紫棋", tour: "I AM GLORIA 2.0世界巡回演唱会", venue: "天津奥林匹克中心体育场", city: "天津", province: "天津" },
  { dateText: "2026.07.25", artist: "黎明", tour: "LEON LAI ROBBABA巡回演唱会", venue: "东安湖体育公园多功能体育馆", city: "成都", province: "四川" },
  { dateText: "2026.08.07-2026.08.09", artist: "邓紫棋", tour: "I AM GLORIA 2.0世界巡回演唱会", venue: "南昌国际体育中心体育场", city: "南昌", province: "江西" },
  { dateText: "2026.08.21-2026.08.23", artist: "邓紫棋", tour: "I AM GLORIA 2.0世界巡回演唱会", venue: "重庆奥体中心体育场", city: "重庆", province: "重庆" },
  { dateText: "2026.08.29-2026.08.30", artist: "蔡依林", tour: "Pleasure世界巡回演唱会", venue: "天津奥林匹克中心体育场", city: "天津", province: "天津" },
  { dateText: "2026.09.18-2026.09.20", artist: "邓紫棋", tour: "I AM GLORIA 2.0世界巡回演唱会", venue: "深圳大运中心体育场", city: "深圳", province: "广东" },
  { dateText: "2026.09.25-2026.09.27", artist: "邓紫棋", tour: "I AM GLORIA 2.0世界巡回演唱会", venue: "深圳大运中心体育场", city: "深圳", province: "广东" },
  { dateText: "2026.07.16-2026.07.17", artist: "TF家族", tour: "TF家族运动会", venue: "澳门银河综艺馆", city: "澳门", province: "澳门" }
];

const seedEvents = expandOfficialRows(officialRows);

function expandOfficialRows(rows) {
  return rows.flatMap((row, rowIndex) =>
    expandDateText(row.dateText).map((date, dateIndex) => ({
      id: `${slugify(row.artist)}-${date}-${rowIndex}-${dateIndex}`,
      date,
      artist: row.artist,
      city: row.city,
      province: row.province,
      venue: row.venue,
      tour: row.tour,
      source: "2026年6-12月已官宣演唱会汇总.xlsx",
      officialOnly: true
    }))
  );
}

function expandDateText(dateText) {
  return String(dateText)
    .split("、")
    .flatMap((part) => {
      const normalized = part.trim();
      if (!normalized) return [];
      if (!normalized.includes("-")) return [normalizeDateText(normalized)];
      const [startText, endText] = normalized.split("-").map((value) => value.trim());
      const dates = [];
      const current = parseDateText(startText);
      const end = parseDateText(endText);
      while (current <= end) {
        dates.push(formatDateObject(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });
}

function parseDateText(value) {
  const [year, month, day] = value.split(".").map(Number);
  return new Date(year, month - 1, day);
}

function normalizeDateText(value) {
  return formatDateObject(parseDateText(value));
}

function formatDateObject(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}
const state = {
  month: "2026-07",
  selectedId: null,
  events: loadEvents()
};

const els = {
  monthPicker: document.querySelector("#monthPicker"),
  cityFilter: document.querySelector("#cityFilter"),
  searchInput: document.querySelector("#searchInput"),
  prevMonth: document.querySelector("#prevMonth"),
  nextMonth: document.querySelector("#nextMonth"),
  calendarTitle: document.querySelector("#calendarTitle"),
  calendarGrid: document.querySelector("#calendarGrid"),
  eventCount: document.querySelector("#eventCount"),
  eventList: document.querySelector("#eventList"),
  detailNote: document.querySelector("#detailNote"),
  detailDate: document.querySelector("#detailDate"),
  detailCity: document.querySelector("#detailCity"),
  detailArtist: document.querySelector("#detailArtist"),
  detailSentence: document.querySelector("#detailSentence"),
  detailTour: document.querySelector("#detailTour"),
  detailVenue: document.querySelector("#detailVenue"),
  eventForm: document.querySelector("#eventForm")
};

function loadEvents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return dedupeEvents(seedEvents);
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? dedupeEvents(mergeSeedEvents(parsed)) : dedupeEvents(seedEvents);
  } catch {
    return dedupeEvents(seedEvents);
  }
}

function mergeSeedEvents(savedEvents) {
  const cleanedSavedEvents = savedEvents.filter((event) => !String(event.id || "").startsWith("jolin-pleasure-"));
  const seen = new Set(cleanedSavedEvents.map((event) => event.id));
  const missingSeeds = seedEvents.filter((event) => !seen.has(event.id));
  return [...cleanedSavedEvents, ...missingSeeds];
}

function getEventKey(event) {
  return [event.date, event.artist, event.city, event.venue, event.tour]
    .map((value, index) => (index === 0 ? String(value || "").trim() : normalizeEventText(value)))
    .join("|");
}

function normalizeEventText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s·.。()（）\-—_《》「」“”"'：:]+/g, "");
}

function dedupeEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    const key = getEventKey(event);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function saveEvents() {
  state.events = dedupeEvents(state.events);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events, null, 2));
}

function render() {
  state.month = els.monthPicker.value;
  renderCityFilter();
  renderCalendar();
  renderList();
  renderDetail();
}

function renderCityFilter() {
  const current = els.cityFilter.value;
  const cities = [...new Set(state.events.map((event) => event.city))].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  els.cityFilter.innerHTML = '<option value="">全部城市</option>';
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    els.cityFilter.append(option);
  });
  els.cityFilter.value = cities.includes(current) ? current : "";
}

function getVisibleEvents() {
  const query = els.searchInput.value.trim().toLowerCase();
  const city = els.cityFilter.value;
  return state.events
    .filter((event) => event.date.startsWith(state.month))
    .filter((event) => !city || event.city === city)
    .filter((event) => {
      if (!query) return true;
      return [event.artist, event.tour, event.city, event.venue].join(" ").toLowerCase().includes(query);
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.artist.localeCompare(b.artist, "zh-Hans-CN"));
}

function isConcertOnly(entry) {
  const text = [entry.artist, entry.tour, entry.city, entry.venue].join(" ");
  return !/音乐节|音樂節|festival/i.test(text);
}

function renderCalendar() {
  const [year, month] = state.month.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month - 1, 1 - startOffset);
  const visibleEvents = getVisibleEvents();
  const eventsByDate = groupBy(visibleEvents, "date");

  els.calendarTitle.textContent = `${year}年${month}月`;
  els.calendarGrid.innerHTML = "";

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateKey = formatDateKey(date);
    const dayEvents = eventsByDate[dateKey] || [];
    const cell = document.createElement("article");
    cell.className = "day-cell";
    if (date.getMonth() !== month - 1) cell.classList.add("outside");
    if (dayEvents.length) cell.classList.add("has-event");

    const dateNumber = document.createElement("span");
    dateNumber.className = "date-number";
    dateNumber.textContent = date.getDate();
    cell.append(dateNumber);

    const stack = document.createElement("div");
    stack.className = "event-stack";
    dayEvents.forEach((event) => {
      const button = document.createElement("button");
      button.className = "event-pill";
      button.type = "button";
      button.textContent = event.artist;
      button.title = `${event.artist} · ${event.venue}`;
      button.addEventListener("click", () => selectEvent(event.id));
      stack.append(button);
    });
    cell.append(stack);
    els.calendarGrid.append(cell);
  }
}

function renderList() {
  const visibleEvents = getVisibleEvents();
  els.eventCount.textContent = `${visibleEvents.length}场`;
  els.eventList.innerHTML = "";

  if (!visibleEvents.length) {
    const empty = document.createElement("p");
    empty.className = "empty-copy";
    empty.textContent = "这个月份还没有录入已官宣演唱会。";
    els.eventList.append(empty);
    return;
  }

  visibleEvents.forEach((event) => {
    const item = document.createElement("button");
    item.className = "list-item";
    item.type = "button";
    item.innerHTML = `<strong>${formatShortDate(event.date)} ${event.artist}</strong><span>${event.city} · ${event.venue}</span>`;
    item.addEventListener("click", () => selectEvent(event.id));
    els.eventList.append(item);
  });
}

function renderDetail() {
  const selected = state.events.find((event) => event.id === state.selectedId);
  els.detailNote.hidden = !selected;
  if (!selected) return;

  els.detailDate.textContent = formatLongDate(selected.date);
  els.detailCity.textContent = selected.city;
  els.detailArtist.textContent = selected.artist;
  els.detailSentence.textContent = `${selected.artist}在${formatLongDate(selected.date)}，于${selected.venue}开演唱会。`;
  els.detailTour.textContent = selected.tour;
  els.detailVenue.textContent = selected.venue;
}

function selectEvent(id) {
  state.selectedId = id;
  renderDetail();
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    acc[value] = acc[value] || [];
    acc[value].push(item);
    return acc;
  }, {});
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(dateString) {
  const [, month, day] = dateString.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function formatLongDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function shiftMonth(delta) {
  const [year, month] = state.month.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  els.monthPicker.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  state.selectedId = null;
  render();
}

els.monthPicker.addEventListener("change", () => {
  state.selectedId = null;
  render();
});
els.cityFilter.addEventListener("change", render);
els.searchInput.addEventListener("input", render);
els.prevMonth.addEventListener("click", () => shiftMonth(-1));
els.nextMonth.addEventListener("click", () => shiftMonth(1));

els.eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const entry = Object.fromEntries(formData.entries());
  const submittedEvent = {
    date: entry.date,
    artist: entry.artist.trim(),
    city: entry.city.trim(),
    venue: entry.venue.trim(),
    tour: entry.tour.trim(),
    source: entry.source.trim(),
    officialOnly: true
  };
  if (!isConcertOnly(submittedEvent)) {
    alert("这条看起来像音乐节相关信息，已按规则拦截。");
    return;
  }
  if (state.events.some((eventItem) => getEventKey(eventItem) === getEventKey(submittedEvent))) {
    alert("这场演唱会已经在公开日历里啦。");
    return;
  }
  copySubmission(submittedEvent);
  window.open(SUBMISSION_SHEET_URL, "_blank", "noopener");
  event.currentTarget.reset();
  event.currentTarget.elements.officialOnly.checked = true;
  alert("投稿内容已经复制。腾讯文档打开后，请粘贴到表格里，审核通过后会更新到公开日历。");
});

function copySubmission(submittedEvent) {
  const values = [
    submittedEvent.date,
    submittedEvent.artist,
    submittedEvent.city,
    submittedEvent.venue,
    submittedEvent.tour,
    submittedEvent.source
  ];
  const text = values.join("\t");
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    return;
  }
  fallbackCopy(text);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

render();

