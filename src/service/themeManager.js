export default function themeManager() {
  function changeDOM(newColorScheme) {
    const schemeAttribute = document.createAttribute("scheme");
    schemeAttribute.value = newColorScheme;
    document.body.attributes.setNamedItem(schemeAttribute);
    try {
      localStorage.setItem("theme", newColorScheme);
    } catch {
      //
    }
  }

  setTimeout(() => {
    // При запуске приложения определяем тему устройства
    const newColorScheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "space_gray"
      : "client_light";
    changeDOM(newColorScheme);
  }, 100);

  // Вешаем прослушку на смену темы
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const newColorScheme = e.matches ? "space_gray" : "client_light";
      changeDOM(newColorScheme);
    });
}
