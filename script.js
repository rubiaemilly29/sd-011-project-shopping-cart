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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function exercise2() {
  const getButtons = document.querySelectorAll('.item__add');
  getButtons.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const parent = event.target.parentNode;
      const id = parent.querySelector('.item__sku').innerText;
      const response2 = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const json2 = await response2.json();
      const productCart = {
        sku: json2.id,
        name: json2.title,
        salePrice: json2.price,
      };
      const itemCart = createCartItemElement(productCart);
      const getCart = document.querySelector('ol.cart__items');
      getCart.appendChild(itemCart);
    });
  });
}

async function exercise1() {
  const term = 'computador';
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`);
  const json = await response.json();
  const productsContainer = document.querySelector('.items');
  json.results.forEach((product) => {
    const products = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    const productCreated = createProductItemElement(products);
    productsContainer.appendChild(productCreated);
  });
  exercise2();
}

window.onload = function onload() { 
  exercise1();
};