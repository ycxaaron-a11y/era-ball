// Curated national-team tournament rosters; not exhaustive registration lists.
import {worldCupSquads} from './catalog-world-cup.js';import {uclSquads} from './catalog-ucl.js';import {expansionSquads} from './catalog-expansion.js';import {chineseNames} from './player-names-zh.js';
const registry=new Map([...worldCupSquads,...uclSquads,...expansionSquads].flatMap(s=>s.players).map(p=>[p.identity,{...p,displayName:p.displayName||chineseNames[p.identity]}]));
const metadata=`
jean-francois-domergue|让·弗朗索瓦·多梅尔格|LB/CB
thierry-tusseau|蒂埃里·蒂索|LB/CDM
daniel-bravo|达尼埃尔·布拉沃|CM
bernard-lacombe|贝尔纳·拉孔布|ST
didier-six|迪迪埃·西克斯|LW
hans-van-breukelen|汉斯·范布鲁克伦|GK
joop-hiele|约普·希勒|GK
adri-van-tiggelen|阿德里·范蒂赫伦|LB
berry-van-aerle|贝里·范阿尔勒|RB
ronald-koeman|罗纳德·科曼|CB/CDM
sjaak-troost|沙克·特罗斯特|CB
jan-wouters|扬·沃特斯|CDM/CM
gerald-vanenburg|杰拉尔德·范恩堡|RW/CM
erwin-koeman|埃尔温·科曼|LM/CM
wilbert-suvrijn|威尔贝特·叙弗赖因|CDM
wim-kieft|维姆·基夫特|ST
john-bosman|约翰·博斯曼|ST
john-van-t-schip|约翰·范斯希普|RW
lars-hogh|拉尔斯·赫格|GK
mogens-krogh|莫恩斯·克罗格|GK
john-sivebaek|约翰·西韦贝克|RB
lars-olsen|拉尔斯·奥尔森|CB
kent-nielsen|肯特·尼尔森|CB
kim-christofte|金·克里斯托夫特|LB/CB
torben-piechnik|托尔本·皮希尼克|CB
claus-christiansen|克劳斯·克里斯蒂安森|CB
john-jensen|约翰·延森|CM/CDM
kim-vilfort|金·维尔福特|CM
henrik-larsen|亨里克·拉尔森·丹麦|CAM/CM
brian-laudrup|布赖恩·劳德鲁普|RW/ST
flemming-povlsen|弗莱明·波尔森|ST
lars-elstrup|拉尔斯·埃尔斯特鲁普|ST
bent-christensen|本特·克里斯滕森|ST
peter-nielsen|彼得·尼尔森|CM
per-frandsen|佩尔·弗兰德森|CM
ulrich-rame|乌尔里希·拉梅|GK
nicolas-anelka|尼古拉·阿内尔卡|ST
moreira|若泽·莫雷拉|GK
jorge-andrade|若热·安德拉德|CB
fernando-couto|费尔南多·库托|CB
rui-jorge|鲁伊·若热|LB
rui-costa|鲁伊·科斯塔|CAM
antonios-nikopolidis|安东尼斯·尼科波利迪斯|GK
kostas-chalkias|科斯塔斯·哈尔基亚斯|GK
fanis-katergiannakis|法尼斯·卡特尔吉安纳基斯|GK
giourkas-seitaridis|尤尔卡斯·塞塔里迪斯|RB
traianos-dellas|特拉亚诺斯·德拉斯|CB
michalis-kapsis|米哈利斯·卡普西斯|CB
takis-fyssas|塔基斯·菲萨斯|LB
nikos-dabizas|尼科斯·达比扎斯|CB
stavros-venetidis|斯塔夫罗斯·韦内蒂迪斯|LB
theo-zagorakis|特奥多罗斯·扎戈拉基斯|CM/CDM
angelos-basinas|安格洛斯·巴西纳斯|CDM
giorgos-karagounis|约尔戈斯·卡拉古尼斯|CM/CAM
kostas-katsouranis|科斯塔斯·卡楚拉尼斯|CDM/CM
pantelis-kafes|潘特利斯·卡费斯|CM
vassilis-tsiartas|瓦西利斯·齐亚尔塔斯|CAM
stelios-giannakopoulos|斯泰利奥斯·扬纳科普洛斯|RM
angelos-charisteas|安格洛斯·查理斯特亚斯|ST
zisis-vryzas|齐西斯·弗里扎斯|ST
demis-nikolaidis|戴米斯·尼科莱迪斯|ST
vassilis-lakis|瓦西利斯·拉基斯|RW
dimitrios-papadopoulos|迪米特里奥斯·帕帕多普洛斯|ST
andres-palop|安德烈斯·帕洛普|GK
fernando-navarro|费尔南多·纳瓦罗|LB
juanito-gutierrez|胡安尼托·古铁雷斯|CB
marcos-senna|马科斯·塞纳|CDM
santi-cazorla|桑蒂·卡索拉|CM/CAM
ruben-de-la-red|鲁本·德拉雷德|CM
daniel-guiza|丹尼尔·古伊萨|ST
sergio-garcia|塞尔希奥·加西亚|ST/RW
juanfran|胡安弗兰|RB
alvaro-negredo|阿尔瓦罗·内格雷多|ST
rui-patricio|鲁伊·帕特里西奥|GK
anthony-lopes|安东尼·洛佩斯|GK
eduardo|爱德华多·卡瓦略|GK
cedric-soares|塞德里克·苏亚雷斯|RB
jose-fonte|若泽·丰特|CB
raphael-guerreiro|拉斐尔·格雷罗|LB/CM
bruno-alves|布鲁诺·阿尔维斯|CB
eliseu|埃利塞乌|LB
vieirinha|维埃里尼亚|RB/RW
william-carvalho|威廉·卡瓦略|CDM
danilo-pereira|达尼洛·佩雷拉|CDM/CB
renato-sanches|雷纳托·桑谢斯|CM
adrien-silva|阿德里安·席尔瓦|CM
joao-moutinho|若昂·穆蒂尼奥|CM
joao-mario|若昂·马里奥|CM/RM
andre-gomes|安德烈·戈麦斯|CM
rafa-silva|拉法·席尔瓦|LW/CAM
ricardo-quaresma|里卡多·夸雷斯马|RW
eder|埃德尔·洛佩斯|ST
benoit-costil|伯努瓦·科斯蒂尔|GK
bacary-sagna|巴卡里·萨尼亚|RB
laurent-koscielny|洛朗·科斯切尔尼|CB
eliaquim-mangala|埃利亚奎姆·曼加拉|CB
lucas-digne|卢卡斯·迪涅|LB
moussa-sissoko|穆萨·西索科|CM/RM
yohan-cabaye|约昂·卡巴耶|CM/CDM
dimitri-payet|迪米特里·帕耶|CAM/LW
anthony-martial|安东尼·马夏尔|ST/LW
andre-pierre-gignac|安德烈·皮埃尔·吉尼亚克|ST
gianluigi-donnarumma|詹路易吉·多纳鲁马|GK
salvatore-sirigu|萨尔瓦托雷·西里古|GK
alex-meret|亚历克斯·梅雷特|GK
giovanni-di-lorenzo|乔瓦尼·迪洛伦佐|RB
leonardo-spinazzola|莱昂纳多·斯皮纳佐拉|LB/LWB
emerson-palmieri|埃默松·帕尔米耶里|LB
francesco-acerbi|弗朗切斯科·阿切尔比|CB
alessandro-bastoni|亚历山德罗·巴斯托尼|CB
rafael-toloi|拉斐尔·托洛伊|CB
alessandro-florenzi|亚历山德罗·弗洛伦齐|RB/CM
jorginho-italy|若日尼奥·意大利|CDM
nicolo-barella|尼科洛·巴雷拉|CM
manuel-locatelli|曼努埃尔·洛卡特利|CM/CDM
bryan-cristante|布赖恩·克里斯坦特|CM/CDM
matteo-pessina|马泰奥·佩西纳|CM/CAM
lorenzo-insigne|洛伦佐·因西涅|LW
federico-chiesa|费德里科·基耶萨|RW/LW
ciro-immobile|奇罗·因莫比莱|ST
andrea-belotti|安德烈亚·贝洛蒂|ST
domenico-berardi|多梅尼科·贝拉尔迪|RW
federico-bernardeschi|费德里科·贝尔纳代斯基|RW/CAM
jordan-pickford|乔丹·皮克福德|GK
dean-henderson|迪恩·亨德森|GK
sam-johnstone|萨姆·约翰斯通|GK
harry-maguire|哈里·马奎尔|CB
luke-shaw|卢克·肖|LB
kieran-trippier|基兰·特里皮尔|RB/LB
reece-james|里斯·詹姆斯|RB
tyrone-mings|泰隆·明斯|CB
conor-coady|康纳·科迪|CB
declan-rice|德克兰·赖斯|CDM/CM
mason-mount|梅森·芒特|CAM/CM
raheem-sterling|拉希姆·斯特林|LW/RW
harry-kane|哈里·凯恩|ST
bukayo-saka|布卡约·萨卡|RW
marcus-rashford|马库斯·拉什福德|LW/ST
dominic-calvert-lewin|多米尼克·卡尔弗特·勒温|ST
unai-simon|乌奈·西蒙|GK
david-raya|大卫·拉亚|GK
alex-remiro|亚历克斯·雷米罗|GK
robin-le-normand|罗宾·勒诺尔芒|CB
marc-cucurella|马克·库库雷利亚|LB
alejandro-grimaldo|亚历杭德罗·格里马尔多|LB
fabian-ruiz|法比安·鲁伊斯|CM
dani-olmo|达尼·奥尔莫|CAM/LW
pedri|佩德里|CM/CAM
mikel-merino|米克尔·梅里诺|CM
martin-zubimendi|马丁·苏维门迪|CDM
alex-baena|亚历克斯·巴埃纳|CAM/LM
fermin-lopez|费尔明·洛佩斯|CM/CAM
mikel-oyarzabal|米克尔·奥亚萨瓦尔|ST/LW
lamine-yamal|拉明·亚马尔|RW
nico-williams|尼科·威廉斯|LW
ferran-torres|费兰·托雷斯|RW/ST
ayoze-perez|阿约塞·佩雷斯|ST/LW
mike-maignan|迈克·迈尼昂|GK
brice-samba|布里斯·桑巴|GK
jules-kounde|朱尔·孔德|RB/CB
william-saliba|威廉·萨利巴|CB
dayot-upamecano|达约·于帕梅卡诺|CB
theo-hernandez|特奥·埃尔南德斯|LB
ibrahima-konate|易卜拉希马·科纳特|CB
jonathan-clauss|若纳唐·克洛斯|RB
adrien-rabiot|阿德里安·拉比奥|CM
youssouf-fofana|尤素夫·福法纳|CDM/CM
randal-kolo-muani|兰德尔·科洛·穆阿尼|ST
marcus-thuram|马库斯·图拉姆|ST
bradley-barcola|布拉德利·巴尔科拉|LW
aaron-ramsdale|阿伦·拉姆斯代尔|GK
marc-guehi|马克·格伊|CB
ezri-konsa|埃兹里·孔萨|CB/RB
lewis-dunk|刘易斯·邓克|CB
kobbie-mainoo|科比·梅努|CM
conor-gallagher|康纳·加拉格尔|CM
ollie-watkins|奥利·沃特金斯|ST
ivan-toney|伊万·托尼|ST
anthony-gordon|安东尼·戈登|LW
eberechi-eze|埃贝雷奇·埃泽|CAM/LW
jarrod-bowen|贾罗德·鲍恩|RW
oliver-baumann|奥利弗·鲍曼|GK
jonathan-tah|若纳唐·塔|CB
maximilian-mittelstadt|马克西米利安·米特尔施泰特|LB
david-raum|大卫·劳姆|LB
waldemar-anton|瓦尔德马·安东|CB
benjamin-henrichs|本雅明·亨里希斯|RB
robert-andrich|罗伯特·安德里希|CDM
pascal-gross|帕斯卡尔·格罗斯|CM
jamal-musiala|贾马尔·穆西亚拉|CAM/LW
florian-wirtz|弗洛里安·维尔茨|CAM
kai-havertz|凯·哈弗茨|ST/CAM
leroy-sane|勒鲁瓦·萨内|RW/LW
deniz-undav|德尼兹·翁达夫|ST
maximilian-beier|马克西米利安·拜尔|ST
chris-fuhrich|克里斯·菲里希|LW
sergio-goycochea|塞尔希奥·戈耶切亚|GK
angel-comizzo|安赫尔·科米索|GK
roberto-sensini|罗伯托·森西尼|CB/RB
fernando-caceres|费尔南多·卡塞雷斯|CB
jorge-borelli|豪尔赫·博雷利|CB
jose-chamot|何塞·查莫特|LB/CB
hugo-perez|乌戈·佩雷斯|CDM
diego-simeone|迭戈·西蒙尼|CM/CDM
fernando-redondo|费尔南多·雷东多|CDM
jose-basualdo|何塞·巴苏阿尔多|CM
leonardo-rodriguez|莱昂纳多·罗德里格斯|CAM
diego-cagna|迭戈·卡尼亚|CM
gustavo-zapata|古斯塔沃·萨帕塔|CDM
gabriel-batistuta|加布里埃尔·巴蒂斯图塔|ST
abel-balbo|阿贝尔·巴尔博|ST
ramon-medina-bello|拉蒙·梅迪纳·贝略|ST
alberto-acosta|阿尔贝托·阿科斯塔|ST
nestor-gorosito|内斯托尔·戈罗西托|CAM
carlos-germano|卡洛斯·热尔马诺|GK
goncalves|贡萨尔维斯|CB
junior-baiano|儒尼奥尔·巴亚诺|CB
ze-carlos|泽·卡洛斯|RB
cesar-sampaio|塞萨尔·桑帕约|CDM
djalminha|贾尔米尼亚|CAM
edmundo|埃德蒙多|ST
paulo-nunes|保罗·努内斯|ST/RW
odvan|奥德万|CB
joao-carlos|若昂·卡洛斯|CB
evanilson|埃瓦尼尔松|RB
emerson|埃默松·费雷拉|CDM
marcos-assuncao|马科斯·阿松桑|CDM
beto|贝托·茹贝尔特|CM
alex-de-souza|亚历克斯·德索萨|CAM
amoroso|阿莫鲁索|ST
gomes|埃雷利奥·戈麦斯|GK
fabio|法比奥·德伊夫森|GK
luisao|路易松|CB
juan|胡安·西尔维拉|CB
alex|亚历克斯·科斯塔|CB
gustavo-nery|古斯塔沃·内里|LB
mancini|曼奇尼|RM/RB
marcelo-bordon|马塞洛·博尔东|CB
renato-dirnei|雷纳托·迪尔内伊|CDM
edu-gaspar|埃杜·加斯帕尔|CM
dudu-cearense|杜杜·塞阿伦塞|CM
julio-baptista|儒利奥·巴普蒂斯塔|CAM/ST
diego-ribas|迭戈·里巴斯|CAM
felipe-loureiro|费利佩·洛雷罗|CAM
adriano-leite|阿德里亚诺·莱特|ST
luis-fabiano|路易斯·法比亚诺|ST
ricardo-oliveira|里卡多·奥利维拉|ST
vagner-love|瓦格纳·洛维|ST
doni|多尼|GK
helton|埃尔通|GK
alex-silva|亚历克斯·席尔瓦|CB
naldo|纳尔多|CB
gilberto-melo|吉尔伯托·梅洛|LB
kleber-correia|克莱伯·科雷亚|LB
mineiro|米内罗|CDM
josue|若苏埃|CDM
fernando-menegazzo|费尔南多·梅内加佐|CDM
elano|埃拉诺|CM/RM
robinho|罗比尼奥|LW/ST
afonso-alves|阿方索·阿尔维斯|ST
fernando-muslera|费尔南多·穆斯莱拉|GK
juan-castillo|胡安·卡斯蒂略|GK
martin-silva|马丁·席尔瓦|GK
diego-lugano|迭戈·卢加诺|CB
diego-godin|迭戈·戈丁|CB
mauricio-victorino|毛里西奥·维克托里诺|CB
sebastian-coates|塞巴斯蒂安·科茨|CB
maxi-pereira|马克西·佩雷拉|RB
alvaro-pereira|阿尔瓦罗·佩雷拉|LB
diego-perez|迭戈·佩雷斯|CDM
egidio-arevalo-rios|埃吉迪奥·阿雷瓦洛·里奥斯|CDM
walter-gargano|瓦尔特·加尔加诺|CDM
sebastian-eguren|塞巴斯蒂安·埃古伦|CDM
alvaro-gonzalez|阿尔瓦罗·冈萨雷斯|CM
cristian-rodriguez|克里斯蒂安·罗德里格斯|LM
nicolas-lodeiro|尼古拉斯·洛代罗|CAM
diego-forlan|迭戈·弗兰|ST/CAM
sebastian-abreu|塞巴斯蒂安·阿布鲁|ST
abel-hernandez|阿贝尔·埃尔南德斯|ST
johnny-herrera|约翰尼·埃雷拉|GK
paulo-garces|保罗·加尔塞斯|GK
mauricio-isla|毛里西奥·伊斯拉|RB/RM
gary-medel|加里·梅德尔|CB/CDM
gonzalo-jara|冈萨洛·哈拉|CB
jean-beausejour|让·博塞茹尔|LB/LM
eugenio-mena|欧亨尼奥·梅纳|LB
jose-rojas|何塞·罗哈斯|CB
miiko-albornoz|米科·阿尔沃诺斯|LB
marcelo-diaz|马塞洛·迪亚斯|CDM
charles-aranguiz|查尔斯·阿朗吉斯|CM
jorge-valdivia|豪尔赫·巴尔迪维亚|CAM
felipe-gutierrez|费利佩·古铁雷斯|CM
francisco-silva|弗朗西斯科·席尔瓦|CDM
alexis-sanchez|亚历克西斯·桑切斯|LW/ST
eduardo-vargas|爱德华多·巴尔加斯|ST
mauricio-pinilla|毛里西奥·皮尼利亚|ST
angelo-henriquez|安赫洛·亨里克斯|ST
matias-fernandez|马蒂亚斯·费尔南德斯|CAM
edson-puch|埃德松·普奇|LW
nahuel-guzman|纳韦尔·古斯曼|GK
facundo-roncaglia|法昆多·隆卡利亚|CB/RB
milton-casco|米尔顿·卡斯科|LB/RB
ever-banega|埃韦尔·巴内加|CM
javier-pastore|哈维尔·帕斯托雷|CAM
cristopher-toselli|克里斯托弗·托塞利|GK
enzo-roco|恩佐·罗科|CB
erick-pulgar|埃里克·普尔加|CDM
pedro-pablo-hernandez|佩德罗·巴勃罗·埃尔南德斯|CM
jose-pedro-fuenzalida|何塞·佩德罗·富恩萨利达|RW
fabian-orellana|法比安·奥雷利亚纳|RW
nicolas-castillo|尼古拉斯·卡斯蒂略|ST
gabriel-mercado|加布里埃尔·梅尔卡多|RB/CB
ramiro-funes-mori|拉米罗·富内斯·莫里|CB
victor-cuesta|维克托·奎斯塔|CB
erik-lamela|埃里克·拉梅拉|RW/CAM
nicolas-gaitan|尼古拉斯·盖坦|LW
arthur-melo|阿图尔·梅洛|CM
allan|阿兰·马克斯|CDM
david-neres|大卫·内雷斯|RW
everton-soares|埃韦顿·索亚雷斯|LW
pedro-gallese|佩德罗·加莱塞|GK
carlos-caceda|卡洛斯·卡塞达|GK
patricio-alvarez|帕特里西奥·阿尔瓦雷斯|GK
luis-advincula|路易斯·阿德文库拉|RB
carlos-zambrano|卡洛斯·桑布拉诺|CB
luis-abram|路易斯·阿夫拉姆|CB
miguel-trauco|米格尔·特劳科|LB
aldo-corzo|阿尔多·科尔索|RB
anderson-santamaria|安德松·圣马里亚|CB
christian-ramos|克里斯蒂安·拉莫斯|CB
renato-tapia|雷纳托·塔皮亚|CDM
yoshimar-yotun|约希马尔·约通|CM
christian-cueva|克里斯蒂安·奎瓦|CAM
edison-flores|埃迪松·弗洛雷斯|LW
andre-carrillo|安德烈·卡里略|RW
christofer-gonzales|克里斯托弗·冈萨雷斯|CM
andy-polo|安迪·波洛|RW
paolo-guerrero|保罗·格雷罗|ST
raul-ruidiaz|劳尔·鲁伊迪亚斯|ST
juan-musso|胡安·穆索|GK
lucas-martinez-quarta|卢卡斯·马丁内斯·夸尔塔|CB
giovani-lo-celso|乔瓦尼·洛塞尔索|CM/CAM
nicolas-gonzalez|尼古拉斯·冈萨雷斯|LW
renan-lodi|雷南·洛迪|LB
emerson-royal|埃默松·罗亚尔|RB
douglas-luiz|道格拉斯·路易斯|CM/CDM
gabriel-barbosa|加布里埃尔·巴尔博萨|ST
alejandro-garnacho|亚历杭德罗·加纳乔|LW
camilo-vargas|卡米洛·巴尔加斯|GK
david-ospina|戴维·奥斯皮纳|GK
alvaro-montero|阿尔瓦罗·蒙特罗|GK
daniel-munoz|丹尼尔·穆尼奥斯|RB
jhon-lucumi|约翰·卢库米|CB
davinson-sanchez|达文森·桑切斯|CB
carlos-cuesta|卡洛斯·奎斯塔|CB
yerry-mina|耶里·米纳|CB
johan-mojica|约翰·莫希卡|LB
santiago-arias|圣地亚哥·阿里亚斯|RB
jefferson-lerma|杰斐逊·莱尔马|CDM
richard-rios|理查德·里奥斯|CM
mateus-uribe|马特乌斯·乌里韦|CM
kevin-castano|凯文·卡斯塔尼奥|CDM
juan-fernando-quintero|胡安·费尔南多·金特罗|CAM
jorge-carrascal|豪尔赫·卡拉斯卡尔|CAM
luis-diaz|路易斯·迪亚斯|LW
luis-sinisterra|路易斯·西尼斯特拉|LW
rafael-santos-borre|拉斐尔·桑托斯·博雷|ST
jhon-cordoba|约翰·科尔多瓦|ST
jhon-duran|约翰·杜兰|ST
miguel-borja|米格尔·博尔哈|ST
`;
for(const row of metadata.trim().split('\n').filter(Boolean)){const [identity,displayName,pos]=row.split('|');registry.set(identity,{identity,name:identity.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' '),displayName,positions:pos.split('/')});}
const rows=[];const add=(id,mode,team,year,flag,list)=>rows.push({id,mode,team,year,flag,list});
add('euro-france-1984','euro','法国',1984,'🇫🇷',`joel-bats:92 albert-rust:78 patrick-battiston:92 manuel-amoros:94 maxime-bossis:92 yvon-le-roux:86 jean-francois-domergue:90 thierry-tusseau:84 jean-tigana:96 alain-giresse:96 luis-fernandez:91 michel-platini:99 bernard-genghini:86 jean-marc-ferreri:82 daniel-bravo:79 bernard-lacombe:86 didier-six:86 bruno-bellone:84 dominique-rocheteau:87`);
add('euro-netherlands-1988','euro','荷兰',1988,'🇳🇱',`hans-van-breukelen:94 joop-hiele:77 adri-van-tiggelen:93 berry-van-aerle:91 ronald-koeman:96 frank-rijkaard:96 sjaak-troost:79 aron-winter:81 jan-wouters:92 gerald-vanenburg:91 arnold-muhren:93 ruud-gullit:98 erwin-koeman:88 wilbert-suvrijn:78 marco-van-basten:99 wim-kieft:91 john-bosman:85 john-van-t-schip:81`);
add('euro-denmark-1992','euro','丹麦',1992,'🇩🇰',`peter-schmeichel:98 lars-hogh:77 mogens-krogh:76 john-sivebaek:88 lars-olsen:92 kent-nielsen:89 kim-christofte:90 torben-piechnik:86 claus-christiansen:80 john-jensen:94 kim-vilfort:94 henrik-larsen:94 brian-laudrup:96 flemming-povlsen:93 lars-elstrup:88 bent-christensen:81 peter-nielsen:79 per-frandsen:78`);
add('euro-france-2000','euro','法国',2000,'🇫🇷',`fabien-barthez:95 bernard-lama:80 ulrich-rame:77 lilian-thuram:96 laurent-blanc:94 marcel-desailly:95 bixente-lizarazu:94 vincent-candela:84 frank-leboeuf:83 patrick-vieira:95 emmanuel-petit:93 didier-deschamps:92 christian-karembeu:86 zinedine-zidane:99 robert-pires:90 youri-djorkaeff:93 christophe-dugarry:86 thierry-henry:96 david-trezeguet:94 nicolas-anelka:89 sylvain-wiltord:91`);
add('euro-portugal-2004','euro','葡萄牙',2004,'🇵🇹',`ricardo:91 quim:78 moreira:75 miguel:91 paulo-ferreira:87 ricardo-carvalho:96 jorge-andrade:94 fernando-couto:85 rui-jorge:84 nuno-valente:90 costinha:89 maniche:95 petit:86 tiago:84 deco:95 rui-costa:92 luis-figo:96 cristiano-ronaldo:95 simao:89 pauleta:88 nuno-gomes:90 helder-postiga:86`);
add('euro-greece-2004','euro','希腊',2004,'🇬🇷',`antonios-nikopolidis:94 kostas-chalkias:77 fanis-katergiannakis:75 giourkas-seitaridis:94 traianos-dellas:95 michalis-kapsis:94 takis-fyssas:92 nikos-dabizas:84 stavros-venetidis:81 theo-zagorakis:97 angelos-basinas:94 giorgos-karagounis:93 kostas-katsouranis:93 pantelis-kafes:83 vassilis-tsiartas:88 stelios-giannakopoulos:89 angelos-charisteas:96 zisis-vryzas:92 demis-nikolaidis:85 vassilis-lakis:83 dimitrios-papadopoulos:80`);
add('euro-spain-2008','euro','西班牙',2008,'🇪🇸',`iker-casillas:98 pepe-reina:83 andres-palop:78 sergio-ramos:95 carles-puyol:97 carlos-marchena:94 joan-capdevila:94 raul-albiol:84 fernando-navarro:81 juanito-gutierrez:80 xavi:99 andres-iniesta:96 marcos-senna:97 xabi-alonso:92 cesc-fabregas:94 santi-cazorla:89 david-silva:95 ruben-de-la-red:81 david-villa:97 fernando-torres:97 daniel-guiza:88 sergio-garcia:79`);
add('euro-spain-2012','euro','西班牙',2012,'🇪🇸',`iker-casillas:98 pepe-reina:83 victor-valdes:84 sergio-ramos:98 gerard-pique:96 jordi-alba:96 alvaro-arbeloa:93 raul-albiol:82 juanfran:83 xavi:98 andres-iniesta:99 xabi-alonso:97 sergio-busquets:97 cesc-fabregas:96 david-silva:97 santi-cazorla:88 javi-martinez:86 jesus-navas:88 juan-mata:87 fernando-torres:93 fernando-llorente:85 alvaro-negredo:82 pedro-rodriguez:89`);
add('euro-portugal-2016','euro','葡萄牙',2016,'🇵🇹',`rui-patricio:96 anthony-lopes:80 eduardo:77 cedric-soares:92 pepe:98 jose-fonte:95 raphael-guerreiro:95 ricardo-carvalho:87 bruno-alves:86 eliseu:82 vieirinha:81 william-carvalho:94 danilo-pereira:88 renato-sanches:95 adrien-silva:92 joao-moutinho:92 joao-mario:90 andre-gomes:86 rafa-silva:81 cristiano-ronaldo:98 nani:96 ricardo-quaresma:93 eder:91`);
add('euro-france-2016','euro','法国',2016,'🇫🇷',`hugo-lloris:96 steve-mandanda:82 benoit-costil:77 bacary-sagna:93 laurent-koscielny:95 samuel-umtiti:92 adil-rami:89 patrice-evra:92 eliaquim-mangala:80 lucas-digne:82 paul-pogba:94 blaise-matuidi:93 ngolo-kante:94 moussa-sissoko:94 yohan-cabaye:85 antoine-griezmann:99 dimitri-payet:97 olivier-giroud:94 kingsley-coman:89 anthony-martial:84 andre-pierre-gignac:87`);
add('euro-italy-2020','euro','意大利',2020,'🇮🇹',`gianluigi-donnarumma:99 salvatore-sirigu:81 alex-meret:77 giovanni-di-lorenzo:94 leonardo-bonucci:98 giorgio-chiellini:97 leonardo-spinazzola:97 emerson-palmieri:90 francesco-acerbi:89 alessandro-bastoni:87 rafael-toloi:86 alessandro-florenzi:88 jorginho-italy:98 marco-verratti:97 nicolo-barella:96 manuel-locatelli:94 bryan-cristante:90 matteo-pessina:91 lorenzo-insigne:96 federico-chiesa:98 ciro-immobile:93 andrea-belotti:86 domenico-berardi:91 federico-bernardeschi:87`);
add('euro-england-2020','euro','英格兰',2020,'🏴',`jordan-pickford:96 aaron-ramsdale:78 sam-johnstone:77 kyle-walker:96 john-stones:95 harry-maguire:96 luke-shaw:97 kieran-trippier:94 reece-james:87 tyrone-mings:85 conor-coady:83 declan-rice:94 kalvin-phillips:95 jordan-henderson:88 jude-bellingham:84 mason-mount:92 phil-foden:88 jack-grealish:92 raheem-sterling:98 harry-kane:98 bukayo-saka:91 marcus-rashford:86 jadon-sancho:87 dominic-calvert-lewin:83`);
add('euro-spain-2024','euro','西班牙',2024,'🇪🇸',`unai-simon:96 david-raya:84 alex-remiro:80 dani-carvajal:98 robin-le-normand:95 aymeric-laporte:96 marc-cucurella:97 nacho-fernandez:92 jesus-navas:89 alejandro-grimaldo:86 rodri:99 fabian-ruiz:98 dani-olmo:98 pedri:94 mikel-merino:93 martin-zubimendi:94 alex-baena:84 fermin-lopez:83 lamine-yamal:99 nico-williams:98 alvaro-morata:94 joselu:86 ferran-torres:87 ayoze-perez:84 mikel-oyarzabal:96`);
add('euro-france-2024','euro','法国',2024,'🇫🇷',`mike-maignan:98 brice-samba:81 alphonse-areola:79 jules-kounde:96 william-saliba:98 dayot-upamecano:94 theo-hernandez:97 ferland-mendy:87 ibrahima-konate:87 benjamin-pavard:86 jonathan-clauss:84 ngolo-kante:97 aurelien-tchouameni:94 adrien-rabiot:93 eduardo-camavinga:91 youssouf-fofana:86 antoine-griezmann:93 kylian-mbappe:95 ousmane-dembele:93 randal-kolo-muani:90 marcus-thuram:89 bradley-barcola:88 olivier-giroud:87 kingsley-coman:86`);
add('euro-england-2024','euro','英格兰',2024,'🏴',`jordan-pickford:97 aaron-ramsdale:81 dean-henderson:78 kyle-walker:93 john-stones:95 marc-guehi:97 luke-shaw:91 kieran-trippier:91 ezri-konsa:91 joe-gomez:85 lewis-dunk:83 declan-rice:96 kobbie-mainoo:97 conor-gallagher:88 trent-alexander-arnold:90 jude-bellingham:97 phil-foden:93 cole-palmer:97 bukayo-saka:97 harry-kane:94 ollie-watkins:94 ivan-toney:90 anthony-gordon:85 eberechi-eze:87 jarrod-bowen:85`);
add('euro-germany-2024','euro','德国',2024,'🇩🇪',`manuel-neuer:96 marc-andre-ter-stegen:84 oliver-baumann:78 joshua-kimmich:97 antonio-rudiger:98 jonathan-tah:94 nico-schlotterbeck:93 maximilian-mittelstadt:92 david-raum:91 waldemar-anton:85 benjamin-henrichs:85 toni-kroos:98 ilkay-gundogan:96 robert-andrich:95 pascal-gross:89 emre-can:88 jamal-musiala:99 florian-wirtz:97 kai-havertz:95 niclas-fullkrug:94 leroy-sane:90 deniz-undav:85 maximilian-beier:82 chris-fuhrich:83`);
add('copa-argentina-1993','copa_america','阿根廷',1993,'🇦🇷',`sergio-goycochea:97 angel-comizzo:78 oscar-ruggeri:95 roberto-sensini:93 fernando-caceres:94 jorge-borelli:89 jose-chamot:90 hugo-perez:88 diego-simeone:96 fernando-redondo:98 jose-basualdo:91 leonardo-rodriguez:93 diego-cagna:83 gustavo-zapata:84 gabriel-batistuta:99 abel-balbo:94 ramon-medina-bello:88 alberto-acosta:86 nestor-gorosito:87`);
add('copa-brazil-1997','copa_america','巴西',1997,'🇧🇷',`taffarel:94 dida:82 carlos-germano:78 cafu:97 roberto-carlos:98 aldair:96 goncalves:90 junior-baiano:89 ze-maria:86 ze-carlos:84 dunga:96 flavio-conceicao:92 cesar-sampaio:93 zinho:91 leonardo:95 ze-roberto:90 djalminha:92 ronaldo-nazario:99 romario:98 denilson:94 edmundo:91 paulo-nunes:85`);
add('copa-brazil-1999','copa_america','巴西',1999,'🇧🇷',`dida:96 marcos:82 rogerio-ceni:80 cafu:97 roberto-carlos:97 aldair:94 odvan:91 joao-carlos:86 evanilson:85 serginho:86 flavio-conceicao:94 cesar-sampaio:94 emerson:92 ze-roberto:94 vampeta:91 marcos-assuncao:86 beto:83 alex-de-souza:89 rivaldo:99 ronaldo-nazario:99 amoroso:96 ronaldinho:93`);
add('copa-brazil-2004','copa_america','巴西',2004,'🇧🇷',`julio-cesar:96 gomes:82 fabio:78 maicon:94 luisao:95 juan:95 alex:90 gustavo-nery:92 maxwell:84 mancini:86 marcelo-bordon:83 renato-dirnei:94 edu-gaspar:95 kleberson:92 dudu-cearense:87 julio-baptista:90 diego-ribas:91 alex-de-souza:97 felipe-loureiro:86 adriano-leite:99 luis-fabiano:94 ricardo-oliveira:88 vagner-love:86`);
add('copa-brazil-2007','copa_america','巴西',2007,'🇧🇷',`doni:96 helton:82 maicon:97 dani-alves:95 juan:97 alex:96 alex-silva:86 naldo:85 gilberto-melo:92 kleber-correia:86 gilberto-silva:96 mineiro:94 josue:91 fernando-menegazzo:83 elano:94 diego-ribas:93 anderson:84 julio-baptista:97 robinho:99 vagner-love:91 afonso-alves:86 fred-guedes:85`);
add('copa-uruguay-2011','copa_america','乌拉圭',2011,'🇺🇾',`fernando-muslera:97 juan-castillo:79 martin-silva:77 diego-lugano:96 diego-godin:97 mauricio-victorino:93 sebastian-coates:94 martin-caceres:95 maxi-pereira:95 alvaro-pereira:96 diego-perez:96 egidio-arevalo-rios:96 walter-gargano:91 sebastian-eguren:87 alvaro-gonzalez:90 cristian-rodriguez:92 nicolas-lodeiro:87 luis-suarez:99 diego-forlan:98 edinson-cavani:94 sebastian-abreu:87 abel-hernandez:84`);
add('copa-chile-2015','copa_america','智利',2015,'🇨🇱',`claudio-bravo:98 johnny-herrera:82 paulo-garces:78 mauricio-isla:96 gary-medel:97 gonzalo-jara:95 jean-beausejour:94 eugenio-mena:91 jose-rojas:88 miiko-albornoz:84 marcelo-diaz:96 charles-aranguiz:98 arturo-vidal:99 jorge-valdivia:97 felipe-gutierrez:88 francisco-silva:90 alexis-sanchez:99 eduardo-vargas:98 mauricio-pinilla:89 angelo-henriquez:85 matias-fernandez:92 edson-puch:86`);
add('copa-argentina-2015','copa_america','阿根廷',2015,'🇦🇷',`sergio-romero:95 nahuel-guzman:79 mariano-andujar:77 pablo-zabaleta:95 nicolas-otamendi:95 ezequiel-garay:94 marcos-rojo:93 martin-demichelis:89 facundo-roncaglia:84 milton-casco:82 javier-mascherano:98 lucas-biglia:93 ever-banega:92 fernando-gago:88 javier-pastore:95 roberto-pereyra:88 lionel-messi:99 angel-di-maria:97 sergio-aguero:98 gonzalo-higuain:94 carlos-tevez:92 ezequiel-lavezzi:94`);
add('copa-chile-2016','copa_america','智利',2016,'🇨🇱',`claudio-bravo:98 johnny-herrera:81 cristopher-toselli:78 mauricio-isla:97 gary-medel:98 gonzalo-jara:97 jean-beausejour:95 eugenio-mena:90 enzo-roco:84 erick-pulgar:85 marcelo-diaz:97 charles-aranguiz:99 arturo-vidal:99 pedro-pablo-hernandez:91 francisco-silva:94 alexis-sanchez:99 eduardo-vargas:99 edson-puch:94 jose-pedro-fuenzalida:94 fabian-orellana:89 mauricio-pinilla:86 nicolas-castillo:84`);
add('copa-argentina-2016','copa_america','阿根廷',2016,'🇦🇷',`sergio-romero:96 nahuel-guzman:79 mariano-andujar:77 gabriel-mercado:95 nicolas-otamendi:97 ramiro-funes-mori:95 marcos-rojo:94 facundo-roncaglia:85 victor-cuesta:82 javier-mascherano:98 augusto-fernandez:94 ever-banega:97 lucas-biglia:93 javier-pastore:86 erik-lamela:93 nicolas-gaitan:92 lionel-messi:99 angel-di-maria:95 sergio-aguero:93 gonzalo-higuain:97 ezequiel-lavezzi:96 angel-correa:83`);
add('copa-brazil-2019','copa_america','巴西',2019,'🇧🇷',`alisson:99 ederson:84 cassio:78 dani-alves:99 thiago-silva:98 marquinhos:97 miranda:91 eder-militao:86 alex-sandro:96 filipe-luis:93 fagner:87 casemiro:98 arthur-melo:96 fernandinho:89 allan:90 lucas-paqueta:85 philippe-coutinho:96 willian:89 david-neres:86 roberto-firmino:98 gabriel-jesus:98 everton-soares:99 richarlison:92`);
add('copa-peru-2019','copa_america','秘鲁',2019,'🇵🇪',`pedro-gallese:97 carlos-caceda:79 patricio-alvarez:76 luis-advincula:95 carlos-zambrano:96 luis-abram:94 miguel-trauco:95 aldo-corzo:87 anderson-santamaria:88 christian-ramos:85 renato-tapia:96 yoshimar-yotun:97 christian-cueva:96 edison-flores:95 andre-carrillo:97 christofer-gonzales:87 andy-polo:84 paolo-guerrero:99 jefferson-farfan:92 raul-ruidiaz:87`);
add('copa-argentina-2021','copa_america','阿根廷',2021,'🇦🇷',`emiliano-martinez:99 franco-armani:82 juan-musso:80 nahuel-molina:94 gonzalo-montiel:93 cristian-romero:97 nicolas-otamendi:96 german-pezzella:89 lisandro-martinez:88 lucas-martinez-quarta:85 nicolas-tagliafico:92 marcos-acuna:95 rodrigo-de-paul:99 leandro-paredes:96 giovani-lo-celso:97 guido-rodriguez:91 exequiel-palacios:86 lionel-messi:99 angel-di-maria:99 lautaro-martinez:98 sergio-aguero:88 nicolas-gonzalez:92 angel-correa:86 julian-alvarez:81`);
add('copa-brazil-2021','copa_america','巴西',2021,'🇧🇷',`ederson:96 alisson:93 weverton:79 danilo:94 thiago-silva:97 marquinhos:98 eder-militao:95 alex-sandro:93 renan-lodi:89 emerson-royal:84 casemiro:98 fred-rodrigues:94 douglas-luiz:89 fabinho:90 lucas-paqueta:97 everton-ribeiro:88 neymar:99 richarlison:96 roberto-firmino:94 gabriel-jesus:91 gabriel-barbosa:90 vinicius-junior:86 everton-soares:89`);
add('copa-argentina-2024','copa_america','阿根廷',2024,'🇦🇷',`emiliano-martinez:99 franco-armani:81 geronimo-rulli:82 nahuel-molina:94 gonzalo-montiel:95 cristian-romero:99 lisandro-martinez:98 nicolas-otamendi:92 german-pezzella:87 lucas-martinez-quarta:84 nicolas-tagliafico:97 marcos-acuna:91 rodrigo-de-paul:98 leandro-paredes:94 enzo-fernandez:96 alexis-mac-allister:98 giovani-lo-celso:94 exequiel-palacios:88 guido-rodriguez:86 lionel-messi:97 angel-di-maria:98 lautaro-martinez:99 julian-alvarez:97 nicolas-gonzalez:94 alejandro-garnacho:86`);
add('copa-colombia-2024','copa_america','哥伦比亚',2024,'🇨🇴',`camilo-vargas:97 david-ospina:84 alvaro-montero:78 daniel-munoz:98 jhon-lucumi:93 davinson-sanchez:97 carlos-cuesta:96 yerry-mina:89 johan-mojica:95 santiago-arias:89 jefferson-lerma:98 richard-rios:98 mateus-uribe:91 kevin-castano:87 juan-fernando-quintero:94 jorge-carrascal:89 james-rodriguez:99 luis-diaz:98 luis-sinisterra:89 rafael-santos-borre:93 jhon-cordoba:96 jhon-duran:85 miguel-borja:86`);
const missing=[...new Set(rows.flatMap(s=>s.list.trim().split(/\s+/).map(t=>t.split(':')[0])).filter(id=>!registry.has(id)))];
if(missing.length)throw Error('International metadata missing: '+missing.join(', '));
export const internationalSquads=rows.map(({list,...s})=>({...s,players:list.trim().split(/\s+/).map(t=>{const [id,rating]=t.split(':');return{...registry.get(id),rating:Number(rating)};})}));
