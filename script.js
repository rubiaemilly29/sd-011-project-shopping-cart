function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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
const linterChorao = '.cart__items';
function saveItemOnStorage() {
  const saveItem = document.querySelector(linterChorao);
    localStorage.setItem('saveItem', saveItem.innerHTML);
  }

  function getItemSaved() {
    const getSaved = localStorage.getItem('saveItem');
    document.querySelector(linterChorao).innerHTML = getSaved;
  }

function searchItem(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((json) => {
      const object = {
        sku: json.id,
        name: json.title,
        salePrice: json.price,
      };
      const li = createCartItemElement(object);
      document.querySelector(linterChorao).appendChild(li);
  saveItemOnStorage();
  });
}

// console.log(getPrice())
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

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    searchItem(sku);
  });
  section.appendChild(button);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function searchProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((item) => {
        const protctItem = createProductItemElement({
          sku: item.id, 
          name: item.title,
          image: item.thumbnail,
        });
        document.querySelector('.items').appendChild(protctItem);
      });
    });
}

window.onload = function onload() { 
  searchProducts();
  getItemSaved();
};
