document.addEventListener('DOMContentLoaded', () => {
    const carForm = document.getElementById('carForm');
    const carList = document.getElementById('carList');

    // Load registered cars from local storage when the page loads
    loadRegisteredCars();

    carForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
        const ownerName = document.getElementById('ownerName').value.trim();
        const dateTime = new Date().toLocaleString();

        if (vehicleNumber && ownerName) {
            const car = { vehicleNumber, ownerName, dateTime };
            saveCarToLocalStorage(car);
            displayCar(car);
            carForm.reset();
        }
    });

    function saveCarToLocalStorage(car) {
        const cars = JSON.parse(localStorage.getItem('registeredCars')) || [];
        cars.push(car);
        localStorage.setItem('registeredCars', JSON.stringify(cars));
    }

    function loadRegisteredCars() {
        const cars = JSON.parse(localStorage.getItem('registeredCars')) || [];
        cars.forEach(car => displayCar(car));
    }

    function displayCar(car) {
        const listItem = document.createElement('li');
        const carInfo = document.createElement('div');
        carInfo.classList.add('car-info');
        carInfo.textContent = `Vehicle: ${car.vehicleNumber}, Owner: ${car.ownerName}, Registered on: ${car.dateTime}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => confirmDelete(car, listItem);

        listItem.appendChild(carInfo);
        listItem.appendChild(deleteBtn);
        carList.appendChild(listItem);
    }

    function confirmDelete(car, listItem) {
        if (confirm(`Are you sure you want to delete the registration for ${car.vehicleNumber}?`)) {
            deleteCarFromLocalStorage(car);
            carList.removeChild(listItem);
        }
    }

    function deleteCarFromLocalStorage(carToDelete) {
        let cars = JSON.parse(localStorage.getItem('registeredCars')) || [];
        cars = cars.filter(car => car.vehicleNumber !== carToDelete.vehicleNumber);
        localStorage.setItem('registeredCars', JSON.stringify(cars));
    }
});
