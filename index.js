//константы

const temp = document.querySelector('.weather__temp-result');
const maxTemp = document.querySelector('.weather__temp-max-result');
const minTemp = document.querySelector('.weather__temp-min-result');
const humid = document.querySelector('.weather__humid-result');

const wind = document.querySelector('.weather__wind-result');

const pressure = document.querySelector('.weather__pressure-result');
const select = document.querySelector('.city__select-sity');
const buttonConfirm = document.querySelector('.city__button');
const cityName = document.querySelector('.weather__city-name');
const counrty = document.querySelector('.weather__country');
const weatherSum = document.querySelector('.weather__sum');
const weatherTime = document.querySelector('.weather__time');
const weatherDate = document.querySelector('.weather__city-date');

//eventListener на кнопку показать
buttonConfirm.addEventListener('click', () => {
  document.querySelector('.weather').classList.add('weather_visiable');
  document.querySelector('.city').classList.add('city-nonvis');
});

//изменение страны
function selectCountry(res) {
  if (res === 'RU') {
    return (counrty.textContent = 'Россия');
  } else if (res === 'BY') {
    return (counrty.textContent = 'Белорусь');
  } else if (res === 'GE') {
    return (counrty.textContent = 'Грузия');
  }
}

//запрос на сервер
function getResults(name) {
  return fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${name}&lang=ru&units=metric&appid=c0a7df6ec99bd320319fbfee6e8f12cf`
  ).then(res => {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    } else {
      return res.json();
    }
  });
}

function updateDateTime(offset) {
  const currentTime = new Date();
  const utcTimestamp = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;

  const cityTime = new Date(utcTimestamp + 3600000 * offset);

  const formattedTime = `${cityTime.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })}`;
  const formattedDate = cityTime.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  weatherTime.textContent = formattedTime;
  weatherDate.textContent = formattedDate.replace(' г.', '');
}

function updateSelectedCityDateTime() {
  const selectedOption = select.options[select.selectedIndex];
  const cityOffset = Number(selectedOption.dataset.offset);

  updateDateTime(cityOffset);
}

//получение данных из option, рендер данных
const getWeatherForcast = () => {
  select.addEventListener('change', evt => {
    let getSelectedValue = evt.target.value;

    cityName.textContent = `${getSelectedValue}, `;

    getWeatherResults(getSelectedValue);
    updateSelectedCityDateTime();
  });
};

getWeatherForcast();

//получение данных с сервера и вставка их в разметку
function getWeatherResults(name) {
  getResults(name)
    .then(res => {
      console.log(res);
      selectCountry(res.sys.country);

      temp.textContent = res.main.temp + '°';
      maxTemp.textContent = res.main.temp_max + ' / ';
      minTemp.textContent = res.main.temp_min;
      humid.textContent = res.main.humidity + '%';
      wind.textContent = res.wind.speed + ' м/с';
      pressure.textContent = res.main.pressure + ' мм';
      weatherSum.textContent = res.weather[0].description;
    })

    .catch(err => {
      console.log(err);
    });
}

setInterval(updateSelectedCityDateTime, 1000);

// Вызываем функцию первоначально для установки времени и даты
updateSelectedCityDateTime();
