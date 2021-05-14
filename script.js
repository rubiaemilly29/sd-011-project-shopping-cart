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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function verifiedFetch(url) {
  return new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
        .then((result) => result.json())
        .then((json) => resolve(json.results.forEach((result) => {
          const itemAtributtes = {
            sku: result.id,
            name: result.title,
            image: result.thumbnail,
          };
          const newItem = createProductItemElement(itemAtributtes);
          const itemsSection = document.querySelector('.items');
          itemsSection.appendChild(newItem);
          console.log(result);
        })));
    }
    reject(new Error('endpoint não existe'));
  });
}

window.onload = function onload() {
  verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }