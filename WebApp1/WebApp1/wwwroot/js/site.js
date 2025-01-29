document.addEventListener('DOMContentLoaded', async function () {
    const apiURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10';
    const cryptoContainer = document.getElementById('cryptoContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const cryptoSelector = document.getElementById('cryptoSelector');
    const newsSection = document.getElementById('newsSection');
    const forecastSection = document.getElementById('forecastSection');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Завантаження популярних криптовалют
    async function loadCryptos() {
        const response = await fetch(apiURL);
        const cryptos = await response.json();
        displayCryptos(cryptos, cryptoContainer, false);
        populateCryptoSelector(cryptos); 
    }

    // Заповнення випадаючого списку криптовалют
    function populateCryptoSelector(cryptos) {
        cryptoSelector.innerHTML = ''; // Очищення попередніх опцій
        cryptos.forEach(crypto => {
            const option = document.createElement('option');
            option.value = crypto.id;
            option.textContent = crypto.name;
            cryptoSelector.appendChild(option);
        });

        // Встановлення обробника події для зміни криптовалюти
        cryptoSelector.addEventListener('change', async function () {
            const selectedCryptoId = cryptoSelector.value;
            if (selectedCryptoId) {
                await displayCryptoChart(selectedCryptoId);
            }
        });
    }

    // Відображення криптовалют на головній сторінці
    function displayCryptos(cryptos, container, isFavorite) {
        container.innerHTML = ''; // Очистка контейнера
        cryptos.forEach(crypto => {
            const card = document.createElement('div');
            card.className = 'card';

            const iconUrl = crypto.image;
            const cardContent = `
                <div class="crypto-info">
                     <img src="${iconUrl}" alt="${crypto.name} logo" class="crypto-icon" />
                     <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                </div>
                <p>Ціна: $${crypto.current_price}</p>
                <p>Зміна (24г): ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                 <button>${isFavorite ? 'Видалити з улюбленого' : 'Додати до улюбленого'}</button>
             `;

            card.innerHTML = cardContent;

            const button = card.querySelector('button');
            button.addEventListener('click', () => {
                if (isFavorite) {
                    removeFavorite(crypto.id);
                } else {
                    addFavorite(crypto);
                }
            });

            container.appendChild(card);
        });
    }

    // Додавання криптовалюти в улюблене
    function addFavorite(crypto) {
        if (!favorites.find(fav => fav.id === crypto.id)) {
            favorites.push(crypto);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Додано до улюбленого!');
        }
    }

    // Видалення криптовалюти з улюбленого
    function removeFavorite(id) {
        const index = favorites.findIndex(fav => fav.id === id);
        if (index > -1) {
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Видалено з улюбленого!');
            if (favoritesContainer) {
                displayCryptos(favorites, favoritesContainer, true);
            }
        }
    }

    // Завантаження популярних криптовалют на головній сторінці
    if (cryptoContainer) {
        await loadCryptos();
    }

    // Відображення улюблених криптовалют на сторінці Favorites
    if (favoritesContainer) {
        displayCryptos(favorites, favoritesContainer, true);
    }

    // Завантаження новин про криптовалюти
    async function loadNews() {
        try {
            const newsResponse = await fetch('https://cryptonews-api.com/api/v1/category?section=general&items=5');
            if (!newsResponse.ok) {
                throw new Error('Не вдалося завантажити новини');
            }
            const newsData = await newsResponse.json();
            displayNews(newsData.data);
        } catch (error) {
            console.error(error);
            newsSection.innerHTML = '<p>Сталася помилка при завантаженні новин.</p>';
        }
    }

    // Відображення новин
    function displayNews(news) {
        newsSection.innerHTML = '<h2>Новини криптовалют</h2>';
        const newsContainer = document.createElement('div');
        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="${item.url}" target="_blank">Читати більше</a>
            `;
            newsContainer.appendChild(newsItem);
        });
        newsSection.appendChild(newsContainer);
    }

    // Завантаження прогнозів для криптовалют
    async function loadForecasts() {
        const forecastData = [
            {
                name: 'Bitcoin',
                forecast: 'В найближчі 6 місяців очікується зростання ціни на 20-30%.'
            },
            {
                name: 'Ethereum',
                forecast: 'Ethereum продовжить розвивати мережу та має зростати на 15-25%.'
            },
            {
                name: 'Cardano',
                forecast: 'Cardano може здивувати зростанням на 10-20% наступного року.'
            }
        ];
        displayForecasts(forecastData);
    }

    // Відображення прогнозів
    function displayForecasts(forecasts) {
        const forecastContainer = document.createElement('div');
        forecasts.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.forecast}</p>
            `;
            forecastContainer.appendChild(forecastItem);
        });
        forecastSection.appendChild(forecastContainer);
    }

    // Завантаження новин і прогнозів після завантаження сторінки
    if (newsSection) {
        await loadNews();
    }
    if (forecastSection) {
        await loadForecasts();
    }
});

