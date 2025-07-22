const products = [
  { id: 1, name: "SHUDIDHAR", price: 999, img: "1.jpg", category: "Kurtas" },
  { id: 2, name: "MODERN KURTA", price: 499, img: "2.jpg", category: "Kurtas" },
  { id: 3, name: "FULL GOWN", price: 699, img: "3.jpg", category: "Gowns" },
  { id: 4, name: "TRENDY TOP AND SKIRT", price: 1299, img: "4.jpg", category: "Tops & Skirts" },
  { id: 5, name: "FASHION KURTA", price: 599, img: "5.jpg", category: "Kurtas" },
  { id: 6, name: "KURTA MODEL", price: 21999, img: "6.jpg", category: "Kurtas" }
];

let cart = [];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");

// Show products
function showProducts(filtered = products) {
  productList.innerHTML = "";
  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}
showProducts();

// Search + Category Filter
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter(p =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(query)
  );

  showProducts(filtered);
}

// Add to Cart
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCartCount();
  alert("✅ Product added to cart!");
}

// Cart Count
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.innerText = total;
}

// Show Cart Modal
function showCart() {
  document.getElementById("cart-modal").classList.remove("hidden");
  displayCart();
}

// Render Cart Items
function displayCart() {
  cartItems.innerHTML = "";

  cart.forEach((p, index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <img src="${p.img}" width="50">
      ${p.name} - ₹${p.price} 
      <button onclick="decreaseQty(${p.id})">➖</button>
      ${p.qty}
      <button onclick="increaseQty(${p.id})">➕</button>
      = ₹${p.price * p.qty}
      <button style="color:red; margin-left:10px;" onclick="removeItem(${p.id})">❌</button>
    `;
    cartItems.appendChild(item);
  });

  updateCartTotal(); // update total inside modal
}

// Update Total Price
function updateCartTotal() {
  const total = cart.reduce((sum, product) => sum + product.price * product.qty, 0);
  document.getElementById("total-price").textContent = `${total.toFixed(2)}`;
}

// Quantity Control
function increaseQty(id) {
  const item = cart.find(p => p.id === id);
  if (item) item.qty += 1;
  updateCartCount();
  displayCart();
}

function decreaseQty(id) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter(p => p.id !== id);
    }
  }
  updateCartCount();
  displayCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  updateCartCount();
  displayCart();
}

// Checkout Flow
function openCheckout() {
  closeCart();
  document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

function closeSuccess() {
  document.getElementById("success-modal").classList.add("hidden");
}

// Auto fill address
function autoFillCityState() {
  const pin = document.getElementById("pincode").value;
  if (pin === "600001") {
    document.getElementById("city").value = "Chennai";
    document.getElementById("state").value = "Tamil Nadu";
  } else if (pin === "110001") {
    document.getElementById("city").value = "New Delhi";
    document.getElementById("state").value = "Delhi";
  }
}

// Submit Order
document.getElementById("order-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const door = document.getElementById("door").value;
  const street = document.getElementById("street").value;
  const pincode = document.getElementById("pincode").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;

  const order = {
  name,
  phone,
  door,
  street,
  pincode,
  city,
  state,
  items: cart.map(c => `${c.name} x${c.qty} = ₹${c.price * c.qty}`).join(", "),
  status: "Pending" // 👈 added status
};


  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  document.getElementById("checkout-modal").classList.add("hidden");
  document.getElementById("success-modal").classList.remove("hidden");
  document.getElementById("success-msg").innerText = `Thanks ${name}, your order is confirmed!`;

  cart = [];
  updateCartCount();
});
