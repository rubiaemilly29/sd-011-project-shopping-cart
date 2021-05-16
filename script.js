async function totalMath(value, operator = '+') {
  const total = document.querySelector('.total-price');
  if (!value) {
    total.innerText = 'Preço Total: $0';
    return true;
  }

  let price = total.innerHTML.match(/\d+/)[0];
  price = parseFloat(price);

  if (operator === '+') {
    price += value;
  } else if (operator === '-') {
    price -= value;
  }

  const valueTotal = total.innerText
  .replace(/[\d.]+/, price.toFixed(2));
  total.innerText = valueTotal;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', () => {
    if (Object.keys(localStorage).length >= 2) {
      totalMath(salePrice, '-');
    } else {
      totalMath();
    }
    localStorage.removeItem(sku);
    li.remove();
  });
  return li;
}

function loading(bool = true) {
  // <marquee class="loading">Loading...</marquee>
  if (bool) {
    const element = document.querySelector('.cart');
    const loadingElement = document.createElement('marquee');
    loadingElement.innerText = 'Loading...';
    loadingElement.className = 'loading';
    element.insertBefore(loadingElement, element.firstChild);
  } else {
    const loadingElement = document.querySelector('.loading');
    loadingElement.remove();
  }
}

function getJSON(url, data = {}) {
  loading();
  return fetch(url, data)
  .then((response) => {
    loading(false);
    return response.json();
  });
}

async function addCart(sku) {
  const element = document.querySelector('.cart__items');
  const item = await getJSON(`https://api.mercadolibre.com/items/${sku}`);
  const product = { sku: item.id, name: item.title, salePrice: item.price };
  const section = createCartItemElement(product);

  totalMath(item.price);
  element.appendChild(section);
}

function createProductItemElement({ sku, name, image }) {
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  button.addEventListener('click', () => {
    if (!localStorage[sku]) {
      localStorage[sku] = sku;
      addCart(sku);
    } else {
      alert('Item já foi definido');
    }
  });
  section.appendChild(button);

  return section;
}

function loadCart() {
  Object.keys(localStorage).forEach((key) => {
    addCart(key);
  });
}

async function addItems(query) {
  const element = document.querySelector('.items');
  const { results } = await getJSON(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  results.forEach((result) => {
    const product = { sku: result.id, name: result.title, image: result.thumbnail };
    const section = createProductItemElement(product);
    element.appendChild(section);
  });
}

window.onload = function onload() {
  addItems('computador');
  loadCart();

  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    localStorage.clear();
    document.querySelectorAll('li').forEach((li) => {
      li.remove();
    });
    totalMath();
  });
};
