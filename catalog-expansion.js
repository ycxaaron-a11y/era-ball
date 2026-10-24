// Selected real squad members. Season/year-specific scores are editorial game estimates.
import {worldCupSquads} from './catalog-world-cup.js';
import {uclSquads} from './catalog-ucl.js';
import {chineseNames} from './player-names-zh.js';
const registry=new Map([...worldCupSquads,...uclSquads].flatMap(s=>s.players).map(p=>[p.identity,{...p,displayName:chineseNames[p.identity]}]));
// Identity | original name | Chinese display name | natural positions | listed adult height (cm).
const additions=`
neymar|Neymar|内马尔|LW/CAM|175
vinicius-junior|Vinícius Júnior|维尼修斯·儒尼奥尔|LW/ST|176
rodrygo|Rodrygo|罗德里戈|RW/LW/ST|174
raphinha|Raphinha|拉菲尼亚|RW|176
richarlison|Richarlison|理查利松|ST/LW|184
gabriel-jesus|Gabriel Jesus|加布里埃尔·热苏斯|ST/RW|175
antony|Antony|安东尼|RW|174
pedro-guilherme|Pedro|佩德罗·吉列尔梅|ST|185
gabriel-martinelli|Gabriel Martinelli|加布里埃尔·马丁内利|LW|178
lucas-paqueta|Lucas Paquetá|卢卡斯·帕奎塔|CAM/CM|180
bruno-guimaraes|Bruno Guimarães|布鲁诺·吉马良斯|CM/CDM|182
fred-rodrigues|Fred|弗雷德·罗德里格斯|CM/CDM|169
fabinho|Fabinho|法比尼奥|CDM/CB|188
bremer|Bremer|布雷默|CB|188
alex-telles|Alex Telles|亚历克斯·特莱斯|LB|181
alex-sandro|Alex Sandro|亚历克斯·桑德罗|LB/LWB|180
eder-militao|Éder Militão|埃德尔·米利唐|CB/RB|186
danilo|Danilo|达尼洛|RB/LB|184
ederson|Ederson|埃德森|GK|188
alisson|Alisson|阿利松|GK|193
weverton|Weverton|韦弗顿|GK|189
renato-augusto|Renato Augusto|雷纳托·奥古斯托|CM/CAM|186
paulinho|Paulinho|保利尼奥|CM|183
willian|Willian|威廉|RW/CAM|175
douglas-costa|Douglas Costa|道格拉斯·科斯塔|RW/LW|172
taison|Taison|泰森|LW/CAM|172
fagner|Fagner|法格纳|RB|168
miranda|Miranda|米兰达|CB|186
filipe-luis|Filipe Luís|菲利佩·路易斯|LB|182
geromel|Pedro Geromel|佩德罗·杰罗梅尔|CB|190
fernandinho|Fernandinho|费尔南迪尼奥|CDM/CM|179
cassio|Cássio|卡西奥|GK|195
oscar|Oscar|奥斯卡|CAM/CM|179
bernard|Bernard|伯纳德|LW/CAM|164
hulk|Hulk|胡尔克|RW/ST|180
fred-guedes|Fred|弗雷德·格德斯|ST|185
jo|Jô|若|ST|189
hernanes|Hernanes|埃尔纳内斯|CM/CAM|180
luiz-gustavo|Luiz Gustavo|路易斯·古斯塔沃|CDM/CB|187
henrique|Henrique|恩里克|CB|185
maxwell|Maxwell|马克斯韦尔|LB|176
maicon|Maicon|麦孔|RB|184
julio-cesar|Júlio César|儒利奥·塞萨尔|GK|186
jefferson|Jefferson|杰斐逊|GK|188
victor|Victor|维克托|GK|193
wayne-rooney|Wayne Rooney|韦恩·鲁尼|ST/CAM|176
michael-owen|Michael Owen|迈克尔·欧文|ST|173
peter-crouch|Peter Crouch|彼得·克劳奇|ST|201
jermain-defoe|Jermain Defoe|杰梅因·迪福|ST|171
emile-heskey|Emile Heskey|埃米尔·赫斯基|ST|188
aaron-lennon|Aaron Lennon|阿伦·列侬|RM/RW|165
shaun-wright-phillips|Shaun Wright-Phillips|肖恩·赖特·菲利普斯|RM/RW|166
james-milner|James Milner|詹姆斯·米尔纳|CM/RM/LM|175
gareth-barry|Gareth Barry|加雷斯·巴里|CDM/CM|183
joe-cole|Joe Cole|乔·科尔|LM/CAM|176
ashley-cole|Ashley Cole|阿什利·科尔|LB|176
michael-carrick|Michael Carrick|迈克尔·卡里克|CDM/CM|188
owen-hargreaves|Owen Hargreaves|欧文·哈格里夫斯|CDM/CM/RB|180
jermaine-jenas|Jermaine Jenas|杰梅因·杰纳斯|CM|180
stewart-downing|Stewart Downing|斯图尔特·唐宁|LM/LW|180
wayne-bridge|Wayne Bridge|韦恩·布里奇|LB|180
jamie-carragher|Jamie Carragher|杰米·卡拉格|CB/RB|185
matthew-upson|Matthew Upson|马修·厄普森|CB|185
ledley-king|Ledley King|莱德利·金|CB|188
wes-brown|Wes Brown|韦斯·布朗|CB/RB|185
glen-johnson|Glen Johnson|格伦·约翰逊|RB|182
stephen-warnock|Stephen Warnock|斯蒂芬·沃诺克|LB|178
michael-dawson|Michael Dawson|迈克尔·道森|CB|188
paul-robinson|Paul Robinson|保罗·罗宾逊|GK|193
david-james|David James|大卫·詹姆斯|GK|194
robert-green|Robert Green|罗伯特·格林|GK|191
joe-hart|Joe Hart|乔·哈特|GK|196
scott-carson|Scott Carson|斯科特·卡森|GK|188
gary-lineker|Gary Lineker|加里·莱因克尔|ST|177
peter-beardsley|Peter Beardsley|彼得·比尔兹利|ST/CAM|173
chris-waddle|Chris Waddle|克里斯·瓦德尔|RW/LM|188
paul-gascoigne|Paul Gascoigne|保罗·加斯科因|CAM/CM|177
david-platt|David Platt|大卫·普拉特|CM/CAM|178
steve-mcmahon|Steve McMahon|史蒂夫·麦克马洪|CM|175
neil-webb|Neil Webb|尼尔·韦伯|CM|185
trevor-steven|Trevor Steven|特雷弗·史蒂文|RM|175
steve-bull|Steve Bull|史蒂夫·布尔|ST|175
mark-wright|Mark Wright|马克·赖特|CB|188
paul-parker|Paul Parker|保罗·帕克|RB|170
stuart-pearce|Stuart Pearce|斯图尔特·皮尔斯|LB|178
des-walker|Des Walker|德斯·沃克|CB|183
gary-stevens|Gary Stevens|加里·史蒂文斯|RB|180
tony-dorigo|Tony Dorigo|托尼·多里戈|LB|175
chris-woods|Chris Woods|克里斯·伍兹|GK|188
dave-beasant|Dave Beasant|戴夫·比桑特|GK|193
bebeto|Bebeto|贝贝托|ST|178
romario|Romário|罗马里奥|ST|167
rai|Raí|拉易|CAM|189
mauro-silva|Mauro Silva|毛罗·席尔瓦|CDM|177
mazinho|Mazinho|马津霍|CM/CDM|176
dunga|Dunga|邓加|CDM/CM|176
zinho|Zinho|津霍|LM/CM|170
ricardo-rocha|Ricardo Rocha|里卡多·罗查|CB|180
marcio-santos|Márcio Santos|马尔西奥·桑托斯|CB|187
ronaldao|Ronaldão|罗纳尔当|CB|189
paulo-sergio|Paulo Sérgio|保罗·塞尔吉奥|ST/RW|180
muller|Müller|穆勒·巴西|ST/RW|178
zetti|Zetti|泽蒂|GK|189
oliver-kahn|Oliver Kahn|奥利弗·卡恩|GK|188
jens-lehmann|Jens Lehmann|延斯·莱曼|GK|190
hans-jorg-butt|Hans-Jörg Butt|汉斯·约尔格·布特|GK|191
christoph-metzelder|Christoph Metzelder|克里斯托夫·梅策尔德|CB|194
christian-ziege|Christian Ziege|克里斯蒂安·齐格|LB/LM|186
torsten-frings|Torsten Frings|托尔斯滕·弗林斯|CM/RM|182
carsten-ramelow|Carsten Ramelow|卡斯滕·拉梅洛|CDM/CB|185
sebastian-kehl|Sebastian Kehl|塞巴斯蒂安·凯尔|CDM|188
marco-bode|Marco Bode|马尔科·博德|LM/ST|189
oliver-neuville|Oliver Neuville|奥利弗·诺伊维尔|ST|171
carsten-jancker|Carsten Jancker|卡斯滕·扬克尔|ST|193
oliver-bierhoff|Oliver Bierhoff|奥利弗·比尔霍夫|ST|191
gerald-asamoah|Gerald Asamoah|杰拉尔德·阿萨莫阿|ST/RW|180
jorg-bohme|Jörg Böhme|约尔格·伯梅|LM|178
thomas-linke|Thomas Linke|托马斯·林克|CB|183
marko-rehmer|Marko Rehmer|马尔科·雷默|CB/RB|187
mark-van-bommel|Mark van Bommel|马克·范博梅尔|CDM/CM|187
rafael-van-der-vaart|Rafael van der Vaart|拉斐尔·范德法特|CAM/CM|176
wesley-sneijder|Wesley Sneijder|韦斯利·斯内德|CAM/CM|170
robin-van-persie|Robin van Persie|罗宾·范佩西|ST|183
klaas-jan-huntelaar|Klaas-Jan Huntelaar|克拉斯·扬·亨特拉尔|ST|186
nigel-de-jong|Nigel de Jong|奈杰尔·德容|CDM|174
khalid-boulahrouz|Khalid Boulahrouz|哈立德·博拉鲁兹|CB/RB|183
john-heitinga|John Heitinga|约翰·海廷加|CB/RB|180
joris-mathijsen|Joris Mathijsen|约里斯·马泰森|CB|183
gregory-van-der-wiel|Gregory van der Wiel|格雷戈里·范德维尔|RB|183
giovanni-van-bronckhorst|Giovanni van Bronckhorst|乔瓦尼·范布隆克霍斯特|LB/CM|178
maarten-stekelenburg|Maarten Stekelenburg|马滕·斯特克伦堡|GK|197
michel-vorm|Michel Vorm|米歇尔·沃尔姆|GK|183
sander-boschker|Sander Boschker|桑德尔·博斯赫克尔|GK|192
eljero-elia|Eljero Elia|埃尔耶罗·埃利亚|LW|176
ibrahim-afellay|Ibrahim Afellay|易卜拉欣·阿费莱|CAM/LW|180
demy-de-zeeuw|Demy de Zeeuw|德米·德泽乌|CM/CDM|174
edson-braafheid|Edson Braafheid|埃德松·布拉夫海德|LB|176
andre-ooijer|André Ooijer|安德烈·奥耶尔|CB|184
boudewijn-zenden|Boudewijn Zenden|鲍德温·岑登|LW/LM|172
pierre-van-hooijdonk|Pierre van Hooijdonk|皮埃尔·范霍伊东克|ST|193
aron-winter|Aron Winter|阿伦·温特|CDM/CM|176
wim-jonk|Wim Jonk|维姆·容克|CDM/CM|186
winston-bogarde|Winston Bogarde|温斯顿·博加德|CB/LB|190
michael-reiziger|Michael Reiziger|米夏埃尔·雷齐格|RB|178
patrick-kluivert|Patrick Kluivert|帕特里克·克鲁伊维特|ST|188
ronald-de-boer|Ronald de Boer|罗纳德·德波尔|CAM/RW|180
frank-de-boer|Frank de Boer|弗兰克·德波尔|CB/LB|179
arthur-numan|Arthur Numan|阿图尔·纽曼|LB|182
edgar-davids|Edgar Davids|埃德加·戴维斯|CM/CDM|169
clarence-seedorf|Clarence Seedorf|克拉伦斯·西多夫|CM/CAM|177
ricardo-carvalho|Ricardo Carvalho|里卡多·卡瓦略|CB|183
paulo-ferreira|Paulo Ferreira|保罗·费雷拉|RB/LB|183
miguel|Miguel|米格尔|RB|175
nuno-valente|Nuno Valente|努诺·瓦伦特|LB|180
ricardo|Ricardo|里卡多|GK|185
quim|Quim|基姆|GK|184
paulo-santos|Paulo Santos|保罗·桑托斯|GK|187
costinha|Costinha|科斯蒂尼亚|CDM|181
maniche|Maniche|马尼切|CM|179
petit|Petit|佩蒂特·葡萄牙|CDM|172
deco|Deco|德科|CAM/CM|174
luis-figo|Luís Figo|路易斯·菲戈|RW/CAM|180
pauleta|Pauleta|保莱塔|ST|180
nuno-gomes|Nuno Gomes|努诺·戈麦斯|ST|181
helder-postiga|Hélder Postiga|埃尔德·波斯蒂加|ST|182
luis-boa-morte|Luís Boa Morte|路易斯·博阿·莫特|LW|178
tiago|Tiago|蒂亚戈|CM|183
hugo-viana|Hugo Viana|乌戈·维亚纳|CM/CAM|178
ricardo-costa|Ricardo Costa|里卡多·科斯塔|CB|183
caneira|Caneira|卡内拉|CB/LB|178
florent-malouda|Florent Malouda|弗洛朗·马卢达|LM/LW|181
louis-saha|Louis Saha|路易·萨哈|ST|185
pascal-chimbonda|Pascal Chimbonda|帕斯卡尔·辛邦达|RB|182
mickael-landreau|Mickaël Landreau|米卡埃尔·朗德罗|GK|184
gregory-coupet|Grégory Coupet|格雷戈里·库佩|GK|181
jean-alain-boumsong|Jean-Alain Boumsong|让·阿兰·布姆松|CB|190
vikash-dhorasoo|Vikash Dhorasoo|维卡什·多拉索|CM/CAM|168
sylvain-wiltord|Sylvain Wiltord|西尔万·维尔托德|RW/ST|173
sidney-govou|Sidney Govou|西德尼·戈武|RW/ST|175
david-trezeguet|David Trezeguet|大卫·特雷泽盖|ST|190
rodrigo-palacio|Rodrigo Palacio|罗德里戈·帕拉西奥|ST/RW|176
ezequiel-lavezzi|Ezequiel Lavezzi|埃塞基耶尔·拉维奇|LW/ST|173
gonzalo-higuain|Gonzalo Higuaín|冈萨洛·伊瓜因|ST|184
fernando-gago|Fernando Gago|费尔南多·加戈|CM/CDM|178
lucas-biglia|Lucas Biglia|卢卡斯·比格利亚|CDM|178
maxi-rodriguez|Maxi Rodríguez|马克西·罗德里格斯|RM/CM|178
augusto-fernandez|Augusto Fernández|奥古斯托·费尔南德斯|CM/RM|177
ricky-alvarez|Ricky Álvarez|里基·阿尔瓦雷斯|CAM|188
jose-maria-basanta|José María Basanta|何塞·马里亚·巴桑塔|CB|188
hugo-campagnaro|Hugo Campagnaro|乌戈·坎帕尼亚罗|CB/RB|181
federico-fernandez|Federico Fernández|费德里科·费尔南德斯|CB|190
marcos-rojo|Marcos Rojo|马科斯·罗霍|LB/CB|187
mariano-andujar|Mariano Andújar|马里亚诺·安杜哈尔|GK|194
agustin-orion|Agustín Orión|阿古斯丁·奥里翁|GK|190
sergio-romero|Sergio Romero|塞尔希奥·罗梅罗|GK|192
patrice-evra|Patrice Evra|帕特里斯·埃夫拉|LB|174
park-ji-sung|Park Ji-sung|朴智星|LM/CM/RM|175
nani|Nani|纳尼|LW/RW|177
anderson|Anderson|安德森|CM/CAM|176
john-oshea|John O'Shea|约翰·奥谢|CB/RB/LB|191
darren-fletcher|Darren Fletcher|达伦·弗莱彻|CM/CDM|183
jonny-evans|Jonny Evans|乔尼·埃文斯|CB|188
rafael-da-silva|Rafael da Silva|拉斐尔·达·席尔瓦|RB|172
fabio-da-silva|Fábio da Silva|法比奥·达·席尔瓦|LB/RB|172
chris-smalling|Chris Smalling|克里斯·斯莫林|CB|194
antonio-valencia|Antonio Valencia|安东尼奥·瓦伦西亚|RM/RW/RB|180
javier-hernandez|Javier Hernández|哈维尔·埃尔南德斯|ST|175
dimitar-berbatov|Dimitar Berbatov|迪米塔尔·贝尔巴托夫|ST|189
tomasz-kuszczak|Tomasz Kuszczak|托马什·库什恰克|GK|191
ben-foster|Ben Foster|本·福斯特|GK|193
ludovic-giuly|Ludovic Giuly|卢多维克·久利|RW/ST|164
santiago-ezquerro|Santiago Ezquerro|圣地亚哥·埃斯克罗|LW/ST|180
gabri|Gabri|加布里|CM/RB|174
edmilson|Edmílson|埃德米尔森|CDM/CB|186
oleguer|Oleguer|奥莱格|RB/CB|187
albert-jorquera|Albert Jorquera|阿尔韦特·霍尔克拉|GK|183
andres-iniesta|Andrés Iniesta|安德烈斯·伊涅斯塔|CM/CAM/LW|171
sergi-roberto|Sergi Roberto|塞尔吉·罗贝托|CM/RB|178
rafinha-alcantara|Rafinha|拉菲尼亚·阿尔坎塔拉|CM/CAM|174
jeremy-mathieu|Jérémy Mathieu|热雷米·马蒂厄|CB/LB|189
thomas-vermaelen|Thomas Vermaelen|托马斯·维尔马伦|CB|183
marc-andre-ter-stegen|Marc-André ter Stegen|马克·安德烈·特尔施特根|GK|187
claudio-bravo|Claudio Bravo|克劳迪奥·布拉沃|GK|184
martin-montoya|Martín Montoya|马丁·蒙托亚|RB|175
sandro-ramirez|Sandro Ramírez|桑德罗·拉米雷斯|ST|175
munir-el-haddadi|Munir El Haddadi|穆尼尔·哈达迪|ST/RW|175
luis-suarez|Luis Suárez|路易斯·苏亚雷斯|ST|182
ivan-rakitic|Ivan Rakitić|伊万·拉基蒂奇|CM|184
claude-makelele|Claude Makélélé|克洛德·马克莱莱|CDM|174
santiago-solari|Santiago Solari|圣地亚哥·索拉里|LM/LW|180
ivan-helguera|Iván Helguera|伊万·埃尔格拉|CB/CDM|185
fernando-hierro|Fernando Hierro|费尔南多·耶罗|CB/CDM|187
fernando-morientes|Fernando Morientes|费尔南多·莫伦特斯|ST|186
savio|Sávio|萨维奥|LW|176
pedro-munitis|Pedro Munitis|佩德罗·穆尼蒂斯|LW/ST|168
flavio-conceicao|Flávio Conceição|弗拉维奥·孔塞桑|CM/CDM|177
albert-celades|Albert Celades|阿尔韦特·塞拉德斯|CDM|177
cesar-sanchez|César Sánchez|塞萨尔·桑切斯|GK|185
raul-bravo|Raúl Bravo|劳尔·布拉沃|LB/CB|176
jude-bellingham|Jude Bellingham|裘德·贝林厄姆|CAM/CM|186
arda-guler|Arda Güler|阿尔达·居莱尔|CAM/RW|175
fran-garcia|Fran García|弗兰·加西亚|LB|169
joselu|Joselu|何塞卢|ST|192
brahim-diaz|Brahim Díaz|卜拉欣·迪亚斯|CAM/RW|170
andriy-lunin|Andriy Lunin|安德烈·卢宁|GK|191
thibaut-courtois|Thibaut Courtois|蒂博·库尔图瓦|GK|200
aurelien-tchouameni|Aurélien Tchouaméni|奥雷利安·楚阿梅尼|CDM/CB|187
eduardo-camavinga|Eduardo Camavinga|爱德华多·卡马文加|CM/CDM/LB|182
federico-valverde|Federico Valverde|费德里科·巴尔韦德|CM/RM|182
ferland-mendy|Ferland Mendy|费兰·门迪|LB|180
dani-ceballos|Dani Ceballos|达尼·塞瓦略斯|CM|179
mario-gomez|Mario Gómez|马里奥·戈麦斯|ST|189
mario-mandzukic|Mario Mandžukić|马里奥·曼朱基奇|ST|190
claudio-pizarro|Claudio Pizarro|克劳迪奥·皮萨罗|ST|184
xherdan-shaqiri|Xherdan Shaqiri|杰尔丹·沙奇里|RW/CAM|169
javi-martinez|Javi Martínez|哈维·马丁内斯|CDM/CB|190
dante|Dante|丹特|CB|189
holger-badstuber|Holger Badstuber|霍尔格·巴德施图贝尔|CB|190
anatoliy-tymoshchuk|Anatoliy Tymoshchuk|阿纳托利·季莫什丘克|CDM|181
diego-contento|Diego Contento|迭戈·孔滕托|LB|177
tom-starke|Tom Starke|汤姆·施塔克|GK|194
emre-can|Emre Can|埃姆雷·詹|CDM/CM|186
lucas-hernandez|Lucas Hernández|卢卡斯·埃尔南德斯|CB/LB|184
alphonso-davies|Alphonso Davies|阿方索·戴维斯|LB/LW|185
benjamin-pavard|Benjamin Pavard|本雅明·帕瓦尔|RB/CB|186
corentin-tolisso|Corentin Tolisso|科朗坦·托利索|CM|181
mickael-cuisance|Mickaël Cuisance|米卡埃尔·屈桑斯|CM|181
joshua-kimmich|Joshua Kimmich|约书亚·基米希|CDM/RB|177
leon-goretzka|Leon Goretzka|莱昂·戈雷茨卡|CM|189
serge-gnabry|Serge Gnabry|塞尔日·格纳布里|RW/ST|176
kingsley-coman|Kingsley Coman|金斯利·科曼|LW/RW|181
robert-lewandowski|Robert Lewandowski|罗伯特·莱万多夫斯基|ST|185
ivan-perisic|Ivan Perišić|伊万·佩里希奇|LM/LW|186
alvaro-odriozola|Álvaro Odriozola|阿尔瓦罗·奥德里奥索拉|RB|176
sven-ulreich|Sven Ulreich|斯文·乌尔赖希|GK|192
mehmet-scholl|Mehmet Scholl|梅赫梅特·绍尔|CAM/CM|177
stefan-effenberg|Stefan Effenberg|斯特凡·埃芬博格|CM|188
jens-jeremies|Jens Jeremies|延斯·耶雷梅斯|CDM|176
hasan-salihamidzic|Hasan Salihamidžić|哈桑·萨利哈米季奇|RM/RB|180
bixente-lizarazu|Bixente Lizarazu|比森特·利扎拉祖|LB|169
samuel-kuffour|Samuel Kuffour|萨穆埃尔·库福尔|CB|178
patrik-andersson|Patrik Andersson|帕特里克·安德松|CB|185
alexander-zickler|Alexander Zickler|亚历山大·齐克勒|ST|188
roque-santa-cruz|Roque Santa Cruz|罗克·圣克鲁斯|ST|191
javier-zanetti|Javier Zanetti|哈维尔·萨内蒂|RB/LB/CDM|178
esteban-cambiasso|Esteban Cambiasso|埃斯特班·坎比亚索|CDM/CM|177
thiago-motta|Thiago Motta|蒂亚戈·莫塔|CDM/CM|187
diego-milito|Diego Milito|迭戈·米利托|ST|183
goran-pandev|Goran Pandev|戈兰·潘德夫|ST/LW|184
walter-samuel|Walter Samuel|瓦尔特·萨穆埃尔|CB|183
lucio|Lúcio|卢西奥|CB|188
ivan-cordoba|Iván Córdoba|伊万·科尔多巴|CB|173
cristian-chivu|Cristian Chivu|克里斯蒂安·齐沃|LB/CB|184
marco-materazzi|Marco Materazzi|马尔科·马特拉齐|CB|193
dejan-stankovic|Dejan Stanković|德扬·斯坦科维奇|CM/CAM|181
sulley-muntari|Sulley Muntari|苏利·蒙塔里|CM/CDM|179
rene-krhin|Rene Krhin|雷内·科尔辛|CM|189
davide-santon|Davide Santon|达维德·桑顿|LB/RB|186
francesco-toldo|Francesco Toldo|弗朗切斯科·托尔多|GK|196
paolo-orlandoni|Paolo Orlandoni|保罗·奥兰多尼|GK|186
alessandro-matri|Alessandro Matri|亚历山德罗·马特里|ST|183
fernando-llorente|Fernando Llorente|费尔南多·略伦特|ST|195
roberto-pereyra|Roberto Pereyra|罗伯托·佩雷拉|CAM/CM|182
stefano-sturaro|Stefano Sturaro|斯特凡诺·斯图拉罗|CM|181
simone-padoin|Simone Padoin|西蒙尼·帕多因|CM/RB|179
simone-pepe|Simone Pepe|西蒙尼·佩佩|RM/RW|178
andrea-barzagli|Andrea Barzagli|安德烈亚·巴尔扎利|CB|187
angelo-ogbonna|Angelo Ogbonna|安杰洛·奥邦纳|CB|191
martin-caceres|Martín Cáceres|马丁·卡塞雷斯|CB/RB|180
rubinho|Rubinho|鲁比尼奥|GK|187
marco-storari|Marco Storari|马尔科·斯托拉里|GK|187
kylian-mbappe|Kylian Mbappé|基利安·姆巴佩|ST/LW|178
mauro-icardi|Mauro Icardi|毛罗·伊卡尔迪|ST|181
pablo-sarabia|Pablo Sarabia|巴勃罗·萨拉维亚|RW/CAM|174
ander-herrera|Ander Herrera|安德尔·埃雷拉|CM|182
leandro-paredes|Leandro Paredes|莱安德罗·帕雷德斯|CDM/CM|180
idrissa-gueye|Idrissa Gueye|伊德里萨·盖耶|CDM|174
julian-draxler|Julian Draxler|尤利安·德拉克斯勒|CAM/LW|185
layvin-kurzawa|Layvin Kurzawa|莱万·库尔扎瓦|LB|182
thilo-kehrer|Thilo Kehrer|蒂洛·科雷尔|CB/RB|186
colin-dagba|Colin Dagba|科林·达格巴|RB|170
abdou-diallo|Abdou Diallo|阿卜杜·迪亚洛|CB/LB|187
presnel-kimpembe|Presnel Kimpembe|普雷斯内尔·金彭贝|CB|183
marquinhos|Marquinhos|马尔基尼奥斯|CB/CDM|183
keylor-navas|Keylor Navas|凯洛尔·纳瓦斯|GK|185
sergio-rico|Sergio Rico|塞尔希奥·里科|GK|195
marcin-bulka|Marcin Bułka|马尔钦·布乌卡|GK|199
taffarel|Cláudio Taffarel|克劳迪奥·塔法雷尔|GK|183
gilmar-rinaldi|Gilmar Rinaldi|吉尔马·里纳尔迪|GK|184
jorginho|Jorginho|若尔金霍·巴西|RB|175
branco|Branco|布兰科|LB|182
leonardo|Leonardo|莱昂纳多|LB/LM/CAM|177
aldair|Aldair|阿尔代尔|CB|182
viola|Viola|维奥拉|ST|175
terry-butcher|Terry Butcher|特里·布彻|CB|193
bryan-robson|Bryan Robson|布赖恩·罗布森|CM|175
john-barnes|John Barnes|约翰·巴恩斯|LW/LM|182
ed-de-goey|Ed de Goey|埃德·德胡耶|GK|198
ruud-hesp|Ruud Hesp|鲁德·赫斯普|GK|194
philip-cocu|Phillip Cocu|菲利普·科库|CM/CDM/LB|184
dennis-bergkamp|Dennis Bergkamp|丹尼斯·博格坎普|ST/CAM|183
jerrel-hasselbaink|Jimmy Floyd Hasselbaink|吉米·弗洛伊德·哈塞尔巴因克|ST|178
frank-baumann|Frank Baumann|弗兰克·鲍曼|CDM/CB|187
lars-ricken|Lars Ricken|拉尔斯·里肯|CAM/CM|178
dietmar-hamann|Dietmar Hamann|迪特马尔·哈曼|CDM|191
rio-ferdinand|Rio Ferdinand|里奥·费迪南德|CB|189
sol-campbell|Sol Campbell|索尔·坎贝尔|CB|188
steven-gerrard|Steven Gerrard|史蒂文·杰拉德|CM/CAM/CDM|183
theo-walcott|Theo Walcott|西奥·沃尔科特|RW/ST|176
fernando-meira|Fernando Meira|费尔南多·梅拉|CB/CDM|190
simao|Simão|西芒|LW/RW|170
willy-sagnol|Willy Sagnol|威利·萨尼奥尔|RB|180
william-gallas|William Gallas|威廉·加拉斯|CB/LB|181
gael-givet|Gaël Givet|加埃尔·吉韦|CB/LB|181
alou-diarra|Alou Diarra|阿卢·迪亚拉|CDM|190
franck-ribery|Franck Ribéry|弗兰克·里贝里|LW|170
dirk-kuyt|Dirk Kuyt|德克·库伊特|RW/ST|184
arjen-robben|Arjen Robben|阿尔扬·罗本|RW/LW|180
thiago-silva|Thiago Silva|蒂亚戈·席尔瓦|CB|183
pablo-zabaleta|Pablo Zabaleta|巴勃罗·萨巴莱塔|RB|176
ezequiel-garay|Ezequiel Garay|埃塞基耶尔·加雷|CB|188
martin-demichelis|Martín Demichelis|马丁·德米凯利斯|CB|184
javier-mascherano|Javier Mascherano|哈维尔·马斯切拉诺|CDM/CB|174
enzo-perez|Enzo Pérez|恩佐·佩雷斯|CM|178
sergio-aguero|Sergio Agüero|塞尔希奥·阿圭罗|ST|173
philippe-coutinho|Philippe Coutinho|菲利佩·库蒂尼奥|CAM/LW|172
everton-ribeiro|Éverton Ribeiro|埃韦顿·里贝罗|CAM/RW|174
bernd-dreher|Bernd Dreher|贝恩德·德雷尔|GK|187
stefan-wessels|Stefan Wessels|斯特凡·韦塞尔斯|GK|190
michael-tarnat|Michael Tarnat|米夏埃尔·塔纳特|LB/LM|186
thorsten-fink|Thorsten Fink|托尔斯滕·芬克|CDM/CM|181
giovani-elber|Giovane Élber|吉奥瓦内·埃尔伯|ST|180
michel-salgado|Míchel Salgado|米歇尔·萨尔加多|RB|174
francisco-pavon|Francisco Pavón|弗朗西斯科·帕文|CB|188
aitor-karanka|Aitor Karanka|艾托尔·卡兰卡|CB|181
steve-mcmanaman|Steve McManaman|史蒂夫·麦克马纳曼|RM/LM/CAM|185
guti|Guti|古蒂|CAM/CM|185
henrik-larsson|Henrik Larsson|亨里克·拉尔森|ST|175
maxi-lopez|Maxi López|马克西·洛佩斯|ST|185
nemanja-vidic|Nemanja Vidić|内马尼亚·维迪奇|CB|190
carlos-tevez|Carlos Tévez|卡洛斯·特维斯|ST/CAM|171
mcdonald-mariga|McDonald Mariga|麦克唐纳·马里加|CDM|188
mario-balotelli|Mario Balotelli|马里奥·巴洛特利|ST|189
david-alaba|David Alaba|大卫·阿拉巴|CB/LB/CDM|180
daniel-van-buyten|Daniel Van Buyten|丹尼尔·范比滕|CB|196
jordi-masip|Jordi Masip|霍尔迪·马西普|GK|180
jordi-alba|Jordi Alba|霍尔迪·阿尔巴|LB|170
adriano|Adriano Correia|阿德里亚诺·科雷亚|LB/RB|172
marc-bartra|Marc Bartra|马克·巴尔特拉|CB|184
stephan-lichtsteiner|Stephan Lichtsteiner|斯特凡·利希施泰纳|RB/RWB|182
leonardo-bonucci|Leonardo Bonucci|莱昂纳多·博努奇|CB|190
giorgio-chiellini|Giorgio Chiellini|乔治奥·基耶利尼|CB/LB|187
claudio-marchisio|Claudio Marchisio|克劳迪奥·马尔基西奥|CM/CDM|180
arturo-vidal|Arturo Vidal|阿图罗·比达尔|CM/CDM|180
thiago-alcantara|Thiago Alcântara|蒂亚戈·阿尔坎塔拉|CM/CDM|174
joshua-zirkzee|Joshua Zirkzee|约书亚·齐尔克泽|ST|193
juan-bernat|Juan Bernat|胡安·贝尔纳特|LB|170
marco-verratti|Marco Verratti|马尔科·维拉蒂|CM/CDM|165
edinson-cavani|Edinson Cavani|埃丁森·卡瓦尼|ST|184
eric-maxim-choupo-moting|Eric Maxim Choupo-Moting|埃里克·马克西姆·舒波·莫廷|ST|191
kepa-arrizabalaga|Kepa Arrizabalaga|凯帕·阿里萨瓦拉加|GK|186
antonio-rudiger|Antonio Rüdiger|安东尼奥·吕迪格|CB|190
`;
for(const row of additions.trim().split('\n')){const [identity,name,displayName,pos,height]=row.split('|');const previous=registry.get(identity);registry.set(identity,{...previous,name,identity,displayName,positions:pos.split('/'),heightCm:Number(height)});}
const specs=[];
const add=(id,mode,team,year,flag,list)=>specs.push({id,mode,team,year,flag,list});
add('wc-brazil-1994','world_cup','巴西',1994,'🇧🇷',`
taffarel:93 zetti:79 gilmar-rinaldi:76 jorginho:95 cafu:90 branco:91 leonardo:89 ricardo-rocha:87 marcio-santos:90 aldair:94 ronaldao:78 dunga:94 mauro-silva:95 mazinho:88 zinho:87 rai:89 romario:99 bebeto:96 ronaldo-nazario:78 muller:83 paulo-sergio:80 viola:76`);
add('wc-england-1990','world_cup','英格兰',1990,'🏴',`
peter-shilton:89 chris-woods:80 dave-beasant:75 paul-parker:86 stuart-pearce:91 des-walker:92 mark-wright:90 terry-butcher:87 gary-stevens:82 tony-dorigo:80 steve-mcmahon:80 bryan-robson:88 paul-gascoigne:96 david-platt:94 chris-waddle:93 trevor-steven:83 neil-webb:81 john-barnes:88 gary-lineker:96 peter-beardsley:89 steve-bull:79`);
add('wc-netherlands-1998','world_cup','荷兰',1998,'🇳🇱',`
edwin-van-der-sar:94 ed-de-goey:81 ruud-hesp:78 michael-reiziger:89 frank-de-boer:94 jaap-stam:96 winston-bogarde:82 arthur-numan:89 danny-blind:86 aron-winter:86 wim-jonk:88 edgar-davids:96 clarence-seedorf:91 philip-cocu:92 ronald-de-boer:91 boudewijn-zenden:87 dennis-bergkamp:98 patrick-kluivert:94 marc-overmars:94 pierre-van-hooijdonk:85 jerrel-hasselbaink:86`);
add('wc-germany-2002','world_cup','德国',2002,'🇩🇪',`
oliver-kahn:99 jens-lehmann:85 hans-jorg-butt:79 thomas-linke:87 christoph-metzelder:90 marko-rehmer:80 frank-baumann:82 sebastian-kehl:82 christian-ziege:86 bernd-schneider:92 torsten-frings:91 michael-ballack:97 carsten-ramelow:87 dietmar-hamann:93 marco-bode:86 lars-ricken:79 jens-jeremies:86 jorg-bohme:78 miroslav-klose:94 oliver-neuville:88 carsten-jancker:83 oliver-bierhoff:85 gerald-asamoah:79`);
add('wc-england-2006','world_cup','英格兰',2006,'🏴',`
paul-robinson:87 david-james:82 scott-carson:74 gary-neville:90 rio-ferdinand:96 john-terry:95 sol-campbell:89 jamie-carragher:86 ashley-cole:96 wayne-bridge:81 steven-gerrard:95 frank-lampard:91 david-beckham:92 joe-cole:91 owen-hargreaves:93 michael-carrick:87 jermaine-jenas:78 stewart-downing:79 aaron-lennon:85 wayne-rooney:90 michael-owen:86 peter-crouch:87 theo-walcott:73`);
add('wc-portugal-2006','world_cup','葡萄牙',2006,'🇵🇹',`
ricardo:94 quim:80 paulo-santos:75 miguel:92 paulo-ferreira:86 ricardo-carvalho:96 fernando-meira:90 ricardo-costa:78 nuno-valente:89 caneira:81 costinha:88 maniche:94 petit:84 tiago:86 deco:95 hugo-viana:79 luis-figo:94 cristiano-ronaldo:94 simao:90 luis-boa-morte:81 pauleta:89 nuno-gomes:85 helder-postiga:82`);
add('wc-france-2006','world_cup','法国',2006,'🇫🇷',`
fabien-barthez:91 gregory-coupet:86 mickael-landreau:79 willy-sagnol:94 lilian-thuram:96 william-gallas:93 eric-abidal:92 gael-givet:79 jean-alain-boumsong:80 pascal-chimbonda:79 patrick-vieira:97 claude-makelele:96 alou-diarra:81 vikash-dhorasoo:78 zinedine-zidane:99 franck-ribery:91 florent-malouda:90 thierry-henry:96 david-trezeguet:90 sylvain-wiltord:86 louis-saha:86 sidney-govou:83`);
add('wc-england-2010','world_cup','英格兰',2010,'🏴',`
david-james:86 robert-green:79 joe-hart:80 glen-johnson:87 john-terry:91 matthew-upson:83 jamie-carragher:83 ledley-king:85 michael-dawson:78 ashley-cole:94 stephen-warnock:76 gareth-barry:85 frank-lampard:91 steven-gerrard:92 michael-carrick:85 james-milner:85 joe-cole:83 aaron-lennon:84 shaun-wright-phillips:80 wayne-rooney:88 jermain-defoe:87 peter-crouch:85 emile-heskey:80`);
add('wc-netherlands-2010','world_cup','荷兰',2010,'🇳🇱',`
maarten-stekelenburg:93 michel-vorm:80 sander-boschker:74 gregory-van-der-wiel:88 john-heitinga:91 joris-mathijsen:90 giovanni-van-bronckhorst:93 andre-ooijer:82 khalid-boulahrouz:82 edson-braafheid:77 mark-van-bommel:94 nigel-de-jong:92 wesley-sneijder:98 rafael-van-der-vaart:91 demy-de-zeeuw:83 ibrahim-afellay:82 dirk-kuyt:92 arjen-robben:97 robin-van-persie:92 klaas-jan-huntelaar:87 eljero-elia:86`);
add('wc-brazil-2014','world_cup','巴西',2014,'🇧🇷',`
julio-cesar:90 jefferson:81 victor:78 dani-alves:90 maicon:86 thiago-silva:95 david-luiz:88 dante:83 henrique:76 marcelo:91 maxwell:82 luiz-gustavo:90 fernandinho:85 paulinho:85 ramires:84 hernanes:82 oscar:91 willian:84 bernard:80 neymar:96 hulk:86 fred-guedes:80 jo:77`);
add('wc-argentina-2014','world_cup','阿根廷',2014,'🇦🇷',`
sergio-romero:93 mariano-andujar:79 agustin-orion:76 pablo-zabaleta:92 federico-fernandez:87 ezequiel-garay:91 marcos-rojo:91 martin-demichelis:89 hugo-campagnaro:79 jose-maria-basanta:80 javier-mascherano:96 fernando-gago:85 lucas-biglia:88 enzo-perez:86 maxi-rodriguez:83 augusto-fernandez:78 ricky-alvarez:77 lionel-messi:99 angel-di-maria:95 gonzalo-higuain:90 sergio-aguero:88 ezequiel-lavezzi:91 rodrigo-palacio:82`);
add('wc-brazil-2018','world_cup','巴西',2018,'🇧🇷',`
alisson:92 ederson:86 cassio:78 danilo:86 fagner:85 thiago-silva:95 marquinhos:86 miranda:91 geromel:78 marcelo:94 filipe-luis:88 casemiro:95 fernandinho:86 paulinho:87 renato-augusto:86 fred-rodrigues:79 philippe-coutinho:95 willian:88 douglas-costa:86 neymar:96 gabriel-jesus:86 roberto-firmino:91 taison:77`);
add('wc-brazil-2022','world_cup','巴西',2022,'🇧🇷',`
alisson:94 ederson:88 weverton:77 danilo:89 dani-alves:82 alex-sandro:88 alex-telles:83 thiago-silva:95 marquinhos:93 eder-militao:91 bremer:85 casemiro:96 fred-rodrigues:86 fabinho:85 bruno-guimaraes:86 lucas-paqueta:90 everton-ribeiro:79 neymar:97 vinicius-junior:93 raphinha:86 rodrygo:88 richarlison:94 gabriel-jesus:84 gabriel-martinelli:83 antony:81 pedro-guilherme:80`);
add('ucl-bayern-2001','ucl','拜仁慕尼黑',2001,'🔴',`
oliver-kahn:99 bernd-dreher:76 stefan-wessels:73 willy-sagnol:88 samuel-kuffour:93 patrik-andersson:92 thomas-linke:90 bixente-lizarazu:95 mehmet-scholl:94 stefan-effenberg:97 jens-jeremies:92 hasan-salihamidzic:90 owen-hargreaves:85 michael-tarnat:84 thorsten-fink:86 roque-santa-cruz:83 carsten-jancker:87 alexander-zickler:83 paulo-sergio:90 giovani-elber:95`);
add('ucl-real-madrid-2002','ucl','皇家马德里',2002,'⚪',`
iker-casillas:95 cesar-sanchez:87 michel-salgado:91 fernando-hierro:95 ivan-helguera:92 roberto-carlos:97 francisco-pavon:80 aitor-karanka:82 raul-bravo:76 claude-makelele:95 flavio-conceicao:83 albert-celades:80 santiago-solari:89 steve-mcmanaman:90 guti:87 zinedine-zidane:99 luis-figo:97 raul:97 fernando-morientes:94 pedro-munitis:80 savio:81`);
add('ucl-barcelona-2006','ucl','巴塞罗那',2006,'🔵',`
victor-valdes:91 albert-jorquera:76 carles-puyol:96 rafael-marquez:93 oleguer:85 giovanni-van-bronckhorst:90 sylvinho:84 belletti:89 edmilson:91 thiago-motta:86 gabri:79 xavi:92 andres-iniesta:89 mark-van-bommel:90 deco:96 ronaldinho:99 samuel-etoo:97 ludovic-giuly:91 henrik-larsson:92 santiago-ezquerro:78 maxi-lopez:80 lionel-messi:89`);
add('ucl-manchester-united-2008','ucl','曼彻斯特联',2008,'🔴',`
edwin-van-der-sar:95 tomasz-kuszczak:78 ben-foster:75 rio-ferdinand:97 nemanja-vidic:96 wes-brown:91 patrice-evra:93 gary-neville:82 john-oshea:85 gerard-pique:79 paul-scholes:93 ryan-giggs:91 michael-carrick:92 owen-hargreaves:93 darren-fletcher:86 anderson:85 park-ji-sung:88 nani:87 cristiano-ronaldo:99 wayne-rooney:96 carlos-tevez:93 louis-saha:81`);
add('ucl-inter-2010','ucl','国际米兰',2010,'🔵',`
julio-cesar:96 francesco-toldo:80 paolo-orlandoni:72 maicon:97 javier-zanetti:93 lucio:96 walter-samuel:95 cristian-chivu:91 ivan-cordoba:87 marco-materazzi:85 davide-santon:81 esteban-cambiasso:96 thiago-motta:92 dejan-stankovic:90 sulley-muntari:86 mcdonald-mariga:78 rene-krhin:73 wesley-sneijder:98 samuel-etoo:93 diego-milito:99 goran-pandev:91 mario-balotelli:85`);
add('ucl-manchester-united-2011','ucl','曼彻斯特联',2011,'🔴',`
edwin-van-der-sar:95 tomasz-kuszczak:77 rio-ferdinand:94 nemanja-vidic:96 patrice-evra:92 fabio-da-silva:86 rafael-da-silva:85 chris-smalling:84 jonny-evans:80 john-oshea:84 paul-scholes:89 ryan-giggs:94 michael-carrick:91 darren-fletcher:88 anderson:83 park-ji-sung:92 nani:92 antonio-valencia:91 wayne-rooney:97 javier-hernandez:93 dimitar-berbatov:92 michael-owen:80`);
add('ucl-bayern-2013','ucl','拜仁慕尼黑',2013,'🔴',`
manuel-neuer:97 tom-starke:78 philipp-lahm:97 david-alaba:93 jerome-boateng:92 dante:93 daniel-van-buyten:86 holger-badstuber:85 diego-contento:78 bastian-schweinsteiger:97 javi-martinez:96 toni-kroos:93 luiz-gustavo:88 anatoliy-tymoshchuk:83 emre-can:75 franck-ribery:99 arjen-robben:98 thomas-muller:96 xherdan-shaqiri:87 mario-mandzukic:93 mario-gomez:92 claudio-pizarro:85`);
add('ucl-barcelona-2015','ucl','巴塞罗那',2015,'🔵',`
marc-andre-ter-stegen:92 claudio-bravo:91 jordi-masip:74 dani-alves:93 gerard-pique:94 javier-mascherano:92 jordi-alba:92 jeremy-mathieu:86 adriano:83 marc-bartra:83 thomas-vermaelen:77 martin-montoya:78 sergio-busquets:94 andres-iniesta:95 ivan-rakitic:93 xavi:92 sergi-roberto:81 rafinha-alcantara:85 lionel-messi:99 neymar:97 luis-suarez:98 pedro-rodriguez:89 munir-el-haddadi:76 sandro-ramirez:76`);
add('ucl-juventus-2015','ucl','尤文图斯',2015,'⚫',`
gianluigi-buffon:97 marco-storari:80 rubinho:71 stephan-lichtsteiner:91 leonardo-bonucci:93 giorgio-chiellini:95 andrea-barzagli:93 patrice-evra:91 martin-caceres:85 angelo-ogbonna:81 andrea-pirlo:93 claudio-marchisio:93 arturo-vidal:96 paul-pogba:94 roberto-pereyra:87 stefano-sturaro:83 simone-padoin:79 simone-pepe:77 carlos-tevez:97 alvaro-morata:93 fernando-llorente:86 alessandro-matri:79 kingsley-coman:77`);
add('ucl-bayern-2020','ucl','拜仁慕尼黑',2020,'🔴',`
manuel-neuer:99 sven-ulreich:79 joshua-kimmich:96 benjamin-pavard:92 alphonso-davies:96 david-alaba:95 jerome-boateng:92 niklas-sule:89 lucas-hernandez:87 alvaro-odriozola:77 thiago-alcantara:96 leon-goretzka:93 corentin-tolisso:86 javi-martinez:85 mickael-cuisance:75 thomas-muller:96 serge-gnabry:96 kingsley-coman:93 ivan-perisic:90 philippe-coutinho:90 robert-lewandowski:99 joshua-zirkzee:77`);
add('ucl-psg-2020','ucl','巴黎圣日耳曼',2020,'🔵',`
keylor-navas:95 sergio-rico:82 marcin-bulka:73 thilo-kehrer:86 colin-dagba:80 thiago-silva:95 presnel-kimpembe:92 marquinhos:95 abdou-diallo:83 juan-bernat:92 layvin-kurzawa:83 marco-verratti:94 ander-herrera:90 leandro-paredes:89 idrissa-gueye:88 julian-draxler:83 pablo-sarabia:86 angel-di-maria:96 neymar:98 kylian-mbappe:97 mauro-icardi:89 edinson-cavani:87 eric-maxim-choupo-moting:84`);
add('ucl-real-madrid-2024','ucl','皇家马德里',2024,'⚪',`
thibaut-courtois:93 andriy-lunin:93 kepa-arrizabalaga:83 dani-carvajal:97 antonio-rudiger:97 nacho-fernandez:92 eder-militao:85 david-alaba:87 ferland-mendy:92 fran-garcia:80 lucas-vazquez:88 toni-kroos:97 luka-modric:92 federico-valverde:97 aurelien-tchouameni:93 eduardo-camavinga:93 dani-ceballos:81 jude-bellingham:97 arda-guler:79 brahim-diaz:90 vinicius-junior:99 rodrygo:93 joselu:92`);
const missing=[...new Set(specs.flatMap(s=>s.list.trim().split(/\s+/).map(token=>token.split(':')[0])).filter(id=>!registry.has(id)))];
if(missing.length)throw Error(`Expansion metadata missing: ${missing.join(', ')}`);
export const expansionSquads=specs.map(({list,...s})=>({...s,players:list.trim().split(/\s+/).map(token=>{const [id,rating,positions]=token.split(':');const player=registry.get(id);return{...player,rating:Number(rating),...(positions?{positions:positions.split('/')}:{})};})}));
