function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('nav-active');
}

async function fetchDroneData() {
    // แสดงหน้าโหลด
    document.getElementById('loading').style.display = 'flex';

    try {
        // ดึงข้อมูลจาก URL
        const response = await fetch('https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec');
        const data = await response.json();
        
        console.log(data);

        if (Array.isArray(data.data)) {
            // กรองข้อมูลตาม drone_id
            const filteredDrones = data.data.filter(drone => drone.drone_id === 65010703);
            console.log(filteredDrones);
            
            if (filteredDrones.length > 0) {
                displayDroneData(filteredDrones);
            } else {
                console.log('No drones found with the specified ID.');
                displayNoDataMessage();
            }
        } else {
            console.error('Data is not an array:', data.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function displayDroneData(droneItems) {
    const tableBody = document.getElementById('drone-table').querySelector('tbody');
    tableBody.innerHTML = ''; // เคลียร์ข้อมูลที่มีอยู่

    droneItems.forEach(drone => {
        // ตรวจสอบค่า max_speed
        const maxSpeedDisplay = (drone.max_speed === null || typeof drone.max_speed === 'undefined') 
            ? 100 
            : (drone.max_speed > 110 ? 110 : drone.max_speed);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${drone.drone_id || 'N/A'}</td>
            <td>${drone.drone_name || 'N/A'}</td>
            <td>${drone.light || 'N/A'}</td> 
            <td>${maxSpeedDisplay}</td>
            <td>${drone.country || 'N/A'}</td>
            <td>${drone.population || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function displayNoDataMessage() {
    const tableBody = document.getElementById('drone-table').querySelector('tbody');
    tableBody.innerHTML = '<tr><td colspan="6">No data available for this drone ID.</td></tr>';
}

window.onload = fetchDroneData;