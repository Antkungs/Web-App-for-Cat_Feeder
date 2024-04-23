function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function showCatInfo(catName) {
    fetch('/get_cat_info/' + catName)
        .then(response => response.json())
        .then(data => {
            showGrape(catName);
            const catInfoDiv = document.getElementById('catInfo');
            catInfoDiv.innerHTML = ''; // Clear any existing content
            const catNameDiv = document.getElementById('catName');
            catNameDiv.textContent = catName;

            if (data.error) {
                catInfoDiv.textContent = 'Error: ' + data.error;
            } else if (data.length === 0) {
                catInfoDiv.textContent = "ยังไม่มีการกินวันนี้";
            } else {
                // Show cat eating information
                data.forEach((eatingRecord, index) => {
                    const recordDiv = document.createElement('div');
                    recordDiv.classList.add('record');

                    const foodGivenDiv = document.createElement('div');
                    foodGivenDiv.classList.add('info-box');
                    foodGivenDiv.innerHTML = `
                        <p class="info-number">ครั้งที่ ${index + 1} เวลา ${eatingRecord.CurrentTime} น.</p>
                        <b>ปริมาณอาหารที่ให้ : ${eatingRecord.food_give} กรัม</b>
                    `;
                    recordDiv.appendChild(foodGivenDiv);

                    const foodEatenDiv = document.createElement('div');
                    foodEatenDiv.classList.add('info-box');
                    foodEatenDiv.innerHTML = `
                        <p class="info-number">ครั้งที่ ${index + 1} เวลา ${eatingRecord.CurrentTime} น.</p>
                        <b>ปริมาณอาหารที่กิน : ${eatingRecord.food_eat} กรัม</b>
                    `;
                    recordDiv.appendChild(foodEatenDiv);

                    const foodRemainingDiv = document.createElement('div');
                    foodRemainingDiv.classList.add('info-box');
                    foodRemainingDiv.innerHTML = `
                        <p class="info-number">ครั้งที่ ${index + 1} เวลา ${eatingRecord.CurrentTime} น.</p>
                        <b>ปริมาณอาหารที่เหลือ : ${eatingRecord.food_remaining} กรัม</b>
                    `;
                    recordDiv.appendChild(foodRemainingDiv);

                    catInfoDiv.appendChild(recordDiv);
                });
            }

        })
        .catch(error => console.error('Error:', error));
}

function showGrape(catName) {
    fetch('/get_cat_infogrape/' + catName)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('chart').getContext('2d');
            const labels = data.map(item => item.date); 
            const totalFoodEaten = data.map(item => item.total_food_eat); 
            if (window.myChart) {
                window.myChart.destroy();
            }

            const config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'ปริมาณการกินอาหารทั้งหมด',
                        data: totalFoodEaten,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: 200
                        }
                    }
                }
            };

            window.myChart = new Chart(ctx, config);
        })
        .catch(error => console.error('Error:', error));
}
function catSetting(id) {
    fetch('/setting/getNameSetting/' + id)
    .then(response => response.json())
    .then(data => {
        const catSettingElement = document.getElementById('catSetting');
        catSettingElement.innerHTML = `
            <h3>แก้ไขรายละเอียดแมว</h3>
            <p>ชื่อ: ${data.cat_name}</p>
            <form id="updateForm" action="/insertData/${id}" method="post">
                <label for="name">ชื่อ:</label><br>
                <input type="text" id="name" name="name" value="${data.cat_name}" required><br>
                <label for="food_quantity">ปริมาณอาหาร:</label><br>
                <input type="text" id="food_quantity" name="food_quantity" required><br>
                <p>ช่วงเวลาการให้อาหาร</p>
                <label for="stime_1">เริ่มมื้อ 1:</label><br>
                <input type="time" id="stime_1" name="stime_1" required><br>
                <label for="etime_1">สิ้นสุดมื้อ 1:</label><br>
                <input type="time" id="etime_1" name="etime_1" required><br>

                <label for="stime_2">เริ่มมื้อ 2:</label><br>
                <input type="time" id="stime_2" name="stime_2" required><br>
                <label for="etime_2">สิ้นสุดมื้อ 2:</label><br>
                <input type="time" id="etime_2" name="etime_2" required><br>

                <label for="stime_3">เริ่มมื้อ 3:</label><br>
                <input type="time" id="stime_3" name="stime_3" required><br>      
                <label for="etime_3">สิ้นสุดมื้อ 3:</label><br>
                <input type="time" id="etime_3" name="etime_3" required><br>     

                <label for="food_container">ถังอาหาร:</label><br>
                <input type="radio" id="tank1" name="tank" value="1" required>
                <label for="tank1" id="tank1">${data.results[0].name_tank}</label><br>
                            
                <input type="radio" id="tank2" name="tank" value="2" required>
                <label for="tank2" id="tank2">${data.results[1].name_tank}</label><br>

                <input type="submit" value="Submit">
                <button type="reset">ล้างข้อมูล</button>
            </form>
        `;
        
        // เพิ่ม event listener เพื่อให้หน้าเว็บ redirect หลังจากกด submit
        document.getElementById('updateForm').addEventListener('submit', function(event) {
            // เมื่อ submit ให้เรียกฟังก์ชัน redirect และป้องกัน default behavior ของ form
            event.preventDefault();
            redirectHome();
        });
    });
}

// ฟังก์ชันสำหรับ redirect ไปยังหน้าแรก
function redirectHome() {
    alert("แก้ไขข้อมูลเสร็จสิ้น");
    window.location.href = '/'; // เปลี่ยน URL ตามต้องการ
}

