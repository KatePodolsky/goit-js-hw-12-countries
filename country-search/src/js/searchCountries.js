import _debounce from 'lodash.debounce';
import {error, Stack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import countryCardTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/country-list.hbs';
import fetchCountries from './fetchCountries'

const refs = {
    countryContainer: document.querySelector('.card-container'),
    searchInput:document.querySelector('[data-input="country-search"]')
}

refs.searchInput.addEventListener('input', _debounce(onSearch,500))

function onSearch(e) {
    clearSearch();
    const searchQuery = refs.searchInput.value;
    fetchCountries(searchQuery)
        .then(response => {
            if (response.length < 2) {
                renderCountryCard(response)
            }
            else if (response.length > 1 && response.length < 11) {
                renderCountryList(response)
            } else if (response.length > 10) {
                pnotifyMessage(error, 'To many matches found. Please enter a more specific query!');
            }
        }
    )
        .catch(error => console.log(error))
        .finally(_debounce(()=> refs.searchInput.value="",5000))
    
}

function renderCountryCard(country) {
    const markUp = countryCardTpl(country);
        refs.countryContainer.innerHTML = markUp
}

function renderCountryList(country) {
    const markUp = countryListTpl(country);
        refs.countryContainer.innerHTML = markUp
}

function pnotifyMessage(alert, message) {
    alert({
        text: `${message}`,
        delay: 2000,
        stack: new Stack({
            dir1:'up'
        })
    })
}

function clearSearch() {
    refs.countryContainer.innerHTML = ''
}
