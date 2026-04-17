const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');

// Input elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

// Error elements
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const subjectError = document.getElementById('subjectError');
const messageError = document.getElementById('messageError');

// Validation functions
function validateName(name) {
    if (name.trim().length < 3) {
        nameError.textContent = 'Name must be at least 3 characters';
        return false;
    }
    nameError.textContent = '';
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        return false;
    }
    emailError.textContent = '';
    return true;
}

function validateSubject(subject) {
    if (subject.trim().length < 3) {
        subjectError.textContent = 'Subject must be at least 3 characters';
        return false;
    }
    subjectError.textContent = '';
    return true;
}

function validateMessage(message) {
    if (message.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        return false;
    }
    messageError.textContent = '';
    return true;
}

// Real-time validation
nameInput.addEventListener('blur', () => validateName(nameInput.value));
emailInput.addEventListener('blur', () => validateEmail(emailInput.value));
subjectInput.addEventListener('blur', () => validateSubject(subjectInput.value));
messageInput.addEventListener('blur', () => validateMessage(messageInput.value));

// Form submission
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Hide previous alerts
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';

    // Get form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Validate all fields
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isSubjectValid = validateSubject(subject);
    const isMessageValid = validateMessage(message);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        return;
    }

    // Show loader
    loader.style.display = 'flex';
    submitBtn.disabled = true;

    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);

        // Send to Formspree
        const response = await fetch('https://formspree.io/f/xojyjwqw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        loader.style.display = 'none';

        if (response.ok) {
            // Show success message
            successAlert.style.display = 'block';
            contactForm.reset();
            nameError.textContent = '';
            emailError.textContent = '';
            subjectError.textContent = '';
            messageError.textContent = '';

            // Hide success message after 5 seconds
            setTimeout(() => {
                successAlert.style.display = 'none';
            }, 5000);
        } else {
            // Show error message
            errorAlert.textContent = '❌ Error sending message. Please try again.';
            errorAlert.style.display = 'block';
        }
    } catch (error) {
        loader.style.display = 'none';
        errorAlert.textContent = '❌ Connection error. Please check your internet connection.';
        errorAlert.style.display = 'block';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
    }
});

console.log('Contact form initialized successfully!');