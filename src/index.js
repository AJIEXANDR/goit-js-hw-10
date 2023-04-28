import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './js-parts/fetchCountries';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  listEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

function countrySearch(event) {
  const countryName = event.target.value.trim();
  if (event.target.value === '') {
    clearMarkUp();
    return;
  }
  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        clearMarkUp();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length === 1) {
        markupCountry(countries);
      } else if (countries.length > 1 && countries.length < 10) {
        renderCountriesList(countries);
      }
    })
    .catch(error => {
      if (error.message === '404') {
        clearMarkUp();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}

function renderCountriesList(countries) {
  clearMarkUp();
  const markup = countries
    .map(country => {
      return `
          <li class="countries-item">
            <img class="flag" width=50 height=30 src="${country.flags.svg}" alt="">
            <p> ${country.name.official}</p>
          </li>
      `;
    })
    .join('');
  refs.listEl.innerHTML = markup;
}

function markupCountry(country) {
  clearMarkUp();
  const oneCountryMarkup = country.map(country => {
    return `
        <div class="country-data">
        <img class="country-flag" width=30 height=20 src="${
          country.flags.svg
        }" alt="Country-flag">
        <p class="country-name">${country.name.official}</p>
        </div>
        <ul class="country-info-list">
          <li class="country-item"><b>Capital:</b> ${country.capital}</li>
          <li class="country-item"><b>Population:</b> ${country.population}</li>
          <li class="country-item"><b>Languages:</b> ${Object.values(
            country.languages
          )}</li>
        </ul>`;
  });
  refs.divEl.innerHTML = oneCountryMarkup;
}

function clearMarkUp() {
  refs.listEl.innerHTML = '';
  refs.divEl.innerHTML = '';
}

Notiflix.Notify.init({
  position: 'center-top',
});
