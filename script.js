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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const product = event.target.parentElement;
  fetch(`https://api.mercadolibre.com/items/${product.firstChild.innerText}`)
    .then((response) => response.json())
    .then((data) => {
      document.getElementsByTagName('ol')[0].appendChild(createCartItemElement(
        ({ sku: data.id,
          name: data.title,
          salePrice: data.price }),
      ));
    });
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => { 
      // console.log(data);
      // console.log(typeof data);
      for (let index = 0; index < data.paging.limit; index += 1) {
        document.getElementsByClassName('items')[0].appendChild(createProductItemElement(
          ({ sku: data.results[index].id,
            name: data.results[index].title,
            image: data.results[index].thumbnail }),
        ));
      }
    });
  // console.log(fetchResult);
  // createProductItemElement(fetchResult);
  document.getElementsByClassName('items')[0].addEventListener('click', cartItemClickListener);
};
