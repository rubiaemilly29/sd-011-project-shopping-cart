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

function cartItemClickListener(event, cartItems, count) {
  // coloque seu código aqui
  cartItems.removeChild(event.target);
  localStorage.removeItem(`Items${count}`);
}

function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);
  localStorage.setItem(`Items${cartItems.childElementCount}`, `${sku},${name},${salePrice}`);
  const count = cartItems.childElementCount;
  li.addEventListener('click', (e) => cartItemClickListener(e, cartItems, count));
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  const items = document.querySelector('.items');
  items.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const promiseProducts = () => new Promise((accept) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((myFetch) => myFetch.json())
    .then((elements) => elements.results.map((element) => createProductItemElement(element)))
    .then(() => {
      for (let index = 1; index <= localStorage.length; index += 1) {
        let objLocalStorage = {};
        const [sku, name, price] = localStorage.getItem(`Items${index}`).split(',');
        objLocalStorage = { sku, name, price };
        createCartItemElement(objLocalStorage);
      }
    });
    accept();
});

const myPromise = async () => {
  try {
    await promiseProducts();
  } catch (error) {
    console.log('ERROR!!');
  }
};

window.onload = function onload() {
  myPromise();
};