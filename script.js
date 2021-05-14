const carItensTag = '.cart__items';
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
  event.target.remove();
  const cartMenu = document.querySelectorAll(carItensTag)[0].innerHTML;
  localStorage.cartStatus = cartMenu;
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

async function createCards() {
  await verifiedFetch()
    .then((results) => {
      results.forEach((item) => {
        const itemToFind = { sku: item.id, name: item.title, image: item.thumbnail };
        document.querySelectorAll('.items')[0].appendChild(createProductItemElement(itemToFind));
      });
    });
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
      });
  }

function buttonAddOnCart() {
  const buttons = document.querySelectorAll('.item');
  buttons.forEach((values) => {
    values.lastChild.addEventListener('click', async () => {
      await addOnCart(values.firstChild.innerText);
      const cartMenu = document.querySelectorAll(carItensTag)[0].innerHTML;
      localStorage.cartStatus = cartMenu;
    });
  });
}

window.onload = async () => {
  document.querySelectorAll(carItensTag)[0].innerHTML = localStorage.getItem('cartStatus');
  await createCards();
  buttonAddOnCart();
  document.querySelectorAll('.cart__item').forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
};
