const STORAGE_KEY = "concert-calendar-events-v1";

const seedEvents = [
  {
    id: "jolin-pleasure-shenzhen-2026-03-07",
    date: "2026-03-07",
    artist: "蔡依林",
    city: "深圳",
    venue: "深圳大运中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-shenzhen-2026-03-08",
    date: "2026-03-08",
    artist: "蔡依林",
    city: "深圳",
    venue: "深圳大运中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-xiamen-2026-03-14",
    date: "2026-03-14",
    artist: "蔡依林",
    city: "厦门",
    venue: "奥林匹克体育中心-白鹭体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-xiamen-2026-03-15",
    date: "2026-03-15",
    artist: "蔡依林",
    city: "厦门",
    venue: "奥林匹克体育中心-白鹭体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-changsha-2026-03-21",
    date: "2026-03-21",
    artist: "蔡依林",
    city: "长沙",
    venue: "长沙贺龙体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-changsha-2026-03-22",
    date: "2026-03-22",
    artist: "蔡依林",
    city: "长沙",
    venue: "长沙贺龙体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-chongqing-2026-03-28",
    date: "2026-03-28",
    artist: "蔡依林",
    city: "重庆",
    venue: "重庆奥体中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-chongqing-2026-03-29",
    date: "2026-03-29",
    artist: "蔡依林",
    city: "重庆",
    venue: "重庆奥体中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-qingdao-2026-04-11",
    date: "2026-04-11",
    artist: "蔡依林",
    city: "青岛",
    venue: "青岛市民健身中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-xian-2026-04-18",
    date: "2026-04-18",
    artist: "蔡依林",
    city: "西安",
    venue: "西安奥体中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-suzhou-2026-04-25",
    date: "2026-04-25",
    artist: "蔡依林",
    city: "苏州",
    venue: "苏州奥林匹克体育中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-nanning-2026-05-03",
    date: "2026-05-03",
    artist: "蔡依林",
    city: "南宁",
    venue: "广西体育中心主体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-hangzhou-2026-05-15",
    date: "2026-05-15",
    artist: "蔡依林",
    city: "杭州",
    venue: "杭州奥体中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-hangzhou-2026-05-16",
    date: "2026-05-16",
    artist: "蔡依林",
    city: "杭州",
    venue: "杭州奥体中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-hangzhou-2026-05-17",
    date: "2026-05-17",
    artist: "蔡依林",
    city: "杭州",
    venue: "杭州奥体中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-fuzhou-2026-05-23",
    date: "2026-05-23",
    artist: "蔡依林",
    city: "福州",
    venue: "福州海峡奥林匹克体育中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-hefei-2026-05-30",
    date: "2026-05-30",
    artist: "蔡依林",
    city: "合肥",
    venue: "合肥体育中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-beijing-2026-06-12",
    date: "2026-06-12",
    artist: "蔡依林",
    city: "北京",
    venue: "国家体育场-鸟巢",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-beijing-2026-06-13",
    date: "2026-06-13",
    artist: "蔡依林",
    city: "北京",
    venue: "国家体育场-鸟巢",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-beijing-2026-06-14",
    date: "2026-06-14",
    artist: "蔡依林",
    city: "北京",
    venue: "国家体育场-鸟巢",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-shenyang-2026-06-20",
    date: "2026-06-20",
    artist: "蔡依林",
    city: "沈阳",
    venue: "沈阳奥林匹克体育中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://www.jolincai.com/en/tour",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-taiyuan-2026-07-04",
    date: "2026-07-04",
    artist: "蔡依林",
    city: "太原",
    venue: "山西体育中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://m.damai.cn/shows/item.html?itemId=1038152539046&sqm=&utm=",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-nanchang-2026-07-11",
    date: "2026-07-11",
    artist: "蔡依林",
    city: "南昌",
    venue: "南昌国际体育中心体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://m.damai.cn/shows/item.html?itemId=1037820171294&sqm=&utm=",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-chengdu-2026-07-19",
    date: "2026-07-19",
    artist: "蔡依林",
    city: "成都",
    venue: "东安湖体育公园主体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://detail.damai.cn/item.htm?id=1023079779711",
    officialOnly: true
  },
  {
    id: "jolin-pleasure-chengdu-2026-07-20",
    date: "2026-07-20",
    artist: "蔡依林",
    city: "成都",
    venue: "东安湖体育公园主体育场",
    tour: "PLEASURE 世界巡回演唱会",
    source: "https://detail.damai.cn/item.htm?id=1023079779711",
    officialOnly: true
  }
];

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
  eventForm: document.querySelector("#eventForm"),
  exportData: document.querySelector("#exportData"),
  importData: document.querySelector("#importData"),
  resetData: document.querySelector("#resetData")
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
  const seen = new Set(savedEvents.map((event) => event.id));
  const missingSeeds = seedEvents.filter((event) => !seen.has(event.id));
  return [...savedEvents, ...missingSeeds];
}

function getEventKey(event) {
  return [event.date, event.artist, event.city, event.venue, event.tour]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");
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
  const newEvent = {
    id: `${entry.artist}-${entry.date}-${Date.now()}`,
    date: entry.date,
    artist: entry.artist.trim(),
    city: entry.city.trim(),
    venue: entry.venue.trim(),
    tour: entry.tour.trim(),
    officialOnly: true
  };
  if (!isConcertOnly(newEvent)) {
    alert("这条看起来像音乐节相关信息，已按规则拦截。");
    return;
  }
  if (state.events.some((eventItem) => getEventKey(eventItem) === getEventKey(newEvent))) {
    alert("这场演唱会已经在日历里啦。");
    return;
  }
  state.events = dedupeEvents([...state.events, newEvent]);
  saveEvents();
  els.monthPicker.value = newEvent.date.slice(0, 7);
  state.selectedId = newEvent.id;
  event.currentTarget.reset();
  event.currentTarget.elements.officialOnly.checked = true;
  render();
});

els.exportData.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.events, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "concert-calendar-events.json";
  link.click();
  URL.revokeObjectURL(url);
});

els.importData.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  const text = await file.text();
  const imported = JSON.parse(text);
  if (!Array.isArray(imported)) {
    alert("JSON 需要是演唱会数组。");
    return;
  }
  state.events = dedupeEvents(imported.filter((item) => item.date && item.artist && item.venue && item.officialOnly !== false && isConcertOnly(item)));
  saveEvents();
  state.selectedId = null;
  render();
});

els.resetData.addEventListener("click", () => {
  if (!confirm("确定要恢复为内置官方数据吗？这会移除你手动录入的本地数据。")) return;
  state.events = dedupeEvents(seedEvents);
  state.selectedId = null;
  saveEvents();
  render();
});

render();
