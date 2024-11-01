document.addEventListener("DOMContentLoaded", () => {
    const carForm = document.getElementById("carForm");
    const carList = document.getElementById("carList");
    const viewReportBtn = document.getElementById("viewReportBtn");
    const todayReportBtn = document.getElementById("todayReportBtn");
    const clearAllBtn = document.getElementById("clearAll");
    const paginationControls = document.getElementById("paginationControls");

    // Modal Elements
    const carDetailsModal = document.getElementById("carDetailsModal");
    const reportModal = document.getElementById("reportModal");
    const todayModal = document.getElementById("todayModal");
    const tempModal = document.getElementById("tempModal");
    const closeModalBtn = document.getElementById("closeModal");
    const closeReportModal = document.getElementById("closeReportModal");
    const closeTodayModal = document.getElementById("closeTodayModal");
    const closeTempModal = document.getElementById("closeTempModal");

    const deleteModalBtn = document.getElementById("deleteModalBtn");
    const modalVehicleNumber = document.getElementById("modalVehicleNumber");
    const modalCarDetails = document.getElementById("modalCarDetails");

    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const reportDateRange = document.getElementById("reportDateRange");
    const reportCarList = document.getElementById("reportCarList");
    const todayCarList = document.getElementById("todayCarList");

    const itemsPerPage = 5;
    let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    let currentPage = 1;
    let selectedVehicle = null;

    // Authentication Elements
    const authModal = document.getElementById("authModal");
    const passcodeInput = document.getElementById("passcodeInput");
    const submitPasscodeBtn = document.getElementById("submitPasscodeBtn");
    const authMessage = document.getElementById("authMessage");

    function saveVehicles() {
        localStorage.setItem("vehicles", JSON.stringify(vehicles));
    }

    function formatDate(date) {
        // Format the date to YYYY-MM-DD HH:MM:SS
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formattedDate = new Date(date).toLocaleString('en-CA', options); // Use 'en-CA' for the correct format
        return formattedDate.replace(',', ''); // Remove comma
    }

    function renderPaginationControls() {
        const totalPages = Math.ceil(vehicles.length / itemsPerPage);
        paginationControls.innerHTML = "";

        // Previous button
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "<";
        prevBtn.disabled = currentPage === 1;
        prevBtn.classList.add("report-btn0");
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderVehicleList();
            }
        });
        paginationControls.appendChild(prevBtn);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.add("report-btn1");
            if (i === currentPage) pageBtn.classList.add("active");
            pageBtn.addEventListener("click", () => {
                currentPage = i;
                renderVehicleList();
            });
            paginationControls.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.textContent = ">";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.classList.add("report-btn0");
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderVehicleList();
            }
        });
        paginationControls.appendChild(nextBtn);
    }

    function renderVehicleList() {
        carList.innerHTML = "";

        vehicles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentVehicles = vehicles.slice(start, end);

        currentVehicles.forEach(vehicle => {
            const li = document.createElement("li");
            li.textContent = `${vehicle.vehicleNumber} - ${vehicle.date}`;
            li.addEventListener("click", () => showVehicleDetails(vehicle));
            carList.appendChild(li);
        });

        renderPaginationControls();
    }

    function showVehicleDetails(vehicle) {
        selectedVehicle = vehicle;
        authModal.style.display = "block"; // Show authentication modal
    }

    function authenticate(action) {
        const passcode = passcodeInput.value;
        if (passcode === '000000') {
            alert('Authentication successful!');
            authMessage.style.display = "none"; // Hide any previous error message
            passcodeInput.value = ""; // Clear the input

            if (action === "viewDetails") {
                showDetails();
            }
            authModal.style.display = "none"; // Close the authentication modal
        } else {
            authMessage.style.display = "block"; // Show error message
        }
    }

    function showDetails() {
        modalVehicleNumber.textContent = selectedVehicle.vehicleNumber;
        modalCarDetails.innerHTML = `
            <p>Type: ${selectedVehicle.vehicleType}</p>
            <p>Owner: ${selectedVehicle.ownerName || "N/A"}</p>
            <p>Model: ${selectedVehicle.carModel || "N/A"}</p>
            <p>Contact: ${selectedVehicle.contactNumber || "N/A"}</p>
            <p>Date: ${selectedVehicle.date}</p>
        `;
        carDetailsModal.style.display = "block";
    }

    function viewReport() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate) {
            // Set time to midnight for accurate comparisons
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            reportCarList.innerHTML = "";

            const reportVehicles = vehicles.filter(vehicle => {
                const vehicleDate = new Date(vehicle.date); // Use the stored date format
                return vehicleDate >= startDate && vehicleDate <= endDate;
            });

            reportVehicles.forEach(vehicle => {
                const li = document.createElement("li");
                li.textContent = `${vehicle.vehicleNumber} - ${vehicle.date}`;
                li.addEventListener("click", () => showVehicleDetails(vehicle));
                reportCarList.appendChild(li);
            });

            reportDateRange.textContent = `${startDateInput.value} to ${endDateInput.value}`;
            reportModal.style.display = "block";
        } else {
            alert("Please select both start and end dates.");
        }
    }

    deleteModalBtn.addEventListener("click", () => {
        if (selectedVehicle) {
            vehicles = vehicles.filter(v => v !== selectedVehicle);
            saveVehicles();
            renderVehicleList();
            carDetailsModal.style.display = "none";
        }
    });

    closeModalBtn.onclick = () => carDetailsModal.style.display = "none";
    closeReportModal.onclick = () => reportModal.style.display = "none";
    closeTodayModal.onclick = () => todayModal.style.display = "none";
    closeTempModal.onclick = () => tempModal.style.display = "none";
    document.getElementById("logo").addEventListener("click", () => {
        tempModal.style.display = "block";
    });

    function registerVehicle(event) {
        event.preventDefault();
        const vehicleType = document.getElementById("vehicleType").value;
        const vehicleNumber = document.getElementById("vehicleNumber").value;
        const ownerName = document.getElementById("ownerName").value;
        const carModel = document.getElementById("carModel").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const date = formatDate(new Date());  // Includes date and time in the required format

        const newVehicle = { vehicleType, vehicleNumber, ownerName, carModel, contactNumber, date };
        vehicles.push(newVehicle);
        saveVehicles();
        carForm.reset();
        renderVehicleList();

        // Show registration success message based on owner's name
        if (ownerName, vehicleNumber, vehicleType) {
            alert(`Hi ${ownerName}, your ${vehicleType} ${vehicleNumber} is registered successfully.`);
        } else {
            alert(`Hey there, your ${vehicleType} ${vehicleNumber} is registered successfully.`);
        }
    }

    carForm.addEventListener("submit", registerVehicle);
    clearAllBtn.addEventListener("click", () => {
        authModal.style.display = "block"; // Show authentication modal for clearing all
        passcodeInput.value = ""; // Clear previous input
    });

    viewReportBtn.addEventListener("click", viewReport); // No authentication needed for viewing report

    todayReportBtn.addEventListener("click", () => {
        todayCarList.innerHTML = "";
        const today = new Date().toLocaleDateString('en-CA'); // Use 'en-CA' for the correct format
        const todayVehicles = vehicles.filter(vehicle => vehicle.date.startsWith(today));
        todayVehicles.forEach(vehicle => {
            const li = document.createElement("li");
            li.textContent = `${vehicle.vehicleNumber} - ${vehicle.date}`;
            li.addEventListener("click", () => showVehicleDetails(vehicle));
            todayCarList.appendChild(li);
        });
        todayModal.style.display = "block";
    });

    submitPasscodeBtn.addEventListener("click", () => {
        if (selectedVehicle) {
            authenticate("viewDetails");
        } else {
            const passcode = passcodeInput.value;
            if (passcode === '000000') {
                vehicles = []; // Clear all vehicles
                saveVehicles(); // Update local storage
                renderVehicleList(); // Re-render vehicle list to show it's empty
                authModal.style.display = "none"; // Close the authentication modal
                alert('All vehicles have been cleared.'); // Inform the user
            } else {
                authMessage.style.display = "block"; // Show error message
            }
        }
    });

    renderVehicleList(); // Initial render
});