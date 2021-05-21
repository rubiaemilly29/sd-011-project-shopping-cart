const fetchAPI = () => {
  const endPoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$Computador';
    return new Promise(() => {
      fetch(endPoint)
        .then((Response) => {
          Response.json()
            .then((json) => {
              console.log(json);
              const { results } = json;
                console.log(results);
                results.forEach((element) => {
                  console.log(element.id, element.title, element.price, element.thumbnail);
                });
            });
        });
    });
};        

// return `${element.id}, ${element.title}, ${element.price}`;
// console.log(element.id);
// console.log(element.title);
// console.log(element.price);
window.onload = function onload() { 
  fetchAPI();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img; 
}

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
