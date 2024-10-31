document.addEventListener('DOMContentLoaded', () => {
    const carForm = document.getElementById('carForm');
    const carList = document.getElementById('carList');
    const clearAllBtn = document.getElementById('clearAll');

    // Load registered cars from local storage
    loadRegisteredCars();

    carForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
        const ownerName = document.getElementById('ownerName').value.trim();
        const carModel = document.getElementById('carModel').value.trim();
        const contactNumber = document.getElementById('contactNumber').value.trim();
        const dateTime = new Date().toLocaleString();

        if (vehicleNumber) {
            const car = { vehicleNumber, ownerName, carModel, contactNumber, dateTime };
            saveCarToLocalStorage(car);
            displayCar(car);
            carForm.reset();
        } else {
            alert("Vehicle number is required.");
        }
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all registrations?")) {
            localStorage.removeItem('registeredCars');
            carList.innerHTML = '';
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

        carInfo.innerHTML = `
            <strong>Vehicle:</strong> ${car.vehicleNumber} <br>
            <strong>Owner:</strong> ${car.ownerName || "N/A"} <br>
            <strong>Model:</strong> ${car.carModel || "N/A"} <br>
            <strong>Contact:</strong> ${car.contactNumber || "N/A"} <br>
            <small><em>Registered on:</em> ${car.dateTime}</small>
        `;

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
