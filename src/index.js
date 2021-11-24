import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash/debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputElem = document.querySelector('#search-box');
const listElem = document.querySelector('.country-list');
const infoElem = document.querySelector('.country-info');

const cleanElem = elem => (elem.innerHTML = '');

const inputHandler = (e) => {
const textElem = e.target.value.trim();
  if (!textElem) {
    cleanElem(listElem);
    cleanElem(infoElem);
    return;
  }
  fetchCountries(textElem)
    .then(data => {
      if (data.length > 10) {
        Notify.info("Too many matches found. Please enter a more specific name.");
        return;
      }
      renderHtml(data);
    })
    .catch(error => {
      cleanElem(listElem);
      cleanElem(infoElem);
      Notify.failure("Oops, there is no country with that name");
    });
};

const renderHtml = data => {
  if (data.length === 1) {
    cleanElem(listElem);
    const markupCountry = createMarkupCountry(data);
    infoElem.innerHTML = markupCountry;
  } else {
    cleanElem(infoElem);
    const markupCountries = createMarkupCountries(data);
    listElem.innerHTML = markupCountries;
  }
};

const createMarkupCountries = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createMarkupCountry = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) => `<h1><img src="${flags.png}" alt="${
      name.official
    }" width="50" height="50">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

inputElem.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
