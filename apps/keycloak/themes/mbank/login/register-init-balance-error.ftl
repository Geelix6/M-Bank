<!DOCTYPE html>
<html lang="${locale.currentLanguageTag!locale.current! 'en'}">
  <head>
    <meta charset="utf-8" />
    <title>Ошибка во время регистрации</title>
    <link rel="stylesheet" href="${url.resourcesPath}/css/custom.css" />
  </head>
  <body>
    <#if messages?? && messages?has_content>
      <#list messages as m>
        <div class="kc-feedback-text">${m.message}</div>
      </#list>
    <#else>
      <div class="kc-feedback-text">Unknown error</div>
    </#if>

    <a href="/">← ${msg("backToLogin")! "Вернуться"}</a>
  </body>
</html>
