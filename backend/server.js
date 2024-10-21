const express = require('express');
const pool = require('./db');
const app = express();
const bcrypt = require('bcrypt');
const cors = require('cors');
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota para buscar todos os usuários (Acesso: Administrador)
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.*, c.nomeCelula AS nomeCelula 
            FROM usuarios u 
            LEFT JOIN celulas c ON u.idCelula = c.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});


// Rota para obter usuários da célula do líder
app.get('/celulas/:idCelula/usuarios', async (req, res) => {
    const { idCelula } = req.params;
    console.log('Buscando usuários para a célula:', idCelula);
    try {
        const [usuarios] = await pool.query(`
            SELECT u.*, c.nomeCelula AS nomeCelula 
            FROM usuarios u 
            LEFT JOIN celulas c ON u.idCelula = c.id 
            WHERE u.idCelula = ? AND u.tipoUsuario = 'UsuarioComum'`, [idCelula]);

        console.log('Usuários encontrados:', usuarios);

        if (usuarios.length === 0) {
            console.log('Nenhum usuário encontrado para esta célula');
            return res.status(404).json({ error: 'Nenhum usuário encontrado para esta célula' });
        }
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários da célula:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários da célula' });
    }
});


// Rota para buscar os dados de um usuário específico
app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`
            SELECT u.*, c.nomeCelula, l.nomeCompleto AS nomeLider 
            FROM usuarios u
            LEFT JOIN celulas c ON u.idCelula = c.id
            LEFT JOIN usuarios l ON u.idLiderCelula = l.id
            WHERE u.id = ?`, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        console.log('Usuário encontrado:', rows[0]);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário', detalhes: error.message });
    }
});



// Rota para cadastrar um novo usuário
app.post('/usuarios', async (req, res) => {
    const {
        nomeCompleto,
        dataNascimento,
        email,
        telefone,
        senhaCadastro,
        tipoUsuario,
        concluiuBatismo,
        participouCafe,
        participaMinisterio,
        nomeMinisterio,
        idCelula,
        participaCelula,
        cursoMeuNovoCaminho,
        cursoVidaDevocional,
        cursoFamiliaCrista,
        cursoVidaProsperidade,
        cursoPrincipiosAutoridade,
        cursoVidaEspirito,
        cursoCaraterCristo,
        cursoIdentidadesRestauradas,
    } = req.body;

    console.log('Dados recebidos:', req.body);

    try {
        const hashedPassword = await bcrypt.hash(senhaCadastro, 10);

        const [result] = await pool.query(`
            INSERT INTO usuarios (
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
                cursoMeuNovoCaminho, 
                cursoVidaDevocional, 
                cursoFamiliaCrista, 
                cursoVidaProsperidade, 
                cursoPrincipiosAutoridade, 
                cursoVidaEspirito, 
                cursoCaraterCristo, 
                cursoIdentidadesRestauradas, 
                senhaCadastro,
                tipoUsuario
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
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
            cursoMeuNovoCaminho, 
            cursoVidaDevocional, 
            cursoFamiliaCrista, 
            cursoVidaProsperidade, 
            cursoPrincipiosAutoridade, 
            cursoVidaEspirito, 
            cursoCaraterCristo, 
            cursoIdentidadesRestauradas, 
            hashedPassword,
            tipoUsuario
        ]);

        console.log('Resultado da inserção:', result);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', id: result.insertId });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const {
        nomeCompleto,
        dataNascimento,
        email,
        telefone,
        senhaCadastro,
        tipoUsuario,
        concluiuBatismo,
        participouCafe,
        participaMinisterio,
        nomeMinisterio,
        participaCelula,
        cursoMeuNovoCaminho,
        cursoVidaDevocional,
        cursoFamiliaCrista,
        cursoVidaProsperidade,
        cursoPrincipiosAutoridade,
        cursoVidaEspirito,
        cursoCaraterCristo,
        cursoIdentidadesRestauradas,
    } = req.body;

    try {
        // Verifica se a senha foi fornecida e, se sim, cria um hash para ela
        let hashedPassword = null;
        if (senhaCadastro) {
            hashedPassword = await bcrypt.hash(senhaCadastro, 10);
        }

        // Atualiza todos os campos que foram recebidos na requisição
        const [result] = await pool.query(`
            UPDATE usuarios SET
                nomeCompleto = COALESCE(?, nomeCompleto),
                dataNascimento = COALESCE(?, dataNascimento),
                email = COALESCE(?, email),
                telefone = COALESCE(?, telefone),
                senhaCadastro = COALESCE(?, senhaCadastro),
                tipoUsuario = COALESCE(?, tipoUsuario),
                concluiuBatismo = COALESCE(?, concluiuBatismo),
                participouCafe = COALESCE(?, participouCafe),
                participaMinisterio = COALESCE(?, participaMinisterio),
                nomeMinisterio = COALESCE(?, nomeMinisterio),
                participaCelula = COALESCE(?, participaCelula),
                cursoMeuNovoCaminho = COALESCE(?, cursoMeuNovoCaminho),
                cursoVidaDevocional = COALESCE(?, cursoVidaDevocional),
                cursoFamiliaCrista = COALESCE(?, cursoFamiliaCrista),
                cursoVidaProsperidade = COALESCE(?, cursoVidaProsperidade),
                cursoPrincipiosAutoridade = COALESCE(?, cursoPrincipiosAutoridade),
                cursoVidaEspirito = COALESCE(?, cursoVidaEspirito),
                cursoCaraterCristo = COALESCE(?, cursoCaraterCristo),
                cursoIdentidadesRestauradas = COALESCE(?, cursoIdentidadesRestauradas)
            WHERE id = ?`, [
                nomeCompleto,
                dataNascimento,
                email,
                telefone,
                hashedPassword,
                tipoUsuario,
                concluiuBatismo,
                participouCafe,
                participaMinisterio,
                nomeMinisterio,
                participaCelula,
                cursoMeuNovoCaminho,
                cursoVidaDevocional,
                cursoFamiliaCrista,
                cursoVidaProsperidade,
                cursoPrincipiosAutoridade,
                cursoVidaEspirito,
                cursoCaraterCristo,
                cursoIdentidadesRestauradas,
                id
            ]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});


// Rota para autenticação de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    console.log('Tentativa de login para:', email);

    try {
        // Recupera o usuário pelo email
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            console.log('Usuário não encontrado');
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const usuario = usuarios[0];

        // Compara a senha fornecida com a senha armazenada
        const match = await bcrypt.compare(senha, usuario.senhaCadastro);

        if (!match) {
            console.log('Senha incorreta');
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Verifica se o usuário é líder de célula e recupera o idCelula
        let idCelula = usuario.idCelula || null; // Se o campo idCelula existir diretamente na tabela usuários

        // Log de sucesso
        console.log('Login bem-sucedido:', { 
            id: usuario.id, 
            nome: usuario.nomeCompleto, 
            tipoUsuario: usuario.tipoUsuario,
            idCelula: idCelula 
        });

        // Retorna os dados do usuário autenticado
        res.status(200).json({ 
            message: 'Login bem-sucedido', 
            usuario: { 
                id: usuario.id, 
                nome: usuario.nomeCompleto, 
                tipoUsuario: usuario.tipoUsuario,
                idCelula: idCelula 
            } 
        });
    } catch (error) {
        console.error('Erro detalhado ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login', detalhes: error.message });
    }
});


// Rota para deletar um usuário (Acesso: Administrador)
app.delete('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Tentando deletar usuário com ID:', id);
    try {
        // Primeiro, remova as referências nas tabelas relacionadas
        await pool.query('DELETE FROM usuarios_celulas WHERE idUsuario = ?', [id]);
        await pool.query('DELETE FROM usuarios_ministerios WHERE idUsuario = ?', [id]);
        await pool.query('DELETE FROM lideres_celulas WHERE idLiderCelula = ?', [id]);

        // Agora, delete o usuário
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        
        console.log('Resultado da exclusão:', result);

        if (result.affectedRows === 0) {
            console.log('Usuário não encontrado para exclusão');
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro detalhado ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário', detalhes: error.message });
    }
});

// Rota para tornar um usuário líder de célula
app.put('/usuarios/:id/tornar-lider', async (req, res) => {
    const { id } = req.params;
    console.log(`Tentando tornar usuário ${id} líder de célula`);

    try {
        // Verifica se o usuário existe
        const [usuario] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const usuarioAtual = usuario[0];

        // Verifica se o usuário já é Líder de Célula
        if (usuarioAtual.tipoUsuario === 'LiderCelula') {
            return res.status(400).json({ error: 'Usuário já é líder de célula' });
        }

        // Verifica se o usuário está associado a uma célula
        if (!usuarioAtual.idCelula) {
            return res.status(400).json({ error: 'O usuário não está associado a nenhuma célula' });
        }

        // Atualiza o tipo de usuário para Líder de Célula
        await pool.query('UPDATE usuarios SET tipoUsuario = ? WHERE id = ?', ['LiderCelula', id]);

        // Remove qualquer associação anterior do usuário como líder
        await pool.query('DELETE FROM lideres_celulas WHERE idLiderCelula = ?', [id]);

        // Insere o novo líder na tabela lideres_celulas
        await pool.query('INSERT INTO lideres_celulas (idLiderCelula, idCelula, dataInicio) VALUES (?, ?, CURDATE())', [id, usuarioAtual.idCelula]);

        // Atualiza todos os usuários da mesma célula para terem este líder
        await pool.query('UPDATE usuarios SET idLiderCelula = ? WHERE idCelula = ? AND id != ?', [id, usuarioAtual.idCelula, id]);

        console.log(`Usuário ${id} promovido a líder da célula ${usuarioAtual.idCelula} com sucesso`);
        res.status(200).json({ message: 'Usuário promovido a líder de célula com sucesso' });
    } catch (error) {
        console.error('Erro ao promover usuário a líder:', error);
        res.status(500).json({ error: 'Erro ao promover usuário a líder', detalhes: error.message });
    }
});



// Rota para rebaixar um usuário para usuário comum
app.put('/usuarios/:id/rebaixar-lider', async (req, res) => {
    const { id } = req.params;
    console.log(`Tentando rebaixar líder ${id} para usuário comum`);

    try {
        // Verifica se o usuário existe e é um líder
        const [usuario] = await pool.query('SELECT * FROM usuarios WHERE id = ? AND tipoUsuario = ?', [id, 'LiderCelula']);
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Líder não encontrado' });
        }

        // Atualiza o tipo de usuário para Usuário Comum
        await pool.query('UPDATE usuarios SET tipoUsuario = ? WHERE id = ?', ['UsuarioComum', id]);

        // Remove o líder da tabela lideres_celulas
        await pool.query('DELETE FROM lideres_celulas WHERE idLiderCelula = ?', [id]);

        console.log(`Usuário ${id} rebaixado para usuário comum com sucesso`);
        res.status(200).json({ message: 'Usuário rebaixado para usuário comum com sucesso' });
    } catch (error) {
        console.error('Erro ao rebaixar usuário:', error);
        res.status(500).json({ error: 'Erro ao rebaixar usuário', detalhes: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
