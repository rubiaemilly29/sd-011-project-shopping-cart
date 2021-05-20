function makeLoader() {
  const e = document.createElement('span');
  e.className = 'loading';
  e.innerText = 'Carregando...';
  document.body.appendChild(e);
}

function delLoader() {
  const loader = document.querySelector('.loading');
  document.body.removeChild(loader);
}

async function createProductImageElement(imageSource) { // Função invocada dentro de createProductItemElement
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function createCustomElement(element, className, innerText) { // Função invocada de dentro de createProductItemElement()
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function createProductItemElement(sku, name, image) { // Função invocada de dentro de getProductList() / Removi shorthand
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(await createCustomElement('span', 'item__sku', sku));
  section.appendChild(await createCustomElement('span', 'item__title', name));
  section.appendChild(await createProductImageElement(image));
  section.appendChild(await createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// [ESSA FUNÇÃO JÁ VEIO] - Função que veio com o projeto. Não a utilizei.
// function getSkuFromProductItem(item) { // Pega um nó (parametro) e...  
//   return item.querySelector('span.item__sku').innerText; // ...retorna o texto do elemento (filho entre parenteses)
// }

  function clearCart() { // TESTE
  const btnClear = document.querySelector('.empty-cart');
  const listCart = document.querySelector('.cart__items');
  btnClear.addEventListener('click', function () {
      while (listCart.firstChild) {
        listCart.removeChild(listCart.firstChild);
      }
  }); 
}

function cartItemClickListener(event) { // Remove item do carrinho. É invocada na função createCartItemElement()
  // coloque seu código aqui
  const item = event.target;
  item.remove();
}

function createCartItemElement(sku, name, salePrice) { // Cria os item do carrinho. Invocada de dentro de throwtoCart() / Removi shorthand: { sku, name, salePrice }
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function throwToCart(item) { // Adiciona item criados ao carrinho
  const listCart = document.querySelector('.cart__items'); // FUNCIONANDO
  // cart = document.querySelector('.cart__items'); // TESTE com essa atribuição no começo
  
  const product = createCartItemElement(item.id, item.title, item.price); // FUNCIONANDO
  listCart.appendChild(product); // FUNCIONANDO
}

async function fetchToCart(id) { // Faz requisição para endpoint, com ID recebido como parâmetro invocado por addToCart()
  makeLoader(); // Cria elemento <span> para loading
  const param = { headers: { Accept: 'application/json' } };
  return fetch(`https://api.mercadolibre.com/items/${id}`, param)
  .then((r) => { 
    delLoader(); // Deleta elemento <span> para loading
    r.json()
    .then((response) => {
      throwToCart(response);
    });
  });
}

// [Meu CÓDIGO 1 aqui ABAIXO]:>>
 function addToCart(olList) { // Recebe como parâmetro uma <section> de class .items, passado pela função getProductList()
     olList.addEventListener('click', function (event) { // TESTANDO
      // olList.addEventListener('click', function (event) { // RUIM
      const clicado = event.target; // Captura o elemento que foi clicado nessa <section>
      if (clicado.className === 'item__add') { // Veririfica se o elemento é um <buttom> de class .item__add  
        const pai = clicado.parentElement; // Se for, captura o <elemento pai> desse botão
        const id = pai.querySelector('.item__sku').innerText; // A partir do <elemento pai> pega o texto do <span> filho, que tem a classe .tem__sku
        fetchToCart(id); // Essa função tratará de fazer uma requisição para outro endPoint da mesma API de getProductList()
      } 
    });
  }// <<:[Meu CÓDIGO 1 aqui ACIMA]

// [Meu CÓDICO 2 aqui ABAIXO]:>>
async function getProductList(productType) { // Função PROMISE
  if (productType === 'computador') {
    makeLoader(); // Cria elemento <span> para loading
    const param = { headers: { Accept: 'application/json' } };
    return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productType}`, param) // Obtenção de dados da API
   .then((r) => { 
     delLoader(); // Deleta elemento <span> para loading
     r.json()
      .then((resolve) => { // Resposta da APi já transforamda em JSON
        const produto = document.querySelector('.container .items');
        resolve.results.forEach(async (element) => { // Filtra para percorrer apenas o array de objetos que são cada produto.
          const item = await createProductItemElement(element.id, element.title, element.thumbnail);
          produto.appendChild(item);
        }); 
        return produto; 
      }).then((proRetorno) => { addToCart(proRetorno); });  
    }); // >> Fim do primeiro THEN 
  }
  // throw new Error('Pequisa só com a palavra "computador"');
}
// <<:[Meu CÓDIGO 2 aqui ACIMA]

window.onload = function onload() {
  getProductList('computador');
  // addToCart();
  clearCart();
};