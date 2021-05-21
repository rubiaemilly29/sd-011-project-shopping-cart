function createProductImageElement(imageSource) { // Requisito 1 - Cria a tag img dos produtos.
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Requisito 1 - Cria as tag span com id, nome e o botão adicionar ao carrinho dos produtos.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Requisito 1 - Cria os componentes HTML referente aos produtos
function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // Plantão do Pablo. Altera parâmetros para receber dados como chegam
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')); // Criação do botão
  return section;
}
// Requisito 2 - retorna o valor do itemID
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  event.target.remove();
}

// Requisito 2 - Cria os componentes HTML referente a um item do carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) { // Altera parâmetros para receber dados como chegam
  // const cartList = document.querySelector('.cart_items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // cartList.appendChild(li); // O elemento retornado é filho do elemento ol

  li.addEventListener('click', cartItemClickListener); // Inicia a lógica que remove o item do carrinho ao clicar nele
  return li;
}

// Requisito 2 - Requisição da API, captura o elemento span com a id, atribui a todos os botões o evento de capturar o span
const addToCart = () => { 
  const getButton = document.querySelectorAll('.item__add');
  const listCart = document.querySelector('ol.cart__items');

  getButton.forEach((button) => {
    button.addEventListener('click', () => { // Quando clicar no item captura o itemID 
    const itemID = button.parentElement.firstChild.innerText; // Referencia: https://developer.mozilla.org/pt-BR/docs/Web/API/Node/parentNode
    fetch(`https://api.mercadolibre.com/items/${itemID}`) // Busca na API pelos valores do itemID clicado
      .then((response) => response.json())
      .then((data) => listCart.appendChild(createCartItemElement(data)));
    });
  });
};

// Requisito 1 - Requisição da API 
const fetchProduct = () => { 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => data.results.forEach((computador) => {
        const getItem = document.querySelector('.items');
        getItem.appendChild(createProductItemElement(computador));
      }))
    .then(() => addToCart())
    .catch((error) => console.log(error));
};

window.onload = function onload() {
  fetchProduct(); // Requisito 1
};
