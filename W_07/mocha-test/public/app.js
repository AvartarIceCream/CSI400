// public/app.js
class APITester {
    constructor() {
        this.baseURL = window.location.origin;
        this.testResults = [];
        this.updateStats();
        
        // ตั้งค่า event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // แสดง/ซ่อน request body ตาม method
        document.getElementById('apiMethod').addEventListener('change', (e) => {
            const showBody = ['POST', 'PUT'].includes(e.target.value);
            document.getElementById('requestBodyGroup').style.display = showBody ? 'block' : 'none';
        });
    }

    async runAllTests() {
        const testResults = document.getElementById('testResults');
        testResults.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Running tests...</p>
            </div>
        `;

        this.testResults = [];
        this.updateStats();

        // กำหนด test cases
        const testCases = [
            { name: 'GET All Items', method: 'GET', url: '/api/items', body: null },
            { name: 'GET Item by ID', method: 'GET', url: '/api/items/1', body: null },
            { name: 'GET Non-existent Item', method: 'GET', url: '/api/items/999', body: null },
            { name: 'POST New Item', method: 'POST', url: '/api/items', body: { name: 'Frontend Test Item', price: 250 } },
            { name: 'PUT Update Item', method: 'PUT', url: '/api/items/1', body: { name: 'Updated Item', price: 999 } },
            { name: 'DELETE Item', method: 'DELETE', url: '/api/items/2', body: null }
        ];

        // รัน test cases ตามลำดับ
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            await this.runSingleTest(testCase, i);
        }
    }

    async runSingleTest(testCase, index) {
        // แสดงสถานะกำลังรัน
        this.updateTestUI(index, 'running', 'Running...', testCase);

        try {
            const response = await fetch(this.baseURL + testCase.url, {
                method: testCase.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: testCase.body ? JSON.stringify(testCase.body) : null
            });

            const data = await response.json();
            const passed = response.ok;

            // บันทึกผลลัพธ์
            this.testResults.push({
                name: testCase.name,
                passed: passed,
                response: data,
                status: response.status
            });

            // อัพเดท UI
            this.updateTestUI(index, passed ? 'passed' : 'failed', 
                passed ? 'Passed' : `Failed: ${response.status}`, testCase, data);

        } catch (error) {
            this.testResults.push({
                name: testCase.name,
                passed: false,
                response: error.message,
                status: 0
            });

            this.updateTestUI(index, 'failed', `Error: ${error.message}`, testCase);
        }

        this.updateStats();
    }

    updateTestUI(index, status, message, testCase, response = null) {
        const testResults = document.getElementById('testResults');
        
        // ถ้าเป็น test แรก ให้ล้าง loading
        if (index === 0) {
            testResults.innerHTML = '';
        }

        // สร้างหรืออัพเดท test item
        let testItem = document.getElementById(`test-${index}`);
        if (!testItem) {
            testItem = document.createElement('div');
            testItem.id = `test-${index}`;
            testItem.className = `test-item ${status}`;
            testResults.appendChild(testItem);
        } else {
            testItem.className = `test-item ${status}`;
        }

        testItem.innerHTML = `
            <div class="test-title">
                ${testCase.method} ${testCase.url}
                <span class="test-status status-${status}">${message}</span>
            </div>
            <div class="test-details">
                <strong>${testCase.name}</strong><br>
                ${testCase.body ? `Body: ${JSON.stringify(testCase.body)}` : ''}
                ${response ? `<br>Response: ${JSON.stringify(response)}` : ''}
            </div>
        `;
    }

    async testSingleEndpoint() {
        const method = document.getElementById('apiMethod').value;
        const url = document.getElementById('apiUrl').value;
        const body = document.getElementById('requestBody').value;

        const responseBox = document.getElementById('apiResponse');
        responseBox.innerHTML = 'Testing...';

        try {
            const response = await fetch(this.baseURL + url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? body : null
            });

            const data = await response.json();
            
            responseBox.innerHTML = JSON.stringify(data, null, 2);
            responseBox.style.background = response.ok ? '#e8f5e8' : '#ffebee';
            responseBox.style.borderColor = response.ok ? '#4CAF50' : '#f44336';

        } catch (error) {
            responseBox.innerHTML = `Error: ${error.message}`;
            responseBox.style.background = '#ffebee';
            responseBox.style.borderColor = '#f44336';
        }
    }

    updateStats() {
        const total = this.testResults.length;
        const passed = this.testResults.filter(test => test.passed).length;
        const failed = total - passed;

        document.getElementById('totalTests').textContent = total;
        document.getElementById('passedTests').textContent = passed;
        document.getElementById('failedTests').textContent = failed;
    }

    clearResults() {
        this.testResults = [];
        document.getElementById('testResults').innerHTML = `
            <div class="loading">
                <p>Click "Run All Tests" to start testing</p>
            </div>
        `;
        this.updateStats();
    }
}

// เริ่มต้น application
const apiTester = new APITester();

// ฟังก์ชัน global สำหรับเรียกจาก HTML
function runAllTests() {
    apiTester.runAllTests();
}

function testSingleEndpoint() {
    apiTester.testSingleEndpoint();
}

function clearResults() {
    apiTester.clearResults();
}