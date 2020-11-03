let randomEvent = 0

function isSelected(day, dayValue) {
  return dayValue.isSame(day, "day")
}

function isToday(day) {
  return day.isSame(new Date(), "day")
}

function beforeToday(day) {
  return day.isBefore(new Date(), "day")
}

function isRedDay(day, redDays) {
  return day.day() === 0 || redDays.find( (redDay) => redDay.datum === day.format("YYYY-MM-DD"))
}

function sameMonth(day, dayValue) {
  return day.isSame(dayValue, "month")
}

function getTextColor(day, dayValue, redDays){
  if (isSelected(day, dayValue)) return "text-white"
  if (isRedDay(day, redDays)) return "redDay"
  if (beforeToday(day)) return "text-secondary"
  if (!sameMonth(day, dayValue)) return "text-secondary"
  if (isToday(day)) return "text-white"
  return ""
}
function getBackgroundColor(day, dayValue, redDays) {
  if (isSelected(day, dayValue)) return "bg-danger"
  if (isRedDay(day, redDays)) return ""
  if (beforeToday(day)) return ""
  if (!sameMonth(day, dayValue)) return ""
  if (isToday(day)) return "bg-secondary"
  return ""
}

module.exports = { 
  dayStyles:
    function dayStyles(day, dayValue, redDays) {
      return getTextColor(day, dayValue, redDays) + " " + getBackgroundColor(day, dayValue, redDays)
    },

  getAllRedDays:
    function getAllRedDays(year){
      let data = year.dagar
      let result = data.filter( (day) => day["röd dag"] === "Ja")
      return result
    },

  getSchedule:
    async function getSchedule(day, format){
      return await(await fetch("/api/events/date/" + day.format(format))).json()
    },

  getOnThisDay:
    async function getOnThisDay(day) {
      let result = await (await fetch("https://byabbe.se/on-this-day/" + day.format("M") + "/" + day.format("D") + "/events.json")).json()
      // kan behöva - 1 efter length på rad 62
      randomEvent = result.events.length
      return result
    },

  getRandomEvent:
    function getRandomEvent() { return randomEvent }
}