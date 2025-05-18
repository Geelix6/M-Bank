// src/pages/Main.tsx
import { useKeycloak } from '@react-keycloak/web'

export default function Main() {
  const { keycloak } = useKeycloak()

  // Попытка достать имя пользователя из распарсенного токена
  const token = keycloak.tokenParsed
  const firstName: string = token?.given_name

  // Получаем текущий час (0–23)
  const hours = new Date().getHours()

  // Выбираем нужное приветствие
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

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-slate-900">
        {greeting}, {firstName}!
      </h2>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem reiciendis atque esse hic
      dolorem minus, voluptatem delectus! Vel eaque qui omnis minus sunt neque dolor ducimus
      provident voluptatem fugit, iusto ipsam nam incidunt laudantium laborum ex fuga repudiandae
      expedita voluptate?
    </div>
  )
}
