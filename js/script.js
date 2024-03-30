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

    const selectedSupplements = supplements.filter(supplement => supplement.selected); // выбираем только выбранные сапплименты
    const angleStep = 360 / selectedSupplements.length; // вычисляем шаг угла

    selectedSupplements.forEach((supplement, index) => {
        const li = document.createElement('li');
        li.textContent = supplement.name;
        li.style.transform = `rotate(${angleStep * index}deg) translateY(-150px) rotate(-${angleStep * index}deg)`; // устанавливаем угол поворота
        selectedSupplementsSpace.appendChild(li);
    });
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

// Функция для отображения результата проверки несовместимости
function displayIncompatibilityResult(incompatiblePairs) {
    const resultField = document.getElementById('compatibility-result');
    if (incompatiblePairs.length > 0) {
        resultField.textContent = 'Incompatible pairs: ' + incompatiblePairs.map(pair => pair.join(' and ')).join(', ');
    } else {
        resultField.textContent = 'No incompatible pairs.';
    }
}

// Читаем файл с сапплиментами при загрузке страницы
window.onload = function() {
    fetchSupplements();
    fetchCompatibility();
    displaySelectedSupplements();
};