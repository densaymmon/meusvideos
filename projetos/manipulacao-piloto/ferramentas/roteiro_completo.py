"""Monta ferramentas/falas.json com o roteiro completo.
Campos: id, texto (legenda), voz (opcional: grafia para a pronúncia), pausa (s), bloco."""
import json

atual = json.load(open("ferramentas/falas.json", encoding="utf-8"))
for f in atual:
    f["bloco"] = "gancho" if atual.index(f) < 5 else "intro"

def F(bloco, id, texto, pausa=0.45, voz=None):
    d = {"id": id, "texto": texto, "pausa": pausa, "bloco": bloco}
    if voz: d["voz"] = voz
    return d

novas = [
 F("sinal1","s1-titulo","Sinal número um: o excesso no começo.",0.6),
 F("sinal1","s1-conhece","Você conhece alguém e, em poucos dias, recebe mensagens o tempo todo, elogios intensos, planos de futuro, 'nunca senti isso por ninguém'.",0.5),
 F("sinal1","s1-filme","Parece um filme.",0.4),
 F("sinal1","s1-problema","E é justamente esse o problema.",0.5),
 F("sinal1","s1-nome","Em inglês, isso ganhou o nome de love bombing, um bombardeio de afeto.",0.5, voz="Em inglês, isso ganhou o nome de lóv bâmbin, um bombardeio de afeto."),
 F("sinal1","s1-estudo","Em 2017, pesquisadores da Universidade do Arkansas, liderados por Claire Strutzenberg, fizeram um dos primeiros estudos empíricos sobre o tema, com quatrocentos e oitenta e quatro universitários.",0.4,
   voz="Em dois mil e dezessete, pesquisadores da Universidade do Árcansó, liderados por Clér Strútzenberg, fizeram um dos primeiros estudos empíricos sobre o tema, com quatrocentos e oitenta e quatro universitários."),
 F("sinal1","s1-achado","Eles encontraram associação entre esse comportamento e traços narcisistas, além de menor autoestima em quem praticava.",0.4),
 F("sinal1","s1-correlacao","É uma correlação, não uma sentença.",0.5),
 F("sinal1","s1-alerta","Mas o alerta fica: quando a intensidade vem antes da intimidade, vale observar o que acontece quando você diz 'não'.",0.9),

 F("sinal2","s2-titulo","Sinal número dois: você começa a duvidar da própria memória.",0.6),
 F("sinal2","s2-frases","'Eu nunca disse isso.' 'Você está exagerando.' 'Você é sensível demais.'",0.5),
 F("sinal2","s2-rotina","Uma vez, tudo bem. Mas quando vira rotina, você passa a conferir prints, a ensaiar conversas, a pedir para outras pessoas confirmarem o que você viveu.",0.5,
   voz="Uma vez, tudo bem. Mas quando vira rotina, você passa a conferir prínts, a ensaiar conversas, a pedir para outras pessoas confirmarem o que você viveu."),
 F("sinal2","s2-nome","O nome disso é gaslighting, e vem de uma peça de teatro dos anos trinta, depois adaptada para o cinema, em que um marido convence a esposa de que ela está enlouquecendo.",0.5,
   voz="O nome disso é gás láitin, e vem de uma peça de teatro dos anos trinta, depois adaptada para o cinema, em que um marido convence a esposa de que ela está enlouquecendo."),
 F("sinal2","s2-estudo","Em 2019, a socióloga Paige Sweet, da Universidade Harvard, publicou um estudo na American Sociological Review mostrando que o gaslighting fica mais forte quando se apoia em desigualdades de poder e em estereótipos, como a ideia de que certas pessoas seriam 'emocionais demais' para confiar em si mesmas.",0.4,
   voz="Em dois mil e dezenove, a socióloga Pêidj Suít, da Universidade Rárvard, publicou um estudo na Américan Souciolójical Riviú mostrando que o gás láitin fica mais forte quando se apoia em desigualdades de poder e em estereótipos, como a ideia de que certas pessoas seriam emocionais demais para confiar em si mesmas."),
 F("sinal2","s2-surreal","O resultado é o que ela descreve como um ambiente 'surreal'.",0.4),
 F("sinal2","s2-sinal","O sinal mais claro: você sai das conversas sem saber mais o que é real.",0.9),

 F("sinal3","s3-titulo","Sinal número três: a culpa sempre chega antes da conversa.",0.6),
 F("sinal3","s3-sair","Você quer sair com os amigos e escuta: 'tudo bem, vai lá, eu fico aqui sozinho mesmo'.",0.5),
 F("sinal3","s3-ninguem","Ninguém te proibiu de nada.",0.4),
 F("sinal3","s3-fica","Mesmo assim, você fica.",0.6),
 F("sinal3","s3-estudo","Em 1994, os psicólogos Roy Baumeister, Arlene Stillwell e Todd Heatherton publicaram uma revisão no Psychological Bulletin defendendo que a culpa é uma emoção essencialmente interpessoal.",0.4,
   voz="Em mil novecentos e noventa e quatro, os psicólogos Rói Baumáister, Arlíne Stílwel e Tód Rédertom publicaram uma revisão no Saicolójical Búletin defendendo que a culpa é uma emoção essencialmente interpessoal."),
 F("sinal3","s3-protege","Ela existe para proteger relações.",0.4),
 F("sinal3","s3-influenciar","E justamente por isso pode ser usada para influenciar: quem se mostra magoado consegue que o outro ceda, sem precisar pedir nada diretamente.",0.5),
 F("sinal3","s3-saudavel","Culpa saudável aponta um erro real.",0.4),
 F("sinal3","s3-fabricada","Culpa fabricada aparece toda vez que você tenta ter vida própria.",0.9),

 F("retencao","r-pensando","Até aqui, talvez você esteja pensando: 'tá, mas isso é fácil de perceber'.",0.4),
 F("retencao","r-diferentes","Só que os próximos sinais são diferentes.",0.4),
 F("retencao","r-ataques","Eles não parecem ataques.",0.3),
 F("retencao","r-amor","Parecem amor, parecem silêncio, parecem cuidado.",0.5),
 F("retencao","r-setimo","E o último, o sétimo, é provavelmente o que mais gente vive sem dar nome.",0.4),
 F("retencao","r-fim","Fica até o fim.",0.9),

 F("sinal4","s4-titulo","Sinal número quatro: o carinho imprevisível.",0.6),
 F("sinal4","s4-bom","Num dia, a pessoa é incrível, atenciosa, presente.",0.3),
 F("sinal4","s4-frio","No outro, fria, distante, como se você não existisse.",0.4),
 F("sinal4","s4-semana","E você passa a semana tentando descobrir o que fazer para o dia bom voltar.",0.5),
 F("sinal4","s4-decadas","A psicologia comportamental estudou esse mecanismo há décadas.",0.4),
 F("sinal4","s4-skinner","Nos anos cinquenta, Charles Ferster e B. F. Skinner mostraram que recompensas dadas de forma imprevisível mantêm um comportamento por mais tempo do que recompensas constantes.",0.4,
   voz="Nos anos cinquenta, Tchárles Férster e Bê Éfe Squíner mostraram que recompensas dadas de forma imprevisível mantêm um comportamento por mais tempo do que recompensas constantes."),
 F("sinal4","s4-caca","É a lógica de uma máquina caça-níquel.",0.5),
 F("sinal4","s4-dutton","Nos relacionamentos, os psicólogos Donald Dutton e Susan Painter usaram essa ideia para descrever o que chamaram de vínculo traumático: a alternância entre maus-tratos e afeto pode criar um apego muito forte.",0.4,
   voz="Nos relacionamentos, os psicólogos Dónald Dâton e Súsan Pêinter usaram essa ideia para descrever o que chamaram de vínculo traumático: a alternância entre maus-tratos e afeto pode criar um apego muito forte."),
 F("sinal4","s4-1993","Num estudo de 1993 com setenta e cinco mulheres que tinham acabado de sair de relações abusivas, a intermitência dos maus-tratos e a diferença de poder entre os parceiros ajudaram a prever o quanto elas continuavam ligadas ao ex, mesmo meses depois.",0.5,
   voz="Num estudo de mil novecentos e noventa e três com setenta e cinco mulheres que tinham acabado de sair de relações abusivas, a intermitência dos maus-tratos e a diferença de poder entre os parceiros ajudaram a prever o quanto elas continuavam ligadas ao éks, mesmo meses depois."),
 F("sinal4","s4-aprendizado","Não é fraqueza. É aprendizado.",0.9),

 F("sinal5","s5-titulo","Sinal número cinco: sempre existe uma terceira pessoa na conversa.",0.6),
 F("sinal5","s5-frases","'Minha ex nunca reclamava disso.' 'Até a sua irmã acha que você exagera.' 'Fulano me entende melhor.'",0.5,
   voz="Minha éks nunca reclamava disso. Até a sua irmã acha que você exagera. Fulano me entende melhor."),
 F("sinal5","s5-plateia","De repente, você não está discutindo com uma pessoa. Está competindo com uma plateia.",0.5),
 F("sinal5","s5-bowen","O psiquiatra Murray Bowen, criador da teoria dos sistemas familiares, descreveu o triângulo como a menor unidade emocional estável:",0.3,
   voz="O psiquiatra Mârei Bôuen, criador da teoria dos sistemas familiares, descreveu o triângulo como a menor unidade emocional estável:"),
 F("sinal5","s5-tensao","quando a tensão cresce entre duas pessoas, uma terceira é puxada para dentro.",0.4),
 F("sinal5","s5-alivia","Isso alivia a tensão, mas não resolve nada, e alguém sempre acaba de fora.",0.4),
 F("sinal5","s5-regua","Na manipulação, esse terceiro vira uma régua invisível para você nunca se sentir suficiente.",0.9),

 F("sinal6","s6-titulo","Sinal número seis: a linha de chegada que sempre muda de lugar.",0.6),
 F("sinal6","s6-melhora","Você melhora aquilo que foi criticado e, quando consegue, surge outra exigência.",0.4),
 F("sinal6","s6-exemplos","Respondeu rápido? Agora é o tom. Mudou o tom? Agora é a roupa.",0.5),
 F("sinal6","s6-nome","Em inglês, chamam isso de moving the goalposts, mover as traves do gol.",0.4, voz="Em inglês, chamam isso de múvin dê gôl pôusts, mover as traves do gol."),
 F("sinal6","s6-diagnostico","Não é um diagnóstico clínico, é uma descrição de comportamento.",0.4),
 F("sinal6","s6-stark","Mas ele conversa com algo que o sociólogo Evan Stark descreveu no livro Coercive Control, de 2007: o abuso muitas vezes não é um episódio isolado, e sim um padrão contínuo de controle sobre a vida cotidiana.",0.4,
   voz="Mas ele conversa com algo que o sociólogo Évan Stárk descreveu no livro Couêrsiv Contrôl, de dois mil e sete: o abuso muitas vezes não é um episódio isolado, e sim um padrão contínuo de controle sobre a vida cotidiana."),
 F("sinal6","s6-cansativo","O efeito é cansativo e silencioso.",0.4),
 F("sinal6","s6-pergunta","Você para de perguntar 'o que eu quero' e passa a perguntar só 'o que vai agradar'.",0.9),

 F("sinal7","s7-titulo","E o sinal número sete, o mais comum e o menos nomeado: o silêncio como punição.",0.6),
 F("sinal7","s7-calma","Não é o silêncio de quem precisa de um tempo para se acalmar.",0.4),
 F("sinal7","s7-dias","É o silêncio que dura dias, que ignora mensagens, que responde com 'nada' quando você pergunta o que houve.",0.5),
 F("sinal7","s7-williams","O psicólogo Kipling Williams, da Universidade Purdue, passou anos estudando o ostracismo, o ato de ignorar e excluir alguém.",0.4,
   voz="O psicólogo Quíplin Uíliams, da Universidade Pârdiu, passou anos estudando o ostracismo, o ato de ignorar e excluir alguém."),
 F("sinal7","s7-necessidades","Segundo o modelo dele, ser ignorado ameaça quatro necessidades básicas: pertencer, ter autoestima, ter controle e sentir que a própria existência importa.",0.5),
 F("sinal7","s7-schrodt","E uma meta-análise de 2014, liderada por Paul Schrodt, reuniu setenta e quatro estudos sobre o padrão em que um parceiro cobra e o outro se fecha, e encontrou associação com menor satisfação e mais problemas de comunicação no relacionamento.",0.5,
   voz="E uma meta-análise de dois mil e catorze, liderada por Pól Chrôdt, reuniu setenta e quatro estudos sobre o padrão em que um parceiro cobra e o outro se fecha, e encontrou associação com menor satisfação e mais problemas de comunicação no relacionamento."),
 F("sinal7","s7-paz","O silêncio, usado assim, não é paz.",0.4),
 F("sinal7","s7-existe","É uma forma de dizer 'você só existe quando eu deixo'.",1.0),

 F("fechamento","f-nenhum","Perceba que nenhum desses sinais, sozinho, prova nada.",0.4),
 F("fechamento","f-repeticao","O que transforma comportamento em manipulação é a repetição, e o efeito que ela deixa em você: confusão, culpa constante, medo de reagir, a sensação de pisar em ovos.",0.5),
 F("fechamento","f-pergunta","Se você se reconheceu em vários deles, a pergunta mais importante não é 'essa pessoa é má?'.",0.4),
 F("fechamento","f-sente","É 'como eu me sinto perto dela?'.",1.0),

 F("cvv","c-sozinho","E se esses padrões fazem parte da sua vida agora, você não precisa lidar com isso sozinho.",0.4),
 F("cvv","c-conversar","Conversar com alguém de confiança ou com um psicólogo pode ajudar a colocar as coisas em perspectiva.",0.5),
 F("cvv","c-cvv","E se você estiver sofrendo emocionalmente, o CVV, Centro de Valorização da Vida, atende de graça, vinte e quatro horas por dia, pelo telefone um, oito, oito, ou pelo chat no site cvv.org.br.",0.3,
   voz="E se você estiver sofrendo emocionalmente, o cê vê vê, Centro de Valorização da Vida, atende de graça, vinte e quatro horas por dia, pelo telefone um, oito, oito, ou pelo chat no site cê vê vê ponto órg ponto bê érre."),
 F("cvv","c-sigilo","Com sigilo, sem julgamento.",1.2),

 F("cta","a-like","Se este vídeo te fez enxergar algo que você sentia, mas não sabia nomear, deixa o seu like, isso ajuda o canal a chegar em mais gente.",0.4, voz="Se este vídeo te fez enxergar algo que você sentia, mas não sabia nomear, deixa o seu láik, isso ajuda o canal a chegar em mais gente."),
 F("cta","a-inscreve","Se inscreve para entender a psicologia por trás do que você faz sem perceber.",0.4),
 F("cta","a-comenta","E me conta nos comentários: qual desses sinais você acha mais difícil de notar?",0.6),
 F("cta","a-tchau","Até o próximo vídeo.",1.5),

 # Falas extras, só nas partes para redes sociais
 F("social","x-p1-gancho","E o próximo sinal faz você se sentir culpado sem ninguém te acusar de nada.",0.4),
 F("social","x-p1-continua","Ele está na parte dois.",1.4),
 F("social","x-p2-inicio","Parte dois. Se você perdeu a primeira, ela está no perfil.",0.6),
 F("social","x-p2-gancho","Os dois últimos sinais são os mais difíceis de enxergar. E o sétimo, quase todo mundo já viveu.",0.4),
 F("social","x-p2-continua","Parte três, no próximo vídeo.",1.4),
 F("social","x-p3-inicio","Parte três, a última. Se perdeu as anteriores, elas estão no perfil.",0.6),
 F("social","x-segue","Me segue para entender a psicologia por trás do que você faz sem perceber.",0.4),
]
json.dump(atual + novas, open("ferramentas/falas.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(atual + novas), "falas")
