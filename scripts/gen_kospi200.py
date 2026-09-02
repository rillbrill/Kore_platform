import json

raw_kospi200 = [
    # 1-20
    ('005930', '삼성전자', 'Samsung Electronics', 'SEC', '반도체 / Tech', 78500, 468.6, 2.45, 2.35),
    ('000660', 'SK하이닉스', 'SK Hynix', 'SKH', '반도체 / Tech', 194200, 141.4, 1.82, 3.85),
    ('373220', 'LG에너지솔루션', 'LG Energy Solution', 'LGES', '2차전지 / 배터리', 382500, 89.5, 0.65, 1.15),
    ('207940', '삼성바이오로직스', 'Samsung Biologics', 'SAMBIO', '바이오 / 헬스케어', 980000, 69.7, 0.00, 0.82),
    ('005380', '현대자동차', 'Hyundai Motor', 'HYU', '자동차 / 모빌리티', 248500, 52.3, 4.85, -0.60),
    ('000270', '기아', 'Kia Corporation', 'KIA', '자동차 / 모빌리티', 104500, 41.8, 5.30, 0.48),
    ('068270', '셀트리온', 'Celltrion', 'CELT', '바이오 / 헬스케어', 198500, 43.1, 0.50, 1.25),
    ('105560', 'KB금융', 'KB Financial Group', 'KB', '금융 / 지주', 84200, 33.8, 3.80, 1.95),
    ('055550', '신한지주', 'Shinhan Financial Group', 'SHIN', '금융 / 지주', 54800, 27.9, 4.20, 1.10),
    ('005490', 'POSCO홀딩스', 'POSCO Holdings', 'POSCO', '철강 / 소재', 362000, 30.6, 2.75, -1.20),
    ('035420', 'NAVER', 'NAVER Corporation', 'NAVR', '인터넷 / IT', 168400, 27.3, 1.10, 0.45),
    ('051910', 'LG화학', 'LG Chem', 'LGC', '화학 / 소재', 324500, 22.9, 3.10, -0.75),
    ('028260', '삼성물산', 'Samsung C&T', 'SAMCT', '금융 / 지주', 142500, 26.2, 1.80, 0.35),
    ('012330', '현대모비스', 'Hyundai Mobis', 'MOBIS', '자동차 / 모빌리티', 234000, 21.8, 1.90, -0.42),
    ('032830', '삼성생명', 'Samsung Life Insurance', 'SAMLS', '금융 / 지주', 94500, 18.9, 3.90, 1.40),
    ('086520', '에코프로비엠', 'EcoPro BM', 'ECOBM', '2차전지 / 배터리', 168000, 16.4, 0.30, 2.10),
    ('006400', '삼성SDI', 'Samsung SDI', 'SDI', '2차전지 / 배터리', 348500, 24.0, 0.30, -0.85),
    ('035720', '카카오', 'Kakao Corp', 'KAKAO', '인터넷 / IT', 37400, 16.6, 0.16, -1.50),
    ('329180', 'HD현대중공업', 'HD Hyundai Heavy Industries', 'HHI', '중공업 / 조선', 188500, 16.7, 0.00, 4.20),
    ('010130', '고려아연', 'Korea Zinc', 'KZINC', '철강 / 소재', 562000, 11.6, 2.70, 0.90),

    # 21-40
    ('003550', 'LG', 'LG Corp', 'LG', '금융 / 지주', 82400, 12.9, 3.80, 0.24),
    ('015760', '한국전력', 'KEPCO', 'KEPCO', '원자력 / 전력', 21400, 13.7, 0.00, -0.46),
    ('033780', 'KT&G', 'KT&G Corporation', 'KTNG', '유통 / 소비재', 98500, 13.2, 5.30, 0.71),
    ('096770', 'SK이노베이션', 'SK Innovation', 'SKINNO', '화학 / 정유', 108500, 10.1, 0.00, -1.35),
    ('086790', '하나금융지주', 'Hana Financial Group', 'HANA', '금융 / 지주', 64500, 18.8, 5.20, 2.05),
    ('316140', '우리금융지주', 'Woori Financial Group', 'WOORI', '금융 / 지주', 15800, 11.8, 6.30, 1.25),
    ('018260', '삼성에스디에스', 'Samsung SDS', 'SAMSDS', '인터넷 / IT', 154200, 11.9, 1.60, 0.65),
    ('011200', 'HMM', 'HMM Co Ltd', 'HMM', '건설 / 운송', 17800, 12.2, 3.90, -0.56),
    ('000810', '삼성화재', 'Samsung Fire & Marine', 'SAMFIRE', '금융 / 지주', 368000, 17.4, 4.35, 1.10),
    ('009150', '삼성전기', 'Samsung Electro-Mechanics', 'SEM', '반도체 / Tech', 148500, 11.1, 1.40, 1.70),
    ('024110', '기업은행', 'Industrial Bank of Korea', 'IBK', '금융 / 지주', 14200, 11.3, 6.80, 0.70),
    ('010950', 'S-Oil', 'S-Oil Corporation', 'SOIL', '화학 / 정유', 68400, 7.7, 4.40, -0.87),
    ('011170', '롯데케미칼', 'Lotte Chemical', 'LOTTEC', '화학 / 소재', 92400, 3.9, 3.80, -2.10),
    ('003670', '포스코퓨처엠', 'POSCO Future M', 'POSFM', '2차전지 / 배터리', 228000, 17.7, 0.18, 1.55),
    ('259960', '크래프톤', 'KRAFTON Inc', 'KRAFT', '인터넷 / 게임', 342000, 16.5, 0.00, 3.15),
    ('034020', '두산에너빌리티', 'Doosan Enerbility', 'DOOSAN', '원자력 / 전력', 19800, 12.6, 0.00, 2.80),
    ('267250', 'HD현대일렉트릭', 'HD Hyundai Electric', 'HDELEC', '원자력 / 전력', 312000, 11.2, 0.35, 5.40),
    ('012450', '한화에어로스페이스', 'Hanwha Aerospace', 'HANAERO', '중공업 / 방산', 302000, 15.3, 0.90, 4.80),
    ('047810', '한국항공우주', 'Korea Aerospace Industries', 'KAI', '중공업 / 방산', 54200, 5.3, 0.95, 1.12),
    ('010060', 'OCI홀딩스', 'OCI Holdings', 'OCI', '화학 / 소재', 88500, 1.7, 3.70, 0.22),

    # 41-60
    ('005830', 'DB손해보험', 'DB Insurance', 'DBINS', '금융 / 지주', 108500, 7.6, 5.10, 1.40),
    ('001040', 'CJ', 'CJ Corporation', 'CJ', '금융 / 지주', 114000, 3.3, 2.60, 0.88),
    ('030200', 'KT', 'KT Corporation', 'KT', '통신 / 미디어', 39800, 10.3, 4.90, 0.50),
    ('017670', 'SK텔레콤', 'SK Telecom', 'SKT', '통신 / 미디어', 55800, 12.1, 6.30, 0.36),
    ('032640', 'LG유플러스', 'LG Uplus', 'LGU', '통신 / 미디어', 9820, 4.3, 6.60, 0.10),
    ('028050', '삼성엔지니어링', 'Samsung E&A', 'SAMEA', '건설 / 중공업', 23400, 4.6, 0.00, -0.64),
    ('006360', 'GS건설', 'GS Engineering & Construction', 'GSCONST', '건설 / 운송', 18400, 1.6, 0.00, -1.20),
    ('000720', '현대건설', 'Hyundai E&C', 'HYUNEC', '건설 / 운송', 31200, 3.5, 1.90, -0.32),
    ('001450', '현대해상', 'Hyundai Marine & Fire', 'HYUNINS', '금융 / 지주', 34800, 3.1, 5.90, 0.87),
    ('004020', '현대제철', 'Hyundai Steel', 'HYUNSTEEL', '철강 / 소재', 28900, 3.9, 3.50, -1.05),
    ('009540', 'HD한국조선해양', 'HD Korea Shipbuilding', 'KSOE', '중공업 / 조선', 178000, 12.6, 0.00, 3.20),
    ('042660', '한화오션', 'Hanwha Ocean', 'HNOCEAN', '중공업 / 조선', 31400, 9.6, 0.00, 2.95),
    ('010140', '삼성중공업', 'Samsung Heavy Industries', 'SHI', '중공업 / 조선', 10200, 9.0, 0.00, 3.55),
    ('012750', '에스원', 'S-1 Corporation', 'S1', '유통 / 소비재', 61800, 2.3, 4.00, 0.16),
    ('008770', '호텔신라', 'Hotel Shilla', 'SHILLA', '유통 / 소비재', 52400, 2.1, 0.38, -0.95),
    ('069960', '현대백화점', 'Hyundai Department Store', 'HYUNDEPT', '유통 / 소비재', 48900, 1.1, 2.70, 0.41),
    ('139480', '이마트', 'E-Mart', 'EMART', '유통 / 소비재', 59400, 1.7, 3.40, -1.15),
    ('004370', '농심', 'Nongshim', 'NONGSHIM', '유통 / 소비재', 398000, 2.4, 1.25, 0.76),
    ('271560', '오리온', 'Orion Corp', 'ORION', '유통 / 소비재', 94500, 3.7, 2.60, 0.53),
    ('097950', 'CJ제일제당', 'CJ CheilJedang', 'CJJEDANG', '유통 / 소비재', 348000, 5.2, 1.60, 0.87),

    # 61-80
    ('005385', '현대차2우B', 'Hyundai Motor 2nd Pref', 'HYU2PB', '자동차 / 모빌리티', 162000, 5.9, 7.40, 0.31),
    ('005935', '삼성전자우', 'Samsung Electronics Pref', 'SECP', '반도체 / Tech', 62400, 51.3, 3.10, 1.80),
    ('036570', '엔씨소프트', 'NCSoft', 'NCSOFT', '인터넷 / 게임', 198000, 4.3, 1.60, -2.45),
    ('251270', '넷마블', 'Netmarble', 'NETMARBLE', '인터넷 / 게임', 56200, 4.8, 0.00, -0.71),
    ('041510', '에스엠', 'SM Entertainment', 'SM', '유통 / 소비재', 68400, 1.6, 1.75, 1.18),
    ('352820', '하이브', 'HYBE Co Ltd', 'HYBE', '유통 / 소비재', 182000, 7.6, 0.38, -1.60),
    ('128940', '한미약품', 'Hanmi Pharmaceutical', 'HANMI', '바이오 / 헬스케어', 294000, 3.8, 0.40, 1.03),
    ('185750', '종근당', 'Chong Kun Dang', 'CKD', '바이오 / 헬스케어', 104500, 1.3, 1.10, 0.48),
    ('000100', '유한양행', 'Yuhan Corporation', 'YUHAN', '바이오 / 헬스케어', 142000, 11.3, 0.35, 4.10),
    ('302440', 'SK바이오사이언스', 'SK Bioscience', 'SKBIO', '바이오 / 헬스케어', 52400, 4.1, 0.00, 0.77),
    ('326030', 'SK바이오팜', 'SK Biopharmaceuticals', 'SKPHARM', '바이오 / 헬스케어', 108000, 8.5, 0.00, 2.37),
    ('112610', '씨에스윈드', 'CS Wind', 'CSWIND', '원자력 / 전력', 48900, 2.1, 1.00, 1.45),
    ('009830', '한화솔루션', 'Hanwha Solutions', 'HANSOL', '화학 / 소재', 24200, 4.1, 1.20, -1.62),
    ('078930', 'GS', 'GS Holdings', 'GS', '금융 / 지주', 46800, 4.3, 5.30, 0.43),
    ('000120', '유진투자증권', 'Eugene Investment', 'EUGENE', '금융 / 지주', 3820, 0.4, 5.20, 0.26),
    ('005940', 'NH투자증권', 'NH Investment & Securities', 'NHINV', '금융 / 지주', 13400, 4.7, 6.00, 1.13),
    ('016360', '삼성증권', 'Samsung Securities', 'SAMSEC', '금융 / 지주', 43800, 3.9, 6.20, 1.39),
    ('039490', '키움증권', 'Kiwoom Securities', 'KIWOOM', '금융 / 지주', 128500, 3.2, 5.40, 1.58),
    ('006800', '미래에셋증권', 'Mirae Asset Securities', 'MIRAE', '금융 / 지주', 8420, 4.8, 4.75, 0.84),
    ('071050', '한국금융지주', 'Korea Investment Holdings', 'KIH', '금융 / 지주', 74200, 4.1, 4.60, 1.23),

    # 81-100
    ('001740', 'SK네트웍스', 'SK Networks', 'SKNET', '유통 / 소비재', 5120, 1.2, 3.90, -0.39),
    ('002790', '아모레G', 'Amorepacific Group', 'AMOREG', '유통 / 소비재', 26400, 2.2, 1.50, 0.38),
    ('090430', '아모레퍼시픽', 'Amorepacific Corp', 'AMORE', '유통 / 소비재', 128500, 7.5, 0.75, 0.78),
    ('051900', 'LG생활건강', 'LG H&H', 'LGHH', '유통 / 소비재', 342000, 5.3, 1.00, -1.15),
    ('021240', '코웨이', 'Coway Co Ltd', 'COWAY', '유통 / 소비재', 64500, 4.8, 3.80, 0.62),
    ('007070', 'GS리테일', 'GS Retail', 'GSRET', '유통 / 소비재', 21400, 2.2, 2.30, -0.46),
    ('026960', '동서', 'Dongsuh Companies', 'DONGSUH', '유통 / 소비재', 18400, 1.8, 3.90, 0.00),
    ('003230', '삼양식품', 'Samyang Foods', 'SAMYANG', '유통 / 소비재', 548000, 4.1, 0.50, 3.79),
    ('282330', 'BGF리테일', 'BGF Retail', 'BGF', '유통 / 소비재', 114000, 2.0, 3.50, 0.18),
    ('001800', '오리온홀딩스', 'Orion Holdings', 'ORIONH', '금융 / 지주', 15200, 1.0, 4.90, 0.33),
    ('004170', '신세계', 'Shinsegae Inc', 'SHINSEGAE', '유통 / 소비재', 158000, 1.5, 2.50, -0.63),
    ('002380', 'KCC', 'KCC Corporation', 'KCC', '화학 / 소재', 289000, 2.6, 2.80, 0.70),
    ('011780', '금호석유', 'Kumho Petrochemical', 'KUMHO', '화학 / 소재', 134000, 3.7, 3.70, -0.74),
    ('014680', '한솔케미칼', 'Hansol Chemical', 'HANSOLC', '화학 / 소재', 178000, 2.0, 1.20, 1.14),
    ('036460', '한국가스공사', 'Korea Gas Corp', 'KOGAS', '원자력 / 전력', 39800, 3.7, 0.00, 2.05),
    ('004990', '롯데지주', 'Lotte Corp', 'LOTTEH', '금융 / 지주', 26400, 2.8, 4.50, 0.00),
    ('004000', '롯데정밀화학', 'Lotte Fine Chemical', 'LOTTEFC', '화학 / 소재', 48500, 1.3, 5.10, -0.61),
    ('010120', 'LS', 'LS Corp', 'LS', '금융 / 지주', 118500, 3.8, 1.80, 1.72),
    ('006260', 'LS ELECTRIC', 'LS Electric', 'LSELEC', '원자력 / 전력', 162000, 4.9, 1.50, 3.85),
    ('229640', 'LS에코에너지', 'LS Eco Energy', 'LSECO', '원자력 / 전력', 34200, 1.1, 0.80, 2.40),

    # 101-120
    ('005850', '에스엘', 'SL Corporation', 'SL', '자동차 / 모빌리티', 38200, 1.8, 2.60, 0.53),
    ('018880', '한온시스템', 'Hanon Systems', 'HANON', '자동차 / 모빌리티', 4120, 2.2, 5.80, -1.20),
    ('204320', '만도', 'HL Mando', 'HLMANDO', '자동차 / 모빌리티', 38400, 1.8, 2.10, 0.79),
    ('011070', 'LG이노텍', 'LG Innotek', 'LGINNO', '반도체 / Tech', 228000, 5.4, 1.80, 1.33),
    ('000990', 'DB하이텍', 'DB HiTek', 'DBHITEK', '반도체 / Tech', 44200, 2.0, 2.90, 2.31),
    ('042700', '한미반도체', 'Hanmi Semiconductor', 'HANMIS', '반도체 / Tech', 118000, 11.4, 0.35, 4.42),
    ('039030', '이오테크닉스', 'EO Technics', 'EOTECH', '반도체 / Tech', 168000, 2.1, 0.75, 1.82),
    ('034220', 'LG디스플레이', 'LG Display', 'LGD', '반도체 / Tech', 10850, 5.2, 0.00, -0.91),
    ('003490', '대한항공', 'Korean Air', 'KAL', '건설 / 운송', 22800, 8.4, 3.30, 0.44),
    ('020560', '아시아나항공', 'Asiana Airlines', 'ASIANA', '건설 / 운송', 10450, 2.3, 0.00, -0.48),
    ('086280', '현대글로비스', 'Hyundai Glovis', 'GLOVIS', '건설 / 운송', 114000, 8.6, 2.90, 0.88),
    ('000150', '두산', 'Doosan Corp', 'DOOSANH', '금융 / 지주', 188000, 3.1, 1.10, 2.17),
    ('241560', '두산밥캣', 'Doosan Bobcat', 'BOBCAT', '중공업 / 방산', 41200, 4.1, 3.80, -0.48),
    ('272210', '한화시스템', 'Hanwha Systems', 'HANSYS', '중공업 / 방산', 18400, 3.5, 1.40, 2.22),
    ('012630', 'HDC', 'HDC Holdings', 'HDC', '금융 / 지주', 6420, 0.4, 3.50, 0.16),
    ('294870', 'HDC현대산업개발', 'HDC Hyundai Development', 'HDCHDC', '건설 / 운송', 18900, 1.2, 2.10, 0.53),
    ('005440', '현대그린푸드', 'Hyundai Green Food', 'HYUNGREEN', '유통 / 소비재', 12400, 0.4, 3.80, 0.00),
    ('005300', '롯데칠성', 'Lotte Chilsung', 'LOTTECHIL', '유통 / 소비재', 128000, 1.2, 2.60, -0.78),
    ('001680', '대상', 'Daesang Corp', 'DAESANG', '유통 / 소비재', 21400, 0.7, 3.70, 0.47),
    ('005610', 'SPC삼립', 'SPC Samlip', 'SPCSAMLIP', '유통 / 소비재', 58400, 0.5, 2.90, 0.17),

    # 121-140
    ('000880', '한화', 'Hanwha Corp', 'HANWHA', '금융 / 지주', 29400, 2.2, 2.60, 0.68),
    ('003410', '쌍용C&E', 'Ssangyong C&E', 'SSANGYONG', '철강 / 소재', 7850, 3.9, 5.60, 0.00),
    ('011790', 'SKC', 'SKC Co Ltd', 'SKC', '화학 / 소재', 114000, 4.3, 0.95, -1.72),
    ('004490', '세방전지', 'Sebang Global Battery', 'SEBANG', '2차전지 / 배터리', 78400, 1.1, 1.80, 0.64),
    ('006120', 'SK디스커버리', 'SK Discovery', 'SKDISC', '금융 / 지주', 38200, 0.7, 4.50, 0.26),
    ('003540', '대신증권', 'Daeshin Securities', 'DAESHIN', '금융 / 지주', 15800, 0.8, 7.60, 0.64),
    ('001510', 'SK증권', 'SK Securities', 'SKSEC', '금융 / 지주', 584, 0.3, 3.10, 0.00),
    ('003520', '영진약품', 'Yungjin Pharm', 'YUNGJIN', '바이오 / 헬스케어', 2140, 0.4, 0.00, -0.46),
    ('009240', '한샘', 'Hanssem Co Ltd', 'HANSSEM', '유통 / 소비재', 52400, 1.2, 3.10, 0.38),
    ('023530', '롯데쇼핑', 'Lotte Shopping', 'LOTTESHOP', '유통 / 소비재', 64200, 1.8, 4.70, -0.62),
    ('007310', '오뚜기', 'Ottogi Corporation', 'OTTOGI', '유통 / 소비재', 398000, 1.5, 2.40, 0.51),
    ('004980', '성신양회', 'Sungshin Cement', 'SUNGSHIN', '철강 / 소재', 8940, 0.2, 2.20, -0.33),
    ('001230', '동국제강', 'Dongkuk Steel', 'DONGKUK', '철강 / 소재', 9450, 0.5, 4.80, -0.53),
    ('460860', '동국홀딩스', 'Dongkuk Holdings', 'DONGKUKH', '금융 / 지주', 8240, 0.2, 3.50, 0.00),
    ('003030', '세아제강', 'SeAH Steel', 'SEAH', '철강 / 소재', 138000, 0.6, 5.10, 0.73),
    ('014820', '동원F&B', 'Dongwon F&B', 'DONGWONFB', '유통 / 소비재', 34200, 0.7, 2.30, 0.29),
    ('004310', '현대약품', 'Hyundai Pharm', 'HYUNPHARM', '바이오 / 헬스케어', 4120, 0.1, 1.10, -0.24),
    ('001520', '동양', 'Tongyang Inc', 'TONGYANG', '건설 / 운송', 980, 0.2, 0.00, 0.00),
    ('003000', '부광약품', 'Bukwang Pharm', 'BUKWANG', '바이오 / 헬스케어', 6420, 0.5, 0.00, 1.10),
    ('002960', '한국쉘석유', 'Korea Shell Oil', 'SHELL', '화학 / 정유', 289000, 0.4, 7.80, 0.35),

    # 141-160
    ('003620', 'KG모빌리티', 'KG Mobility', 'KGM', '자동차 / 모빌리티', 5420, 1.0, 0.00, -1.45),
    ('001790', '대한제당', 'TS Corporation', 'TSCORP', '유통 / 소비재', 2840, 0.3, 3.20, 0.00),
    ('002710', '아주스틸', 'AJU Steel', 'AJUSTEEL', '철강 / 소재', 6420, 0.2, 0.00, -0.62),
    ('001060', 'JW중외제약', 'JW Pharmaceutical', 'JWPHARM', '바이오 / 헬스케어', 29400, 0.7, 1.20, 0.68),
    ('000520', '삼일제약', 'Samil Pharm', 'SAMIL', '바이오 / 헬스케어', 11400, 0.2, 0.00, 1.33),
    ('001530', 'DI동일', 'DI Dongil', 'DIDONGIL', '유통 / 소비재', 18400, 0.5, 1.80, 0.00),
    ('000210', 'DL', 'DL Holdings', 'DL', '금융 / 지주', 46800, 1.0, 3.50, 0.43),
    ('375500', 'DL이앤씨', 'DL E&C', 'DLEC', '건설 / 운송', 34200, 1.3, 2.70, -0.29),
    ('003480', '한진칼', 'Hanjin KAL', 'HANJINKAL', '건설 / 운송', 78500, 5.2, 0.35, 1.29),
    ('002320', '한진', 'Hanjin Transportation', 'HANJIN', '건설 / 운송', 21400, 0.3, 3.10, 0.00),
    ('005070', '코스모화학', 'Cosmo Chemical', 'COSMOCHEM', '2차전지 / 배터리', 28400, 1.1, 0.00, 1.79),
    ('005420', '코스모신소재', 'Cosmo AM&T', 'COSMOAMT', '2차전지 / 배터리', 124000, 3.8, 0.00, 2.14),
    ('006280', '녹십자', 'GC Biopharma', 'GCBIO', '바이오 / 헬스케어', 134000, 1.6, 0.80, 0.75),
    ('005250', '녹십자홀딩스', 'GC Holdings', 'GCHOLD', '금융 / 지주', 14200, 0.7, 2.50, 0.00),
    ('000140', '하이트진로홀딩스', 'Hitejinro Holdings', 'HITEHOLD', '금융 / 지주', 8940, 0.2, 3.80, 0.00),
    ('000080', '하이트진로', 'Hitejinro', 'HITEJINRO', '유통 / 소비재', 20400, 1.4, 4.40, 0.49),
    ('003560', 'IHQ', 'IHQ Inc', 'IHQ', '통신 / 미디어', 840, 0.1, 0.00, 0.00),
    ('001440', '대한전선', 'Taihan Cable', 'TAIHAN', '원자력 / 전력', 13400, 2.2, 0.00, 3.47),
    ('004150', '한솔홀딩스', 'Hansol Holdings', 'HANSOLH', '금융 / 지주', 2840, 0.1, 4.10, 0.00),
    ('002840', '미원상사', 'Miwon Commercial', 'MIWON', '화학 / 소재', 184000, 0.9, 1.90, 0.55),

    # 161-180
    ('003240', '태광산업', 'Taekwang Industrial', 'TAEKWANG', '화학 / 소재', 642000, 0.7, 0.25, -0.46),
    ('001770', '신화실업', 'Shinhwa Silup', 'SHINHWA', '철강 / 소재', 24200, 0.1, 2.10, 0.00),
    ('001140', '국보', 'Kukbo Co Ltd', 'KUKBO', '건설 / 운송', 1240, 0.1, 0.00, 0.00),
    ('002900', 'TYM', 'TYM Corporation', 'TYM', '중공업 / 방산', 4890, 0.3, 2.60, 0.41),
    ('000300', '대유플러스', 'Dayou Plus', 'DAYOU', '자동차 / 모빌리티', 640, 0.1, 0.00, 0.00),
    ('004840', 'DRB동일', 'DRB Dongil', 'DRB', '자동차 / 모빌리티', 4820, 0.1, 2.70, 0.00),
    ('001630', '종근당홀딩스', 'Chong Kun Dang Holdings', 'CKDHOLD', '금융 / 지주', 54200, 0.3, 2.80, 0.37),
    ('000220', '유유제약', 'Yuyu Pharma', 'YUYU', '바이오 / 헬스케어', 5840, 0.1, 2.20, 0.00),
    ('003580', 'HLB글로벌', 'HLB Global', 'HLBGLO', '바이오 / 헬스케어', 5240, 0.4, 0.00, 1.16),
    ('001880', 'DL건설', 'DL Construction', 'DLCONST', '건설 / 운송', 13400, 0.3, 3.80, 0.00),
    ('002170', '삼양통상', 'Samyang International', 'SAMYANGINT', '유통 / 소비재', 54800, 0.2, 3.50, 0.00),
    ('000500', '가온전선', 'Gaon Cable', 'GAON', '원자력 / 전력', 38200, 0.4, 1.80, 2.41),
    ('002200', '수산중공업', 'Soosan Heavy Industries', 'SOOSAN', '중공업 / 방산', 2480, 0.1, 0.00, 0.81),
    ('000390', '삼화페인트', 'Samhwa Paints', 'SAMHWA', '화학 / 소재', 6420, 0.2, 3.10, 0.00),
    ('000970', '한국타이어앤테크놀로지', 'Hankook Tire', 'HANKOOK', '자동차 / 모빌리티', 42800, 5.3, 3.30, 0.71),
    ('024090', '한국앤컴퍼니', 'Hankook & Company', 'HKCOMP', '금융 / 지주', 16200, 1.5, 4.20, 0.31),
    ('004430', '송원산업', 'Songwon Industrial', 'SONGWON', '화학 / 소재', 15800, 0.4, 1.90, -0.63),
    ('001360', '삼성제약', 'Samsung Pharm', 'SAMPHARM', '바이오 / 헬스케어', 1840, 0.1, 0.00, 0.00),
    ('000050', '경방', 'Kyungbang', 'KYUNGBANG', '유통 / 소비재', 8940, 0.2, 2.10, 0.00),
    ('003470', '유안타증권', 'Yuanta Securities Korea', 'YUANTA', '금융 / 지주', 2640, 0.5, 6.40, 0.38),

    # 181-200
    ('001250', 'GS글로벌', 'GS Global', 'GSGLO', '유통 / 소비재', 2840, 0.2, 2.50, 0.00),
    ('000400', '롯데손해보험', 'Lotte Insurance', 'LOTTEINS', '금융 / 지주', 2890, 0.9, 0.00, 0.69),
    ('002240', '고려제강', 'Kiswire Ltd', 'KISWIRE', '철강 / 소재', 21400, 0.5, 2.40, 0.00),
    ('001390', 'KG케미칼', 'KG Chemical', 'KGCHEM', '화학 / 소재', 5840, 0.4, 2.90, -0.34),
    ('000670', '영풍', 'Young Poong Corp', 'YOUNGPOONG', '철강 / 소재', 382000, 0.7, 2.60, 0.26),
    ('001470', '삼부토건', 'Sambu Construction', 'SAMBU', '건설 / 운송', 1240, 0.2, 0.00, -2.36),
    ('002920', '유성기업', 'Yusung Enterprise', 'YUSUNG', '자동차 / 모빌리티', 2840, 0.1, 2.50, 0.00),
    ('000480', '조선내화', 'Chosun Refractories', 'CHOSUN', '철강 / 소재', 18400, 0.2, 3.40, 0.00),
    ('001200', '유진증권', 'Yujin Corp', 'YUJIN', '금융 / 지주', 3420, 0.1, 4.20, 0.00),
    ('000860', '강남제비스코', 'Kangnam Jevisco', 'JEVISCO', '화학 / 소재', 21400, 0.1, 2.80, 0.00),
    ('001070', '대한방직', 'Taihan Textile', 'TAIHANTEX', '유통 / 소비재', 8940, 0.1, 0.00, 0.00),
    ('000240', '한국앤컴퍼니그룹', 'Hankook Group', 'HKGRP', '금융 / 지주', 14800, 0.3, 3.80, 0.00),
    ('002150', '도화엔지니어링', 'Dohwa Engineering', 'DOHWA', '건설 / 운송', 8420, 0.3, 3.20, 0.24),
    ('000180', '성창기업지주', 'Sungchang Enterprise', 'SUNGCHANG', '금융 / 지주', 1840, 0.1, 1.80, 0.00),
    ('001780', '알루코', 'Aluko Co Ltd', 'ALUKO', '철강 / 소재', 2840, 0.3, 1.80, 0.71),
    ('000700', '유수홀딩스', 'Eusu Holdings', 'EUSU', '건설 / 운송', 5840, 0.2, 4.30, 0.00),
    ('001940', 'KISCO홀딩스', 'KISCO Holdings', 'KISCO', '금융 / 지주', 18400, 0.3, 3.80, 0.00),
    ('002350', '넥센타이어', 'Nexen Tire', 'NEXEN', '자동차 / 모빌리티', 7850, 0.8, 2.80, 0.26),
    ('000590', 'CS홀딩스', 'CS Holdings', 'CSHOLD', '금융 / 지주', 54200, 0.1, 2.50, 0.00),
    ('001420', '태원물산', 'Taewon Mulsan', 'TAEWON', '건설 / 운송', 2840, 0.1, 0.00, 0.00)
]

output_lines = [
    'import { Security } from "@/types/domain";',
    '',
    'export const FX_RATE_USD_KRW = 1380.30;',
    '',
    'export const MOCK_SECURITIES: Security[] = ['
]

for idx, item in enumerate(raw_kospi200):
    code, name, name_en, symbol, sector, krw, cap_trill, div_yield, change = item
    sec_id = f"99{idx+1:04d}"
    usd_price = round(krw / 1380.30, 2)
    change_amt = round(krw * (change / 100))
    cap_usd_val = round(cap_trill * 1000 / 1.3803, 1)
    cap_usd = f"${cap_usd_val}B" if cap_usd_val >= 1 else f"${round(cap_usd_val*1000)}M"
    cap_krw = f"{cap_trill}조원" if cap_trill >= 1 else f"{int(cap_trill*10000)}억원"
    vol_usd = f"${round(max(0.8, cap_trill * 0.08), 1)}M"
    
    div_per_share = round(krw * (div_yield / 100) / 4)
    isin = f"KR7{code}000"
    
    output_lines.append('  {')
    output_lines.append(f'    id: "{sec_id}",')
    output_lines.append(f'    krxCode: "{code}",')
    output_lines.append(f'    isin: "{isin}",')
    output_lines.append(f'    name: "{name} 주식 수탁권리",')
    output_lines.append(f'    nameEn: "{name_en} Custodial Rights",')
    output_lines.append(f'    symbol: "{symbol}",')
    output_lines.append(f'    category: "EQUITY",')
    output_lines.append(f'    krwPrice: {krw},')
    output_lines.append(f'    usdPrice: {usd_price},')
    output_lines.append(f'    change24h: {change},')
    output_lines.append(f'    change24hAmount: {change_amt},')
    output_lines.append(f'    fxRate: FX_RATE_USD_KRW,')
    output_lines.append(f'    marketCapKrw: "{cap_krw}",')
    output_lines.append(f'    marketCapUsd: "{cap_usd}",')
    output_lines.append(f'    volume24hUsd: "{vol_usd}",')
    output_lines.append(f'    status: "TRADING_ACTIVE",')
    output_lines.append(f'    primaryEligible: true,')
    output_lines.append(f'    secondary247Eligible: true,')
    output_lines.append(f'    redemptionEligible: true,')
    output_lines.append(f'    underlyingSharesCustodied: {int(cap_trill * 100000)},')
    output_lines.append(f'    tokenSupply: {int(cap_trill * 100000)},')
    output_lines.append(f'    custodianBank: "국내 공인 수탁은행 및 상임대리인",')
    output_lines.append(f'    brokerExecutionDesk: "국내 인가 주문집행 증권사",')
    output_lines.append(f'    contractAddress: "0x3841...{idx+1:04d}",')
    output_lines.append(f'    ksdOmnibusAccountId: "KSD-OMNI-VAULT-01",')
    output_lines.append(f'    dividendYield: {div_yield},')
    output_lines.append(f'    nextDividendDate: "2026-09-30",')
    output_lines.append(f'    dividendPerShareKrw: {div_per_share},')
    output_lines.append(f'    spreadBps: 12,')
    output_lines.append(f'    riskRating: "MODERATE",')
    output_lines.append(f'    description: "KOSPI 200 구성 종목인 {name} 보통주를 1:1 수탁한 해외 인가 증권사 고객계좌 기반 주식 수탁권리입니다. 24/7 즉시 매매 및 분기 배당금 USD 수령을 지원합니다.",')
    output_lines.append('    ownershipStructure: {')
    output_lines.append(f'      underlyingAsset: "{name}(주) 보통주 (KRX: {code} / ISIN: {isin})",')
    output_lines.append('      custodyArrangement: "한국예탁결제원(KSD) 외국인통합계좌 내 공인 신탁사 1:1 보관",')
    output_lines.append('      legalEntitlement: "인가 해외 증권사 고객계좌부에 기입된 1:1 주식 수탁권리",')
    output_lines.append('      transferRestriction: "KYC 검증된 적격 투자자 계좌 간 24/7 거래",')
    output_lines.append('      bankruptcyRemoteness: "자본시장법 및 신탁법에 따른 도산격리(Bankruptcy-Remote) 구조",')
    output_lines.append('      regulatorRegistration: "금융당국 가이드라인 준수 계좌",')
    output_lines.append('    },')
    output_lines.append(f'    tags: ["KOSPI 200", "{sector}", "24/7 거래", "USD 결제"],')
    output_lines.append('  },')

output_lines.append('];')

with open('data/mock-securities.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines) + '\n')

print('data/mock-securities.ts generated successfully with 200 KOSPI constituent stocks!')
