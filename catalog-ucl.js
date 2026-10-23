// Curated season squads, not exhaustive UEFA registration lists. Year is the season's final year.
// Editorial era-specific ratings; at most three S/S+ players in any squad.
// Historical European Cup is included in the modern "ucl" game mode.
const rows = [
['real-madrid', '皇家马德里', 1960, '⚪', `
Alfredo Di Stéfano|ST/CAM|99|alfredo-di-stefano|universal
Ferenc Puskás|ST/LW|96|ferenc-puskas
Francisco Gento|LW/LM|94|francisco-gento
Rogelio Domínguez|GK|86||classic-keeper
Juan Alonso|GK|79||classic-keeper
Marquitos|CB/RB|83||classic-stopper
José Santamaría|CB|89|jose-santamaria|classic-stopper
José María Zárraga|CDM/LB|86|jose-maria-zarraga
Pachín|CB/LB|81|pachin
Juan Santisteban|CM/CDM|84
José María Vidal|CM|82|jose-maria-vidal
Antonio Ruiz|CM|77
Enrique Mateos|ST|81
Pepillo|ST|76
Canário|RW|80|canario
Luis del Sol|CM/CAM|85|luis-del-sol
Chus Herrera|RW|74
Manuel Torres|RB|75
`],
['celtic', '凯尔特人', 1967, '🍀', `
Jimmy Johnstone|RW|94
Bobby Murdoch|CM|91
Bertie Auld|CM/LM|89
Billy McNeill|CB|91||classic-stopper
Ronnie Simpson|GK|86||classic-keeper
John Fallon|GK|76||classic-keeper
Jim Craig|RB|84
Tommy Gemmell|LB/RB|89
John Clark|CB|85
Willie Wallace|ST|87
Stevie Chalmers|ST|86
Bobby Lennox|LW/ST|89
John Hughes|LW/ST|83
Joe McBride|ST|85
Charlie Gallagher|CM|78
Willie O'Neill|LB|76|willie-oneill
Jim Brogan|CB/LB|76
Lou Macari|ST/CAM|74
`],
['feyenoord', '费耶诺德', 1970, '🔴', `
Willem van Hanegem|CM/CAM|94|willem-van-hanegem
Ove Kindvall|ST|91
Rinus Israël|CB|90|rinus-israel|classic-stopper
Wim Jansen|CDM/CM|89|wim-jansen
Franz Hasil|CM/CAM|85
Coen Moulijn|LW|88
Eddy Pieters Graafland|GK|84|eddy-pieters-graafland|classic-keeper
Eddy Treijtel|GK|80||classic-keeper
Theo Laseroms|CB|84||classic-stopper
Piet Romeijn|RB|81
Theo van Duivenbode|LB|82|theo-van-duivenbode
Henk Wery|RW|84
Joop van Daele|CB/ST|77|joop-van-daele
Guus Haak|CB/RB|78
Jan Boskamp|CM|76
Ruud Geels|ST|79
Gé Knol|CB|71|ge-knol
`],
['ajax', '阿贾克斯', 1972, '⚪', `
Johan Cruyff|ST/CAM/LW|99|johan-cruyff|universal
Johan Neeskens|CM/CDM|95|johan-neeskens|universal
Piet Keizer|LW|94
Gerrie Mühren|CM|90|gerrie-muhren
Arie Haan|CDM/CB|88
Ruud Krol|LB/CB|92|ruud-krol|universal
Wim Suurbier|RB|87
Barry Hulshoff|CB|87
Horst Blankenburg|CB/CDM|88
Heinz Stuy|GK|84||classic-keeper
Sies Wever|GK|73||classic-keeper
Sjaak Swart|RW|89
Johnny Rep|RW/ST|83
Dick van Dijk|ST|81|dick-van-dijk
Arnold Mühren|CM/LM|80|arnold-muhren
Heinz Schilcher|CB/CDM|77
`],
['liverpool', '利物浦', 1977, '🔴', `
Kevin Keegan|ST/CAM|95
Ray Clemence|GK|92
Emlyn Hughes|CB/LB|91
Phil Neal|RB|87
Tommy Smith|CB/RB|86||classic-stopper
Joey Jones|LB|81
Ian Callaghan|CM/RW|88
Terry McDermott|CM|88
Ray Kennedy|LM/CM|88
Steve Heighway|LW|87
Jimmy Case|RM/CM|85
David Fairclough|ST|81
David Johnson|ST|81
John Toshack|ST|83
Alec Lindsay|LB|79
Peter McDonnell|GK|69
Brian Kettle|LB|73
Phil Thompson|CB|85
`],
['nottingham-forest', '诺丁汉森林', 1979, '🌳', `
Peter Shilton|GK|94
John Robertson|LW/LM|91
Trevor Francis|ST/RW|89
Viv Anderson|RB|88
Kenny Burns|CB|88||classic-stopper
Larry Lloyd|CB|85||classic-stopper
Frank Clark|LB|83
John McGovern|CM/CDM|86
Ian Bowyer|CM|85
Martin O'Neill|RM/CM|84|martin-oneill
Garry Birtles|ST|85
Tony Woodcock|ST|85
Chris Woods|GK|75
David Needham|CB|78
Colin Barrett|LB/CB|78
Steve Elliott|ST|71
John O'Hare|ST|76|john-ohare
Gary Mills|RM/RB|73
`],
['aston-villa', '阿斯顿维拉', 1982, '🟣', `
Gordon Cowans|CM|90
Peter Withe|ST|89
Tony Morley|LW|89
Dennis Mortimer|CM/CDM|88
Jimmy Rimmer|GK|86
Nigel Spink|GK|81
Kenny Swain|RB|84
Allan Evans|CB|85||classic-stopper
Ken McNaught|CB|85||classic-stopper
Gary Williams|LB|81
Brendan Ormsby|CB|74
Des Bremner|CM/RM|84
Gary Shaw|ST|88
Colin Gibson|LB/LM|79
Pat Heard|CM/LB|74
Eamonn Deacy|LB/RB|74
David Geddis|ST|76
Mark Walters|RW/LW|74
`],
['liverpool', '利物浦', 1984, '🔴', `
Kenny Dalglish|ST/CAM|96|kenny-dalglish|universal
Ian Rush|ST|95
Graeme Souness|CM/CDM|94
Bruce Grobbelaar|GK|87
Phil Neal|RB|86
Alan Hansen|CB|91
Mark Lawrenson|CB/LB|89
Alan Kennedy|LB|85
Ronnie Whelan|LM/CM|86
Sammy Lee|RM/CM|84
Craig Johnston|RM|83
Michael Robinson|ST|79
David Hodgson|ST/LW|77
Steve Nicol|RB/LB|81
Gary Gillespie|CB|77
Bob Bolder|GK|73
Phil Thompson|CB|81
`],
['porto', '波尔图', 1987, '🔵', `
Paulo Futre|LW|94
Rabah Madjer|ST/RW|92
Fernando Gomes|ST|90
Józef Młynarczyk|GK|88|jozef-mlynarczyk
Zé Beto|GK|77|ze-beto
João Pinto|RB|89|joao-pinto-defender
Augusto Inácio|LB|84|augusto-inacio
Celso|CB|84|celso-luis
Lima Pereira|CB|85
Eduardo Luís|CB|80|eduardo-luis
André|CDM/CM|85|andre-jorge-santos
Jaime Pacheco|CM/CDM|84
António Sousa|CM/CAM|87|antonio-sousa
Frasco|CM|85
Jaime Magalhães|RM/CM|84|jaime-magalhaes
Quim|CDM|78|quim-joaquim-carvalho
Juary|ST|80
`],
['milan', 'AC 米兰', 1989, '🔴', `
Marco van Basten|ST|99|marco-van-basten|universal
Ruud Gullit|CAM/ST/CM|97|ruud-gullit|universal
Franco Baresi|CB|96|franco-baresi|universal
Frank Rijkaard|CDM/CB|93|frank-rijkaard|universal
Paolo Maldini|LB/CB|91|paolo-maldini|universal
Alessandro Costacurta|CB|87
Mauro Tassotti|RB|87
Carlo Ancelotti|CM/CDM|88
Roberto Donadoni|RW/RM/LW|90
Angelo Colombo|CM/RM|83
Giovanni Galli|GK|86
Davide Pinato|GK|72
Filippo Galli|CB|81
Alberigo Evani|LM/CM|84
Pietro Paolo Virdis|ST|83
Daniele Massaro|ST/LW|82
Walter Bianchi|RB|73
Graziano Mannari|ST|70
`],
['red-star', '贝尔格莱德红星', 1991, '⭐', `
Dejan Savićević|CAM/RW|94|dejan-savicevic
Robert Prosinečki|CM/CAM|91|robert-prosinecki
Darko Pančev|ST|91|darko-pancev
Vladimir Jugović|CM/RM|88|vladimir-jugovic
Siniša Mihajlović|LB/CM|88|sinisa-mihajlovic
Miodrag Belodedici|CB|90
Stevan Stojanović|GK|85|stevan-stojanovic
Zvonko Milojević|GK|73|zvonko-milojevic
Duško Radinović|RB|80|dusko-radinovic
Ilija Najdoski|CB|85
Slobodan Marović|LB|81|slobodan-marovic
Refik Šabanadžović|CDM/CB|85|refik-sabanadzovic
Vlade Stošić|CM|78|vlade-stosic
Rade Tošić|CB|75|rade-tosic
Goran Vasilijević|LB|74|goran-vasilijevic
Vladan Lukić|ST|79|vladan-lukic
Dragiša Binić|RW/ST|84|dragisa-binic
Ivica Momčilović|CM|73|ivica-momcilovic
`],
['marseille', '马赛', 1993, '🔵', `
Abedi Pelé|CAM/RW|94|abedi-pele
Didier Deschamps|CDM/CM|91
Marcel Desailly|CB/CDM|93|marcel-desailly|universal
Rudi Völler|ST|90|rudi-voller
Alen Bokšić|ST|90|alen-boksic
Fabien Barthez|GK|88
Pascal Olmeta|GK|77
Basile Boli|CB|88
Bernard Casoni|CB/LB|82
Éric Di Meco|LB|84|eric-di-meco
Jocelyn Angloma|RB/RM|86
Franck Sauzée|CM/CB|88|franck-sauzee
Jean-Jacques Eydelie|CM/RB|81
Jean-Philippe Durand|CM|81
Jean-Marc Ferreri|CAM|79
Daniel Dutuel|CM|78
Thomas Prieto|CB|70
Omar Maherzi|ST|69
`],
['ajax', '阿贾克斯', 1995, '⚪', `
Jari Litmanen|CAM/ST|94
Frank Rijkaard|CDM/CB|94|frank-rijkaard|universal
Edwin van der Sar|GK|91|edwin-van-der-sar
Danny Blind|CB|90
Frank de Boer|CB/LB|90|frank-de-boer
Michael Reiziger|RB|85
Clarence Seedorf|CM|87|clarence-seedorf|universal
Edgar Davids|CM/CDM|88
Ronald de Boer|CAM/ST/RM|90|ronald-de-boer
Finidi George|RW/RM|88
Marc Overmars|LW/RW|90
Patrick Kluivert|ST|88
Nwankwo Kanu|ST/CAM|82
Winston Bogarde|LB/CB|81
Sonny Silooy|RB/CB|79
Peter van Vossen|LW/ST|78|peter-van-vossen
Fred Grim|GK|73
Tarik Oulida|CAM|74
`],
['manchester-united', '曼彻斯特联', 1999, '🔴', `
David Beckham|RM/CM|94
Roy Keane|CM/CDM|94|roy-keane|universal
Peter Schmeichel|GK|95
Ryan Giggs|LW/LM|92
Paul Scholes|CM/CAM|91
Andy Cole|ST|90
Dwight Yorke|ST/CAM|92
Ole Gunnar Solskjær|ST/RW|87|ole-gunnar-solskjaer
Teddy Sheringham|ST/CAM|86
Denis Irwin|LB/RB|89
Gary Neville|RB|86
Jaap Stam|CB|93|jaap-stam|universal
Ronny Johnsen|CB/CDM|86
Nicky Butt|CM/CDM|84
Jesper Blomqvist|LW|81
Phil Neville|LB/RB|79
Wes Brown|CB/RB|76
Henning Berg|CB/RB|82
Raimond van der Gouw|GK|77|raimond-van-der-gouw
Jonathan Greening|CM|70
`],
['leverkusen', '勒沃库森', 2002, '🔴', `
Michael Ballack|CM/CAM|93
Lúcio|CB|91|lucio|universal
Zé Roberto|LM/CM|90|ze-roberto
Bernd Schneider|RM/CM|89
Oliver Neuville|ST|88
Dimitar Berbatov|ST|82
Hans-Jörg Butt|GK|86|hans-jorg-butt
Frank Juric|GK|73
Jens Nowotny|CB|88
Carsten Ramelow|CDM/CB|86
Diego Placente|LB|83
Boris Živković|RB/CB|82|boris-zivkovic
Zoltán Sebescen|RB/RM|80|zoltan-sebescen
Thomas Brdarić|ST|79|thomas-brdaric
Ulf Kirsten|ST|85
Yıldıray Baştürk|CAM|87|yildiray-basturk
Jurica Vranješ|CM|75|jurica-vranjes
Pascal Ojigwe|CDM|73
`],
['porto', '波尔图', 2004, '🔵', `
Deco|CAM/CM|94
Ricardo Carvalho|CB|92
Vítor Baía|GK|89|vitor-baia
Paulo Ferreira|RB|88
Nuno Valente|LB|85
Jorge Costa|CB|88||classic-stopper
Costinha|CDM|87
Maniche|CM|90
Pedro Mendes|CM/CDM|85
Carlos Alberto|CAM/RW|85|carlos-alberto-gomes
Derlei|ST/LW|86
Benni McCarthy|ST|87
Dmitri Alenichev|CM/CAM|85
Ricardo Costa|CB|78
Pedro Emanuel|CB|81
José Bosingwa|RB/RM|78|jose-bosingwa
Marco Ferreira|RW|75
Edgaras Jankauskas|ST|78
Nuno Espírito Santo|GK|74|nuno-espirito-santo
Sérgio Conceição|RW/RM|79|sergio-conceicao
`],
['milan', 'AC 米兰', 2007, '🔴', `
Kaká|CAM/ST|99|kaka|universal
Andrea Pirlo|CM/CDM|94|andrea-pirlo
Alessandro Nesta|CB|94|alessandro-nesta|universal
Paolo Maldini|CB/LB|92|paolo-maldini|universal
Clarence Seedorf|CM/CAM|92|clarence-seedorf|universal
Gennaro Gattuso|CDM/CM|90
Massimo Ambrosini|CDM/CM|86
Filippo Inzaghi|ST|92
Alberto Gilardino|ST|83
Dida|GK|89
Željko Kalac|GK|74|zeljko-kalac
Cafu|RB|86|cafu
Massimo Oddo|RB|85
Marek Jankulovski|LB/LM|86
Serginho|LB/LM|81
Kakha Kaladze|CB/LB|83
Daniele Bonera|CB/RB|77
Cristian Brocchi|CM|77
Yoann Gourcuff|CAM|76
Giuseppe Favalli|LB/CB|78
`],
['barcelona', '巴塞罗那', 2009, '🔵', `
Lionel Messi|RW/ST/CAM|99|lionel-messi|universal
Xavi|CM|96|xavi
Andrés Iniesta|CM/CAM/LW|94|andres-iniesta|universal
Samuel Eto'o|ST|93|samuel-etoo
Thierry Henry|LW/ST|92|thierry-henry|universal
Sergio Busquets|CDM|86|sergio-busquets
Yaya Touré|CDM/CM/CB|89|yaya-toure
Seydou Keita|CM|83
Carles Puyol|CB/RB|92|carles-puyol|universal
Gerard Piqué|CB|87|gerard-pique
Dani Alves|RB/RM|92|dani-alves|modern-wingback
Éric Abidal|LB/CB|87|eric-abidal
Rafael Márquez|CB/CDM|87|rafael-marquez
Víctor Valdés|GK|87|victor-valdes
José Manuel Pinto|GK|74|jose-manuel-pinto
Bojan Krkić|ST/RW|77|bojan-krkic
Pedro|RW/LW|77|pedro-rodriguez
Alexander Hleb|CAM/RM|77
Sylvinho|LB|79
Martín Cáceres|CB/RB|74|martin-caceres
`],
['schalke', '沙尔克 04', 2011, '🔵', `
Raúl|ST/CAM|91|raul
Manuel Neuer|GK|93|manuel-neuer|universal
Klaas-Jan Huntelaar|ST|87
Jefferson Farfán|RW/ST|87|jefferson-farfan
José Manuel Jurado|CAM/LM|84|jose-manuel-jurado
Benedikt Höwedes|CB/RB|84|benedikt-howedes
Christoph Metzelder|CB|81
Atsuto Uchida|RB|82
Hans Sarpei|LB/RB|77
Joel Matip|CB/CDM|79
Kyriakos Papadopoulos|CB/CDM|79
Anthony Annan|CDM|77
Peer Kluge|CM/CDM|81
Alexander Baumjohann|CAM|78
Lukas Schmitz|LB/LM|77
Edu|ST|78|edu-schalke
Mario Gavranović|ST|75|mario-gavranovic
Sergio Escudero|LB|74
Mathias Schober|GK|70
`],
['chelsea', '切尔西', 2012, '🔵', `
Didier Drogba|ST|95|didier-drogba|universal
Petr Čech|GK|94|petr-cech
Ashley Cole|LB|94|ashley-cole|universal
Frank Lampard|CM/CAM|91
Juan Mata|CAM/LW|90
John Terry|CB|90||classic-stopper
Branislav Ivanović|RB/CB|88|branislav-ivanovic
Gary Cahill|CB|85
David Luiz|CB/CDM|85
José Bosingwa|RB|82|jose-bosingwa
John Obi Mikel|CDM|86
Ramires|CM/RM|88
Raul Meireles|CM|84
Florent Malouda|LM/LW|82
Salomon Kalou|LW/ST|82
Fernando Torres|ST|84
Daniel Sturridge|ST/RW|81
Ryan Bertrand|LB/LM|77
Michael Essien|CM/CDM|81
Ross Turnbull|GK|70
Oriol Romeu|CDM|75
Paulo Ferreira|RB/LB|74
`],
['real-madrid', '皇家马德里', 2017, '⚪', `
Cristiano Ronaldo|LW/ST|99|cristiano-ronaldo|universal
Luka Modrić|CM/CAM|95|luka-modric|universal
Sergio Ramos|CB|94|sergio-ramos|universal
Toni Kroos|CM/CDM|93|toni-kroos
Marcelo|LB/LM|92|marcelo|modern-wingback
Casemiro|CDM|92|casemiro
Karim Benzema|ST|91|karim-benzema
Gareth Bale|RW/LW|90|gareth-bale
Isco|CAM/CM|91|isco
Dani Carvajal|RB|91|dani-carvajal
Raphaël Varane|CB|89|raphael-varane
Keylor Navas|GK|90|keylor-navas
Pepe|CB|86|pepe
Nacho|CB/LB/RB|82|nacho-fernandez
Mateo Kovačić|CM|82|mateo-kovacic
James Rodríguez|CAM/RW|85|james-rodriguez
Marco Asensio|RW/LW/CAM|82|marco-asensio
Lucas Vázquez|RW/RM|80|lucas-vazquez
Álvaro Morata|ST|83|alvaro-morata
Danilo|RB/LB|76|danilo
Fábio Coentrão|LB|71|fabio-coentrao
Kiko Casilla|GK|73
`],
['liverpool', '利物浦', 2019, '🔴', `
Virgil van Dijk|CB|96|virgil-van-dijk|universal
Mohamed Salah|RW/ST|95|mohamed-salah|universal
Sadio Mané|LW/LM/ST|94|sadio-mane|universal
Alisson|GK|93|alisson
Roberto Firmino|ST/CAM|91|roberto-firmino|modern-press
Trent Alexander-Arnold|RB|91|trent-alexander-arnold|modern-wingback
Andrew Robertson|LB|90|andrew-robertson|modern-wingback
Fabinho|CDM/CB|89|fabinho
Jordan Henderson|CM/CDM|87
Georginio Wijnaldum|CM|88|georginio-wijnaldum
James Milner|CM/RM/LB|85
Joël Matip|CB|87|joel-matip
Joe Gomez|CB/RB|83
Dejan Lovren|CB|80
Xherdan Shaqiri|RW/CAM|81
Divock Origi|ST/LW|83
Daniel Sturridge|ST|77
Adam Lallana|CAM/CM|77
Alberto Moreno|LB|73
Simon Mignolet|GK|77
Alex Oxlade-Chamberlain|CM/RW|74
`],
['manchester-city', '曼彻斯特城', 2023, '🩵', `
Erling Haaland|ST|96|erling-haaland|universal
Kevin De Bruyne|CM/CAM|96|kevin-de-bruyne|universal
Rodri|CDM|95|rodri|universal
Bernardo Silva|CM/RW/CAM|92|bernardo-silva|modern-press
İlkay Gündoğan|CM/CDM|92|ilkay-gundogan
Rúben Dias|CB|92|ruben-dias
John Stones|CB/CDM|91
Kyle Walker|RB/CB|89|kyle-walker|universal
Nathan Aké|CB/LB|88|nathan-ake
Manuel Akanji|CB/RB|87
Ederson|GK|89|ederson
Jack Grealish|LW/CAM|89
Phil Foden|LW/RW/CAM|88
Riyad Mahrez|RW|88
Julián Álvarez|ST/RW|84|julian-alvarez|modern-press
Aymeric Laporte|CB|83
Rico Lewis|RB/CM|77
Sergio Gómez|LB/LM|73|sergio-gomez
Kalvin Phillips|CDM|74
Cole Palmer|RW/CAM|76
Stefan Ortega|GK|80
Scott Carson|GK|65
Máximo Perrone|CDM|67|maximo-perrone
`],
['dortmund', '多特蒙德', 2024, '🟡', `
Mats Hummels|CB|91|mats-hummels
Gregor Kobel|GK|91
Marcel Sabitzer|CM/CAM|88
Julian Brandt|CAM/CM|88
Nico Schlotterbeck|CB|87
Julian Ryerson|RB/LB|84
Ian Maatsen|LB|85
Emre Can|CDM/CB|84
Niclas Füllkrug|ST|86|niclas-fullkrug
Karim Adeyemi|LW/ST|84
Jadon Sancho|RW/LW|85
Donyell Malen|RW/ST|85
Marco Reus|CAM/LW|84
Salih Özcan|CDM|78|salih-ozcan
Felix Nmecha|CM|77
Sébastien Haller|ST|77|sebastien-haller
Youssoufa Moukoko|ST|75
Marius Wolf|RB/RM|76
Niklas Süle|CB/RB|81|niklas-sule
Ramy Bensebaini|LB/CB|78
Alexander Meyer|GK|75
Jamie Bynoe-Gittens|LW|76
`]
];
const slug = name => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ł/g,'l').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const uclSquads = rows.map(([club, team, year, flag, list]) => ({
  id: `ucl-${club}-${year}`, mode: 'ucl', team, year, flag,
  players: list.trim().split('\n').map(row => {
    const [name, positionList, rating, identity, profile] = row.split('|');
    return {name, identity: identity || slug(name), positions: positionList.split('/'), rating: Number(rating), ...(profile ? {profile} : {})};
  })
}));
