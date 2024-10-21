// Elementos do DOM
const dashboard = document.querySelector('#dashboard');
const dashboardContent = document.querySelector('#dashboardContent');
const modalContainer = document.querySelector('#modalContainer');
const modalTitle = document.querySelector('#modalTitle');
const modalContent = document.querySelector('#modalContent');
const btnCloseModal = document.querySelector('#btnCloseModal');
const btnLogout = document.querySelector('#btnLogout');

// Variáveis globais
let tipoUsuarioAtual = '';
let idUsuarioAtual = null;
let idCelulaAtual = null;

// Funções auxiliares
function mostrarElemento(elemento) {
    elemento.classList.remove('hidden');
}

function ocultarElemento(elemento) {
    elemento.classList.add('hidden');
}


// Função para carregar o conteúdo do dashboard
export function carregarDashboard(tipoUsuario, idUsuario, idCelula) {
    tipoUsuarioAtual = tipoUsuario;
    idUsuarioAtual = idUsuario;
    idCelulaAtual = idCelula;
    
    console.log('Carregando dashboard:', { tipoUsuario, idUsuario, idCelula });

    let url = 'http://localhost:3000/usuarios';
    
    if (tipoUsuario === 'LiderCelula' && idCelula) {
        url = `http://localhost:3000/celulas/${idCelula}/usuarios`;
    } else if (tipoUsuario === 'UsuarioComum') {
        url = `http://localhost:3000/usuarios/${idUsuario}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta da rede não foi ok');
            }
            return response.json();
        })
        .then(dados => {
            console.log('Dados recebidos:', dados);
            let conteudo = '';
            switch (tipoUsuario) {
                case 'Administrador':
                    conteudo = gerarConteudoAdmin(dados);
                    break;
                case 'LiderCelula':
                    conteudo = gerarConteudoLider(dados);
                    break;
                case 'UsuarioComum':
                    conteudo = gerarConteudoUsuario(dados);
                    break;
            }
            dashboardContent.innerHTML = conteudo;
            adicionarEventosDashboard();
        })
        .catch(error => {
            console.error('Erro ao carregar os dados da dashboard:', error);
            dashboardContent.innerHTML = '<p class="text-red-500">Erro ao carregar os dados. Por favor, tente novamente mais tarde.</p>';
        });
}


function gerarConteudoAdmin(dados) {
    let html = '<h2 class="text-2xl font-bold mb-4">Painel do Administrador</h2>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    
    dados.forEach(usuario => {
        html += `
            <div class="card bg-base-100 shadow-xl user-card">
                <div class="card-body">
                    <h3 class="card-title">${usuario.nomeCompleto}</h3>
                    <p>Email: ${usuario.email}</p>
                    <p>Tipo: ${usuario.tipoUsuario}</p>
                    <p>Célula: ${usuario.nomeCelula || 'Não associado'}</p> <!-- Esta linha já está correta -->
                    <div class="card-actions justify-end mt-2">
                        <button class="btn btn-primary btn-sm btn-detalhes" data-id="${usuario.id}">Detalhes</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function gerarConteudoLider(dados) {
    let html = '<h2 class="text-2xl font-bold mb-4">Painel do Líder de Célula</h2>';
    
    if (!Array.isArray(dados) || dados.length === 0) {
        html += '<p>Nenhum membro encontrado para esta célula.</p>';
    } else {
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        dados.forEach(usuario => {
            html += `
                <div class="card bg-base-100 shadow-xl user-card">
                    <div class="card-body">
                        <h3 class="card-title">${usuario.nomeCompleto}</h3>
                        <p>Email: ${usuario.email}</p>
                        <p>Célula: ${usuario.nomeCelula || 'Não associado'}</p>
                        <div class="card-actions justify-end mt-2">
                            <button class="btn btn-primary btn-sm btn-detalhes" data-id="${usuario.id}">Detalhes</button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    return html;
}


function gerarConteudoUsuario(dados) {
    const usuario = dados;
    let html = '<h2 class="text-2xl font-bold mb-4">Meu Perfil</h2>';
    html += `
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h3 class="card-title">${usuario.nomeCompleto}</h3>
                <p>Email: ${usuario.email}</p>
                <p>Telefone: ${usuario.telefone}</p>
                <p>Célula: ${usuario.nomeCelula || 'Não participa'}</p> <!-- Aqui também -->
                <div class="card-actions justify-end mt-2">
                    <button class="btn btn-primary btn-sm btn-detalhes" data-id="${usuario.id}">Ver Mais Detalhes</button>
                </div>
            </div>
        </div>
    `;
    return html;
}


function adicionarEventosDashboard() {
    const btnDetalhes = document.querySelectorAll('.btn-detalhes');
    btnDetalhes.forEach(btn => {
        btn.addEventListener('click', () => mostrarDetalhesUsuario(btn.dataset.id));
    });
}


function mostrarDetalhesUsuario(id) {
    if (!id) {
        console.error('ID do usuário não definido');
        alert('Erro: ID do usuário não definido');
        return;
    }

    fetch(`http://localhost:3000/usuarios/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(usuario => {
            modalTitle.textContent = `Detalhes de ${usuario.nomeCompleto}`;
            const conteudoModal = document.querySelector('#conteudoDetalhesUsuario').innerHTML;
            modalContent.innerHTML = conteudoModal;
            
            // Preencher os detalhes do usuário
            document.querySelector('#detalhesEmail').textContent = usuario.email || 'Não disponível';
            document.querySelector('#detalhesTelefone').textContent = usuario.telefone || 'Não disponível';
            document.querySelector('#detalhesDataNascimento').textContent = usuario.dataNascimento ? new Date(usuario.dataNascimento).toLocaleDateString() : 'Não disponível';
            document.querySelector('#detalhesTipoUsuario').textContent = usuario.tipoUsuario || 'Não disponível';
            document.querySelector('#detalhesConcluiuBatismo').textContent = usuario.concluiuBatismo ? 'Sim' : 'Não';
            document.querySelector('#detalhesParticipouCafe').textContent = usuario.participouCafe ? 'Sim' : 'Não';
            document.querySelector('#detalhesParticipaMinisterio').textContent = usuario.participaMinisterio ? 'Sim' : 'Não';
            document.querySelector('#detalhesMinisterio').textContent = usuario.nomeMinisterio || 'Não participa';
            document.querySelector('#detalhesParticipaCelula').textContent = usuario.participaCelula ? 'Sim' : 'Não';
            document.querySelector('#detalhesCelula').textContent = usuario.nomeCelula || 'Não participa';


            // Preencher cursos concluídos
            const listaCursos = document.querySelector('#listaCursosConcluidos');
            listaCursos.innerHTML = '';
            if (usuario.cursoMeuNovoCaminho) listaCursos.innerHTML += '<li>Meu Novo Caminho</li>';
            if (usuario.cursoVidaDevocional) listaCursos.innerHTML += '<li>Vida Devocional</li>';
            if (usuario.cursoFamiliaCrista) listaCursos.innerHTML += '<li>Família Cristã</li>';
            if (usuario.cursoVidaProsperidade) listaCursos.innerHTML += '<li>Vida de Prosperidade</li>';
            if (usuario.cursoPrincipiosAutoridade) listaCursos.innerHTML += '<li>Princípios de Autoridade</li>';
            if (usuario.cursoVidaEspirito) listaCursos.innerHTML += '<li>Vida no Espírito</li>';
            if (usuario.cursoCaraterCristo) listaCursos.innerHTML += '<li>Caráter de Cristo</li>';
            if (usuario.cursoIdentidadesRestauradas) listaCursos.innerHTML += '<li>Identidades Restauradas</li>';

            // Adicionar botões de ação conforme o tipo de usuário
            const acoesUsuario = document.querySelector('#acoesUsuario');
            if (tipoUsuarioAtual === 'Administrador' || (tipoUsuarioAtual === 'LiderCelula' && usuario.tipoUsuario !== 'Administrador')) {
                acoesUsuario.innerHTML = `
                    <button class="btn btn-primary btn-sm mr-2" onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button class="btn btn-error btn-sm mr-2" onclick="deletarUsuario(${usuario.id})">Deletar</button>
                `;
                
                if (tipoUsuarioAtual === 'Administrador') {
                    if (usuario.tipoUsuario !== 'Administrador' && usuario.tipoUsuario !== 'LiderCelula') {
                        acoesUsuario.innerHTML += `
                            <button class="btn btn-info btn-sm" onclick="tornarLider(${usuario.id})">Tornar Líder</button>
                        `;
                    } else if (usuario.tipoUsuario === 'LiderCelula') {
                        acoesUsuario.innerHTML += `
                            <button class="btn btn-warning btn-sm" onclick="rebaixarLider(${usuario.id})">Rebaixar para Usuário Comum</button>
                        `;
                    }
                }
            }

            modalContainer.classList.add('modal-open');
        })
        .catch(error => {
            console.error('Erro ao carregar detalhes do usuário:', error);
            alert(`Erro ao carregar detalhes do usuário: ${error.message}`);
        });
}


function editarUsuario(id) {
    fetch(`http://localhost:3000/usuarios/${id}`)
        .then(response => response.json())
        .then(usuario => {
            modalTitle.textContent = `Editar ${usuario.nomeCompleto}`;
            modalContent.innerHTML = `
                <form id="formEditarUsuario">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Nome Completo</span>
                            </label>
                            <input type="text" id="editNomeCompleto" class="input input-bordered" value="${usuario.nomeCompleto}" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Email</span>
                            </label>
                            <input type="email" id="editEmail" class="input input-bordered" value="${usuario.email}" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Telefone</span>
                            </label>
                            <input type="tel" id="editTelefone" class="input input-bordered" value="${usuario.telefone}" required>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Data de Nascimento</span>
                            </label>
                            <input type="date" id="editDataNascimento" class="input input-bordered" value="${new Date(usuario.dataNascimento).toISOString().split('T')[0]}" required>
                        </div>
                    </div>
                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </div>
                </form>
            `;

            document.querySelector('#formEditarUsuario').addEventListener('submit', (e) => {
                e.preventDefault();
                const dadosAtualizados = {
                    nomeCompleto: document.querySelector('#editNomeCompleto').value,
                    email: document.querySelector('#editEmail').value,
                    telefone: document.querySelector('#editTelefone').value,
                    dataNascimento: document.querySelector('#editDataNascimento').value,
                };

                fetch(`http://localhost:3000/usuarios/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosAtualizados),
                })
                .then(response => response.json())
                .then(data => {
                    alert('Usuário atualizado com sucesso!');
                    fecharModal();
                    carregarDashboard(tipoUsuarioAtual);
                })
                .catch(error => {
                    console.error('Erro ao atualizar usuário:', error);
                    alert('Erro ao atualizar usuário');
                });
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados para edição:', error);
            modalContent.innerHTML = '<p class="text-red-500">Erro ao carregar dados para edição. Por favor, tente novamente.</p>';
        });
}

function deletarUsuario(id) {
    if (!id) {
        console.error('ID do usuário não definido');
        alert('Erro: ID do usuário não definido');
        return;
    }

    if (confirm('Tem certeza que deseja deletar este usuário?')) {
        fetch(`http://localhost:3000/usuarios/${id}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {throw err;});
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta do servidor:', data);
                alert('Usuário deletado com sucesso');
                fecharModal();
                carregarDashboard(tipoUsuarioAtual, idUsuarioAtual, idCelulaAtual);
            })
            .catch(error => {
                console.error('Erro detalhado ao deletar usuário:', error);
                alert(`Erro ao deletar usuário: ${error.detalhes || error.message || 'Erro desconhecido'}`);
            });
    }
}


function tornarLider(id) {
    if (!id) {
        console.error('ID do usuário não definido');
        alert('Erro: ID do usuário não definido');
        return;
    }

    if (confirm('Tem certeza que deseja tornar este usuário um líder de célula?')) {
        const tornarLiderBtn = document.querySelector(`#btnTornarLider${id}`);
        if (tornarLiderBtn) tornarLiderBtn.disabled = true; // Desabilita o botão para evitar múltiplos cliques

        fetch(`http://localhost:3000/usuarios/${id}/tornar-lider`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Usuário promovido a líder de célula com sucesso');
            fecharModal();
            carregarDashboard(tipoUsuarioAtual, idUsuarioAtual, idCelulaAtual);
        })
        .catch(error => {
            console.error('Erro ao promover usuário:', error);
            alert(`Erro ao promover usuário: ${error.detalhes || error.message || 'Erro desconhecido'}`);
        })
        .finally(() => {
            if (tornarLiderBtn) tornarLiderBtn.disabled = false; // Reabilita o botão após a operação
        });
    }
}


function rebaixarLider(id) {
    if (confirm('Tem certeza que deseja rebaixar este líder para usuário comum?')) {
        fetch(`http://localhost:3000/usuarios/${id}/rebaixar-lider`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {throw err;});
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Usuário rebaixado para usuário comum com sucesso');
            fecharModal();
            carregarDashboard(tipoUsuarioAtual, idUsuarioAtual, idCelulaAtual);
        })
        .catch(error => {
            console.error('Erro ao rebaixar usuário:', error);
            alert(`Erro ao rebaixar usuário: ${error.detalhes || error.message || 'Erro desconhecido'}`);
        });
    }
}
// Função para fechar o modal
function fecharModal() {
    modalContainer.classList.remove('modal-open');
    modalTitle.textContent = '';
    modalContent.innerHTML = '';
}

// Evento para fechar o modal quando o botão de fechar é clicado
btnCloseModal.addEventListener('click', fecharModal);

// Evento para fechar o modal clicando fora do conteúdo do modal
modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        fecharModal();
    }
});

// Função que desloga da dashboard e limpa os campos
document.querySelector('#btnLogout').addEventListener('click', function() {
    ocultarElemento(dashboard);
    mostrarElemento(loginForm);
    // Limpar campos de login
    document.querySelector('#loginUsuario').value = '';
    document.querySelector('#senhalogin').value = '';
});

// Inicialização da dashboard
carregarDashboard(tipoUsuarioAtual);

// Tornar as funções globais para que possam ser chamadas pelo onclick no HTML
window.editarUsuario = editarUsuario;
window.deletarUsuario = deletarUsuario;
window.tornarLider = tornarLider;
window.rebaixarLider = rebaixarLider;
window.fecharModal = fecharModal;