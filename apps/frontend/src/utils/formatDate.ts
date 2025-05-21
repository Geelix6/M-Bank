export function formatDate(date: Date): string {
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ]

  const padZero = (num: number) => num.toString().padStart(2, '0')

  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const day = date.getDate()
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${hours}:${minutes}, ${day} ${monthName} ${year}`
}
