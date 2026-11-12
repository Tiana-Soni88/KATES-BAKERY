import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
const db = getDatabase(app);

const ADMIN_PASSWORD = "bakery123"; 

// 1. Wait for the HTML to load before attaching the button listener
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const pass = document.getElementById('adminPass').value;
            
            if (pass === ADMIN_PASSWORD) {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('dashboard').style.display = 'block';
                loadOrders();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        });
    }
});

// 2. Load Orders function
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    const ordersRef = ref(db, 'orders'); 

    onValue(ordersRef, (snapshot) => {
        ordersList.innerHTML = ''; 
        const data = snapshot.val();

        if (!data) {
            ordersList.innerHTML = '<p>No orders yet.</p>';
            return;
        }

        // Convert object to array and sort by newest
        const ordersArray = Object.values(data).sort((a, b) => b.createdAt - a.createdAt);

        ordersArray.forEach((order) => {
            let dateStr = "Unknown date";
            if (order.createdAt) {
                dateStr = new Date(order.createdAt).toLocaleString();
            }

            const card = document.createElement('div');
            card.style.background = "white";
            card.style.padding = "1.5rem";
            card.style.borderRadius = "8px";
            card.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    <strong>${order.name}</strong>
                    <span style="font-size: 0.85rem; color: #666;">${dateStr}</span>
                </div>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
                <p style="margin-top: 0.5rem; background: var(--cream); padding: 1rem; border-radius: 6px;">
                    <strong>Message:</strong><br>${order.message}
                </p>
            `;
            ordersList.appendChild(card);
        });
    }, (error) => {
        console.error(error);
        ordersList.innerHTML = '<p style="color: red;">Error loading orders. Check database rules.</p>';
    });
}