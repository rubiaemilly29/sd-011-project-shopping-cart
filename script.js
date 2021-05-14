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
  // coloque seu código aqui
  const node = event.target;
  node.parentNode.removeChild(node);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function generatePageItems(API_URL, itemsContainer) {
  fetch(API_URL) // Baixando dados da api
  .then((response) => response.json()) // Fazendo o parsing
  .then(({ results }) => { // Passando a chave results do objeto json recebido como parametro para a arrow function
    results.forEach((result) => {
      const item = createProductItemElement( // Passando para a constante item o objeto retornado da funcao createProductItemElement
        { sku: result.id, name: result.title, image: result.thumbnail }, // Passando os valores que a funcão recebe como argumento, não entendi pq nomes tão confusos
        );
        itemsContainer.appendChild(item); // Adicionando cada item retornado da funcao createProduct.... ainda esta dentro do foreach
      });
    });
}

function addOnCart(itemsContainer) {
  itemsContainer.addEventListener('click', (event) => {
    const itemID = event.target.parentNode.firstChild.innerText;
    const cartList = document.querySelector('.cart__items');
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then((response) => response.json())
      .then((product) => {
        const cartItem = createCartItemElement(
          { sku: product.id, name: product.title, salePrice: product.price },
        );
        cartList.appendChild(cartItem);
      });
});
}
window.onload = function onload() { 
  const itemsContainer = document.querySelector('.items');
  const API_URL = 'https://api.mercadolibre.com/sites/MLA/search?q=Computador';
  
  generatePageItems(API_URL, itemsContainer);

  addOnCart(itemsContainer);
};