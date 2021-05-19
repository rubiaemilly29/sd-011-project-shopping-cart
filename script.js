// get endPoint
const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// 
const cartItemClickListener = () => {
console.log('Remove o item do carrinho');
};

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
const fetchItem = (param) => fetch(`https://api.mercadolibre.com/items/${param}`)
    .then((response) => response.json())
    .then((product) => product);
    
const getItemInfo = (productInfo) => ({
  id: productInfo.id,
  title: productInfo.title,
  salePrice: productInfo.price,
});

const createCartItemElement = ({ id: sku, title: name, price: salePrice }, funct) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', funct);
  return li;
};

const putItemAfterButtonClick = () => {
  const findGreenButtons = document.querySelector('.item__add');
  findGreenButtons.addEventListener('click', () => {
    createCartItemElement(getItemInfo);
  });
};

// getItemInfo(product);
// When the button is listened, the id is get and send to a second API address
const productButtonsListener = () => {
  const addProductButtons = document.querySelectorAll('.item__add');
  addProductButtons.forEach((_, index) => {
    addProductButtons[index].addEventListener('click', () => {
      const getSku = document.querySelectorAll('.item__sku');
      const sku = getSku[index].innerText;
      // !Only a test that can be removed
      console.log(`https://api.mercadolibre.com/items/${sku}`);
      getItemInfo(fetchItem(sku)
        .then((objectItem) => createCartItemElement(objectItem, cartItemClickListener)));
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
    .then(() => productButtonsListener());
};

window.onload = () => {
  fetchPCList();
};

const getSkuFromProductItem = () => console.log('oi');
getSkuFromProductItem();
