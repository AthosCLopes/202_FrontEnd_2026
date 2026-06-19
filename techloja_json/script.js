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
            { id: 1, nome: "Bali, Indonésia", preco: 4299.90, categoria: "Ásia", imagem: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=180&fit=crop" },
            { id: 2, nome: "Lisboa, Portugal", preco: 3199.90, categoria: "Europa", imagem: "https://images.unsplash.com/photo-1585208798174-6cedd4454e5e?w=300&h=180&fit=crop" },
            { id: 3, nome: "Cancún, México", preco: 3799.90, categoria: "América", imagem: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=300&h=180&fit=crop" }
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
        card.className = 'card bg-white border border-[#c8dfe6] rounded-3xl overflow-hidden';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover">

            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-semibold text-[#1a3a45]">${produto.nome}</h3>
                        <span class="text-xs px-3 py-1 bg-[#f0f7f9] border border-[#0096a0]/30 text-[#0096a0] rounded-full">
                            ${produto.categoria}
                        </span>
                    </div>

                    <div class="text-right">
                        <div class="font-bold text-xl text-[#1a3a45]">R$ ${produto.preco}</div>
                    </div>
                </div>

                <button
                    onclick="adicionarAoCarrinho(${produto.id})"
                    class="mt-3 w-full bg-[#0096a0] hover:bg-[#007a82] text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2">
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

        alert(`${produto.nome} adicionado à reserva!`);
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
            '<p class="text-center py-8 text-[#1a3a45]/50">Sua reserva está vazia.</p>';
    } else {
        carrinho.forEach((item, index) => {
            total += item.preco;

            const itemHTML = `
                <div class="flex gap-4 border-b border-[#c8dfe6] pb-4">
                    <img
                        src="${item.imagem}"
                        class="w-16 h-16 object-cover rounded-xl">

                    <div class="flex-1">
                        <div class="font-semibold text-[#1a3a45]">${item.nome}</div>
                        <div class="text-[#0096a0]">
                            R$ ${item.preco}
                        </div>
                    </div>

                    <button
                        onclick="removerDoCarrinho(${index})"
                        class="text-[#1a3a45]/50 hover:text-[#0096a0]">
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

    alert(`Reserva finalizada com sucesso! Total: R$ ${total.toFixed(2)}\nReserva salva localmente.`);

    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContador();
    fecharCarrinho();
}

// Inicialização
carregarProdutos();