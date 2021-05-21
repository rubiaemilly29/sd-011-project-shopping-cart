// 1 - Crie uma listagem de produtos.
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function findProducts(key = 'computador') {
  const queryCompute = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${key}`);
  const json = await queryCompute.json();
  return json.results;
}

function cartItemClickListener() {
  // coloque seu código aqui.
  findProducts('o segredo').then((products) => {
    products.forEach((product) => {
      const div = document.querySelector('.items');
      div.appendChild(createProductItemElement(product));
    });
  });
}

window.onload = function onload() { 
  cartItemClickListener();
};

// 2 - Adicione o produto ao carrinho de compras

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function createCartItemElement(element) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${element.id} | NAME: ${element.title} | PRICE: $${element.price}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
