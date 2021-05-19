function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItens = document.querySelector('.cart__items');
  cartItens.appendChild(li);
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 1 - Você deve criar uma listagem de produtos que devem ser consultados através da API do Mercado Livre.
// const param = { method: 'GET' , headers: { Accept: 'application/json' } };
function getProductList(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const itemElement = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
          salePrice: item.price,
        });
        document.querySelector('.items').appendChild(itemElement);
      });
    });
}

window.onload = function onload() {
  getProductList('computador');
};