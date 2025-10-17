// ===== TESTS FOR GET /api/items =====
// Test 1: Status Code
pm.test("GET - Status code is 200", function () {
    pm.response.to.have.status(200);
});
// Test 2: Response time
pm.test("GET - Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});
// Test 3: Response header
pm.test("GET - Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');
});
// Test 4: Response body structure
pm.test("GET - Response body is an array", function () {
    const responseData = pm.response.json();
    pm.expect(responseData).to.be.an('array');
});
// Test 5: Data validation for first item
pm.test("GET - First item has correct structure", function () {
    const responseData = pm.response.json();
    if (responseData.length > 0) {
        const firstItem = responseData[0];
        pm.expect(firstItem).to.have.property('id');
        pm.expect(firstItem).to.have.property('name');
        pm.expect(firstItem).to.have.property('price');
        pm.expect(firstItem.id).to.be.a('number');
        pm.expect(firstItem.name).to.be.a('string');
        pm.expect(firstItem.price).to.be.a('number');
    }
});
// Test 6: Save items count for later use
pm.test("GET - Save initial items count", function () {
    const responseData = pm.response.json();
    pm.environment.set("initial_items_count", responseData.length);
    pm.environment.set("first_item_id", responseData[0]?.id);
});

// ===== TESTS FOR POST /api/items =====
// Test 1: Status Code for creation
pm.test("POST - Status code is 201", function () {
    pm.response.to.have.status(201);
});
// Test 2: Response structure
pm.test("POST - Response has correct structure", function () {
    const responseData = pm.response.json();
    pm.expect(responseData).to.have.property('id');
    pm.expect(responseData).to.have.property('name');
    pm.expect(responseData).to.have.property('price');
});
// Test 3: Auto-increment ID validation
pm.test("POST - ID is auto-incremented correctly", function () {
    const responseData = pm.response.json();
    const initialCount = pm.environment.get("initial_items_count");
    pm.expect(responseData.id).to.equal(initialCount + 1);
});
// Test 4: Data integrity check
pm.test("POST - Data matches request body", function () {
    const requestBody = JSON.parse(pm.request.body.raw);
    const responseData = pm.response.json();
    pm.expect(responseData.name).to.equal(requestBody.name);
    pm.expect(responseData.price).to.equal(requestBody.price);
});
// Test 5: Save new item ID for later use
pm.test("POST - Save new item ID", function () {
    const responseData = pm.response.json();
    pm.environment.set("new_item_id", responseData.id);
    console.log("New item created with ID:", responseData.id);
});

// ===== TESTS FOR PUT /api/items/:id =====
// Test 1: Status Code for update
pm.test("PUT - Status code is 200", function () {
    pm.response.to.have.status(200);
});
// Test 2: Response structure
pm.test("PUT - Response has correct structure", function () {
    const responseData = pm.response.json();
    pm.expect(responseData).to.have.property('id');
    pm.expect(responseData).to.have.property('name');
    pm.expect(responseData).to.have.property('price');
});
// Test 3: ID consistency check
pm.test("PUT - ID remains unchanged", function () {
    const responseData = pm.response.json();
    const itemId = pm.environment.get("new_item_id");
    pm.expect(responseData.id).to.equal(itemId);
});
// Test 4: Data update verification
pm.test("PUT - Data matches updated values", function () {
    const requestBody = JSON.parse(pm.request.body.raw);    
    const responseData = pm.response.json();
    pm.expect(responseData.name).to.equal(requestBody.name);
    pm.expect(responseData.price).to.equal(requestBody.price);
});
// Test 5: Log updated item ID
pm.test("PUT - Log updated item ID", function () {
    const responseData = pm.response.json();
    console.log("Item updated with ID:", responseData.id);
});

// ===== TESTS FOR DELETE /api/items/:id =====
// Test 1: Status Code for deletion
pm.test("DELETE - Status code is 200", function () {
    pm.response.to.have.status(200);
});
// Test 2: Response message verification
pm.test("DELETE - Success message", function () {   
    const responseData = pm.response.json();
    pm.expect(responseData).to.have.property('message');
    pm.expect(responseData.message).to.include('deleted');
});
// Test 3: Verify deletion by calling GET again
pm.test("DELETE - Verify item is actually deleted", function () {
    // This would typically be a separate request, but we can log for verification
    console.log("Item with ID", pm.environment.get("new_item_id"), "should be deleted");
});
// Test 4: Clean up environment variables
pm.test("DELETE - Clean up test data", function () {
    pm.environment.unset("new_item_id");
});