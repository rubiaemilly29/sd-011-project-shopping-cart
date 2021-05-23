const listCart = document.querySelector('.cart__items'); // Retorna HTML colletion bruto. Precisa filtrar isso, para abstrair os dados que se deseja gravar no LocalStorage. Usado em: carregarLS(), gravarLS(), clearCart() e throwToCart(parametro)

function cartItemClickListener(event) { // Remove item do carrinho. É invocada na função createCartItemElement()
  const item = event.target;
 
    for (let i = 0; /* vazio */; i += 1) { // Precisa de interação por ńumeros de indice devido as chaves do localSotore terem sido gravadas por números
      if (localStorage.getItem(i) === item.innerText) {
        localStorage.removeItem(i); // Remove do local storage o item que tem o índice  que atende à condição 
        item.remove(); // Remove HTML Element <li> da  NodeList
        break; // Para o Loop. Caso contrário, loop continuaria desnecessáriamente e ainda removeria do localStorafe outro(s) valore(s) que tenham de mesmo contéudo.
      }
    }
}

// [Meu CÓDICO 3 aqui ABAIXO]:>>
function itemTocart(data) { // Função que fiz para criar items para o carrinho. Recebe como parâmetro dados do loclaStorage apondado na função chamadora.
  const li = document.createElement('li'); // Cria um novo <li> para cada entrada aramazenada no localStorage.
  li.className = 'cart__item'; // Atribui classe pré-determinda ao <li> criado.
  li.innerText = data; // Atribui ao <li> recém criado, texto recuperado do localStorage.
  li.addEventListener('click', cartItemClickListener); // Atribui escudor de evento, pré-determinda, ao <li> criado.
  // createCartItemElement(item) // Não conseguir usar essa que veio no projeto para criação de <li>. Dá conclito devido ao innerText.
  return li;
}

async function gravarLS() { // [GRAVA Local Storage - setItem()] - Invocada por clearCart(), cartItemClickListener(), createCartItemElement()
  for (let i = 0; i < listCart.childElementCount; i += 1) { // Como listCart é HTML Colletion, possui chaves para tratar como <childNodes> ou <children>
      localStorage.setItem(i, listCart.childNodes[i].innerText); //  Sem innerText vem um array de objetos de cada childNode (<li>), porém com dados inúteis, pois se quer salavar apenas o texto de cada <li> para recriar a lista do carrinho.
    }
}

async function carregarLS() { // [CARREGA Local Storage - getItem()] - Invocada no começo do <window.onload>
  if (localStorage.length !== 0) { // Primeiro verifica se há algo pra carregar no localStorage.
    for (let i = 0; i < localStorage.length; i += 1) { // Faz iteração do que tem gravado no localStorage, para tratar e criar as <li> com esses dados de texto.
      const item = localStorage.getItem(i); // Recupera cada valor armazenado em cada entrada do LocalStorage.

      const liCriada = itemTocart(item); // Função que cria cada elemento HTML <li> que vai para o carrinho com base nos dados do localStorage
      listCart.appendChild(liCriada); // <section> <ol> do carrinho anexa a <li> criada já com os dados do local storage
    }
  }
}
// <<:[Meu CÓDIGO 3 aqui ACIMA]
function makeLoader() { // Cria um <span> com texto a ser mostrado no <body>, para quando se espera resposta de uma API.
  const e = document.createElement('span');
  e.className = 'loading';
  e.innerText = 'Carregando...';
  document.body.appendChild(e);
}

function delLoader() { // Remove o <span> craido por makeLoader(), após a API dar um resposta.
  const loader = document.querySelector('.loading');
  document.body.removeChild(loader);
}

async function createProductImageElement(imageSource) { // Função invocada dentro de createProductItemElement(). Cria elemento HTML que recebe imagem da API
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function createCustomElement(element, className, innerText) { // Função invocada de dentro de createProductItemElement(). Cria um elemento qualquer que se precise
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

async function createProductItemElement(sku, name, image) { // Função invocada de dentro de getProductList() / Removi shorthand / Cria elementos para exibir dado de uma API.
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(await createCustomElement('span', 'item__sku', sku));
  section.appendChild(await createCustomElement('span', 'item__title', name));
  section.appendChild(await createProductImageElement(image));
  section.appendChild(await createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// [ESSA FUNÇÃO JÁ VEIO NO Projeto] - Mas não a utilizei.
// function getSkuFromProductItem(item) { // Pega um nó (parametro) e...  
//   return item.querySelector('span.item__sku').innerText; // ...retorna o texto do elemento (filho entre parenteses)
// }
  function clearCart() { // Função para Limpar todos os items <li> do carrinho e do localStorage.
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', function () {
      while (listCart.firstChild) {
        listCart.removeChild(listCart.firstChild);
      }
      localStorage.clear(); // Limpa todos items do Local Storage
  });
}

function createCartItemElement(sku, name, salePrice) { // Cria os itens <li> HTML PARA o carrinho (cart). Invocada de dentro de throwtoCart() / Removi shorthand: { sku, name, salePrice }
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function throwToCart(item) { // INSERE no carrinho (<ol>) item <li> HTML criado pela função createCartItemElement().
  const product = createCartItemElement(item.id, item.title, item.price);
  listCart.appendChild(product);
  gravarLS(); // Atualiza LocalStorage
}

async function fetchToCart(id) { // Faz requisição para endpoint, com ID recebido como parâmetro invocado por addToCart()
  makeLoader(); // Cria elemento <span> de loading... que aparece antes da requicição.
  const param = { headers: { Accept: 'application/json' } };
  return fetch(`https://api.mercadolibre.com/items/${id}`, param)
  .then((r) => {
    delLoader(); // Deleta elemento <span> para loading... um vez que a requisição a API retornou algo.
    r.json()
    .then((response) => {
      throwToCart(response);
    });
  });
}

// [Meu CÓDIGO 1 aqui ABAIXO]:>>
 async function addToCart(olList) { // Recebe como parâmetro uma <section> de class .items, que foi passado pela função getProductList()
     olList.addEventListener('click', function (event) { 
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
      .then((resolve) => { // Resposta da API já com dados transformados em JSON
        const produto = document.querySelector('.container .items'); // Captura a <section> principal do HTML a qual receberá as sub-sessões criadas para cada resposta da API.
        resolve.results.forEach(async (element) => { // Percorrer o array de objetos, que está contido na chave Results. Que são os dados de cada produto.
          const item = await createProductItemElement(element.id, element.title, element.thumbnail); // Cria elementos HTML com cada dado de produto.
          produto.appendChild(item); // Adiciona na <section> principal cada <section> de cada produto criado com os dados de retono.
        }); 
        return produto; 
      }).then((proRetorno) => { addToCart(proRetorno); });  
    });
  }
  // throw new Error('Pequise só com a palavra "computador"');
}
// <<:[Meu CÓDIGO 2 aqui ACIMA]

window.onload = function onload() {
  getProductList('computador');
  carregarLS(); // Carrega localStorage, se houver conteúdo lá.
  clearCart();
};