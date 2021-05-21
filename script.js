// Requisitos realizados em sala de estudos junto com o colega Nikolas Silva, 
//  com o apoio dos colegas Vinicius Goncalves, Jeferson Casagrande, 
// Gustavo Mendes, Fernando Lasmar e Alberto Candido
// e pesquisas aos sites:
// https://www.youtube.com/watch?v=wG65FdU-Yos
// https://www.youtube.com/watch?v=YeFzkC2awTM
// https://www.blogson.com.br/carrinho-de-compras-com-localstorage-do-html-5/
// https://www.horadecodar.com.br/2020/11/03/mostrar-gif-enquanto-uma-pagina-carrega-com-javascript/

const lintCorrect = '.cart__items';

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function storage() {
  const cartStorage = document.querySelector(lintCorrect);
  localStorage.setItem('shopCart', cartStorage.innerHTML);
}

function cartItemClickListener(event) {
  const delItem = document.querySelector(lintCorrect);
  delItem.removeChild(event.target);
  storage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const cartItems = document.querySelector(lintCorrect);
  cartItems.appendChild(li);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', () => {
      createCartItemElement({ sku, name, salePrice });
      storage();
    });

  return section;
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getProductList(query) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const itemElement = createProductItemElement({
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
          salePrice: item.price,
        });
        document.querySelector('.items').appendChild(itemElement);
      });
    });
}

// em conjunto com o colega Nykolas Silva para corrigir o erro de limpar o 
// carrinho que forçava o recarregamento da tela e função de exibição do loading
window.onload = function onload() {
  getProductList('computador');
  if (localStorage.shopCart) {
    document.querySelector(lintCorrect).innerHTML = localStorage.getItem('shopCart');
    document.querySelectorAll('.cart__item').forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }

document.querySelector('.empty-cart').addEventListener('click', () => {
  localStorage.clear();
  const listChild = document.querySelector('.cart__items');
  while (listChild.firstChild) {
  listChild.removeChild(listChild.firstChild);
  } 
  });  
  setTimeout(() => {
    document.querySelector('.loading').remove();
    }, 500);   
}; 
