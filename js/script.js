let supplements = [];
// Функция для чтения файла с сапплиментами
function fetchSupplements() {
    fetch('data/supplements_list.json')
        .then(response => response.json())
        .then(data => {
            supplements = data.map(supplement => ({ ...supplement, selected: false }));
            // Сортируем сапплименты по имени сразу после получения
            supplements.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            displaySupplements();
        })
        .catch(error => console.error('Error:', error));
}
// Функция чтения данных о несовместимости
function fetchCompatibility() {
    fetch('data/supplements_compatibility.json')
        .then(response => response.json())
        .then(data => {
            compatibilityData = data;
        })
        .catch(error => console.error('Error:', error));
}

let searchInput = document.querySelector('#search-input');
let autocompleteResults = document.querySelector('#autocomplete-results');

searchInput.addEventListener('input', function() {
    let searchQuery = this.value.toLowerCase();
    autocompleteResults.innerHTML = '';
    if (searchQuery.trim() !== '') { // Проверка на пустое поле ввода
        let results = supplements.filter(supplement => supplement.name.toLowerCase().startsWith(searchQuery));
        results.forEach(result => {
            let resultElement = document.createElement('div');
            resultElement.textContent = result.name;
            resultElement.addEventListener('click', function() {
                searchInput.value = this.textContent;
                autocompleteResults.innerHTML = '';
                // Добавление выбранного элемента
                let selectedSupplement = supplements.find(supplement => supplement.name.toLowerCase() === this.textContent.toLowerCase());
                if (selectedSupplement) {
                    selectedSupplement.selected = true;
                    displaySupplements(); // Обновите отображение добавок
                }
            });
            autocompleteResults.appendChild(resultElement);
        });
    }
});



searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && autocompleteResults.children.length >= 1) {
        searchInput.value = autocompleteResults.firstChild.textContent;
        autocompleteResults.innerHTML = '';
        // Добавление выбранного элемента
        let selectedSupplement = supplements.find(supplement => supplement.name.toLowerCase() === searchInput.value.toLowerCase());
        if (selectedSupplement) {
            selectedSupplement.selected = true;
            displaySupplements(); // Обновите отображение добавок
            displaySelectedSupplements(); // Обновите отображение выбранных добавок
            searchInput.value = ''; // Добавлено: очищает поле ввода
        }
    }
});

autocompleteResults.addEventListener('click', function(e) {
    if (e.target.tagName.toLowerCase() === 'div') { // Убедитесь, что кликнули по элементу div
        let selectedSupplement = supplements.find(supplement => supplement.name.toLowerCase() === e.target.textContent.toLowerCase());
        if (selectedSupplement) {
            selectedSupplement.selected = true;
            // let li = document.createElement('li');
            // li.textContent = selectedSupplement.name;
            // selectedSupplementsSpace.appendChild(li); // Добавляет сапплимент в центральное поле
            displaySupplements(); // Обновите отображение добавок
            displaySelectedSupplements(); // Обновите отображение выбранных добавок
        }
        searchInput.value = ''; // Очищает поле ввода
        autocompleteResults.innerHTML = ''; // Очищает результаты автозаполнения
    }
});



// Функция для проверки несовместимости
function checkIncompatibility() {
    const selectedSupplements = supplements.filter(supplement => supplement.selected).map(supplement => supplement.name);
    let incompatiblePairs = [];

    selectedSupplements.forEach((supplement, i) => {
        for (let j = i + 1; j < selectedSupplements.length; j++) {
            if (compatibilityData[supplement].incompatible.includes(selectedSupplements[j])) {
                incompatiblePairs.push([supplement, selectedSupplements[j]]);
            }
        }
    });

    return incompatiblePairs;
}

// Функция для отображения списка сапплиментов
function displaySupplements() {
    const supplementsList = document.getElementById('supplements-list');
    supplementsList.innerHTML = ''; // очищаем список

    supplements.forEach((supplement, index) => {
        const li = document.createElement('li');
        li.textContent = supplement.name;
        if (supplement.selected) {
            li.classList.add('selected'); // добавляем класс 'selected', если сапплимент выбран
        }
        li.addEventListener('click', function() { // добавляем обработчик клика
            supplements[index].selected = !supplements[index].selected; // меняем статус выбора
            displaySupplements(); // обновляем отображение списка
        });
        supplementsList.appendChild(li);
    });
}


// Функция для отображения выбранных сапплиментов по кругу (охиреть, какая красота)
function displaySelectedSupplements() {
    const selectedSupplementsSpace = document.getElementById('selected-supplements-space');
    selectedSupplementsSpace.innerHTML = ''; // очищаем область

    const supplementsContainer = document.getElementById('supplements-container');
    const selectedSupplements = supplements.filter(supplement => supplement.selected); // выбираем только выбранные сапплименты

    if (selectedSupplements.length === 1) {
        supplementsContainer.style.justifyContent = 'center';
        selectedSupplements.forEach((supplement, index) => {
            const li = document.createElement('li');
            li.textContent = supplement.name;
            selectedSupplementsSpace.appendChild(li);
        });
    } else {
        const angleStep = 360 / selectedSupplements.length; // вычисляем шаг угла
        selectedSupplements.forEach((supplement, index) => {
            const li = document.createElement('li');
            li.textContent = supplement.name;
            let additional = 0.5 * (selectedSupplements.length === 2); // in this case i wanted them to be on 3 and 9 o'clock
            li.style.transform = `rotate(${angleStep * (index + additional)}deg) translateY(-150px) rotate(-${angleStep * (index + additional)}deg)`; // устанавливаем угол поворота
            selectedSupplementsSpace.appendChild(li);
        });
    }
}

function drawIncompatibilityLines(incompatiblePairs) {
    if (!incompatiblePairs) {
        return;
    }
    // разработчику нехватило скилла нарисовать линии
}


// Функция для отображения списка сапплиментов
function displaySupplements() {
    const supplementsList = document.getElementById('supplements-list');
    supplementsList.innerHTML = ''; // очищаем список

    supplements.forEach((supplement, index) => {
        const li = document.createElement('li');
        li.textContent = supplement.name;
        if (supplement.selected) {
            li.classList.add('selected'); // добавляем класс 'selected', если сапплимент выбран
        }
        li.addEventListener('click', function() { // добавляем обработчик клика
            supplements[index].selected = !supplements[index].selected; // меняем статус выбора
            displaySupplements(); // обновляем отображение списка
            displaySelectedSupplements(); // обновляем отображение выбранных сапплиментов

            // Проверяем несовместимость и отображаем результат
            const incompatiblePairs = checkIncompatibility();
            displayIncompatibilityResult(incompatiblePairs);
        });
        supplementsList.appendChild(li);
    });
}

document.querySelector('#reset-button').addEventListener('click', function() {
    supplements.forEach(supplement => {
        supplement.selected = false;
    });
    displaySupplements(); // Обновите отображение добавок
    displaySelectedSupplements(); // Обновите отображение выбранных добавок
    displayIncompatibilityResult(); // Обновите отображение результата проверки несовместимости
});

// Функция для отображения результата проверки несовместимости
function displayIncompatibilityResult(incompatiblePairs) {
    const resultField = document.getElementById('compatibility-message');
    const titleField = document.getElementById('compatibility-title');
    if (supplements.filter(supplement => supplement.selected).length === 0) {
        titleField.textContent = 'Compatibility result:';
        resultField.textContent = 'Please select supplements to check compatibility.';
    } else if (incompatiblePairs.length > 0) { 
        titleField.textContent = 'Compatibility result: ❌';
        resultField.textContent = 'Incompatible pairs: ' + incompatiblePairs.map(pair => pair.join(' and ')).join(', ');
    } else {
        titleField.textContent = 'Compatibility result: ✅';
        resultField.textContent = 'Great! All selected supplements are compatible.';
    }
    drawIncompatibilityLines(incompatiblePairs);
}

// Читаем файл с сапплиментами при загрузке страницы
window.onload = function() {
    fetchSupplements();
    fetchCompatibility();
    displaySelectedSupplements();
};