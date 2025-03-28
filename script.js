// Lista de produtos disponíveis para compra
const products = [
    { id: 1, name: 'Camisa Esportiva', price: 29.99 },
    { id: 2, name: 'Bermuda da Adidas', price: 49.99 },
    { id: 3, name: 'Meias da Lupo', price: 19.99 },
    { id: 4, name: 'Tênis Air Jordan', price: 89.99 },
    { id: 5, name: 'Óculos Escuro', price: 14.99 },
    { id: 6, name: 'Bicicleta', price: 699.99 }
];

// Função para salvar o carrinho no cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Define a data de expiração
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`; // Salva o cookie
}

// Função para ler cookies
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            return JSON.parse(cookie.substring(name.length + 1)); // Retorna o valor do cookie
        }
    }
    return null;
}

// Função para limpar cookies
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// Função para renderizar a lista de produtos
function renderProducts() {
    const productList = document.getElementById('products-list');
    productList.innerHTML = ''; // Limpa a lista antes de renderizar novamente

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Função para adicionar um produto ao carrinho
function addToCart(productId) {
    const cart = loadCart();
    const product = products.find(p => p.id === productId);

    if (product) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
    }

    saveCart(cart);
    renderCart();
}

// Função para salvar o carrinho no cookie
function saveCart(cart) {
    setCookie('cart', cart, 7); // Salva o carrinho por 7 dias
}

// Função para carregar o carrinho do cookie
function loadCart() {
    return getCookie('cart') || []; // Retorna o carrinho ou um array vazio se não houver cookie
}

// Função para renderizar o carrinho
function renderCart() {
    const cart = loadCart();
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    cartItems.innerHTML = ''; // Limpa os itens do carrinho antes de renderizar novamente

    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `${item.name} x ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`;
        cartItems.appendChild(cartItem);

        total += item.price * item.quantity;
    });

    totalPrice.innerText = total.toFixed(2);
}

// Função para limpar o carrinho
function clearCart() {
    deleteCookie('cart');
    renderCart();
}

// Função para exibir/ocultar o banner de cookies
function handleCookieConsent() {
    const cookieConsent = getCookie('cookieConsent');
    const cookieBanner = document.getElementById('cookie-banner');

    if (!cookieConsent) {
        cookieBanner.style.display = 'block'; // Exibe o banner de cookies
    }

    // Ao clicar em "Aceitar", armazenamos a permissão de cookies
    document.getElementById('accept-cookies').addEventListener('click', () => {
        setCookie('cookieConsent', 'true', 365); // Cookie válido por 365 dias
        cookieBanner.style.display = 'none'; // Oculta o banner
    });

    // Ao clicar em "Recusar", não armazenamos nada
    document.getElementById('decline-cookies').addEventListener('click', () => {
        cookieBanner.style.display = 'none'; // Oculta o banner
    });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    handleCookieConsent();

    // Adicionar evento de clique nos botões "Adicionar ao Carrinho"
    document.getElementById('products-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Evento de limpar o carrinho
    document.getElementById('clear-cart').addEventListener('click', clearCart);
});