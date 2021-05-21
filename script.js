// get endPoint
const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartItems = '.cart__items';

// clear cart
const emptyCart = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    localStorage.removeItem('info');
    const parentList = document.querySelector('.cart__items');
    const itemInList = document.querySelectorAll('.cart__item');
    return itemInList.forEach((item) => {
      parentList.removeChild(item);
    });
  });
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
  const loadingSpan = document.createElement('span');
  loadingSpan.className = 'loading';
  loadingSpan.innerText = 'loading...';
  section.appendChild(loadingSpan);
  const sectionOfItems = document.querySelector('.items');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  setTimeout(() => {
    section.removeChild(loadingSpan);
  }, 3000);
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

// remove the item selected form the car list
const cartItemClickListener = (event) => {
  event.target.remove();
  localStorage.removeItem('info');
};

const loadItemsFromLocalStorage = () => {
  const saved = localStorage.getItem('info');
  if (saved) {
    const list = document.querySelector(cartItems);
    list.innerHTML = saved;
    const listItems = document.querySelectorAll('.cart__item');
    listItems.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const list = document.querySelector(cartItems);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  list.appendChild(li);
  localStorage.setItem('info', list.innerHTML);
};

// When the button is listened, the id is get and send to a second API address
const productButtonsListener = () => {
  const addProductButtons = document.querySelectorAll('.item__add');
  return addProductButtons.forEach((_, index) => {
    addProductButtons[index].addEventListener('click', () => {
      const getSku = document.querySelectorAll('.item__sku');
      const sku = getSku[index].innerText;
      return getItemInfo(fetchItem(sku)
      .then((objectItem) => {
        const ObjectInfos = {
          id: objectItem.id,
          title: objectItem.title,
          price: objectItem.price,
        };
        createCartItemElement(ObjectInfos);
        getItemInfo(ObjectInfos);
      }));
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
  
const asyncListener = () => {
  productButtonsListener();
};

const findGreenButtons = document.querySelectorAll('.item__add');
findGreenButtons.forEach((_, index) => {
  findGreenButtons[index].addEventListener('click', () => {
    console.log('Clicaram em mim =D');
  });
});
  
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
  .then(() => {
    asyncListener();
  });
};

window.onload = () => {
  fetchPCList();
  loadItemsFromLocalStorage();
  emptyCart();
};

const getSkuFromProductItem = () => console.log('oi');
getSkuFromProductItem();
