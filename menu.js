// js/menu.js
// -------------------------------------------
// Menu page logic:
//   1. Load ALL products from Firestore
//   2. Render cards
//   3. Filter by category via buttons
// -------------------------------------------

import { db } from './firebase-config.js';
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const grid      = document.getElementById('menuGrid');
const filters   = document.getElementById('menuFilters');
const emptyState = document.getElementById('emptyState');

/** All products from Firestore, in memory */
let allProducts = [];
/** Currently selected category ("all" | "bread" | "cake" | "pastry") */
let activeCategory = 'all';

/* =========================================================
   1. FETCH ALL PRODUCTS ONCE
   ========================================================= */
async function fetchProducts() {
  try {
    const snapshot = await getDocs(collection(db, 'products'));

    allProducts = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    // Render immediately after fetching
    renderProducts();
  } catch (err) {
    console.error('Error loading menu:', err);
    grid.innerHTML = '<p class="loading">Could not load the menu.</p>';
  }
}

/* =========================================================
   2. RENDER PRODUCTS (respects activeCategory)
   ========================================================= */
function renderProducts() {
  const visible =
    activeCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === activeCategory);

  grid.innerHTML = ''; // clear

  if (visible.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  visible.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-emoji">${item.emoji || '🍰'}</div>
      <h3>${item.name}</h3>
      <p>${item.description || ''}</p>
      <p class="product-price">$${Number(item.price).toFixed(2)}</p>
    `;
    grid.appendChild(card);
  });
}

/* =========================================================
   3. FILTER BUTTONS
   ========================================================= */
if (filters) {
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Update active state visually
    filters.querySelectorAll('.filter-btn').forEach(b =>
      b.classList.remove('active')
    );
    btn.classList.add('active');

    // Update filter and re-render
    activeCategory = btn.dataset.category;
    renderProducts();
  });
}

/* =========================================================
   4. KICKOFF
   ========================================================= */
if (grid) {
  fetchProducts();
}