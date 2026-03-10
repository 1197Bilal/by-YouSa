// --- by YouSa V4 | Final Polish & Mobile UX Logic ---

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
    console.log("by YouSa V4 Initialized");
    renderFeed();
    loadCart();
    initAnimateOnScroll();

    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    });
});

// --- Feed Rendering ---
function renderFeed() {
    const feed = document.getElementById('product-feed');
    if (!feed) return;

    feed.innerHTML = products.map((p, i) => `
        <article class="product-card" data-animate onclick="openProductModal('${p.id}')">
            <div class="product-img-box">
                <img src="${p.img}" alt="${p.title}" loading="lazy">
                <div style="position: absolute; top: 10px; right: 10px; background: #fff; padding: 4px 10px; font-size: 9px; font-weight: 800; border-radius: 2px; text-transform: uppercase;">${p.tag}</div>
            </div>
            <div style="padding: 1rem 0;">
                <h4 style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px;">${p.title}</h4>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: var(--color-secondary); font-size: 1.1rem;">${p.price.toFixed(2)}€</span>
                    <span style="font-size: 9px; color: #e74c3c; font-weight: 700;">ÚLTIMAS PIEZAS</span>
                </div>
            </div>
        </article>
    `).join('');
}

// --- Cart System ---
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('open');
    if (!isOpen) {
        renderCartItems();
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent main scroll when cart is open
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🛍️</div>
                <p style="color: #999; font-weight: 500;">Tu bolsa está vacía.</p>
                <button class="btn btn-black" style="margin-top: 2rem; padding: 0.8rem 1.5rem;" onclick="toggleCart()">Ir a la Tienda</button>
            </div>`;
        document.getElementById('cart-total').innerText = '0.00€';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center; border-bottom: 1px solid #f5f5f5; padding-bottom: 1.5rem;">
            <img src="${item.img}" style="width: 70px; height: 90px; object-fit: cover; border-radius: 2px;">
            <div style="flex: 1;">
                <h5 style="font-weight: 700; font-size: 0.9rem;">${item.title}</h5>
                <p style="font-size: 0.75rem; color: #888; margin: 4px 0;">Talla: ${item.size}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="font-weight: 700;">${item.price.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; text-decoration: underline; font-size: 0.65rem; color: #c0392b; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, i) => acc + i.price, 0);
    document.getElementById('cart-total').innerText = total.toFixed(2) + '€';
}

function addToCart() {
    if (!currentProduct) return;

    const item = {
        ...currentProduct,
        size: currentOptions.size,
        cartId: Date.now()
    };

    cart.push(item);
    saveCart();
    updateCartUI();
    closeProductModal();

    showToast(`🛍️ ¡PIEZA AÑADIDA A TU BOLSA!`);

    // Auto-open cart after adding
    setTimeout(() => toggleCart(), 600);
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    renderCartItems();
    updateCartUI();
}

function updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => el.innerText = cart.length);
}

// --- Product Modal ---
function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    currentOptions.size = currentProduct.sizes[0];

    document.getElementById('modal-img').src = currentProduct.img;
    document.getElementById('modal-title').innerText = currentProduct.title;
    document.getElementById('modal-price').innerText = currentProduct.price.toFixed(2) + '€';

    const sizeContainer = document.getElementById('modal-sizes');
    sizeContainer.innerHTML = currentProduct.sizes.map(size => `
        <button class="opt-btn ${size === currentOptions.size ? 'selected' : ''}" onclick="selectSize(this, '${size}')">${size}</button>
    `).join('');

    // Elements for Mobile Sticky
    document.getElementById('sticky-title-mobile').innerText = currentProduct.title;
    document.getElementById('sticky-price-mobile').innerText = currentProduct.price.toFixed(2) + '€';

    // Progress Bar
    const prog = document.getElementById('modal-stock-progress');
    prog.style.width = '0%';
    setTimeout(() => prog.style.width = currentProduct.stockPercent + '%', 100);

    document.getElementById('product-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Show sticky mobile bar if on mobile
    if (window.innerWidth <= 768) {
        const sticky = document.getElementById('mobile-sticky-atc-container');
        sticky.style.display = 'flex';
        setTimeout(() => sticky.classList.add('visible'), 50);
    }
}

function selectSize(btn, size) {
    const btns = btn.parentNode.querySelectorAll('button');
    btns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentOptions.size = size;
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.body.style.overflow = '';

    const sticky = document.getElementById('mobile-sticky-atc-container');
    sticky.classList.remove('visible');
    setTimeout(() => sticky.style.display = 'none', 400);
}

// --- Checkout ---
function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, i) => acc + i.price, 0).toFixed(2);
    const itemsStr = cart.map(i => `📍 ${i.title} - Talla: ${i.size} (${i.price.toFixed(2)}€)`).join('%0A');

    const message = `SOLICITUD DE PEDIDO PREMIUM%0A%0A¡Hola By YouSa! 👋 Deseo adquirir estas piezas exclusivas de la colección 2026:%0A%0A${itemsStr}%0A%0A💰 TOTAL: ${total}€%0A%0A📍 Por favor, enviadme los pasos para el pago y la entrega express.`;

    window.open(`https://wa.me/34636745584?text=${message}`, '_blank');
}

// --- Utils ---
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function initAnimateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// --- Persistence ---
function saveCart() { localStorage.setItem('yousa_v4_cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('yousa_v4_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}
