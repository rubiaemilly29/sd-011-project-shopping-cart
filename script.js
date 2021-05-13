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

const getItem = async (index) => {
  const param = { headers: { Accept: 'application/json' } };
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador', param)
    .then((response) => {
      response.json()
        .then((json) => {
          const { id: sku, title: name, thumbnail: image } = json.results[index];
          return createProductItemElement({ sku, name, image });
        });
    });
};

const pageLayout = async () => {
  const element = document.querySelector('#items');
  // for (let index = 0; index < 6; index += 1) {
  // }
  const item = await getItem(0);
  element.appendChild(item);
};

window.onload = function onload() {
  pageLayout();
 };
