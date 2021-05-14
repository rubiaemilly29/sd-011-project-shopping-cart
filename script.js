const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchPCList = () => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' }
  };

  fetch(API_URL, myObject)
    .then(response => response.json())
    .then(data => {
      for (const itemsInfo of data.results) {
        const objectTest = {
          sku: itemsInfo.id,
          name: itemsInfo.title,
          image: createProductImageElement('https://cdn.britannica.com/84/206384-131-207CC735/Javan-gliding-tree-frog.jpg'),
        };
        console.log(itemsInfo.id);
        console.log(itemsInfo.title);
        console.log(itemsInfo);
        console.log(createProductItemElement(objectTest));
      }
    })
}

window.onload = function onload() { 
  fetchPCList();
};

function createProductImageElement(imageSource) {
  let img = document.createElement('img');
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