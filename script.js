// ############################### Funções Fornecidas #####################
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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// ############################### Fim das Funções Fornecidas #####################

async function getProductList(url) {
  const productList = await fetch(url)
  .then((result) => result.json())
  .then((result) => (result.results));
  return productList;
}

async function createItemSection() {
  const itemsSection = document.querySelector('.items');
  const productsList = (
    await getProductList('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  );
  productsList.forEach((object) => {
    const productResume = {
      id: object.id,
      name: object.title,
      image: object.thumbnail,
    };
    itemsSection.appendChild(createProductItemElement(productResume));
  });
}

window.onload = function onload() {
  createItemSection();
};
