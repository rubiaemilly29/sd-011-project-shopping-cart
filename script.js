const cartItens = document.querySelector('.cart__items');
let cartSave = [];
const priceTotal = document.getElementById('price');
let totalPrice = 0;
const cartEMptyButton = document.querySelector('.empty-cart');

function generateCartSavedItem(array) {
  const itemData = [];
  array.split(' | ').forEach((data) => {
    if (data.split(': ')[1].includes('$')) {
      itemData.push(data.split(': ')[1].replace('$', ''));
    } else {
      itemData.push(data.split(': ')[1]);
    }
  });

  const [itemSku, itemName, itemSalePrice] = itemData;
  return {
    itemSku,
    itemName,
    itemSalePrice,
  };
}

const saveCart = () => {
  const cartItem = [...document.getElementsByClassName('cart__item')];
  cartSave = [];
  cartItem.forEach((item, index) => {
    cartSave[index] = generateCartSavedItem((item.innerHTML));
  });
  localStorage.cartItensSave = (JSON.stringify(cartSave));
  localStorage.setItem('totalPrice', totalPrice);
};

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    const item = event.target;
    const price = item.innerText.split('PRICE: $')[1];
    priceTotal.innerText = `${totalPrice -= price}`;
    item.parentNode.removeChild(item);
    saveCart();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const reloadCart = () => {
  if (localStorage.cartItensSave) {
    const cart = JSON.parse(localStorage.cartItensSave);
    [...cart].forEach((item) => {
      const sku = item.itemSku;
      const name = item.itemName;
      const salePrice = item.itemSalePrice;
      const productCart = createCartItemElement({ sku, name, salePrice });
      cartItens.appendChild(productCart);
    });
  }
  priceTotal.innerText = `${localStorage.totalPrice}`;
};

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

cartEMptyButton.addEventListener('click', () => {
  if (cartItens.childNodes.length > 0) {
    for (; cartItens.childNodes.length > 0;) {
      cartItens.removeChild(cartItens.childNodes[0]);
    }
    priceTotal.innerText = `${totalPrice = 0}`;
  }
});

const productAddToCart = () => {
  document.querySelector('.container').addEventListener(('click'), (event) => {
  const id = event.target;
  if (event.target.className === 'item__add') {
    fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(id.parentNode)}`)
      .then((response) => response.json())
        .then((response) => {
          const sku = response.id;
          const name = response.title;
          const salePrice = response.price;
          const productCart = createCartItemElement({ sku, name, salePrice });
          totalPrice += salePrice;
          priceTotal.innerText = `${totalPrice}`;
          cartItens.appendChild(productCart);
        })
          .then(saveCart);
      }
  });
};

const createProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
      .then((response) => response.results)
        .then((response) => {
          const loading = document.querySelector('.loading');
            document.querySelector('.items').removeChild(loading);
          response.forEach((dado) => {
            const sku = dado.id;
            const name = dado.title;
            const image = dado.thumbnail;
            const product = createProductItemElement({ sku, name, image });
            document.querySelector('.items').appendChild(product);
          });
        })
          .then(productAddToCart);
};

window.onload = function onload() { 
  createProduct();
  reloadCart();
};
