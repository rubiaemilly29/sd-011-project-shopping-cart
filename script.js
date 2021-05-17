const carItensTag = '.cart__items';
const totalPriceTag = '.total-price';
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const arrayWithPrice = event.target.innerText.split('$');
  const totalValue = document.querySelectorAll(totalPriceTag)[0];
  let totalValueInNumber = parseFloat(totalValue.innerText, 10); 
  totalValueInNumber -= parseFloat(arrayWithPrice[1], 10);
  totalValue.innerText = (Math.round(totalValueInNumber * 100) / 100).toString();
  event.target.remove();
  const cartMenu = document.querySelectorAll(carItensTag)[0].innerHTML;
  localStorage.cartStatus = cartMenu;
  localStorage.totalPrice = document.querySelectorAll(totalPriceTag)[0].innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function verifiedFetch() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((result) => result.json())
        .then((result) => resolve(result.results));
  });
}

function showLoading() {
  const loadingDiv = createCustomElement('div', 'loading', 'loading');
  document.querySelectorAll('.cart')[0].appendChild(loadingDiv);
}

function removeLoading() {
  const loadingElement = document.querySelectorAll('.loading')[0];
  loadingElement.remove();
}

async function createCards() {
  showLoading();
  await verifiedFetch()
    .then((results) => {
      results.forEach((item) => {
        const itemToFind = { sku: item.id, name: item.title, image: item.thumbnail };
        document.querySelectorAll('.items')[0].appendChild(createProductItemElement(itemToFind));
      });
    })
    .then(() => removeLoading());
}

function getItemPerId(itemId) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
      .then((result) => result.json())
      .then((resultJson) => resolve(resultJson));
  });
}

async function addOnCart(itemId) {
    await getItemPerId(itemId)
      .then((item) => {
        const myData = { sku: item.id, name: item.title, salePrice: item.price };
        const newSecton = createCartItemElement(myData);
        document.querySelectorAll(carItensTag)[0].appendChild(newSecton);
        return item;
      })
        .then((item) => {
          const totalValue = document.querySelectorAll(totalPriceTag)[0];
          let totalValueInNumber = parseFloat(totalValue.innerText, 10);
          const priceOfItem = item.price;
          totalValueInNumber += priceOfItem;
          totalValue.innerText = (Math.round(totalValueInNumber * 100) / 100).toString();
        });
  }

function buttonAddOnCart() {
  const buttons = document.querySelectorAll('.item');
  buttons.forEach((values) => {
    values.lastChild.addEventListener('click', async () => {
      await addOnCart(values.firstChild.innerText);
      const cartMenu = document.querySelectorAll(carItensTag)[0].innerHTML;
      localStorage.cartStatus = cartMenu;
      localStorage.totalPrice = document.querySelectorAll(totalPriceTag)[0].innerText;
    });
  });
}

function clearCart() {
  const allItensInCart = document.querySelectorAll('.cart__item');
  allItensInCart.forEach((item) => {
    item.remove();
  });
  document.querySelectorAll(totalPriceTag)[0].innerText = '0';
  localStorage.cartStatus = document.querySelectorAll(carItensTag)[0].innerHTML;
  localStorage.totalPrice = '0';
}

window.onload = async () => {
  document.querySelectorAll(carItensTag)[0].innerHTML = localStorage.getItem('cartStatus');
  if (localStorage.getItem('totalPrice') !== null) {
    document.querySelectorAll(totalPriceTag)[0].innerText = localStorage.getItem('totalPrice');
  }
  await createCards();
  buttonAddOnCart();
  document.querySelectorAll('.cart__item').forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  document.querySelectorAll('.empty-cart')[0].addEventListener('click', clearCart);
};
