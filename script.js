const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const createProductImageElement = (imageSource) => {
  const imgFeature = document.createElement('img');
  imgFeature.className = 'item__image';
  imgFeature.src = imageSource;
  return imgFeature;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  const sectionOfItems = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  sectionOfItems.appendChild(section);
  return sectionOfItems;
};

const getProductInfo = (object) => (object.results.forEach((info) => {
    const objectInfo = {
      id: info.id,
      title: info.title,
      thumbnail: info.thumbnail,
    };
    createProductItemElement(objectInfo);
  }));

const fetchPCList = () => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(endPoint, myObject)
    .then((response) => response.json())
    .then((object) => {
      getProductInfo(object);
    });
};

window.onload = () => {
  fetchPCList();
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  // coloque seu código aqui
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};