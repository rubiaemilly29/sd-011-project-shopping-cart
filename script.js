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
}
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
.then((jsonBody) => {
  const productContainer = document.querySelector('.items');
  jsonBody.results.forEach((product) => {
    const productDetails = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail };
    const productElement = createProductItemElement(productDetails);
    productContainer.appendChild(productElement);
  });
});

const buttonAddCart = document.querySelector('.item_add');
buttonAddCart.addEventListener('click', () => {
  const itemId = document.querySelector('.item_skul');
fetch(`https://api.mercadolibre.com/items/${itemId}`)
.then((response) => response.json())
.then((jsonBody) => {
  console.log(jsonBody);   
  const productItenmDetals = {
    sku: jsonBody.id,
    name: jsonBody.title,
    salePrice: jsonBody.salePrice,
  };
  const productAddCart = createCartItemElement(productItenmDetals);
  buttonAddCart.appendChild(productAddCart);  
});
});

window.onload = function onload() { };
