CREATE DATABASE casaDoPai;

USE casaDoPai;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCompleto VARCHAR(100),
    dataNascimento DATE,
    email VARCHAR(100),
    telefone VARCHAR(50),
    concluiuBatismo BOOL,
    participouCafe BOOL,
    participaMinisterio BOOL,
    nomeMinisterio VARCHAR(100),
    participaCelula BOOL,
    nomeCelula VARCHAR(100),
    cursoMeuNovoCaminho BOOL,
    cursoVidaDevocional BOOL,
    cursoFamiliaCrista BOOL,
    cursoVidaProsperidade BOOL,
    cursoPrincipiosAutoridade BOOL,
    cursoVidaEspirito BOOL,
    cursoCaraterCristo BOOL,
    cursoIdentidadesRestauradas BOOL,
    senhaCadastro VARCHAR(255),
    tipoUsuario ENUM('Administrador', 'LiderCelula', 'UsuarioComum') DEFAULT 'UsuarioComum',
    idLiderCelula INT, -- FK para vincular ao líder da célula
    FOREIGN KEY (idLiderCelula) REFERENCES usuarios(id) -- Relação com o líder da célula
);

CREATE TABLE celulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCelula VARCHAR(100) NOT NULL,
    idLiderCelula INT, -- FK para vincular ao líder da célula
    FOREIGN KEY (idLiderCelula) REFERENCES usuarios(id)
);

CREATE TABLE ministerios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeMinisterio VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios_celulas (
    idUsuario INT,
    idCelula INT,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
    FOREIGN KEY (idCelula) REFERENCES celulas(id)
);

CREATE TABLE usuarios_ministerios (
    idUsuario INT,
    idMinisterio INT,
    FOREIGN KEY (idUsuario) REFERENCES usuarios(id),
    FOREIGN KEY (idMinisterio) REFERENCES ministerios(id)
);

CREATE TABLE lideres_celulas (
    idLiderCelula INT,
    idCelula INT,
    FOREIGN KEY (idLiderCelula) REFERENCES usuarios(id),
    FOREIGN KEY (idCelula) REFERENCES celulas(id)
);

	SET FOREIGN_KEY_CHECKS = 0;
	TRUNCATE TABLE usuarios_celulas;
	SET FOREIGN_KEY_CHECKS = 1;

SELECT * FROM lideres_celulas;

DESCRIBE usuarios;

INSERT INTO usuarios (nomeCompleto, dataNascimento, email, telefone, concluiuBatismo, participouCafe, participaMinisterio, nomeMinisterio, participaCelula, nomeCelula, cursoMeuNovoCaminho, cursoVidaDevocional, cursoFamiliaCrista, cursoVidaProsperidade, cursoPrincipiosAutoridade, cursoVidaEspirito, cursoCaraterCristo, cursoIdentidadesRestauradas, senhaCadastro, tipoUsuario)
VALUES
('João Silva', '1990-05-15', 'joao.silva@example.com', '99999-1234', TRUE, TRUE, TRUE, 'Louvor', TRUE, 'Célula Esperança', TRUE, TRUE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, 'senha123', 'UsuarioComum'),
('Maria Oliveira', '1985-10-20', 'maria.oliveira@example.com', '98888-4321', TRUE, TRUE, TRUE, 'Intercessão', TRUE, 'Célula Vida', TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, 'senha456', 'LiderCelula'),
('Ana Souza', '2000-03-30', 'ana.souza@example.com', '97777-5678', FALSE, TRUE, FALSE, NULL, FALSE, NULL, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE, FALSE, 'senha789', 'UsuarioComum');

INSERT INTO celulas (nomeCelula, idLiderCelula)
VALUES
('Célula Esperança', 2), -- Maria Oliveira é a líder
('Célula Vida', 2); -- Maria Oliveira também lidera esta célula

INSERT INTO ministerios (nomeMinisterio)
VALUES
('Louvor'),
('Intercessão'),
('Recepção');

INSERT INTO usuarios_celulas (idUsuario, idCelula)
VALUES
(1, 1), -- João Silva participa da Célula Esperança
(3, 2); -- Ana Souza participa da Célula Vida

INSERT INTO usuarios_ministerios (idUsuario, idMinisterio)
VALUES
(1, 1), -- João Silva participa do Ministério de Louvor
(2, 2); -- Maria Oliveira participa do Ministério de Intercessão

INSERT INTO lideres_celulas (idLiderCelula, idCelula)
VALUES
(2, 1), -- Maria Oliveira lidera a Célula Esperança
(2, 2); -- Maria Oliveira lidera a Célula Vida

SELECT * FROM usuarios;

ALTER TABLE usuarios
DROP COLUMN nomeCelula;

DROP TABLE usuarios;

DELETE FROM usuarios WHERE id = 2;
