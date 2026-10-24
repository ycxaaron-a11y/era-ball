// Historical tournament squads. Ratings are editorial era-specific game estimates,
// not FIFA ratings. Fringe players and reserve keepers are intentionally lower.
// Each entry is a real named squad member; this is a selected roster, not a claim
// to reproduce every registered player in every tournament.
const rows = [
  ['wc-brazil-1962','巴西',1962,'🇧🇷',`
Gilmar|GK|88|classic-keeper
Castilho|GK|78|classic-keeper
Djalma Santos|RB|91
Nílton Santos|LB|92
Mauro Ramos|CB|87|classic-stopper
Zózimo|CB|85|classic-stopper
Bellini|CB|80|classic-stopper
Altair|LB/CB|77
Jair Marinho|RB|75
Jurandir|CB|73
Zito|CDM/CM|89
Didi|CM/CAM|94|classic-maker
Zequinha|CDM/CM|77
Mengálvio|CM|78
Garrincha|RW|99
Pelé|ST/CAM|93
Vavá|ST|91
Amarildo|ST|89
Zagallo|LW/LM|88
Coutinho|ST|81
Pepe|LW|80
Jair da Costa|RW|76`],
  ['wc-england-1966','英格兰',1966,'🏴',`
Gordon Banks|GK|93|classic-keeper
Peter Bonetti|GK|79|classic-keeper
Ron Springett|GK|76|classic-keeper
George Cohen|RB|86
Ray Wilson|LB|87
Jack Charlton|CB|88|classic-stopper
Bobby Moore|CB|95
Jimmy Armfield|RB|82
Gerry Byrne|LB|76
Norman Hunter|CB/CDM|79|classic-stopper
Bobby Charlton|CAM/CM|96
Alan Ball|CM/RM|88
Nobby Stiles|CDM/CB|86|classic-stopper
Martin Peters|LM/CM|87
Ron Flowers|CM/CDM|75
George Eastham|CAM|76|classic-maker
Geoff Hurst|ST|93
Roger Hunt|ST|87
Jimmy Greaves|ST|89
John Connelly|RW|80
Terry Paine|RW/RM|78
Ian Callaghan|RM/RW|77`],
  ['wc-brazil-1970','巴西',1970,'🇧🇷',`
Félix|GK|83|classic-keeper
Ado|GK|73|classic-keeper
Emerson Leão|GK|75|classic-keeper
Carlos Alberto Torres|RB/CB|95
Brito|CB|87|classic-stopper
Wilson Piazza|CB/CDM|87
Everaldo|LB|83
Marco Antônio|LB|78
Baldocchi|CB|75|classic-stopper
Joel Camargo|CB|76|classic-stopper
Fontana|CB|78|classic-stopper
Zé Maria|RB|77
Clodoaldo|CDM/CM|88
Gérson|CM|95|classic-maker
Rivelino|LW/CAM|95
Jairzinho|RW/ST|96
Pelé|ST/CAM|99
Tostão|ST/CAM|94
Paulo Cézar Caju|LW/CAM|84
Edu|LW|79
Roberto Miranda|ST|75
Dario|ST|74`],
  ['wc-netherlands-1974','荷兰',1974,'🇳🇱',`
Jan Jongbloed|GK|85
Piet Schrijvers|GK|82|classic-keeper
Eddy Treijtel|GK|74|classic-keeper
Wim Suurbier|RB|88
Ruud Krol|LB/CB|93
Wim Rijsbergen|CB|86|classic-stopper
Arie Haan|CB/CDM/CM|89
Rinus Israël|CB|82|classic-stopper
Pleun Strik|CB|77|classic-stopper
Cees van Ierssel|RB/CB|75
Wim van Hanegem|CM|94
Wim Jansen|CDM/CM|89
Johan Neeskens|CM/CAM|95
Theo de Jong|CM|81
Harry Vos|LB|75
Willy van de Kerkhof|RM/CM|81
René van de Kerkhof|RW|82
Rob Rensenbrink|LW|92
Johnny Rep|RW/ST|90
Johan Cruyff|ST/CAM/LW|99
Piet Keizer|LW|86
Ruud Geels|ST|79`],
  ['wc-argentina-1978','阿根廷',1978,'🇦🇷',`
Ubaldo Fillol|GK|93|classic-keeper
Héctor Baley|GK|77|classic-keeper
Ricardo La Volpe|GK|74|classic-keeper
Daniel Passarella|CB|94
Luis Galván|CB|87|classic-stopper
Alberto Tarantini|LB|87
Jorge Olguín|RB/CB|85
Rubén Pagnanini|RB|76
Daniel Killer|CB|74|classic-stopper
Américo Gallego|CDM|87
Osvaldo Ardiles|CM|92
Omar Larrosa|CM|80
Ricardo Villa|CM/CAM|81
Miguel Oviedo|CDM/CM|76
José Daniel Valencia|CAM|82|classic-maker
Norberto Alonso|CAM|81|classic-maker
Mario Kempes|ST/CAM|97
Leopoldo Luque|ST|90
Daniel Bertoni|RW/ST|88
Oscar Ortiz|LW|86
René Houseman|RW|84
Rubén Galván|CDM/CM|77`],
  ['wc-netherlands-1978','荷兰',1978,'🇳🇱',`
Jan Jongbloed|GK|84
Piet Schrijvers|GK|84|classic-keeper
Pim Doesburg|GK|76|classic-keeper
Ruud Krol|CB/LB|94
Wim Rijsbergen|CB|83|classic-stopper
Wim Suurbier|RB|82
Ernie Brandts|CB|85|classic-stopper
Jan Poortvliet|LB/CB|83
Piet Wildschut|LB/LM|77
Arie Haan|CM/CDM|90
Wim Jansen|CDM/CM|86
Johan Neeskens|CM/CAM|92
Willy van de Kerkhof|CM/RM|89
René van de Kerkhof|RW/RM|89
Dick Schoenaker|CM|78
Jan Peters|CM|79
Rob Rensenbrink|LW|95
Johnny Rep|RW/ST|91
Dick Nanninga|ST|83
Harry Lubse|ST|73`],
  ['wc-italy-1982','意大利',1982,'🇮🇹',`
Dino Zoff|GK|94|classic-keeper
Ivano Bordon|GK|78|classic-keeper
Giovanni Galli|GK|77|classic-keeper
Claudio Gentile|CB/RB|91|classic-stopper
Gaetano Scirea|CB/CDM|94
Fulvio Collovati|CB|88|classic-stopper
Antonio Cabrini|LB|91
Giuseppe Bergomi|RB/CB|86
Franco Baresi|CB|81
Pietro Vierchowod|CB|80|classic-stopper
Gabriele Oriali|CDM/RB|87
Marco Tardelli|CM/CDM|91
Giancarlo Antognoni|CAM/CM|90|classic-maker
Giuseppe Dossena|CM|78
Giampiero Marini|CDM|80
Franco Causio|RW/RM|81
Bruno Conti|RW|93
Francesco Graziani|ST|85
Paolo Rossi|ST|97
Alessandro Altobelli|ST|86
Daniele Massaro|LW/ST|77
Franco Selvaggi|ST|74`],
  ['wc-brazil-1982','巴西',1982,'🇧🇷',`
Waldir Peres|GK|81|classic-keeper
Carlos Roberto Gallo|GK|78|classic-keeper
Paulo Sérgio|GK|73|classic-keeper
Leandro|RB|88
Oscar Bernardi|CB|86|classic-stopper
Luizinho|CB|87
Júnior|LB/CM|91
Edinho|CB|85
Edevaldo|RB|77
Pedrinho|LB|76
Falcão|CM|95
Sócrates|CAM/CM|95|classic-maker
Zico|CAM/ST|97|classic-maker
Toninho Cerezo|CDM/CM|91
Batista|CDM|82
Paulo Isidoro|CM/RM|82
Dirceu|CAM/LW|81|classic-maker
Éder Aleixo|LW|89
Serginho Chulapa|ST|82
Roberto Dinamite|ST|83
Renato|LW|75`],
  ['wc-argentina-1986','阿根廷',1986,'🇦🇷',`
Nery Pumpido|GK|86|classic-keeper
Luis Islas|GK|76|classic-keeper
Héctor Zelada|GK|73|classic-keeper
José Luis Brown|CB|87|classic-stopper
Oscar Ruggeri|CB|91|classic-stopper
José Luis Cuciuffo|CB/RB|84
Julio Olarticoechea|LB/LM|86
Néstor Clausen|RB|80
Oscar Garré|LB|79
Daniel Passarella|CB|83
Sergio Batista|CDM|86
Ricardo Giusti|RM/CDM|86
Jorge Burruchaga|CAM/RM|91
Héctor Enrique|CM|86
Carlos Tapia|CAM|78|classic-maker
Marcelo Trobbiani|CAM/CM|75|classic-maker
Claudio Borghi|CAM|78|classic-maker
Ricardo Bochini|CAM|83|classic-maker
Diego Maradona|CAM/ST|99
Jorge Valdano|ST|91
Pedro Pasculli|ST|81
Sergio Almirón|ST|74`],
  ['wc-france-1986','法国',1986,'🇫🇷',`
Joël Bats|GK|89|classic-keeper
Albert Rust|GK|76|classic-keeper
Philippe Bergeroo|GK|75|classic-keeper
Patrick Battiston|CB/RB|87
Manuel Amoros|RB/LB|92
Maxime Bossis|CB/LB|90
Yvon Le Roux|CB|81|classic-stopper
William Ayache|LB/RB|82
Michel Bibard|RB|79
Thierry Tusseau|LB/CDM|80
Luis Fernández|CDM/CM|89
Jean Tigana|CM/CDM|94
Alain Giresse|CM/CAM|91|classic-maker
Michel Platini|CAM/CM|96
Jean-Marc Ferreri|CAM|78|classic-maker
Philippe Vercruysse|CM/CAM|77
Dominique Rocheteau|ST/RW|88
Yannick Stopyra|ST|85
Jean-Pierre Papin|ST|83
Bruno Bellone|LW|81
Daniel Xuereb|ST|76
Bernard Genghini|CAM/CM|80|classic-maker`],
  ['wc-germany-1990','西德',1990,'🇩🇪',`
Bodo Illgner|GK|89|classic-keeper
Raimond Aumann|GK|77|classic-keeper
Andreas Köpke|GK|79|classic-keeper
Andreas Brehme|LB/LM|95
Jürgen Kohler|CB|91|classic-stopper
Guido Buchwald|CB/CDM|89
Thomas Berthold|RB/CB|86
Klaus Augenthaler|CB|88
Stefan Reuter|RB/RM|82
Alois Reinhardt|CB|75|classic-stopper
Günter Hermann|CDM|75
Lothar Matthäus|CM/CDM|97
Thomas Häßler|CAM/RM|89
Pierre Littbarski|RW/CAM|88
Andreas Möller|CAM|83
Uwe Bein|CAM|82|classic-maker
Olaf Thon|CM|82
Jürgen Klinsmann|ST|93
Rudi Völler|ST|92
Karl-Heinz Riedle|ST|81
Frank Mill|ST|77
Paul Steiner|CB|76|classic-stopper`],
  ['wc-bulgaria-1994','保加利亚',1994,'🇧🇬',`
Borislav Mihaylov|GK|85|classic-keeper
Zdravko Zdravkov|GK|74|classic-keeper
Plamen Nikolov|GK|73|classic-keeper
Trifon Ivanov|CB|87|classic-stopper
Petar Hubchev|CB|84|classic-stopper
Tsanko Tsvetanov|LB|82
Emil Kremenliev|RB|82
Ilian Kiryakov|LB/RB|78
Nikolay Iliev|CB|80|classic-stopper
Petar Aleksandrov|ST|75
Hristo Stoichkov|LW/ST|96
Emil Kostadinov|ST/RW|87
Krasimir Balakov|CAM/CM|92|classic-maker
Yordan Lechkov|CM|91
Zlatko Yankov|CDM|83
Nasko Sirakov|ST|84
Ivaylo Yordanov|ST/CM|81
Daniel Borimirov|RM/CM|80
Ivaylo Andonov|ST|75
Boncho Genchev|ST/CAM|77
Georgi Georgiev|CM|76
Petar Mihtarski|ST|74`],
  ['wc-france-1998','法国',1998,'🇫🇷',`
Fabien Barthez|GK|94
Bernard Lama|GK|81
Lionel Charbonnier|GK|74
Lilian Thuram|RB/CB|94
Marcel Desailly|CB/CDM|93
Laurent Blanc|CB|91
Bixente Lizarazu|LB|91
Frank Leboeuf|CB|84
Vincent Candela|LB/RB|82
Didier Deschamps|CDM|91
Emmanuel Petit|CM/CDM|90
Christian Karembeu|CDM/RM|85
Patrick Vieira|CM/CDM|84
Alain Boghossian|CM|82
Zinedine Zidane|CAM/CM|97
Youri Djorkaeff|CAM/ST|90
Stéphane Guivarc'h|ST|82
Christophe Dugarry|ST/LW|81
Thierry Henry|LW/ST|85
David Trezeguet|ST|79
Robert Pirès|LM/LW|82
Bernard Diomède|LW|76`],
  ['wc-croatia-1998','克罗地亚',1998,'🇭🇷',`
Dražen Ladić|GK|88
Marijan Mrmić|GK|77
Vladimir Vasilj|GK|72
Dario Šimić|CB/RB|86
Igor Štimac|CB|87|classic-stopper
Slaven Bilić|CB|88
Igor Tudor|CB/CDM|80
Anthony Šerić|LB|75
Robert Jarni|LB/LM|91
Zoran Mamić|CB/CDM|79
Goran Jurić|CB|78
Aljoša Asanović|CM/CAM|90|classic-maker
Robert Prosinečki|CAM/CM|90|classic-maker
Zvonimir Boban|CAM/CM|92
Zvonimir Soldo|CDM/CB|87
Krunoslav Jurčić|CDM/CM|82
Mario Stanić|RM/ST|86
Silvio Marić|CAM/RM|78
Davor Šuker|ST|95
Goran Vlaović|ST|87
Ardian Kozniku|ST|75
Petar Krpan|ST|74`],
  ['wc-brazil-2002','巴西',2002,'🇧🇷',`
Marcos|GK|91
Dida|GK|83
Rogério Ceni|GK|80
Cafu|RB|96
Roberto Carlos|LB|96
Lúcio|CB|90
Roque Júnior|CB|83
Edmílson|CB/CDM|86
Anderson Polga|CB|77
Belletti|RB|79
Júnior|LB|78
Gilberto Silva|CDM|89
Kléberson|CM|86
Juninho Paulista|CAM/CM|84
Vampeta|CDM/CM|77
Kaká|CAM|79
Ronaldo Nazário|ST|99
Rivaldo|CAM/LW/ST|97
Ronaldinho|CAM/LW|96
Denílson|LW|81
Luizão|ST|77
Edílson|ST/RW|79`],
  ['wc-senegal-2002','塞内加尔',2002,'🇸🇳',`
Tony Sylva|GK|86
Omar Diallo|GK|74
Kalidou Cissokho|GK|70
Habib Beye|RB/CB|82
Omar Daf|LB/RB|82
Ferdinand Coly|RB/CB|84
Aliou Cissé|CDM/CB|84
Lamine Diatta|CB|85
Pape Malick Diop|CB/CDM|83
Alassane Ndour|LB|76
Papa Bouba Diop|CM/CDM|88
Salif Diao|CM/CDM|84
Amdy Faye|CDM|80
Khalilou Fadiga|LM/CAM|88
Moussa Ndiaye|LW/ST|79
Sylvain Ndiaye|CM|77
Makhtar Ndiaye|CM|74
El Hadji Diouf|ST/LW|91
Henri Camara|ST|88
Souleymane Camara|ST/RW|79
Amara Traoré|ST|73
Pape Thiaw|ST|76`],
  ['wc-italy-2006','意大利',2006,'🇮🇹',`
Gianluigi Buffon|GK|96
Angelo Peruzzi|GK|79
Marco Amelia|GK|74
Fabio Cannavaro|CB|97
Gianluca Zambrotta|RB/LB|94
Alessandro Nesta|CB|90
Marco Materazzi|CB|90
Fabio Grosso|LB|91
Andrea Barzagli|CB|81
Cristian Zaccardo|RB/CB|78
Massimo Oddo|RB|80
Andrea Pirlo|CM/CDM|93
Gennaro Gattuso|CDM/CM|91
Daniele De Rossi|CDM/CM|85
Simone Perrotta|CM/CAM|87
Mauro Camoranesi|RM/RW|87
Simone Barone|CM|76
Francesco Totti|CAM/ST|92
Luca Toni|ST|90
Alberto Gilardino|ST|85
Filippo Inzaghi|ST|87
Alessandro Del Piero|ST/CAM|89
Vincenzo Iaquinta|ST/RW|82`],
  ['wc-ghana-2006','加纳',2006,'🇬🇭',`
Richard Kingson|GK|85
George Owu|GK|74
Sammy Adjei|GK|75
John Paintsil|RB|82
Samuel Kuffour|CB|84
John Mensah|CB|86
Hans Sarpei|LB/RB|81
Shilla Illiasu|CB|82
Habib Mohamed|LB|76
Eric Addo|CB/CDM|80
Michael Essien|CM/CDM|93
Stephen Appiah|CM/CAM|90
Sulley Muntari|CM/LM|88
Derek Boateng|CDM/CM|79
Otto Addo|RM/CAM|78
Haminu Draman|RW/RM|79
Razak Pimpong|ST/RW|76
Matthew Amoah|ST|82
Asamoah Gyan|ST|86`],
  ['wc-spain-2010','西班牙',2010,'🇪🇸',`
Iker Casillas|GK|96
Pepe Reina|GK|82
Víctor Valdés|GK|83
Sergio Ramos|RB/CB|92
Gerard Piqué|CB|91
Carles Puyol|CB|95
Joan Capdevila|LB|86
Raúl Albiol|CB|79
Álvaro Arbeloa|RB/LB|81
Carlos Marchena|CB/CDM|82
Xavi|CM|97
Andrés Iniesta|CM/CAM/LW|97
Sergio Busquets|CDM|91
Xabi Alonso|CM/CDM|92
Cesc Fàbregas|CM/CAM|88
Javi Martínez|CM/CDM|78
David Villa|ST/LW|95
Fernando Torres|ST|85
Pedro|RW/LW|84
Jesús Navas|RW/RM|85
Juan Mata|LW/CAM|80
David Silva|CAM/LW|87
Fernando Llorente|ST|82`],
  ['wc-germany-2014','德国',2014,'🇩🇪',`
Manuel Neuer|GK|97
Roman Weidenfeller|GK|79
Ron-Robert Zieler|GK|74
Philipp Lahm|RB/LB/CDM|95
Mats Hummels|CB|94
Jérôme Boateng|CB/RB|92
Benedikt Höwedes|LB/CB|86
Per Mertesacker|CB|85
Shkodran Mustafi|CB/RB|78
Erik Durm|LB|74
Matthias Ginter|CB|75
Kevin Großkreutz|RB/RM|76
Toni Kroos|CM/CAM|95
Bastian Schweinsteiger|CM/CDM|95
Sami Khedira|CM/CDM|89
Christoph Kramer|CDM/CM|80
Mesut Özil|CAM/LW|91
Mario Götze|CAM/ST|89
Julian Draxler|LW/CAM|78
Thomas Müller|RW/ST/CAM|93
Miroslav Klose|ST|87
Lukas Podolski|LW/ST|81
André Schürrle|LW/ST|87`],
  ['wc-france-2018','法国',2018,'🇫🇷',`
Hugo Lloris|GK|90
Steve Mandanda|GK|78
Alphonse Areola|GK|77
Raphaël Varane|CB|92
Samuel Umtiti|CB|89
Presnel Kimpembe|CB|80
Adil Rami|CB|75
Benjamin Pavard|RB/CB|85
Lucas Hernández|LB/CB|86
Djibril Sidibé|RB|78
Benjamin Mendy|LB|78|modern-wingback
N'Golo Kanté|CDM/CM|94
Paul Pogba|CM|91
Blaise Matuidi|CM/LM|87
Corentin Tolisso|CM|81
Steven Nzonzi|CDM|80
Antoine Griezmann|ST/CAM|94
Kylian Mbappé|RW/ST/LW|95
Olivier Giroud|ST|84
Ousmane Dembélé|RW/LW|83
Nabil Fekir|CAM/ST|82
Thomas Lemar|LM/LW|78
Florian Thauvin|RW|77`],
  ['wc-croatia-2018','克罗地亚',2018,'🇭🇷',`
Danijel Subašić|GK|91
Dominik Livaković|GK|76
Lovre Kalinić|GK|77
Dejan Lovren|CB|89
Domagoj Vida|CB|88
Šime Vrsaljko|RB|87
Ivan Strinić|LB|84
Josip Pivarić|LB|79
Vedran Ćorluka|CB/RB|80
Tin Jedvaj|CB/RB|77
Duje Ćaleta-Car|CB|76
Luka Modrić|CM|97
Ivan Rakitić|CM/CAM|92
Marcelo Brozović|CDM/CM|88
Mateo Kovačić|CM|85
Milan Badelj|CDM|82
Filip Bradarić|CDM|74
Ivan Perišić|LW/LM|91
Mario Mandžukić|ST|90
Ante Rebić|RW/ST|86
Andrej Kramarić|ST/CAM|84
Marko Pjaca|LW|77`],
  ['wc-argentina-2022','阿根廷',2022,'🇦🇷',`
Emiliano Martínez|GK|93
Gerónimo Rulli|GK|77
Franco Armani|GK|75
Cristian Romero|CB|89
Nicolás Otamendi|CB|87
Lisandro Martínez|CB|85
Germán Pezzella|CB|80
Juan Foyth|RB/CB|79
Nahuel Molina|RB|86
Gonzalo Montiel|RB|80
Nicolás Tagliafico|LB|83
Marcos Acuña|LB/LM|84
Rodrigo De Paul|CM/RM|87
Enzo Fernández|CM/CDM|88
Alexis Mac Allister|CM/CAM|88
Leandro Paredes|CDM/CM|82
Guido Rodríguez|CDM|79
Exequiel Palacios|CM|78
Thiago Almada|CAM|76
Alejandro Gómez|CAM/LW|78
Lionel Messi|RW/CAM/ST|99
Julián Álvarez|ST|89
Ángel Di María|RW/LW|92
Lautaro Martínez|ST|85
Paulo Dybala|CAM/ST|85
Ángel Correa|RW/ST|80`],
  ['wc-morocco-2022','摩洛哥',2022,'🇲🇦',`
Yassine Bounou|GK|93
Munir Mohamedi|GK|77
Ahmed Reda Tagnaouti|GK|72
Achraf Hakimi|RB/RM|93
Noussair Mazraoui|LB/RB|88
Romain Saïss|CB|89
Nayef Aguerd|CB|87
Achraf Dari|CB|80
Jawad El Yamiq|CB|84
Badr Benoun|CB|77
Yahya Attiyat Allah|LB|83
Sofyan Amrabat|CDM/CM|92
Azzedine Ounahi|CM|89
Selim Amallah|CM/CAM|85
Abdelhamid Sabiri|CAM/CM|80
Bilal El Khannouss|CAM|76
Yahya Jabrane|CDM|76
Hakim Ziyech|RW/CAM|91
Sofiane Boufal|LW/CAM|87
Youssef En-Nesyri|ST|87
Zakaria Aboukhlal|RW/LW|81
Walid Cheddira|ST|77
Abderrazak Hamdallah|ST|77
Abde Ezzalzouli|LW|79
Anass Zaroury|LW|77
Ilias Chair|CAM|77`]
];

// Explicit aliases keep player uniqueness consistent with club-era catalogs.
const aliases = {
  'Pelé':'pele', 'Ronaldo Nazário':'ronaldo-nazario', 'Gérson':'gerson',
  'Rivelino':'rivelino', 'Júnior':'junior', 'Falcão':'falcao',
  'Nílton Santos':'nilton-santos', 'Carlos Alberto Torres':'carlos-alberto-torres',
  'Rogério Ceni':'rogerio-ceni', 'Edmílson':'edmilson', 'Kaká':'kaka',
  'Johan Cruyff':'johan-cruyff', 'Bobby Charlton':'bobby-charlton',
  'Xavi':'xavi', 'Andrés Iniesta':'andres-iniesta', 'N\'Golo Kanté':'ngolo-kante',
  'Julián Álvarez':'julian-alvarez', 'Lionel Messi':'lionel-messi',
  'Ángel Di María':'angel-di-maria', 'Thomas Müller':'thomas-muller',
  'Abde Ezzalzouli':'abde-ezzalzouli', 'Papa Bouba Diop':'papa-bouba-diop'
};
const slug = name => aliases[name] || name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/ł/g,'l').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const worldCupSquads = rows.map(([id,team,year,flag,roster])=>({
  id,mode:'world_cup',team,year,flag,
  players:roster.trim().split('\n').map(row=>{
    const [name,positionList,rating,profile] = row.split('|');
    const identity = name === 'Júnior' ? (year < 1990 ? 'leovegildo-junior' : 'junior-jenilson') : name === 'Edu' && year === 1970 ? 'edu-jonas' : slug(name);
    return {name,identity,positions:positionList.split('/'),rating:Number(rating),...(profile?{profile}:{})};
  })
}));
