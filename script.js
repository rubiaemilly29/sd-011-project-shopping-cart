let cartData = [];

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

function saveCartToLocalStorage() {
  localStorage.setItem('cart-data', JSON.stringify(cartData));
}

function updateCartPrice() {
  const totalPrice = cartData.reduce((acc, current) => {
    const itemPrice = current.salePrice;
    return acc + itemPrice;
  }, 0);
  document.querySelector('.total-price').textContent = Math.round(totalPrice * 100) / 100;
}

function cartItemClickListener(e) { // remover item do carrinho
  const { id } = e.target;
  const itemIndex = cartData.findIndex((item) => item.sku === id);
  cartData.splice(itemIndex, 1);
  e.target.remove();
  updateCartPrice();
  saveCartToLocalStorage();
}

// function loadCartFromLocalStorage() {
//   const cartElement = document.querySelector(`.${cartElementClass}`);
//   cartElement.innerHTML = localStorage.getItem('cart-items');
//   document.querySelectorAll('.cart__item')
//     .forEach((element) => element.addEventListener('click', cartItemClickListener));
// }

// Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/// Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function renderCart() {
  const cartElement = document.querySelector('.cart__items');
  cartElement.innerHTML = '';
  cartData.forEach((item) => {
    const cartItemElement = createCartItemElement(item);
    cartElement.appendChild(cartItemElement);
  });
}

function loadCartFromLocalStorage() {
  const loadedCartData = JSON.parse(localStorage.getItem('cart-data'));
  if (loadedCartData) {
    cartData = [...loadedCartData];
    renderCart();
    updateCartPrice();
  }
}

function loadingMessage() {
  const element = createCustomElement('p', 'loading', 'Loading...');
  document.querySelector('.cart').appendChild(element);
}

function removeLoadingMessage() {
  const element = document.querySelector('.loading');
  element.remove();
}

  async function addItemToCart(e) {
    const sku = getSkuFromProductItem(e.target.parentElement);
    loadingMessage();
    const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const { title, price } = await response.json();
    removeLoadingMessage();
    cartData.push({ sku, name: title, salePrice: price });
    renderCart();
    updateCartPrice();
    saveCartToLocalStorage();
  }
  async function loadProducts(queryName) {
    const itemsSection = document.querySelector('section .items'); // referenciando a class items no HTML
    // const queryName = 'computador'; // termo de busca
    loadingMessage();
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`); // acessando a API assincronamente através do await e do fetch
    const { results } = await response.json(); // do obj results, espera-se uma resposta no formato json
    removeLoadingMessage();
    results.forEach((product) => { // para cada item obtido do results, execute
      const component = createProductItemElement({ // a constante renomeia os parâmetros do obj de acordo com o requisitado
        sku: product.id, // sendo assim, sku = id
        name: product.title, // name = title
        image: product.thumbnail, // image = thumbnail
      });
      component.querySelector('button').addEventListener('click', addItemToCart);
      itemsSection.appendChild(component); // component torna-se filho de itemsSection, o qual referencia a class items
    });
  }

function clearCart() {
  cartData = [];
  updateCartPrice();
  saveCartToLocalStorage();
  renderCart();
}
  
  window.onload = async function onload() {
    loadCartFromLocalStorage();
    await loadProducts('computador');
    document.querySelector('.empty-cart').addEventListener('click', clearCart);
  };

  // Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/

//   fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${queryName}`) // requisição a API do ML
//     .then((response) => response.json()) // a resposta retorna e é convertida em formato json
//     .then(({ results }) => { // no json o que eu quero acessar é o objeto results
//       results.forEach((product) => { // para cada item retornado do results, execute:
//         console.log(product); // imprime item no console
//         const component = createProductItemElement({ //
//           sku: product.id, // sku = id
//           name: product.title, // name = title
//           image: product.thumbnail, // image = thumbnail
//         });
//         itemsSection.appendChild(component); // utiliza as chaves de component para criar filhos na class items no HTML
//       });
//     });
// };

// Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101/

// Source: consulta ao repositório do Matheus Gaspar = https://github.com/tryber/sd-011-project-shopping-cart/pull/101///