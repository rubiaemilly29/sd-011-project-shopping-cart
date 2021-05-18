// const fetch = require('node-fetch'); // Isso parece não ser necessário.

async function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function createProductItemElement(sku, name, image) { // Modificado aqui. Parâmetros estavam entre chavez
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(await createCustomElement('span', 'item__sku', sku));
  section.appendChild(await createCustomElement('span', 'item__title', name));
  section.appendChild(await createProductImageElement(image));
  section.appendChild(await createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// Meu códido aqui ABAIXO também:

async function getProductList(productType) { // Criei essa função como PROMISE
  if (productType === 'computador') {
    const param = { headers: { Accept: 'application/json' } };
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productType}`, param) // Obtenção de dados da API
   .then((r) => { 
     r.json()
      .then((resolve) => { // Resposta da APi já transforamda em JSON
        const produto = document.querySelector('.container .items');
        resolve.results.forEach(async (element) => { // Filtra para percorrer apenas o array de objetos que são cada produto.
          const item = await createProductItemElement(element.id, element.title, element.thumbnail);
          produto.appendChild(item);
        });          
      }); // >> Fim do segundo THEN        
    }); // >> Fim do primeiro THEN  
  }
  throw new Error('Pequisa só com a palavra "computador"');
}

// :Meu códido aqui ACIMA também:

window.onload = function onload() { 
getProductList('computador');
};