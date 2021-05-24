/** Devido ao ESLinter estar acusando declarações repetivas, tive
 * de adaptálas. O nome das classes está, por exemplo, nessas strings
 * abaixo, com o nome das classes usadas */
const mainOrdenedList = '.cart__items';
const anyItemOfList = '.cart__item';
const createDiv = document.createElement('div');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

/** Função responsável por somar os preços das coisas adicionadas ao carrinho!
 * Essa função será chamada toda vez que a página for carregada, quando o 
 * carrinho de compras for limpo, ou toda vez que o usuário adicionar ou remover
 * um item do carrinho. */
function sumProducts() {
  const toSum = document.querySelectorAll(anyItemOfList);
  let totalSum = 0;

  /** A fim de apreitar os preços que já estavam em HTML, usei um split para fazer
   * a divisão da string em um array. Como o preço estava na ultima parte do array,
   * usei a posição [1], armazenado numa variável chamada totalSum. */
  toSum.forEach((item) => {
    const catchedText = item.innerText;
    totalSum += parseFloat(catchedText.split('$')[1]);
  });
  const displayPrice = document.querySelector('.total-price');
  displayPrice.innerText = totalSum;
}

/** Esta função remove todos os itens do carrinho através de iteração. Então, do
 * tamanho da lista que houver em <ol>, será a quantidade de vezes que haverá
 * iteração do .forEach passando um .remover().
 * A função sumProducts será chamada, para fazer a soma total que resultará em
 * R$ 0,00 */
function emptyCart() {
  const empytButton = document.querySelector('.empty-cart');
  empytButton.addEventListener('click', () => {
    const cartProducts = document.querySelectorAll(anyItemOfList);
    cartProducts.forEach((item) => {
      item.remove();
    });
    sumProducts();

    /** O localStorage é "resetado" toda vez que o carrinho é limpo. Aliás, toda
     * vez que um item é adicionado ou removido, ou o carrinho é limpo, alguma
     * coisa é adicionada ou removida do "armazenamentoLocal". Vai depender da
     * situação */
    const cartItems = document.querySelector(mainOrdenedList).innerHTML;
    localStorage.setItem('cartItems', cartItems);
  });
}

/** Essa função é responsável por remover apenas um item da lista quando o mesmo
 * é clicado. O que basicamente faz é identificar o item clicado através de
 * event.target e removê-lo. Logo, entra em ação a modificação do localStorage,
 * para readicionar os itens que ainda estão em lista. A função de soma também é 
 * convovada. */
function cartItemClickListener(event) {
  event.target.remove();
  const cartItems = document.querySelector(mainOrdenedList).innerHTML;
  localStorage.setItem('cartItems', cartItems);
  sumProducts();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/** Essa função é o coração do site. É através dessa função que a requisição da
 * API é feita e tratada. Essa função é chamada ao carregamento da página através
 * da função */

/** TEXTO PARA AS LINHAS: 116 a 129
 * Essa parte do código adiciona um eventListener a cada item do catálogo, mais
 * especificamente no botão "Adicionar ao carrinho!".
 * É através desse escutador de eventos que conseguimos adicionar um item
 * ao carrinho com um click. 
 * forEach é usado para cada item, e junto vem um eventListener para cada item,
 * utilizando ainda uma função assíncrona. Pois não há sentido em adicionar uma
 * utilidade ao botão sem ao menos ter itens carregados na página. */

const addCartButton = () => {
  /** Temos aqui duas variáveis que servem de uso para alguns elementos da página. */
  const addButtons = document.querySelectorAll('.item__add');
  const ordenedList = document.querySelector(mainOrdenedList);
  addButtons.forEach((addButton) => {
    addButton.addEventListener('click', async () => {
      /** A variável productId guarda a ID de produto em formato de string para pesquisar detatahes */
      const productId = addButton.parentNode.firstElementChild.innerText;
      /** Adiciona o response da promisse na const idResult e trata-a. */
      const idResult = await fetch(`https://api.mercadolibre.com/items/${productId}`);
      const resultOfId = await idResult.json();
      /** Com o retorno da promisse, a função createCartItem é chamada, adicionando um item à lista como seu parâmetro, que será tratado nos códigos acima. */
      const idProduct = createCartItemElement(resultOfId);
      ordenedList.appendChild(idProduct);
      /** Atuliza o localStorage e soma os produtos do carrinho novamente. */
      localStorage.setItem('cartItems', ordenedList.innerHTML);
      sumProducts();
    });
  });
};

const removeLoading = () => document.querySelector('.loading').remove();

/** Função responsável por deixar algumas execuções na fila de espera. E é justa-
 * mente esta função que será chamada ao window.onload da página. Abaixo, uma
 * função assíncrona para fazermos requisições na API do ML que é responsável
 * pos nos retornar um termo de pesquisa específico. O requisitado para este
 * projeto foi obrigatóriamente o termo "computador". */
async function queueWait() {
  const API = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resultOfProducts = await API.json();
  const productContainers = document.querySelector('.items');

  /** Após o retorno da promisse, será passado um forEach no .results de cada um dos produtos. results é um array de objetos que contém algumas informações
   * importantes, como preço, foto, identificador únido e nome do item. Para cada item, a função createProductItemElemente é chamada com um objeto, originado 
   * da pisição [index] do forEach. Logo, é adicionado através de appenChild um produco específico, armazenado na variável anyProduct que é resultado da chamada
   * da função createProductItemElemente. */
  resultOfProducts.results.forEach((element) => {
    const anyProduct = createProductItemElement(element);
    productContainers.appendChild(anyProduct);
  });

  /**  As funções abaixo já foram explicadas acima, com excessão da removeLoading(). Ela simplesmente é responsável por remover o texto de carregamento da página. */
  addCartButton();
  emptyCart();
  removeLoading();
  // document.querySelector('.loading').remove();
}

/** A função onload é responsável por fazer algumas preparações na página ao processo
 * de carregamento da mesma.
 * Por exemplo, a função queueWait é onde serão armazenados algumas funções assíncronas
 * que precisam de prioridade a serem inicializadas e somente retornar após seu real
 * término de processo. */
window.onload = function onload() {
  queueWait();
  /** const responsável por armazenar a <ol> do HTML */
  const cartItems = document.querySelector(mainOrdenedList);

  /** O trecho de código abaixo é responsável por puxar os itens
   * diretamente do localStorage e readiciola-los à lista. Também
   * é readicionado o evento de clique a cada item após haver um 
   * reload da página. */
  if (localStorage.cartItems) {
    cartItems.innerHTML = localStorage.getItem('cartItems');
    const cartItem = document.querySelectorAll(anyItemOfList);
    cartItem.forEach((product) => {
      product.addEventListener('click', cartItemClickListener);
    });
    /** Novamente a função de soma precisa ser chamada */
    sumProducts();
  }
};
