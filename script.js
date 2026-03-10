// --- by YouSa V3.1 | Cleaned & Mobile-First Logic ---

const products = [
    { id: 'abaya-silk-lux', title: 'Luxe Champagne Abaya', price: 189.00, img: 'assets/cat_abaya.png', tag: 'BESTSELLER', sizes: ['S', 'M', 'L'], stockPercent: 85 },
    { id: 'hijab-silk-prem', title: 'Premium Silk Hijab', price: 45.00, img: 'assets/cat_hijab.png', tag: 'NEW DROP', sizes: ['One Size'], stockPercent: 60 },
    { id: 'set-coord-earth', title: 'Earthy Tunic Set', price: 125.00, img: 'assets/cat_sets.png', tag: 'MUST HAVE', sizes: ['S', 'M', 'L'], stockPercent: 95 },
    { id: 'abaya-kimono-lin', title: 'Linen Kimono Abaya', price: 95.00, img: 'assets/prod_kimono_abaya.png', tag: 'SUMMER', sizes: ['S', 'M', 'L'], stockPercent: 40 }
];

let cart = [];
let currentProduct = null;
let currentOptions = { size: '' };

document.addEventListener('DOMContentLoaded', () => {
    renderFeed();
    loadCart();
    initAnimateOnScroll();

    // Header Scroll effect
    window.addEventListener('scroll', () => {
        document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 50);
    });
});

function renderFeed() {
    const feed = document.getElementById('product-feed');
    if (!feed) return;
    feed.innerHTML = products.map((p, i) => `
        <article class="product-card" data-animate onclick="openProductModal('${p.id}')">
            <div class="product-img-box">
                <img src="${p.img}" alt="${p.title}">
            </div>
            <div style="padding:10px 0;">
                <h4 style="font-size:0.9rem; margin-bottom:2px;">${p.title}</h4>
                <div style="font-weight:700; color:var(--color-secondary); font-size:1rem;">${p.price.toFixed(2)}€</div>
            </div>
        </article>
    `).join('');
}

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

    // Update Mobile Sticky
    document.getElementById('sticky-title-mobile').innerText = currentProduct.title;
    document.getElementById('sticky-price-mobile').innerText = currentProduct.price.toFixed(2) + '€';

    document.getElementById('modal-stock-progress').style.width = currentProduct.stockPercent + '%';

    document.getElementById('product-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (window.innerWidth <= 768) {
        document.getElementById('mobile-sticky-atc-container').classList.add('active');
    }
}

function selectSize(btn, size) {
    btn.parentNode.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentOptions.size = size;
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('mobile-sticky-atc-container').classList.remove('active');
}

function addToCart() {
    if (!currentProduct) return;
    cart.push({ ...currentProduct, size: currentOptions.size, cartId: Date.now() });
    saveCart();
    updateCartUI();
    closeProductModal();
    showToast(`🛍️ ¡${currentProduct.title} añadido!`);
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const isOpen = drawer.classList.contains('open');

    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
    if (!isOpen) renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:3rem; color:#888;">Tu bolsa está vacía</p>';
        return;
    }
    container.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; gap:10px; margin-bottom:1rem; align-items:center;">
            <img src="${item.img}" style="width:60px; height:80px; object-fit:cover;">
            <div style="flex:1;">
                <h5 style="font-size:0.8rem;">${item.title}</h5>
                <p style="font-size:0.7rem; color:#888;">Talla: ${item.size}</p>
                <div style="display:flex; justify-content:space-between; margin-top:5px;">
                    <span style="font-weight:700;">${item.price.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; text-decoration:underline; font-size:0.6rem; color:red; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('cart-total').innerText = cart.reduce((acc, i) => acc + i.price, 0).toFixed(2) + '€';
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
    renderCartItems();
}

function updateCartUI() {
    document.querySelectorAll('.cart-count').forEach(el => el.innerText = cart.length);
}

function checkout() {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, i) => acc + i.price, 0).toFixed(2);
    const items = cart.map(i => `🛍️ ${i.title} (Talla: ${i.size})`).join('%0A');
    const msg = `¡Hola! 👋 Deseo comprar estas piezas:%0A%0A${items}%0A%0A💰 TOTAL: ${total}€`;
    window.open(`https://wa.me/34636745584?text=${msg}`, '_blank');
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

function initAnimateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

function saveCart() { localStorage.setItem('yousa_v3_cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('yousa_v3_cart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
}
