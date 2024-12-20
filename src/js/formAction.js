import DOMPurify from 'dompurify';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://nhnupinjrcwjafvnkusy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5obnVwaW5qcmN3amFmdm5rdXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNjY5MDksImV4cCI6MjA0NDY0MjkwOX0.4NVDgYuns4N8Djry3CWhOIsPpFRcGdNfi2f8lbrgAdM'
);

///// ToDo \\\\\
///// 1. set right RLS settings ||  2. secure env data \\\\\

const contactForm = document.querySelector('#contactForm');

const firstname = document.querySelector('#firstname');
const lastname = document.querySelector('#lastname');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const textarea = document.querySelector('#description');

function handleFormSubmit(event) {
    event.preventDefault();

    const data = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        phone: (phone.value = null),
        description: textarea.value,
    };

    validation(data);

    /// btn_send_contact.addEventListener('mouseenter', btnAgain);
}

async function sending(sanitizedData) {
    console.log(sanitizedData.phone);
    try {
        const { data, error } = await supabase
            .from('clients')
            .insert([
                {
                    email: sanitizedData.email,
                    phonenumber: sanitizedData.phone,
                    firstname: sanitizedData.firstname,
                    lastname: sanitizedData.lastname,
                    message: sanitizedData.description,
                },
            ])
            .select();

        if (error) {
            throw error;
        } else {
            console.log(data);
        }
    } catch (error) {
        console.error('Błąd:', error.message);
    }
}

function validation(data) {
    resetClasses();

    let isValid = true;
    console.log(data);
    if (data.firstname.length < 3) {
        firstname.classList.add('Alertinfo');
        firstname.placeholder = 'Enter more than five letters';
        firstname.value = '';
        isValid = false;
    }

    if (data.lastname.length < 3) {
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

    if (!validatePhone(data.phone)) {
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
        const sanitizedData = {
            firstname: DOMPurify.sanitize(data.firstname),
            lastname: DOMPurify.sanitize(data.lastname),
            email: DOMPurify.sanitize(data.email),
            phone: Number.parseInt(DOMPurify.sanitize(data.phone)),
            description: DOMPurify.sanitize(data.description),
        };

        sending(sanitizedData);
        reset();
        resetClasses();
        btn_send_contact.textContent = 'Thanks';
        console.log(sanitizedData.phone);
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
    console.log(phone);
    return /^(null|0|$|^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}?\)?[-.\s]?)?(\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})$)/.test(
        phone
    );
}

function validateDescription(text) {
    return /^[\p{L}\p{N}\s.,!?'"()\-:;]*$/u.test(text);
}

contactForm.addEventListener('submit', handleFormSubmit);

///// Waitlist \\\\\
const waitListForm = document.querySelector('#waitlist-form');
const waitListBtn = document.querySelector('#waitlist-btn-switch');
const waitlist_email = document.querySelector('#waitlist-email');

waitListBtn.addEventListener('click', (event) => {
    waitlist_email.value = '';
    waitListForm.classList.add('header__waitlist-form');
    waitListBtn.style.display = 'none';
});

function handleWaitListSub(event) {
    event.preventDefault();

    const emailData = waitlist_email.value;
    sendDataWaitList(emailData);
    waitlist_email.value = '';
}

function sendDataWaitList(emailData) {
    const emailDatacopy = emailData.slice(0);
    let isValid = true;

    if (!validateEmail(emailDatacopy)) {
        waitlist_email.classList.add('Alertinfo');
        waitlist_email.placeholder = 'Enter a valid email address';
        waitlist_email.value = '';
        isValid = false;
        setTimeout(() => {
            waitListForm.classList.remove('header__waitlist-form');
            waitListBtn.style.display = 'block';
        }, 60 * 1000);
    } else {
        const cleanEmail = DOMPurify.sanitize(emailDatacopy);
        waitListForm.classList.remove('header__waitlist-form');
        waitListBtn.style.display = 'block';

        readySendWaitList(cleanEmail);
    }
}

async function readySendWaitList(cleanEmail) {
    let isAvailable = false;
    let test;
    try {
        let { data: Waitlist, error } = await supabase
            .from('Waitlist')
            .select('email');

        if (error) {
            throw error;
        }

        test = Waitlist.map((all) => {
            return all.email;
        });
    } catch (error) {
        console.error(error);
    }
    if (!test.includes(cleanEmail)) {
        try {
            const { data, error } = await supabase
                .from('Waitlist')
                .insert([{ email: cleanEmail }])
                .select();
            if (error) {
                throw error;
            } else {
                console.log(data);
            }
        } catch (error) {
            console.error('Wrong or bad request:', error.message);
        }
    } else {
        waitlist_email.placeholder = 'We have that email';
        waitListForm.classList.add('header__waitlist-form');
        waitListBtn.style.display = 'none';
        console.log('we have that email');
        waitlist_email.style.color = 'red';
        setTimeout(() => {
            waitlist_email.placeholder = 'Your Email';
            waitlist_email.style.color = 'black';
        }, 4000);
    }
    /*
    

*/
}

waitListForm.addEventListener('submit', handleWaitListSub);
let timeOut;

function outFocus(event) {
    if (event.target) {
        timeOut = setTimeout(() => {
            waitListForm.classList.remove('header__waitlist-form');
            waitListBtn.style.display = 'block';
        }, 4 * 1000);
        console.log('timeout start ');
    }
}

waitlist_email.addEventListener('blur', outFocus);
waitlist_email.addEventListener('focus', (event) => {
    if (event.target) {
        clearTimeout(timeOut);
        console.log('time reset ');
    }
});

const btn_send_contact = document.querySelector('#btn-form-show');

btn_send_contact.addEventListener('mouseleave', (event) => {
    setTimeout(() => {
        btn_send_contact.textContent = 'Send';
    }, 3000);
});
