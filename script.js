// --- by YouSa V5 | RADICAL MOBILE INTERACTION ENGINE ---

const products = [
    { id: 'abaya-silk-lux', title: 'Luxe Champagne Abaya', price: 189.00, img: 'assets/cat_abaya.png', tag: 'BESTSELLER', sizes: ['S', 'M', 'L'], stockPercent: 92 },
    { id: 'hijab-silk-prem', title: 'Premium Silk Hijab', price: 45.00, img: 'assets/cat_hijab.png', tag: 'LIMITED', sizes: ['One Size'], stockPercent: 65 },
    { id: 'set-coord-earth', title: 'Earthy Tunic Set', price: 125.00, img: 'assets/cat_sets.png', tag: 'MUST HAVE', sizes: ['S', 'M', 'L', 'XL'], stockPercent: 95 },
    { id: 'abaya-kimono-lin', title: 'Linen Kimono Abaya', price: 95.00, img: 'assets/prod_kimono_abaya.png', tag: 'NEW DROP', sizes: ['S', 'M', 'L'], stockPercent: 45 }
];

let cart = [];
let currentProduct = null;
let currentOptions = { size: '' };

document.addEventListener('DOMContentLoaded', () => {
    console.log("by YouSa V5 [Mobile First] Ready");
    renderFeed();
    loadCart();
    initAnimateOnScroll();
});

// --- Feed ---
function renderFeed() {
    const feed = document.getElementById('product-feed');
    if (!feed) return;

    feed.innerHTML = products.map(p => `
        <article class="product-card" data-animate onclick="openProductDetail('${p.id}')">
            <div class="product-img-box">
                <img src="${p.img}" alt="${p.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h4>${p.title}</h4>
                <p>${p.price.toFixed(2)}€</p>
            </div>
        </article>
    `).join('');
}

// --- Navigation & Core UI ---
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const isActive = drawer.classList.contains('active');

    if (!isActive) {
        renderCartItems();
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// --- Product Detail Overlay ---
function openProductDetail(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    currentOptions.size = currentProduct.sizes[0];

    document.getElementById('p-overlay-img').src = currentProduct.img;
    document.getElementById('p-overlay-title').innerText = currentProduct.title;
    document.getElementById('p-overlay-price').innerText = currentProduct.price.toFixed(2) + '€';

    const sizeContainer = document.getElementById('p-overlay-sizes');
    sizeContainer.innerHTML = currentProduct.sizes.map(size => `
        <button class="opt-btn ${size === currentOptions.size ? 'selected' : ''}" onclick="selectSize(this, '${size}')">${size}</button>
    `).join('');

    document.getElementById('product-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductDetail() {
    document.getElementById('product-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function selectSize(btn, size) {
    btn.parentNode.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentOptions.size = size;
}

// --- Cart Logic ---
function addToCartOverlay() {
    if (!currentProduct) return;

    cart.push({
        ...currentProduct,
        size: currentOptions.size,
        cartId: Date.now()
    });

    saveCart();
    updateCartUI();
    closeProductDetail();

    // Auto-open cart to show success
    setTimeout(() => toggleCart(), 300);
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:3rem; color:#999;">Tu bolsa está vacía.</div>';
        document.getElementById('cart-total').innerText = '0.00€';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; gap:15px; margin-bottom:1.5rem; border-bottom:1px solid #f5f5f5; padding-bottom:1.5rem;">
            <img src="${item.img}" style="width:70px; height:90px; object-fit:cover; border-radius:4px;">
            <div style="flex:1;">
                <h5 style="font-size:0.9rem; font-weight:700;">${item.title}</h5>
                <p style="font-size:0.7rem; color:#888; margin:4px 0;">Talla: ${item.size}</p>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <span style="font-weight:700;">${item.price.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; text-decoration:underline; font-size:0.6rem; color:red; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, i) => acc + i.price, 0);
    document.getElementById('cart-total').innerText = total.toFixed(2) + '€';
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    renderCartItems();
    updateCartUI();
}

function updateCartUI() {
    document.querySelectorAll('.cart-count').forEach(el => el.innerText = cart.length);
}

// --- Order ---
function checkout() {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, i) => acc + i.price, 0).toFixed(2);
    const items = cart.map(i => `🛍️ ${i.title} (Talla: ${i.size})`).join('%0A');
    const msg = `¡Hola! 👋 Deseo comprar estas piezas:%0A%0A${items}%0A%0A💰 TOTAL: ${total}€`;
    window.open(`https://wa.me/34636745584?text=${msg}`, '_blank');
}

// --- Persistence & Effects ---
function initAnimateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function saveCart() { localStorage.setItem('yousa_v5_cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('yousa_v5_cart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
}
