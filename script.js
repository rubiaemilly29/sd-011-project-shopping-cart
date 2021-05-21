window.onload = function onload() { };

// inicio

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const itemsCart = document.querySelector('.cart__items');
  itemsCart.appendChild(li);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    createCartItemElement({ sku, name, salePrice });
  });

  return section;
}

 // Feito em sala com Nikolas,Alberto e outros rsrs
function getProducts(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const element = createProductItemElement({
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
        salePrice: item.price,
      });
      document.querySelector('.items').appendChild(element);
    });
  });
}

window.onload = function onload() {
  getProducts('computador');
};

// utilizar na função fetch e passar como segundo parametro da api
// const myHeaders = { method: 'GET',
// headers: 'application/json',
// cache: 'default' }; 
