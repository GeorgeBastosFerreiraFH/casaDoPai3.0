import { carregarDashboard } from './dashboard.js';


document.addEventListener('DOMContentLoaded', () => {

    // Elementos do DOM
    const loginForm = document.querySelector('#loginForm');
    const cadastroForm = document.querySelector('#cadastroForm');
    const dashboard = document.querySelector('#dashboard');
    const dashboardContent = document.querySelector('#dashboardContent');

    let tipoUsuarioAtual = 'Administrador';

    // Funções auxiliares
    function mostrarElemento(elemento) {
        elemento.classList.remove('hidden');
        elemento.classList.add('fade-in');
    }

    function ocultarElemento(elemento) {
        elemento.classList.add('hidden');
        elemento.classList.remove('fade-in');
    }

    function trocarFormulario(mostrar, ocultar) {
        ocultarElemento(ocultar);
        mostrarElemento(mostrar);
        
        // Adicionar efeito de flip
        ocultar.classList.add('flip-card');
        mostrar.classList.add('flip-card');
        
        setTimeout(() => {
            ocultar.classList.add('flipped');
            mostrar.classList.remove('flipped');
        }, 50);
        
        setTimeout(() => {
            ocultar.classList.remove('flip-card', 'flipped');
            mostrar.classList.remove('flip-card');
        }, 600);
    }


    // Alternância entre formulários
    document.querySelector('#linkCadastro').addEventListener('click', () => trocarFormulario(cadastroForm, loginForm));
    document.querySelector('#linkVoltarLogin').addEventListener('click', () => trocarFormulario(loginForm, cadastroForm));

    // Função para alternar visibilidade da senha
    function toggleSenhaVisibilidade(inputId, buttonId) {
        const senhaInput = document.querySelector(`#${inputId}`);
        const toggleButton = document.querySelector(`#${buttonId}`);
        
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            `;
        } else {
            senhaInput.type = 'password';
            toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
            `;
        }
    }

    document.querySelector('#toggleSenhaLogin').addEventListener('click', () => toggleSenhaVisibilidade('senhalogin', 'toggleSenhaLogin'));
    document.querySelector('#toggleSenhaCadastro').addEventListener('click', () => toggleSenhaVisibilidade('senhaCadastro', 'toggleSenhaCadastro'));
    document.querySelector('#toggleConfirmeSenhaCadastro').addEventListener('click', () => toggleSenhaVisibilidade('confirmeSenhaCadastro', 'toggleConfirmeSenhaCadastro'));

    // Lógica para força da senha
    const senhaCadastro = document.querySelector('#senhaCadastro');
    const confirmeSenhaCadastro = document.querySelector('#confirmeSenhaCadastro');
    const forcaSenha = document.querySelector('#forcaSenha');
    const forcaSenhaTexto = document.querySelector('#forcaSenhaTexto');

    function verificarForcaSenha() {
        const senha = senhaCadastro.value;
        const confirmeSenha = confirmeSenhaCadastro.value;
        let forca = 0;

        if (senha.length >= 8) forca += 25;
        if (senha.match(/[a-z]+/)) forca += 25;
        if (senha.match(/[A-Z]+/)) forca += 25;
        if (senha.match(/[0-9]+/)) forca += 25;
        if (senha.match(/[$@#&!]+/)) forca += 25;

        // Verifica se a senha e a confirmação são diferentes
        if (senha !== confirmeSenha) {
            forca = 0; // Define a força como 0 se as senhas forem diferentes
            forcaSenhaTexto.textContent = 'As senhas não coincidem';
            forcaSenha.className = 'progress progress-error'; // Adiciona classe de erro
            return false; // Indica que as senhas não coincidem
        } else {
            forcaSenhaTexto.textContent = ''; // Limpa a mensagem de erro
            // Aumenta a força da senha se as senhas coincidirem
            forca += 25;
        }

        forcaSenha.value = forca;

        if (forca >= 100) {
            forcaSenhaTexto.textContent = 'Força da senha: Muito Forte';
            forcaSenha.className = 'progress progress-success';
        } else if (forca >= 75) {
            forcaSenhaTexto.textContent = 'Força da senha: Forte';
            forcaSenha.className = 'progress progress-success';
        } else if (forca >= 50) {
            forcaSenhaTexto.textContent = 'Força da senha: Média';
            forcaSenha.className = 'progress progress-warning';
        } else if (forca >= 25) {
            forcaSenhaTexto.textContent = 'Força da senha: Fraca';
            forcaSenha.className = 'progress progress-error';
        } else {
            forcaSenhaTexto.textContent = 'Força da senha: Muito Fraca';
            forcaSenha.className = 'progress progress-error';
        }

        return true; // Indica que as senhas coincidem
    }

    // Lógica para mostrar/ocultar campos de ministério e célula
    document.querySelector('#participaMinisterio').addEventListener('change', function() {
        const selectMinisterio = document.querySelector('#selectMinisterio');
        if (this.checked) {
            mostrarElemento(selectMinisterio);
        } else {
            ocultarElemento(selectMinisterio);
        }
    });

    document.getElementById('btnLogin').addEventListener('click', async function() {
        const usuario = document.getElementById('loginUsuario').value.trim();
        const senha = document.getElementById('senhalogin').value.trim();
    
        if (!usuario || !senha) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
    
        if (usuario === 'Administrador' && senha === 'Password321@') {
            loginSucesso('Administrador', null, null);
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: usuario, senha: senha }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || data.message || 'Erro ao autenticar usuário');
            }
    
            // Chama loginSucesso com os dados retornados
            loginSucesso(data.usuario.tipoUsuario, data.usuario.id, data.usuario.idCelula);
        } catch (error) {
            console.error('Erro detalhado ao fazer login:', error);
            alert(`Erro ao autenticar: ${error.message}`);
        }
    });
    

function loginSucesso(tipoUsuario, idUsuario, idCelula) {
    console.log('Login bem-sucedido:', { tipoUsuario, idUsuario, idCelula });
    const loginForm = document.querySelector('#loginForm');
    const dashboard = document.querySelector('#dashboard');
    ocultarElemento(loginForm);
    mostrarElemento(dashboard);
    // Garantir que idUsuario e idCelula sejam números ou null
    idUsuario = idUsuario ? parseInt(idUsuario) : null;
    idCelula = idCelula ? parseInt(idCelula) : null;
    carregarDashboard(tipoUsuario, idUsuario, idCelula);
}

    



    // Função de logout
    document.querySelector('#btnLogout').addEventListener('click', function() {
        ocultarElemento(dashboard);
        mostrarElemento(loginForm);
        // Limpar campos de login
        document.querySelector('#loginUsuario').value = '';
        document.querySelector('#senhalogin').value = '';
    });

    // Recuperar configuração de modo escuro do localStorage
    const html = document.documentElement;
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    // Aplicar o tema ao carregar a página
    if (isDarkMode) {
        html.setAttribute("data-theme", "dark");
    } else {
        html.setAttribute("data-theme", "light");
    }

    // Evento para alternar o modo
    document.querySelector('#btnToggleDarkMode').addEventListener('click', function() {
        if (html.getAttribute('data-theme') === 'dark') {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem("darkMode", "false"); // Salvar no localStorage
        } else {
            html.setAttribute('data-theme', 'dark');
            localStorage.setItem("darkMode", "true"); // Salvar no localStorage
        }
    });

    // Função para formatar telefone

    function mascaraTelefone(event) {
        const input = event.target;
        let valor = input.value.replace(/\D/g, '');
        const tamanho = valor.length;

        if (tamanho > 14) {
            valor = valor.slice(0, 14);
        }

        let formato = '';
        if (tamanho > 10) {
            formato = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
        } else if (tamanho > 2) {
            formato = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}`;
            if (tamanho >= 7) {
                formato += `-${valor.slice(7)}`;
            }
        } else if (tamanho > 0) {
            formato = `(${valor.slice(0, 2)}`;
        }

        input.value = formato;
    }

    // Torne a função global
    window.mascaraTelefone = mascaraTelefone;





    // Função para verificar se os campos estão vazios
    function camposVaziosValidos(campos) {
        const vazios = campos.filter(campo => !document.querySelector(`#${campo}`).value.trim());
        if (vazios.length > 0) {
            alert(`Por favor, preencha os seguintes campos: ${vazios.join(', ')}.`);
            return true; // Indica que há campos vazios
        }
        return false; // Todos os campos estão preenchidos
    }

    // Função para verificar se as senhas coincidem
    function senhasCoincidem(senha, confirmeSenha) {
        if (senha !== confirmeSenha) {
            forcaSenhaTexto.textContent = 'As senhas não coincidem';
            forcaSenha.className = 'progress progress-error';
            return false; // Indica que as senhas não coincidem
        }
        forcaSenhaTexto.textContent = ''; // Limpa a mensagem de erro
        return true; // Indica que as senhas coincidem
    }

    // Exemplo de verificação para o checkbox de "Participa de algum ministério"
    const participaMinisterioCheckbox = document.querySelector('#participaMinisterio');
    if (participaMinisterioCheckbox) {
        if (participaMinisterioCheckbox.checked) {
            // A lógica para quando o checkbox estiver marcado
        } else {
            // A lógica para quando o checkbox não estiver marcado
        }
    } else {
        console.error('Checkbox "Participa de algum ministério" não encontrado.');
    }


    document.querySelector('#participaCelula').addEventListener('change', function() {
        const selectCelula = document.querySelector('#selectCelula');
        if (this.checked) {
            mostrarElemento(selectCelula);
        } else {
            ocultarElemento(selectCelula);
            // Resetar o valor do campo caso o checkbox seja desmarcado
            document.querySelector('#selectCelula').value = '';
        }
    });

    // Evento da tecla ENTER

    document.querySelector('#loginForm').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita o comportamento padrão do Enter
            document.querySelector('#btnLogin').click(); // Simula o clique no botão de login
        }
    });

    document.querySelector('#cadastroForm').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita o comportamento padrão do Enter
            document.querySelector('#btnCadastrar').click(); // Simula o clique no botão de login
        }
    });

    
    // Código de cadastro atualizado
    document.querySelector('#btnCadastrar').addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Botão de cadastrar clicado!');
    
        if (!verificarForcaSenha()) return;
    
        const nomeCompleto = document.querySelector('#nomeCompleto').value.trim();
        const dataNascimento = document.querySelector('#dataNascimento').value.trim();
        const email = document.querySelector('#email').value.trim();
        const telefone = document.querySelector('#telefone').value.trim();
        const senhaCadastro = document.querySelector('#senhaCadastro').value.trim();
        const confirmeSenha = document.querySelector('#confirmeSenhaCadastro').value.trim();
    
        if (camposVaziosValidos(['nomeCompleto', 'dataNascimento', 'email', 'telefone', 'senhaCadastro'])) return;
    
        if (!senhasCoincidem(senhaCadastro, confirmeSenha)) return;
    
        const tipoUsuario = 'UsuarioComum';
    
        const concluiuBatismo = document.querySelector('#concluiuBatismo')?.checked || false;
        const participouCafe = document.querySelector('#participouCafe')?.checked || false;
        const participaMinisterio = document.querySelector('#participaMinisterio')?.checked || false;
        const participaCelula = document.querySelector('#participaCelula')?.checked || false;
    
        const cursosConcluidos = {
            cursoMeuNovoCaminho: document.querySelector('#cursoMeuNovoCaminho')?.checked || false,
            cursoVidaDevocional: document.querySelector('#cursoVidaDevocional')?.checked || false,
            cursoFamiliaCrista: document.querySelector('#cursoFamiliaCrista')?.checked || false,
            cursoVidaProsperidade: document.querySelector('#cursoVidaProsperidade')?.checked || false,
            cursoPrincipiosAutoridade: document.querySelector('#cursoPrincipiosAutoridade')?.checked || false,
            cursoVidaEspirito: document.querySelector('#cursoVidaEspirito')?.checked || false,
            cursoCaraterCristo: document.querySelector('#cursoCaraterCristo')?.checked || false,
            cursoIdentidadesRestauradas: document.querySelector('#cursoIdentidadesRestauradas')?.checked || false,
        };
    
        const nomeMinisterio = document.querySelector('#selectMinisterio').value.trim();
        const idCelula = document.querySelector('#selectCelula').value.trim();
    
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nomeCompleto,
                dataNascimento,
                email,
                telefone,
                concluiuBatismo,
                participouCafe,
                participaMinisterio,
                nomeMinisterio,
                participaCelula,
                idCelula,
                ...cursosConcluidos,
                senhaCadastro,
                tipoUsuario
            })
        });
    
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            mostrarElemento(loginForm);
            ocultarElemento(cadastroForm);
        } else {
            alert('Erro ao cadastrar usuário. Tente novamente.');
        }
    });    
    carregarDashboard(tipoUsuarioAtual);
});