// --- by YouSa V2 | Dynamic Sales Logic ---

const activities = [
    "Alguien de Madrid acaba de adquirir una Luxe Champagne Abaya ✨",
    "¡Solo quedan 2 piezas del Earthy Tunic Set en stock! 🔥",
    "Alguien de Barcelona está mirando el Premium Silk Hijab ahora mismo 👀",
    "Nueva colección 2026: 15 personas han añadido hoy piezas a su bolsa 🛍️",
    "Envío Express confirmado para un pedido en Valencia 🚚"
];

function initLiveActivities() {
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 10s to show activity
            const msg = activities[Math.floor(Math.random() * activities.length)];
            showToast(msg);
        }
    }, 10000);
}

const products = [
    {
        id: 'abaya-silk-lux',
        title: 'Luxe Champagne Abaya',
        price: 189.00,
        img: 'assets/cat_abaya.png',
        tag: 'BESTSELLER',
        stock: 'Limited Edition',
        sizes: ['S', 'M', 'L']
    },
    {
        id: 'hijab-silk-prem',
        title: 'Premium Silk Hijab',
        price: 45.00,
        img: 'assets/cat_hijab.png',
        tag: 'NEW DROP',
        stock: 'Selling Fast',
        sizes: ['One Size']
    },
    {
        id: 'set-coord-earth',
        title: 'Earthy Tunic Set',
        price: 125.00,
        img: 'assets/cat_sets.png',
        tag: 'MUST HAVE',
        stock: 'Only 5 left',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: 'abaya-kimono-lin',
        title: 'Linen Kimono Abaya',
        price: 95.00,
        img: 'assets/prod_kimono_abaya.png',
        tag: 'SUMMER VIVE',
        stock: 'Restocked',
        sizes: ['S', 'M', 'L']
    }
];

let cart = [];
let currentProduct = null;
let currentOptions = { size: '' };

document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    renderFeed();
    updateCartDisplay();
    initAnimateOnScroll();
    initLiveActivities();
});

// --- Dynamic Rendering ---

function renderFeed() {
    const feed = document.getElementById('product-feed');
    if (!feed) return;

    feed.innerHTML = products.map((p, i) => `
        <article class="product-card" data-animate style="transition-delay: ${i * 0.1}s" onclick="openProductModal('${p.id}')">
            <div class="product-img-box">
                <img src="${p.img}" alt="${p.title}">
                <div style="position: absolute; top: 1rem; right: 1rem; background: #fff; padding: 4px 10px; font-size: 0.6rem; font-weight: 800; border-radius: 2px;">${p.tag}</div>
            </div>
            <div style="padding: 1.5rem 0;">
                <h4 style="font-size: 1.1rem; font-weight: 600;">${p.title}</h4>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                    <span style="font-weight: 700; color: var(--color-secondary);">${p.price.toFixed(2)}€</span>
                    <span class="watching-count">Ver Detalles</span>
                </div>
                <div class="sold-out-soon">${p.stock} 🔥</div>
            </div>
        </article>
    `).join('');
}

// --- Cart System (Side Drawer) ---

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');

    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('active');
        renderCartItems();
    }
}

function addToCart() {
    if (!currentProduct) return;

    const item = {
        ...currentProduct,
        selectedSize: currentOptions.size,
        cartId: Date.now()
    };

    cart.push(item);
    saveCart();
    updateCartDisplay();
    closeProductModal();

    // Auto-open side cart with a bit of delay for feedback
    setTimeout(() => toggleCart(), 400);
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; margin-top: 50px;">Tu bolsa está vacía.</p>';
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem; align-items: center;">
            <img src="${item.img}" style="width: 80px; height: 100px; object-fit: cover;">
            <div style="flex: 1;">
                <h5 style="font-weight: 600;">${item.title}</h5>
                <p style="font-size: 0.8rem; color: #777;">Talla: ${item.selectedSize}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                    <span style="font-weight: 700;">${item.price.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; text-decoration: underline; font-size: 0.7rem; cursor:pointer;">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('cart-total').innerText = total.toFixed(2) + '€';
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartDisplay();
    renderCartItems();
}

function updateCartDisplay() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => el.innerText = cart.length);
}

// --- Product Modal ---

function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    currentOptions = { size: currentProduct.sizes[0] };

    document.getElementById('modal-img').src = currentProduct.img;
    document.getElementById('modal-title').innerText = currentProduct.title;
    document.getElementById('modal-price').innerText = currentProduct.price.toFixed(2) + '€';

    const sizeContainer = document.getElementById('modal-sizes');
    sizeContainer.innerHTML = currentProduct.sizes.map(size => `
        <button class="opt-btn ${size === currentOptions.size ? 'selected' : ''}" onclick="selectSize(this, '${size}')">${size}</button>
    `).join('');

    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
}

function selectSize(btn, size) {
    const btns = btn.parentNode.querySelectorAll('button');
    btns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentOptions.size = size;
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// --- Strategy: Checkout & Upsell ---

function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
    let itemsStr = cart.map(item => `🛍️ ${item.title} - Talla: ${item.selectedSize} (${item.price.toFixed(2)}€)`).join('%0A');

    // Strategy Trick: Custom high-conversion message
    const message = `🔥 NUEVA SOLICITUD PREMIUM%0A%0A¡Hola By YouSa! 👋 Me gustaría adquirir estas piezas exclusivas de la colección 2026:%0A%0A${itemsStr}%0A%0A💰 TOTAL: ${total}€%0A%0A📍 Por favor, decidme los pasos para el pago y envío.`;

    window.open(`https://wa.me/34636745584?text=${message}`, '_blank');
}

// --- UX & Animations ---

function initScrollEffects() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initAnimateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// --- Persistence ---
function saveCart() { localStorage.setItem('by_yousa_cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('by_yousa_cart');
    if (saved) cart = JSON.parse(saved);
}

loadCart();
