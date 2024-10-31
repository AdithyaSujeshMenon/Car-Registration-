document.addEventListener('DOMContentLoaded', () => {
    const carForm = document.getElementById('carForm');
    const carList = document.getElementById('carList');
    const clearAllBtn = document.getElementById('clearAll');
    const viewReportBtn = document.getElementById('viewReportBtn');
    const todayReportBtn = document.getElementById('todayReportBtn');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    

    // Modal elements for vehicle details
    const carDetailsModal = document.getElementById('carDetailsModal');
    const modalVehicleNumber = document.getElementById('modalVehicleNumber');
    const modalCarDetails = document.getElementById('modalCarDetails');
    const closeModal = document.getElementById('closeModal');
    const deleteModalBtn = document.getElementById('deleteModalBtn');

    // Modal elements for reports
    const reportModal = document.getElementById('reportModal');
    const reportCarList = document.getElementById('reportCarList');
    const reportDateRange = document.getElementById('reportDateRange');
    const closeReportModal = document.getElementById('closeReportModal');

    // Modal elements for today's registrations
    const todayModal = document.getElementById('todayModal');
    const todayCarList = document.getElementById('todayCarList');
    const closeTodayModal = document.getElementById('closeTodayModal');

    // Load registered cars
    loadRegisteredCars();

    carForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const vehicleType = document.getElementById('vehicleType').value;
        const vehicleNumber = document.getElementById('vehicleNumber').value.trim();
        const ownerName = document.getElementById('ownerName').value.trim();
        const carModel = document.getElementById('carModel').value.trim();
        const contactNumber = document.getElementById('contactNumber').value.trim();
        const dateTime = new Date().toLocaleString();

        // Validate required fields
        if (!vehicleNumber || !vehicleType) {
            alert("Vehicle type and number are required.");
            return; // Exit the function if validation fails
        }

        const car = { vehicleType, vehicleNumber, ownerName, carModel, contactNumber, dateTime };
        saveCarToLocalStorage(car);
        displayCar(car, carList); // Pass carList as the list element
        carForm.reset(); // Reset form after successful submission
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all registrations?")) {
            localStorage.removeItem('registeredCars');
            carList.innerHTML = '';
        }
    });

    viewReportBtn.addEventListener('click', () => {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            alert("Please select both start and end dates.");
            return;
        }
        reportDateRange.textContent = `${start.toDateString()} to ${end.toDateString()}`;
        loadRegisteredCars(car => {
            const carDate = new Date(car.dateTime);
            return carDate >= start && carDate <= end;
        }, reportCarList); // Pass reportCarList for displaying report cars
        reportModal.style.display = 'block';
    });

    todayReportBtn.addEventListener('click', () => {
        const today = new Date().toDateString();
        loadRegisteredCars(car => {
            const carDate = new Date(car.dateTime).toDateString();
            return carDate === today;
        }, todayCarList); // Pass todayCarList for displaying today's cars
        todayModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        carDetailsModal.style.display = 'none';
    });

    closeReportModal.addEventListener('click', () => {
        reportModal.style.display = 'none';
    });

    closeTodayModal.addEventListener('click', () => {
        todayModal.style.display = 'none';
    });

    function saveCarToLocalStorage(car) {
        const cars = JSON.parse(localStorage.getItem('registeredCars')) || [];
        cars.push(car);
        localStorage.setItem('registeredCars', JSON.stringify(cars));
    }

    function loadRegisteredCars(filterFn = () => true, listElement = carList) {
        listElement.innerHTML = ''; // Clear the list before loading
        const cars = JSON.parse(localStorage.getItem('registeredCars')) || [];
        cars.filter(filterFn).forEach(car => displayCar(car, listElement));
    }

    function displayCar(car, listElement) {
        const listItem = document.createElement('li');
        listItem.classList.add('car-item');

        const vehicleNumber = document.createElement('span');
        vehicleNumber.textContent = car.vehicleNumber;
        vehicleNumber.classList.add('vehicle-number');
        vehicleNumber.onclick = () => {
            modalVehicleNumber.textContent = car.vehicleNumber;
            modalCarDetails.innerHTML = `
                <strong>Type:</strong> ${car.vehicleType} <br>
                <strong>Owner:</strong> ${car.ownerName || "N/A"} <br>
                <strong>Model:</strong> ${car.carModel || "N/A"} <br>
                <strong>Contact:</strong> ${car.contactNumber || "N/A"} <br>
                <small><em>Registered on:</em> ${car.dateTime}</small>
            `;
            carDetailsModal.style.display = 'block'; // Show car details modal
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => {
            removeCarFromLocalStorage(car.vehicleNumber);
            listElement.removeChild(listItem); // Remove the car from the list
        };

        listItem.appendChild(vehicleNumber);
        listItem.appendChild(deleteBtn);
        listElement.appendChild(listItem); // Append the list item to the correct list
    }

    function removeCarFromLocalStorage(vehicleNumber) {
        const cars = JSON.parse(localStorage.getItem('registeredCars')) || [];
        const updatedCars = cars.filter(car => car.vehicleNumber !== vehicleNumber);
        localStorage.setItem('registeredCars', JSON.stringify(updatedCars));
    }
});
