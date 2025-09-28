// Side Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    let isMenuOpen = false;

    menuToggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        sideMenu.style.transform = isMenuOpen ? 'translateX(0)' : 'translateX(-280px)';
        menuToggle.innerHTML = isMenuOpen ? '×' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (isMenuOpen && !sideMenu.contains(event.target) && event.target !== menuToggle) {
            isMenuOpen = false;
            sideMenu.style.transform = 'translateX(-280px)';
            menuToggle.innerHTML = '☰';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close menu if open
                if (isMenuOpen) {
                    isMenuOpen = false;
                    sideMenu.style.transform = 'translateX(-280px)';
                    menuToggle.innerHTML = '☰';
                }
            }
        });
    });

    // Add scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        observer.observe(section);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            const productName = product.querySelector('h4').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = 'block';
                product.style.animation = 'fadeIn 0.5s ease';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Add to cart functionality
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product-card');
            const productName = product.querySelector('h4').textContent;
            const productPrice = product.querySelector('p').textContent;
            
            // Show confirmation message
            const message = document.createElement('div');
            message.className = 'add-to-cart-message';
            message.textContent = `${productName} added to cart`;
            message.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--secondary);
                color: white;
                padding: 1rem 2rem;
                border-radius: 6px;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                z-index: 1000;
            `;
            
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);
        });
    });
});

// Add necessary animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
// Cart Functionality
let cart = [];
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const closeCart = document.querySelector('.close-cart');

// Open/Close Cart
cartIcon.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Add to Cart
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.closest('.product-card');
        const productId = product.dataset.id || Math.random().toString(36).substr(2, 9);
        const productName = product.querySelector('h4').textContent;
        const productPrice = parseFloat(product.querySelector('p').textContent.replace('$', ''));
        const productImage = product.querySelector('img').src;

        addToCart({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    });
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }

    updateCart();
    showNotification(`${product.name} added to cart`);
    toggleCart();
}

function updateCart() {
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart items display
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeItem('${item.id}')">&times;</button>
        </div>
    `).join('');

    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(productId);
        } else {
            updateCart();
        }
    }
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--secondary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Checkout functionality
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    // Add your checkout logic here
    showNotification('Proceeding to checkout...');
});