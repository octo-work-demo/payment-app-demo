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
    document.querySelector('#successMessage h2').textContent = 'Payment Successful!';
    document.querySelector('#successMessage .success-message').textContent = 'Your transaction has been processed successfully';
    document.getElementById('transactionTimeLabel').textContent = 'Date & Time';
}

function getFormData() {
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
        showError('Please enter a valid amount greater than zero');
        return false;
    }
    
    if (formData.cardNumber.length < 13) {
        showError('Please enter a valid card number');
        return false;
    }
    
    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        showError('Please enter a valid expiry date (MM/YY)');
        return false;
    }
    
    if (formData.cvv.length < 3) {
        showError('Please enter a valid CVV');
        return false;
    }

    return true;
}

async function submitPayment(formData, isScheduled = false) {
    const submitBtn = document.getElementById('submitBtn');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const originalScheduleText = scheduleBtn.textContent;
    
    // Show loading
    submitBtn.disabled = true;
    scheduleBtn.disabled = true;
    if (isScheduled) {
        scheduleBtn.textContent = 'Scheduling...';
    } else {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
    }
    
    try {
        // Send payment request
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            const successTitle = document.querySelector('#successMessage h2');
            const successMessage = document.querySelector('#successMessage .success-message');
            const timeLabel = document.getElementById('transactionTimeLabel');
            const displayTime = data.status === 'scheduled' ? data.scheduled_for : data.timestamp;

            if (data.status === 'scheduled') {
                successTitle.textContent = 'Payment Scheduled!';
                successMessage.textContent = 'Your payment has been scheduled successfully';
                timeLabel.textContent = 'Scheduled For';
            } else {
                successTitle.textContent = 'Payment Successful!';
                successMessage.textContent = 'Your transaction has been processed successfully';
                timeLabel.textContent = 'Date & Time';
            }

            // Show success message
            document.getElementById('transactionId').textContent = data.transaction_id;
            document.getElementById('transactionAmount').textContent = `$${data.amount.toFixed(2)} ${data.currency}`;
            document.getElementById('transactionTime').textContent = displayTime ? new Date(displayTime).toLocaleString() : '-';
            
            document.getElementById('paymentForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            showError(data.error || 'Payment failed. Please try again.');
        }
    } catch (error) {
        showError('Connection error. Please check if the server is running.');
        console.error('Error:', error);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        scheduleBtn.disabled = false;
        scheduleBtn.textContent = originalScheduleText;
        if (!isScheduled) {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }
}

// Handle immediate payment form submission
document.getElementById('payment-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = getFormData();
    if (!validateFormData(formData)) {
        return;
    }
    await submitPayment(formData, false);
});

// Handle scheduled payments
document.getElementById('scheduleBtn').addEventListener('click', async function() {
    const formData = getFormData();
    if (!validateFormData(formData)) {
        return;
    }

    const scheduleDateTime = document.getElementById('scheduleDateTime').value;
    if (!scheduleDateTime) {
        showError('Please choose a date and time to schedule this payment');
        return;
    }

    const scheduledAt = new Date(scheduleDateTime);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
        showError('Please choose a future date and time for scheduling');
        return;
    }

    formData.scheduleFor = scheduledAt.toISOString();
    await submitPayment(formData, true);
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

