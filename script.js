// --- by YouSa | Premium Store Logic ---

const products = [
    {
        id: 'abaya-silk',
        title: 'Luxe Champagne Abaya',
        price: 189.00,
        img: 'assets/cat_abaya.png',
        options: { sizes: ['S', 'M', 'L'], lengths: ['Regular', 'Tall'] }
    },
    {
        id: 'hijab-silk',
        title: 'Premium Silk Hijab',
        price: 45.00,
        img: 'assets/cat_hijab.png',
        options: { sizes: ['One Size'], lengths: ['Standard'] }
    },
    {
        id: 'set-coord',
        title: 'Earthy Tunic Set',
        price: 125.00,
        img: 'assets/cat_sets.png',
        options: { sizes: ['S', 'M', 'L', 'XL'], lengths: ['Regular'] }
    },
    {
        id: 'abaya-kimono',
        title: 'Linen Kimono Abaya',
        price: 95.00,
        img: 'assets/prod_kimono_abaya.png',
        options: { sizes: ['S', 'M', 'L'], lengths: ['Regular', 'Tall'] }
    }
];

let cart = [];
let currentProduct = null;
let currentOptions = { size: '', length: '' };

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initReveal();
    renderProducts();
    updateCartUI();
});

// Header Scroll Effect
function initHeader() {
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Reveal Animations on Scroll
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// Render Product Grid
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = products.map((p, i) => `
        <article class="product-card" data-reveal style="transition-delay: ${i * 0.1}s">
            <div class="product-img-box" onclick="openProductModal('${p.id}')">
                <img src="${p.img}" alt="${p.title}">
                <button class="quick-add">View Details</button>
            </div>
            <div class="product-details">
                <h4>${p.title}</h4>
                <p class="product-price">${p.price.toFixed(2)}€</p>
            </div>
        </article>
    `).join('');

    // Re-observe newly created elements
    document.querySelectorAll('[data-reveal]').forEach(el => {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) entries[0].target.classList.add('active');
        });
        obs.observe(el);
    });
}

// Modal Interaction
function openProductModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    currentOptions = { size: '', length: '' };

    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');

    if (modalImg) modalImg.src = currentProduct.img;
    if (modalTitle) modalTitle.innerText = currentProduct.title;
    if (modalPrice) modalPrice.innerText = currentProduct.price.toFixed(2) + '€';

    renderOptions('size-options', currentProduct.options.sizes, 'size');
    renderOptions('length-options', currentProduct.options.lengths, 'length');

    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 500, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' });
    }
}

function renderOptions(containerId, values, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!values || values.length === 0) {
        const group = container.closest('.option-group');
        if (group) group.style.display = 'none';
        return;
    }

    const group = container.closest('.option-group');
    if (group) group.style.display = 'block';

    values.forEach((val, index) => {
        const btn = document.createElement('button');
        btn.className = `opt-btn ${index === 0 ? 'selected' : ''}`;
        btn.innerText = val;
        btn.onclick = () => {
            Array.from(container.children).forEach(c => c.classList.remove('selected'));
            btn.classList.add('selected');
            currentOptions[type] = val;
        };
        container.appendChild(btn);
        if (index === 0) currentOptions[type] = val;
    });
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(20px)' }
    ], { duration: 300, easing: 'ease-in' }).onfinish = () => {
        modal.style.display = 'none';
    };
}

function addToCartCurrent() {
    if (!currentProduct) return;

    const item = {
        ...currentProduct,
        selectedSize: currentOptions.size,
        selectedLength: currentOptions.length,
        cartId: Date.now()
    };

    cart.push(item);
    updateCartUI();
    closeModal('product-modal');
    showToast(`Added ${item.title} to Bag`);
}

function updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(el => el.innerText = cart.length);
}

// Minimalistic Toast System
function showToast(msg) {
    let toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 2.5rem;
        left: 50%;
        transform: translateX(-50%);
        background: #121212;
        color: white;
        padding: 1rem 2.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        z-index: 5000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: toast-in 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        text-transform: uppercase;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 10px)';
        toast.style.transition = 'all 0.4s ease-out';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Inject Toast Styles
const style = document.createElement('style');
style.innerHTML = `
    @keyframes toast-in {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    .option-group label {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.75rem;
        font-weight: 600;
        color: #999;
    }
    .opt-btn {
        background: transparent;
        border: 1px solid #ddd;
        padding: 0.5rem 1.25rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 0.5rem;
    }
    .opt-btn.selected {
        background: #121212;
        color: white;
        border-color: #121212;
    }
`;
document.head.appendChild(style);

function openCart() {
    if (cart.length === 0) {
        showToast("Your shopping bag is empty");
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);
    let items = cart.map(item => `▪️ ${item.title} (${item.price.toFixed(2)}€) [${item.selectedSize}/${item.selectedLength}]`).join('%0A');

    const message = `SOLICITUD DE PEDIDO PREMIUM%0A%0A🛒 PRODUCTOS:%0A${items}%0A%0A💰 TOTAL: ${total}€%0A%0A¡Hola! Me gustaría finalizar mi compra de la colección 2026 de By YouSa.`;
    window.open(`https://wa.me/34636745584?text=${message}`, '_blank');
}
