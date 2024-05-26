document.addEventListener('DOMContentLoaded', function() {
    let allData = {};

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            displayRecommendations(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function() {
        const keyword = searchInput.value.toLowerCase();
        const filteredData = filterRecommendations(allData, keyword);
        displayRecommendations(filteredData);
    });

    resetButton.addEventListener('click', function() {
        searchInput.value = '';
        displayRecommendations(allData);
    });
});

function displayRecommendations(data) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    data.countries.forEach(country => {
        country.cities.forEach(city => {
            const card = createCard(city.name, city.imageUrl, city.description, country.name);
            recommendationsDiv.appendChild(card);
        });
    });

    data.temples.forEach(temple => {
        const card = createCard(temple.name, temple.imageUrl, temple.description);
        recommendationsDiv.appendChild(card);
    });

    data.beaches.forEach(beach => {
        const card = createCard(beach.name, beach.imageUrl, beach.description);
        recommendationsDiv.appendChild(card);
    });
}

function filterRecommendations(data, keyword) {
    const filteredCountries = data.countries.map(country => {
        const filteredCities = country.cities.filter(city => city.name.toLowerCase().includes(keyword));
        return { ...country, cities: filteredCities };
    }).filter(country => country.cities.length > 0);

    const filteredTemples = data.temples.filter(temple => temple.name.toLowerCase().includes(keyword));
    const filteredBeaches = data.beaches.filter(beach => beach.name.toLowerCase().includes(keyword));

    return {
        countries: filteredCountries,
        temples: filteredTemples,
        beaches: filteredBeaches
    };
}

function createCard(name, imageUrl, description, countryName) {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name;

    const title = document.createElement('h3');
    title.textContent = name;

    const desc = document.createElement('p');
    desc.textContent = description;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);

    if (countryName) {
        const timeInfo = document.createElement('p');
        const options = { timeZone: getTimeZone(countryName), hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const localTime = new Date().toLocaleTimeString('en-US', options);
        timeInfo.textContent = `Current time in ${countryName}: ${localTime}`;
        card.appendChild(timeInfo);
    }

    return card;
}

function getTimeZone(country) {
    const timeZones = {
        'Australia': 'Australia/Sydney',
        'Japan': 'Asia/Tokyo',
        'Brazil': 'America/Sao_Paulo',
        // Добавьте другие временные зоны по мере необходимости
    };
    return timeZones[country] || 'UTC';
}
