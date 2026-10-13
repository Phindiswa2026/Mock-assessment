
// Wait for the DOM content to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claimForm');
    const statusMessage = document.getElementById('statusMessage');
    const claimsTableBody = document.querySelector('#claimsTable tbody');

    // Simple placeholder submit handler to verify layout and structure functionality
    claimForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Capture values to verify structure wiring
        const name = document.getElementById('claimantName').value;
        const email = document.getElementById('claimantEmail').value;
        const productCode = document.getElementById('productCode').value;
        const category = document.getElementById('claimCategory').value;
        const description = document.getElementById('claimDescription').value;

        // Basic structural check and feedback display
        if (!name || !email || !productCode || !category || !description) {
            statusMessage.textContent = 'Please fill out all required fields.';
            statusMessage.className = 'status-message error';
            return;
        }

        // Show success status
        statusMessage.textContent = 'Claim form structure initialized and ready for processing logic!';
        statusMessage.className = 'status-message success';

        // Append dummy row to table display area to confirm layout works
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${escapeHTML(name)}</td>
            <td>${escapeHTML(email)}</td>
            <td>${escapeHTML(productCode)}</td>
            <td>${escapeHTML(category)}</td>
            <td>${escapeHTML(description)}</td>
        `;
        claimsTableBody.appendChild(newRow);

        // Reset form
        claimForm.reset();
    });
});

// Helper function to safely escape HTML input against injection
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claimForm');
    const statusMessage = document.getElementById('statusMessage');
    
    // Create a container dynamically for the claim summary if it doesn't exist
    let summaryContainer = document.getElementById('claimSummary');
    if (!summaryContainer) {
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'claimSummary';
        summaryContainer.style.marginTop = '20px';
        document.querySelector('.container').appendChild(summaryContainer);
    }

    claimForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 1. Capture form values
        const name = document.getElementById('claimantName').value.trim();
        const email = document.getElementById('claimantEmail').value.trim();
        const productCode = document.getElementById('productCode').value.trim();
        const category = document.getElementById('claimCategory').value.trim();
        const description = document.getElementById('claimDescription').value.trim();

        if (!name || !email || !productCode || !category || !description) {
            statusMessage.textContent = 'Please fill out all required fields.';
            statusMessage.className = 'status-message error';
            return;
        }

        // 2. Create the Claim Object with a nested customer object and status method
        const newClaim = {
            id: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
            category: category,
            status: 'Submitted', // Initial status
            customer: {
                name: name,
                email: email
            },
            productCode: productCode,
            description: description,
            
            // Method to change the claim status
            updateStatus(newStatus) {
                this.status = newStatus;
            }
        };

        // 3. Display readable summary on the page
        renderClaimSummary(newClaim, summaryContainer);

        // 4. Demonstrate the status change method
        // For demonstration, let's update status to 'Under Review' after 2 seconds
        setTimeout(() => {
            newClaim.updateStatus('Under Review');
            // Re-render to show updated status
            renderClaimSummary(newClaim, summaryContainer);
            statusMessage.textContent = 'Claim status updated to: Under Review';
            statusMessage.className = 'status-message success';
        }, 2000);

        statusMessage.textContent = 'Claim object created successfully!';
        statusMessage.className = 'status-message success';
        claimForm.reset();
    });
});

// Function to display readable summary of the claim object
function renderClaimSummary(claim, container) {
    container.innerHTML = `
        <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; background: #fafafa;">
            <h3>Claim Summary</h3>
            <p><strong>Claim ID:</strong> ${escapeHTML(claim.id)}</p>
            <p><strong>Customer Name:</strong> ${escapeHTML(claim.customer.name)}</p>
            <p><strong>Customer Email:</strong> ${escapeHTML(claim.customer.email)}</p>
            <p><strong>Product Code:</strong> ${escapeHTML(claim.productCode)}</p>
            <p><strong>Category:</strong> ${escapeHTML(claim.category)}</p>
            <p><strong>Description:</strong> ${escapeHTML(claim.description)}</p>
            <p><strong>Current Status:</strong> <span style="color: #007BFF; font-weight: bold;">${escapeHTML(claim.status)}</span></p>
        </div>
    `;
}

// Helper function to prevent XSS
function escapeHTML(str) {
    return str.toString().replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claimForm');
    const statusMessage = document.getElementById('statusMessage');
    const claimsTableBody = document.querySelector('#claimsTable tbody');
    const categoryFilter = document.getElementById('categoryFilter');

    // 1. Store at least four initial claim objects in an array
    let claims = [
        {
            id: 'CLM-1001',
            category: 'Hardware Failure',
            status: 'Submitted',
            customer: { name: 'Alice Smith', email: 'alice@example.com' },
            productCode: 'PROD-A1',
            description: 'Screen stopped turning on.'
        },
        {
            id: 'CLM-1002',
            category: 'Manufacturing Defect',
            status: 'Under Review',
            customer: { name: 'Bob Jones', email: 'bob@example.com' },
            productCode: 'PROD-B2',
            description: 'Loose casing around the charging port.'
        },
        {
            id: 'CLM-1003',
            category: 'Accidental Damage',
            status: 'Resolved',
            customer: { name: 'Charlie Brown', email: 'charlie@example.com' },
            productCode: 'PROD-C3',
            description: 'Cracked screen due to a drop.'
        },
        {
            id: 'CLM-1004',
            category: 'Hardware Failure',
            status: 'Submitted',
            customer: { name: 'Diana Prince', email: 'diana@example.com' },
            productCode: 'PROD-A1',
            description: 'Battery drains rapidly within 30 minutes.'
        }
    ];

    // Initial render of all claims
    renderClaims(claims);

    // Form submission to add new claims to the array
    claimForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('claimantName').value.trim();
        const email = document.getElementById('claimantEmail').value.trim();
        const productCode = document.getElementById('productCode').value.trim();
        const category = document.getElementById('claimCategory').value.trim();
        const description = document.getElementById('claimDescription').value.trim();

        if (!name || !email || !productCode || !category || !description) {
            statusMessage.textContent = 'Please fill out all required fields.';
            statusMessage.className = 'status-message error';
            return;
        }

        const newClaim = {
            id: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
            category: category,
            status: 'Submitted',
            customer: { name: name, email: email },
            productCode: productCode,
            description: description
        };

        // Add to array
        claims.push(newClaim);

        // Re-apply current filter when new item is added
        applyFilter();

        statusMessage.textContent = 'Claim submitted and added to records!';
        statusMessage.className = 'status-message success';
        claimForm.reset();
    });

    // 2. Filter control event listener
    categoryFilter.addEventListener('change', () => {
        applyFilter();
    });

    function applyFilter() {
        const selectedCategory = categoryFilter.value;

        if (selectedCategory === 'All') {
            renderClaims(claims);
        } else {
            // Use filter array method
            const filteredClaims = claims.filter(claim => claim.category === selectedCategory);
            renderClaims(filteredClaims);
        }
    }

    // 3. Display summary of every claim using a suitable array method (forEach)
    function renderClaims(claimsArray) {
        claimsTableBody.innerHTML = '';

        if (claimsArray.length === 0) {
            claimsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No claims found.</td></tr>';
            return;
        }

        claimsArray.forEach(claim => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHTML(claim.customer.name)}</td>
                <td>${escapeHTML(claim.customer.email)}</td>
                <td>${escapeHTML(claim.productCode)}</td>
                <td>${escapeHTML(claim.category)}</td>
                <td>${escapeHTML(claim.status)}</td>
            `;
            claimsTableBody.appendChild(row);
        });
    }
});

// Helper function to prevent XSS
function escapeHTML(str) {
    return str.toString().replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
     document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claimForm');
    const statusMessage = document.getElementById('statusMessage');
    const claimsTableBody = document.querySelector('#claimsTable tbody');
    const categoryFilter = document.getElementById('categoryFilter');

    // Existing claims array from B3
    let claims = [
        {
            id: 'CLM-1001',
            category: 'Hardware Failure',
            status: 'Submitted',
            customer: { name: 'Alice Smith', email: 'alice@example.com' },
            productCode: 'PROD-A1',
            description: 'Screen stopped turning on.'
        },
        {
            id: 'CLM-1002',
            category: 'Manufacturing Defect',
            status: 'Under Review',
            customer: { name: 'Bob Jones', email: 'bob@example.com' },
            productCode: 'PROD-B2',
            description: 'Loose casing around the charging port.'
        },
        {
            id: 'CLM-1003',
            category: 'Accidental Damage',
            status: 'Resolved',
            customer: { name: 'Charlie Brown', email: 'charlie@example.com' },
            productCode: 'PROD-C3',
            description: 'Cracked screen due to a drop.'
        },
        {
            id: 'CLM-1004',
            category: 'Hardware Failure',
            status: 'Submitted',
            customer: { name: 'Diana Prince', email: 'diana@example.com' },
            productCode: 'PROD-A1',
            description: 'Battery drains rapidly within 30 minutes.'
        }
    ];

    renderClaims(claims);

    // Form submission with validation and safe processing
    claimForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Clear previous status messages safely using textContent
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        // 1. Capture input values and trim whitespace
        const name = document.getElementById('claimantName').value.trim();
        const email = document.getElementById('claimantEmail').value.trim();
        const productCode = document.getElementById('productCode').value.trim();
        const category = document.getElementById('claimCategory').value.trim();
        const description = document.getElementById('claimDescription').value.trim();

        // 2. Validate all fields
        if (!name) {
            showError('Claimant name is required.');
            return;
        }

        // Beginner-level email validation check
        if (!email || !email.includes('@') || !email.includes('.')) {
            showError('Please enter a valid email address containing "@" and ".".');
            return;
        }

        if (!productCode) {
            showError('Product code is required.');
            return;
        }

        if (!category) {
            showError('Please select a claim category.');
            return;
        }

        if (!description) {
            showError('Claim description is required.');
            return;
        }

        // 3. Create new claim object only if validation passes
        const newClaim = {
            id: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
            category: category,
            status: 'Submitted',
            customer: { 
                name: name, 
                email: email 
            },
            productCode: productCode,
            description: description
        };

        // 4. Safely add to array and update display
        claims.push(newClaim);
        applyFilter();

        // Display success message using text-safe DOM approach
        statusMessage.textContent = 'Success: Claim has been successfully validated and added!';
        statusMessage.className = 'status-message success';

        // Reset the form
        claimForm.reset();
    });

    categoryFilter.addEventListener('change', () => {
        applyFilter();
    });

    function applyFilter() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'All') {
            renderClaims(claims);
        } else {
            const filteredClaims = claims.filter(claim => claim.category === selectedCategory);
            renderClaims(filteredClaims);
        }
    }

    function renderClaims(claimsArray) {
        claimsTableBody.innerHTML = '';

        if (claimsArray.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 5;
            emptyCell.style.textAlign = 'center';
            emptyCell.textContent = 'No claims found.';
            emptyRow.appendChild(emptyCell);
            claimsTableBody.appendChild(emptyRow);
            return;
        }

        claimsArray.forEach(claim => {
            const row = document.createElement('tr');

            // Text-safe DOM approach using createElement and textContent instead of innerHTML
            const nameCell = document.createElement('td');
            nameCell.textContent = claim.customer.name;

            const emailCell = document.createElement('td');
            emailCell.textContent = claim.customer.email;

            const productCell = document.createElement('td');
            productCell.textContent = claim.productCode;

            const categoryCell = document.createElement('td');
            categoryCell.textContent = claim.category;

            const statusCell = document.createElement('td');
            statusCell.textContent = claim.status;

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(productCell);
            row.appendChild(categoryCell);
            row.appendChild(statusCell);

            claimsTableBody.appendChild(row);
        });
    }

    // Helper function for safe error display
    function showError(message) {
        statusMessage.textContent = 'Error: ' + message;
        statusMessage.className = 'status-message error';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claimForm');
    const statusMessage = document.getElementById('statusMessage');
    const claimsTableBody = document.querySelector('#claimsTable tbody');
    const categoryFilter = document.getElementById('categoryFilter');

    let claims = [
        {
            id: 'CLM-1001',
            category: 'Hardware Failure',
            status: 'Submitted',
            customer: { name: 'Alice Smith', email: 'alice@example.com' },
            productCode: 'PROD-A1',
            description: 'Screen stopped turning on.'
        },
        {
            id: 'CLM-1002',
            category: 'Manufacturing Defect',
            status: 'Under Review',
            customer: { name: 'Bob Jones', email: 'bob@example.com' },
            productCode: 'PROD-B2',
            description: 'Loose casing around the charging port.'
        }
    ];

    renderClaims(claims);

    claimForm.addEventListener('submit', (event) => {
        event.preventDefault();
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        const name = document.getElementById('claimantName').value.trim();
        const email = document.getElementById('claimantEmail').value.trim();
        const productCode = document.getElementById('productCode').value.trim();
        const category = document.getElementById('claimCategory').value.trim();
        const description = document.getElementById('claimDescription').value.trim();

        // Standard form validation
        if (!name || !email || !productCode || !category || !description) {
            statusMessage.textContent = 'Error: All fields are required.';
            statusMessage.className = 'status-message error';
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            statusMessage.textContent = 'Error: Please enter a valid email address.';
            statusMessage.className = 'status-message error';
            return;
        }

        // B5: try...catch...finally error handling with additional business rule
        try {
            // Additional business rule: description must be at least 10 characters long
            if (description.length < 10) {
                throw new Error('Business Rule Violation: Claim description must be at least 10 characters long.');
            }

            // Create new claim object if successful
            const newClaim = {
                id: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
                category: category,
                status: 'Submitted',
                customer: { name: name, email: email },
                productCode: productCode,
                description: description
            };

            claims.push(newClaim);
            applyFilter();

            statusMessage.textContent = 'Success: Claim processed successfully!';
            statusMessage.className = 'status-message success';
            claimForm.reset();

        } catch (error) {
            // Catch block: display a useful message without crashing the page
            statusMessage.textContent = error.message;
            statusMessage.className = 'status-message error';
            console.error('Handled claim processing error:', error);

        } finally {
            // Finally block: execute cleanup/completion step regardless of success or failure
            console.log('Claim processing complete.');
        }
    });

    categoryFilter.addEventListener('change', () => {
        applyFilter();
    });

    function applyFilter() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'All') {
            renderClaims(claims);
        } else {
            const filteredClaims = claims.filter(claim => claim.category === selectedCategory);
            renderClaims(filteredClaims);
        }
    }

    function renderClaims(claimsArray) {
        claimsTableBody.innerHTML = '';

        if (claimsArray.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 5;
            emptyCell.style.textAlign = 'center';
            emptyCell.textContent = 'No claims found.';
            emptyRow.appendChild(emptyCell);
            claimsTableBody.appendChild(emptyRow);
            return;
        }

        claimsArray.forEach(claim => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = claim.customer.name;

            const emailCell = document.createElement('td');
            emailCell.textContent = claim.customer.email;

            const productCell = document.createElement('td');
            productCell.textContent = claim.productCode;

            const categoryCell = document.createElement('td');
            categoryCell.textContent = claim.category;

            const statusCell = document.createElement('td');
            statusCell.textContent = claim.status;

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(productCell);
            row.appendChild(categoryCell);
            row.appendChild(statusCell);

            claimsTableBody.appendChild(row);
        });
    }
});
//SCRIPT.JS
document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('claimForm');
    const statusMessage = document.getElementById('statusMessage');
    const claimsTableBody = document.querySelector('#claimsTable tbody');
    const categoryFilter = document.getElementById('categoryFilter');

    let claims = [
        {
            id: 'CLM-1001',
            category: 'Hardware Failure',
            status: 'Submitted',
            customer: { name: 'Alice Smith', email: 'alice@example.com' },
            productCode: 'PROD-A1',
            description: 'Screen stopped turning on completely.'
        },
        {
            id: 'CLM-1002',
            category: 'Manufacturing Defect',
            status: 'Resolved',
            customer: { name: 'Bob Jones', email: 'bob@example.com' },
            productCode: 'PROD-B2',
            description: 'Loose casing around the charging port.'
        }
    ];

    renderClaims(claims);

    claimForm.addEventListener('submit', (event) => {
        event.preventDefault();
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        const name = document.getElementById('claimantName').value.trim();
        const email = document.getElementById('claimantEmail').value.trim();
        const productCode = document.getElementById('productCode').value.trim();
        const category = document.getElementById('claimCategory').value.trim();
        const description = document.getElementById('claimDescription').value.trim();

        if (!name || !email || !productCode || !category || !description) {
            statusMessage.textContent = 'Error: All fields are required.';
            statusMessage.className = 'status-message error';
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            statusMessage.textContent = 'Error: Please enter a valid email address.';
            statusMessage.className = 'status-message error';
            return;
        }

        try {
            if (description.length < 10) {
                throw new Error('Business Rule Violation: Claim description must be at least 10 characters long.');
            }

            const newClaim = {
                id: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
                category: category,
                status: 'Submitted',
                customer: { name: name, email: email },
                productCode: productCode,
                description: description,
                // B2/B6 Object method to update status
                updateStatus(newStatus) {
                    this.status = newStatus;
                }
            };

            claims.push(newClaim);
            applyFilter();

            statusMessage.textContent = 'Success: Claim processed successfully!';
            statusMessage.className = 'status-message success';
            claimForm.reset();

        } catch (error) {
            statusMessage.textContent = error.message;
            statusMessage.className = 'status-message error';
            console.error('Handled claim processing error:', error);

        } finally {
            console.log('Claim processing complete.');
        }
    });

    categoryFilter.addEventListener('change', () => {
        applyFilter();
    });

    function applyFilter() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'All') {
            renderClaims(claims);
        } else {
            const filteredClaims = claims.filter(claim => claim.category === selectedCategory);
            renderClaims(filteredClaims);
        }
    }

    function renderClaims(claimsArray) {
        claimsTableBody.innerHTML = '';

        if (claimsArray.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 6;
            emptyCell.style.textAlign = 'center';
            emptyCell.textContent = 'No claims found.';
            emptyRow.appendChild(emptyCell);
            claimsTableBody.appendChild(emptyRow);
            return;
        }

        claimsArray.forEach((claim, index) => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = claim.customer.name;

            const emailCell = document.createElement('td');
            emailCell.textContent = claim.customer.email;

            const productCell = document.createElement('td');
            productCell.textContent = claim.productCode;

            const categoryCell = document.createElement('td');
            categoryCell.textContent = claim.category;

            const statusCell = document.createElement('td');
            statusCell.textContent = claim.status;

            // B6: Action cell with a toggle button to change status
            const actionCell = document.createElement('td');
            const toggleButton = document.createElement('button');
            toggleButton.textContent = claim.status === 'Resolved' ? 'Mark Open' : 'Mark Resolved';
            toggleButton.style.padding = '5px 10px';
            toggleButton.style.cursor = 'pointer';

            toggleButton.addEventListener('click', () => {
                // Debugging breakpoint trigger or console inspection point
                debugger; 

                // Toggle status on the target claim object
                if (claim.status === 'Resolved') {
                    claim.status = 'Submitted';
                } else {
                    claim.status = 'Resolved';
                }

                console.log(`Updated claim ${claim.id} status to:`, claim.status);
                applyFilter();
            });

            actionCell.appendChild(toggleButton);

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(productCell);
            row.appendChild(categoryCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);

            claimsTableBody.appendChild(row);
        });
    }
});
