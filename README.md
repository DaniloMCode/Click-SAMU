Chamada Samu

Autores: Danilo Morato de Oliveira e Guilherme Barbosa 
Tema: Sistema Integrado de Emergência Médica e Rastreamento em Tempo Real

1. Resumo do Projeto

O Chamada Samu é um projeto de desenvolvimento de um aplicativo móvel inteligente focado em agilizar o atendimento de emergências médicas. O sistema conecta cidadãos, a central de regulação do SAMU e as ambulâncias em tempo real.

O diferencial central é a transparência: além de enviar dados vitais instantaneamente para o socorro, o aplicativo permite que o usuário acompanhe o deslocamento da ambulância até o local (semelhante a aplicativos de transporte), visando reduzir a ansiedade e o pânico durante a espera.



2. Objetivos

    Agilidade: Reduzir o tempo de resposta das equipes de resgate. 

Informação Vital: Fornecer dados médicos (alergias, tipo sanguíneo) para a equipe de socorro antes mesmo da chegada ao local.

Tranquilidade: Permitir o rastreamento visual da ambulância para amenizar a tensão de quem chamou o socorro.



3. Estrutura de Telas e Interface (Novo Tópico)

A interface foi planejada para ser intuitiva, com botões grandes e alto contraste, facilitando o uso em momentos de nervosismo.

3.1. Tela de Cadastro e Perfil (Primeiro Acesso)

Ao instalar, o usuário deve preencher o Perfil Médico Pessoal. Esta tela contém formulários claros para dados essenciais que serão salvos com segurança:

    Dados Biométricos: Idade, peso e altura (para cálculo de medicação). 

Tipo Sanguíneo: Seleção rápida (A+, O-, etc.).

Histórico: Campos para comorbidades (diabetes, hipertensão) e histórico familiar.

Alergias e Medicamentos: Campo crítico para evitar reações alérgicas a remédios aplicados no socorro.

Contatos de Emergência: Telefones de familiares para notificação automática.

3.2. Menu Principal (Tela "Home")

O design deve ser limpo, focado na ação rápida.

    Botão de Pânico Central: Um botão vermelho grande, pulsante, escrito "CHAMAR SAMU". Deve exigir um toque contínuo de 3 segundos para evitar acionamentos acidentais. 

    Atalhos Secundários: Ícones menores para "Editar Perfil de Saúde" e "Ver Histórico".

    Status da Conexão: Indicador visual de que o GPS e a internet estão ativos.

3.3. Tela de "Chamado Ativo" (O Modo Uber)

Após o acionamento, a tela muda totalmente para o modo de acompanhamento:

    Mapa em Tempo Real: Ocupa 70% da tela. Mostra o pino do usuário (ponto azul) e o ícone da ambulância (ícone de veículo) se movendo pelas ruas.

    Card de Informação (Rodapé):

        Status: "Ambulância a caminho" ou "Triagem na Central".

        Estimativa (ETA): "Chegada prevista em 5 minutos".

        Dados da Unidade: "Unidade de Suporte Avançado (USA) - Placa XYZ-1234".

    Botão "Falar com a Central": Atalho para ligação de voz caso a situação mude.



4. Funcionalidades Técnicas e Procedimentos

4.1. Procedimento de Acionamento e Triagem

    Ao clicar em "Chamar SAMU", o app captura a geolocalização exata via GPS. 

Um pacote de dados (Localização + Perfil Médico Cadastrado) é enviado instantaneamente para a Central.

A Central visualiza a gravidade (Leve, Média, Grave) com base nos dados enviados e despacha a unidade.

4.2. Integração IoT (Arduino e GPS)

Para viabilizar o rastreamento da ambulância mencionado no projeto:

    Hardware na Ambulância: Um dispositivo com Arduino/ESP32 e módulo GPS/GPRS instalado no veículo.

    Comunicação: O dispositivo lê a coordenada geográfica da ambulância a cada 5 segundos e envia para o servidor.

    Feedback: O servidor processa essa coordenada e atualiza o ícone da ambulância no mapa do celular do usuário (Tela de Chamado Ativo).



5. Tecnologias Sugeridas

    Frontend (App): React Native ou Flutter (para gerar o mapa fluido).

    Backend: Node.js (para gerenciar as conexões em tempo real via WebSocket).

    IoT: Arduino Uno ou ESP32 com módulo GPS NEO-6M.
