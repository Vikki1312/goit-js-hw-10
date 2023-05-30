import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector('#search-box');
const counrtyList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearchBox.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(evt) {
  const inputValue = evt.target.value.trim();

  if (inputValue === '') {
    counrtyList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(inputValue)
    .then(country => {
      onSuccess(country);
      console.log(country);
    })
    .catch(error => {
      onError(error);
    });
}

function onSuccess(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    counrtyList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  if (countries.length === 1) {
    counrtyList.innerHTML = '';
    countryInfo.innerHTML = '';
    renderCountry(countries);
    return;
  }
  renderCountriesList(countries);
}

function onError(error) {
  counrtyList.innerHTML = '';
  countryInfo.innerHTML = '';
  if (error.message === '404') {
    Notify.failure('Oops, there is no country with that name');
  }
  console.log(error);
}

function renderCountry(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `
          <div class='country-info-item'>
              <div class='country-name'>
                  <img width="55" src='${flags.svg}'>
                      <p> ${name?.official}</p>
              </div>
              <p><b>Capital</b>: ${capital}</p>
              <p><b>Population</b>: ${population}</p>
              <p><b>Languages</b>: ${Object.values(languages)}</p>
          </div>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return ` <li class="country-item">
          <img src="${flags.svg}" width="60" height="40"></img>
          <p class="country-text">${name.official}</p>
        </li>
      `;
    })
    .join('');
  counrtyList.innerHTML = markup;
  countryInfo.innerHTML = '';
}
