window.onload = function onload() { };

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
function cartItemClickListener(event) {
  const elem = event.target;
  elem.remove();
}

function createCartItemElement({ sku, name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const itemLitst = document.querySelector('ol');
  itemLitst.appendChild(li);
  const itemCur = [sku, name, salePrice];
  localStorage.setItem(`item${itemLitst.childElementCount}`, JSON.stringify(itemCur));

  return li;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  const myProduct = { sku, name, price };
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', () => createCartItemElement(myProduct));
  return section;
}

const productList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const myProduct = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
          price: product.price,
        };
        document.querySelector('.items').appendChild(createProductItemElement(myProduct));
      });
    });
};
productList();

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = async () => {
  await productList();
};