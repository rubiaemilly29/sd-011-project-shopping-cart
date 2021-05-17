async function calculeTotal() {
  return Object.keys(localStorage)
  .reduce((num, key) => num + parseFloat(localStorage[key]), 0);
}

async function totalSend() {
  const result = (await calculeTotal()).toFixed(2);
  const total = document.querySelector('.total-price');
  const value = total.innerText.replace(/[\d.]+$/, result);
  total.innerText = value;
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
  li.onclick = () => {
    localStorage.removeItem(sku);
    li.remove();
    totalSend();
  };
  return li;
}

function loading(bool = true) {
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

  localStorage[sku] = item.price;
  element.appendChild(section);
  totalSend();
}

function createProductItemElement({ sku, name, image }) {
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  button.onclick = () => {
    if (!localStorage[sku]) {
      addCart(sku);
    } else {
      alert('Esse item já foi adicionado!');
    }
  };
  section.appendChild(button);

  return section;
}

async function loadCart() {
  const { results } = await getJSON('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const element = document.querySelector('.cart__items');
  Object.keys(localStorage).forEach((id) => {
    results.forEach((result) => {
      if (result.id === id) {
        const product = { sku: result.id, name: result.title, salePrice: result.price };
        const section = createCartItemElement(product);
        element.appendChild(section);
      }
    });
  });
  totalSend();
}

async function addItems(query) {
  const element = document.querySelector('.items');
  const { results } = await getJSON(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  results.forEach((result) => {
    const product = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const section = createProductItemElement(product);
    element.appendChild(section);
  });
}

window.onload = () => {
  addItems('computador');
  loadCart();

  const clearButton = document.querySelector('.empty-cart');
  clearButton.onclick = () => {
    localStorage.clear();
    document.querySelectorAll('li').forEach((li) => {
      li.remove();
    });
    totalSend();
  };
};
