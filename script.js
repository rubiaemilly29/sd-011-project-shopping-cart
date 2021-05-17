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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  const items = document.querySelector('.items');
  items.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const totalPrice = () => {
  const prices = document.querySelector('.total-price');
  const itemGeral = document.querySelectorAll('.cart__item');
  const iLi = [...itemGeral];
  const sumPrice = iLi.reduce((acc, curr) => acc + Number(curr.innerText.split('PRICE: $')[1]), 0);
  prices.innerText = sumPrice;
};

function cartItemClickListener(event, count) {
  localStorage.removeItem(`item ${count}`);
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, count) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, count));
  return li;
}

const addItemsCart = () => {
  const getBtn = document.querySelectorAll('.item__add');
  const getList = document.querySelector('ol.cart__items');
  
  getBtn.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((res) => res.json())
      .then((data) => getList.appendChild(createCartItemElement(data)))
      .then(() => totalPrice());
      const count = getList.childElementCount;
      localStorage.setItem(`item ${count}`, id);
    });
  });
};

const removeAll = () => {
  const btnRm = document.querySelector('.empty-cart');
  btnRm.addEventListener('click', () => {
    const prices = document.querySelector('.total-price');
    const itemsDone = document.querySelector('.cart__items');
    itemsDone.innerHTML = '';
    prices.innerHTML = 0;
    prices.innerText = '';
    localStorage.clear();
  });
};

const myApiPricipal = async () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((res) => res.json())
  .then((data) => data.results.forEach((product) => createProductItemElement(product)))
  .then(() => addItemsCart())
  .then(() => {
    const cart = document.querySelector('.cart__items');
    for (let i = 0; i < localStorage.length; i += 1) {
      const getStorege = localStorage.getItem(`item ${i}`);
      fetch(`https://api.mercadolibre.com/items/${getStorege}`)
      .then((res) => res.json())
      .then((data) => cart.appendChild(createCartItemElement(data, i)));
    }
  })
  .catch((error) => console.log(error));
};

const loading = async () => {
  const get = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  await get.json();
  document.querySelector('.loading').remove();
};

window.onload = function onload() {
  removeAll();
  loading();
  myApiPricipal();
};