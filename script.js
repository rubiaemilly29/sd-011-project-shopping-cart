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


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumProducts = () => {
  const liItems = [...document.querySelectorAll('li.cart__item')];
  const price = liItems.reduce((acc, li) => Number(li.innerText.split('$')[1]) + acc, 0);
  const totalPrice = document.querySelector('span.total-price');
  totalPrice.innerText = price;
};

function saveItems(){
  const cart = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('myListItems',cart);
  sumProducts();
}

function cartItemClickListener(event) {
  // coloque seu código aqui!
  const text = liSaver.innerText;
  const price = parseFloat(text.split('$')[1]);
  const priceClass = document.querySelector('.total-price');
  priceClass.innerText = parseFloat(priceClass.innerText) - price;
  event.target.remove();
  //sumProducts();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.dataset.price = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCarItem = (id) => {
  const param = { headers: { Accept: 'application/json' } };
  fetch(`https://api.mercadolibre.com/items/${id}`, param)
    .then((response) => response.json())
    .then((json) => {
      const selectCarItem = document.querySelector('.cart__items');
      selectCarItem.appendChild(createCartItemElement(json));
      saveItems();
    })
  sumProducts();  
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const createButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createButton.addEventListener('click', ({ target }) => {
    addCarItem(getSkuFromProductItem(target.parentElement));
  });
  section.appendChild(createButton);

  return section;
}

// A função a seguir e disparada depois do carregamento da página
window.onload = function onload() {
  // Habiltar visualização do loading
  const enableLoading = document.querySelector('#loader');
  enableLoading.classList.add('display');
  setTimeout(() => {
      loader.classList.remove('display');
  }, 5000);

  // Atribuição da variável param que será usada como segundo parametro do fetch
  const param = { headers: { Accept: 'application/json' } };
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador', param)
    // Caso tenha-se uma resposta ela pegara essa informação e transformará em um objeto (son)
    .then((response) => response.json())
    .then((json) => {
      // desabilitar visualização do loadding
      const disable = document.querySelector('#loader');
      const loaderClass = document.querySelector('.loading');
      disable.classList.remove('display');
      loaderClass.remove();
      // Seleciona a classe 'item' do arquivo HTML
      const objSection = document.querySelector('.items');
      // A HOF é reponsável por atuar como um somador, pra cada elemento do vetor results é Item 
      // a pagina e esse filho é adicionado 
      json.results.forEach((value) => {
        objSection.appendChild(createProductItemElement(value));
      });
    });
  const savedItems = window.localStorage.getItem('myListItems');
  document.querySelector('.cart__items').innerHTML = savedItems;
  const liItemsSaved = document.getElementsByClassName('cart__item');
  for (let i = 0; i < liItemsSaved.length; i += 1) {
    liItemsSaved[i].addEventListener('click', cartItemClickListener);
  }
  const emptyBttn = document.querySelector('.empty-cart');
  emptyBttn.addEventListener('click', () => {
    const cartOl = document.querySelector('.cart__items');
    cartOl.innerHTML = '';
  });
  sumProducts();
};
