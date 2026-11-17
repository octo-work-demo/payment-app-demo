// Format card number with spaces
function formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
        return parts.join(' ');
    } else {
        return value;
    }
}

// Format expiry date
function formatExpiryDate(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    
    return v;
}

// Format CVV
function formatCVV(value) {
    return value.replace(/[^0-9]/gi, '').substring(0, 4);
}

// Auto-format inputs
document.getElementById('cardNumber').addEventListener('input', function(e) {
    e.target.value = formatCardNumber(e.target.value);
});

document.getElementById('expiryDate').addEventListener('input', function(e) {
    e.target.value = formatExpiryDate(e.target.value);
});

document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = formatCVV(e.target.value);
});

document.getElementById('cardName').addEventListener('input', function(e) {
    e.target.value = e.target.value.toUpperCase();
});

// Fill test card
function fillTestCard(cardNumber, expiry, cvv) {
    document.getElementById('cardNumber').value = formatCardNumber(cardNumber);
    document.getElementById('cardName').value = 'TEST CARDHOLDER';
    document.getElementById('expiryDate').value = expiry;
    document.getElementById('cvv').value = cvv;
    document.getElementById('amount').value = '99.99';
    
    // Scroll to form
    document.getElementById('paymentForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show error
function showError(message) {
    const errorBanner = document.getElementById('errorBanner');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorBanner.style.display = 'flex';
    
    setTimeout(() => {
        errorBanner.style.display = 'none';
    }, 5000);
}

// Reset form
function resetForm() {
    document.getElementById('payment-form').reset();
    document.getElementById('paymentForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorBanner').style.display = 'none';
}

function buildFormData() {
    return {
        cardNumber: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        cardName: document.getElementById('cardName').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        amount: parseFloat(document.getElementById('amount').value),
        currency: 'USD'
    };
}

function validateFormData(formData) {
    if (!Number.isFinite(formData.amount) || formData.amount <= 0) {
        return 'Please enter a valid amount greater than zero';
    }

    if (formData.cardNumber.length < 13) {
        return 'Please enter a valid card number';
    }

    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        return 'Please enter a valid expiry date (MM/YY)';
    }

    if (formData.cvv.length < 3) {
        return 'Please enter a valid CVV';
    }

    return null;
}

function showSuccess(data, actionLabel = 'processed') {
    document.getElementById('transactionId').textContent = data.transaction_id;
    document.getElementById('transactionAmount').textContent = `$${data.amount.toFixed(2)} ${data.currency}`;
    const timeValue = data.scheduled_for || data.timestamp;
    document.getElementById('transactionTime').textContent = new Date(timeValue).toLocaleString();
    document.querySelector('.success-message').textContent = `Your transaction has been ${actionLabel} successfully`;

    document.getElementById('paymentForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
}

async function sendPayment(endpoint, payload) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data, data.scheduled ? 'scheduled' : 'processed');
        } else {
            showError(data.error || 'Payment failed. Please try again.');
        }
    } catch (error) {
        showError('Connection error. Please check if the server is running.');
        console.error('Error:', error);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = buildFormData();
    const validationError = validateFormData(formData);
    if (validationError) {
        showError(validationError);
        return;
    }

    await sendPayment('/api/payment', formData);
});

document.getElementById('scheduleBtn').addEventListener('click', async function() {
    const formData = buildFormData();
    const validationError = validateFormData(formData);
    if (validationError) {
        showError(validationError);
        return;
    }

    const scheduledForInput = document.getElementById('scheduledFor').value;
    if (!scheduledForInput) {
        showError('Please choose a date and time to schedule this payment');
        return;
    }

    const scheduledForDate = new Date(scheduledForInput);
    if (Number.isNaN(scheduledForDate.getTime()) || scheduledForDate <= new Date()) {
        showError('Please choose a future date and time');
        return;
    }

    formData.scheduled_for = scheduledForDate.toISOString();
    await sendPayment('/api/payment/schedule', formData);
});

// Add some visual feedback on input focus
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

