# ENC: Weekly Billing X Living (Kansys)
**Data:** 27 de fevereiro de 2026, 11:00
**Duração:** 8 minutos
**ID:** 69a1a363310dbf0012e5c4b2

---

Robert Urech
Estou chamando o Rafa aqui. Perguntando aqui também. Ah, o Paulo já está entrando. Está aí.

Bruno Vinicius dos Santos
Fala aí, Paulo. E aí, Bruno, tudo bem? Bom, como é que foi a Recopa? Só perguntando, pô.

Robert Urech
Foi doído. Foi doído. Enfim, faz parte, né?

Paulo Ricardo Xavier
Dá pra ganhar sempre, né? É, exato. Vocês não são São Paulo.

Bruno Vinicius dos Santos
Então, bora lá. Não dá pra ganhar sempre. Vocês não são São Paulo. Ah, fala sério, né? Pô.

Paulo Ricardo Xavier
Estou sabendo que o torcedor São Paulino vai ser chamado agora de o rei do camarote. Rei do camarote.

Bruno Vinicius dos Santos
O negócio tá feio lá, hein, cara.

Paulo Ricardo Xavier
Tá melhor, né? Quanto mais... Quanto mais mete, mais piora. Até a filha lá do cara que assumiu, agora tá envolvida também, né?

Bruno Vinicius dos Santos
Putz, riu.

Paulo Ricardo Xavier
Cara, é a beleza, né? É o clássico sintoma do que é o Brasil, né? Sempre alguém querendo ganhar em cima de alguém, né?

Bruno Vinicius dos Santos
E a galera que já tem dinheiro, né?

Paulo Ricardo Xavier
Não é a galera pobre. Exatamente, exatamente. É ambição, né?

Bruno Vinicius dos Santos
Só um olho grande, enfim. Tá bom, bora lá. Bom, fizemos o deploy aí, né? Acho que a gente tinha um fim ontem. Deu tudo certo. Não teve nenhum BO, né?

Paulo Ricardo Xavier
Não sei se o William chegou a já extrair algum relatório de conferência para ver a questão da... Obviamente que depois do deploy eu exportei, gerei lá e validei, mas não sei se o William fez isso também. De conferência ainda não, mas consequentemente semana que vem vai rolar, mas pelo menos o arquivo de conferência de lotes já está ok, está bem certinho. Ah, legal, legal. Além disso, teve também aquela correção que volta a gerar lá o parque do RA de duplicatas corretamente, tá? Eu lembro que vocês tinham feito um processo aí para poder gerar o conferência CSV e dele gerar o parque, mas se quiserem pode tentar olhar o parque direto agora, né? E além disso, tem uma correção lá para o Vitor na extração das condições comerciais, que é aquela questão do enumerador, né? De extrair o nome direto, né? Foi algo também que foi citado lá atrás, que já está essa correção lá, tá? E aí agora a gente vai colocar aqui, fazer um novo deploy lá, o AT, do 1.12, que é com aquela outra, especificamente, é uma única correção só, que é aquela também na extração das condições comerciais lá, Vitor, de condições lá que foram citadas que não estavam sendo extraídas. A gente achou melhor subir essa versão 1.12, 11 ou 12, enfim, estou confundindo aqui. Primeiro, do que gerar de novo uma nova versão, que é demandar do INEA, validar tudo, olhar todos os itens novamente, não fazia muito sentido esse custo todo, entendeu? Então a gente subiu esse 1.11, que já estava validado, e vamos fazer a volta depois do 1.12, aí tem só essa correção da extração da condição comercial.

Speaker 1
Esse cara eu vou usar provavelmente depois do faturamento, Paulo, porque a gente vai fazer a atualização do IPCA para os regulados, e aí é interessante extrair isso daí também para ver se tem ICB lá e tal. Então a gente pode planejar isso para, já pensando aqui numa data,

Paulo Ricardo Xavier
9, 9 de março, você acha que dá? 9 de março? Ah, com certeza. A ideia é tentar o quanto antes a botar aqui o AT para fazer uma validação, e aí tendo o ok, a gente só aguarda a melhor janela aí com o aval do Bruno para poder... O Bruno saiu? Ah não, o Bruno está aqui. A melhor janela com o aval do Bruno para poder subir isso para a produção.

Bruno Vinicius dos Santos
Olá pessoal.

Paulo Ricardo Xavier
O que é que está faltando? Subir para a produção? Perdão? Então, como eu falei, a gente subiu essa 1.11 e a gente vai colocar agora em UAT 1.12 que tem uma correção da extração da condição comercial, apenas isso, para poder, de uma situação lá que o Vitor apresentou, que é um bug, já foi trabalhado, já foi corrigido, a gente vai fazer o deploy em UAT, fazendo esse deploy, libera ali para o Vitor fazer a validação dele e uma vez feita a validação dele, a gente aguarda o OK seu aí de uma janela para poder colocar esse, não é nem uma versão, é como se fosse um hotfix,

Bruno Vinicius dos Santos
em produção, que é uma correção especificamente de uma funcionalidade.

Speaker 1
Perfeito, acho que pós-faturamento é a data ideal. Beleza. Paulo, nesse próximo deploy, será que não tem como a gente ver também aquela questão do Cansys não conseguir dar o start via interface do mediação? É algo que direto, isso a gente fica meio travado.

Paulo Ricardo Xavier
Então, dá para a gente ver sim, mas essa é infraestrutura, na verdade. Não é muito com a gente, não. A gente vai precisar que seja criada uma conta, uma conta administrador local para poder fazer essa permissão. O que acontece é que hoje a conta que é utilizada para disparar, a conta que tem a permissão para poder fazer o start de serviço é a conta que está configurada lá no serviço da mediação. Se você entrar lá, ele está com local system. E aí o ideal é que a gente precisa de uma conta que esteja no grupo de administrator local, entendeu? Então, é mais uma questão de infra do que... Isso não precisa de deploy, não precisa de nada. Isso dá para resolver hoje, entendeu? Só precisa que alguém faça essas ações, né? Crie usuário e coloque esse usuário na conta de serviço. Desculpa, na configuração lá do serviço mediação.

Bruno Vinicius dos Santos
Vitor, aciona o time de SRE para isso e para já colocar os servidores no Cansys sobre a tutela deles. Eles provavelmente vão chear, não vão querer. Aí você traz para mim, tá?

Speaker 1
Tá, beleza. Vamos discutir ali na daily certinho. Tá bom. E talvez eu leve isso só depois, cara. Eu tô ocupado com mil coisas aqui.

Bruno Vinicius dos Santos
Ah, não valoriza não, pô.

Speaker 1
Mas beleza, beleza. É, assim, não é tão impeditivo porque a gente consegue acessar a máquina lá e dar o start no mediação, né, Paulo? Acho que é esse o caminho, né?

Paulo Ricardo Xavier
Sim, sim. Essa é a opção. Se não consegue pela tela, tem que ir lá dentro do servidor e fazer o start, que também não é adequado. Todo mundo, toda hora, fica acessando o servidor, né? É, boa. Por isso que a gente colocou essa opção lá, por isso que nós colocamos essa opção lá, né?

Speaker 1
Boa. Vamos planejar certinho para resolver isso, então, tentar resolver isso mês que vem.

Bruno Vinicius dos Santos
Beleza, beleza. Obrigado. Mais algum ponto, pessoal? Então, Paulo, Robert, semana que vem, segunda-feira, a gente já vai estar a todo vapor no faturamento. Aí eu conto com o apoio de sempre de vocês. E é isso. Fechado? Valeu, bom final de semana pra todo mundo Menos pro Flamengo aí

Speaker 1
Valeu, valeu

Paulo Ricardo Xavier
Valeu pessoal
