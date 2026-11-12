// js/contact.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Get your config (make sure this matches your firebase-config.js)
const firebaseConfig = {
  apiKey: "AIzaSyAZZiutL6T7EfSb4ZFw50WPbIq3oX5MlmQ",
  authDomain: "bakery-e4e4d.firebaseapp.com",
  databaseURL: "https://bakery-e4e4d-default-rtdb.firebaseio.com",
  projectId: "bakery-e4e4d",
  storageBucket: "bakery-e4e4d.firebasestorage.app",
  messagingSenderId: "378903375442",
  appId: "1:378903375442:web:f183c93909112818a7398b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Initialize Realtime Database

const form       = document.getElementById('contactForm');
const statusEl   = document.getElementById('formStatus');
const submitBtn  = document.getElementById('submitBtn');
const EMAIL_RE   = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function validate(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(values.email || '')) errors.email = 'Please enter a valid email address.';
  if (!values.message || values.message.trim().length < 5) errors.message = 'Please include a short message.';
  return errors;
}

function markInvalid(errors) {
  form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  Object.keys(errors).forEach(field => {
    const input = document.getElementById(field);
    if (input) input.classList.add('invalid');
  });
}

function setStatus(text, type = '') {
  statusEl.textContent = text;
  statusEl.className = 'form-status ' + type;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Sending...' : 'Send Message';
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const values = {
      name:    form.name.value,
      email:   form.email.value,
      phone:   form.phone.value,
      message: form.message.value
    };

    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      markInvalid(errors);
      setStatus(Object.values(errors)[0], 'error');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      // Save to REALTIME DATABASE (not Firestore)
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      
      await set(newOrderRef, {
        name:      values.name.trim(),
        email:     values.email.trim(),
        phone:     values.phone.trim() || null,
        message:   values.message.trim(),
        createdAt: Date.now() // Realtime DB doesn't have serverTimestamp() in the same way, so we use Date.now()
      });

      form.reset();
      markInvalid({});
      setStatus('✅ Thanks! Your message has been received.', 'success');
    } catch (err) {
      console.error('Order save failed:', err);
      setStatus('⚠️ Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  });

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });
}