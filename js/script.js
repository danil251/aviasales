// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');


// Данные

const citiesApi = 'data/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '702eb552caf61ff8e2ac53e2926fd3d9',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];


// Функции

const getData = (url, callBack) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callBack(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
};



const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });


    }
};

const selectSity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="https://www.aviasales.ru/search/SVX2905KGD1" class="button button__buy">Купить за ${data.value}₽</a>
                </div>
                <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${data.origin}</span>
                    </div>
                    <div class="date">${data.depart_date}</div>
                </div>

                <div class="block-right">
                    <div class="changes">Без пересадок</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${data.destination}</span>
                    </div>
                </div>
                </div>
            </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов нет!</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
    
};
const renderCheapYear = (cheapTickets) => {

    console.log(cheapTickets);
    cheapTickets.sort((a, b) => a.value - b.value);

};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depapart_date === date;
    });
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);

};

// Обработчики события

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectSity(event, inputCitiesFrom, dropdownCitiesFrom);
});


dropdownCitiesTo.addEventListener('click', (event) => {
    selectSity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault()

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = city.find((item) => inputCitiesTo.value === item.name);

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    };
    if (formData.from && formData.to) {


        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}` + `&destination=${formData.to.code}&ane_way=true`;

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        });
    } else {
        alert('Введите корректное название города');
    }
});

// Вызовы функций
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);

    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });

});