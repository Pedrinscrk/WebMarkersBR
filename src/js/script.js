window.addEventListener('scroll', function() {
    const section = document.getElementById('landing-page-section');
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight / 1.5) {
        section.classList.add('animate-on-scroll');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animado');
                observer.unobserve(entry.target); // Para de observar após a animação ocorrer uma vez
            }
        });
    }, {
        threshold: 0.5 // Ajustei para 0.1 (10%) para talvez ativar um pouco antes
                       // pode manter 0.5 se preferir
    });

    // -------> CORREÇÃO AQUI: Usando a nova classe '.etapa-processo' <-------
    const elementosAnimados = document.querySelectorAll('.etapa-processo');

    elementosAnimados.forEach(elemento => {
        observer.observe(elemento);
    });
});




// Adiciona uma verificação global para garantir que o código de inicialização rode apenas uma vez
// 'window' é usado para que a variável seja acessível em diferentes execuções do script na mesma página
if (!window.whatsappScriptInitialized) {
    window.whatsappScriptInitialized = true; // Marca como inicializado na primeira execução

    document.addEventListener('DOMContentLoaded', function() {

        const whatsappButtons = document.querySelectorAll('.whatsapp-trigger');
        const modalOverlay = document.getElementById('modal-whatsapp-loading');

        const phoneNumber = '5566992524707';
        const whatsappUrl = `https://wa.me/${phoneNumber}`;

        // Variável para armazenar o ID do timer do WhatsApp (agora dentro do escopo que roda uma vez)
        let whatsappTimerId = null;

        // Flag para controlar se o processo de abertura do WhatsApp já está ativo
        // Isso impede que múltiplos cliques iniciem múltiplos timers/aberturas
        let isOpeningProcessActive = false;

        // Função auxiliar para resetar o estado após o processo terminar ou ser cancelado
        function resetWhatsappProcessState() {
            if (whatsappTimerId !== null) {
                clearTimeout(whatsappTimerId); // Cancela o timer pendente, se houver
                whatsappTimerId = null; // Limpa a referência do ID
            }
            isOpeningProcessActive = false; // Permite que um novo processo seja iniciado
            modalOverlay.classList.remove('ativo'); // Esconde o modal
    
        }


        if (modalOverlay) {
            whatsappButtons.forEach(function(button) {
                button.addEventListener('click', function(event) {
                    event.preventDefault();

                    // **Salvaguarda principal:** Se o processo já estiver ativo, ignora cliques adicionais
                    if (isOpeningProcessActive) {
                
                        return; // Sai da função do listener, não faz mais nada
                    }

                    // Se não estiver ativo, inicia o processo
                    isOpeningProcessActive = true;
           


                    // Garante que qualquer timer anterior seja limpo antes de iniciar um novo
                    // (Redundante se isOpeningProcessActive funcionar 100%, mas boa prática)
                     if (whatsappTimerId !== null) {
                          clearTimeout(whatsappTimerId);
                     }


                    // Mostra o modal
                    modalOverlay.classList.add('ativo');

                    // Define o timer para abrir o link
                    whatsappTimerId = setTimeout(function() {
                        // **Salvaguarda:** Verifica a flag novamente antes de abrir a janela
                        if (isOpeningProcessActive) {
                            // Abre o link do WhatsApp em uma nova aba
                            window.open(whatsappUrl, '_blank');
                        }
                    
                        // Reseta o estado APÓS a tentativa de abrir a janela
                        resetWhatsappProcessState();
                    }, 3000); // 3000 milissegundos = 3 segundos
                });
            });

            // Listener para fechar o modal clicando fora do conteúdo
            modalOverlay.addEventListener('click', function(event) {
                // Verifica se o clique foi DIRETAMENTE no overlay (não em um elemento dentro do modal-conteudo)
                if (event.target === modalOverlay) {
                    console.log("Overlay clicado. Cancelando processo.");
                    // Reseta o estado (cancela timer, esconde modal, reseta flag)
                    resetWhatsappProcessState();
                }
            });
        } else {
            console.error("Elemento com ID 'modal-whatsapp-loading' não encontrado.");
             // Mesmo que o modal não exista, a flag `isOpeningProcessActive` ainda ajudaria a limitar múltiplos window.open
        }
    });

} 
// /js/partils/header.js

function toggleMenu() {
    const menu = document.querySelector('.menu-container');
    const toggler = document.querySelector('.navbar-toggler');

    // Verifica se o menu existe antes de tentar manipular
    if (menu && toggler) {
        menu.classList.toggle('active');
        const isExpanded = menu.classList.contains('active'); // Verifica diretamente pela classe
        toggler.setAttribute('aria-expanded', isExpanded);

        // Adiciona ou remove listener para fechar ao clicar no link (se o menu estiver ativo)
        if (isExpanded) {
            addLinkListeners(menu, toggler);
        } else {
            // Opcional: remover listeners se não precisar mais (boa prática se houver muitos links)
        }
    } else {
        console.error("Elemento .menu-container ou .navbar-toggler não encontrado.");
    }
}

// Função separada para adicionar listeners aos links
function addLinkListeners(menu, toggler) {
    menu.querySelectorAll('.menu-links a').forEach(link => {
        // Remove listener antigo para evitar duplicação se toggleMenu for chamado múltiplas vezes
        link.removeEventListener('click', closeMenuOnClick);
        // Adiciona o novo listener
        link.addEventListener('click', () => closeMenuOnClick(menu, toggler), { once: true }); // { once: true } remove o listener após o primeiro clique
    });

     // Adiciona listener ao botão de orçamento também
    const orcamentoBtn = menu.querySelector('.btn-orcamento');
    if (orcamentoBtn) {
         orcamentoBtn.removeEventListener('click', closeMenuOnClick);
         orcamentoBtn.addEventListener('click', () => closeMenuOnClick(menu, toggler), { once: true });
    }
}

// Função para fechar o menu
function closeMenuOnClick(menu, toggler) {
    if (menu && toggler) {
        menu.classList.remove('active');
        toggler.setAttribute('aria-expanded', 'false');
    }
}
// Adiciona listener ao documento para fechar o menu ao clicar fora dele
document.addEventListener('click', function(event) {
    const header = document.querySelector('.navbar');
    const menu = document.querySelector('.menu-container');
    const toggler = document.querySelector('.navbar-toggler');

    // Se o menu está ativo e o clique foi fora do header
    if (menu && menu.classList.contains('active') && !header.contains(event.target)) {
         menu.classList.remove('active');
         toggler.setAttribute('aria-expanded', 'false');
    }
});

// Adiciona listener ao botão toggler inicial
const togglerButton = document.querySelector('.navbar-toggler');
if (togglerButton) {
    togglerButton.addEventListener('click', toggleMenu);
}
