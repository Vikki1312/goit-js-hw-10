export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    // Проверяем, если ответ от API не является успешным (т.е., возникла ошибка)
    if (!response.ok) {
      // Выбрасываем ошибку с кодом статуса ответа
      throw new Error(response.status);
    }
    // Если ответ успешный, парсим его как JSON и возвращаем
    return response.json();
  });
}
