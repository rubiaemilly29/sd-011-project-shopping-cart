const total = document.querySelector('.total-price');

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

// Remove local storage product, Remove Cart Item product, Subtract from total price
function cartItemClickListener(event, cartItems, count, salePrice) {
  localStorage.removeItem(`product${count}`);
  cartItems.removeChild(event.target);
   total.innerText = parseFloat(Number(total.innerText) - Number(salePrice));
}

// Create Cart Items, Create Local Storage Items, Sum total value of Items
function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector('.cart__items');
  localStorage.setItem(`product${cartItems.childElementCount}`, `${sku},${name},${salePrice}`);
  const count = cartItems.childElementCount;
  cartItems.appendChild(li).addEventListener('click',
   (event) => cartItemClickListener(event, cartItems, count, salePrice));
   total.innerText = parseFloat(Number(total.innerText) + Number(salePrice));
   return li;
}

// Create Section Items (append on Section)
function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => {
    createCartItemElement({ sku, name, price });
  });
  const itemSection = document.querySelector('.items');
  itemSection.appendChild(section);
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Fetch mercado livre API, Remove loading span, 
// forEach on objJson calling createProductItemElement, setting localStore object
const getProduct = async () => {
  const getLoading = document.querySelector('.loading');
  const getCart = document.querySelector('.cart');  
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((res) => res.json())
  .then((res) => res.results.forEach((computador) => createProductItemElement(computador)))
  .then(() => {
    getCart.removeChild(getLoading);
    for (let index = 0; index < localStorage.length; index += 1) {
      let localObjStore = {};
      const [sku, name, price] = localStorage.getItem(`product${index}`).split(',');
      localObjStore = { sku, name, price };
      createCartItemElement(localObjStore);
    }
  });
  };

  // Erase button on onload
  window.onload = function onload() {
    getProduct();
    
    const clearBtn = document.querySelector('.empty-cart');
    clearBtn.addEventListener('click', () => {
      const cartItems = document.querySelector('.cart__items');
      cartItems.innerHTML = '';
      total.innerText = 0;
      localStorage.clear();
    });
  };