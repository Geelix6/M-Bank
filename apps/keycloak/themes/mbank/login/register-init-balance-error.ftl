<!DOCTYPE html>
<html lang="${locale.currentLanguageTag!locale.current! 'en'}">
  <head>
    <meta charset="utf-8" />
    <title>Ошибка во время регистрации</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/custom.css" />
  </head>
  <body>
    <div>
      <h1>Ошибка инициализации стартового баланса</h1>
      <p>Наши сервисы могут быть временно недоступными. Пройдите регистрацию с теми же данными позже</p>
      <a href="/">${kcSanitize(msg("backToLogin"))?no_esc}</a>
    <div>
  </body>
</html>
