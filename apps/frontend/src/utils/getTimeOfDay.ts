export function getTimeOfDay(): string {
  const hours = new Date().getHours()

  let greeting: string

  if (hours >= 5 && hours < 12) {
    greeting = 'Доброе утро'
  } else if (hours >= 12 && hours < 18) {
    greeting = 'Добрый день'
  } else if (hours >= 18 && hours < 23) {
    greeting = 'Добрый вечер'
  } else {
    greeting = 'Доброй ночи'
  }
  return greeting
}
