// get endPoint
const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// create the product image and sent it to create element 
const createProductImageElement = (imageSource) => {
  const imgFeature = document.createElement('img');
  imgFeature.className = 'item__image';
  imgFeature.src = imageSource;
  return imgFeature;
};

// shortCut to creat an element and aply a class and an information
const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

// create an element using de shortcut to make it automated
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

// Get info from de second API
// !important for the second required
const fetchItem = (param) => {
  fetch(`https://api.mercadolibre.com/items/${param}`)
    .then((response) => response.json())
    .then((product) => {
      // eslint-disable-next-line no-use-before-define
      getItemInfo(product);
    });
};

// When the button is listened, the id is get and send to a second API
const cartItemClickListener = (func) => {
  const cartItemClick = document.querySelectorAll('.item__add');
  cartItemClick.forEach((_, index) => {
    cartItemClick[index].addEventListener('click', () => {
      const getSku = document.querySelectorAll('.item__sku');
      const nome = getSku[index].innerText;
      console.log(`https://api.mercadolibre.com/items/${nome}`);
      // eslint-disable-next-line sonarjs/no-extra-arguments
      fetchItem(nome, func);
    });
  });
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }, funct) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', funct);
  return li;
};

function getItemInfo(object) {
  const itemInfo = {
    id: object.id,
    title: object.title,
    salePrice: object.price,
  };
  createCartItemElement(itemInfo, cartItemClickListener);
}

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
    })
    .then(() => cartItemClickListener());
};

window.onload = () => {
  fetchPCList();
};

const getSkuFromProductItem = () => console.log('oi');
getSkuFromProductItem();
