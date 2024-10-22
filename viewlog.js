async function fetchLogs() {
    const droneId = "65010703";
    const logsUrl = 'https://app-tracking.pockethost.io/api/collections/drone_logs/records';
    let allLogs = []; // เก็บ logs ทั้งหมด
    let page = 1; 
    let totalPages = 1;

    // หน้าโหลด
    document.getElementById('loading').style.display = 'flex';

    try {
        // ดึงข้อมูลจากทุกหน้า
        do {
            const response = await fetch(`${logsUrl}?page=${page}`);
            if (!response.ok) {
                console.error("Network response was not ok", response.status);
                return;
            }

            const data = await response.json();
            console.log("Raw data from API:", data); // ดูข้อมูลที่ดึงมา

            // ตรวจสอบว่า items มีข้อมูลหรือไม่
            if (!data.items || !Array.isArray(data.items)) {
                console.error("No items found or items is not an array");
                document.getElementById('noLogsMessage').style.display = 'block'; // แสดงข้อความเมื่อไม่มีข้อมูล
                return;
            }

            allLogs = allLogs.concat(data.items); // รวม logs แต่ละหน้า
            totalPages = data.totalPages; // เก็บจำนวนหน้าที่ดึงมา
            page++; // ไปหน้าถัดไป
        } while (page <= totalPages);

        // กรอง logs ตาม drone_id ที่กำหนด
        const logs = allLogs.filter(log => log.drone_id && log.drone_id.toString() === droneId);
        const logsBody = document.getElementById('logsBody');
        logsBody.innerHTML = ''; // ล้างข้อมูลในตารางก่อน

        if (logs.length === 0) {
            document.getElementById('noLogsMessage').style.display = 'block'; // แสดงข้อความเมื่อไม่มี logs
        } else {
            // เรียง logs ใหม่ที่สุดอยู่บนสุด
            logs.sort((a, b) => new Date(b.created) - new Date(a.created));
            logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.created}</td>
                    <td>${log.country || "N/A"}</td>
                    <td>${log.drone_id}</td>
                    <td>${log.drone_name || "N/A"}</td>
                    <td>${log.celsius}</td>
                `;
                logsBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

window.onload = fetchLogs;