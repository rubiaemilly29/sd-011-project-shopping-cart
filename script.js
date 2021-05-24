function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(tagName, className, innerText) {
  const e = document.createElement(tagName);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// _________

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  
  li.addEventListener('click', () => {
    li.remove();
  });

  li.appendChild(createCustomElement('span', 'cart__price', salePrice));

  return li;
}

function addItemToCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((res) => res.json())
    .then((product) => {
      const li = createCartItemElement({
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      });

      document.querySelector('.cart__items').appendChild(li);
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);

  button.addEventListener('click', () => {
    addItemToCart(sku);
  });

  return section;
}

// _________

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// _________

// _________

const getInfoApi = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((searchResult) => searchResult.results.map((product) => ({
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      })));

const itemListElement = document.querySelector('.items');

getInfoApi().then((productList) => {
  productList.forEach((product) => {
    const element = createProductItemElement(product);
    itemListElement.appendChild(element);
  });
});
