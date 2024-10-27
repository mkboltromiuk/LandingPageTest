import DOMPurify from 'dompurify';

const contactForm = document.querySelector('#contactForm');

const firstname = document.querySelector('#firstname');
const lastname = document.querySelector('#lastname');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const textarea = document.querySelector('#description');

function handleFormSubmit(event) {
    event.preventDefault();

    // Tworzenie danych przed sanitizacją
    const data = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        phone: phone.value,
        description: textarea.value,
    };

    validation(data);
}

function sending(sanitizedData) {
    console.log(sanitizedData); // Zmienione na przekazywanie oczyszczonych danych
}

function validation(data) {
    // Resetowanie klas błędów przed nową walidacją
    resetClasses();

    let isValid = true;

    // Walidacja
    if (data.firstname.length < 5) {
        firstname.classList.add('Alertinfo');
        firstname.placeholder = 'Enter more than five letters';
        firstname.value = '';
        isValid = false;
    }

    if (data.lastname.length < 5) {
        lastname.classList.add('Alertinfo');
        lastname.placeholder = 'Enter more than five letters';
        lastname.value = '';
        isValid = false;
    }

    if (!validateEmail(data.email)) {
        email.classList.add('Alertinfo');
        email.placeholder = 'Please enter a valid email address';
        email.value = '';
        isValid = false;
    }

    if (
        !validatePhone(data.phone) ||
        data.phone.length < 5 ||
        data.phone.length > 12
    ) {
        phone.classList.add('Alertinfo');
        phone.placeholder = 'Please enter a valid phone number';
        phone.value = '';
        isValid = false;
    }

    if (!validateDescription(data.description) || data.description.length < 4) {
        textarea.classList.add('Alertinfo');
        textarea.placeholder = 'Wrong text message';
        textarea.value = '';
        isValid = false;
    }

    if (isValid) {
        // Sanitizacja danych tylko po pomyślnej walidacji
        const sanitizedData = {
            firstname: DOMPurify.sanitize(data.firstname),
            lastname: DOMPurify.sanitize(data.lastname),
            email: DOMPurify.sanitize(data.email),
            phone: DOMPurify.sanitize(data.phone),
            description: DOMPurify.sanitize(data.description),
        };

        sending(sanitizedData);
        reset(); // Resetowanie formularza po pomyślnym wysłaniu
        resetClasses();
    }
}

function resetClasses() {
    firstname.classList.remove('Alertinfo');
    lastname.classList.remove('Alertinfo');
    email.classList.remove('Alertinfo');
    phone.classList.remove('Alertinfo');
    textarea.classList.remove('Alertinfo');
}

function reset() {
    firstname.value = '';
    lastname.value = '';
    email.value = '';
    phone.value = '';
    textarea.value = '';

    firstname.placeholder = 'First Name';
    lastname.placeholder = 'Last Name';
    email.placeholder = 'Email';
    phone.placeholder = 'Phone number';
    textarea.placeholder = 'Message';
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

function validatePhone(phone) {
    return /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}?\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})$/.test(
        phone
    );
}

function validateDescription(text) {
    return /^[a-zA-Z0-9\s.,!?'"()]*$/.test(text);
}

contactForm.addEventListener('submit', handleFormSubmit);
