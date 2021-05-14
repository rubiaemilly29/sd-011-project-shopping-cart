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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const loadApi = (search = 'computador') =>
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${search}`)
  .then((response) => response.json()
    .then((object) => {
      object.results.forEach((elem) => {
        const intemSection = document.querySelector('.items');
        const creatCard = createProductItemElement(elem);
        intemSection.appendChild(creatCard);
      });
    }));

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const insertItem = document.querySelector('.cart__items');
  insertItem.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartApi = (ItemID) => fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((response) => {
    response.json()
      .then((object) => {
        const insertItem = document.querySelector('.cart__items');
        insertItem.appendChild(createCartItemElement(object));
        localStorage.setItem('Save', insertItem.innerHTML);
      });
  });

const loadEvents = () => {
  const intemSection = document.querySelector('.items');
  intemSection.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      addCartApi(event.path[1].children[0].innerText);
    }
  });
  const btnClear = document.querySelector('.empty-cart');
  const insertItem = document.querySelector('.cart__items');
  btnClear.addEventListener('click', () => {
    insertItem.innerHTML = '';
    localStorage.setItem('Save', insertItem.innerHTML);
  });
};

const loadCart = () => {
  const insertItem = document.querySelector('.cart__items');
  insertItem.innerHTML = localStorage.getItem('Save');
};

window.onload = function onload() {
  loadApi();
  loadEvents();
  loadCart();
};
