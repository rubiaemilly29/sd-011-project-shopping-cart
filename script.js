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

const getItemInfo = (object) => {
  const itemInfo = {
    id: object.id,
    title: object.title,
    salePrice: object.price,
  };
  createCartItemElement(itemInfo);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const fetchItem = (param) => {
  fetch(`https://api.mercadolibre.com/items/${param}`)
    .then((response) => response.json())
    .then((product) => {
      getItemInfo(product);
    });
};

const cartItemClickListener = () => {
  const cartItemClick = document.querySelectorAll('.item__add');
  console.log(cartItemClick);
  cartItemClick.forEach((_, index) => {
    cartItemClick[index].addEventListener('click', () => {
      const getSku = document.querySelectorAll('.item__sku');
      const nome = getSku[index].innerText;
      console.log(`https://api.mercadolibre.com/items/${nome}`);
      fetchItem(nome);
    });
  });
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
    })
    .then(() => cartItemClickListener());
};

window.onload = () => {
  fetchPCList();
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;
