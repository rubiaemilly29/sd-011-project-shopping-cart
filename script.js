const cartitems = '.cart__items';
const totalprice = '.total-price';
let priceSome = 0;

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const loadApi = (search = 'computador') =>
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${search}`)
  .then((response) => response.json()
    .then((object) => {
      document.querySelector('.loading').remove();
      object.results.forEach((elem) => {
        const intemSection = document.querySelector('.items');
        const creatCard = createProductItemElement(elem);
        intemSection.appendChild(creatCard);
      });
    }));

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const insertItem = document.querySelector(cartitems);
  const pricePanel = document.querySelector(totalprice);
  const panelCalc = Number(pricePanel.innerText - event.target.ariaValueText);
  pricePanel.innerText = parseFloat(panelCalc.toFixed(2));
  insertItem.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.ariaValueText = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const pricePanel = document.querySelector('.total-price');
  priceSome += salePrice;
  pricePanel.innerText = parseFloat(priceSome.toFixed(2));
  return li;
}

const addCartApi = (ItemID) => fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((response) => {
    response.json()
      .then((object) => {
        const insertItem = document.querySelector(cartitems);
        insertItem.appendChild(createCartItemElement(object));
        localStorage.setItem('Save', insertItem.innerHTML);
      });
  });

const loadEvents = () => {
  // Botão adicionar o carrionho
  const intemSection = document.querySelector('.items');
  intemSection.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      addCartApi(event.path[1].children[0].innerText);
    }
  });
  // Botão limpar o carrionho
  const btnClear = document.querySelector('.empty-cart');
  const insertItem = document.querySelector(cartitems);
  const pricePanel = document.querySelector(totalprice);
  btnClear.addEventListener('click', () => {
    insertItem.innerHTML = '';
    pricePanel.innerText = '0';
    localStorage.setItem('Save', insertItem.innerHTML);
  });
};

const loadCart = () => {
  const insertItem = document.querySelector(cartitems);
  insertItem.innerHTML = localStorage.getItem('Save');
  const listValues = document.querySelectorAll('.cart__item');
  let resultValue = 0;
  listValues.forEach((value) => {
    resultValue += parseFloat(value.ariaValueText);
  });
  const pricePanel = document.querySelector(totalprice);
  pricePanel.innerText = Number(resultValue.toFixed(2));
};

window.onload = function onload() {
  loadApi();
  loadEvents();
  loadCart();
};
