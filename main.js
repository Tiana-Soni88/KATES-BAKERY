// js/main.js
// -------------------------------------------
// Homepage logic:
//   1. Mobile nav toggle
//   2. Load featured products from Firestore
// -------------------------------------------

import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================================================
   1. MOBILE NAV TOGGLE
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // Close the menu when a link is clicked (nice UX on mobile)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

/* =========================================================
   2. LOAD FEATURED PRODUCTS FROM FIRESTORE
   ========================================================= */
const productContainer = document.getElementById('featuredProducts');

async function loadFeaturedProducts() {
  if (!productContainer) return; // safety check

  try {
    // Query: first 4 products in the "products" collection
    const productsRef = collection(db, 'products');
    const q = query(productsRef, limit(4));
    const snapshot = await getDocs(q);

    productContainer.innerHTML = ''; // clear "Loading..." message

    if (snapshot.empty) {
      productContainer.innerHTML =
        '<p class="loading">No products yet. Add some in Firestore!</p>';
      return;
    }

    snapshot.forEach(docSnap => {
      const item = docSnap.data();
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-emoji">${item.emoji || '🍰'}</div>
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
        <p class="product-price">$${Number(item.price).toFixed(2)}</p>
      `;
      productContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    productContainer.innerHTML =
      '<p class="loading">Could not load products. Check the console.</p>';
  }
}

loadFeaturedProducts();