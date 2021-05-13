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

// Requisito 3 - Depois de receber o click, o item do carrinho é retirado
function cartItemClickListener(event) {
  const clickedItem = event.target;
  clickedItem.remove();
}

// Requisito 2 - Cria o item no carrinho com o sku, nome e preço
function createCartItemElement({ sku, name, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${price}`;
  // Requisito 2 - Criação do item no Carrinho
  const shoppingCartItens = document.querySelector('.cart__items');
  shoppingCartItens.appendChild(li);
  // Requisito 3 - Espera receber o click para tirar da lista do carrinho
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2 - Pegar do objeto recebido, os parâmetros de cada um dos itens: SKU, Name, Image e Price serão usados
function createProductItemElement({ id: sku, title: name, thumbnail: image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  // Colocar o AddEventListener para criar o item no carrinho com os atributos pedidos  
  .addEventListener('click', () => createCartItemElement({ sku, name, price }));
  return section;
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

// Requisito 1 - Puxar a lista por API e criar item dentro da section
const fetchTheAPI = () => (
  new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
      .then((response) => {
        response.json()
        .then((data) => {
          console.log(data);
          const productList = data.results;
          productList.forEach((product) => {
            const sectionItens = document.querySelector('.items');
            sectionItens.appendChild(createProductItemElement(product));
            resolve();
          });
        })
        .catch(() => reject());
      })
      .catch(() => reject());
  })
);

window.onload = function onload() { 
  fetchTheAPI()
  // Requisito 7 - Dentro do onload para garantir que a função será executada após o DOM ser carregado
  .then(() => {
    const a = document.querySelector('.empty-cart');
    a.addEventListener('click', () => {
    const ShoppingCart = document.querySelector('.cart__items');
    ShoppingCart.innerHTML = '';
    });
  });
};
