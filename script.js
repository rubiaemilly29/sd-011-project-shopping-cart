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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function accessOrderedListSection() {
  return document.querySelector('.cart__items');
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function sumPriceOnList(productPrice) {
  let totalPriceSection = document.querySelector('.total-price');
  if (!totalPriceSection) {
    totalPriceSection = document.createElement('section');
    totalPriceSection.className = 'total-price';
    totalPriceSection.dataset.price = 0;
    const cartSection = document.querySelector('.cart');
    cartSection.appendChild(totalPriceSection);
  } 
  let totalPrice = Number(totalPriceSection.dataset.price);
  totalPrice += Number(productPrice);
  totalPrice = Math.round(totalPrice * 100) / 100;
  console.log(totalPrice);
  totalPriceSection.innerText = totalPrice;
  totalPriceSection.dataset.price = totalPrice;
}

function updateItemsFromLocalStorage() {
  const cartItems = Array.from(document.querySelectorAll('.cart__item'));
  const productsDetails = cartItems.map((product) => product.dataset);
  window.localStorage.setItem('cartItems', JSON.stringify(productsDetails));
}

const cartRemoveItemClickListener = (event) => {
  const orderedListFromCart = accessOrderedListSection();
  orderedListFromCart.removeChild(event.target);
  console.log(event.target);
  const price = Number(event.target.dataset.price);
  sumPriceOnList(-price);
  updateItemsFromLocalStorage();
};

function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  li.dataset.sku = sku;
  li.dataset.name = name;
  li.dataset.price = price;
  li.addEventListener('click', cartRemoveItemClickListener);
  return li;
}

const getAPIList = () => new Promise((resolve, reject) => {
    const param = { method: 'GET', headers: { Accept: 'application/json' } };
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', param)
      .then((response) => response.json())
      .then((json) => resolve(json.results))
      .catch((err) => reject(err));
});

function emptyCartList() {
  const cartList = accessOrderedListSection();
  const totalPrice = document.querySelector('.total-price');
  while (cartList.firstChild) {
    cartList.removeChild(cartList.lastChild);
  }
  totalPrice.innerHTML = '';
  totalPrice.dataset.price = 0;
  updateItemsFromLocalStorage();
}

function activateEmptyCart() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCartList);
}

function getItemDetails(id) {
  return new Promise((resolve, reject) => {
    const itemIdApi = `https://api.mercadolibre.com/items/${id}`;
    const param = { method: 'GET', headers: { Accept: 'application/json' } };
    fetch(itemIdApi, param)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}

function createItemOnCart(productId) {
  const itemElement = createCartItemElement(productId);
  const cartOrderedListElement = accessOrderedListSection();
  cartOrderedListElement.appendChild(itemElement);
  sumPriceOnList(productId.price);
}

function updateCartFromLocalStorage() {
  const cartItems = window.localStorage.getItem('cartItems');
  if (!cartItems) return;
  JSON.parse(cartItems).forEach((item) => createItemOnCart(item));
}

function putItemOnList(event) {
  const skuElement = event.target.parentElement.querySelector('.item__sku');
  getItemDetails(skuElement.innerText)
    .then((product) => {
      const productId = {
        sku: product.id,
        name: product.title,
        price: product.price,
      };
      createItemOnCart(productId);
      updateItemsFromLocalStorage();
    })
    .catch((err) => console.error(err));
}

async function populateList() {
  await getAPIList()
    .then((list) => {
      const productContainer = document.querySelector('.items');
      list.forEach((product) => {
        const productDetails = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        const productElement = createProductItemElement(productDetails);
        productContainer.appendChild(productElement);
      });
      const addItemToCartButtons = document.querySelectorAll('.item__add');
      addItemToCartButtons.forEach((button) => {
        button.addEventListener('click', putItemOnList);
      });
      updateCartFromLocalStorage();
    });
}

function removeLoadingScreen() {
  const bodyHTML = document.querySelector('body');
  bodyHTML.removeChild(bodyHTML.lastChild);
}

function showLoadingScreen() {
  const loadingSection = document.createElement('section');
  const bodyHTML = document.querySelector('body');
  // const loadingImage = document.createElement('img');
  // loadingImage.src = 
  // loadingSection.appendChild(loadingImage);
  loadingSection.className = 'loading';
  loadingSection.innerHTML = 'Loading';
  bodyHTML.appendChild(loadingSection);  
  setTimeout(() => {
  removeLoadingScreen();
  }, 1500);
}

window.onload = async function () {
  try {
    await showLoadingScreen();
    await populateList();
    await activateEmptyCart();
  } catch (err) {
    console.error(err);
  }
};
