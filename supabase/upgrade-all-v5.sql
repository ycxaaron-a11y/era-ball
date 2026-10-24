-- ERA FC draft protocol 3. Execute the GENERATED upgrade-spin-locks.sql, not this template.
-- Requires the original multiplayer.sql tables. Atomic migration; safe to run again.
begin;
alter table public.fc_rooms add column if not exists rules_version integer not null default 2;
alter table public.fc_members add column if not exists revision integer not null default 0;
alter table public.fc_members add column if not exists last_request_id uuid;
create table if not exists public.fc_player_catalog (
 player_key text primary key, identity text not null, mode text not null,
 pool_id text not null, era_id text not null, year integer not null,
 name text not null, base_rating integer not null check(base_rating between 1 and 100),
 positions text[] not null, profile text not null
);
create table if not exists public.fc_era_catalog (id text primary key, from_year integer not null, to_year integer not null);
create table if not exists public.fc_chemistry_pairs (id text primary key, left_identity text not null, right_identity text not null, bonus integer not null check(bonus between 1 and 3));
create table if not exists public.fc_player_locks (
 room_code text not null references public.fc_rooms(code) on delete cascade,
 player_key text not null references public.fc_player_catalog(player_key),
 user_id uuid not null references auth.users(id), created_at timestamptz not null default now(),
 primary key(room_code,player_key)
);
alter table public.fc_player_catalog enable row level security;
alter table public.fc_era_catalog enable row level security;
alter table public.fc_chemistry_pairs enable row level security;
alter table public.fc_player_locks enable row level security;
revoke all on public.fc_player_catalog,public.fc_era_catalog,public.fc_chemistry_pairs,public.fc_player_locks from anon,authenticated;
insert into public.fc_player_catalog(player_key,identity,mode,pool_id,era_id,year,name,base_rating,positions,profile) values
('wc-brazil-1962:gilmar','gilmar','world_cup','wc-brazil-1962','1960s',1962,'吉尔马',88,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1962:castilho','castilho','world_cup','wc-brazil-1962','1960s',1962,'卡斯蒂略',78,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1962:djalma-santos','djalma-santos','world_cup','wc-brazil-1962','1960s',1962,'贾尔马·桑托斯',91,ARRAY['RB'],'universal'),
('wc-brazil-1962:nilton-santos','nilton-santos','world_cup','wc-brazil-1962','1960s',1962,'尼尔顿·桑托斯',92,ARRAY['LB'],'universal'),
('wc-brazil-1962:mauro-ramos','mauro-ramos','world_cup','wc-brazil-1962','1960s',1962,'毛罗·拉莫斯',87,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1962:zozimo','zozimo','world_cup','wc-brazil-1962','1960s',1962,'佐济莫',85,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1962:bellini','bellini','world_cup','wc-brazil-1962','1960s',1962,'贝利尼',80,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1962:altair','altair','world_cup','wc-brazil-1962','1960s',1962,'阿尔泰尔',77,ARRAY['LB','CB'],'universal'),
('wc-brazil-1962:jair-marinho','jair-marinho','world_cup','wc-brazil-1962','1960s',1962,'雅伊尔·马里尼奥',75,ARRAY['RB'],'universal'),
('wc-brazil-1962:jurandir','jurandir','world_cup','wc-brazil-1962','1960s',1962,'茹兰迪尔',73,ARRAY['CB'],'universal'),
('wc-brazil-1962:zito','zito','world_cup','wc-brazil-1962','1960s',1962,'济托',89,ARRAY['CDM','CM'],'universal'),
('wc-brazil-1962:didi','didi','world_cup','wc-brazil-1962','1960s',1962,'迪迪',94,ARRAY['CM','CAM'],'classic-maker'),
('wc-brazil-1962:zequinha','zequinha','world_cup','wc-brazil-1962','1960s',1962,'泽金哈',77,ARRAY['CDM','CM'],'universal'),
('wc-brazil-1962:mengalvio','mengalvio','world_cup','wc-brazil-1962','1960s',1962,'门加尔维奥',78,ARRAY['CM'],'universal'),
('wc-brazil-1962:garrincha','garrincha','world_cup','wc-brazil-1962','1960s',1962,'加林查',99,ARRAY['RW'],'universal'),
('wc-brazil-1962:pele','pele','world_cup','wc-brazil-1962','1960s',1962,'贝利',93,ARRAY['ST','CAM'],'universal'),
('wc-brazil-1962:vava','vava','world_cup','wc-brazil-1962','1960s',1962,'瓦瓦',91,ARRAY['ST'],'universal'),
('wc-brazil-1962:amarildo','amarildo','world_cup','wc-brazil-1962','1960s',1962,'阿马里尔多',89,ARRAY['ST'],'universal'),
('wc-brazil-1962:zagallo','zagallo','world_cup','wc-brazil-1962','1960s',1962,'扎加洛',88,ARRAY['LW','LM'],'universal'),
('wc-brazil-1962:coutinho','coutinho','world_cup','wc-brazil-1962','1960s',1962,'库蒂尼奥',81,ARRAY['ST'],'universal'),
('wc-brazil-1962:pepe','pepe','world_cup','wc-brazil-1962','1960s',1962,'佩佩',80,ARRAY['LW'],'universal'),
('wc-brazil-1962:jair-da-costa','jair-da-costa','world_cup','wc-brazil-1962','1960s',1962,'雅伊尔·达科斯塔',76,ARRAY['RW'],'universal'),
('wc-england-1966:gordon-banks','gordon-banks','world_cup','wc-england-1966','1960s',1966,'戈登·班克斯',93,ARRAY['GK'],'classic-keeper'),
('wc-england-1966:peter-bonetti','peter-bonetti','world_cup','wc-england-1966','1960s',1966,'彼得·博内蒂',79,ARRAY['GK'],'classic-keeper'),
('wc-england-1966:ron-springett','ron-springett','world_cup','wc-england-1966','1960s',1966,'罗恩·斯普林格特',76,ARRAY['GK'],'classic-keeper'),
('wc-england-1966:george-cohen','george-cohen','world_cup','wc-england-1966','1960s',1966,'乔治·科恩',86,ARRAY['RB'],'universal'),
('wc-england-1966:ray-wilson','ray-wilson','world_cup','wc-england-1966','1960s',1966,'雷·威尔逊',87,ARRAY['LB'],'universal'),
('wc-england-1966:jack-charlton','jack-charlton','world_cup','wc-england-1966','1960s',1966,'杰克·查尔顿',88,ARRAY['CB'],'classic-stopper'),
('wc-england-1966:bobby-moore','bobby-moore','world_cup','wc-england-1966','1960s',1966,'博比·摩尔',95,ARRAY['CB'],'universal'),
('wc-england-1966:jimmy-armfield','jimmy-armfield','world_cup','wc-england-1966','1960s',1966,'吉米·阿姆菲尔德',82,ARRAY['RB'],'universal'),
('wc-england-1966:gerry-byrne','gerry-byrne','world_cup','wc-england-1966','1960s',1966,'格里·伯恩',76,ARRAY['LB'],'universal'),
('wc-england-1966:norman-hunter','norman-hunter','world_cup','wc-england-1966','1960s',1966,'诺曼·亨特',79,ARRAY['CB','CDM'],'classic-stopper'),
('wc-england-1966:bobby-charlton','bobby-charlton','world_cup','wc-england-1966','1960s',1966,'博比·查尔顿',96,ARRAY['CAM','CM'],'universal'),
('wc-england-1966:alan-ball','alan-ball','world_cup','wc-england-1966','1960s',1966,'阿兰·鲍尔',88,ARRAY['CM','RM'],'universal'),
('wc-england-1966:nobby-stiles','nobby-stiles','world_cup','wc-england-1966','1960s',1966,'诺比·斯泰尔斯',86,ARRAY['CDM','CB'],'classic-stopper'),
('wc-england-1966:martin-peters','martin-peters','world_cup','wc-england-1966','1960s',1966,'马丁·彼得斯',87,ARRAY['LM','CM'],'universal'),
('wc-england-1966:ron-flowers','ron-flowers','world_cup','wc-england-1966','1960s',1966,'罗恩·弗劳尔斯',75,ARRAY['CM','CDM'],'universal'),
('wc-england-1966:george-eastham','george-eastham','world_cup','wc-england-1966','1960s',1966,'乔治·伊斯特姆',76,ARRAY['CAM'],'classic-maker'),
('wc-england-1966:geoff-hurst','geoff-hurst','world_cup','wc-england-1966','1960s',1966,'杰夫·赫斯特',93,ARRAY['ST'],'universal'),
('wc-england-1966:roger-hunt','roger-hunt','world_cup','wc-england-1966','1960s',1966,'罗杰·亨特',87,ARRAY['ST'],'universal'),
('wc-england-1966:jimmy-greaves','jimmy-greaves','world_cup','wc-england-1966','1960s',1966,'吉米·格里夫斯',89,ARRAY['ST'],'universal'),
('wc-england-1966:john-connelly','john-connelly','world_cup','wc-england-1966','1960s',1966,'约翰·康纳利',80,ARRAY['RW'],'universal'),
('wc-england-1966:terry-paine','terry-paine','world_cup','wc-england-1966','1960s',1966,'特里·佩恩',78,ARRAY['RW','RM'],'universal'),
('wc-england-1966:ian-callaghan','ian-callaghan','world_cup','wc-england-1966','1960s',1966,'伊恩·卡拉汉',77,ARRAY['RM','RW'],'universal'),
('wc-brazil-1970:felix','felix','world_cup','wc-brazil-1970','1970s-a',1970,'费利克斯',83,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1970:ado','ado','world_cup','wc-brazil-1970','1970s-a',1970,'阿多',73,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1970:emerson-leao','emerson-leao','world_cup','wc-brazil-1970','1970s-a',1970,'埃默松·莱昂',75,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1970:carlos-alberto-torres','carlos-alberto-torres','world_cup','wc-brazil-1970','1970s-a',1970,'卡洛斯·阿尔贝托',93,ARRAY['RB','CB'],'universal'),
('wc-brazil-1970:brito','brito','world_cup','wc-brazil-1970','1970s-a',1970,'布里托',87,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1970:wilson-piazza','wilson-piazza','world_cup','wc-brazil-1970','1970s-a',1970,'威尔逊·皮亚扎',87,ARRAY['CB','CDM'],'universal'),
('wc-brazil-1970:everaldo','everaldo','world_cup','wc-brazil-1970','1970s-a',1970,'埃韦拉尔多',83,ARRAY['LB'],'universal'),
('wc-brazil-1970:marco-antonio','marco-antonio','world_cup','wc-brazil-1970','1970s-a',1970,'马尔科·安东尼奥',78,ARRAY['LB'],'universal'),
('wc-brazil-1970:baldocchi','baldocchi','world_cup','wc-brazil-1970','1970s-a',1970,'巴尔多基',75,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1970:joel-camargo','joel-camargo','world_cup','wc-brazil-1970','1970s-a',1970,'若埃尔·卡马戈',76,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1970:fontana','fontana','world_cup','wc-brazil-1970','1970s-a',1970,'丰塔纳',78,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1970:ze-maria','ze-maria','world_cup','wc-brazil-1970','1970s-a',1970,'泽·马里亚',77,ARRAY['RB'],'universal'),
('wc-brazil-1970:clodoaldo','clodoaldo','world_cup','wc-brazil-1970','1970s-a',1970,'克洛多阿尔多',88,ARRAY['CDM','CM'],'universal'),
('wc-brazil-1970:gerson','gerson','world_cup','wc-brazil-1970','1970s-a',1970,'热尔松',93,ARRAY['CM'],'classic-maker'),
('wc-brazil-1970:rivelino','rivelino','world_cup','wc-brazil-1970','1970s-a',1970,'里维利诺',94,ARRAY['LW','CAM'],'universal'),
('wc-brazil-1970:jairzinho','jairzinho','world_cup','wc-brazil-1970','1970s-a',1970,'雅伊尔津霍',96,ARRAY['RW','ST'],'universal'),
('wc-brazil-1970:pele','pele','world_cup','wc-brazil-1970','1970s-a',1970,'贝利',99,ARRAY['ST','CAM'],'universal'),
('wc-brazil-1970:tostao','tostao','world_cup','wc-brazil-1970','1970s-a',1970,'托斯唐',92,ARRAY['ST','CAM'],'universal'),
('wc-brazil-1970:paulo-cezar-caju','paulo-cezar-caju','world_cup','wc-brazil-1970','1970s-a',1970,'保罗·塞萨尔',84,ARRAY['LW','CAM'],'universal'),
('wc-brazil-1970:edu-jonas','edu-jonas','world_cup','wc-brazil-1970','1970s-a',1970,'埃杜',79,ARRAY['LW'],'universal'),
('wc-brazil-1970:roberto-miranda','roberto-miranda','world_cup','wc-brazil-1970','1970s-a',1970,'罗伯托·米兰达',75,ARRAY['ST'],'universal'),
('wc-brazil-1970:dario','dario','world_cup','wc-brazil-1970','1970s-a',1970,'达里奥',74,ARRAY['ST'],'universal'),
('wc-netherlands-1974:jan-jongbloed','jan-jongbloed','world_cup','wc-netherlands-1974','1970s-a',1974,'扬·容布卢德',85,ARRAY['GK'],'universal'),
('wc-netherlands-1974:piet-schrijvers','piet-schrijvers','world_cup','wc-netherlands-1974','1970s-a',1974,'皮特·施赖弗斯',82,ARRAY['GK'],'classic-keeper'),
('wc-netherlands-1974:eddy-treijtel','eddy-treijtel','world_cup','wc-netherlands-1974','1970s-a',1974,'埃迪·特雷特尔',74,ARRAY['GK'],'classic-keeper'),
('wc-netherlands-1974:wim-suurbier','wim-suurbier','world_cup','wc-netherlands-1974','1970s-a',1974,'维姆·苏尔比尔',88,ARRAY['RB'],'universal'),
('wc-netherlands-1974:ruud-krol','ruud-krol','world_cup','wc-netherlands-1974','1970s-a',1974,'鲁德·克罗尔',93,ARRAY['LB','CB'],'universal'),
('wc-netherlands-1974:wim-rijsbergen','wim-rijsbergen','world_cup','wc-netherlands-1974','1970s-a',1974,'维姆·赖斯贝亨',86,ARRAY['CB'],'classic-stopper'),
('wc-netherlands-1974:arie-haan','arie-haan','world_cup','wc-netherlands-1974','1970s-a',1974,'阿里·汉',89,ARRAY['CB','CDM','CM'],'universal'),
('wc-netherlands-1974:rinus-israel','rinus-israel','world_cup','wc-netherlands-1974','1970s-a',1974,'里努斯·伊斯拉埃尔',82,ARRAY['CB'],'classic-stopper'),
('wc-netherlands-1974:pleun-strik','pleun-strik','world_cup','wc-netherlands-1974','1970s-a',1974,'普伦·斯特里克',77,ARRAY['CB'],'classic-stopper'),
('wc-netherlands-1974:cees-van-ierssel','cees-van-ierssel','world_cup','wc-netherlands-1974','1970s-a',1974,'凯斯·范伊尔塞尔',75,ARRAY['RB','CB'],'universal'),
('wc-netherlands-1974:wim-van-hanegem','wim-van-hanegem','world_cup','wc-netherlands-1974','1970s-a',1974,'范哈内亨',94,ARRAY['CM'],'universal'),
('wc-netherlands-1974:wim-jansen','wim-jansen','world_cup','wc-netherlands-1974','1970s-a',1974,'维姆·扬森',89,ARRAY['CDM','CM'],'universal'),
('wc-netherlands-1974:johan-neeskens','johan-neeskens','world_cup','wc-netherlands-1974','1970s-a',1974,'约翰·内斯肯斯',95,ARRAY['CM','CAM'],'universal'),
('wc-netherlands-1974:theo-de-jong','theo-de-jong','world_cup','wc-netherlands-1974','1970s-a',1974,'特奥·德容',81,ARRAY['CM'],'universal'),
('wc-netherlands-1974:harry-vos','harry-vos','world_cup','wc-netherlands-1974','1970s-a',1974,'哈里·沃斯',75,ARRAY['LB'],'universal'),
('wc-netherlands-1974:willy-van-de-kerkhof','willy-van-de-kerkhof','world_cup','wc-netherlands-1974','1970s-a',1974,'威利·范德克尔科夫',81,ARRAY['RM','CM'],'universal'),
('wc-netherlands-1974:rene-van-de-kerkhof','rene-van-de-kerkhof','world_cup','wc-netherlands-1974','1970s-a',1974,'勒内·范德克尔科夫',82,ARRAY['RW'],'universal'),
('wc-netherlands-1974:rob-rensenbrink','rob-rensenbrink','world_cup','wc-netherlands-1974','1970s-a',1974,'罗布·伦森布林克',92,ARRAY['LW'],'universal'),
('wc-netherlands-1974:johnny-rep','johnny-rep','world_cup','wc-netherlands-1974','1970s-a',1974,'约翰尼·雷普',90,ARRAY['RW','ST'],'universal'),
('wc-netherlands-1974:johan-cruyff','johan-cruyff','world_cup','wc-netherlands-1974','1970s-a',1974,'约翰·克鲁伊夫',99,ARRAY['ST','CAM','LW'],'universal'),
('wc-netherlands-1974:piet-keizer','piet-keizer','world_cup','wc-netherlands-1974','1970s-a',1974,'皮特·凯泽',86,ARRAY['LW'],'universal'),
('wc-netherlands-1974:ruud-geels','ruud-geels','world_cup','wc-netherlands-1974','1970s-a',1974,'鲁德·海尔斯',79,ARRAY['ST'],'universal'),
('wc-argentina-1978:ubaldo-fillol','ubaldo-fillol','world_cup','wc-argentina-1978','1970s-b',1978,'乌巴尔多·菲洛尔',93,ARRAY['GK'],'classic-keeper'),
('wc-argentina-1978:hector-baley','hector-baley','world_cup','wc-argentina-1978','1970s-b',1978,'埃克托尔·巴莱',77,ARRAY['GK'],'classic-keeper'),
('wc-argentina-1978:ricardo-la-volpe','ricardo-la-volpe','world_cup','wc-argentina-1978','1970s-b',1978,'里卡多·拉沃尔佩',74,ARRAY['GK'],'classic-keeper'),
('wc-argentina-1978:daniel-passarella','daniel-passarella','world_cup','wc-argentina-1978','1970s-b',1978,'丹尼尔·帕萨雷拉',94,ARRAY['CB'],'universal'),
('wc-argentina-1978:luis-galvan','luis-galvan','world_cup','wc-argentina-1978','1970s-b',1978,'路易斯·加尔万',87,ARRAY['CB'],'classic-stopper'),
('wc-argentina-1978:alberto-tarantini','alberto-tarantini','world_cup','wc-argentina-1978','1970s-b',1978,'阿尔贝托·塔兰蒂尼',87,ARRAY['LB'],'universal'),
('wc-argentina-1978:jorge-olguin','jorge-olguin','world_cup','wc-argentina-1978','1970s-b',1978,'豪尔赫·奥尔金',85,ARRAY['RB','CB'],'universal'),
('wc-argentina-1978:ruben-pagnanini','ruben-pagnanini','world_cup','wc-argentina-1978','1970s-b',1978,'鲁本·帕尼亚尼尼',76,ARRAY['RB'],'universal'),
('wc-argentina-1978:daniel-killer','daniel-killer','world_cup','wc-argentina-1978','1970s-b',1978,'丹尼尔·基列尔',74,ARRAY['CB'],'classic-stopper'),
('wc-argentina-1978:americo-gallego','americo-gallego','world_cup','wc-argentina-1978','1970s-b',1978,'阿梅里科·加列戈',87,ARRAY['CDM'],'universal'),
('wc-argentina-1978:osvaldo-ardiles','osvaldo-ardiles','world_cup','wc-argentina-1978','1970s-b',1978,'奥斯瓦尔多·阿迪莱斯',92,ARRAY['CM'],'universal'),
('wc-argentina-1978:omar-larrosa','omar-larrosa','world_cup','wc-argentina-1978','1970s-b',1978,'奥马尔·拉罗萨',80,ARRAY['CM'],'universal'),
('wc-argentina-1978:ricardo-villa','ricardo-villa','world_cup','wc-argentina-1978','1970s-b',1978,'里卡多·比利亚',81,ARRAY['CM','CAM'],'universal'),
('wc-argentina-1978:miguel-oviedo','miguel-oviedo','world_cup','wc-argentina-1978','1970s-b',1978,'米格尔·奥维耶多',76,ARRAY['CDM','CM'],'universal'),
('wc-argentina-1978:jose-daniel-valencia','jose-daniel-valencia','world_cup','wc-argentina-1978','1970s-b',1978,'何塞·瓦伦西亚',82,ARRAY['CAM'],'classic-maker'),
('wc-argentina-1978:norberto-alonso','norberto-alonso','world_cup','wc-argentina-1978','1970s-b',1978,'诺尔韦托·阿隆索',81,ARRAY['CAM'],'classic-maker'),
('wc-argentina-1978:mario-kempes','mario-kempes','world_cup','wc-argentina-1978','1970s-b',1978,'马里奥·肯佩斯',97,ARRAY['ST','CAM'],'universal'),
('wc-argentina-1978:leopoldo-luque','leopoldo-luque','world_cup','wc-argentina-1978','1970s-b',1978,'莱奥波尔多·卢克',90,ARRAY['ST'],'universal'),
('wc-argentina-1978:daniel-bertoni','daniel-bertoni','world_cup','wc-argentina-1978','1970s-b',1978,'丹尼尔·贝尔托尼',88,ARRAY['RW','ST'],'universal'),
('wc-argentina-1978:oscar-ortiz','oscar-ortiz','world_cup','wc-argentina-1978','1970s-b',1978,'奥斯卡·奥尔蒂斯',86,ARRAY['LW'],'universal'),
('wc-argentina-1978:rene-houseman','rene-houseman','world_cup','wc-argentina-1978','1970s-b',1978,'勒内·豪斯曼',84,ARRAY['RW'],'universal'),
('wc-argentina-1978:ruben-galvan','ruben-galvan','world_cup','wc-argentina-1978','1970s-b',1978,'鲁本·加尔万',77,ARRAY['CDM','CM'],'universal'),
('wc-netherlands-1978:jan-jongbloed','jan-jongbloed','world_cup','wc-netherlands-1978','1970s-b',1978,'扬·容布卢德',84,ARRAY['GK'],'universal'),
('wc-netherlands-1978:piet-schrijvers','piet-schrijvers','world_cup','wc-netherlands-1978','1970s-b',1978,'皮特·施赖弗斯',84,ARRAY['GK'],'classic-keeper'),
('wc-netherlands-1978:pim-doesburg','pim-doesburg','world_cup','wc-netherlands-1978','1970s-b',1978,'皮姆·杜斯堡',76,ARRAY['GK'],'classic-keeper'),
('wc-netherlands-1978:ruud-krol','ruud-krol','world_cup','wc-netherlands-1978','1970s-b',1978,'鲁德·克罗尔',94,ARRAY['CB','LB'],'universal'),
('wc-netherlands-1978:wim-rijsbergen','wim-rijsbergen','world_cup','wc-netherlands-1978','1970s-b',1978,'维姆·赖斯贝亨',83,ARRAY['CB'],'classic-stopper'),
('wc-netherlands-1978:wim-suurbier','wim-suurbier','world_cup','wc-netherlands-1978','1970s-b',1978,'维姆·苏尔比尔',82,ARRAY['RB'],'universal'),
('wc-netherlands-1978:ernie-brandts','ernie-brandts','world_cup','wc-netherlands-1978','1970s-b',1978,'埃尔尼·布兰茨',85,ARRAY['CB'],'classic-stopper'),
('wc-netherlands-1978:jan-poortvliet','jan-poortvliet','world_cup','wc-netherlands-1978','1970s-b',1978,'扬·波尔特弗利特',83,ARRAY['LB','CB'],'universal'),
('wc-netherlands-1978:piet-wildschut','piet-wildschut','world_cup','wc-netherlands-1978','1970s-b',1978,'皮特·维尔德舒特',77,ARRAY['LB','LM'],'universal'),
('wc-netherlands-1978:arie-haan','arie-haan','world_cup','wc-netherlands-1978','1970s-b',1978,'阿里·汉',90,ARRAY['CM','CDM'],'universal'),
('wc-netherlands-1978:wim-jansen','wim-jansen','world_cup','wc-netherlands-1978','1970s-b',1978,'维姆·扬森',86,ARRAY['CDM','CM'],'universal'),
('wc-netherlands-1978:johan-neeskens','johan-neeskens','world_cup','wc-netherlands-1978','1970s-b',1978,'约翰·内斯肯斯',92,ARRAY['CM','CAM'],'universal'),
('wc-netherlands-1978:willy-van-de-kerkhof','willy-van-de-kerkhof','world_cup','wc-netherlands-1978','1970s-b',1978,'威利·范德克尔科夫',89,ARRAY['CM','RM'],'universal'),
('wc-netherlands-1978:rene-van-de-kerkhof','rene-van-de-kerkhof','world_cup','wc-netherlands-1978','1970s-b',1978,'勒内·范德克尔科夫',89,ARRAY['RW','RM'],'universal'),
('wc-netherlands-1978:dick-schoenaker','dick-schoenaker','world_cup','wc-netherlands-1978','1970s-b',1978,'迪克·斯胡纳克',78,ARRAY['CM'],'universal'),
('wc-netherlands-1978:jan-peters','jan-peters','world_cup','wc-netherlands-1978','1970s-b',1978,'扬·彼得斯',79,ARRAY['CM'],'universal'),
('wc-netherlands-1978:rob-rensenbrink','rob-rensenbrink','world_cup','wc-netherlands-1978','1970s-b',1978,'罗布·伦森布林克',95,ARRAY['LW'],'universal'),
('wc-netherlands-1978:johnny-rep','johnny-rep','world_cup','wc-netherlands-1978','1970s-b',1978,'约翰尼·雷普',91,ARRAY['RW','ST'],'universal'),
('wc-netherlands-1978:dick-nanninga','dick-nanninga','world_cup','wc-netherlands-1978','1970s-b',1978,'迪克·南宁加',83,ARRAY['ST'],'universal'),
('wc-netherlands-1978:harry-lubse','harry-lubse','world_cup','wc-netherlands-1978','1970s-b',1978,'哈里·吕布瑟',73,ARRAY['ST'],'universal'),
('wc-italy-1982:dino-zoff','dino-zoff','world_cup','wc-italy-1982','1980s-a',1982,'迪诺·佐夫',94,ARRAY['GK'],'classic-keeper'),
('wc-italy-1982:ivano-bordon','ivano-bordon','world_cup','wc-italy-1982','1980s-a',1982,'伊瓦诺·博尔东',78,ARRAY['GK'],'classic-keeper'),
('wc-italy-1982:giovanni-galli','giovanni-galli','world_cup','wc-italy-1982','1980s-a',1982,'乔瓦尼·加利',77,ARRAY['GK'],'classic-keeper'),
('wc-italy-1982:claudio-gentile','claudio-gentile','world_cup','wc-italy-1982','1980s-a',1982,'克劳迪奥·詹蒂莱',91,ARRAY['CB','RB'],'classic-stopper'),
('wc-italy-1982:gaetano-scirea','gaetano-scirea','world_cup','wc-italy-1982','1980s-a',1982,'加埃塔诺·西雷阿',94,ARRAY['CB','CDM'],'universal'),
('wc-italy-1982:fulvio-collovati','fulvio-collovati','world_cup','wc-italy-1982','1980s-a',1982,'富尔维奥·科洛瓦蒂',88,ARRAY['CB'],'classic-stopper'),
('wc-italy-1982:antonio-cabrini','antonio-cabrini','world_cup','wc-italy-1982','1980s-a',1982,'安东尼奥·卡布里尼',91,ARRAY['LB'],'universal'),
('wc-italy-1982:giuseppe-bergomi','giuseppe-bergomi','world_cup','wc-italy-1982','1980s-a',1982,'朱塞佩·贝尔戈米',86,ARRAY['RB','CB'],'universal'),
('wc-italy-1982:franco-baresi','franco-baresi','world_cup','wc-italy-1982','1980s-a',1982,'弗朗哥·巴雷西',81,ARRAY['CB'],'universal'),
('wc-italy-1982:pietro-vierchowod','pietro-vierchowod','world_cup','wc-italy-1982','1980s-a',1982,'彼得罗·维尔乔沃德',80,ARRAY['CB'],'classic-stopper'),
('wc-italy-1982:gabriele-oriali','gabriele-oriali','world_cup','wc-italy-1982','1980s-a',1982,'加布里埃莱·奥里亚利',87,ARRAY['CDM','RB'],'universal'),
('wc-italy-1982:marco-tardelli','marco-tardelli','world_cup','wc-italy-1982','1980s-a',1982,'马尔科·塔尔德利',91,ARRAY['CM','CDM'],'universal'),
('wc-italy-1982:giancarlo-antognoni','giancarlo-antognoni','world_cup','wc-italy-1982','1980s-a',1982,'詹卡洛·安东尼奥尼',90,ARRAY['CAM','CM'],'classic-maker'),
('wc-italy-1982:giuseppe-dossena','giuseppe-dossena','world_cup','wc-italy-1982','1980s-a',1982,'朱塞佩·多塞纳',78,ARRAY['CM'],'universal'),
('wc-italy-1982:giampiero-marini','giampiero-marini','world_cup','wc-italy-1982','1980s-a',1982,'詹皮耶罗·马里尼',80,ARRAY['CDM'],'universal'),
('wc-italy-1982:franco-causio','franco-causio','world_cup','wc-italy-1982','1980s-a',1982,'弗朗哥·考西奥',81,ARRAY['RW','RM'],'universal'),
('wc-italy-1982:bruno-conti','bruno-conti','world_cup','wc-italy-1982','1980s-a',1982,'布鲁诺·孔蒂',93,ARRAY['RW'],'universal'),
('wc-italy-1982:francesco-graziani','francesco-graziani','world_cup','wc-italy-1982','1980s-a',1982,'弗朗切斯科·格拉齐亚尼',85,ARRAY['ST'],'universal'),
('wc-italy-1982:paolo-rossi','paolo-rossi','world_cup','wc-italy-1982','1980s-a',1982,'保罗·罗西',97,ARRAY['ST'],'universal'),
('wc-italy-1982:alessandro-altobelli','alessandro-altobelli','world_cup','wc-italy-1982','1980s-a',1982,'亚历山德罗·阿尔托贝利',86,ARRAY['ST'],'universal'),
('wc-italy-1982:daniele-massaro','daniele-massaro','world_cup','wc-italy-1982','1980s-a',1982,'达尼埃莱·马萨罗',77,ARRAY['LW','ST'],'universal'),
('wc-italy-1982:franco-selvaggi','franco-selvaggi','world_cup','wc-italy-1982','1980s-a',1982,'弗朗哥·塞尔瓦吉',74,ARRAY['ST'],'universal'),
('wc-brazil-1982:waldir-peres','waldir-peres','world_cup','wc-brazil-1982','1980s-a',1982,'瓦尔迪尔·佩雷斯',81,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1982:carlos-roberto-gallo','carlos-roberto-gallo','world_cup','wc-brazil-1982','1980s-a',1982,'卡洛斯·加洛',78,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1982:paulo-sergio','paulo-sergio','world_cup','wc-brazil-1982','1980s-a',1982,'保罗·塞尔吉奥',73,ARRAY['GK'],'classic-keeper'),
('wc-brazil-1982:leandro','leandro','world_cup','wc-brazil-1982','1980s-a',1982,'莱安德罗',88,ARRAY['RB'],'universal'),
('wc-brazil-1982:oscar-bernardi','oscar-bernardi','world_cup','wc-brazil-1982','1980s-a',1982,'奥斯卡·贝尔纳迪',86,ARRAY['CB'],'classic-stopper'),
('wc-brazil-1982:luizinho','luizinho','world_cup','wc-brazil-1982','1980s-a',1982,'路易西尼奥',87,ARRAY['CB'],'universal'),
('wc-brazil-1982:leovegildo-junior','leovegildo-junior','world_cup','wc-brazil-1982','1980s-a',1982,'儒尼奥尔',91,ARRAY['LB','CM'],'universal'),
('wc-brazil-1982:edinho','edinho','world_cup','wc-brazil-1982','1980s-a',1982,'埃迪尼奥',85,ARRAY['CB'],'universal'),
('wc-brazil-1982:edevaldo','edevaldo','world_cup','wc-brazil-1982','1980s-a',1982,'埃德瓦尔多',77,ARRAY['RB'],'universal'),
('wc-brazil-1982:pedrinho','pedrinho','world_cup','wc-brazil-1982','1980s-a',1982,'佩德里尼奥',76,ARRAY['LB'],'universal'),
('wc-brazil-1982:falcao','falcao','world_cup','wc-brazil-1982','1980s-a',1982,'法尔考',95,ARRAY['CM'],'universal'),
('wc-brazil-1982:socrates','socrates','world_cup','wc-brazil-1982','1980s-a',1982,'苏格拉底',95,ARRAY['CAM','CM'],'classic-maker'),
('wc-brazil-1982:zico','zico','world_cup','wc-brazil-1982','1980s-a',1982,'济科',97,ARRAY['CAM','ST'],'classic-maker'),
('wc-brazil-1982:toninho-cerezo','toninho-cerezo','world_cup','wc-brazil-1982','1980s-a',1982,'托尼尼奥·塞雷佐',91,ARRAY['CDM','CM'],'universal'),
('wc-brazil-1982:batista','batista','world_cup','wc-brazil-1982','1980s-a',1982,'巴蒂斯塔',82,ARRAY['CDM'],'universal'),
('wc-brazil-1982:paulo-isidoro','paulo-isidoro','world_cup','wc-brazil-1982','1980s-a',1982,'保罗·伊西多罗',82,ARRAY['CM','RM'],'universal'),
('wc-brazil-1982:dirceu','dirceu','world_cup','wc-brazil-1982','1980s-a',1982,'迪尔塞乌',81,ARRAY['CAM','LW'],'classic-maker'),
('wc-brazil-1982:eder-aleixo','eder-aleixo','world_cup','wc-brazil-1982','1980s-a',1982,'埃德尔·阿莱肖',89,ARRAY['LW'],'universal'),
('wc-brazil-1982:serginho-chulapa','serginho-chulapa','world_cup','wc-brazil-1982','1980s-a',1982,'塞尔吉尼奥',82,ARRAY['ST'],'universal'),
('wc-brazil-1982:roberto-dinamite','roberto-dinamite','world_cup','wc-brazil-1982','1980s-a',1982,'罗伯托·迪纳米特',83,ARRAY['ST'],'universal'),
('wc-brazil-1982:renato','renato','world_cup','wc-brazil-1982','1980s-a',1982,'雷纳托',75,ARRAY['LW'],'universal'),
('wc-argentina-1986:nery-pumpido','nery-pumpido','world_cup','wc-argentina-1986','1980s-b',1986,'内里·蓬皮多',86,ARRAY['GK'],'classic-keeper'),
('wc-argentina-1986:luis-islas','luis-islas','world_cup','wc-argentina-1986','1980s-b',1986,'路易斯·伊斯拉斯',76,ARRAY['GK'],'classic-keeper'),
('wc-argentina-1986:hector-zelada','hector-zelada','world_cup','wc-argentina-1986','1980s-b',1986,'埃克托尔·塞拉达',73,ARRAY['GK'],'classic-keeper'),
('wc-argentina-1986:jose-luis-brown','jose-luis-brown','world_cup','wc-argentina-1986','1980s-b',1986,'何塞·路易斯·布朗',87,ARRAY['CB'],'classic-stopper'),
('wc-argentina-1986:oscar-ruggeri','oscar-ruggeri','world_cup','wc-argentina-1986','1980s-b',1986,'奥斯卡·鲁杰里',91,ARRAY['CB'],'classic-stopper'),
('wc-argentina-1986:jose-luis-cuciuffo','jose-luis-cuciuffo','world_cup','wc-argentina-1986','1980s-b',1986,'何塞·路易斯·库丘福',84,ARRAY['CB','RB'],'universal'),
('wc-argentina-1986:julio-olarticoechea','julio-olarticoechea','world_cup','wc-argentina-1986','1980s-b',1986,'胡利奥·奥拉蒂科切亚',86,ARRAY['LB','LM'],'universal'),
('wc-argentina-1986:nestor-clausen','nestor-clausen','world_cup','wc-argentina-1986','1980s-b',1986,'内斯托尔·克劳森',80,ARRAY['RB'],'universal'),
('wc-argentina-1986:oscar-garre','oscar-garre','world_cup','wc-argentina-1986','1980s-b',1986,'奥斯卡·加雷',79,ARRAY['LB'],'universal'),
('wc-argentina-1986:daniel-passarella','daniel-passarella','world_cup','wc-argentina-1986','1980s-b',1986,'丹尼尔·帕萨雷拉',83,ARRAY['CB'],'universal'),
('wc-argentina-1986:sergio-batista','sergio-batista','world_cup','wc-argentina-1986','1980s-b',1986,'塞尔吉奥·巴蒂斯塔',86,ARRAY['CDM'],'universal'),
('wc-argentina-1986:ricardo-giusti','ricardo-giusti','world_cup','wc-argentina-1986','1980s-b',1986,'里卡多·朱斯蒂',86,ARRAY['RM','CDM'],'universal'),
('wc-argentina-1986:jorge-burruchaga','jorge-burruchaga','world_cup','wc-argentina-1986','1980s-b',1986,'豪尔赫·布鲁查加',91,ARRAY['CAM','RM'],'universal'),
('wc-argentina-1986:hector-enrique','hector-enrique','world_cup','wc-argentina-1986','1980s-b',1986,'埃克托尔·恩里克',86,ARRAY['CM'],'universal'),
('wc-argentina-1986:carlos-tapia','carlos-tapia','world_cup','wc-argentina-1986','1980s-b',1986,'卡洛斯·塔皮亚',78,ARRAY['CAM'],'classic-maker'),
('wc-argentina-1986:marcelo-trobbiani','marcelo-trobbiani','world_cup','wc-argentina-1986','1980s-b',1986,'马塞洛·特罗比亚尼',75,ARRAY['CAM','CM'],'classic-maker'),
('wc-argentina-1986:claudio-borghi','claudio-borghi','world_cup','wc-argentina-1986','1980s-b',1986,'克劳迪奥·博尔吉',78,ARRAY['CAM'],'classic-maker'),
('wc-argentina-1986:ricardo-bochini','ricardo-bochini','world_cup','wc-argentina-1986','1980s-b',1986,'里卡多·博奇尼',83,ARRAY['CAM'],'classic-maker'),
('wc-argentina-1986:diego-maradona','diego-maradona','world_cup','wc-argentina-1986','1980s-b',1986,'迭戈·马拉多纳',99,ARRAY['CAM','ST'],'universal'),
('wc-argentina-1986:jorge-valdano','jorge-valdano','world_cup','wc-argentina-1986','1980s-b',1986,'豪尔赫·巴尔达诺',91,ARRAY['ST'],'universal'),
('wc-argentina-1986:pedro-pasculli','pedro-pasculli','world_cup','wc-argentina-1986','1980s-b',1986,'佩德罗·帕斯库利',81,ARRAY['ST'],'universal'),
('wc-argentina-1986:sergio-almiron','sergio-almiron','world_cup','wc-argentina-1986','1980s-b',1986,'塞尔吉奥·阿尔米隆',74,ARRAY['ST'],'universal'),
('wc-france-1986:joel-bats','joel-bats','world_cup','wc-france-1986','1980s-b',1986,'若埃尔·巴茨',89,ARRAY['GK'],'classic-keeper'),
('wc-france-1986:albert-rust','albert-rust','world_cup','wc-france-1986','1980s-b',1986,'阿尔贝·吕斯特',76,ARRAY['GK'],'classic-keeper'),
('wc-france-1986:philippe-bergeroo','philippe-bergeroo','world_cup','wc-france-1986','1980s-b',1986,'菲利普·贝热罗',75,ARRAY['GK'],'classic-keeper'),
('wc-france-1986:patrick-battiston','patrick-battiston','world_cup','wc-france-1986','1980s-b',1986,'帕特里克·巴蒂斯通',87,ARRAY['CB','RB'],'universal'),
('wc-france-1986:manuel-amoros','manuel-amoros','world_cup','wc-france-1986','1980s-b',1986,'曼努埃尔·阿莫罗斯',92,ARRAY['RB','LB'],'universal'),
('wc-france-1986:maxime-bossis','maxime-bossis','world_cup','wc-france-1986','1980s-b',1986,'马克西姆·博西斯',90,ARRAY['CB','LB'],'universal'),
('wc-france-1986:yvon-le-roux','yvon-le-roux','world_cup','wc-france-1986','1980s-b',1986,'伊冯·勒鲁',81,ARRAY['CB'],'classic-stopper'),
('wc-france-1986:william-ayache','william-ayache','world_cup','wc-france-1986','1980s-b',1986,'威廉·阿亚什',82,ARRAY['LB','RB'],'universal'),
('wc-france-1986:michel-bibard','michel-bibard','world_cup','wc-france-1986','1980s-b',1986,'米歇尔·比巴尔',79,ARRAY['RB'],'universal'),
('wc-france-1986:thierry-tusseau','thierry-tusseau','world_cup','wc-france-1986','1980s-b',1986,'蒂埃里·蒂索',80,ARRAY['LB','CDM'],'universal'),
('wc-france-1986:luis-fernandez','luis-fernandez','world_cup','wc-france-1986','1980s-b',1986,'路易斯·费尔南德斯',89,ARRAY['CDM','CM'],'universal'),
('wc-france-1986:jean-tigana','jean-tigana','world_cup','wc-france-1986','1980s-b',1986,'让·蒂加纳',94,ARRAY['CM','CDM'],'universal'),
('wc-france-1986:alain-giresse','alain-giresse','world_cup','wc-france-1986','1980s-b',1986,'阿兰·吉雷瑟',91,ARRAY['CM','CAM'],'classic-maker'),
('wc-france-1986:michel-platini','michel-platini','world_cup','wc-france-1986','1980s-b',1986,'米歇尔·普拉蒂尼',96,ARRAY['CAM','CM'],'universal'),
('wc-france-1986:jean-marc-ferreri','jean-marc-ferreri','world_cup','wc-france-1986','1980s-b',1986,'让马克·费雷里',78,ARRAY['CAM'],'classic-maker'),
('wc-france-1986:philippe-vercruysse','philippe-vercruysse','world_cup','wc-france-1986','1980s-b',1986,'菲利普·韦克鲁斯',77,ARRAY['CM','CAM'],'universal'),
('wc-france-1986:dominique-rocheteau','dominique-rocheteau','world_cup','wc-france-1986','1980s-b',1986,'多米尼克·罗什托',88,ARRAY['ST','RW'],'universal'),
('wc-france-1986:yannick-stopyra','yannick-stopyra','world_cup','wc-france-1986','1980s-b',1986,'亚尼克·斯托皮拉',85,ARRAY['ST'],'universal'),
('wc-france-1986:jean-pierre-papin','jean-pierre-papin','world_cup','wc-france-1986','1980s-b',1986,'让皮埃尔·帕潘',83,ARRAY['ST'],'universal'),
('wc-france-1986:bruno-bellone','bruno-bellone','world_cup','wc-france-1986','1980s-b',1986,'布鲁诺·贝洛内',81,ARRAY['LW'],'universal'),
('wc-france-1986:daniel-xuereb','daniel-xuereb','world_cup','wc-france-1986','1980s-b',1986,'丹尼尔·许埃雷布',76,ARRAY['ST'],'universal'),
('wc-france-1986:bernard-genghini','bernard-genghini','world_cup','wc-france-1986','1980s-b',1986,'贝尔纳·让吉尼',80,ARRAY['CAM','CM'],'classic-maker'),
('wc-germany-1990:bodo-illgner','bodo-illgner','world_cup','wc-germany-1990','1990s-a',1990,'博多·伊尔格纳',89,ARRAY['GK'],'classic-keeper'),
('wc-germany-1990:raimond-aumann','raimond-aumann','world_cup','wc-germany-1990','1990s-a',1990,'莱蒙德·奥曼',77,ARRAY['GK'],'classic-keeper'),
('wc-germany-1990:andreas-kopke','andreas-kopke','world_cup','wc-germany-1990','1990s-a',1990,'安德烈亚斯·科普克',79,ARRAY['GK'],'classic-keeper'),
('wc-germany-1990:andreas-brehme','andreas-brehme','world_cup','wc-germany-1990','1990s-a',1990,'安德烈亚斯·布雷默',95,ARRAY['LB','LM'],'universal'),
('wc-germany-1990:jurgen-kohler','jurgen-kohler','world_cup','wc-germany-1990','1990s-a',1990,'尤尔根·科勒尔',91,ARRAY['CB'],'classic-stopper'),
('wc-germany-1990:guido-buchwald','guido-buchwald','world_cup','wc-germany-1990','1990s-a',1990,'吉多·布赫瓦尔德',89,ARRAY['CB','CDM'],'universal'),
('wc-germany-1990:thomas-berthold','thomas-berthold','world_cup','wc-germany-1990','1990s-a',1990,'托马斯·贝特霍尔德',86,ARRAY['RB','CB'],'universal'),
('wc-germany-1990:klaus-augenthaler','klaus-augenthaler','world_cup','wc-germany-1990','1990s-a',1990,'克劳斯·奥根塔勒',88,ARRAY['CB'],'universal'),
('wc-germany-1990:stefan-reuter','stefan-reuter','world_cup','wc-germany-1990','1990s-a',1990,'斯特凡·罗伊特',82,ARRAY['RB','RM'],'universal'),
('wc-germany-1990:alois-reinhardt','alois-reinhardt','world_cup','wc-germany-1990','1990s-a',1990,'阿洛伊斯·赖因哈特',75,ARRAY['CB'],'classic-stopper'),
('wc-germany-1990:gunter-hermann','gunter-hermann','world_cup','wc-germany-1990','1990s-a',1990,'京特·赫尔曼',75,ARRAY['CDM'],'universal'),
('wc-germany-1990:lothar-matthaus','lothar-matthaus','world_cup','wc-germany-1990','1990s-a',1990,'洛塔尔·马特乌斯',97,ARRAY['CM','CDM'],'universal'),
('wc-germany-1990:thomas-hassler','thomas-hassler','world_cup','wc-germany-1990','1990s-a',1990,'托马斯·哈斯勒',89,ARRAY['CAM','RM'],'universal'),
('wc-germany-1990:pierre-littbarski','pierre-littbarski','world_cup','wc-germany-1990','1990s-a',1990,'皮埃尔·利特巴尔斯基',88,ARRAY['RW','CAM'],'universal'),
('wc-germany-1990:andreas-moller','andreas-moller','world_cup','wc-germany-1990','1990s-a',1990,'安德烈亚斯·穆勒',83,ARRAY['CAM'],'universal'),
('wc-germany-1990:uwe-bein','uwe-bein','world_cup','wc-germany-1990','1990s-a',1990,'乌韦·拜因',82,ARRAY['CAM'],'classic-maker'),
('wc-germany-1990:olaf-thon','olaf-thon','world_cup','wc-germany-1990','1990s-a',1990,'奥拉夫·托恩',82,ARRAY['CM'],'universal'),
('wc-germany-1990:jurgen-klinsmann','jurgen-klinsmann','world_cup','wc-germany-1990','1990s-a',1990,'尤尔根·克林斯曼',93,ARRAY['ST'],'universal'),
('wc-germany-1990:rudi-voller','rudi-voller','world_cup','wc-germany-1990','1990s-a',1990,'鲁迪·沃勒尔',92,ARRAY['ST'],'universal'),
('wc-germany-1990:karl-heinz-riedle','karl-heinz-riedle','world_cup','wc-germany-1990','1990s-a',1990,'卡尔海因茨·里德尔',81,ARRAY['ST'],'universal'),
('wc-germany-1990:frank-mill','frank-mill','world_cup','wc-germany-1990','1990s-a',1990,'弗兰克·米尔',77,ARRAY['ST'],'universal'),
('wc-germany-1990:paul-steiner','paul-steiner','world_cup','wc-germany-1990','1990s-a',1990,'保罗·施泰纳',76,ARRAY['CB'],'classic-stopper'),
('wc-bulgaria-1994:borislav-mihaylov','borislav-mihaylov','world_cup','wc-bulgaria-1994','1990s-a',1994,'博里斯拉夫·米哈伊洛夫',85,ARRAY['GK'],'classic-keeper'),
('wc-bulgaria-1994:zdravko-zdravkov','zdravko-zdravkov','world_cup','wc-bulgaria-1994','1990s-a',1994,'兹德拉夫科·兹德拉夫科夫',74,ARRAY['GK'],'classic-keeper'),
('wc-bulgaria-1994:plamen-nikolov','plamen-nikolov','world_cup','wc-bulgaria-1994','1990s-a',1994,'普拉门·尼科洛夫',73,ARRAY['GK'],'classic-keeper'),
('wc-bulgaria-1994:trifon-ivanov','trifon-ivanov','world_cup','wc-bulgaria-1994','1990s-a',1994,'特里丰·伊万诺夫',87,ARRAY['CB'],'classic-stopper'),
('wc-bulgaria-1994:petar-hubchev','petar-hubchev','world_cup','wc-bulgaria-1994','1990s-a',1994,'彼得·胡布切夫',84,ARRAY['CB'],'classic-stopper'),
('wc-bulgaria-1994:tsanko-tsvetanov','tsanko-tsvetanov','world_cup','wc-bulgaria-1994','1990s-a',1994,'灿科·茨韦塔诺夫',82,ARRAY['LB'],'universal'),
('wc-bulgaria-1994:emil-kremenliev','emil-kremenliev','world_cup','wc-bulgaria-1994','1990s-a',1994,'埃米尔·克雷门利耶夫',82,ARRAY['RB'],'universal'),
('wc-bulgaria-1994:ilian-kiryakov','ilian-kiryakov','world_cup','wc-bulgaria-1994','1990s-a',1994,'伊利安·基里亚科夫',78,ARRAY['LB','RB'],'universal'),
('wc-bulgaria-1994:nikolay-iliev','nikolay-iliev','world_cup','wc-bulgaria-1994','1990s-a',1994,'尼古拉·伊利耶夫',80,ARRAY['CB'],'classic-stopper'),
('wc-bulgaria-1994:petar-aleksandrov','petar-aleksandrov','world_cup','wc-bulgaria-1994','1990s-a',1994,'彼得·亚历山德罗夫',75,ARRAY['ST'],'universal'),
('wc-bulgaria-1994:hristo-stoichkov','hristo-stoichkov','world_cup','wc-bulgaria-1994','1990s-a',1994,'赫里斯托·斯托伊奇科夫',96,ARRAY['LW','ST'],'universal'),
('wc-bulgaria-1994:emil-kostadinov','emil-kostadinov','world_cup','wc-bulgaria-1994','1990s-a',1994,'埃米尔·科斯塔迪诺夫',87,ARRAY['ST','RW'],'universal'),
('wc-bulgaria-1994:krasimir-balakov','krasimir-balakov','world_cup','wc-bulgaria-1994','1990s-a',1994,'克拉西米尔·巴拉科夫',92,ARRAY['CAM','CM'],'classic-maker'),
('wc-bulgaria-1994:yordan-lechkov','yordan-lechkov','world_cup','wc-bulgaria-1994','1990s-a',1994,'约尔丹·莱奇科夫',91,ARRAY['CM'],'universal'),
('wc-bulgaria-1994:zlatko-yankov','zlatko-yankov','world_cup','wc-bulgaria-1994','1990s-a',1994,'兹拉特科·扬科夫',83,ARRAY['CDM'],'universal'),
('wc-bulgaria-1994:nasko-sirakov','nasko-sirakov','world_cup','wc-bulgaria-1994','1990s-a',1994,'纳斯科·西拉科夫',84,ARRAY['ST'],'universal'),
('wc-bulgaria-1994:ivaylo-yordanov','ivaylo-yordanov','world_cup','wc-bulgaria-1994','1990s-a',1994,'伊瓦伊洛·约尔丹诺夫',81,ARRAY['ST','CM'],'universal'),
('wc-bulgaria-1994:daniel-borimirov','daniel-borimirov','world_cup','wc-bulgaria-1994','1990s-a',1994,'丹尼尔·博里米罗夫',80,ARRAY['RM','CM'],'universal'),
('wc-bulgaria-1994:ivaylo-andonov','ivaylo-andonov','world_cup','wc-bulgaria-1994','1990s-a',1994,'伊瓦伊洛·安多诺夫',75,ARRAY['ST'],'universal'),
('wc-bulgaria-1994:boncho-genchev','boncho-genchev','world_cup','wc-bulgaria-1994','1990s-a',1994,'邦乔·根切夫',77,ARRAY['ST','CAM'],'universal'),
('wc-bulgaria-1994:georgi-georgiev','georgi-georgiev','world_cup','wc-bulgaria-1994','1990s-a',1994,'格奥尔基·格奥尔基耶夫',76,ARRAY['CM'],'universal'),
('wc-bulgaria-1994:petar-mihtarski','petar-mihtarski','world_cup','wc-bulgaria-1994','1990s-a',1994,'彼得·米赫塔尔斯基',74,ARRAY['ST'],'universal'),
('wc-france-1998:fabien-barthez','fabien-barthez','world_cup','wc-france-1998','1990s-b',1998,'法比安·巴特兹',94,ARRAY['GK'],'universal'),
('wc-france-1998:bernard-lama','bernard-lama','world_cup','wc-france-1998','1990s-b',1998,'贝尔纳·拉马',81,ARRAY['GK'],'universal'),
('wc-france-1998:lionel-charbonnier','lionel-charbonnier','world_cup','wc-france-1998','1990s-b',1998,'利昂内尔·沙博尼耶',74,ARRAY['GK'],'universal'),
('wc-france-1998:lilian-thuram','lilian-thuram','world_cup','wc-france-1998','1990s-b',1998,'利利安·图拉姆',94,ARRAY['RB','CB'],'universal'),
('wc-france-1998:marcel-desailly','marcel-desailly','world_cup','wc-france-1998','1990s-b',1998,'马塞尔·德塞利',93,ARRAY['CB','CDM'],'universal'),
('wc-france-1998:laurent-blanc','laurent-blanc','world_cup','wc-france-1998','1990s-b',1998,'洛朗·布兰科',91,ARRAY['CB'],'universal'),
('wc-france-1998:bixente-lizarazu','bixente-lizarazu','world_cup','wc-france-1998','1990s-b',1998,'比森特·利扎拉祖',91,ARRAY['LB'],'universal'),
('wc-france-1998:frank-leboeuf','frank-leboeuf','world_cup','wc-france-1998','1990s-b',1998,'弗兰克·勒伯夫',84,ARRAY['CB'],'universal'),
('wc-france-1998:vincent-candela','vincent-candela','world_cup','wc-france-1998','1990s-b',1998,'文森特·坎德拉',82,ARRAY['LB','RB'],'universal'),
('wc-france-1998:didier-deschamps','didier-deschamps','world_cup','wc-france-1998','1990s-b',1998,'迪迪埃·德尚',91,ARRAY['CDM'],'universal'),
('wc-france-1998:emmanuel-petit','emmanuel-petit','world_cup','wc-france-1998','1990s-b',1998,'埃马纽埃尔·佩蒂特',90,ARRAY['CM','CDM'],'universal'),
('wc-france-1998:christian-karembeu','christian-karembeu','world_cup','wc-france-1998','1990s-b',1998,'克里斯蒂安·卡伦布',85,ARRAY['CDM','RM'],'universal'),
('wc-france-1998:patrick-vieira','patrick-vieira','world_cup','wc-france-1998','1990s-b',1998,'帕特里克·维埃拉',84,ARRAY['CM','CDM'],'universal'),
('wc-france-1998:alain-boghossian','alain-boghossian','world_cup','wc-france-1998','1990s-b',1998,'阿兰·博格西安',82,ARRAY['CM'],'universal'),
('wc-france-1998:zinedine-zidane','zinedine-zidane','world_cup','wc-france-1998','1990s-b',1998,'齐内丁·齐达内',97,ARRAY['CAM','CM'],'universal'),
('wc-france-1998:youri-djorkaeff','youri-djorkaeff','world_cup','wc-france-1998','1990s-b',1998,'尤里·德约卡夫',90,ARRAY['CAM','ST'],'universal'),
('wc-france-1998:stephane-guivarc-h','stephane-guivarc-h','world_cup','wc-france-1998','1990s-b',1998,'斯特凡·吉瓦尔什',82,ARRAY['ST'],'universal'),
('wc-france-1998:christophe-dugarry','christophe-dugarry','world_cup','wc-france-1998','1990s-b',1998,'克里斯托夫·杜加里',81,ARRAY['ST','LW'],'universal'),
('wc-france-1998:thierry-henry','thierry-henry','world_cup','wc-france-1998','1990s-b',1998,'蒂埃里·亨利',85,ARRAY['LW','ST'],'universal'),
('wc-france-1998:david-trezeguet','david-trezeguet','world_cup','wc-france-1998','1990s-b',1998,'大卫·特雷泽盖',79,ARRAY['ST'],'universal'),
('wc-france-1998:robert-pires','robert-pires','world_cup','wc-france-1998','1990s-b',1998,'罗贝尔·皮雷',82,ARRAY['LM','LW'],'universal'),
('wc-france-1998:bernard-diomede','bernard-diomede','world_cup','wc-france-1998','1990s-b',1998,'贝尔纳·迪奥梅德',76,ARRAY['LW'],'universal'),
('wc-croatia-1998:drazen-ladic','drazen-ladic','world_cup','wc-croatia-1998','1990s-b',1998,'德拉任·拉迪奇',88,ARRAY['GK'],'universal'),
('wc-croatia-1998:marijan-mrmic','marijan-mrmic','world_cup','wc-croatia-1998','1990s-b',1998,'马里扬·姆尔米奇',77,ARRAY['GK'],'universal'),
('wc-croatia-1998:vladimir-vasilj','vladimir-vasilj','world_cup','wc-croatia-1998','1990s-b',1998,'弗拉迪米尔·瓦西里',72,ARRAY['GK'],'universal'),
('wc-croatia-1998:dario-simic','dario-simic','world_cup','wc-croatia-1998','1990s-b',1998,'达里奥·西米奇',86,ARRAY['CB','RB'],'universal'),
('wc-croatia-1998:igor-stimac','igor-stimac','world_cup','wc-croatia-1998','1990s-b',1998,'伊戈尔·什蒂马茨',87,ARRAY['CB'],'classic-stopper'),
('wc-croatia-1998:slaven-bilic','slaven-bilic','world_cup','wc-croatia-1998','1990s-b',1998,'斯拉文·比利奇',88,ARRAY['CB'],'universal'),
('wc-croatia-1998:igor-tudor','igor-tudor','world_cup','wc-croatia-1998','1990s-b',1998,'伊戈尔·图多尔',80,ARRAY['CB','CDM'],'universal'),
('wc-croatia-1998:anthony-seric','anthony-seric','world_cup','wc-croatia-1998','1990s-b',1998,'安东尼·塞里奇',75,ARRAY['LB'],'universal'),
('wc-croatia-1998:robert-jarni','robert-jarni','world_cup','wc-croatia-1998','1990s-b',1998,'罗伯特·雅尔尼',91,ARRAY['LB','LM'],'universal'),
('wc-croatia-1998:zoran-mamic','zoran-mamic','world_cup','wc-croatia-1998','1990s-b',1998,'佐兰·马米奇',79,ARRAY['CB','CDM'],'universal'),
('wc-croatia-1998:goran-juric','goran-juric','world_cup','wc-croatia-1998','1990s-b',1998,'戈兰·尤里奇',78,ARRAY['CB'],'universal'),
('wc-croatia-1998:aljosa-asanovic','aljosa-asanovic','world_cup','wc-croatia-1998','1990s-b',1998,'阿廖沙·阿萨诺维奇',90,ARRAY['CM','CAM'],'classic-maker'),
('wc-croatia-1998:robert-prosinecki','robert-prosinecki','world_cup','wc-croatia-1998','1990s-b',1998,'罗伯特·普罗辛内茨基',90,ARRAY['CAM','CM'],'classic-maker'),
('wc-croatia-1998:zvonimir-boban','zvonimir-boban','world_cup','wc-croatia-1998','1990s-b',1998,'兹沃尼米尔·博班',92,ARRAY['CAM','CM'],'universal'),
('wc-croatia-1998:zvonimir-soldo','zvonimir-soldo','world_cup','wc-croatia-1998','1990s-b',1998,'兹沃尼米尔·索尔多',87,ARRAY['CDM','CB'],'universal'),
('wc-croatia-1998:krunoslav-jurcic','krunoslav-jurcic','world_cup','wc-croatia-1998','1990s-b',1998,'克鲁诺斯拉夫·尤尔契奇',82,ARRAY['CDM','CM'],'universal'),
('wc-croatia-1998:mario-stanic','mario-stanic','world_cup','wc-croatia-1998','1990s-b',1998,'马里奥·斯塔尼奇',86,ARRAY['RM','ST'],'universal'),
('wc-croatia-1998:silvio-maric','silvio-maric','world_cup','wc-croatia-1998','1990s-b',1998,'西尔维奥·马里奇',78,ARRAY['CAM','RM'],'universal'),
('wc-croatia-1998:davor-suker','davor-suker','world_cup','wc-croatia-1998','1990s-b',1998,'达沃·苏克',95,ARRAY['ST'],'universal'),
('wc-croatia-1998:goran-vlaovic','goran-vlaovic','world_cup','wc-croatia-1998','1990s-b',1998,'戈兰·弗拉奥维奇',87,ARRAY['ST'],'universal'),
('wc-croatia-1998:ardian-kozniku','ardian-kozniku','world_cup','wc-croatia-1998','1990s-b',1998,'阿尔迪安·科兹尼库',75,ARRAY['ST'],'universal'),
('wc-croatia-1998:petar-krpan','petar-krpan','world_cup','wc-croatia-1998','1990s-b',1998,'彼得·克尔潘',74,ARRAY['ST'],'universal'),
('wc-brazil-2002:marcos','marcos','world_cup','wc-brazil-2002','2000s-a',2002,'马科斯',91,ARRAY['GK'],'universal'),
('wc-brazil-2002:dida','dida','world_cup','wc-brazil-2002','2000s-a',2002,'迪达',83,ARRAY['GK'],'universal'),
('wc-brazil-2002:rogerio-ceni','rogerio-ceni','world_cup','wc-brazil-2002','2000s-a',2002,'罗热里奥·塞尼',80,ARRAY['GK'],'universal'),
('wc-brazil-2002:cafu','cafu','world_cup','wc-brazil-2002','2000s-a',2002,'卡福',93,ARRAY['RB'],'universal'),
('wc-brazil-2002:roberto-carlos','roberto-carlos','world_cup','wc-brazil-2002','2000s-a',2002,'罗伯托·卡洛斯',94,ARRAY['LB'],'universal'),
('wc-brazil-2002:lucio','lucio','world_cup','wc-brazil-2002','2000s-a',2002,'卢西奥',90,ARRAY['CB'],'universal'),
('wc-brazil-2002:roque-junior','roque-junior','world_cup','wc-brazil-2002','2000s-a',2002,'罗克·儒尼奥尔',83,ARRAY['CB'],'universal'),
('wc-brazil-2002:edmilson','edmilson','world_cup','wc-brazil-2002','2000s-a',2002,'埃德米尔森',86,ARRAY['CB','CDM'],'universal'),
('wc-brazil-2002:anderson-polga','anderson-polga','world_cup','wc-brazil-2002','2000s-a',2002,'安德森·波尔加',77,ARRAY['CB'],'universal'),
('wc-brazil-2002:belletti','belletti','world_cup','wc-brazil-2002','2000s-a',2002,'贝莱蒂',79,ARRAY['RB'],'universal'),
('wc-brazil-2002:junior-jenilson','junior-jenilson','world_cup','wc-brazil-2002','2000s-a',2002,'热尼尔森·儒尼奥尔',78,ARRAY['LB'],'universal'),
('wc-brazil-2002:gilberto-silva','gilberto-silva','world_cup','wc-brazil-2002','2000s-a',2002,'吉尔伯托·席尔瓦',89,ARRAY['CDM'],'universal'),
('wc-brazil-2002:kleberson','kleberson','world_cup','wc-brazil-2002','2000s-a',2002,'克莱伯森',86,ARRAY['CM'],'universal'),
('wc-brazil-2002:juninho-paulista','juninho-paulista','world_cup','wc-brazil-2002','2000s-a',2002,'儒尼尼奥·保利斯塔',84,ARRAY['CAM','CM'],'universal'),
('wc-brazil-2002:vampeta','vampeta','world_cup','wc-brazil-2002','2000s-a',2002,'万佩塔',77,ARRAY['CDM','CM'],'universal'),
('wc-brazil-2002:kaka','kaka','world_cup','wc-brazil-2002','2000s-a',2002,'卡卡',79,ARRAY['CAM'],'universal'),
('wc-brazil-2002:ronaldo-nazario','ronaldo-nazario','world_cup','wc-brazil-2002','2000s-a',2002,'罗纳尔多',99,ARRAY['ST'],'universal'),
('wc-brazil-2002:rivaldo','rivaldo','world_cup','wc-brazil-2002','2000s-a',2002,'里瓦尔多',94,ARRAY['CAM','LW','ST'],'universal'),
('wc-brazil-2002:ronaldinho','ronaldinho','world_cup','wc-brazil-2002','2000s-a',2002,'罗纳尔迪尼奥',93,ARRAY['CAM','LW'],'universal'),
('wc-brazil-2002:denilson','denilson','world_cup','wc-brazil-2002','2000s-a',2002,'德尼尔森',81,ARRAY['LW'],'universal'),
('wc-brazil-2002:luizao','luizao','world_cup','wc-brazil-2002','2000s-a',2002,'路易松',77,ARRAY['ST'],'universal'),
('wc-brazil-2002:edilson','edilson','world_cup','wc-brazil-2002','2000s-a',2002,'埃迪尔森',79,ARRAY['ST','RW'],'universal'),
('wc-senegal-2002:tony-sylva','tony-sylva','world_cup','wc-senegal-2002','2000s-a',2002,'托尼·席尔瓦',86,ARRAY['GK'],'universal'),
('wc-senegal-2002:omar-diallo','omar-diallo','world_cup','wc-senegal-2002','2000s-a',2002,'奥马尔·迪亚洛',74,ARRAY['GK'],'universal'),
('wc-senegal-2002:kalidou-cissokho','kalidou-cissokho','world_cup','wc-senegal-2002','2000s-a',2002,'卡利杜·西索科',70,ARRAY['GK'],'universal'),
('wc-senegal-2002:habib-beye','habib-beye','world_cup','wc-senegal-2002','2000s-a',2002,'哈比卜·贝耶',82,ARRAY['RB','CB'],'universal'),
('wc-senegal-2002:omar-daf','omar-daf','world_cup','wc-senegal-2002','2000s-a',2002,'奥马尔·达夫',82,ARRAY['LB','RB'],'universal'),
('wc-senegal-2002:ferdinand-coly','ferdinand-coly','world_cup','wc-senegal-2002','2000s-a',2002,'费迪南德·科利',84,ARRAY['RB','CB'],'universal'),
('wc-senegal-2002:aliou-cisse','aliou-cisse','world_cup','wc-senegal-2002','2000s-a',2002,'阿利乌·西塞',84,ARRAY['CDM','CB'],'universal'),
('wc-senegal-2002:lamine-diatta','lamine-diatta','world_cup','wc-senegal-2002','2000s-a',2002,'拉明·迪亚塔',85,ARRAY['CB'],'universal'),
('wc-senegal-2002:pape-malick-diop','pape-malick-diop','world_cup','wc-senegal-2002','2000s-a',2002,'帕普·马利克·迪奥普',83,ARRAY['CB','CDM'],'universal'),
('wc-senegal-2002:alassane-ndour','alassane-ndour','world_cup','wc-senegal-2002','2000s-a',2002,'阿拉萨内·恩杜尔',76,ARRAY['LB'],'universal'),
('wc-senegal-2002:papa-bouba-diop','papa-bouba-diop','world_cup','wc-senegal-2002','2000s-a',2002,'帕帕·布巴·迪奥普',88,ARRAY['CM','CDM'],'universal'),
('wc-senegal-2002:salif-diao','salif-diao','world_cup','wc-senegal-2002','2000s-a',2002,'萨利夫·迪奥',84,ARRAY['CM','CDM'],'universal'),
('wc-senegal-2002:amdy-faye','amdy-faye','world_cup','wc-senegal-2002','2000s-a',2002,'阿姆迪·法耶',80,ARRAY['CDM'],'universal'),
('wc-senegal-2002:khalilou-fadiga','khalilou-fadiga','world_cup','wc-senegal-2002','2000s-a',2002,'哈利卢·法迪加',88,ARRAY['LM','CAM'],'universal'),
('wc-senegal-2002:moussa-ndiaye','moussa-ndiaye','world_cup','wc-senegal-2002','2000s-a',2002,'穆萨·恩迪亚耶',79,ARRAY['LW','ST'],'universal'),
('wc-senegal-2002:sylvain-ndiaye','sylvain-ndiaye','world_cup','wc-senegal-2002','2000s-a',2002,'西尔万·恩迪亚耶',77,ARRAY['CM'],'universal'),
('wc-senegal-2002:makhtar-ndiaye','makhtar-ndiaye','world_cup','wc-senegal-2002','2000s-a',2002,'马克塔尔·恩迪亚耶',74,ARRAY['CM'],'universal'),
('wc-senegal-2002:el-hadji-diouf','el-hadji-diouf','world_cup','wc-senegal-2002','2000s-a',2002,'埃尔哈吉·迪乌夫',91,ARRAY['ST','LW'],'universal'),
('wc-senegal-2002:henri-camara','henri-camara','world_cup','wc-senegal-2002','2000s-a',2002,'亨利·卡马拉',88,ARRAY['ST'],'universal'),
('wc-senegal-2002:souleymane-camara','souleymane-camara','world_cup','wc-senegal-2002','2000s-a',2002,'苏莱曼·卡马拉',79,ARRAY['ST','RW'],'universal'),
('wc-senegal-2002:amara-traore','amara-traore','world_cup','wc-senegal-2002','2000s-a',2002,'阿马拉·特拉奥雷',73,ARRAY['ST'],'universal'),
('wc-senegal-2002:pape-thiaw','pape-thiaw','world_cup','wc-senegal-2002','2000s-a',2002,'帕普·蒂奥',76,ARRAY['ST'],'universal'),
('wc-italy-2006:gianluigi-buffon','gianluigi-buffon','world_cup','wc-italy-2006','2000s-b',2006,'詹路易吉·布冯',96,ARRAY['GK'],'universal'),
('wc-italy-2006:angelo-peruzzi','angelo-peruzzi','world_cup','wc-italy-2006','2000s-b',2006,'安杰洛·佩鲁齐',79,ARRAY['GK'],'universal'),
('wc-italy-2006:marco-amelia','marco-amelia','world_cup','wc-italy-2006','2000s-b',2006,'马尔科·阿梅利亚',74,ARRAY['GK'],'universal'),
('wc-italy-2006:fabio-cannavaro','fabio-cannavaro','world_cup','wc-italy-2006','2000s-b',2006,'法比奥·卡纳瓦罗',97,ARRAY['CB'],'universal'),
('wc-italy-2006:gianluca-zambrotta','gianluca-zambrotta','world_cup','wc-italy-2006','2000s-b',2006,'詹卢卡·赞布罗塔',94,ARRAY['RB','LB'],'universal'),
('wc-italy-2006:alessandro-nesta','alessandro-nesta','world_cup','wc-italy-2006','2000s-b',2006,'亚历山德罗·内斯塔',90,ARRAY['CB'],'universal'),
('wc-italy-2006:marco-materazzi','marco-materazzi','world_cup','wc-italy-2006','2000s-b',2006,'马尔科·马特拉齐',90,ARRAY['CB'],'universal'),
('wc-italy-2006:fabio-grosso','fabio-grosso','world_cup','wc-italy-2006','2000s-b',2006,'法比奥·格罗索',91,ARRAY['LB'],'universal'),
('wc-italy-2006:andrea-barzagli','andrea-barzagli','world_cup','wc-italy-2006','2000s-b',2006,'安德烈亚·巴尔扎利',81,ARRAY['CB'],'universal'),
('wc-italy-2006:cristian-zaccardo','cristian-zaccardo','world_cup','wc-italy-2006','2000s-b',2006,'克里斯蒂安·扎卡尔多',78,ARRAY['RB','CB'],'universal'),
('wc-italy-2006:massimo-oddo','massimo-oddo','world_cup','wc-italy-2006','2000s-b',2006,'马西莫·奥多',80,ARRAY['RB'],'universal'),
('wc-italy-2006:andrea-pirlo','andrea-pirlo','world_cup','wc-italy-2006','2000s-b',2006,'安德烈亚·皮尔洛',93,ARRAY['CM','CDM'],'universal'),
('wc-italy-2006:gennaro-gattuso','gennaro-gattuso','world_cup','wc-italy-2006','2000s-b',2006,'詹纳罗·加图索',91,ARRAY['CDM','CM'],'universal'),
('wc-italy-2006:daniele-de-rossi','daniele-de-rossi','world_cup','wc-italy-2006','2000s-b',2006,'达尼埃莱·德罗西',85,ARRAY['CDM','CM'],'universal'),
('wc-italy-2006:simone-perrotta','simone-perrotta','world_cup','wc-italy-2006','2000s-b',2006,'西蒙尼·佩罗塔',87,ARRAY['CM','CAM'],'universal'),
('wc-italy-2006:mauro-camoranesi','mauro-camoranesi','world_cup','wc-italy-2006','2000s-b',2006,'毛罗·卡莫拉内西',87,ARRAY['RM','RW'],'universal'),
('wc-italy-2006:simone-barone','simone-barone','world_cup','wc-italy-2006','2000s-b',2006,'西蒙尼·巴罗内',76,ARRAY['CM'],'universal'),
('wc-italy-2006:francesco-totti','francesco-totti','world_cup','wc-italy-2006','2000s-b',2006,'弗朗切斯科·托蒂',92,ARRAY['CAM','ST'],'universal'),
('wc-italy-2006:luca-toni','luca-toni','world_cup','wc-italy-2006','2000s-b',2006,'卢卡·托尼',90,ARRAY['ST'],'universal'),
('wc-italy-2006:alberto-gilardino','alberto-gilardino','world_cup','wc-italy-2006','2000s-b',2006,'阿尔贝托·吉拉迪诺',85,ARRAY['ST'],'universal'),
('wc-italy-2006:filippo-inzaghi','filippo-inzaghi','world_cup','wc-italy-2006','2000s-b',2006,'菲利波·因扎吉',87,ARRAY['ST'],'universal'),
('wc-italy-2006:alessandro-del-piero','alessandro-del-piero','world_cup','wc-italy-2006','2000s-b',2006,'亚历山德罗·德尔皮耶罗',89,ARRAY['ST','CAM'],'universal'),
('wc-italy-2006:vincenzo-iaquinta','vincenzo-iaquinta','world_cup','wc-italy-2006','2000s-b',2006,'文琴佐·亚昆塔',82,ARRAY['ST','RW'],'universal'),
('wc-ghana-2006:richard-kingson','richard-kingson','world_cup','wc-ghana-2006','2000s-b',2006,'理查德·金森',85,ARRAY['GK'],'universal'),
('wc-ghana-2006:george-owu','george-owu','world_cup','wc-ghana-2006','2000s-b',2006,'乔治·奥乌',74,ARRAY['GK'],'universal'),
('wc-ghana-2006:sammy-adjei','sammy-adjei','world_cup','wc-ghana-2006','2000s-b',2006,'萨米·阿杰伊',75,ARRAY['GK'],'universal'),
('wc-ghana-2006:john-paintsil','john-paintsil','world_cup','wc-ghana-2006','2000s-b',2006,'约翰·潘特西尔',82,ARRAY['RB'],'universal'),
('wc-ghana-2006:samuel-kuffour','samuel-kuffour','world_cup','wc-ghana-2006','2000s-b',2006,'萨穆埃尔·库福尔',84,ARRAY['CB'],'universal'),
('wc-ghana-2006:john-mensah','john-mensah','world_cup','wc-ghana-2006','2000s-b',2006,'约翰·门萨',86,ARRAY['CB'],'universal'),
('wc-ghana-2006:hans-sarpei','hans-sarpei','world_cup','wc-ghana-2006','2000s-b',2006,'汉斯·萨尔佩',81,ARRAY['LB','RB'],'universal'),
('wc-ghana-2006:shilla-illiasu','shilla-illiasu','world_cup','wc-ghana-2006','2000s-b',2006,'希拉·伊利亚苏',82,ARRAY['CB'],'universal'),
('wc-ghana-2006:habib-mohamed','habib-mohamed','world_cup','wc-ghana-2006','2000s-b',2006,'哈比卜·穆罕默德',76,ARRAY['LB'],'universal'),
('wc-ghana-2006:eric-addo','eric-addo','world_cup','wc-ghana-2006','2000s-b',2006,'埃里克·阿多',80,ARRAY['CB','CDM'],'universal'),
('wc-ghana-2006:michael-essien','michael-essien','world_cup','wc-ghana-2006','2000s-b',2006,'迈克尔·埃辛',93,ARRAY['CM','CDM'],'universal'),
('wc-ghana-2006:stephen-appiah','stephen-appiah','world_cup','wc-ghana-2006','2000s-b',2006,'斯蒂芬·阿皮亚',90,ARRAY['CM','CAM'],'universal'),
('wc-ghana-2006:sulley-muntari','sulley-muntari','world_cup','wc-ghana-2006','2000s-b',2006,'苏利·蒙塔里',88,ARRAY['CM','LM'],'universal'),
('wc-ghana-2006:derek-boateng','derek-boateng','world_cup','wc-ghana-2006','2000s-b',2006,'德里克·博阿滕',79,ARRAY['CDM','CM'],'universal'),
('wc-ghana-2006:otto-addo','otto-addo','world_cup','wc-ghana-2006','2000s-b',2006,'奥托·阿多',78,ARRAY['RM','CAM'],'universal'),
('wc-ghana-2006:haminu-draman','haminu-draman','world_cup','wc-ghana-2006','2000s-b',2006,'哈米努·德拉曼',79,ARRAY['RW','RM'],'universal'),
('wc-ghana-2006:razak-pimpong','razak-pimpong','world_cup','wc-ghana-2006','2000s-b',2006,'拉扎克·平蓬',76,ARRAY['ST','RW'],'universal'),
('wc-ghana-2006:matthew-amoah','matthew-amoah','world_cup','wc-ghana-2006','2000s-b',2006,'马修·阿莫阿',82,ARRAY['ST'],'universal'),
('wc-ghana-2006:asamoah-gyan','asamoah-gyan','world_cup','wc-ghana-2006','2000s-b',2006,'阿萨莫阿·吉安',86,ARRAY['ST'],'universal'),
('wc-spain-2010:iker-casillas','iker-casillas','world_cup','wc-spain-2010','2010s-a',2010,'伊克尔·卡西利亚斯',95,ARRAY['GK'],'universal'),
('wc-spain-2010:pepe-reina','pepe-reina','world_cup','wc-spain-2010','2010s-a',2010,'佩佩·雷纳',82,ARRAY['GK'],'universal'),
('wc-spain-2010:victor-valdes','victor-valdes','world_cup','wc-spain-2010','2010s-a',2010,'维克托·巴尔德斯',83,ARRAY['GK'],'universal'),
('wc-spain-2010:sergio-ramos','sergio-ramos','world_cup','wc-spain-2010','2010s-a',2010,'塞尔希奥·拉莫斯',92,ARRAY['RB','CB'],'universal'),
('wc-spain-2010:gerard-pique','gerard-pique','world_cup','wc-spain-2010','2010s-a',2010,'杰拉德·皮克',91,ARRAY['CB'],'universal'),
('wc-spain-2010:carles-puyol','carles-puyol','world_cup','wc-spain-2010','2010s-a',2010,'卡莱斯·普约尔',94,ARRAY['CB'],'universal'),
('wc-spain-2010:joan-capdevila','joan-capdevila','world_cup','wc-spain-2010','2010s-a',2010,'胡安·卡普德维拉',86,ARRAY['LB'],'universal'),
('wc-spain-2010:raul-albiol','raul-albiol','world_cup','wc-spain-2010','2010s-a',2010,'劳尔·阿尔比奥尔',79,ARRAY['CB'],'universal'),
('wc-spain-2010:alvaro-arbeloa','alvaro-arbeloa','world_cup','wc-spain-2010','2010s-a',2010,'阿尔瓦罗·阿韦洛亚',81,ARRAY['RB','LB'],'universal'),
('wc-spain-2010:carlos-marchena','carlos-marchena','world_cup','wc-spain-2010','2010s-a',2010,'卡洛斯·马切纳',82,ARRAY['CB','CDM'],'universal'),
('wc-spain-2010:xavi','xavi','world_cup','wc-spain-2010','2010s-a',2010,'哈维',97,ARRAY['CM'],'universal'),
('wc-spain-2010:andres-iniesta','andres-iniesta','world_cup','wc-spain-2010','2010s-a',2010,'安德烈斯·伊涅斯塔',93,ARRAY['CM','CAM','LW'],'universal'),
('wc-spain-2010:sergio-busquets','sergio-busquets','world_cup','wc-spain-2010','2010s-a',2010,'塞尔希奥·布斯克茨',91,ARRAY['CDM'],'universal'),
('wc-spain-2010:xabi-alonso','xabi-alonso','world_cup','wc-spain-2010','2010s-a',2010,'哈维·阿隆索',92,ARRAY['CM','CDM'],'universal'),
('wc-spain-2010:cesc-fabregas','cesc-fabregas','world_cup','wc-spain-2010','2010s-a',2010,'塞斯克·法布雷加斯',88,ARRAY['CM','CAM'],'universal'),
('wc-spain-2010:javi-martinez','javi-martinez','world_cup','wc-spain-2010','2010s-a',2010,'哈维·马丁内斯',78,ARRAY['CM','CDM'],'universal'),
('wc-spain-2010:david-villa','david-villa','world_cup','wc-spain-2010','2010s-a',2010,'大卫·比利亚',93,ARRAY['ST','LW'],'universal'),
('wc-spain-2010:fernando-torres','fernando-torres','world_cup','wc-spain-2010','2010s-a',2010,'费尔南多·托雷斯',85,ARRAY['ST'],'universal'),
('wc-spain-2010:pedro','pedro','world_cup','wc-spain-2010','2010s-a',2010,'佩德罗',84,ARRAY['RW','LW'],'universal'),
('wc-spain-2010:jesus-navas','jesus-navas','world_cup','wc-spain-2010','2010s-a',2010,'赫苏斯·纳瓦斯',85,ARRAY['RW','RM'],'universal'),
('wc-spain-2010:juan-mata','juan-mata','world_cup','wc-spain-2010','2010s-a',2010,'胡安·马塔',80,ARRAY['LW','CAM'],'universal'),
('wc-spain-2010:david-silva','david-silva','world_cup','wc-spain-2010','2010s-a',2010,'大卫·席尔瓦',87,ARRAY['CAM','LW'],'universal'),
('wc-spain-2010:fernando-llorente','fernando-llorente','world_cup','wc-spain-2010','2010s-a',2010,'费尔南多·略伦特',82,ARRAY['ST'],'universal'),
('wc-germany-2014:manuel-neuer','manuel-neuer','world_cup','wc-germany-2014','2010s-a',2014,'曼努埃尔·诺伊尔',97,ARRAY['GK'],'universal'),
('wc-germany-2014:roman-weidenfeller','roman-weidenfeller','world_cup','wc-germany-2014','2010s-a',2014,'罗曼·魏登费勒',79,ARRAY['GK'],'universal'),
('wc-germany-2014:ron-robert-zieler','ron-robert-zieler','world_cup','wc-germany-2014','2010s-a',2014,'罗恩罗伯特·齐勒',74,ARRAY['GK'],'universal'),
('wc-germany-2014:philipp-lahm','philipp-lahm','world_cup','wc-germany-2014','2010s-a',2014,'菲利普·拉姆',95,ARRAY['RB','LB','CDM'],'universal'),
('wc-germany-2014:mats-hummels','mats-hummels','world_cup','wc-germany-2014','2010s-a',2014,'马茨·胡梅尔斯',93,ARRAY['CB'],'universal'),
('wc-germany-2014:jerome-boateng','jerome-boateng','world_cup','wc-germany-2014','2010s-a',2014,'热罗姆·博阿滕',92,ARRAY['CB','RB'],'universal'),
('wc-germany-2014:benedikt-howedes','benedikt-howedes','world_cup','wc-germany-2014','2010s-a',2014,'贝内迪克特·赫韦德斯',86,ARRAY['LB','CB'],'universal'),
('wc-germany-2014:per-mertesacker','per-mertesacker','world_cup','wc-germany-2014','2010s-a',2014,'佩尔·默特萨克',85,ARRAY['CB'],'universal'),
('wc-germany-2014:shkodran-mustafi','shkodran-mustafi','world_cup','wc-germany-2014','2010s-a',2014,'施科德兰·穆斯塔菲',78,ARRAY['CB','RB'],'universal'),
('wc-germany-2014:erik-durm','erik-durm','world_cup','wc-germany-2014','2010s-a',2014,'埃里克·杜尔姆',74,ARRAY['LB'],'universal'),
('wc-germany-2014:matthias-ginter','matthias-ginter','world_cup','wc-germany-2014','2010s-a',2014,'马蒂亚斯·金特尔',75,ARRAY['CB'],'universal'),
('wc-germany-2014:kevin-grosskreutz','kevin-grosskreutz','world_cup','wc-germany-2014','2010s-a',2014,'凯文·格罗斯克罗伊茨',76,ARRAY['RB','RM'],'universal'),
('wc-germany-2014:toni-kroos','toni-kroos','world_cup','wc-germany-2014','2010s-a',2014,'托尼·克罗斯',94,ARRAY['CM','CAM'],'universal'),
('wc-germany-2014:bastian-schweinsteiger','bastian-schweinsteiger','world_cup','wc-germany-2014','2010s-a',2014,'巴斯蒂安·施魏因斯泰格',93,ARRAY['CM','CDM'],'universal'),
('wc-germany-2014:sami-khedira','sami-khedira','world_cup','wc-germany-2014','2010s-a',2014,'萨米·赫迪拉',89,ARRAY['CM','CDM'],'universal'),
('wc-germany-2014:christoph-kramer','christoph-kramer','world_cup','wc-germany-2014','2010s-a',2014,'克里斯托夫·克拉默',80,ARRAY['CDM','CM'],'universal'),
('wc-germany-2014:mesut-ozil','mesut-ozil','world_cup','wc-germany-2014','2010s-a',2014,'梅苏特·厄齐尔',91,ARRAY['CAM','LW'],'universal'),
('wc-germany-2014:mario-gotze','mario-gotze','world_cup','wc-germany-2014','2010s-a',2014,'马里奥·格策',89,ARRAY['CAM','ST'],'universal'),
('wc-germany-2014:julian-draxler','julian-draxler','world_cup','wc-germany-2014','2010s-a',2014,'尤利安·德拉克斯勒',78,ARRAY['LW','CAM'],'universal'),
('wc-germany-2014:thomas-muller','thomas-muller','world_cup','wc-germany-2014','2010s-a',2014,'托马斯·穆勒',93,ARRAY['RW','ST','CAM'],'universal'),
('wc-germany-2014:miroslav-klose','miroslav-klose','world_cup','wc-germany-2014','2010s-a',2014,'米洛斯拉夫·克洛泽',87,ARRAY['ST'],'universal'),
('wc-germany-2014:lukas-podolski','lukas-podolski','world_cup','wc-germany-2014','2010s-a',2014,'卢卡斯·波多尔斯基',81,ARRAY['LW','ST'],'universal'),
('wc-germany-2014:andre-schurrle','andre-schurrle','world_cup','wc-germany-2014','2010s-a',2014,'安德烈·许尔勒',87,ARRAY['LW','ST'],'universal'),
('wc-france-2018:hugo-lloris','hugo-lloris','world_cup','wc-france-2018','2010s-b',2018,'雨果·洛里',90,ARRAY['GK'],'universal'),
('wc-france-2018:steve-mandanda','steve-mandanda','world_cup','wc-france-2018','2010s-b',2018,'史蒂夫·曼丹达',78,ARRAY['GK'],'universal'),
('wc-france-2018:alphonse-areola','alphonse-areola','world_cup','wc-france-2018','2010s-b',2018,'阿尔方斯·阿雷奥拉',77,ARRAY['GK'],'universal'),
('wc-france-2018:raphael-varane','raphael-varane','world_cup','wc-france-2018','2010s-b',2018,'拉斐尔·瓦拉内',92,ARRAY['CB'],'universal'),
('wc-france-2018:samuel-umtiti','samuel-umtiti','world_cup','wc-france-2018','2010s-b',2018,'萨穆埃尔·乌姆蒂蒂',89,ARRAY['CB'],'universal'),
('wc-france-2018:presnel-kimpembe','presnel-kimpembe','world_cup','wc-france-2018','2010s-b',2018,'普雷斯内尔·金彭贝',80,ARRAY['CB'],'universal'),
('wc-france-2018:adil-rami','adil-rami','world_cup','wc-france-2018','2010s-b',2018,'阿迪尔·拉米',75,ARRAY['CB'],'universal'),
('wc-france-2018:benjamin-pavard','benjamin-pavard','world_cup','wc-france-2018','2010s-b',2018,'本杰明·帕瓦尔',85,ARRAY['RB','CB'],'universal'),
('wc-france-2018:lucas-hernandez','lucas-hernandez','world_cup','wc-france-2018','2010s-b',2018,'卢卡斯·埃尔南德斯',86,ARRAY['LB','CB'],'universal'),
('wc-france-2018:djibril-sidibe','djibril-sidibe','world_cup','wc-france-2018','2010s-b',2018,'吉布里尔·西迪贝',78,ARRAY['RB'],'universal'),
('wc-france-2018:benjamin-mendy','benjamin-mendy','world_cup','wc-france-2018','2010s-b',2018,'本杰明·门迪',78,ARRAY['LB'],'modern-wingback'),
('wc-france-2018:ngolo-kante','ngolo-kante','world_cup','wc-france-2018','2010s-b',2018,'恩戈洛·坎特',94,ARRAY['CDM','CM'],'universal'),
('wc-france-2018:paul-pogba','paul-pogba','world_cup','wc-france-2018','2010s-b',2018,'保罗·博格巴',91,ARRAY['CM'],'universal'),
('wc-france-2018:blaise-matuidi','blaise-matuidi','world_cup','wc-france-2018','2010s-b',2018,'布莱斯·马图伊迪',87,ARRAY['CM','LM'],'universal'),
('wc-france-2018:corentin-tolisso','corentin-tolisso','world_cup','wc-france-2018','2010s-b',2018,'科朗坦·托利索',81,ARRAY['CM'],'universal'),
('wc-france-2018:steven-nzonzi','steven-nzonzi','world_cup','wc-france-2018','2010s-b',2018,'史蒂文·恩宗齐',80,ARRAY['CDM'],'universal'),
('wc-france-2018:antoine-griezmann','antoine-griezmann','world_cup','wc-france-2018','2010s-b',2018,'安托万·格列兹曼',94,ARRAY['ST','CAM'],'universal'),
('wc-france-2018:kylian-mbappe','kylian-mbappe','world_cup','wc-france-2018','2010s-b',2018,'基利安·姆巴佩',95,ARRAY['RW','ST','LW'],'universal'),
('wc-france-2018:olivier-giroud','olivier-giroud','world_cup','wc-france-2018','2010s-b',2018,'奥利维耶·吉鲁',84,ARRAY['ST'],'universal'),
('wc-france-2018:ousmane-dembele','ousmane-dembele','world_cup','wc-france-2018','2010s-b',2018,'奥斯曼·登贝莱',83,ARRAY['RW','LW'],'universal'),
('wc-france-2018:nabil-fekir','nabil-fekir','world_cup','wc-france-2018','2010s-b',2018,'纳比勒·费基尔',82,ARRAY['CAM','ST'],'universal'),
('wc-france-2018:thomas-lemar','thomas-lemar','world_cup','wc-france-2018','2010s-b',2018,'托马·勒马尔',78,ARRAY['LM','LW'],'universal'),
('wc-france-2018:florian-thauvin','florian-thauvin','world_cup','wc-france-2018','2010s-b',2018,'弗洛里安·托万',77,ARRAY['RW'],'universal'),
('wc-croatia-2018:danijel-subasic','danijel-subasic','world_cup','wc-croatia-2018','2010s-b',2018,'达尼耶尔·苏巴西奇',91,ARRAY['GK'],'universal'),
('wc-croatia-2018:dominik-livakovic','dominik-livakovic','world_cup','wc-croatia-2018','2010s-b',2018,'多米尼克·利瓦科维奇',76,ARRAY['GK'],'universal'),
('wc-croatia-2018:lovre-kalinic','lovre-kalinic','world_cup','wc-croatia-2018','2010s-b',2018,'洛夫雷·卡利尼奇',77,ARRAY['GK'],'universal'),
('wc-croatia-2018:dejan-lovren','dejan-lovren','world_cup','wc-croatia-2018','2010s-b',2018,'德扬·洛夫伦',89,ARRAY['CB'],'universal'),
('wc-croatia-2018:domagoj-vida','domagoj-vida','world_cup','wc-croatia-2018','2010s-b',2018,'多马戈伊·维达',88,ARRAY['CB'],'universal'),
('wc-croatia-2018:sime-vrsaljko','sime-vrsaljko','world_cup','wc-croatia-2018','2010s-b',2018,'希梅·弗尔萨利科',87,ARRAY['RB'],'universal'),
('wc-croatia-2018:ivan-strinic','ivan-strinic','world_cup','wc-croatia-2018','2010s-b',2018,'伊万·斯特里尼奇',84,ARRAY['LB'],'universal'),
('wc-croatia-2018:josip-pivaric','josip-pivaric','world_cup','wc-croatia-2018','2010s-b',2018,'约西普·皮瓦里奇',79,ARRAY['LB'],'universal'),
('wc-croatia-2018:vedran-corluka','vedran-corluka','world_cup','wc-croatia-2018','2010s-b',2018,'韦德兰·乔尔卢卡',80,ARRAY['CB','RB'],'universal'),
('wc-croatia-2018:tin-jedvaj','tin-jedvaj','world_cup','wc-croatia-2018','2010s-b',2018,'廷·耶德瓦伊',77,ARRAY['CB','RB'],'universal'),
('wc-croatia-2018:duje-caleta-car','duje-caleta-car','world_cup','wc-croatia-2018','2010s-b',2018,'杜耶·查莱塔卡尔',76,ARRAY['CB'],'universal'),
('wc-croatia-2018:luka-modric','luka-modric','world_cup','wc-croatia-2018','2010s-b',2018,'卢卡·莫德里奇',97,ARRAY['CM'],'universal'),
('wc-croatia-2018:ivan-rakitic','ivan-rakitic','world_cup','wc-croatia-2018','2010s-b',2018,'伊万·拉基蒂奇',92,ARRAY['CM','CAM'],'universal'),
('wc-croatia-2018:marcelo-brozovic','marcelo-brozovic','world_cup','wc-croatia-2018','2010s-b',2018,'马塞洛·布罗佐维奇',88,ARRAY['CDM','CM'],'universal'),
('wc-croatia-2018:mateo-kovacic','mateo-kovacic','world_cup','wc-croatia-2018','2010s-b',2018,'马特奥·科瓦契奇',85,ARRAY['CM'],'universal'),
('wc-croatia-2018:milan-badelj','milan-badelj','world_cup','wc-croatia-2018','2010s-b',2018,'米兰·巴代利',82,ARRAY['CDM'],'universal'),
('wc-croatia-2018:filip-bradaric','filip-bradaric','world_cup','wc-croatia-2018','2010s-b',2018,'菲利普·布拉达里奇',74,ARRAY['CDM'],'universal'),
('wc-croatia-2018:ivan-perisic','ivan-perisic','world_cup','wc-croatia-2018','2010s-b',2018,'伊万·佩里西奇',91,ARRAY['LW','LM'],'universal'),
('wc-croatia-2018:mario-mandzukic','mario-mandzukic','world_cup','wc-croatia-2018','2010s-b',2018,'马里奥·曼朱基奇',90,ARRAY['ST'],'universal'),
('wc-croatia-2018:ante-rebic','ante-rebic','world_cup','wc-croatia-2018','2010s-b',2018,'安特·雷比奇',86,ARRAY['RW','ST'],'universal'),
('wc-croatia-2018:andrej-kramaric','andrej-kramaric','world_cup','wc-croatia-2018','2010s-b',2018,'安德烈·克拉马里奇',84,ARRAY['ST','CAM'],'universal'),
('wc-croatia-2018:marko-pjaca','marko-pjaca','world_cup','wc-croatia-2018','2010s-b',2018,'马尔科·皮亚察',77,ARRAY['LW'],'universal'),
('wc-argentina-2022:emiliano-martinez','emiliano-martinez','world_cup','wc-argentina-2022','2020s',2022,'埃米利亚诺·马丁内斯',93,ARRAY['GK'],'universal'),
('wc-argentina-2022:geronimo-rulli','geronimo-rulli','world_cup','wc-argentina-2022','2020s',2022,'赫罗尼莫·鲁利',77,ARRAY['GK'],'universal'),
('wc-argentina-2022:franco-armani','franco-armani','world_cup','wc-argentina-2022','2020s',2022,'弗兰科·阿尔马尼',75,ARRAY['GK'],'universal'),
('wc-argentina-2022:cristian-romero','cristian-romero','world_cup','wc-argentina-2022','2020s',2022,'克里斯蒂安·罗梅罗',89,ARRAY['CB'],'universal'),
('wc-argentina-2022:nicolas-otamendi','nicolas-otamendi','world_cup','wc-argentina-2022','2020s',2022,'尼古拉斯·奥塔门迪',87,ARRAY['CB'],'universal'),
('wc-argentina-2022:lisandro-martinez','lisandro-martinez','world_cup','wc-argentina-2022','2020s',2022,'利桑德罗·马丁内斯',85,ARRAY['CB'],'universal'),
('wc-argentina-2022:german-pezzella','german-pezzella','world_cup','wc-argentina-2022','2020s',2022,'赫尔曼·佩泽拉',80,ARRAY['CB'],'universal'),
('wc-argentina-2022:juan-foyth','juan-foyth','world_cup','wc-argentina-2022','2020s',2022,'胡安·福伊特',79,ARRAY['RB','CB'],'universal'),
('wc-argentina-2022:nahuel-molina','nahuel-molina','world_cup','wc-argentina-2022','2020s',2022,'纳韦尔·莫利纳',86,ARRAY['RB'],'universal'),
('wc-argentina-2022:gonzalo-montiel','gonzalo-montiel','world_cup','wc-argentina-2022','2020s',2022,'贡萨洛·蒙铁尔',80,ARRAY['RB'],'universal'),
('wc-argentina-2022:nicolas-tagliafico','nicolas-tagliafico','world_cup','wc-argentina-2022','2020s',2022,'尼古拉斯·塔利亚菲科',83,ARRAY['LB'],'universal'),
('wc-argentina-2022:marcos-acuna','marcos-acuna','world_cup','wc-argentina-2022','2020s',2022,'马科斯·阿库尼亚',84,ARRAY['LB','LM'],'universal'),
('wc-argentina-2022:rodrigo-de-paul','rodrigo-de-paul','world_cup','wc-argentina-2022','2020s',2022,'罗德里戈·德保罗',87,ARRAY['CM','RM'],'universal'),
('wc-argentina-2022:enzo-fernandez','enzo-fernandez','world_cup','wc-argentina-2022','2020s',2022,'恩佐·费尔南德斯',88,ARRAY['CM','CDM'],'universal'),
('wc-argentina-2022:alexis-mac-allister','alexis-mac-allister','world_cup','wc-argentina-2022','2020s',2022,'亚历克西斯·麦卡利斯特',88,ARRAY['CM','CAM'],'universal'),
('wc-argentina-2022:leandro-paredes','leandro-paredes','world_cup','wc-argentina-2022','2020s',2022,'莱安德罗·帕雷德斯',82,ARRAY['CDM','CM'],'universal'),
('wc-argentina-2022:guido-rodriguez','guido-rodriguez','world_cup','wc-argentina-2022','2020s',2022,'吉多·罗德里格斯',79,ARRAY['CDM'],'universal'),
('wc-argentina-2022:exequiel-palacios','exequiel-palacios','world_cup','wc-argentina-2022','2020s',2022,'埃塞基耶尔·帕拉西奥斯',78,ARRAY['CM'],'universal'),
('wc-argentina-2022:thiago-almada','thiago-almada','world_cup','wc-argentina-2022','2020s',2022,'蒂亚戈·阿尔马达',76,ARRAY['CAM'],'universal'),
('wc-argentina-2022:alejandro-gomez','alejandro-gomez','world_cup','wc-argentina-2022','2020s',2022,'亚历杭德罗·戈麦斯',78,ARRAY['CAM','LW'],'universal'),
('wc-argentina-2022:lionel-messi','lionel-messi','world_cup','wc-argentina-2022','2020s',2022,'利昂内尔·梅西',99,ARRAY['RW','CAM','ST'],'universal'),
('wc-argentina-2022:julian-alvarez','julian-alvarez','world_cup','wc-argentina-2022','2020s',2022,'胡利安·阿尔瓦雷斯',89,ARRAY['ST'],'universal'),
('wc-argentina-2022:angel-di-maria','angel-di-maria','world_cup','wc-argentina-2022','2020s',2022,'安赫尔·迪马利亚',92,ARRAY['RW','LW'],'universal'),
('wc-argentina-2022:lautaro-martinez','lautaro-martinez','world_cup','wc-argentina-2022','2020s',2022,'劳塔罗·马丁内斯',85,ARRAY['ST'],'universal'),
('wc-argentina-2022:paulo-dybala','paulo-dybala','world_cup','wc-argentina-2022','2020s',2022,'保罗·迪巴拉',85,ARRAY['CAM','ST'],'universal'),
('wc-argentina-2022:angel-correa','angel-correa','world_cup','wc-argentina-2022','2020s',2022,'安赫尔·科雷亚',80,ARRAY['RW','ST'],'universal'),
('wc-morocco-2022:yassine-bounou','yassine-bounou','world_cup','wc-morocco-2022','2020s',2022,'亚辛·布努',93,ARRAY['GK'],'universal'),
('wc-morocco-2022:munir-mohamedi','munir-mohamedi','world_cup','wc-morocco-2022','2020s',2022,'穆尼尔·穆罕默迪',77,ARRAY['GK'],'universal'),
('wc-morocco-2022:ahmed-reda-tagnaouti','ahmed-reda-tagnaouti','world_cup','wc-morocco-2022','2020s',2022,'艾哈迈德·塔格纳乌提',72,ARRAY['GK'],'universal'),
('wc-morocco-2022:achraf-hakimi','achraf-hakimi','world_cup','wc-morocco-2022','2020s',2022,'阿什拉夫·哈基米',93,ARRAY['RB','RM'],'universal'),
('wc-morocco-2022:noussair-mazraoui','noussair-mazraoui','world_cup','wc-morocco-2022','2020s',2022,'努赛尔·马兹拉维',88,ARRAY['LB','RB'],'universal'),
('wc-morocco-2022:romain-saiss','romain-saiss','world_cup','wc-morocco-2022','2020s',2022,'罗曼·赛斯',89,ARRAY['CB'],'universal'),
('wc-morocco-2022:nayef-aguerd','nayef-aguerd','world_cup','wc-morocco-2022','2020s',2022,'纳耶夫·阿格尔德',87,ARRAY['CB'],'universal'),
('wc-morocco-2022:achraf-dari','achraf-dari','world_cup','wc-morocco-2022','2020s',2022,'阿什拉夫·达里',80,ARRAY['CB'],'universal'),
('wc-morocco-2022:jawad-el-yamiq','jawad-el-yamiq','world_cup','wc-morocco-2022','2020s',2022,'贾瓦德·亚米克',84,ARRAY['CB'],'universal'),
('wc-morocco-2022:badr-benoun','badr-benoun','world_cup','wc-morocco-2022','2020s',2022,'巴德尔·贝农',77,ARRAY['CB'],'universal'),
('wc-morocco-2022:yahya-attiyat-allah','yahya-attiyat-allah','world_cup','wc-morocco-2022','2020s',2022,'叶海亚·阿提亚特阿拉',83,ARRAY['LB'],'universal'),
('wc-morocco-2022:sofyan-amrabat','sofyan-amrabat','world_cup','wc-morocco-2022','2020s',2022,'索菲扬·阿姆拉巴特',92,ARRAY['CDM','CM'],'universal'),
('wc-morocco-2022:azzedine-ounahi','azzedine-ounahi','world_cup','wc-morocco-2022','2020s',2022,'阿泽丁·奥纳希',89,ARRAY['CM'],'universal'),
('wc-morocco-2022:selim-amallah','selim-amallah','world_cup','wc-morocco-2022','2020s',2022,'塞利姆·阿马拉',85,ARRAY['CM','CAM'],'universal'),
('wc-morocco-2022:abdelhamid-sabiri','abdelhamid-sabiri','world_cup','wc-morocco-2022','2020s',2022,'阿卜杜勒哈米德·萨比里',80,ARRAY['CAM','CM'],'universal'),
('wc-morocco-2022:bilal-el-khannouss','bilal-el-khannouss','world_cup','wc-morocco-2022','2020s',2022,'比拉勒·汉努斯',76,ARRAY['CAM'],'universal'),
('wc-morocco-2022:yahya-jabrane','yahya-jabrane','world_cup','wc-morocco-2022','2020s',2022,'叶海亚·贾卜拉内',76,ARRAY['CDM'],'universal'),
('wc-morocco-2022:hakim-ziyech','hakim-ziyech','world_cup','wc-morocco-2022','2020s',2022,'哈基姆·齐耶赫',91,ARRAY['RW','CAM'],'universal'),
('wc-morocco-2022:sofiane-boufal','sofiane-boufal','world_cup','wc-morocco-2022','2020s',2022,'索菲安·布法尔',87,ARRAY['LW','CAM'],'universal'),
('wc-morocco-2022:youssef-en-nesyri','youssef-en-nesyri','world_cup','wc-morocco-2022','2020s',2022,'优素福·恩内斯里',87,ARRAY['ST'],'universal'),
('wc-morocco-2022:zakaria-aboukhlal','zakaria-aboukhlal','world_cup','wc-morocco-2022','2020s',2022,'扎卡里亚·阿布赫拉勒',81,ARRAY['RW','LW'],'universal'),
('wc-morocco-2022:walid-cheddira','walid-cheddira','world_cup','wc-morocco-2022','2020s',2022,'瓦利德·切迪拉',77,ARRAY['ST'],'universal'),
('wc-morocco-2022:abderrazak-hamdallah','abderrazak-hamdallah','world_cup','wc-morocco-2022','2020s',2022,'阿卜杜勒拉扎克·哈姆达拉',77,ARRAY['ST'],'universal'),
('wc-morocco-2022:abde-ezzalzouli','abde-ezzalzouli','world_cup','wc-morocco-2022','2020s',2022,'阿卜德·埃扎尔祖利',79,ARRAY['LW'],'universal'),
('wc-morocco-2022:anass-zaroury','anass-zaroury','world_cup','wc-morocco-2022','2020s',2022,'阿纳斯·扎鲁里',77,ARRAY['LW'],'universal'),
('wc-morocco-2022:ilias-chair','ilias-chair','world_cup','wc-morocco-2022','2020s',2022,'伊利亚斯·谢尔',77,ARRAY['CAM'],'universal'),
('ucl-real-madrid-1960:alfredo-di-stefano','alfredo-di-stefano','ucl','ucl-real-madrid-1960','1960s',1960,'阿尔弗雷多·迪斯蒂法诺',99,ARRAY['ST','CAM'],'universal'),
('ucl-real-madrid-1960:ferenc-puskas','ferenc-puskas','ucl','ucl-real-madrid-1960','1960s',1960,'费伦茨·普斯卡什',96,ARRAY['ST','LW'],'universal'),
('ucl-real-madrid-1960:francisco-gento','francisco-gento','ucl','ucl-real-madrid-1960','1960s',1960,'弗朗西斯科·亨托',94,ARRAY['LW','LM'],'universal'),
('ucl-real-madrid-1960:rogelio-dominguez','rogelio-dominguez','ucl','ucl-real-madrid-1960','1960s',1960,'罗赫利奥·多明格斯',86,ARRAY['GK'],'classic-keeper'),
('ucl-real-madrid-1960:juan-alonso','juan-alonso','ucl','ucl-real-madrid-1960','1960s',1960,'胡安·阿隆索',79,ARRAY['GK'],'classic-keeper'),
('ucl-real-madrid-1960:marquitos','marquitos','ucl','ucl-real-madrid-1960','1960s',1960,'马尔基托斯',83,ARRAY['CB','RB'],'classic-stopper'),
('ucl-real-madrid-1960:jose-santamaria','jose-santamaria','ucl','ucl-real-madrid-1960','1960s',1960,'何塞·圣玛利亚',89,ARRAY['CB'],'classic-stopper'),
('ucl-real-madrid-1960:jose-maria-zarraga','jose-maria-zarraga','ucl','ucl-real-madrid-1960','1960s',1960,'何塞·萨拉加',86,ARRAY['CDM','LB'],'universal'),
('ucl-real-madrid-1960:pachin','pachin','ucl','ucl-real-madrid-1960','1960s',1960,'帕钦',81,ARRAY['CB','LB'],'universal'),
('ucl-real-madrid-1960:juan-santisteban','juan-santisteban','ucl','ucl-real-madrid-1960','1960s',1960,'胡安·桑蒂斯特班',84,ARRAY['CM','CDM'],'universal'),
('ucl-real-madrid-1960:jose-maria-vidal','jose-maria-vidal','ucl','ucl-real-madrid-1960','1960s',1960,'何塞·比达尔',82,ARRAY['CM'],'universal'),
('ucl-real-madrid-1960:antonio-ruiz','antonio-ruiz','ucl','ucl-real-madrid-1960','1960s',1960,'安东尼奥·鲁伊斯',77,ARRAY['CM'],'universal'),
('ucl-real-madrid-1960:enrique-mateos','enrique-mateos','ucl','ucl-real-madrid-1960','1960s',1960,'恩里克·马特奥斯',81,ARRAY['ST'],'universal'),
('ucl-real-madrid-1960:pepillo','pepillo','ucl','ucl-real-madrid-1960','1960s',1960,'佩皮略',76,ARRAY['ST'],'universal'),
('ucl-real-madrid-1960:canario','canario','ucl','ucl-real-madrid-1960','1960s',1960,'卡纳里奥',80,ARRAY['RW'],'universal'),
('ucl-real-madrid-1960:luis-del-sol','luis-del-sol','ucl','ucl-real-madrid-1960','1960s',1960,'路易斯·德尔索尔',85,ARRAY['CM','CAM'],'universal'),
('ucl-real-madrid-1960:chus-herrera','chus-herrera','ucl','ucl-real-madrid-1960','1960s',1960,'丘斯·埃雷拉',74,ARRAY['RW'],'universal'),
('ucl-real-madrid-1960:manuel-torres','manuel-torres','ucl','ucl-real-madrid-1960','1960s',1960,'曼努埃尔·托雷斯',75,ARRAY['RB'],'universal'),
('ucl-celtic-1967:jimmy-johnstone','jimmy-johnstone','ucl','ucl-celtic-1967','1960s',1967,'吉米·约翰斯通',94,ARRAY['RW'],'universal'),
('ucl-celtic-1967:bobby-murdoch','bobby-murdoch','ucl','ucl-celtic-1967','1960s',1967,'博比·默多克',91,ARRAY['CM'],'universal'),
('ucl-celtic-1967:bertie-auld','bertie-auld','ucl','ucl-celtic-1967','1960s',1967,'伯蒂·奥尔德',89,ARRAY['CM','LM'],'universal'),
('ucl-celtic-1967:billy-mcneill','billy-mcneill','ucl','ucl-celtic-1967','1960s',1967,'比利·麦克尼尔',91,ARRAY['CB'],'classic-stopper'),
('ucl-celtic-1967:ronnie-simpson','ronnie-simpson','ucl','ucl-celtic-1967','1960s',1967,'罗尼·辛普森',86,ARRAY['GK'],'classic-keeper'),
('ucl-celtic-1967:john-fallon','john-fallon','ucl','ucl-celtic-1967','1960s',1967,'约翰·法伦',76,ARRAY['GK'],'classic-keeper'),
('ucl-celtic-1967:jim-craig','jim-craig','ucl','ucl-celtic-1967','1960s',1967,'吉姆·克雷格',84,ARRAY['RB'],'universal'),
('ucl-celtic-1967:tommy-gemmell','tommy-gemmell','ucl','ucl-celtic-1967','1960s',1967,'汤米·格梅尔',89,ARRAY['LB','RB'],'universal'),
('ucl-celtic-1967:john-clark','john-clark','ucl','ucl-celtic-1967','1960s',1967,'约翰·克拉克',85,ARRAY['CB'],'universal'),
('ucl-celtic-1967:willie-wallace','willie-wallace','ucl','ucl-celtic-1967','1960s',1967,'威利·华莱士',87,ARRAY['ST'],'universal'),
('ucl-celtic-1967:stevie-chalmers','stevie-chalmers','ucl','ucl-celtic-1967','1960s',1967,'史蒂维·查尔默斯',86,ARRAY['ST'],'universal'),
('ucl-celtic-1967:bobby-lennox','bobby-lennox','ucl','ucl-celtic-1967','1960s',1967,'博比·伦诺克斯',89,ARRAY['LW','ST'],'universal'),
('ucl-celtic-1967:john-hughes','john-hughes','ucl','ucl-celtic-1967','1960s',1967,'约翰·休斯',83,ARRAY['LW','ST'],'universal'),
('ucl-celtic-1967:joe-mcbride','joe-mcbride','ucl','ucl-celtic-1967','1960s',1967,'乔·麦克布莱德',85,ARRAY['ST'],'universal'),
('ucl-celtic-1967:charlie-gallagher','charlie-gallagher','ucl','ucl-celtic-1967','1960s',1967,'查理·加拉格尔',78,ARRAY['CM'],'universal'),
('ucl-celtic-1967:willie-oneill','willie-oneill','ucl','ucl-celtic-1967','1960s',1967,'威利·奥尼尔',76,ARRAY['LB'],'universal'),
('ucl-celtic-1967:jim-brogan','jim-brogan','ucl','ucl-celtic-1967','1960s',1967,'吉姆·布罗根',76,ARRAY['CB','LB'],'universal'),
('ucl-celtic-1967:lou-macari','lou-macari','ucl','ucl-celtic-1967','1960s',1967,'卢·马卡里',74,ARRAY['ST','CAM'],'universal'),
('ucl-feyenoord-1970:willem-van-hanegem','willem-van-hanegem','ucl','ucl-feyenoord-1970','1970s-a',1970,'范哈内亨',94,ARRAY['CM','CAM'],'universal'),
('ucl-feyenoord-1970:ove-kindvall','ove-kindvall','ucl','ucl-feyenoord-1970','1970s-a',1970,'奥韦·金德瓦尔',91,ARRAY['ST'],'universal'),
('ucl-feyenoord-1970:rinus-israel','rinus-israel','ucl','ucl-feyenoord-1970','1970s-a',1970,'里努斯·伊斯拉埃尔',90,ARRAY['CB'],'classic-stopper'),
('ucl-feyenoord-1970:wim-jansen','wim-jansen','ucl','ucl-feyenoord-1970','1970s-a',1970,'维姆·扬森',89,ARRAY['CDM','CM'],'universal'),
('ucl-feyenoord-1970:franz-hasil','franz-hasil','ucl','ucl-feyenoord-1970','1970s-a',1970,'弗朗茨·哈西尔',85,ARRAY['CM','CAM'],'universal'),
('ucl-feyenoord-1970:coen-moulijn','coen-moulijn','ucl','ucl-feyenoord-1970','1970s-a',1970,'科恩·穆莱恩',88,ARRAY['LW'],'universal'),
('ucl-feyenoord-1970:eddy-pieters-graafland','eddy-pieters-graafland','ucl','ucl-feyenoord-1970','1970s-a',1970,'埃迪·皮特斯格拉夫兰',84,ARRAY['GK'],'classic-keeper'),
('ucl-feyenoord-1970:eddy-treijtel','eddy-treijtel','ucl','ucl-feyenoord-1970','1970s-a',1970,'埃迪·特雷特尔',80,ARRAY['GK'],'classic-keeper'),
('ucl-feyenoord-1970:theo-laseroms','theo-laseroms','ucl','ucl-feyenoord-1970','1970s-a',1970,'特奥·拉塞罗姆斯',84,ARRAY['CB'],'classic-stopper'),
('ucl-feyenoord-1970:piet-romeijn','piet-romeijn','ucl','ucl-feyenoord-1970','1970s-a',1970,'皮特·罗梅因',81,ARRAY['RB'],'universal'),
('ucl-feyenoord-1970:theo-van-duivenbode','theo-van-duivenbode','ucl','ucl-feyenoord-1970','1970s-a',1970,'特奥·范德伊文博德',82,ARRAY['LB'],'universal'),
('ucl-feyenoord-1970:henk-wery','henk-wery','ucl','ucl-feyenoord-1970','1970s-a',1970,'亨克·韦里',84,ARRAY['RW'],'universal'),
('ucl-feyenoord-1970:joop-van-daele','joop-van-daele','ucl','ucl-feyenoord-1970','1970s-a',1970,'约普·范达勒',77,ARRAY['CB','ST'],'universal'),
('ucl-feyenoord-1970:guus-haak','guus-haak','ucl','ucl-feyenoord-1970','1970s-a',1970,'胡斯·哈克',78,ARRAY['CB','RB'],'universal'),
('ucl-feyenoord-1970:jan-boskamp','jan-boskamp','ucl','ucl-feyenoord-1970','1970s-a',1970,'扬·博斯坎普',76,ARRAY['CM'],'universal'),
('ucl-feyenoord-1970:ruud-geels','ruud-geels','ucl','ucl-feyenoord-1970','1970s-a',1970,'鲁德·海尔斯',79,ARRAY['ST'],'universal'),
('ucl-feyenoord-1970:ge-knol','ge-knol','ucl','ucl-feyenoord-1970','1970s-a',1970,'赫·克诺尔',71,ARRAY['CB'],'universal'),
('ucl-ajax-1972:johan-cruyff','johan-cruyff','ucl','ucl-ajax-1972','1970s-a',1972,'约翰·克鲁伊夫',99,ARRAY['ST','CAM','LW'],'universal'),
('ucl-ajax-1972:johan-neeskens','johan-neeskens','ucl','ucl-ajax-1972','1970s-a',1972,'约翰·内斯肯斯',95,ARRAY['CM','CDM'],'universal'),
('ucl-ajax-1972:piet-keizer','piet-keizer','ucl','ucl-ajax-1972','1970s-a',1972,'皮特·凯泽',94,ARRAY['LW'],'universal'),
('ucl-ajax-1972:gerrie-muhren','gerrie-muhren','ucl','ucl-ajax-1972','1970s-a',1972,'格里·米伦',90,ARRAY['CM'],'universal'),
('ucl-ajax-1972:arie-haan','arie-haan','ucl','ucl-ajax-1972','1970s-a',1972,'阿里·汉',88,ARRAY['CDM','CB'],'universal'),
('ucl-ajax-1972:ruud-krol','ruud-krol','ucl','ucl-ajax-1972','1970s-a',1972,'鲁德·克罗尔',92,ARRAY['LB','CB'],'universal'),
('ucl-ajax-1972:wim-suurbier','wim-suurbier','ucl','ucl-ajax-1972','1970s-a',1972,'维姆·苏尔比尔',87,ARRAY['RB'],'universal'),
('ucl-ajax-1972:barry-hulshoff','barry-hulshoff','ucl','ucl-ajax-1972','1970s-a',1972,'巴里·胡尔斯霍夫',87,ARRAY['CB'],'universal'),
('ucl-ajax-1972:horst-blankenburg','horst-blankenburg','ucl','ucl-ajax-1972','1970s-a',1972,'霍斯特·布兰肯堡',88,ARRAY['CB','CDM'],'universal'),
('ucl-ajax-1972:heinz-stuy','heinz-stuy','ucl','ucl-ajax-1972','1970s-a',1972,'海因茨·斯图伊',84,ARRAY['GK'],'classic-keeper'),
('ucl-ajax-1972:sies-wever','sies-wever','ucl','ucl-ajax-1972','1970s-a',1972,'西斯·韦弗',73,ARRAY['GK'],'classic-keeper'),
('ucl-ajax-1972:sjaak-swart','sjaak-swart','ucl','ucl-ajax-1972','1970s-a',1972,'斯亚克·斯瓦特',89,ARRAY['RW'],'universal'),
('ucl-ajax-1972:johnny-rep','johnny-rep','ucl','ucl-ajax-1972','1970s-a',1972,'约翰尼·雷普',83,ARRAY['RW','ST'],'universal'),
('ucl-ajax-1972:dick-van-dijk','dick-van-dijk','ucl','ucl-ajax-1972','1970s-a',1972,'迪克·范戴克',81,ARRAY['ST'],'universal'),
('ucl-ajax-1972:arnold-muhren','arnold-muhren','ucl','ucl-ajax-1972','1970s-a',1972,'阿诺德·米伦',80,ARRAY['CM','LM'],'universal'),
('ucl-ajax-1972:heinz-schilcher','heinz-schilcher','ucl','ucl-ajax-1972','1970s-a',1972,'海因茨·席尔歇',77,ARRAY['CB','CDM'],'universal'),
('ucl-liverpool-1977:kevin-keegan','kevin-keegan','ucl','ucl-liverpool-1977','1970s-b',1977,'凯文·基冈',95,ARRAY['ST','CAM'],'universal'),
('ucl-liverpool-1977:ray-clemence','ray-clemence','ucl','ucl-liverpool-1977','1970s-b',1977,'雷·克莱门斯',92,ARRAY['GK'],'universal'),
('ucl-liverpool-1977:emlyn-hughes','emlyn-hughes','ucl','ucl-liverpool-1977','1970s-b',1977,'埃姆林·休斯',91,ARRAY['CB','LB'],'universal'),
('ucl-liverpool-1977:phil-neal','phil-neal','ucl','ucl-liverpool-1977','1970s-b',1977,'菲尔·尼尔',87,ARRAY['RB'],'universal'),
('ucl-liverpool-1977:tommy-smith','tommy-smith','ucl','ucl-liverpool-1977','1970s-b',1977,'汤米·史密斯',86,ARRAY['CB','RB'],'classic-stopper'),
('ucl-liverpool-1977:joey-jones','joey-jones','ucl','ucl-liverpool-1977','1970s-b',1977,'乔伊·琼斯',81,ARRAY['LB'],'universal'),
('ucl-liverpool-1977:ian-callaghan','ian-callaghan','ucl','ucl-liverpool-1977','1970s-b',1977,'伊恩·卡拉汉',88,ARRAY['CM','RW'],'universal'),
('ucl-liverpool-1977:terry-mcdermott','terry-mcdermott','ucl','ucl-liverpool-1977','1970s-b',1977,'特里·麦克德莫特',88,ARRAY['CM'],'universal'),
('ucl-liverpool-1977:ray-kennedy','ray-kennedy','ucl','ucl-liverpool-1977','1970s-b',1977,'雷·肯尼迪',88,ARRAY['LM','CM'],'universal'),
('ucl-liverpool-1977:steve-heighway','steve-heighway','ucl','ucl-liverpool-1977','1970s-b',1977,'史蒂夫·海韦',87,ARRAY['LW'],'universal'),
('ucl-liverpool-1977:jimmy-case','jimmy-case','ucl','ucl-liverpool-1977','1970s-b',1977,'吉米·凯斯',85,ARRAY['RM','CM'],'universal'),
('ucl-liverpool-1977:david-fairclough','david-fairclough','ucl','ucl-liverpool-1977','1970s-b',1977,'大卫·费尔克拉夫',81,ARRAY['ST'],'universal'),
('ucl-liverpool-1977:david-johnson','david-johnson','ucl','ucl-liverpool-1977','1970s-b',1977,'大卫·约翰逊',81,ARRAY['ST'],'universal'),
('ucl-liverpool-1977:john-toshack','john-toshack','ucl','ucl-liverpool-1977','1970s-b',1977,'约翰·托沙克',83,ARRAY['ST'],'universal'),
('ucl-liverpool-1977:alec-lindsay','alec-lindsay','ucl','ucl-liverpool-1977','1970s-b',1977,'阿莱克·林赛',79,ARRAY['LB'],'universal'),
('ucl-liverpool-1977:peter-mcdonnell','peter-mcdonnell','ucl','ucl-liverpool-1977','1970s-b',1977,'彼得·麦克唐纳',69,ARRAY['GK'],'universal'),
('ucl-liverpool-1977:brian-kettle','brian-kettle','ucl','ucl-liverpool-1977','1970s-b',1977,'布赖恩·凯特尔',73,ARRAY['LB'],'universal'),
('ucl-liverpool-1977:phil-thompson','phil-thompson','ucl','ucl-liverpool-1977','1970s-b',1977,'菲尔·汤普森',85,ARRAY['CB'],'universal'),
('ucl-nottingham-forest-1979:peter-shilton','peter-shilton','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'彼得·希尔顿',94,ARRAY['GK'],'universal'),
('ucl-nottingham-forest-1979:john-robertson','john-robertson','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'约翰·罗伯逊',91,ARRAY['LW','LM'],'universal'),
('ucl-nottingham-forest-1979:trevor-francis','trevor-francis','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'特雷弗·弗朗西斯',89,ARRAY['ST','RW'],'universal'),
('ucl-nottingham-forest-1979:viv-anderson','viv-anderson','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'维夫·安德森',88,ARRAY['RB'],'universal'),
('ucl-nottingham-forest-1979:kenny-burns','kenny-burns','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'肯尼·伯恩斯',88,ARRAY['CB'],'classic-stopper'),
('ucl-nottingham-forest-1979:larry-lloyd','larry-lloyd','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'拉里·劳埃德',85,ARRAY['CB'],'classic-stopper'),
('ucl-nottingham-forest-1979:frank-clark','frank-clark','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'弗兰克·克拉克',83,ARRAY['LB'],'universal'),
('ucl-nottingham-forest-1979:john-mcgovern','john-mcgovern','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'约翰·麦戈文',86,ARRAY['CM','CDM'],'universal'),
('ucl-nottingham-forest-1979:ian-bowyer','ian-bowyer','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'伊恩·鲍耶',85,ARRAY['CM'],'universal'),
('ucl-nottingham-forest-1979:martin-oneill','martin-oneill','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'马丁·奥尼尔',84,ARRAY['RM','CM'],'universal'),
('ucl-nottingham-forest-1979:garry-birtles','garry-birtles','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'加里·伯特尔斯',85,ARRAY['ST'],'universal'),
('ucl-nottingham-forest-1979:tony-woodcock','tony-woodcock','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'托尼·伍德科克',85,ARRAY['ST'],'universal'),
('ucl-nottingham-forest-1979:chris-woods','chris-woods','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'克里斯·伍兹',75,ARRAY['GK'],'universal'),
('ucl-nottingham-forest-1979:david-needham','david-needham','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'大卫·尼德姆',78,ARRAY['CB'],'universal'),
('ucl-nottingham-forest-1979:colin-barrett','colin-barrett','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'科林·巴雷特',78,ARRAY['LB','CB'],'universal'),
('ucl-nottingham-forest-1979:steve-elliott','steve-elliott','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'史蒂夫·埃利奥特',71,ARRAY['ST'],'universal'),
('ucl-nottingham-forest-1979:john-ohare','john-ohare','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'约翰·奥黑尔',76,ARRAY['ST'],'universal'),
('ucl-nottingham-forest-1979:gary-mills','gary-mills','ucl','ucl-nottingham-forest-1979','1970s-b',1979,'加里·米尔斯',73,ARRAY['RM','RB'],'universal'),
('ucl-aston-villa-1982:gordon-cowans','gordon-cowans','ucl','ucl-aston-villa-1982','1980s-a',1982,'戈登·考恩斯',90,ARRAY['CM'],'universal'),
('ucl-aston-villa-1982:peter-withe','peter-withe','ucl','ucl-aston-villa-1982','1980s-a',1982,'彼得·威思',89,ARRAY['ST'],'universal'),
('ucl-aston-villa-1982:tony-morley','tony-morley','ucl','ucl-aston-villa-1982','1980s-a',1982,'托尼·莫利',89,ARRAY['LW'],'universal'),
('ucl-aston-villa-1982:dennis-mortimer','dennis-mortimer','ucl','ucl-aston-villa-1982','1980s-a',1982,'丹尼斯·莫蒂默',88,ARRAY['CM','CDM'],'universal'),
('ucl-aston-villa-1982:jimmy-rimmer','jimmy-rimmer','ucl','ucl-aston-villa-1982','1980s-a',1982,'吉米·里默',86,ARRAY['GK'],'universal'),
('ucl-aston-villa-1982:nigel-spink','nigel-spink','ucl','ucl-aston-villa-1982','1980s-a',1982,'奈杰尔·斯平克',81,ARRAY['GK'],'universal'),
('ucl-aston-villa-1982:kenny-swain','kenny-swain','ucl','ucl-aston-villa-1982','1980s-a',1982,'肯尼·斯温',84,ARRAY['RB'],'universal'),
('ucl-aston-villa-1982:allan-evans','allan-evans','ucl','ucl-aston-villa-1982','1980s-a',1982,'阿兰·埃文斯',85,ARRAY['CB'],'classic-stopper'),
('ucl-aston-villa-1982:ken-mcnaught','ken-mcnaught','ucl','ucl-aston-villa-1982','1980s-a',1982,'肯·麦克诺特',85,ARRAY['CB'],'classic-stopper'),
('ucl-aston-villa-1982:gary-williams','gary-williams','ucl','ucl-aston-villa-1982','1980s-a',1982,'加里·威廉斯',81,ARRAY['LB'],'universal'),
('ucl-aston-villa-1982:brendan-ormsby','brendan-ormsby','ucl','ucl-aston-villa-1982','1980s-a',1982,'布伦丹·奥姆斯比',74,ARRAY['CB'],'universal'),
('ucl-aston-villa-1982:des-bremner','des-bremner','ucl','ucl-aston-villa-1982','1980s-a',1982,'德斯·布雷姆纳',84,ARRAY['CM','RM'],'universal'),
('ucl-aston-villa-1982:gary-shaw','gary-shaw','ucl','ucl-aston-villa-1982','1980s-a',1982,'加里·肖',88,ARRAY['ST'],'universal'),
('ucl-aston-villa-1982:colin-gibson','colin-gibson','ucl','ucl-aston-villa-1982','1980s-a',1982,'科林·吉布森',79,ARRAY['LB','LM'],'universal'),
('ucl-aston-villa-1982:pat-heard','pat-heard','ucl','ucl-aston-villa-1982','1980s-a',1982,'帕特·赫德',74,ARRAY['CM','LB'],'universal'),
('ucl-aston-villa-1982:eamonn-deacy','eamonn-deacy','ucl','ucl-aston-villa-1982','1980s-a',1982,'埃蒙·迪西',74,ARRAY['LB','RB'],'universal'),
('ucl-aston-villa-1982:david-geddis','david-geddis','ucl','ucl-aston-villa-1982','1980s-a',1982,'大卫·格迪斯',76,ARRAY['ST'],'universal'),
('ucl-aston-villa-1982:mark-walters','mark-walters','ucl','ucl-aston-villa-1982','1980s-a',1982,'马克·沃尔特斯',74,ARRAY['RW','LW'],'universal'),
('ucl-liverpool-1984:kenny-dalglish','kenny-dalglish','ucl','ucl-liverpool-1984','1980s-a',1984,'肯尼·达格利什',96,ARRAY['ST','CAM'],'universal'),
('ucl-liverpool-1984:ian-rush','ian-rush','ucl','ucl-liverpool-1984','1980s-a',1984,'伊恩·拉什',95,ARRAY['ST'],'universal'),
('ucl-liverpool-1984:graeme-souness','graeme-souness','ucl','ucl-liverpool-1984','1980s-a',1984,'格雷姆·索内斯',94,ARRAY['CM','CDM'],'universal'),
('ucl-liverpool-1984:bruce-grobbelaar','bruce-grobbelaar','ucl','ucl-liverpool-1984','1980s-a',1984,'布鲁斯·格罗贝拉',87,ARRAY['GK'],'universal'),
('ucl-liverpool-1984:phil-neal','phil-neal','ucl','ucl-liverpool-1984','1980s-a',1984,'菲尔·尼尔',86,ARRAY['RB'],'universal'),
('ucl-liverpool-1984:alan-hansen','alan-hansen','ucl','ucl-liverpool-1984','1980s-a',1984,'阿兰·汉森',91,ARRAY['CB'],'universal'),
('ucl-liverpool-1984:mark-lawrenson','mark-lawrenson','ucl','ucl-liverpool-1984','1980s-a',1984,'马克·劳伦森',89,ARRAY['CB','LB'],'universal'),
('ucl-liverpool-1984:alan-kennedy','alan-kennedy','ucl','ucl-liverpool-1984','1980s-a',1984,'阿兰·肯尼迪',85,ARRAY['LB'],'universal'),
('ucl-liverpool-1984:ronnie-whelan','ronnie-whelan','ucl','ucl-liverpool-1984','1980s-a',1984,'罗尼·惠兰',86,ARRAY['LM','CM'],'universal'),
('ucl-liverpool-1984:sammy-lee','sammy-lee','ucl','ucl-liverpool-1984','1980s-a',1984,'萨米·李',84,ARRAY['RM','CM'],'universal'),
('ucl-liverpool-1984:craig-johnston','craig-johnston','ucl','ucl-liverpool-1984','1980s-a',1984,'克雷格·约翰斯顿',83,ARRAY['RM'],'universal'),
('ucl-liverpool-1984:michael-robinson','michael-robinson','ucl','ucl-liverpool-1984','1980s-a',1984,'迈克尔·罗宾逊',79,ARRAY['ST'],'universal'),
('ucl-liverpool-1984:david-hodgson','david-hodgson','ucl','ucl-liverpool-1984','1980s-a',1984,'大卫·霍奇森',77,ARRAY['ST','LW'],'universal'),
('ucl-liverpool-1984:steve-nicol','steve-nicol','ucl','ucl-liverpool-1984','1980s-a',1984,'史蒂夫·尼科尔',81,ARRAY['RB','LB'],'universal'),
('ucl-liverpool-1984:gary-gillespie','gary-gillespie','ucl','ucl-liverpool-1984','1980s-a',1984,'加里·吉莱斯皮',77,ARRAY['CB'],'universal'),
('ucl-liverpool-1984:bob-bolder','bob-bolder','ucl','ucl-liverpool-1984','1980s-a',1984,'博布·博尔德',73,ARRAY['GK'],'universal'),
('ucl-liverpool-1984:phil-thompson','phil-thompson','ucl','ucl-liverpool-1984','1980s-a',1984,'菲尔·汤普森',81,ARRAY['CB'],'universal'),
('ucl-porto-1987:paulo-futre','paulo-futre','ucl','ucl-porto-1987','1980s-b',1987,'保罗·富特雷',94,ARRAY['LW'],'universal'),
('ucl-porto-1987:rabah-madjer','rabah-madjer','ucl','ucl-porto-1987','1980s-b',1987,'拉巴赫·马杰尔',92,ARRAY['ST','RW'],'universal'),
('ucl-porto-1987:fernando-gomes','fernando-gomes','ucl','ucl-porto-1987','1980s-b',1987,'费尔南多·戈麦斯',90,ARRAY['ST'],'universal'),
('ucl-porto-1987:jozef-mlynarczyk','jozef-mlynarczyk','ucl','ucl-porto-1987','1980s-b',1987,'约瑟夫·姆维纳尔奇克',88,ARRAY['GK'],'universal'),
('ucl-porto-1987:ze-beto','ze-beto','ucl','ucl-porto-1987','1980s-b',1987,'泽·贝托',77,ARRAY['GK'],'universal'),
('ucl-porto-1987:joao-pinto-defender','joao-pinto-defender','ucl','ucl-porto-1987','1980s-b',1987,'若昂·平托',89,ARRAY['RB'],'universal'),
('ucl-porto-1987:augusto-inacio','augusto-inacio','ucl','ucl-porto-1987','1980s-b',1987,'奥古斯托·伊纳西奥',84,ARRAY['LB'],'universal'),
('ucl-porto-1987:celso-luis','celso-luis','ucl','ucl-porto-1987','1980s-b',1987,'塞尔索',84,ARRAY['CB'],'universal'),
('ucl-porto-1987:lima-pereira','lima-pereira','ucl','ucl-porto-1987','1980s-b',1987,'利马·佩雷拉',85,ARRAY['CB'],'universal'),
('ucl-porto-1987:eduardo-luis','eduardo-luis','ucl','ucl-porto-1987','1980s-b',1987,'爱德华多·路易斯',80,ARRAY['CB'],'universal'),
('ucl-porto-1987:andre-jorge-santos','andre-jorge-santos','ucl','ucl-porto-1987','1980s-b',1987,'安德烈·桑托斯',85,ARRAY['CDM','CM'],'universal'),
('ucl-porto-1987:jaime-pacheco','jaime-pacheco','ucl','ucl-porto-1987','1980s-b',1987,'雅伊梅·帕切科',84,ARRAY['CM','CDM'],'universal'),
('ucl-porto-1987:antonio-sousa','antonio-sousa','ucl','ucl-porto-1987','1980s-b',1987,'安东尼奥·索萨',87,ARRAY['CM','CAM'],'universal'),
('ucl-porto-1987:frasco','frasco','ucl','ucl-porto-1987','1980s-b',1987,'弗拉斯科',85,ARRAY['CM'],'universal'),
('ucl-porto-1987:jaime-magalhaes','jaime-magalhaes','ucl','ucl-porto-1987','1980s-b',1987,'雅伊梅·马加良斯',84,ARRAY['RM','CM'],'universal'),
('ucl-porto-1987:quim-joaquim-carvalho','quim-joaquim-carvalho','ucl','ucl-porto-1987','1980s-b',1987,'若阿金·卡瓦略',78,ARRAY['CDM'],'universal'),
('ucl-porto-1987:juary','juary','ucl','ucl-porto-1987','1980s-b',1987,'茹阿里',80,ARRAY['ST'],'universal'),
('ucl-milan-1989:marco-van-basten','marco-van-basten','ucl','ucl-milan-1989','1980s-b',1989,'马尔科·范巴斯滕',99,ARRAY['ST'],'universal'),
('ucl-milan-1989:ruud-gullit','ruud-gullit','ucl','ucl-milan-1989','1980s-b',1989,'鲁德·古利特',97,ARRAY['CAM','ST','CM'],'universal'),
('ucl-milan-1989:franco-baresi','franco-baresi','ucl','ucl-milan-1989','1980s-b',1989,'弗朗哥·巴雷西',96,ARRAY['CB'],'universal'),
('ucl-milan-1989:frank-rijkaard','frank-rijkaard','ucl','ucl-milan-1989','1980s-b',1989,'弗兰克·里杰卡尔德',93,ARRAY['CDM','CB'],'universal'),
('ucl-milan-1989:paolo-maldini','paolo-maldini','ucl','ucl-milan-1989','1980s-b',1989,'保罗·马尔蒂尼',91,ARRAY['LB','CB'],'universal'),
('ucl-milan-1989:alessandro-costacurta','alessandro-costacurta','ucl','ucl-milan-1989','1980s-b',1989,'亚历山德罗·科斯塔库塔',87,ARRAY['CB'],'universal'),
('ucl-milan-1989:mauro-tassotti','mauro-tassotti','ucl','ucl-milan-1989','1980s-b',1989,'毛罗·塔索蒂',87,ARRAY['RB'],'universal'),
('ucl-milan-1989:carlo-ancelotti','carlo-ancelotti','ucl','ucl-milan-1989','1980s-b',1989,'卡洛·安切洛蒂',88,ARRAY['CM','CDM'],'universal'),
('ucl-milan-1989:roberto-donadoni','roberto-donadoni','ucl','ucl-milan-1989','1980s-b',1989,'罗伯托·多纳多尼',90,ARRAY['RW','RM','LW'],'universal'),
('ucl-milan-1989:angelo-colombo','angelo-colombo','ucl','ucl-milan-1989','1980s-b',1989,'安杰洛·科隆博',83,ARRAY['CM','RM'],'universal'),
('ucl-milan-1989:giovanni-galli','giovanni-galli','ucl','ucl-milan-1989','1980s-b',1989,'乔瓦尼·加利',86,ARRAY['GK'],'universal'),
('ucl-milan-1989:davide-pinato','davide-pinato','ucl','ucl-milan-1989','1980s-b',1989,'达维德·皮纳托',72,ARRAY['GK'],'universal'),
('ucl-milan-1989:filippo-galli','filippo-galli','ucl','ucl-milan-1989','1980s-b',1989,'菲利波·加利',81,ARRAY['CB'],'universal'),
('ucl-milan-1989:alberigo-evani','alberigo-evani','ucl','ucl-milan-1989','1980s-b',1989,'阿尔贝里戈·埃瓦尼',84,ARRAY['LM','CM'],'universal'),
('ucl-milan-1989:pietro-paolo-virdis','pietro-paolo-virdis','ucl','ucl-milan-1989','1980s-b',1989,'彼得罗·维尔迪斯',83,ARRAY['ST'],'universal'),
('ucl-milan-1989:daniele-massaro','daniele-massaro','ucl','ucl-milan-1989','1980s-b',1989,'达尼埃莱·马萨罗',82,ARRAY['ST','LW'],'universal'),
('ucl-milan-1989:walter-bianchi','walter-bianchi','ucl','ucl-milan-1989','1980s-b',1989,'瓦尔特·比安基',73,ARRAY['RB'],'universal'),
('ucl-milan-1989:graziano-mannari','graziano-mannari','ucl','ucl-milan-1989','1980s-b',1989,'格拉齐亚诺·曼纳里',70,ARRAY['ST'],'universal'),
('ucl-red-star-1991:dejan-savicevic','dejan-savicevic','ucl','ucl-red-star-1991','1990s-a',1991,'德扬·萨维切维奇',94,ARRAY['CAM','RW'],'universal'),
('ucl-red-star-1991:robert-prosinecki','robert-prosinecki','ucl','ucl-red-star-1991','1990s-a',1991,'罗伯特·普罗辛内茨基',91,ARRAY['CM','CAM'],'universal'),
('ucl-red-star-1991:darko-pancev','darko-pancev','ucl','ucl-red-star-1991','1990s-a',1991,'达尔科·潘采夫',91,ARRAY['ST'],'universal'),
('ucl-red-star-1991:vladimir-jugovic','vladimir-jugovic','ucl','ucl-red-star-1991','1990s-a',1991,'弗拉迪米尔·尤戈维奇',88,ARRAY['CM','RM'],'universal'),
('ucl-red-star-1991:sinisa-mihajlovic','sinisa-mihajlovic','ucl','ucl-red-star-1991','1990s-a',1991,'西尼萨·米哈伊洛维奇',88,ARRAY['LB','CM'],'universal'),
('ucl-red-star-1991:miodrag-belodedici','miodrag-belodedici','ucl','ucl-red-star-1991','1990s-a',1991,'米奥德拉格·贝洛德迪奇',90,ARRAY['CB'],'universal'),
('ucl-red-star-1991:stevan-stojanovic','stevan-stojanovic','ucl','ucl-red-star-1991','1990s-a',1991,'斯特万·斯托亚诺维奇',85,ARRAY['GK'],'universal'),
('ucl-red-star-1991:zvonko-milojevic','zvonko-milojevic','ucl','ucl-red-star-1991','1990s-a',1991,'兹冯科·米洛耶维奇',73,ARRAY['GK'],'universal'),
('ucl-red-star-1991:dusko-radinovic','dusko-radinovic','ucl','ucl-red-star-1991','1990s-a',1991,'杜什科·拉迪诺维奇',80,ARRAY['RB'],'universal'),
('ucl-red-star-1991:ilija-najdoski','ilija-najdoski','ucl','ucl-red-star-1991','1990s-a',1991,'伊利亚·纳伊多斯基',85,ARRAY['CB'],'universal'),
('ucl-red-star-1991:slobodan-marovic','slobodan-marovic','ucl','ucl-red-star-1991','1990s-a',1991,'斯洛博丹·马罗维奇',81,ARRAY['LB'],'universal'),
('ucl-red-star-1991:refik-sabanadzovic','refik-sabanadzovic','ucl','ucl-red-star-1991','1990s-a',1991,'雷菲克·沙巴纳佐维奇',85,ARRAY['CDM','CB'],'universal'),
('ucl-red-star-1991:vlade-stosic','vlade-stosic','ucl','ucl-red-star-1991','1990s-a',1991,'弗拉德·斯托西奇',78,ARRAY['CM'],'universal'),
('ucl-red-star-1991:rade-tosic','rade-tosic','ucl','ucl-red-star-1991','1990s-a',1991,'拉德·托西奇',75,ARRAY['CB'],'universal'),
('ucl-red-star-1991:goran-vasilijevic','goran-vasilijevic','ucl','ucl-red-star-1991','1990s-a',1991,'戈兰·瓦西列维奇',74,ARRAY['LB'],'universal'),
('ucl-red-star-1991:vladan-lukic','vladan-lukic','ucl','ucl-red-star-1991','1990s-a',1991,'弗拉丹·卢基奇',79,ARRAY['ST'],'universal'),
('ucl-red-star-1991:dragisa-binic','dragisa-binic','ucl','ucl-red-star-1991','1990s-a',1991,'德拉吉沙·比尼奇',84,ARRAY['RW','ST'],'universal'),
('ucl-red-star-1991:ivica-momcilovic','ivica-momcilovic','ucl','ucl-red-star-1991','1990s-a',1991,'伊维察·莫姆奇洛维奇',73,ARRAY['CM'],'universal'),
('ucl-marseille-1993:abedi-pele','abedi-pele','ucl','ucl-marseille-1993','1990s-a',1993,'阿贝迪·贝利',94,ARRAY['CAM','RW'],'universal'),
('ucl-marseille-1993:didier-deschamps','didier-deschamps','ucl','ucl-marseille-1993','1990s-a',1993,'迪迪埃·德尚',91,ARRAY['CDM','CM'],'universal'),
('ucl-marseille-1993:marcel-desailly','marcel-desailly','ucl','ucl-marseille-1993','1990s-a',1993,'马塞尔·德塞利',93,ARRAY['CB','CDM'],'universal'),
('ucl-marseille-1993:rudi-voller','rudi-voller','ucl','ucl-marseille-1993','1990s-a',1993,'鲁迪·沃勒尔',90,ARRAY['ST'],'universal'),
('ucl-marseille-1993:alen-boksic','alen-boksic','ucl','ucl-marseille-1993','1990s-a',1993,'阿伦·博克西奇',90,ARRAY['ST'],'universal'),
('ucl-marseille-1993:fabien-barthez','fabien-barthez','ucl','ucl-marseille-1993','1990s-a',1993,'法比安·巴特兹',88,ARRAY['GK'],'universal'),
('ucl-marseille-1993:pascal-olmeta','pascal-olmeta','ucl','ucl-marseille-1993','1990s-a',1993,'帕斯卡尔·奥尔梅塔',77,ARRAY['GK'],'universal'),
('ucl-marseille-1993:basile-boli','basile-boli','ucl','ucl-marseille-1993','1990s-a',1993,'巴西勒·博利',88,ARRAY['CB'],'universal'),
('ucl-marseille-1993:bernard-casoni','bernard-casoni','ucl','ucl-marseille-1993','1990s-a',1993,'贝尔纳·卡索尼',82,ARRAY['CB','LB'],'universal'),
('ucl-marseille-1993:eric-di-meco','eric-di-meco','ucl','ucl-marseille-1993','1990s-a',1993,'埃里克·迪梅科',84,ARRAY['LB'],'universal'),
('ucl-marseille-1993:jocelyn-angloma','jocelyn-angloma','ucl','ucl-marseille-1993','1990s-a',1993,'若斯兰·安格洛马',86,ARRAY['RB','RM'],'universal'),
('ucl-marseille-1993:franck-sauzee','franck-sauzee','ucl','ucl-marseille-1993','1990s-a',1993,'弗兰克·索泽',88,ARRAY['CM','CB'],'universal'),
('ucl-marseille-1993:jean-jacques-eydelie','jean-jacques-eydelie','ucl','ucl-marseille-1993','1990s-a',1993,'让雅克·埃德利',81,ARRAY['CM','RB'],'universal'),
('ucl-marseille-1993:jean-philippe-durand','jean-philippe-durand','ucl','ucl-marseille-1993','1990s-a',1993,'让菲利普·迪朗',81,ARRAY['CM'],'universal'),
('ucl-marseille-1993:jean-marc-ferreri','jean-marc-ferreri','ucl','ucl-marseille-1993','1990s-a',1993,'让马克·费雷里',79,ARRAY['CAM'],'universal'),
('ucl-marseille-1993:daniel-dutuel','daniel-dutuel','ucl','ucl-marseille-1993','1990s-a',1993,'丹尼尔·迪蒂埃尔',78,ARRAY['CM'],'universal'),
('ucl-marseille-1993:thomas-prieto','thomas-prieto','ucl','ucl-marseille-1993','1990s-a',1993,'托马斯·普列托',70,ARRAY['CB'],'universal'),
('ucl-marseille-1993:omar-maherzi','omar-maherzi','ucl','ucl-marseille-1993','1990s-a',1993,'奥马尔·马赫尔齐',69,ARRAY['ST'],'universal'),
('ucl-ajax-1995:jari-litmanen','jari-litmanen','ucl','ucl-ajax-1995','1990s-b',1995,'亚里·利特马宁',94,ARRAY['CAM','ST'],'universal'),
('ucl-ajax-1995:frank-rijkaard','frank-rijkaard','ucl','ucl-ajax-1995','1990s-b',1995,'弗兰克·里杰卡尔德',94,ARRAY['CDM','CB'],'universal'),
('ucl-ajax-1995:edwin-van-der-sar','edwin-van-der-sar','ucl','ucl-ajax-1995','1990s-b',1995,'埃德温·范德萨',91,ARRAY['GK'],'universal'),
('ucl-ajax-1995:danny-blind','danny-blind','ucl','ucl-ajax-1995','1990s-b',1995,'丹尼·布林德',90,ARRAY['CB'],'universal'),
('ucl-ajax-1995:frank-de-boer','frank-de-boer','ucl','ucl-ajax-1995','1990s-b',1995,'弗兰克·德波尔',90,ARRAY['CB','LB'],'universal'),
('ucl-ajax-1995:michael-reiziger','michael-reiziger','ucl','ucl-ajax-1995','1990s-b',1995,'迈克尔·雷齐格',85,ARRAY['RB'],'universal'),
('ucl-ajax-1995:clarence-seedorf','clarence-seedorf','ucl','ucl-ajax-1995','1990s-b',1995,'克拉伦斯·西多夫',87,ARRAY['CM'],'universal'),
('ucl-ajax-1995:edgar-davids','edgar-davids','ucl','ucl-ajax-1995','1990s-b',1995,'埃德加·戴维斯',88,ARRAY['CM','CDM'],'universal'),
('ucl-ajax-1995:ronald-de-boer','ronald-de-boer','ucl','ucl-ajax-1995','1990s-b',1995,'罗纳德·德波尔',90,ARRAY['CAM','ST','RM'],'universal'),
('ucl-ajax-1995:finidi-george','finidi-george','ucl','ucl-ajax-1995','1990s-b',1995,'菲尼迪·乔治',88,ARRAY['RW','RM'],'universal'),
('ucl-ajax-1995:marc-overmars','marc-overmars','ucl','ucl-ajax-1995','1990s-b',1995,'马克·奥维马斯',90,ARRAY['LW','RW'],'universal'),
('ucl-ajax-1995:patrick-kluivert','patrick-kluivert','ucl','ucl-ajax-1995','1990s-b',1995,'帕特里克·克鲁伊维特',88,ARRAY['ST'],'universal'),
('ucl-ajax-1995:nwankwo-kanu','nwankwo-kanu','ucl','ucl-ajax-1995','1990s-b',1995,'恩万科沃·卡努',82,ARRAY['ST','CAM'],'universal'),
('ucl-ajax-1995:winston-bogarde','winston-bogarde','ucl','ucl-ajax-1995','1990s-b',1995,'温斯顿·博加德',81,ARRAY['LB','CB'],'universal'),
('ucl-ajax-1995:sonny-silooy','sonny-silooy','ucl','ucl-ajax-1995','1990s-b',1995,'桑尼·西洛伊',79,ARRAY['RB','CB'],'universal'),
('ucl-ajax-1995:peter-van-vossen','peter-van-vossen','ucl','ucl-ajax-1995','1990s-b',1995,'彼得·范沃森',78,ARRAY['LW','ST'],'universal'),
('ucl-ajax-1995:fred-grim','fred-grim','ucl','ucl-ajax-1995','1990s-b',1995,'弗雷德·赫里姆',73,ARRAY['GK'],'universal'),
('ucl-ajax-1995:tarik-oulida','tarik-oulida','ucl','ucl-ajax-1995','1990s-b',1995,'塔里克·奥利达',74,ARRAY['CAM'],'universal'),
('ucl-manchester-united-1999:david-beckham','david-beckham','ucl','ucl-manchester-united-1999','1990s-b',1999,'大卫·贝克汉姆',94,ARRAY['RM','CM'],'universal'),
('ucl-manchester-united-1999:roy-keane','roy-keane','ucl','ucl-manchester-united-1999','1990s-b',1999,'罗伊·基恩',94,ARRAY['CM','CDM'],'universal'),
('ucl-manchester-united-1999:peter-schmeichel','peter-schmeichel','ucl','ucl-manchester-united-1999','1990s-b',1999,'彼得·舒梅切尔',95,ARRAY['GK'],'universal'),
('ucl-manchester-united-1999:ryan-giggs','ryan-giggs','ucl','ucl-manchester-united-1999','1990s-b',1999,'瑞恩·吉格斯',92,ARRAY['LW','LM'],'universal'),
('ucl-manchester-united-1999:paul-scholes','paul-scholes','ucl','ucl-manchester-united-1999','1990s-b',1999,'保罗·斯科尔斯',91,ARRAY['CM','CAM'],'universal'),
('ucl-manchester-united-1999:andy-cole','andy-cole','ucl','ucl-manchester-united-1999','1990s-b',1999,'安迪·科尔',90,ARRAY['ST'],'universal'),
('ucl-manchester-united-1999:dwight-yorke','dwight-yorke','ucl','ucl-manchester-united-1999','1990s-b',1999,'德怀特·约克',92,ARRAY['ST','CAM'],'universal'),
('ucl-manchester-united-1999:ole-gunnar-solskjaer','ole-gunnar-solskjaer','ucl','ucl-manchester-united-1999','1990s-b',1999,'奥莱·索尔斯克亚',87,ARRAY['ST','RW'],'universal'),
('ucl-manchester-united-1999:teddy-sheringham','teddy-sheringham','ucl','ucl-manchester-united-1999','1990s-b',1999,'泰迪·谢林汉姆',86,ARRAY['ST','CAM'],'universal'),
('ucl-manchester-united-1999:denis-irwin','denis-irwin','ucl','ucl-manchester-united-1999','1990s-b',1999,'丹尼斯·埃尔文',89,ARRAY['LB','RB'],'universal'),
('ucl-manchester-united-1999:gary-neville','gary-neville','ucl','ucl-manchester-united-1999','1990s-b',1999,'加里·内维尔',86,ARRAY['RB'],'universal'),
('ucl-manchester-united-1999:jaap-stam','jaap-stam','ucl','ucl-manchester-united-1999','1990s-b',1999,'雅普·斯塔姆',93,ARRAY['CB'],'universal'),
('ucl-manchester-united-1999:ronny-johnsen','ronny-johnsen','ucl','ucl-manchester-united-1999','1990s-b',1999,'罗尼·约翰森',86,ARRAY['CB','CDM'],'universal'),
('ucl-manchester-united-1999:nicky-butt','nicky-butt','ucl','ucl-manchester-united-1999','1990s-b',1999,'尼基·巴特',84,ARRAY['CM','CDM'],'universal'),
('ucl-manchester-united-1999:jesper-blomqvist','jesper-blomqvist','ucl','ucl-manchester-united-1999','1990s-b',1999,'耶斯佩·布隆奎斯特',81,ARRAY['LW'],'universal'),
('ucl-manchester-united-1999:phil-neville','phil-neville','ucl','ucl-manchester-united-1999','1990s-b',1999,'菲尔·内维尔',79,ARRAY['LB','RB'],'universal'),
('ucl-manchester-united-1999:wes-brown','wes-brown','ucl','ucl-manchester-united-1999','1990s-b',1999,'韦斯·布朗',76,ARRAY['CB','RB'],'universal'),
('ucl-manchester-united-1999:henning-berg','henning-berg','ucl','ucl-manchester-united-1999','1990s-b',1999,'亨宁·伯格',82,ARRAY['CB','RB'],'universal'),
('ucl-manchester-united-1999:raimond-van-der-gouw','raimond-van-der-gouw','ucl','ucl-manchester-united-1999','1990s-b',1999,'莱蒙德·范德胡',77,ARRAY['GK'],'universal'),
('ucl-manchester-united-1999:jonathan-greening','jonathan-greening','ucl','ucl-manchester-united-1999','1990s-b',1999,'乔纳森·格里宁',70,ARRAY['CM'],'universal'),
('ucl-leverkusen-2002:michael-ballack','michael-ballack','ucl','ucl-leverkusen-2002','2000s-a',2002,'迈克尔·巴拉克',93,ARRAY['CM','CAM'],'universal'),
('ucl-leverkusen-2002:lucio','lucio','ucl','ucl-leverkusen-2002','2000s-a',2002,'卢西奥',91,ARRAY['CB'],'universal'),
('ucl-leverkusen-2002:ze-roberto','ze-roberto','ucl','ucl-leverkusen-2002','2000s-a',2002,'泽·罗伯托',90,ARRAY['LM','CM'],'universal'),
('ucl-leverkusen-2002:bernd-schneider','bernd-schneider','ucl','ucl-leverkusen-2002','2000s-a',2002,'贝恩德·施奈德',89,ARRAY['RM','CM'],'universal'),
('ucl-leverkusen-2002:oliver-neuville','oliver-neuville','ucl','ucl-leverkusen-2002','2000s-a',2002,'奥利弗·诺伊维尔',88,ARRAY['ST'],'universal'),
('ucl-leverkusen-2002:dimitar-berbatov','dimitar-berbatov','ucl','ucl-leverkusen-2002','2000s-a',2002,'迪米塔尔·贝尔巴托夫',82,ARRAY['ST'],'universal'),
('ucl-leverkusen-2002:hans-jorg-butt','hans-jorg-butt','ucl','ucl-leverkusen-2002','2000s-a',2002,'汉斯约尔格·布特',86,ARRAY['GK'],'universal'),
('ucl-leverkusen-2002:frank-juric','frank-juric','ucl','ucl-leverkusen-2002','2000s-a',2002,'弗兰克·尤里奇',73,ARRAY['GK'],'universal'),
('ucl-leverkusen-2002:jens-nowotny','jens-nowotny','ucl','ucl-leverkusen-2002','2000s-a',2002,'延斯·诺沃特尼',88,ARRAY['CB'],'universal'),
('ucl-leverkusen-2002:carsten-ramelow','carsten-ramelow','ucl','ucl-leverkusen-2002','2000s-a',2002,'卡斯滕·拉梅洛',86,ARRAY['CDM','CB'],'universal'),
('ucl-leverkusen-2002:diego-placente','diego-placente','ucl','ucl-leverkusen-2002','2000s-a',2002,'迭戈·普拉森特',83,ARRAY['LB'],'universal'),
('ucl-leverkusen-2002:boris-zivkovic','boris-zivkovic','ucl','ucl-leverkusen-2002','2000s-a',2002,'鲍里斯·日夫科维奇',82,ARRAY['RB','CB'],'universal'),
('ucl-leverkusen-2002:zoltan-sebescen','zoltan-sebescen','ucl','ucl-leverkusen-2002','2000s-a',2002,'佐尔坦·塞贝申',80,ARRAY['RB','RM'],'universal'),
('ucl-leverkusen-2002:thomas-brdaric','thomas-brdaric','ucl','ucl-leverkusen-2002','2000s-a',2002,'托马斯·布尔达里奇',79,ARRAY['ST'],'universal'),
('ucl-leverkusen-2002:ulf-kirsten','ulf-kirsten','ucl','ucl-leverkusen-2002','2000s-a',2002,'乌尔夫·基尔斯滕',85,ARRAY['ST'],'universal'),
('ucl-leverkusen-2002:yildiray-basturk','yildiray-basturk','ucl','ucl-leverkusen-2002','2000s-a',2002,'伊尔迪雷·巴斯图尔克',87,ARRAY['CAM'],'universal'),
('ucl-leverkusen-2002:jurica-vranjes','jurica-vranjes','ucl','ucl-leverkusen-2002','2000s-a',2002,'尤里察·弗拉涅什',75,ARRAY['CM'],'universal'),
('ucl-leverkusen-2002:pascal-ojigwe','pascal-ojigwe','ucl','ucl-leverkusen-2002','2000s-a',2002,'帕斯卡尔·奥吉格韦',73,ARRAY['CDM'],'universal'),
('ucl-porto-2004:deco','deco','ucl','ucl-porto-2004','2000s-a',2004,'德科',94,ARRAY['CAM','CM'],'universal'),
('ucl-porto-2004:ricardo-carvalho','ricardo-carvalho','ucl','ucl-porto-2004','2000s-a',2004,'里卡多·卡瓦略',92,ARRAY['CB'],'universal'),
('ucl-porto-2004:vitor-baia','vitor-baia','ucl','ucl-porto-2004','2000s-a',2004,'维托尔·巴亚',89,ARRAY['GK'],'universal'),
('ucl-porto-2004:paulo-ferreira','paulo-ferreira','ucl','ucl-porto-2004','2000s-a',2004,'保罗·费雷拉',88,ARRAY['RB'],'universal'),
('ucl-porto-2004:nuno-valente','nuno-valente','ucl','ucl-porto-2004','2000s-a',2004,'努诺·瓦伦特',85,ARRAY['LB'],'universal'),
('ucl-porto-2004:jorge-costa','jorge-costa','ucl','ucl-porto-2004','2000s-a',2004,'豪尔赫·科斯塔',88,ARRAY['CB'],'classic-stopper'),
('ucl-porto-2004:costinha','costinha','ucl','ucl-porto-2004','2000s-a',2004,'科斯蒂尼亚',87,ARRAY['CDM'],'universal'),
('ucl-porto-2004:maniche','maniche','ucl','ucl-porto-2004','2000s-a',2004,'马尼切',90,ARRAY['CM'],'universal'),
('ucl-porto-2004:pedro-mendes','pedro-mendes','ucl','ucl-porto-2004','2000s-a',2004,'佩德罗·门德斯',85,ARRAY['CM','CDM'],'universal'),
('ucl-porto-2004:carlos-alberto-gomes','carlos-alberto-gomes','ucl','ucl-porto-2004','2000s-a',2004,'卡洛斯·阿尔贝托·戈麦斯',85,ARRAY['CAM','RW'],'universal'),
('ucl-porto-2004:derlei','derlei','ucl','ucl-porto-2004','2000s-a',2004,'德尔莱',86,ARRAY['ST','LW'],'universal'),
('ucl-porto-2004:benni-mccarthy','benni-mccarthy','ucl','ucl-porto-2004','2000s-a',2004,'本尼·麦卡锡',87,ARRAY['ST'],'universal'),
('ucl-porto-2004:dmitri-alenichev','dmitri-alenichev','ucl','ucl-porto-2004','2000s-a',2004,'德米特里·阿列尼切夫',85,ARRAY['CM','CAM'],'universal'),
('ucl-porto-2004:ricardo-costa','ricardo-costa','ucl','ucl-porto-2004','2000s-a',2004,'里卡多·科斯塔',78,ARRAY['CB'],'universal'),
('ucl-porto-2004:pedro-emanuel','pedro-emanuel','ucl','ucl-porto-2004','2000s-a',2004,'佩德罗·埃马努埃尔',81,ARRAY['CB'],'universal'),
('ucl-porto-2004:jose-bosingwa','jose-bosingwa','ucl','ucl-porto-2004','2000s-a',2004,'何塞·博辛瓦',78,ARRAY['RB','RM'],'universal'),
('ucl-porto-2004:marco-ferreira','marco-ferreira','ucl','ucl-porto-2004','2000s-a',2004,'马尔科·费雷拉',75,ARRAY['RW'],'universal'),
('ucl-porto-2004:edgaras-jankauskas','edgaras-jankauskas','ucl','ucl-porto-2004','2000s-a',2004,'埃德加拉斯·扬考斯卡斯',78,ARRAY['ST'],'universal'),
('ucl-porto-2004:nuno-espirito-santo','nuno-espirito-santo','ucl','ucl-porto-2004','2000s-a',2004,'努诺·桑托',74,ARRAY['GK'],'universal'),
('ucl-porto-2004:sergio-conceicao','sergio-conceicao','ucl','ucl-porto-2004','2000s-a',2004,'塞尔吉奥·孔塞桑',79,ARRAY['RW','RM'],'universal'),
('ucl-milan-2007:kaka','kaka','ucl','ucl-milan-2007','2000s-b',2007,'卡卡',99,ARRAY['CAM','ST'],'universal'),
('ucl-milan-2007:andrea-pirlo','andrea-pirlo','ucl','ucl-milan-2007','2000s-b',2007,'安德烈亚·皮尔洛',94,ARRAY['CM','CDM'],'universal'),
('ucl-milan-2007:alessandro-nesta','alessandro-nesta','ucl','ucl-milan-2007','2000s-b',2007,'亚历山德罗·内斯塔',94,ARRAY['CB'],'universal'),
('ucl-milan-2007:paolo-maldini','paolo-maldini','ucl','ucl-milan-2007','2000s-b',2007,'保罗·马尔蒂尼',92,ARRAY['CB','LB'],'universal'),
('ucl-milan-2007:clarence-seedorf','clarence-seedorf','ucl','ucl-milan-2007','2000s-b',2007,'克拉伦斯·西多夫',92,ARRAY['CM','CAM'],'universal'),
('ucl-milan-2007:gennaro-gattuso','gennaro-gattuso','ucl','ucl-milan-2007','2000s-b',2007,'詹纳罗·加图索',90,ARRAY['CDM','CM'],'universal'),
('ucl-milan-2007:massimo-ambrosini','massimo-ambrosini','ucl','ucl-milan-2007','2000s-b',2007,'马西莫·安布罗西尼',86,ARRAY['CDM','CM'],'universal'),
('ucl-milan-2007:filippo-inzaghi','filippo-inzaghi','ucl','ucl-milan-2007','2000s-b',2007,'菲利波·因扎吉',92,ARRAY['ST'],'universal'),
('ucl-milan-2007:alberto-gilardino','alberto-gilardino','ucl','ucl-milan-2007','2000s-b',2007,'阿尔贝托·吉拉迪诺',83,ARRAY['ST'],'universal'),
('ucl-milan-2007:dida','dida','ucl','ucl-milan-2007','2000s-b',2007,'迪达',89,ARRAY['GK'],'universal'),
('ucl-milan-2007:zeljko-kalac','zeljko-kalac','ucl','ucl-milan-2007','2000s-b',2007,'泽利科·卡拉奇',74,ARRAY['GK'],'universal'),
('ucl-milan-2007:cafu','cafu','ucl','ucl-milan-2007','2000s-b',2007,'卡福',86,ARRAY['RB'],'universal'),
('ucl-milan-2007:massimo-oddo','massimo-oddo','ucl','ucl-milan-2007','2000s-b',2007,'马西莫·奥多',85,ARRAY['RB'],'universal'),
('ucl-milan-2007:marek-jankulovski','marek-jankulovski','ucl','ucl-milan-2007','2000s-b',2007,'马雷克·扬库洛夫斯基',86,ARRAY['LB','LM'],'universal'),
('ucl-milan-2007:serginho','serginho','ucl','ucl-milan-2007','2000s-b',2007,'塞尔吉尼奥',81,ARRAY['LB','LM'],'universal'),
('ucl-milan-2007:kakha-kaladze','kakha-kaladze','ucl','ucl-milan-2007','2000s-b',2007,'卡哈·卡拉泽',83,ARRAY['CB','LB'],'universal'),
('ucl-milan-2007:daniele-bonera','daniele-bonera','ucl','ucl-milan-2007','2000s-b',2007,'达尼埃莱·博内拉',77,ARRAY['CB','RB'],'universal'),
('ucl-milan-2007:cristian-brocchi','cristian-brocchi','ucl','ucl-milan-2007','2000s-b',2007,'克里斯蒂安·布罗基',77,ARRAY['CM'],'universal'),
('ucl-milan-2007:yoann-gourcuff','yoann-gourcuff','ucl','ucl-milan-2007','2000s-b',2007,'约安·古尔库夫',76,ARRAY['CAM'],'universal'),
('ucl-milan-2007:giuseppe-favalli','giuseppe-favalli','ucl','ucl-milan-2007','2000s-b',2007,'朱塞佩·法瓦利',78,ARRAY['LB','CB'],'universal'),
('ucl-barcelona-2009:lionel-messi','lionel-messi','ucl','ucl-barcelona-2009','2000s-b',2009,'利昂内尔·梅西',99,ARRAY['RW','ST','CAM'],'universal'),
('ucl-barcelona-2009:xavi','xavi','ucl','ucl-barcelona-2009','2000s-b',2009,'哈维',96,ARRAY['CM'],'universal'),
('ucl-barcelona-2009:andres-iniesta','andres-iniesta','ucl','ucl-barcelona-2009','2000s-b',2009,'安德烈斯·伊涅斯塔',94,ARRAY['CM','CAM','LW'],'universal'),
('ucl-barcelona-2009:samuel-etoo','samuel-etoo','ucl','ucl-barcelona-2009','2000s-b',2009,'萨穆埃尔·埃托奥',93,ARRAY['ST'],'universal'),
('ucl-barcelona-2009:thierry-henry','thierry-henry','ucl','ucl-barcelona-2009','2000s-b',2009,'蒂埃里·亨利',92,ARRAY['LW','ST'],'universal'),
('ucl-barcelona-2009:sergio-busquets','sergio-busquets','ucl','ucl-barcelona-2009','2000s-b',2009,'塞尔希奥·布斯克茨',86,ARRAY['CDM'],'universal'),
('ucl-barcelona-2009:yaya-toure','yaya-toure','ucl','ucl-barcelona-2009','2000s-b',2009,'亚亚·图雷',89,ARRAY['CDM','CM','CB'],'universal'),
('ucl-barcelona-2009:seydou-keita','seydou-keita','ucl','ucl-barcelona-2009','2000s-b',2009,'赛义杜·凯塔',83,ARRAY['CM'],'universal'),
('ucl-barcelona-2009:carles-puyol','carles-puyol','ucl','ucl-barcelona-2009','2000s-b',2009,'卡莱斯·普约尔',92,ARRAY['CB','RB'],'universal'),
('ucl-barcelona-2009:gerard-pique','gerard-pique','ucl','ucl-barcelona-2009','2000s-b',2009,'杰拉德·皮克',87,ARRAY['CB'],'universal'),
('ucl-barcelona-2009:dani-alves','dani-alves','ucl','ucl-barcelona-2009','2000s-b',2009,'丹尼尔·阿尔维斯',92,ARRAY['RB','RM'],'modern-wingback'),
('ucl-barcelona-2009:eric-abidal','eric-abidal','ucl','ucl-barcelona-2009','2000s-b',2009,'埃里克·阿比达尔',87,ARRAY['LB','CB'],'universal'),
('ucl-barcelona-2009:rafael-marquez','rafael-marquez','ucl','ucl-barcelona-2009','2000s-b',2009,'拉斐尔·马克斯',87,ARRAY['CB','CDM'],'universal'),
('ucl-barcelona-2009:victor-valdes','victor-valdes','ucl','ucl-barcelona-2009','2000s-b',2009,'维克托·巴尔德斯',87,ARRAY['GK'],'universal'),
('ucl-barcelona-2009:jose-manuel-pinto','jose-manuel-pinto','ucl','ucl-barcelona-2009','2000s-b',2009,'何塞·曼努埃尔·平托',74,ARRAY['GK'],'universal'),
('ucl-barcelona-2009:bojan-krkic','bojan-krkic','ucl','ucl-barcelona-2009','2000s-b',2009,'博扬·科尔基奇',77,ARRAY['ST','RW'],'universal'),
('ucl-barcelona-2009:pedro-rodriguez','pedro-rodriguez','ucl','ucl-barcelona-2009','2000s-b',2009,'佩德罗',77,ARRAY['RW','LW'],'universal'),
('ucl-barcelona-2009:alexander-hleb','alexander-hleb','ucl','ucl-barcelona-2009','2000s-b',2009,'亚历山大·赫莱布',77,ARRAY['CAM','RM'],'universal'),
('ucl-barcelona-2009:sylvinho','sylvinho','ucl','ucl-barcelona-2009','2000s-b',2009,'西尔维尼奥',79,ARRAY['LB'],'universal'),
('ucl-barcelona-2009:martin-caceres','martin-caceres','ucl','ucl-barcelona-2009','2000s-b',2009,'马丁·卡塞雷斯',74,ARRAY['CB','RB'],'universal'),
('ucl-schalke-2011:raul','raul','ucl','ucl-schalke-2011','2010s-a',2011,'劳尔',91,ARRAY['ST','CAM'],'universal'),
('ucl-schalke-2011:manuel-neuer','manuel-neuer','ucl','ucl-schalke-2011','2010s-a',2011,'曼努埃尔·诺伊尔',93,ARRAY['GK'],'universal'),
('ucl-schalke-2011:klaas-jan-huntelaar','klaas-jan-huntelaar','ucl','ucl-schalke-2011','2010s-a',2011,'克拉斯扬·亨特拉尔',87,ARRAY['ST'],'universal'),
('ucl-schalke-2011:jefferson-farfan','jefferson-farfan','ucl','ucl-schalke-2011','2010s-a',2011,'杰弗森·法尔范',87,ARRAY['RW','ST'],'universal'),
('ucl-schalke-2011:jose-manuel-jurado','jose-manuel-jurado','ucl','ucl-schalke-2011','2010s-a',2011,'何塞·胡拉多',84,ARRAY['CAM','LM'],'universal'),
('ucl-schalke-2011:benedikt-howedes','benedikt-howedes','ucl','ucl-schalke-2011','2010s-a',2011,'贝内迪克特·赫韦德斯',84,ARRAY['CB','RB'],'universal'),
('ucl-schalke-2011:christoph-metzelder','christoph-metzelder','ucl','ucl-schalke-2011','2010s-a',2011,'克里斯托夫·梅策尔德',81,ARRAY['CB'],'universal'),
('ucl-schalke-2011:atsuto-uchida','atsuto-uchida','ucl','ucl-schalke-2011','2010s-a',2011,'内田笃人',82,ARRAY['RB'],'universal'),
('ucl-schalke-2011:hans-sarpei','hans-sarpei','ucl','ucl-schalke-2011','2010s-a',2011,'汉斯·萨尔佩',77,ARRAY['LB','RB'],'universal'),
('ucl-schalke-2011:joel-matip','joel-matip','ucl','ucl-schalke-2011','2010s-a',2011,'若埃尔·马蒂普',79,ARRAY['CB','CDM'],'universal'),
('ucl-schalke-2011:kyriakos-papadopoulos','kyriakos-papadopoulos','ucl','ucl-schalke-2011','2010s-a',2011,'基里亚科斯·帕帕多普洛斯',79,ARRAY['CB','CDM'],'universal'),
('ucl-schalke-2011:anthony-annan','anthony-annan','ucl','ucl-schalke-2011','2010s-a',2011,'安东尼·安南',77,ARRAY['CDM'],'universal'),
('ucl-schalke-2011:peer-kluge','peer-kluge','ucl','ucl-schalke-2011','2010s-a',2011,'佩尔·克卢格',81,ARRAY['CM','CDM'],'universal'),
('ucl-schalke-2011:alexander-baumjohann','alexander-baumjohann','ucl','ucl-schalke-2011','2010s-a',2011,'亚历山大·鲍姆约翰',78,ARRAY['CAM'],'universal'),
('ucl-schalke-2011:lukas-schmitz','lukas-schmitz','ucl','ucl-schalke-2011','2010s-a',2011,'卢卡斯·施密茨',77,ARRAY['LB','LM'],'universal'),
('ucl-schalke-2011:edu-schalke','edu-schalke','ucl','ucl-schalke-2011','2010s-a',2011,'埃杜',78,ARRAY['ST'],'universal'),
('ucl-schalke-2011:mario-gavranovic','mario-gavranovic','ucl','ucl-schalke-2011','2010s-a',2011,'马里奥·加夫拉诺维奇',75,ARRAY['ST'],'universal'),
('ucl-schalke-2011:sergio-escudero','sergio-escudero','ucl','ucl-schalke-2011','2010s-a',2011,'塞尔吉奥·埃斯库德罗',74,ARRAY['LB'],'universal'),
('ucl-schalke-2011:mathias-schober','mathias-schober','ucl','ucl-schalke-2011','2010s-a',2011,'马蒂亚斯·绍伯',70,ARRAY['GK'],'universal'),
('ucl-chelsea-2012:didier-drogba','didier-drogba','ucl','ucl-chelsea-2012','2010s-a',2012,'迪迪埃·德罗巴',95,ARRAY['ST'],'universal'),
('ucl-chelsea-2012:petr-cech','petr-cech','ucl','ucl-chelsea-2012','2010s-a',2012,'彼得·切赫',94,ARRAY['GK'],'universal'),
('ucl-chelsea-2012:ashley-cole','ashley-cole','ucl','ucl-chelsea-2012','2010s-a',2012,'阿什利·科尔',94,ARRAY['LB'],'universal'),
('ucl-chelsea-2012:frank-lampard','frank-lampard','ucl','ucl-chelsea-2012','2010s-a',2012,'弗兰克·兰帕德',91,ARRAY['CM','CAM'],'universal'),
('ucl-chelsea-2012:juan-mata','juan-mata','ucl','ucl-chelsea-2012','2010s-a',2012,'胡安·马塔',90,ARRAY['CAM','LW'],'universal'),
('ucl-chelsea-2012:john-terry','john-terry','ucl','ucl-chelsea-2012','2010s-a',2012,'约翰·特里',90,ARRAY['CB'],'classic-stopper'),
('ucl-chelsea-2012:branislav-ivanovic','branislav-ivanovic','ucl','ucl-chelsea-2012','2010s-a',2012,'布拉尼斯拉夫·伊万诺维奇',88,ARRAY['RB','CB'],'universal'),
('ucl-chelsea-2012:gary-cahill','gary-cahill','ucl','ucl-chelsea-2012','2010s-a',2012,'加里·卡希尔',85,ARRAY['CB'],'universal'),
('ucl-chelsea-2012:david-luiz','david-luiz','ucl','ucl-chelsea-2012','2010s-a',2012,'大卫·路易斯',85,ARRAY['CB','CDM'],'universal'),
('ucl-chelsea-2012:jose-bosingwa','jose-bosingwa','ucl','ucl-chelsea-2012','2010s-a',2012,'何塞·博辛瓦',82,ARRAY['RB'],'universal'),
('ucl-chelsea-2012:john-obi-mikel','john-obi-mikel','ucl','ucl-chelsea-2012','2010s-a',2012,'约翰·米克尔',86,ARRAY['CDM'],'universal'),
('ucl-chelsea-2012:ramires','ramires','ucl','ucl-chelsea-2012','2010s-a',2012,'拉米雷斯',88,ARRAY['CM','RM'],'universal'),
('ucl-chelsea-2012:raul-meireles','raul-meireles','ucl','ucl-chelsea-2012','2010s-a',2012,'劳尔·梅雷莱斯',84,ARRAY['CM'],'universal'),
('ucl-chelsea-2012:florent-malouda','florent-malouda','ucl','ucl-chelsea-2012','2010s-a',2012,'弗洛朗·马卢达',82,ARRAY['LM','LW'],'universal'),
('ucl-chelsea-2012:salomon-kalou','salomon-kalou','ucl','ucl-chelsea-2012','2010s-a',2012,'萨洛蒙·卡卢',82,ARRAY['LW','ST'],'universal'),
('ucl-chelsea-2012:fernando-torres','fernando-torres','ucl','ucl-chelsea-2012','2010s-a',2012,'费尔南多·托雷斯',84,ARRAY['ST'],'universal'),
('ucl-chelsea-2012:daniel-sturridge','daniel-sturridge','ucl','ucl-chelsea-2012','2010s-a',2012,'丹尼尔·斯图里奇',81,ARRAY['ST','RW'],'universal'),
('ucl-chelsea-2012:ryan-bertrand','ryan-bertrand','ucl','ucl-chelsea-2012','2010s-a',2012,'瑞恩·伯特兰',77,ARRAY['LB','LM'],'universal'),
('ucl-chelsea-2012:michael-essien','michael-essien','ucl','ucl-chelsea-2012','2010s-a',2012,'迈克尔·埃辛',81,ARRAY['CM','CDM'],'universal'),
('ucl-chelsea-2012:ross-turnbull','ross-turnbull','ucl','ucl-chelsea-2012','2010s-a',2012,'罗斯·特恩布尔',70,ARRAY['GK'],'universal'),
('ucl-chelsea-2012:oriol-romeu','oriol-romeu','ucl','ucl-chelsea-2012','2010s-a',2012,'奥里奥尔·罗梅乌',75,ARRAY['CDM'],'universal'),
('ucl-chelsea-2012:paulo-ferreira','paulo-ferreira','ucl','ucl-chelsea-2012','2010s-a',2012,'保罗·费雷拉',74,ARRAY['RB','LB'],'universal'),
('ucl-real-madrid-2017:cristiano-ronaldo','cristiano-ronaldo','ucl','ucl-real-madrid-2017','2010s-b',2017,'克里斯蒂亚诺·罗纳尔多',99,ARRAY['LW','ST'],'universal'),
('ucl-real-madrid-2017:luka-modric','luka-modric','ucl','ucl-real-madrid-2017','2010s-b',2017,'卢卡·莫德里奇',95,ARRAY['CM','CAM'],'universal'),
('ucl-real-madrid-2017:sergio-ramos','sergio-ramos','ucl','ucl-real-madrid-2017','2010s-b',2017,'塞尔希奥·拉莫斯',94,ARRAY['CB'],'universal'),
('ucl-real-madrid-2017:toni-kroos','toni-kroos','ucl','ucl-real-madrid-2017','2010s-b',2017,'托尼·克罗斯',93,ARRAY['CM','CDM'],'universal'),
('ucl-real-madrid-2017:marcelo','marcelo','ucl','ucl-real-madrid-2017','2010s-b',2017,'马塞洛',92,ARRAY['LB','LM'],'modern-wingback'),
('ucl-real-madrid-2017:casemiro','casemiro','ucl','ucl-real-madrid-2017','2010s-b',2017,'卡塞米罗',92,ARRAY['CDM'],'universal'),
('ucl-real-madrid-2017:karim-benzema','karim-benzema','ucl','ucl-real-madrid-2017','2010s-b',2017,'卡里姆·本泽马',91,ARRAY['ST'],'universal'),
('ucl-real-madrid-2017:gareth-bale','gareth-bale','ucl','ucl-real-madrid-2017','2010s-b',2017,'加雷斯·贝尔',90,ARRAY['RW','LW'],'universal'),
('ucl-real-madrid-2017:isco','isco','ucl','ucl-real-madrid-2017','2010s-b',2017,'伊斯科',91,ARRAY['CAM','CM'],'universal'),
('ucl-real-madrid-2017:dani-carvajal','dani-carvajal','ucl','ucl-real-madrid-2017','2010s-b',2017,'丹尼尔·卡瓦哈尔',91,ARRAY['RB'],'universal'),
('ucl-real-madrid-2017:raphael-varane','raphael-varane','ucl','ucl-real-madrid-2017','2010s-b',2017,'拉斐尔·瓦拉内',89,ARRAY['CB'],'universal'),
('ucl-real-madrid-2017:keylor-navas','keylor-navas','ucl','ucl-real-madrid-2017','2010s-b',2017,'凯洛尔·纳瓦斯',90,ARRAY['GK'],'universal'),
('ucl-real-madrid-2017:pepe','pepe','ucl','ucl-real-madrid-2017','2010s-b',2017,'佩佩',86,ARRAY['CB'],'universal'),
('ucl-real-madrid-2017:nacho-fernandez','nacho-fernandez','ucl','ucl-real-madrid-2017','2010s-b',2017,'纳乔',82,ARRAY['CB','LB','RB'],'universal'),
('ucl-real-madrid-2017:mateo-kovacic','mateo-kovacic','ucl','ucl-real-madrid-2017','2010s-b',2017,'马特奥·科瓦契奇',82,ARRAY['CM'],'universal'),
('ucl-real-madrid-2017:james-rodriguez','james-rodriguez','ucl','ucl-real-madrid-2017','2010s-b',2017,'哈梅斯·罗德里格斯',85,ARRAY['CAM','RW'],'universal'),
('ucl-real-madrid-2017:marco-asensio','marco-asensio','ucl','ucl-real-madrid-2017','2010s-b',2017,'马尔科·阿森西奥',82,ARRAY['RW','LW','CAM'],'universal'),
('ucl-real-madrid-2017:lucas-vazquez','lucas-vazquez','ucl','ucl-real-madrid-2017','2010s-b',2017,'卢卡斯·巴斯克斯',80,ARRAY['RW','RM'],'universal'),
('ucl-real-madrid-2017:alvaro-morata','alvaro-morata','ucl','ucl-real-madrid-2017','2010s-b',2017,'阿尔瓦罗·莫拉塔',83,ARRAY['ST'],'universal'),
('ucl-real-madrid-2017:danilo','danilo','ucl','ucl-real-madrid-2017','2010s-b',2017,'达尼洛',76,ARRAY['RB','LB'],'universal'),
('ucl-real-madrid-2017:fabio-coentrao','fabio-coentrao','ucl','ucl-real-madrid-2017','2010s-b',2017,'法比奥·科恩特朗',71,ARRAY['LB'],'universal'),
('ucl-real-madrid-2017:kiko-casilla','kiko-casilla','ucl','ucl-real-madrid-2017','2010s-b',2017,'基科·卡西利亚',73,ARRAY['GK'],'universal'),
('ucl-liverpool-2019:virgil-van-dijk','virgil-van-dijk','ucl','ucl-liverpool-2019','2010s-b',2019,'维吉尔·范戴克',96,ARRAY['CB'],'universal'),
('ucl-liverpool-2019:mohamed-salah','mohamed-salah','ucl','ucl-liverpool-2019','2010s-b',2019,'穆罕默德·萨拉赫',95,ARRAY['RW','ST'],'universal'),
('ucl-liverpool-2019:sadio-mane','sadio-mane','ucl','ucl-liverpool-2019','2010s-b',2019,'萨迪奥·马内',94,ARRAY['LW','LM','ST'],'universal'),
('ucl-liverpool-2019:alisson','alisson','ucl','ucl-liverpool-2019','2010s-b',2019,'阿利松',93,ARRAY['GK'],'universal'),
('ucl-liverpool-2019:roberto-firmino','roberto-firmino','ucl','ucl-liverpool-2019','2010s-b',2019,'罗伯托·菲尔米诺',91,ARRAY['ST','CAM'],'modern-press'),
('ucl-liverpool-2019:trent-alexander-arnold','trent-alexander-arnold','ucl','ucl-liverpool-2019','2010s-b',2019,'特伦特·阿诺德',91,ARRAY['RB'],'modern-wingback'),
('ucl-liverpool-2019:andrew-robertson','andrew-robertson','ucl','ucl-liverpool-2019','2010s-b',2019,'安德鲁·罗伯逊',90,ARRAY['LB'],'modern-wingback'),
('ucl-liverpool-2019:fabinho','fabinho','ucl','ucl-liverpool-2019','2010s-b',2019,'法比尼奥',89,ARRAY['CDM','CB'],'universal'),
('ucl-liverpool-2019:jordan-henderson','jordan-henderson','ucl','ucl-liverpool-2019','2010s-b',2019,'乔丹·亨德森',87,ARRAY['CM','CDM'],'universal'),
('ucl-liverpool-2019:georginio-wijnaldum','georginio-wijnaldum','ucl','ucl-liverpool-2019','2010s-b',2019,'乔治尼奥·维纳尔杜姆',88,ARRAY['CM'],'universal'),
('ucl-liverpool-2019:james-milner','james-milner','ucl','ucl-liverpool-2019','2010s-b',2019,'詹姆斯·米尔纳',85,ARRAY['CM','RM','LB'],'universal'),
('ucl-liverpool-2019:joel-matip','joel-matip','ucl','ucl-liverpool-2019','2010s-b',2019,'若埃尔·马蒂普',87,ARRAY['CB'],'universal'),
('ucl-liverpool-2019:joe-gomez','joe-gomez','ucl','ucl-liverpool-2019','2010s-b',2019,'乔·戈麦斯',83,ARRAY['CB','RB'],'universal'),
('ucl-liverpool-2019:dejan-lovren','dejan-lovren','ucl','ucl-liverpool-2019','2010s-b',2019,'德扬·洛夫伦',80,ARRAY['CB'],'universal'),
('ucl-liverpool-2019:xherdan-shaqiri','xherdan-shaqiri','ucl','ucl-liverpool-2019','2010s-b',2019,'杰尔丹·沙奇里',81,ARRAY['RW','CAM'],'universal'),
('ucl-liverpool-2019:divock-origi','divock-origi','ucl','ucl-liverpool-2019','2010s-b',2019,'迪沃克·奥里吉',83,ARRAY['ST','LW'],'universal'),
('ucl-liverpool-2019:daniel-sturridge','daniel-sturridge','ucl','ucl-liverpool-2019','2010s-b',2019,'丹尼尔·斯图里奇',77,ARRAY['ST'],'universal'),
('ucl-liverpool-2019:adam-lallana','adam-lallana','ucl','ucl-liverpool-2019','2010s-b',2019,'亚当·拉拉纳',77,ARRAY['CAM','CM'],'universal'),
('ucl-liverpool-2019:alberto-moreno','alberto-moreno','ucl','ucl-liverpool-2019','2010s-b',2019,'阿尔贝托·莫雷诺',73,ARRAY['LB'],'universal'),
('ucl-liverpool-2019:simon-mignolet','simon-mignolet','ucl','ucl-liverpool-2019','2010s-b',2019,'西蒙·米尼奥莱',77,ARRAY['GK'],'universal'),
('ucl-liverpool-2019:alex-oxlade-chamberlain','alex-oxlade-chamberlain','ucl','ucl-liverpool-2019','2010s-b',2019,'亚历克斯·张伯伦',74,ARRAY['CM','RW'],'universal'),
('ucl-manchester-city-2023:erling-haaland','erling-haaland','ucl','ucl-manchester-city-2023','2020s',2023,'埃尔林·哈兰德',96,ARRAY['ST'],'universal'),
('ucl-manchester-city-2023:kevin-de-bruyne','kevin-de-bruyne','ucl','ucl-manchester-city-2023','2020s',2023,'凯文·德布劳内',96,ARRAY['CM','CAM'],'universal'),
('ucl-manchester-city-2023:rodri','rodri','ucl','ucl-manchester-city-2023','2020s',2023,'罗德里',95,ARRAY['CDM'],'universal'),
('ucl-manchester-city-2023:bernardo-silva','bernardo-silva','ucl','ucl-manchester-city-2023','2020s',2023,'贝尔纳多·席尔瓦',92,ARRAY['CM','RW','CAM'],'modern-press'),
('ucl-manchester-city-2023:ilkay-gundogan','ilkay-gundogan','ucl','ucl-manchester-city-2023','2020s',2023,'伊尔凯·京多安',92,ARRAY['CM','CDM'],'universal'),
('ucl-manchester-city-2023:ruben-dias','ruben-dias','ucl','ucl-manchester-city-2023','2020s',2023,'鲁本·迪亚斯',92,ARRAY['CB'],'universal'),
('ucl-manchester-city-2023:john-stones','john-stones','ucl','ucl-manchester-city-2023','2020s',2023,'约翰·斯通斯',91,ARRAY['CB','CDM'],'universal'),
('ucl-manchester-city-2023:kyle-walker','kyle-walker','ucl','ucl-manchester-city-2023','2020s',2023,'凯尔·沃克',89,ARRAY['RB','CB'],'universal'),
('ucl-manchester-city-2023:nathan-ake','nathan-ake','ucl','ucl-manchester-city-2023','2020s',2023,'内森·阿克',88,ARRAY['CB','LB'],'universal'),
('ucl-manchester-city-2023:manuel-akanji','manuel-akanji','ucl','ucl-manchester-city-2023','2020s',2023,'曼努埃尔·阿坎吉',87,ARRAY['CB','RB'],'universal'),
('ucl-manchester-city-2023:ederson','ederson','ucl','ucl-manchester-city-2023','2020s',2023,'埃德森',89,ARRAY['GK'],'universal'),
('ucl-manchester-city-2023:jack-grealish','jack-grealish','ucl','ucl-manchester-city-2023','2020s',2023,'杰克·格拉利什',89,ARRAY['LW','CAM'],'universal'),
('ucl-manchester-city-2023:phil-foden','phil-foden','ucl','ucl-manchester-city-2023','2020s',2023,'菲尔·福登',88,ARRAY['LW','RW','CAM'],'universal'),
('ucl-manchester-city-2023:riyad-mahrez','riyad-mahrez','ucl','ucl-manchester-city-2023','2020s',2023,'里亚德·马赫雷斯',88,ARRAY['RW'],'universal'),
('ucl-manchester-city-2023:julian-alvarez','julian-alvarez','ucl','ucl-manchester-city-2023','2020s',2023,'胡利安·阿尔瓦雷斯',84,ARRAY['ST','RW'],'modern-press'),
('ucl-manchester-city-2023:aymeric-laporte','aymeric-laporte','ucl','ucl-manchester-city-2023','2020s',2023,'艾默里克·拉波尔特',83,ARRAY['CB'],'universal'),
('ucl-manchester-city-2023:rico-lewis','rico-lewis','ucl','ucl-manchester-city-2023','2020s',2023,'里科·刘易斯',77,ARRAY['RB','CM'],'universal'),
('ucl-manchester-city-2023:sergio-gomez','sergio-gomez','ucl','ucl-manchester-city-2023','2020s',2023,'塞尔希奥·戈麦斯',73,ARRAY['LB','LM'],'universal'),
('ucl-manchester-city-2023:kalvin-phillips','kalvin-phillips','ucl','ucl-manchester-city-2023','2020s',2023,'卡尔文·菲利普斯',74,ARRAY['CDM'],'universal'),
('ucl-manchester-city-2023:cole-palmer','cole-palmer','ucl','ucl-manchester-city-2023','2020s',2023,'科尔·帕尔默',76,ARRAY['RW','CAM'],'universal'),
('ucl-manchester-city-2023:stefan-ortega','stefan-ortega','ucl','ucl-manchester-city-2023','2020s',2023,'斯特凡·奥尔特加',80,ARRAY['GK'],'universal'),
('ucl-manchester-city-2023:scott-carson','scott-carson','ucl','ucl-manchester-city-2023','2020s',2023,'斯科特·卡森',65,ARRAY['GK'],'universal'),
('ucl-manchester-city-2023:maximo-perrone','maximo-perrone','ucl','ucl-manchester-city-2023','2020s',2023,'马克西莫·佩罗内',67,ARRAY['CDM'],'universal'),
('ucl-dortmund-2024:mats-hummels','mats-hummels','ucl','ucl-dortmund-2024','2020s',2024,'马茨·胡梅尔斯',91,ARRAY['CB'],'universal'),
('ucl-dortmund-2024:gregor-kobel','gregor-kobel','ucl','ucl-dortmund-2024','2020s',2024,'格雷戈尔·科贝尔',91,ARRAY['GK'],'universal'),
('ucl-dortmund-2024:marcel-sabitzer','marcel-sabitzer','ucl','ucl-dortmund-2024','2020s',2024,'马塞尔·萨比策',88,ARRAY['CM','CAM'],'universal'),
('ucl-dortmund-2024:julian-brandt','julian-brandt','ucl','ucl-dortmund-2024','2020s',2024,'尤利安·布兰特',88,ARRAY['CAM','CM'],'universal'),
('ucl-dortmund-2024:nico-schlotterbeck','nico-schlotterbeck','ucl','ucl-dortmund-2024','2020s',2024,'尼科·施洛特贝克',87,ARRAY['CB'],'universal'),
('ucl-dortmund-2024:julian-ryerson','julian-ryerson','ucl','ucl-dortmund-2024','2020s',2024,'尤利安·瑞尔森',84,ARRAY['RB','LB'],'universal'),
('ucl-dortmund-2024:ian-maatsen','ian-maatsen','ucl','ucl-dortmund-2024','2020s',2024,'伊恩·马特森',85,ARRAY['LB'],'universal'),
('ucl-dortmund-2024:emre-can','emre-can','ucl','ucl-dortmund-2024','2020s',2024,'埃姆雷·詹',84,ARRAY['CDM','CB'],'universal'),
('ucl-dortmund-2024:niclas-fullkrug','niclas-fullkrug','ucl','ucl-dortmund-2024','2020s',2024,'尼克拉斯·菲尔克鲁格',86,ARRAY['ST'],'universal'),
('ucl-dortmund-2024:karim-adeyemi','karim-adeyemi','ucl','ucl-dortmund-2024','2020s',2024,'卡里姆·阿德耶米',84,ARRAY['LW','ST'],'universal'),
('ucl-dortmund-2024:jadon-sancho','jadon-sancho','ucl','ucl-dortmund-2024','2020s',2024,'杰登·桑乔',85,ARRAY['RW','LW'],'universal'),
('ucl-dortmund-2024:donyell-malen','donyell-malen','ucl','ucl-dortmund-2024','2020s',2024,'多尼尔·马伦',85,ARRAY['RW','ST'],'universal'),
('ucl-dortmund-2024:marco-reus','marco-reus','ucl','ucl-dortmund-2024','2020s',2024,'马尔科·罗伊斯',84,ARRAY['CAM','LW'],'universal'),
('ucl-dortmund-2024:salih-ozcan','salih-ozcan','ucl','ucl-dortmund-2024','2020s',2024,'萨利赫·厄兹詹',78,ARRAY['CDM'],'universal'),
('ucl-dortmund-2024:felix-nmecha','felix-nmecha','ucl','ucl-dortmund-2024','2020s',2024,'费利克斯·恩梅查',77,ARRAY['CM'],'universal'),
('ucl-dortmund-2024:sebastien-haller','sebastien-haller','ucl','ucl-dortmund-2024','2020s',2024,'塞巴斯蒂安·阿莱',77,ARRAY['ST'],'universal'),
('ucl-dortmund-2024:youssoufa-moukoko','youssoufa-moukoko','ucl','ucl-dortmund-2024','2020s',2024,'优素法·穆科科',75,ARRAY['ST'],'universal'),
('ucl-dortmund-2024:marius-wolf','marius-wolf','ucl','ucl-dortmund-2024','2020s',2024,'马里乌斯·沃尔夫',76,ARRAY['RB','RM'],'universal'),
('ucl-dortmund-2024:niklas-sule','niklas-sule','ucl','ucl-dortmund-2024','2020s',2024,'尼克拉斯·聚勒',81,ARRAY['CB','RB'],'universal'),
('ucl-dortmund-2024:ramy-bensebaini','ramy-bensebaini','ucl','ucl-dortmund-2024','2020s',2024,'拉米·本塞拜尼',78,ARRAY['LB','CB'],'universal'),
('ucl-dortmund-2024:alexander-meyer','alexander-meyer','ucl','ucl-dortmund-2024','2020s',2024,'亚历山大·迈耶',75,ARRAY['GK'],'universal'),
('ucl-dortmund-2024:jamie-bynoe-gittens','jamie-bynoe-gittens','ucl','ucl-dortmund-2024','2020s',2024,'杰米·吉滕斯',76,ARRAY['LW'],'universal')
on conflict(player_key) do update set identity=excluded.identity,mode=excluded.mode,pool_id=excluded.pool_id,era_id=excluded.era_id,year=excluded.year,name=excluded.name,base_rating=excluded.base_rating,positions=excluded.positions,profile=excluded.profile;
insert into public.fc_era_catalog(id,from_year,to_year) values ('1960s',1960,1969),('1970s-a',1970,1974),('1970s-b',1975,1979),('1980s-a',1980,1984),('1980s-b',1985,1989),('1990s-a',1990,1994),('1990s-b',1995,1999),('2000s-a',2000,2004),('2000s-b',2005,2009),('2010s-a',2010,2014),('2010s-b',2015,2019),('2020s',2020,2024) on conflict(id) do update set from_year=excluded.from_year,to_year=excluded.to_year;
insert into public.fc_chemistry_pairs(id,left_identity,right_identity,bonus) values ('madrid-wings','cristiano-ronaldo','gareth-bale',2),('madrid-finishing','cristiano-ronaldo','karim-benzema',2),('bbc-partners','gareth-bale','karim-benzema',2),('madrid-control','luka-modric','toni-kroos',2),('barca-control','xavi','andres-iniesta',2),('barca-right','lionel-messi','dani-alves',2),('brazil-1970','pele','jairzinho',2),('total-football','johan-cruyff','johan-neeskens',2),('argentina-1986','diego-maradona','jorge-burruchaga',2),('milan-balance','andrea-pirlo','gennaro-gattuso',2),('liverpool-wings','mohamed-salah','sadio-mane',2),('argentina-2022','lionel-messi','julian-alvarez',2),('france-midfield','ngolo-kante','paul-pogba',2) on conflict(id) do update set left_identity=excluded.left_identity,right_identity=excluded.right_identity,bonus=excluded.bonus;

create or replace function public.fc_protocol_v3() returns jsonb language sql security definer set search_path=public,pg_temp as $$
 select jsonb_build_object('version',3,'catalog_count',(select count(*) from fc_player_catalog));
$$;
create or replace function public._fc_connect_rules(p_code text,p_mode text,p_rules integer)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare c text; r public.fc_rooms; n integer;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_mode not in ('world_cup','ucl') or p_mode is null then raise exception 'Invalid mode'; end if;
 if p_code is null then
  loop
   c=upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
   insert into fc_rooms(code,mode,owner,rules_version) values(c,p_mode,auth.uid(),p_rules) on conflict do nothing returning * into r;
   exit when found;
  end loop;
 else
  select * into r from fc_rooms where code=upper(trim(p_code)) for update;
  if not found then raise exception 'Room not found'; end if;
  if r.rules_version<>p_rules then raise exception 'FC_RULES_MISMATCH'; end if;
  if r.result is not null then raise exception 'FC_ROOM_FINISHED'; end if;
  select count(*) into n from fc_members where room_code=r.code;
  if n>=2 and not exists(select 1 from fc_members where room_code=r.code and user_id=auth.uid()) then raise exception 'Room is full'; end if;
 end if;
 insert into fc_members(room_code,user_id) values(r.code,auth.uid()) on conflict do nothing;
 return jsonb_build_object('code',r.code,'mode',r.mode,'rules_version',r.rules_version);
end $$;
create or replace function public.fc_connect(p_code text,p_mode text)
returns jsonb language sql security definer set search_path=public,pg_temp as $$ select _fc_connect_rules(p_code,p_mode,2); $$;
create or replace function public.fc_connect_v3(p_code text,p_mode text)
returns jsonb language sql security definer set search_path=public,pg_temp as $$ select _fc_connect_rules(p_code,p_mode,3); $$;

create or replace function public.fc_read_v3(p_code text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; members jsonb; locks jsonb;
begin
 if auth.uid() is null or not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code;
 if r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 select jsonb_agg(jsonb_build_object('host',user_id=r.owner,'is_self',user_id=auth.uid(),'state',state,'revision',revision)) into members from fc_members where room_code=p_code;
 select coalesce(jsonb_agg(jsonb_build_object('player_id',player_key,'mine',user_id=auth.uid())),'[]'::jsonb) into locks from fc_player_locks where room_code=p_code;
 return jsonb_build_object('code',r.code,'mode',r.mode,'members',members,'locks',locks,'result',r.result,'rules_version',3);
end $$;

create or replace function public._fc_effective_rating(p_key text,p_position text,p_target text,p_identities text[])
returns integer language plpgsql stable security definer set search_path=public,pg_temp as $$
declare c public.fc_player_catalog; e public.fc_era_catalog; pos_loss integer; era_loss integer:=0; chemistry integer;
begin
 select * into strict c from fc_player_catalog where player_key=p_key;
 select * into strict e from fc_era_catalog where id=p_target;
 pos_loss=case when p_position='SUB' or p_position=any(c.positions) then 0
  when p_position='GK' or 'GK'=any(c.positions) then 45
  when (p_position=any(array['LW','RW','LM','RM']) and c.positions&&array['LW','RW','LM','RM'])
    or (p_position=any(array['ST','CAM']) and c.positions&&array['ST','CAM'])
    or (p_position=any(array['CM','CDM','CAM']) and c.positions&&array['CM','CDM','CAM'])
    or (p_position=any(array['LB','RB','CB','LWB','RWB']) and c.positions&&array['LB','RB','CB','LWB','RWB']) then 4 else 12 end;
 if c.year between e.from_year and e.to_year or c.identity='virgil-van-dijk' or c.profile='universal' then era_loss=0;
 elsif c.year<1992 and e.from_year>=1995 and c.profile='classic-keeper' then era_loss=3;
 elsif c.year<1995 and e.from_year>=2005 and c.profile in ('classic-stopper','classic-maker') then era_loss=2;
 elsif c.year>=2005 and e.to_year<=1984 and c.profile='modern-wingback' then era_loss=2;
 elsif c.year>=2005 and e.to_year<=1984 and c.profile='modern-press' then era_loss=1;
 end if;
 select least(3,coalesce(sum(bonus),0)) into chemistry from fc_chemistry_pairs
  where (left_identity=c.identity or right_identity=c.identity) and left_identity=any(p_identities) and right_identity=any(p_identities);
 return greatest(15,least(100,c.base_rating+chemistry-pos_loss-era_loss));
end $$;

create or replace function public.fc_submit_v3(p_code text,p_state jsonb,p_revision integer,p_request_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; m public.fc_members; host_state jsonb; v_player jsonb; c public.fc_player_catalog;
 ids text[]; shape text[]; actual_formation text; canonical jsonb:='[]'::jsonb; updated_state jsonb;
 n integer; unique_people integer; new_claims integer; ordinal integer:=0; position text; conflicting text;
 ready integer; a numeric; b numeric; h integer:=0; v integer:=0;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select * into r from fc_rooms where code=p_code for update;
 if not found or r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 select * into m from fc_members where room_code=p_code and user_id=auth.uid();
 if not found then raise exception 'Not a member'; end if;
 if p_request_id is null or p_revision is null then raise exception 'FC_INVALID_REQUEST'; end if;
 if m.last_request_id=p_request_id then return jsonb_build_object('revision',m.revision,'replayed',true,'result',r.result); end if;
 if m.revision<>p_revision then raise exception 'FC_STALE_STATE' using detail=m.revision::text; end if;
 if r.result is not null then raise exception 'FC_ROOM_FINISHED'; end if;
 if pg_column_size(p_state)>200000 or p_state->>'mode' is distinct from r.mode or p_state->>'lockProtocol' is distinct from '3'
   or p_state->>'started' is distinct from 'true' or jsonb_typeof(p_state->'picks') is distinct from 'array' then raise exception 'FC_INVALID_STATE'; end if;
 if jsonb_array_length(p_state->'picks')<>16 or jsonb_typeof(p_state->'excludedEras') is distinct from 'array'
   or not coalesce(p_state->>'drawPhase'=any(array['awaiting','ready','complete']),false) then raise exception 'FC_INVALID_STATE'; end if;
 if not exists(select 1 from fc_era_catalog where id=p_state->>'targetEra') or jsonb_array_length(p_state->'excludedEras')>11
   or exists(select 1 from jsonb_array_elements_text(p_state->'excludedEras') x where not exists(select 1 from fc_era_catalog where id=x)) then raise exception 'FC_INVALID_SETTINGS'; end if;
 if jsonb_typeof(p_state->'rerolls') is distinct from 'number' or (p_state->>'rerolls')::numeric not between 0 and 3
   or (p_state->>'rerolls')::numeric<>trunc((p_state->>'rerolls')::numeric) then raise exception 'FC_INVALID_STATE'; end if;
 actual_formation=coalesce(p_state->>'lineupFormation',p_state->>'formation');
 shape=case actual_formation
  when '4-3-3' then array['LW','ST','RW','CM','CDM','CM','LB','CB','CB','RB','GK']
  when '4-4-2' then array['ST','ST','LM','CM','CM','RM','LB','CB','CB','RB','GK']
  when '4-2-4' then array['LW','ST','ST','RW','CM','CM','LB','CB','CB','RB','GK']
  when '3-5-2' then array['ST','ST','LM','CM','CDM','CM','RM','CB','CB','CB','GK']
  when '4-2-3-1' then array['ST','LW','CAM','RW','CDM','CDM','LB','CB','CB','RB','GK']
  when '4-3-1-2' then array['ST','ST','CAM','CM','CDM','CM','LB','CB','CB','RB','GK']
  when '3-4-1-2' then array['ST','ST','CAM','LWB','CM','CM','RWB','CB','CB','CB','GK'] else null end;
 if shape is null then raise exception 'FC_INVALID_FORMATION'; end if;
 select count(*),count(distinct cat.identity),array_agg(cat.identity) into n,unique_people,ids
  from jsonb_array_elements(p_state->'picks') p left join fc_player_catalog cat on cat.player_key=p->>'id' where p<>'null'::jsonb;
 if n<>unique_people then raise exception 'FC_INVALID_OR_DUPLICATE_PLAYER'; end if;
 if m.state is null and n<>0 then raise exception 'FC_INITIAL_STATE_MUST_BE_EMPTY'; end if;
 if m.state is not null and (m.state->'targetEra' is distinct from p_state->'targetEra' or m.state->'excludedEras' is distinct from p_state->'excludedEras') then raise exception 'FC_SETTINGS_LOCKED'; end if;
 if auth.uid()<>r.owner then
  select state into host_state from fc_members where room_code=p_code and user_id=r.owner;
  if host_state is null or host_state->'targetEra' is distinct from p_state->'targetEra' or host_state->'excludedEras' is distinct from p_state->'excludedEras' then raise exception 'FC_SETTINGS_LOCKED'; end if;
 end if;
 select count(*) into new_claims from jsonb_array_elements(p_state->'picks') p where p<>'null'::jsonb
  and not exists(select 1 from fc_player_locks l where l.room_code=p_code and l.player_key=p->>'id' and l.user_id=auth.uid());
 if new_claims>1 then raise exception 'FC_ONE_PICK_AT_A_TIME'; end if;
 select l.player_key into conflicting from fc_player_locks l where l.room_code=p_code and l.user_id<>auth.uid()
  and exists(select 1 from jsonb_array_elements(p_state->'picks') p where p->>'id'=l.player_key) limit 1;
 if conflicting is not null then raise exception 'FC_PLAYER_LOCKED' using detail=conflicting; end if;
 delete from fc_player_locks l where l.room_code=p_code and l.user_id=auth.uid() and not exists(select 1 from jsonb_array_elements(p_state->'picks') chosen where chosen->>'id'=l.player_key);
 for v_player in select value from jsonb_array_elements(p_state->'picks') loop
  ordinal=ordinal+1;
  if v_player='null'::jsonb then canonical=canonical||jsonb_build_array(null); continue; end if;
  select * into c from fc_player_catalog where player_key=v_player->>'id';
  if not found or c.mode<>r.mode or exists(select 1 from jsonb_array_elements_text(p_state->'excludedEras') x where x=c.era_id) then raise exception 'FC_INVALID_PLAYER_POOL'; end if;
  if not exists(select 1 from fc_player_locks l where l.room_code=p_code and l.player_key=c.player_key and l.user_id=auth.uid()) and c.pool_id is distinct from p_state->>'pool' then raise exception 'FC_INVALID_PLAYER_POOL'; end if;
  position=case when ordinal<=11 then shape[ordinal] else 'SUB' end;
  v_player=v_player||jsonb_build_object('name',c.name,'identity',c.identity,'baseRating',c.base_rating,'rating',_fc_effective_rating(c.player_key,position,p_state->>'targetEra',ids));
  canonical=canonical||jsonb_build_array(v_player);
  insert into fc_player_locks(room_code,player_key,user_id) values(p_code,c.player_key,auth.uid()) on conflict do nothing;
 end loop;
 updated_state=jsonb_set(p_state,'{picks}',canonical);
 update fc_members set state=updated_state,revision=revision+1,last_request_id=p_request_id where room_code=p_code and user_id=auth.uid();
 update fc_rooms set revision=revision+1 where code=p_code;
 select count(*) into ready from fc_members member where member.room_code=p_code and member.state is not null
  and (select count(*) from jsonb_array_elements(member.state->'picks') p where p<>'null'::jsonb)=16;
 if ready=2 then
  select avg((p->>'rating')::numeric) into a from fc_members member,lateral jsonb_array_elements(member.state->'picks') with ordinality x(p,i) where member.room_code=p_code and member.user_id=r.owner and i<=11;
  select avg((p->>'rating')::numeric) into b from fc_members member,lateral jsonb_array_elements(member.state->'picks') with ordinality x(p,i) where member.room_code=p_code and member.user_id<>r.owner and i<=11;
  for i in 1..5 loop
   if random()<greatest(.08,least(.65,.27+(a-b)/70)) then h=h+1; end if;
   if random()<greatest(.08,least(.65,.27+(b-a)/70)) then v=v+1; end if;
  end loop;
  update fc_rooms set result=jsonb_build_object('home',h,'away',v,'penalties',case when h=v then case when random()<a/(a+b) then '房主点球获胜' else '客队点球获胜' end else '' end) where code=p_code;
 end if;
 return jsonb_build_object('revision',m.revision+1,'replayed',false);
end $$;
create or replace function public.fc_submit(p_code text,p_state jsonb)
returns void language plpgsql security definer set search_path=public as $$
declare r public.fc_rooms; a numeric; b numeric; h integer; v integer; ready integer;
begin
 select * into r from fc_rooms where code=p_code for update;
 if r.rules_version=3 then raise exception 'FC_RULES_V3_REQUIRED'; end if;
 if not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 if r.result is not null then return; end if;
 if p_state->>'mode' <> r.mode or jsonb_typeof(p_state->'picks') is distinct from 'array' then raise exception 'Invalid draft'; end if;
 if jsonb_array_length(p_state->'picks')<>16 or (p_state->>'rerolls')::integer not between 0 and 3 or p_state->>'formation' not in ('4-3-3','4-4-2','4-2-4','3-5-2') then raise exception 'Invalid draft'; end if;
 if exists(select 1 from jsonb_array_elements(p_state->'picks') p where p<>'null'::jsonb and ((p->>'rating')::int not between 1 and 100 or p->>'name' is null)) then raise exception 'Invalid player'; end if;
 update fc_members set state=p_state where room_code=p_code and user_id=auth.uid();
 update fc_rooms set revision=revision+1 where code=p_code;
 select count(*) into ready from fc_members m where room_code=p_code and state is not null and (select count(*) from jsonb_array_elements(m.state->'picks') p where p<>'null'::jsonb)=16;
 if ready=2 then
  select avg((p->>'rating')::numeric) into a from fc_members m, lateral jsonb_array_elements(m.state->'picks') with ordinality as x(p,n) where m.room_code=p_code and m.user_id=r.owner and n<=11;
  select avg((p->>'rating')::numeric) into b from fc_members m, lateral jsonb_array_elements(m.state->'picks') with ordinality as x(p,n) where m.room_code=p_code and m.user_id<>r.owner and n<=11;
  h=0; v=0;
  for i in 1..5 loop
   if random()<greatest(.08,least(.65,.27+(a-b)/70)) then h=h+1; end if;
   if random()<greatest(.08,least(.65,.27+(b-a)/70)) then v=v+1; end if;
  end loop;
  update fc_rooms set result=jsonb_build_object('home',h,'away',v,'penalties',case when h=v then case when random()<a/(a+b) then '房主点球获胜' else '客队点球获胜' end else '' end) where code=p_code;
 end if;
end $$;

revoke all on function public._fc_connect_rules(text,text,integer), public._fc_effective_rating(text,text,text,text[]) from public,anon,authenticated;
revoke all on function public.fc_protocol_v3(),public.fc_connect(text,text),public.fc_connect_v3(text,text),public.fc_read_v3(text),public.fc_submit_v3(text,jsonb,integer,uuid) from public,anon;
grant execute on function public.fc_protocol_v3(),public.fc_connect(text,text),public.fc_connect_v3(text,text),public.fc_read_v3(text),public.fc_submit_v3(text,jsonb,integer,uuid) to authenticated;
notify pgrst, 'reload schema';
commit;

-- Requires protocol 3. Included automatically in upgrade-all-v4.sql.
begin;
alter table public.fc_rooms add column if not exists season_v4 jsonb;
create or replace function public.fc_season_v4(p_code text,p_expected integer default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; n integer; cursor_value integer;
begin
 if auth.uid() is null or not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code for update;
 if r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 select count(*) into n from fc_members where room_code=p_code and jsonb_array_length(state->'picks')=16 and not exists(select 1 from jsonb_array_elements(state->'picks') p where p='null'::jsonb);
 if n<>2 then raise exception 'FC_SEASON_WAITING'; end if;
 if r.season_v4 is null then
  r.season_v4=jsonb_build_object('version',4,'seed',floor(random()*2147483647)::bigint,'cursor',0);
 end if;
 cursor_value=(r.season_v4->>'cursor')::integer;
 if p_expected is not null and p_expected=cursor_value and cursor_value<6 then
  r.season_v4=jsonb_set(r.season_v4,'{cursor}',to_jsonb(cursor_value+1));
 end if;
 update fc_rooms set season_v4=r.season_v4 where code=p_code;
 return r.season_v4;
end $$;
revoke all on function public.fc_season_v4(text,integer) from public,anon;
grant execute on function public.fc_season_v4(text,integer) to authenticated;
notify pgrst, 'reload schema';
commit;

-- Shared final clock and atomic, one-click-per-kick shootout progression.
begin;
alter table public.fc_rooms add column if not exists final_v5 jsonb;
create or replace function public.fc_final_v5(p_code text,p_action text default 'read',p_expected integer default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.fc_rooms; now_ms bigint; elapsed bigint; shots integer;
begin
 if auth.uid() is null or not exists(select 1 from fc_members where room_code=p_code and user_id=auth.uid()) then raise exception 'Not a member'; end if;
 select * into r from fc_rooms where code=p_code for update;
 if r.rules_version<>3 then raise exception 'FC_RULES_MISMATCH'; end if;
 if coalesce((r.season_v4->>'cursor')::integer,0)<5 then raise exception 'FC_FINAL_NOT_READY'; end if;
 if p_action not in ('read','start','kick','finish') then raise exception 'FC_FINAL_ACTION'; end if;
 now_ms=floor(extract(epoch from clock_timestamp())*1000)::bigint;
 if p_action='start' and r.final_v5 is null and (r.season_v4->>'cursor')::integer=5 then
  r.final_v5=jsonb_build_object('started_at',now_ms,'kicks',0,'completed',false);
 end if;
 if p_action in ('kick','finish') then
  if r.final_v5 is null then raise exception 'FC_FINAL_NOT_STARTED'; end if;
  elapsed=now_ms-(r.final_v5->>'started_at')::bigint;
  shots=(r.final_v5->>'kicks')::integer;
  if p_action='kick' and not (r.final_v5->>'completed')::boolean then
   if elapsed<10667 then raise exception 'FC_FINAL_TOO_EARLY'; end if;
   if p_expected=shots and shots<220 then r.final_v5=jsonb_set(r.final_v5,'{kicks}',to_jsonb(shots+1)); end if;
  elsif p_action='finish' then
   if elapsed<8000 then raise exception 'FC_FINAL_TOO_EARLY'; end if;
   r.final_v5=jsonb_set(r.final_v5,'{completed}','true'::jsonb);
   r.season_v4=jsonb_set(r.season_v4,'{cursor}','6'::jsonb);
  end if;
 end if;
 update fc_rooms set final_v5=r.final_v5,season_v4=r.season_v4 where code=p_code;
 return jsonb_build_object('live',r.final_v5,'server_now',now_ms);
end $$;
revoke all on function public.fc_final_v5(text,text,integer) from public,anon;
grant execute on function public.fc_final_v5(text,text,integer) to authenticated;
notify pgrst, 'reload schema';
commit;
