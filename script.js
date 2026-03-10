// --- by YouSa V3 | Premium Mobile Conversion Logic ---

const activities = [
    "Alguien de Madrid acaba de adquirir una Luxe Champagne Abaya ✨",
    "¡Solo quedan 2 piezas del Earthy Tunic Set en stock! 🔥",
    "Alguien de Barcelona está mirando el Premium Silk Hijab ahora mismo 👀",
    "Nueva colección 2026: 15 personas han añadido hoy piezas a su bolsa 🛍️",
    "Envío Express confirmado para un pedido en Valencia 🚚",
    "¡Reposición de stock! 5 Abayas enviadas a Collado Villalba 📦"
];

const products = [
    {
        id: 'abaya-silk-lux',
        title: 'Luxe Champagne Abaya',
        price: 189.00,
        img: 'assets/cat_abaya.png',
        tag: 'BESTSELLER',
        stock: 'Agotándose rápido',
        sizes: ['S', 'M', 'L'],
        stockPercent: 92
    },
    {
        id: 'hijab-silk-prem',
        title: 'Premium Silk Hijab',
        price: 45.00,
        img: 'assets/cat_hijab.png',
        tag: 'NEW DROP',
        stock: 'Limited stock',
        sizes: ['One Size'],
        stockPercent: 65
    },
    {
        id: 'set-coord-earth',
        title: 'Earthy Tunic Set',
        price: 125.00,
        img: 'assets/cat_sets.png',
        tag: 'MUST HAVE',
        stock: 'Only 3 left',
        sizes: ['S', 'M', 'L', 'XL'],
        stockPercent: 95
    },
    {
        id: 'abaya-kimono-lin',
        title: 'Linen Kimono Abaya',
        price: 95.00,
        img: 'assets/prod_kimono_abaya.png',
        tag: 'SUMMER VIVE',
        stock: 'Restocked!',
        sizes: ['S', 'M', 'L'],
        stockPercent: 40
    }
];

let cart = [];
let currentProduct = null;
let currentOptions = { size: '' };

document.addEventListener('DOMContentLoaded', () => {
    initScrollEffects();
    renderFeed();
    updateCartUI();
    initLiveActivities();
    initAnimateOnScroll();
    loadCart();
});

// --- UI Engine ---

function renderFeed() {
    const feed = document.getElementById('product-feed');
    if (!feed) return;

    feed.innerHTML = products.map((p, i) => `
        <article class="product-card" data-animate style="transition-delay: ${i * 0.1}s" onclick="openProductModal('${p.id}')">
            <div class="product-img-box">
                <img src="${p.img}" alt="${p.title}" loading="lazy">
                <div style="position: absolute; top: 12px; right: 12px; background: #fff; color:#000; padding: 5px 12px; font-size: 0.6rem; font-weight: 800; text-transform:uppercase; letter-spacing:0.05em; border-radius: 2px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">${p.tag}</div>
            </div>
            <div style="padding: 1rem 0;">
                <h4 style="font-weight: 600; margin-bottom: 4px;">${p.title}</h4>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: var(--color-secondary); font-size: 1.1rem;">${p.price.toFixed(2)}€</span>
                    <span style="font-size: 0.6rem; font-weight: 700; color:#e74c3c;">Visto por 12 personas</span>
                </div>
            </div>
        </article>
    `).join('');
}

// --- Cart & Drawer ---

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (drawer.classList.contains('open')) {
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
    updateCartUI();
    closeProductModal();

    // Feedback hático/visual
    showToast(`✨ ¡${item.title} añadido a tu bolsa!`);

    setTimeout(() => toggleCart(), 500);
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding: 4rem 1rem;">
            <p style="color: #999; margin-bottom: 2rem;">Tu bolsa de lujo está esperando piezas exclusivas.</p>
            <button class="btn btn-black" onclick="toggleCart()" style="padding: 0.8rem 1.5rem;">Seguir Comprando</button>
        </div>`;
        return;
    }

    container.innerHTML = cart.map((item, idx) => `
        <div style="display: flex; gap: 1.2rem; margin-bottom: 1.5rem; align-items: center; border-bottom: 1px solid #f5f5f5; padding-bottom: 1rem;">
            <img src="${item.img}" style="width: 70px; height: 90px; object-fit: cover;">
            <div style="flex: 1;">
                <h5 style="font-weight: 600; font-size: 0.95rem;">${item.title}</h5>
                <p style="font-size: 0.75rem; color: #888; margin: 4px 0;">Talla: ${item.selectedSize}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span style="font-weight: 700;">${item.price.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${idx})" style="background:none; border:none; text-decoration: underline; font-size: 0.65rem; color: #a00; cursor:pointer;">Eliminar</button>
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
    updateCartUI();
    renderCartItems();
}

function updateCartUI() {
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

    // Update Sticky Info (Mobile)
    const stickyTitle = document.getElementById('sticky-title-mobile');
    if (stickyTitle) stickyTitle.innerText = currentProduct.title;
    const stickyPrice = document.getElementById('sticky-price-mobile');
    if (stickyPrice) stickyPrice.innerText = currentProduct.price.toFixed(2) + '€';

    // Show Progress Bar
    const prog = document.getElementById('modal-stock-progress');
    if (prog) {
        prog.style.width = '0%';
        setTimeout(() => prog.style.width = currentProduct.stockPercent + '%', 100);
    }

    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Activate Sticky ATC on Mobile
    if (window.innerWidth <= 768) {
        document.getElementById('mobile-sticky-atc-container').classList.add('active');
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
    document.body.style.overflow = 'auto';
    document.getElementById('mobile-sticky-atc-container').classList.remove('active');
}

// --- High Conversion Strategy ---

function checkout() {
    if (cart.length === 0) return;

    const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
    let itemsStr = cart.map(item => `🛍️ ${item.title} - Talla: ${item.selectedSize} (${item.price.toFixed(2)}€)`).join('%0A');

    const message = `SOLICITUD DE COMPRA PREMIUM (Web V3)%0A%0A¡Hola By YouSa! 👋 Deseo adquirir estas piezas de la nueva colección 2026:%0A%0A${itemsStr}%0A%0A💰 TOTAL: ${total}€%0A%0A📍 Por favor, enviadme los detalles para el pago y la entrega express.`;

    window.open(`https://wa.me/34636745584?text=${message}`, '_blank');
}

function initLiveActivities() {
    setInterval(() => {
        if (Math.random() > 0.8) {
            const msg = activities[Math.floor(Math.random() * activities.length)];
            showToast(msg);
        }
    }, 12000);
}

function showToast(msg) {
    let toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: #111; color: #fff; padding: 12px 24px; border-radius: 4px;
        font-size: 0.75rem; font-weight: 600; z-index: 5000;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2); animation: toast-in 0.5s var(--transition);
        white-space: nowrap; text-transform: uppercase; letter-spacing: 0.05em;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 10px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// --- Smooth System ---

function initScrollEffects() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
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

function saveCart() { localStorage.setItem('yousa_v3_cart', JSON.stringify(cart)); }
function loadCart() {
    const saved = localStorage.getItem('yousa_v3_cart');
    if (saved) { cart = JSON.parse(saved); updateCartUI(); }
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `
    @keyframes toast-in { 
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
`;
document.head.appendChild(styleTag);
