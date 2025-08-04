// Global variables
let cart = JSON.parse(localStorage.getItem("naturalUrologyCart")) || [];
let products = {
    gomitas: [],
    capsulas: [],
    suplementos: [],
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    initializeProducts();
    updateCartDisplay();
    loadCartFromStorage();
    
    // Initialize chatbot after DOM is loaded
    initializeChatbot();
});

// =================================================================
// =============== SECCIÓN DE LÓGICA DEL CHATBOT MCU ===============
// =================================================================

// --- 1. FUNCIÓN DE INICIALIZACIÓN DEL CHATBOT ---
function initializeChatbot() {
    // Selección de elementos del DOM
    const chatbotIcon = document.getElementById("chatbot-icon");
    const chatbotContainer = document.getElementById("chatbot-container");
    const closeChatbotButton = document.getElementById("close-chatbot");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message-input");
    const chatWindow = document.getElementById("chat-window");

    // La ruta a nuestra función de backend en Netlify
    const apiEndpoint = "/.netlify/functions/gemini";

    // --- 2. VERIFICACIÓN DE ELEMENTOS ---
    console.log('Elementos encontrados:');
    console.log('chatbotIcon:', !!chatbotIcon);
    console.log('chatbotContainer:', !!chatbotContainer);
    console.log('closeChatbotButton:', !!closeChatbotButton);
    console.log('chatForm:', !!chatForm);
    console.log('messageInput:', !!messageInput);
    console.log('chatWindow:', !!chatWindow);

    // Verificar que todos los elementos existen antes de continuar
    if (!chatbotIcon || !chatbotContainer || !closeChatbotButton || !chatForm || !messageInput || !chatWindow) {
        console.error("Error: Algunos elementos del chatbot no fueron encontrados en el DOM.");
        return;
    }

    // --- 3. FUNCIÓN AUXILIAR PARA AÑADIR MENSAJES AL CHAT ---
    function addMessageToWindow(message, className) {
        const messageElement = document.createElement("div");
        const classes = className.split(' ');
        messageElement.classList.add("message", ...classes);
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);

        // Asegura que la ventana del chat siempre muestre el último mensaje
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return messageElement;
    }

    // --- 4. MANEJO DE EVENTOS PARA ABRIR Y CERRAR EL CHAT ---
    
    // Evento: Al hacer clic en el ícono, se muestra el contenedor del chat
    chatbotIcon.addEventListener("click", () => {
        chatbotContainer.classList.remove("hidden");
    });

    // Evento: Al hacer clic en el botón de cerrar, se oculta el contenedor del chat
    closeChatbotButton.addEventListener("click", () => {
        chatbotContainer.classList.add("hidden");
    });

    // --- 5. LÓGICA PRINCIPAL PARA ENVIAR Y RECIBIR MENSAJES ---
    // Evento: Se activa cuando el usuario envía el formulario (presiona Enter o el botón de enviar)
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Previene que la página se recargue

        const userMessage = messageInput.value.trim();
        if (!userMessage) return; // No hace nada si el mensaje está vacío

        // Muestra el mensaje del usuario en la ventana del chat
        addMessageToWindow(userMessage, "user-message");
        messageInput.value = ""; // Limpia el campo de entrada

        // Muestra el indicador "Escribiendo..." mientras espera la respuesta
        const loadingIndicator = addMessageToWindow(
            "Escribiendo...",
            "loading",
        );

        // Bloque try...catch para manejar posibles errores de conexión
        try {
            // Llama a nuestra función de backend (Netlify Function)
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            // Si la respuesta del servidor no es exitosa (ej: error 500), lanza una excepción
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }

            // Procesa la respuesta JSON del bot
            const data = await response.json();

            // Quita el indicador "Escribiendo..."
            chatWindow.removeChild(loadingIndicator);

            // Muestra el mensaje de respuesta del bot en el chat
            addMessageToWindow(data.reply, "bot-message");

        } catch (error) {
            // Si ocurre cualquier error en el bloque 'try', se ejecuta esto
            console.error("Error al contactar la API:", error);

            // Quita el indicador "Escribiendo..."
            if (loadingIndicator && chatWindow.contains(loadingIndicator)) {
                chatWindow.removeChild(loadingIndicator);
            }

            // Muestra un mensaje de error claro al usuario en el chat
            addMessageToWindow(
                "Lo siento, algo salió mal. Por favor, inténtalo de nuevo más tarde.",
                "bot-message-error",
            );
        }
    });

    console.log('Chatbot inicializado correctamente');
}

// =================================================================
// =============== RESTO DE LA LÓGICA DE LA APLICACIÓN ===============
// =================================================================

// Initialize products with sample data
function initializeProducts() {
    // EJEMPLO 1 GOMITAS: Modificar descripción y precio
    products.gomitas.push({
        id: "1#",
        name: "Gomita Omega 3 6 9 dha epa ara colina Potasio",
        price: 49,
        image: "https://i.imgur.com/Py8azRO.png",
        description:
            "Gomitas Nutricionales Omega 3-6-9 con DHA, EPA, ARA, Colina y Potasio 🍬 ¡La Mejor Forma de Nutrirte con Sabor!.",
        category: "gomitas",
    });

    // EJEMPLO 2 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "2#",
        name: "Gomitas Multivitamínicas 3-6-9-12",
        price: 49,
        image: "https://i.imgur.com/0HZuzIP.png",
        description:
            "Gomitas Multivitamínicas 3-6-9-12 🍊 ¡Vitaminas Esenciales en Deliciosas Gomitas!",
        category: "gomitas",
    });
	
	// EJEMPLO 3 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "3#",
        name: "Gomitas de Colágeno Hidrolizado + Vitaminas",
        price: 49,
        image: "https://i.imgur.com/D9cY43C.png",
        description:
            "Gomitas de Colágeno Hidrolizado + Vitaminas 💖 ¡Tu ritual diario de belleza en formato delicioso! 💖",
        category: "gomitas",
    });
	
		// EJEMPLO 4 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "4#",
        name: "Gomitas Antiinflamatorias de Cúrcuma ",
        price: 49,
        image: "https://i.imgur.com/SvBB6Uk.png",
        description:
            "Gomitas Antiinflamatorias de Cúrcuma 🌟 ¡Alivio Natural en Cada Gomita!",
        category: "gomitas",
    });

		// EJEMPLO 5 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "5#",
        name: "Gomitas Energéticas de Hierro + Moringa & Vitamina C",
        price: 49,
        image: "https://i.imgur.com/QmSdfUK.png",
        description:
            "Gomitas Energéticas de Hierro + Moringa & Vitamina C ¡Combate la Anemia con Sabor!",
        category: "gomitas",
    });
	
	// EJEMPLO 6 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "6#",
        name: "Gomitas de Própolis Premium para Adultos  ¡Defensas Naturales en Cada Gomita!",
        price: 49,
        image: "https://i.imgur.com/36zZBkW.png",
        description:
            "usar Adultos con sistema inmunológico débil  Fumadores o personas con irritación faríngea frecuente ",
        category: "gomitas",
    });
	
	// EJEMPLO 7 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "7#",
        name: "Gomitas de Própolis para Niños  ¡Protección Deliciosa para los Pequeños!",
        price: 49,
        image: "https://i.imgur.com/REjF1Hd.png",
        description:
            "Gomitas Energéticas de Hierro + Moringa & Vitamina C ¡Combate la Anemia con Sabor!",
        category: "gomitas",
    });
	
	// EJEMPLO 8 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "8#",
        name: "Gomitas Relajantes de Valeriana ¡Descanso Natural en Cada Gomita!",
        price: 49,
        image: "https://i.imgur.com/w8AokCO.png",
        description:
            "🌙 ¡El descanso que mereces, en la forma más deliciosa! 🌙",
        category: "gomitas",
    });
	
	// EJEMPLO 9 GOMITAS: Usar imagen de Imgur
    products.gomitas.push({
        id: "9#",
        name: "Gomitas Inmuno-Energéticas con Zinc, Magnesio, Betaglucano, Vitamina C y Selenio!",
        price: 49,
        image: "https://i.imgur.com/Ccvj8wt.png",
        description:
            "⚡ ¡Energía y Defensas en Cada Gomita!",
        category: "gomitas",
    });

    // Resto de gomitas (generadas automáticamente)
    for (let i = 1; i <= 1; i++) {
        products.gomitas.push({
            id: `gomita-${i}`,
            name: `Gomita Prostática Natural ${i}`,
            price: 49,
            image: `🍬`,
            description: `Deliciosa gomita natural ${i} elaborada con ingredientes 100% naturales específicamente formulada para la salud prostática. Contiene extractos de saw palmetto, zinc y licopeno para el bienestar del sistema urológico.`,
            category: "gomitas",
        });
    }

    // EJEMPLO 1 CÁPSULAS: Producto premium con precio y descripción personalizada
    products.capsulas.push({
        id: "c1",
        name: "ErectMax Maxx - Potenciador Masculino en Cápsulas💪 ¡Máximo Desempeño y Vitalidad Masculina!",
        price: 59,
        image: "https://i.imgur.com/pcLMm5r.png",
        description:
            "🚀 ¡Potencia tu energía íntima de forma natural y deliciosa! 🚀.",
        category: "capsulas",
    });

    // EJEMPLO 2 CÁPSULAS: Con imagen personalizada de Imgur
    products.capsulas.push({
        id: "c2",
        name: "BioProst - Soporte Prostático Integral ¡Salud Prostática Natural en Cada Cápsula!",
        price: 49,
        image: "https://i.imgur.com/uYo7NaV.png",
        description:
            "🛡️ ¡Cuida tu salud prostática de manera natural con BioProst ! 🛡️",
        category: "capsulas",
    });

    // EJEMPLO 3 CÁPSULAS: Con imagen personalizada de Imgur
    products.capsulas.push({
        id: "c3",
        name: "Te Verde- Antioxidante Premium🍃 ¡Poder Antioxidante en Cada Cápsula!",
        price: 49,
        image: "https://i.imgur.com/L6PDL6n.png",
        description:
            "🌱 ¡Tu dosis diaria de salud en estado puro con Te Verde! 🌱",
        category: "capsulas",
    });
	
	// EJEMPLO 4 CÁPSULAS: Con imagen personalizada de Imgur
    products.capsulas.push({
        id: "c4",
        name: "Aguaje  Belleza Femenina Natural🌸 ¡Potenciador Hormonal 100% Natural!",
        price: 49,
        image: "https://i.imgur.com/D9mD7DB.png",
        description:
            "🌺 ¡Descubre el poder de la feminidad natural con Aguaje! 🌺",
        category: "capsulas",
    });
	
	products.capsulas.push({
        id: "c5",
        name: "Maca Negra Premium - Energía y Vitalidad🔥 ¡La Fuerza de los Andes en Cada Cápsula!",
        price: 49,
        image: "https://i.imgur.com/rNxLuVJ.png",
        description:
            "⚡ ¡Descubre el poder ancestral de la Maca Negra! ⚡",
        category: "capsulas",
    });
	
	products.capsulas.push({
        id: "c6",
        name: "Huanarpo Macho - Potenciador Natural Masculino 💪 ¡Virilidad Ancestral del Perú!",
        price: 49,
        image: "https://i.imgur.com/0fGXhwl.png",
        description:
            "🌿 ¡El secreto ancestral de la virilidad masculina! 🌿",
        category: "capsulas",
    });
	
	products.capsulas.push({
        id: "c7",
        name: "Saw Palmetto - Salud Prostática Natural 🌿 ¡Protección Natural para Tu Próstata!",
        price: 49,
        image: "https://i.imgur.com/J4LflFj.png",
        description:
            "🛡️ ¡Cuida tu próstata con la fuerza de la naturaleza! 🛡️",
        category: "capsulas",
    });
	
	products.capsulas.push({
        id: "c8",
        name: "Graviola - Antioxidante Tropical 🍃 ¡Defensas Naturales de la Amazonía!",
        price: 49,
        image: "https://i.imgur.com/9v9OhGv.png",
        description:
            "🌳 ¡El poder antioxidante de la selva amazónica! 🌳",
        category: "capsulas",
    });
	
	products.capsulas.push({
        id: "c9",
        name: "Cúrcuma + Pimienta Negra - Antiinflamatorio Natural 🌟 ¡Combate la Inflamación Naturalmente!",
        price: 49,
        image: "https://i.imgur.com/vr3l8xH.png",
        description:
            "🔥 ¡Alivio natural para tu bienestar! 🔥",
        category: "capsulas",
    });

    // Resto de cápsulas (generadas automáticamente)
    for (let i = 1; i <= 1; i++) {
        products.capsulas.push({
            id: `capsula-${i}`,
            name: `Cápsula Urológica Premium ${i}`,
            price: 59,
            image: `💊`,
            description: `Cápsula premium ${i} con concentrado de extractos naturales para la salud urológica. Fórmula avanzada con saw palmetto, pygeum africanum y ortiga para el cuidado integral del sistema urinario masculino.`,
            category: "capsulas",
        });
    }

    // EJEMPLO 1 SUPLEMENTOS: Producto especializado
    products.suplementos.push({
        id: "s1",
        name: "Harina de Maca Orgánica - Superalimento Andino 🏔️ ¡Energía Ancestral en Polvo!",
        price: 39,
        image: "https://i.imgur.com/HqJMStL.png",
        description:
            "🌿 ¡La energía de los Andes en su forma más pura! 🌿",
        category: "suplementos",
    });

    // EJEMPLO 2 SUPLEMENTOS: Con imagen personalizada
    products.suplementos.push({
        id: "s2",
        name: "Quinoa en Polvo - Proteína Completa 💪 ¡El Grano de Oro de los Incas!",
        price: 35,
        image: "https://i.imgur.com/8KnFq7M.png",
        description:
            "🌾 ¡Proteína completa y nutrición superior! 🌾",
        category: "suplementos",
    });
	
	products.suplementos.push({
        id: "s3",
        name: "Cacao en Polvo Orgánico - Antioxidante Natural 🍫 ¡El Alimento de los Dioses!",
        price: 42,
        image: "https://i.imgur.com/ZvK8pOr.png",
        description:
            "🍫 ¡Sabor celestial con beneficios terrenales! 🍫",
        category: "suplementos",
    });
	
	products.suplementos.push({
        id: "s4",
        name: "Spirulina en Polvo - Superalimento Verde 🌿 ¡La Proteína del Futuro!",
        price: 55,
        image: "https://i.imgur.com/nWbK8Tp.png",
        description:
            "🌊 ¡El tesoro nutricional del mar! 🌊",
        category: "suplementos",
    });
	
	products.suplementos.push({
        id: "s5",
        name: "Chía Molida - Omega 3 Vegetal 🌱 ¡Pequeñas Semillas, Grandes Beneficios!",
        price: 28,
        image: "https://i.imgur.com/L9xVfBi.png",
        description:
            "✨ ¡La semilla milenaria de la vitalidad! ✨",
        category: "suplementos",
    });
	
	products.suplementos.push({
        id: "s6",
        name: "Kiwicha en Hojuelas - Cereal Ancestral 🌾 ¡El Amaranto de los Andes!",
        price: 32,
        image: "https://i.imgur.com/Q7nV8mF.png",
        description:
            "🌱 ¡Desayuna como un guerrero inca! 🌱",
        category: "suplementos",
    });

    // Resto de suplementos (generados automáticamente)
    for (let i = 1; i <= 1; i++) {
        products.suplementos.push({
            id: `suplemento-${i}`,
            name: `Harina Prostática Orgánica ${i}`,
            price: 45,
            image: `🌾`,
            description: `Harina orgánica ${i} rica en nutrientes específicos para la salud prostática. Mezcla de semillas de calabaza, linaza y amaranto, fuentes naturales de zinc, omega-3 y antioxidantes esenciales.`,
            category: "suplementos",
        });
    }

    // Renderizar productos
    renderProducts("gomitas");
    renderProducts("capsulas");
    renderProducts("suplementos");
}

// Render products in their respective grids
function renderProducts(category) {
    const grid = document.getElementById(`${category}-grid`);
    if (!grid) return;

    grid.innerHTML = "";
    
    products[category].forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => showProductDetails(product);

    // Handle image display
    let imageContent;
    if (product.image.startsWith('http')) {
        imageContent = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        imageContent = product.image;
    }

    card.innerHTML = `
        <div class="product-image">${imageContent}</div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">S/. ${product.price}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
                Agregar al Carrito
            </button>
        </div>
    `;
    
    return card;
}

// Navigation and menu functions
function toggleMegaMenu(menuId) {
    // Hide all megamenus
    const allMenus = document.querySelectorAll('.megamenu');
    allMenus.forEach(menu => {
        if (menu.id === `megamenu-${menuId}`) {
            menu.classList.toggle('active');
        } else {
            menu.classList.remove('active');
        }
    });
}

function showProductSection(section) {
    // Hide all product subsections
    const allSections = document.querySelectorAll('.product-subsection');
    allSections.forEach(sec => sec.style.display = 'none');
    
    // Show selected section
    const selectedSection = document.getElementById(`${section}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Update filter buttons
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');
}

// Product details modal
function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const detailsContainer = document.getElementById('productDetails');
    
    // Handle image display
    let imageContent;
    if (product.image.startsWith('http')) {
        imageContent = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        imageContent = product.image;
    }
    
    detailsContainer.innerHTML = `
        <div class="product-detail-header">
            <div class="product-detail-image">${imageContent}</div>
            <div class="product-detail-name">${product.name}</div>
            <div class="product-detail-price">S/. ${product.price}</div>
        </div>
        <div class="product-detail-description">${product.description}</div>
        <div class="product-detail-actions">
            <button class="btn-add-to-cart" onclick="addToCart('${product.id}'); closeProductModal();">
                Agregar al Carrito
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Shopping cart functions
function addToCart(productId) {
    const product = findProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    
    // Show confirmation
    showCartConfirmation(product.name);
}

function findProductById(id) {
    for (const category in products) {
        const product = products[category].find(p => p.id === id);
        if (product) return product;
    }
    return null;
}

function showCartConfirmation(productName) {
    // Simple confirmation - you can enhance this
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2d5a27;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `"${productName}" agregado al carrito`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal if open
    updateCartModal();
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Handle image display
        let imageContent;
        if (item.image.startsWith('http')) {
            imageContent = `<img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">`;
        } else {
            imageContent = `<span style="font-size: 1.5em;">${item.image}</span>`;
        }
        
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                ${imageContent}
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">S/. ${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span style="margin: 0 10px; font-weight: bold;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">Eliminar</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToStorage();
}

function clearCart() {
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        updateCartModal();
    }
}

function saveCartToStorage() {
    localStorage.setItem("naturalUrologyCart", JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem("naturalUrologyCart");
    if (saved) {
        cart = JSON.parse(saved);
        updateCartDisplay();
    }
}

// Payment functions
function showPaymentOptions() {
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('paymentModal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function showPaymentDetails(method) {
    const detailsContainer = document.getElementById('paymentDetails');
    let details = '';
    
    switch(method) {
        case 'bcp':
            details = `
                <h4>Transferencia BCP</h4>
                <p><strong>Banco:</strong> BCP</p>
                <p><strong>Número de Cuenta:</strong> 191-123456789-0-00</p>
                <p><strong>CCI:</strong> 002-191-123456789000-00</p>
                <p><strong>Titular:</strong> Natural Center of Urology</p>
                <p>Envía tu comprobante de pago vía WhatsApp: +51 934 347 417</p>
            `;
            break;
        case 'interbancaria':
            details = `
                <h4>Transferencia Interbancaria</h4>
                <p><strong>CCI:</strong> 002-191-123456789000-00</p>
                <p><strong>Titular:</strong> Natural Center of Urology</p>
                <p>Envía tu comprobante de pago vía WhatsApp: +51 934 347 417</p>
            `;
            break;
        case 'yape':
            details = `
                <h4>Pago con Yape</h4>
                <p><strong>Número:</strong> +51 934 347 417</p>
                <p><strong>Nombre:</strong> Natural Center</p>
                <p>Envía captura del pago vía WhatsApp al mismo número</p>
            `;
            break;
    }
    
    detailsContainer.innerHTML = details;
    detailsContainer.classList.add('active');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const paymentModal = document.getElementById('paymentModal');
    const productModal = document.getElementById('productModal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
}

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
