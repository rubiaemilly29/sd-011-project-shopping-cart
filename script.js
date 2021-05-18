// const fetch = require('node-fetch');

// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function createProductItemElement({ sku, name, image }) {
//   const section = document.createElement('section');
//   section.className = 'item';

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

//   return section;
// }

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

async function getProductList (productType) {
// return new Promise ((resolve, reject) => {

  if (productType === 'computador') {
    const param = { headers: { Accept: 'application/json' } };
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productType}`, param)
   .then((r) => {
    //  console.log(r);
      r.json()
      .then((resolve) => console.log(resolve));

      // resolve();  
    })
  
  }
  throw new Error ('Pequisa só com a palavra "computador"')

// })
  
}

// :Meu códido aqui ACIMA também:


window.onload = function onload() { 
alert('Oi, blz?')
  // const fetch = require('node-fetch');
getProductList('computador');




};