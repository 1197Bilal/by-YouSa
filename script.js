// --- by YouSa V6 | SALES MACHINE ENGINE ---

const products = [
    { id: 'abaya-silk-lux', title: 'Luxe Champagne Abaya', price: 189.00, img: 'assets/cat_abaya.png', tag: 'BESTSELLER', sizes: ['S', 'M', 'L'], stockPercent: 94 },
    { id: 'hijab-silk-prem', title: 'Premium Silk Hijab', price: 45.00, img: 'assets/cat_hijab.png', tag: 'LIMITED', sizes: ['One Size'], stockPercent: 65 },
    { id: 'set-coord-earth', title: 'Earthy Tunic Set', price: 125.00, img: 'assets/cat_sets.png', tag: 'NEW DROP', sizes: ['S', 'M', 'L', 'XL'], stockPercent: 88 },
    { id: 'abaya-kimono-lin', title: 'Linen Kimono Abaya', price: 95.00, img: 'assets/prod_kimono_abaya.png', tag: 'MUST HAVE', sizes: ['S', 'M', 'L'], stockPercent: 45 }
];

const liveActivities = [
    "Alguien de Madrid acaba de adquirir una Luxe Champagne Abaya ✨",
    "¡Solo quedan 2 piezas del Earthy Tunic Set en stock! 🔥",
    "Amina de Barcelona ha pedido su Premium Silk Hijab 🛍️",
    "¡Colección 2026 agotándose! 5 personas comprando ahora mismo 👀",
    "Envío express preparado para un pedido en Valencia 🚚",
    "¡Reponiendo stock del Linen Kimono! Reservas abiertas 📦"
];

let cart = [];
let currentProduct = null;
let currentOptions = { size: '' };

document.addEventListener('DOMContentLoaded', () => {
    console.log("by YouSa V6 [Sales Engine] Activated");
    renderFeed();
    loadCart();
    initAnimateOnScroll();
    initLiveSales();
});

// --- UI Rendering ---
function renderFeed() {
    const feed = document.getElementById('product-feed');
    if (!feed) return;

    feed.innerHTML = products.map(p => `
        <article class="product-card" data-animate onclick="openProductDetail('${p.id}')">
            <div class="product-img-box">
                <div class="badge-tag">${p.tag}</div>
                <img src="${p.img}" alt="${p.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h4>${p.title}</h4>
                <p class="price">${p.price.toFixed(2)}€</p>
                <div class="product-status">Visto por 12 personas hoy</div>
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

    // Random people watching for social proof
    document.getElementById('watching-now').innerText = Math.floor(Math.random() * 20) + 5;

    const sizeContainer = document.getElementById('p-overlay-sizes');
    sizeContainer.innerHTML = currentProduct.sizes.map(size => `
        <button class="opt-btn ${size === currentOptions.size ? 'selected' : ''}" onclick="selectSize(this, '${size}')">${size}</button>
    `).join('');

    // Stock bar animation
    const stockBar = document.getElementById('stock-meter');
    stockBar.style.width = '0%';

    document.getElementById('product-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        stockBar.style.width = currentProduct.stockPercent + '%';
    }, 100);
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

    showToast(`✨ ¡${currentProduct.title} en tu bolsa!`);

    // Auto-open cart to close the sale
    setTimeout(() => toggleCart(), 800);
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:4rem 1rem;">
                <div style="font-size:3.5rem; margin-bottom:1rem;">🛍️</div>
                <p style="color:#888; font-weight:600; font-size:0.9rem;">Tu bolsa de lujo está vacía.</p>
                <button class="btn btn-black" style="margin-top:2rem; width:auto; padding:1rem 2rem;" onclick="toggleCart()">Continuar Comprando</button>
            </div>`;
        document.getElementById('cart-total').innerText = '0.00€';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; gap:18px; margin-bottom:1.5rem; border-bottom:1px solid #f2f2f2; padding-bottom:1.5rem; align-items:center;">
            <img src="${item.img}" style="width:75px; height:100px; object-fit:cover; border-radius:6px;">
            <div style="flex:1;">
                <h5 style="font-size:0.95rem; font-weight:800; letter-spacing:-0.4px;">${item.title}</h5>
                <p style="font-size:0.75rem; color:#888; margin:5px 0; font-weight:600;">Talla: ${item.size}</p>
                <div style="display:flex; justify-content:space-between; margin-top:12px; align-items:center;">
                    <span style="font-weight:800; font-size:1.1rem; color:var(--color-secondary);">${item.price.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; text-decoration:underline; font-size:0.7rem; color:#e74c3c; font-weight:700; cursor:pointer;">Eliminar</button>
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
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => {
        el.innerText = cart.length;
        el.style.transform = 'scale(1.3)';
        setTimeout(() => el.style.transform = 'scale(1)', 300);
    });
}

// --- Checkout ---
function checkout() {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, i) => acc + i.price, 0).toFixed(2);
    const items = cart.map(i => `📍 ${i.title} (Talla: ${i.size}) - ${i.price.toFixed(2)}€`).join('%0A');
    const msg = `SOLICITUD DE COMPRA PREMIUM (V6)%0A%0A¡Hola By YouSa! 👋 Deseo adquirir estas piezas exclusivas:%0A%0A${items}%0A%0A💰 TOTAL: ${total}€%0A%0A📍 Por favor, enviadme los detalles de pago y entrega express.`;
    window.open(`https://wa.me/34636745584?text=${msg}`, '_blank');
}

// --- Sales Techniques ---
function initLiveSales() {
    setInterval(() => {
        if (Math.random() > 0.8) {
            const msg = liveActivities[Math.floor(Math.random() * liveActivities.length)];
            const el = document.getElementById('live-purchase');
            document.getElementById('purchase-msg').innerText = msg;
            el.style.display = 'flex';
            setTimeout(() => {
                el.classList.add('hiding');
                setTimeout(() => {
                    el.style.display = 'none';
                    el.classList.remove('hiding');
                }, 500);
            }, 5000);
        }
    }, 15000);
}

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

// --- Initializers ---
function initAnimateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function saveCart() { localStorage.setItem('yousa_v6_cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('yousa_v6_cart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
}
