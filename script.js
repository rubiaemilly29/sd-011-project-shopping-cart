const cartItems = () => document.querySelector('.cart__items');
const emptyCart = () => document.querySelector('.empty-cart');

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

function sumItemsCart() {
  setTimeout(() => {
    const listItems = document.querySelectorAll('.cart__item');
    let valueShoppingCart = 0;
    listItems.forEach((items) => {
      const price = items.innerText.split('$');
      valueShoppingCart += parseFloat(price[1]);
    });
  document.querySelector('.total-price').innerText = valueShoppingCart;
  }, 500);
}

function cartItemClickListener(event) {
  cartItems().removeChild(event.target);
  sumItemsCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function setLocalStorage() {
  setTimeout(() => {
    const shoppingCartItems = cartItems().innerHTML;
    localStorage.setItem('cartItems', shoppingCartItems);
  }, 1000);
}

function recupereLocalStorage() {
  if (localStorage.cartItems) {
    cartItems().innerHTML = localStorage.cartItems;
  }
}

function requestItemsFromAPI(event) {
  const productId = event.target.parentNode.firstChild.innerText;
  
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/items/${productId}`)
      .then((result) => result.json())
      .then((json) => {
        const itemData = {
          sku: json.id,
          name: json.title,
          salePrice: json.price,
        };
        resolve(itemData);
      })
      .catch(() => reject(console.log('Error! Product not found')));
    });
}

function addItensToShoppingCart() {
  const buttom = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttom.addEventListener('click', (event) => {
    requestItemsFromAPI(event)
      .then((selectedItem) => {
        cartItems().appendChild(createCartItemElement(selectedItem));
    });

    setLocalStorage();
    sumItemsCart();
  });

  return buttom;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(addItensToShoppingCart());

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function getMercadoLivreItens() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => {
      json.results.map((itens) => {
        const listItems = { sku: itens.id, name: itens.title, image: itens.thumbnail };
        return listItems;
      }).forEach((products) => {
        document.querySelector('.items')
        .appendChild(createProductItemElement(products));
      });
    });
}

function clearShoppingCart() {
  emptyCart().addEventListener('click', () => {
    cartItems().innerHTML = '';
    sumItemsCart();
    setLocalStorage();
  });
}

window.onload = function onload() { 
  getMercadoLivreItens();
  recupereLocalStorage();
  clearShoppingCart();
  sumItemsCart();
};
