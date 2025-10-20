// Rent Receipt Generator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('receiptForm');
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const saveBtn = document.getElementById('saveBtn');
    const receiptCard = document.getElementById('receiptCard');
    const savedReceiptsList = document.getElementById('savedReceiptsList');
    
    let savedReceipts = [];
    
    // Generate Receipt Button Click Handler
    generateBtn.addEventListener('click', function() {
        alert('Generate Receipt button clicked!');
        
        // Get form data
        const formData = new FormData(form);
        const receiptData = {};
        
        for (let [key, value] of formData.entries()) {
            receiptData[key] = value;
        }
        
        // Validate required fields
        if (!receiptData.tenantName || !receiptData.landlordName || !receiptData.amount) {
            alert('Please fill in all required fields!');
            return;
        }
        
        // Populate receipt preview
        populateReceipt(receiptData);
        
        // Show receipt card
        receiptCard.classList.remove('hidden');
        receiptCard.classList.add('show');
    });
    
    // Print Button Click Handler
    printBtn.addEventListener('click', function() {
        alert('Print button clicked!');
        
        if (receiptCard.classList.contains('hidden')) {
            alert('Please generate a receipt first!');
            return;
        }
        
        // Trigger print
        window.print();
    });
    
    // Save Button Click Handler
    saveBtn.addEventListener('click', function() {
        alert('Save button clicked!');
        
        if (receiptCard.classList.contains('hidden')) {
            alert('Please generate a receipt first!');
            return;
        }
        
        // Get current receipt data
        const formData = new FormData(form);
        const receiptData = {};
        
        for (let [key, value] of formData.entries()) {
            receiptData[key] = value;
        }
        
        // Add timestamp
        receiptData.savedAt = new Date().toLocaleString();
        
        // Save to local storage
        savedReceipts.push(receiptData);
        localStorage.setItem('savedReceipts', JSON.stringify(savedReceipts));
        
        // Update saved receipts display
        updateSavedReceiptsList();
        
        alert('Receipt saved successfully!');
    });
    
    // Populate receipt preview with form data
    function populateReceipt(data) {
        document.getElementById('receiptNumber').textContent = data.receiptId || 'RCPT-001';
        document.getElementById('receiptTenant').textContent = data.tenantName;
        document.getElementById('receiptLandlord').textContent = data.landlordName;
        document.getElementById('receiptAddress').textContent = data.propertyAddress;
        document.getElementById('receiptUnit').textContent = data.unit;
        document.getElementById('receiptAmount').textContent = `$${parseFloat(data.amount).toFixed(2)}`;
        document.getElementById('receiptPaymentMethod').textContent = data.paymentMethod;
        document.getElementById('receiptDate').textContent = formatDate(data.paymentDate);
        
        // Format rent period
        const rentPeriod = `${formatDate(data.rentPeriodFrom)} - ${formatDate(data.rentPeriodTo)}`;
        document.getElementById('receiptRentPeriod').textContent = rentPeriod;
        
        // Show notes if provided
        if (data.notes && data.notes.trim()) {
            document.getElementById('receiptNotes').textContent = data.notes;
            document.getElementById('notesRow').style.display = 'flex';
        } else {
            document.getElementById('notesRow').style.display = 'none';
        }
        
        // Signature
        document.getElementById('receiptSignature').textContent = data.signature || '';
    }
    
    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
    
    // Update saved receipts list
    function updateSavedReceiptsList() {
        if (savedReceipts.length === 0) {
            savedReceiptsList.innerHTML = '<p>No saved receipts yet.</p>';
            return;
        }
        
        savedReceiptsList.innerHTML = savedReceipts.map((receipt, index) => `
            <div class="saved-receipt-item" style="margin-bottom: 10px; padding: 10px; background: white; border: 1px solid #ddd; border-radius: 4px;">
                <strong>Receipt ${receipt.receiptId || 'RCPT-001'}</strong><br>
                <small>${receipt.tenantName} - ${receipt.landlordName}</small><br>
                <small>Amount: $${parseFloat(receipt.amount).toFixed(2)}</small><br>
                <small>Saved: ${receipt.savedAt}</small>
            </div>
        `).join('');
    }
    
    // Load saved receipts on page load
    function loadSavedReceipts() {
        const saved = localStorage.getItem('savedReceipts');
        if (saved) {
            savedReceipts = JSON.parse(saved);
            updateSavedReceiptsList();
        } else {
            savedReceiptsList.innerHTML = '<p>No saved receipts yet.</p>';
        }
    }
    
    // Initialize
    loadSavedReceipts();
    
    // Auto-generate receipt ID if empty
    const receiptIdInput = document.getElementById('receiptId');
    if (!receiptIdInput.value) {
        const now = new Date();
        const timestamp = now.getTime().toString().slice(-6);
        receiptIdInput.value = `RCPT-${timestamp}`;
    }
});
