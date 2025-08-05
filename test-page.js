// DOM Elements
const insuranceCards = document.querySelectorAll('.insurance-card');
const radioButtons = document.querySelectorAll('.radio-button');
const checkboxInputs = document.querySelectorAll('.checkbox-input');
const continueBtn = document.querySelector('.continue-btn');
const totalAmount = document.querySelector('.total-amount');

// Insurance data
const insuranceData = {
    company1: {
        kasko: 52373,
        osago: 8274,
        total: 52373
    },
    company2: {
        kasko: 59482,
        osago: 7967,
        total: 59482
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateTotalAmount();
});

// Setup event listeners
function setupEventListeners() {
    // Radio button selection
    insuranceCards.forEach((card, index) => {
        card.addEventListener('click', () => selectInsuranceCompany(index));
    });

    // Checkbox handling
    checkboxInputs.forEach((checkbox, index) => {
        checkbox.addEventListener('change', (e) => handleCheckboxChange(e, index));
    });

    // Continue button
    continueBtn.addEventListener('click', handleContinue);

    // Back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', handleBack);
    }

    // Tariff links
    const tariffLinks = document.querySelectorAll('.tariffs-link');
    tariffLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showTariffs(e.target);
        });
    });
}

// Select insurance company
function selectInsuranceCompany(index) {
    // Remove active class from all cards
    insuranceCards.forEach(card => {
        card.classList.remove('active');
        card.querySelector('.radio-button').classList.remove('selected');
    });

    // Add active class to selected card
    insuranceCards[index].classList.add('active');
    insuranceCards[index].querySelector('.radio-button').classList.add('selected');

    // Update total amount
    updateTotalAmount();

    // Show success feedback
    showFeedback('Страховая компания выбрана');
}

// Handle checkbox changes
function handleCheckboxChange(event, cardIndex) {
    const card = event.target.closest('.insurance-card');
    const company = cardIndex === 0 ? 'company1' : 'company2';
    const checkboxValue = card.querySelector('.checkbox-value');
    const totalValueElement = card.querySelector('.total-value');
    
    let newTotal = insuranceData[company].kasko;
    
    if (event.target.checked) {
        newTotal += insuranceData[company].osago;
        checkboxValue.style.color = '#00bfff';
        checkboxValue.style.fontWeight = '600';
    } else {
        checkboxValue.style.color = '#666';
        checkboxValue.style.fontWeight = 'normal';
    }
    
    // Update the data
    insuranceData[company].total = newTotal;
    
    // Update display
    if (totalValueElement) {
        totalValueElement.textContent = formatMoney(newTotal);
    }
    
    // Update main total if this company is selected
    if (card.classList.contains('active')) {
        updateTotalAmount();
    }

    // Animation for checkbox
    const customCheckbox = event.target.nextElementSibling;
    customCheckbox.style.transform = 'scale(1.1)';
    setTimeout(() => {
        customCheckbox.style.transform = 'scale(1)';
    }, 150);
}

// Update total amount
function updateTotalAmount() {
    const activeCard = document.querySelector('.insurance-card.active');
    if (!activeCard) return;

    const creditAmount = 600000; // Base credit amount
    let insuranceAmount = 0;

    // Get insurance amount from active card
    const activeIndex = Array.from(insuranceCards).indexOf(activeCard);
    const company = activeIndex === 0 ? 'company1' : 'company2';
    insuranceAmount = insuranceData[company].total;

    const total = creditAmount + insuranceAmount;
    totalAmount.textContent = formatMoney(total) + ' ₽';

    // Animation for total amount update
    totalAmount.style.transform = 'scale(1.05)';
    setTimeout(() => {
        totalAmount.style.transform = 'scale(1)';
    }, 200);
}

// Format money with spaces
function formatMoney(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Show feedback message
function showFeedback(message) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'feedback-message';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 191, 255, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(feedback);

    // Show and hide animation
    setTimeout(() => feedback.style.opacity = '1', 10);
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

// Handle continue button
function handleContinue() {
    const activeCard = document.querySelector('.insurance-card.active');
    
    if (!activeCard) {
        showFeedback('Выберите страховую компанию');
        return;
    }

    // Get selected data
    const activeIndex = Array.from(insuranceCards).indexOf(activeCard);
    const company = activeIndex === 0 ? 'company1' : 'company2';
    const companyName = activeCard.querySelector('.company-name').textContent;
    const hasOsago = activeCard.querySelector('.checkbox-input').checked;
    
    const selectedData = {
        company: companyName,
        kasko: insuranceData[company].kasko,
        osago: hasOsago ? insuranceData[company].osago : 0,
        total: insuranceData[company].total,
        fullTotal: parseInt(totalAmount.textContent.replace(/[^\d]/g, ''))
    };

    // Button loading state
    continueBtn.style.opacity = '0.7';
    continueBtn.textContent = 'Обработка...';
    continueBtn.disabled = true;

    // Simulate processing
    setTimeout(() => {
        console.log('Selected insurance data:', selectedData);
        showFeedback('Заявка отправлена!');
        
        // Reset button
        continueBtn.style.opacity = '1';
        continueBtn.textContent = 'Продолжить';
        continueBtn.disabled = false;
        
        // Here you would typically send data to server
        // window.location.href = '/next-step';
    }, 1500);
}

// Handle back button
function handleBack() {
    // Add ripple effect
    const backBtn = document.querySelector('.back-btn');
    backBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        backBtn.style.transform = 'scale(1)';
    }, 150);

    // Navigate back (simulate)
    setTimeout(() => {
        showFeedback('Возврат на предыдущую страницу');
        // window.history.back();
    }, 200);
}

// Show tariffs modal
function showTariffs(target) {
    const companyCard = target.closest('.insurance-card');
    const companyName = companyCard.querySelector('.company-name').textContent;
    
    // Create modal backdrop
    const modal = document.createElement('div');
    modal.className = 'tariffs-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 16px;
        max-width: 350px;
        margin: 20px;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;

    modalContent.innerHTML = `
        <h3 style="margin-bottom: 16px; color: #333; font-size: 18px;">${companyName}</h3>
        <div style="margin-bottom: 20px;">
            <h4 style="color: #666; margin-bottom: 8px;">Тарифы КАСКО:</h4>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 4px 0; color: #333;">• Базовый: ${formatMoney(Math.floor(Math.random() * 30000 + 40000))} ₽</li>
                <li style="padding: 4px 0; color: #333;">• Стандарт: ${formatMoney(Math.floor(Math.random() * 20000 + 50000))} ₽</li>
                <li style="padding: 4px 0; color: #333;">• Премиум: ${formatMoney(Math.floor(Math.random() * 25000 + 60000))} ₽</li>
            </ul>
        </div>
        <div style="margin-bottom: 20px;">
            <h4 style="color: #666; margin-bottom: 8px;">ОСАГО:</h4>
            <p style="color: #333; margin: 0;">Фиксированная ставка по региону</p>
        </div>
        <button class="close-modal" style="
            background: linear-gradient(135deg, #8a2be2 0%, #00bfff 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 20px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
        ">Закрыть</button>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Close modal handlers
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modalContent.querySelector('.close-modal').addEventListener('click', closeModal);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add touch feedback for mobile
if ('ontouchstart' in window) {
    const touchElements = document.querySelectorAll('.insurance-card, .continue-btn, .back-btn');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}
