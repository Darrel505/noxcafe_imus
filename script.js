const pages = {
  home: 'home',
  menu: 'menu-page',
  cat: 'cat-page',
  billiards: 'billiards-page',
  about: 'about-page',
  confirm: 'confirm-page'
};

let cart = [];

const menuData = {
  coffee: [
    { n: 'Espresso', p: 120 },
    { n: 'Americano', p: 130 },
    { n: 'Cappuccino', p: 150 },
    { n: 'Latte', p: 150 },
    { n: 'Mocha', p: 160 },
    { n: 'Caramel Macchiato', p: 170 }
  ],
  noncoffee: [
    { n: 'Matcha Latte', p: 160 },
    { n: 'Chocolate', p: 140 },
    { n: 'Strawberry Milk', p: 130 },
    { n: 'Lemon Tea', p: 120 }
  ],
  pasta: [
    { n: 'Carbonara', p: 220 },
    { n: 'Aglio e Olio', p: 200 },
    { n: 'Bolognese', p: 230 }
  ],
  snacks: [
    { n: 'Cheesecake', p: 150 },
    { n: 'Brownies', p: 120 },
    { n: 'Cookies', p: 100 }
  ]
};

const catLabels = { coffee: 'Coffee', noncoffee: 'Non-Coffee', pasta: 'Pasta', snacks: 'Snacks' };

function goTo(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.getElementById(pages[p]).classList.add('active');
  window.scrollTo(0, 0);
}

function buildMenuGrids() {
  Object.entries(menuData).forEach(([cat, items]) => {
    const g = document.getElementById(cat + '-grid');
    if (!g) return;
    g.innerHTML = items.map(item => `
      <div class="menu-item-card">
        <div>
          <div class="item-name">${item.n}</div>
          <div class="item-price">${item.p}</div>
        </div>
        <button class="add-btn" onclick="addToCart('${catLabels[cat]}','${item.n}',${item.p})">Add +</button>
      </div>`).join('');
  });
}

function addToCart(cat, name, price) {
  const ex = cart.find(c => c.n === name && c.cat === cat);
  if (ex) { ex.qty++; } else { cart.push({ cat, n: name, p: price, qty: 1 }); }
  updateCartBtn();
}

function updateCartBtn() {
  document.getElementById('cart-btn-text').textContent = '🛒 Cart (' + cart.length + ')';
}

function getCartTotal() {
  return cart.reduce((s, c) => s + c.p * c.qty, 0);
}

function openCart() {
  const modal = document.getElementById('cart-modal');
  const list = document.getElementById('cart-items-list');
  const footer = document.getElementById('cart-footer');
  modal.style.display = 'flex';
  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-cart">Your cart is empty. Add some items!</p>';
    footer.style.display = 'none';
  } else {
    list.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.n}</h4>
          <p class="cart-item-cat">${item.cat}</p>
          <p class="cart-item-price">${item.p} &times; ${item.qty}</p>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${i},-1)">&#8722;</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
          <button class="del-btn" onclick="removeItem(${i})">🗑️</button>
        </div>
      </div>`).join('');
    const total = getCartTotal();
    document.getElementById('cart-total-amt').textContent = total;
    footer.style.display = 'block';
  }
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  updateCartBtn();
  openCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  updateCartBtn();
  openCart();
}

function closeCart() {
  document.getElementById('cart-modal').style.display = 'none';
}

function placeOrder() {
  const total = getCartTotal();
  const orderNum = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('conf-order-num').textContent = orderNum;
  document.getElementById('conf-total').textContent = total;
  const ci = document.getElementById('conf-items');
  ci.innerHTML = cart.map(c => `
    <div class="summary-item">
      <span>${c.n} <span style="color:rgba(255,255,255,0.45);font-size:0.85rem">&times; ${c.qty}</span></span>
      <span>${c.p * c.qty}</span>
    </div>`).join('');
  cart = [];
  updateCartBtn();
  closeCart();
  goTo('confirm');
}

buildMenuGrids();
