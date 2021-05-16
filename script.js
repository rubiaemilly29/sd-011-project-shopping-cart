const objectCarts = {};

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

function salvar() {
  const listItens = document.getElementsByClassName('cart__item');
  // const listItens = document.getElementsByTagName('li');
  const vetorItens = [];
  for (let i = 0; i < listItens.length; i += 1) {
    vetorItens.push({ 
      text: listItens[i].innerText,
     });
  }
  const listJson = JSON.stringify(vetorItens);
  localStorage.setItem('cartList', listJson);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const showPrice = document.getElementById('price');
  let valorTotal = parseFloat(showPrice.innerHTML);
  const valorItem = parseFloat(objectCarts[`${event.target.id}`]);
  valorTotal -= valorItem;
  showPrice.innerHTML = valorTotal;
  delete objectCarts[`${event.target.id}`];
  event.target.remove();
  salvar();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = sku;
  li.addEventListener('click', cartItemClickListener);
  const showPrice = document.getElementById('price');
  let valor = parseFloat(showPrice.innerHTML);
  valor += salePrice;
  showPrice.innerHTML = Math.round(valor * 100) / 100;
  objectCarts[`${sku}`] = salePrice;
  console.log(showPrice.innerHTML);
  return li;
}

function exercise2() {
  const getButtons = document.querySelectorAll('.item__add');
  getButtons.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const parent = event.target.parentNode;
      const id = parent.querySelector('.item__sku').innerText;
      const response2 = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const json2 = await response2.json();
      const productCart = {
        sku: json2.id,
        name: json2.title,
        salePrice: json2.price,
      };
      const itemCart = createCartItemElement(productCart);
      const getCart = document.querySelector('ol.cart__items');
      getCart.appendChild(itemCart);
      salvar();
    });
  });
}

async function exercise1() {
  const getLoad = document.getElementsByClassName('loading')[0];
  getLoad.innerHTML = 'loading...';
  const term = 'computador';
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${term}`);
  const json = await response.json();
  const productsContainer = document.querySelector('.items');
  json.results.forEach((product) => {
    const products = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    const productCreated = createProductItemElement(products);
    productsContainer.appendChild(productCreated);
  });
  getLoad.remove();
  exercise2();
}

function addSaveList(text) {
  const newList = document.createElement('li');
  newList.innerText = text;
  newList.addEventListener('click', cartItemClickListener);
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cartItems.appendChild(newList);
  return newList;
}

function loadListSaved() {
  if (!Storage || !localStorage.cartList) {
    return;
  }
  const cartList = JSON.parse(localStorage.cartList);
  for (let i = 0; i < cartList.length; i += 1) {
    const newList = addSaveList(cartList[i].text);
    newList.classList.add('cart__item');
  }
}

window.onload = function onload() { 
  exercise1();
  loadListSaved();
  // atualizarCompraTotal();
  const getButtonErase = document.getElementsByClassName('empty-cart')[0];
  getButtonErase.addEventListener('click', () => {
    const getListCart = document.getElementsByClassName('cart__item');
    const tamanho = getListCart.length;
    for (let i = tamanho - 1; i >= 0; i -= 1) {
      getListCart[i].remove();
    }
  });
};
