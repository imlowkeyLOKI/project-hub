// need to update day of week and date when timezone is changed

let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

if (typeof MicroModal !== "undefined") {
  MicroModal.init();
}
const timeEl = document.getElementById("time");
const timezoneEl = document.getElementById("timezone");
const dateEl = document.getElementById("date");
const dayEl = document.getElementById("day");
const timeZoneSelectBtn = document.getElementById("timezone-select");
const saveTimeZoneBtn = document.getElementById("save-timezone");

timezoneEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
dateEl.textContent = dayjs().format("MMMM D, YYYY");
dayEl.textContent = dayjs().format("dddd");

function updateTime() {
  const now = new Date();

  timeEl.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: currentTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
}
updateTime();

setInterval(updateTime, 1000);

saveTimeZoneBtn.addEventListener("click", function () {
  const selectedTimeZone = timeZoneSelectBtn.value;
  currentTimeZone =
    selectedTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  timezoneEl.textContent = currentTimeZone;
  if (typeof MicroModal !== "undefined") {
    MicroModal.close("timezone-modal");
  }
  updateTime();
});
