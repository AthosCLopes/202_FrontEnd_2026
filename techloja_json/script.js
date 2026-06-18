let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Carregar produtos do arquivo JSON
async function carregarProdutos() {
    try {
        const response = await fetch('./produtos.json');
        if (!response.ok) throw new Error('Arquivo JSON não encontrado');
        produtos = await response.json();
    } catch (error) {
        console.warn('Usando dados locais (fallback)');
        produtos = [
            { id: 1, nome: "Notebook Eco Pro", preco: 2899.90, categoria: "Notebooks", imagem: "https://picsum.photos/id/201/300/180" },
            { id: 2, nome: "Mouse Sem Fio", preco: 89.90, categoria: "Acessórios", imagem: "https://picsum.photos/id/160/300/180" },
            { id: 3, nome: "Teclado Mecânico RGB", preco: 249.90, categoria: "Acessórios", imagem: "https://picsum.photos/id/180/300/180" }
        ];
    }

    renderizarProdutos(produtos);
    atualizarContador();
}

function renderizarProdutos(lista) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    lista.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'card bg-white border border-slate-200 rounded-3xl overflow-hidden';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover">

            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-semibold">${produto.nome}</h3>
                        <span class="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            ${produto.categoria}
                        </span>
                    </div>

                    <div class="text-right">
                        <div class="font-bold text-xl">R$ ${produto.preco}</div>
                    </div>
                </div>

                <button
                    onclick="adicionarAoCarrinho(${produto.id})"
                    class="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Adicionar</span>
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function filtrarProdutos() {
    const termo = document.getElementById('busca').value.toLowerCase();

    const filtrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo)
    );

    renderizarProdutos(filtrados);
}

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);

    if (produto) {
        carrinho.push({ ...produto });

        localStorage.setItem(
            'carrinho',
            JSON.stringify(carrinho)
        );

        atualizarContador();

        alert(`${produto.nome} adicionado ao carrinho!`);
    }
}

function atualizarContador() {
    document.getElementById('contador-carrinho').textContent =
        carrinho.length;
}

function mostrarCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    const itensContainer = document.getElementById('carrinho-itens');
    const totalEl = document.getElementById('carrinho-total');

    itensContainer.innerHTML = '';

    let total = 0;

    if (carrinho.length === 0) {
        itensContainer.innerHTML =
            '<p class="text-center py-8 text-slate-500">Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach((item, index) => {
            total += item.preco;

            const itemHTML = `
                <div class="flex gap-4 border-b pb-4">
                    <img
                        src="${item.imagem}"
                        class="w-16 h-16 object-cover rounded-xl">

                    <div class="flex-1">
                        <div class="font-semibold">${item.nome}</div>
                        <div class="text-emerald-600">
                            R$ ${item.preco}
                        </div>
                    </div>

                    <button
                        onclick="removerDoCarrinho(${index})"
                        class="text-red-500 hover:text-red-700">
                        ×
                    </button>
                </div>
            `;

            itensContainer.innerHTML += itemHTML;
        });
    }

    totalEl.textContent = `R$ ${total.toFixed(2)}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);

    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    );

    atualizarContador();
    mostrarCarrinho(); // Atualiza o modal
}

function fecharCarrinho() {
    const modal = document.getElementById('modal-carrinho');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

function finalizarCompra() {
    if (carrinho.length === 0) return;

    const total = carrinho.reduce((sum, item) => sum + item.preco, 0);

    // Simular salvamento do pedido (usando localStorage)
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    pedidos.push({
        id: Date.now(),
        data: new Date().toISOString(),
        itens: [...carrinho],
        total: total
    });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    alert(`Compra finalizada com sucesso! Total: R$ ${total.toFixed(2)}\nPedido salvo localmente.`);

    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContador();
    fecharCarrinho();
}

// Inicialização
carregarProdutos();