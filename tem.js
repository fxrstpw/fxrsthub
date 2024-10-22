document.getElementById('temperatureForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const droneId = document.getElementById('droneId').value;
    const temperature = document.getElementById('temperature').value;

    // ข้อมูลที่จะส่ง
    const data = {
        drone_id: droneId,
        celsius: temperature,
        country: "Thailand",
        drone_name: "Annisa Noivong"
    };

    // แสดงหน้าโหลด
    showLoading(true);

    // ส่งข้อมูลไปยัง API
    fetch('https://app-tracking.pockethost.io/api/collections/drone_logs/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // แปลงข้อมูลเป็น JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // ตอบกลับเป็น JSON
    })
    .then(data => {
        displaySuccessMessage('Temperature updated successfully!');
        setTimeout(() => {
            location.reload();
        }, 2000);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        showLoading(false);
    });
});

// ฟังก์ชันสำหรับแสดง/ซ่อนหน้าโหลด
function showLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'flex' : 'none';
}

// ฟังก์ชันแสดงข้อความสำเร็จ
function displaySuccessMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    const messageBox = document.createElement('div');
    messageBox.innerText = message;
    messageBox.className = 'success-message';
    messageContainer.appendChild(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}