/**
 * Compare. — Données produits, catégories, retailers
 * Généré depuis compare-v10-app
 */

export const CATS = [
  { id: "smartphones", name: "Smartphones", c: "#2D6A4F", icon: "smartphone" },
  { id: "tablettes", name: "Tablettes", c: "#2D6A4F", icon: "tablet" },
  { id: "ordinateurs", name: "Ordinateurs", c: "#2D6A4F", icon: "laptop" },
  { id: "electromenager", name: "Électroménager", c: "#2D6A4F", icon: "washer" },
  { id: "tv", name: "TV & Écrans", c: "#2D6A4F", icon: "tv" },
  { id: "consoles", name: "Consoles & Gaming", c: "#2D6A4F", icon: "gamepad" },
  { id: "audio", name: "Audio & Hi-Fi", c: "#2D6A4F", icon: "headphones" },
  { id: "photo", name: "Photo & Vidéo", c: "#2D6A4F", icon: "camera" },
  { id: "plomberie", name: "Plomberie & Sanitaire", c: "#2D6A4F", icon: "shower" },
  { id: "chauffage", name: "Chauffage & Clim", c: "#2D6A4F", icon: "flame" },
  { id: "jardin", name: "Jardin & Extérieur", c: "#2D6A4F", icon: "leaf" },
  { id: "velo", name: "Vélos & Trottinettes", c: "#2D6A4F", icon: "bike" },
  { id: "montres", name: "Montres & Connectés", c: "#2D6A4F", icon: "watch" },
];

/** Catégories avec pages précises (modèle par modèle) — tech / high-tech */
export const PAGES_PRECISES = ["smartphones", "tablettes", "ordinateurs", "tv", "consoles", "audio", "photo", "montres", "velo"];

/** Catégories avec pages générales (type ou panne) — maison / habitat */
export const PAGES_GENERALES = ["electromenager", "plomberie", "chauffage", "jardin"];

/** Catégories exclues (faible valeur décisionnelle) */
export const EXCLUDED_CATS = ["cuisine", "mobilier"];

export const PTYPES = {
  smartphones: ["Smartphone"],
  tablettes: ["Tablette"],
  ordinateurs: ["PC Portable", "PC Bureau", "All-in-One"],
  electromenager: ["Lave-linge", "Lave-vaisselle", "Sèche-linge", "Réfrigérateur", "Congélateur", "Four", "Four encastrable", "Micro-ondes", "Aspirateur balai", "Aspirateur robot", "Robot cuisine", "Cafetière expresso", "Machine à café", "Plaque induction", "Plaque vitrocéramique", "Plaque gaz", "Hotte aspirante", "Cuisinière mixte"],
  tv: ["Téléviseur", "Moniteur PC", "Vidéoprojecteur", "Barre de son"],
  consoles: ["Console de salon", "Console portable", "Manette", "Casque gaming"],
  audio: ["Écouteurs sans fil", "Casque audio", "Enceinte Bluetooth", "Enceinte connectée", "Platine vinyle"],
  photo: ["Appareil photo hybride", "Appareil photo compact", "Caméra action", "Drone"],
  plomberie: ["Robinet / Mitigeur", "WC / Toilettes", "Chauffe-eau", "Ballon thermodynamique", "Colonne de douche"],
  chauffage: ["Chaudière gaz", "Pompe à chaleur", "Radiateur électrique", "Climatiseur", "Thermostat connecté"],
  jardin: ["Tondeuse", "Tondeuse robot", "Taille-haie", "Nettoyeur haute pression"],
  velo: ["Vélo électrique", "VTT", "Trottinette électrique"],
  montres: ["Montre connectée", "Bracelet connecté"],
};

export const RAW = {
  smartphones: {
    Smartphone: [
      "Apple|iPhone 16 Pro Max|2024|1479","Apple|iPhone 16 Pro|2024|1229","Apple|iPhone 16|2024|969","Apple|iPhone 16 Plus|2024|1119",
      "Apple|iPhone 15 Pro Max|2023|1449","Apple|iPhone 15 Pro|2023|1199","Apple|iPhone 15|2023|969","Apple|iPhone 15 Plus|2023|1069",
      "Apple|iPhone 14 Pro Max|2022|1399","Apple|iPhone 14 Pro|2022|1179","Apple|iPhone 14|2022|869","Apple|iPhone 13|2021|769",
      "Apple|iPhone 12|2020|689","Apple|iPhone 11|2019|589","Apple|iPhone SE 2022|2022|529","Apple|iPhone XR|2018|489",
      "Samsung|Galaxy S25 Ultra|2025|1459","Samsung|Galaxy S25+|2025|1169","Samsung|Galaxy S25|2025|899",
      "Samsung|Galaxy S24 Ultra|2024|1419","Samsung|Galaxy S24|2024|899","Samsung|Galaxy S23|2023|799",
      "Samsung|Galaxy S22|2022|749","Samsung|Galaxy A55|2024|479","Samsung|Galaxy A54|2023|449","Samsung|Galaxy A35|2024|349",
      "Samsung|Galaxy A25|2024|249","Samsung|Galaxy A15|2024|179","Samsung|Galaxy Z Flip 6|2024|1199","Samsung|Galaxy Z Fold 6|2024|1899",
      "Google|Pixel 9 Pro XL|2024|1179","Google|Pixel 9 Pro|2024|1099","Google|Pixel 9|2024|899","Google|Pixel 8 Pro|2023|899","Google|Pixel 8a|2024|549","Google|Pixel 8|2023|699",
      "Xiaomi|Xiaomi 14 Ultra|2024|1299","Xiaomi|Xiaomi 14|2024|799","Xiaomi|Redmi Note 13 Pro|2024|349","Xiaomi|Redmi Note 13|2024|249","Xiaomi|Poco F6 Pro|2024|499","Xiaomi|Poco X6|2024|299",
      "OnePlus|OnePlus 12|2024|919","OnePlus|OnePlus Nord 4|2024|399","OnePlus|OnePlus Nord CE 4|2024|329",
      "Huawei|P60 Pro|2023|1099","Huawei|Mate 60 Pro|2023|1199","Huawei|Nova 12|2024|449",
      "Oppo|Find X7 Ultra|2024|1299","Oppo|Reno 12 Pro|2024|499","Oppo|A79|2024|249",
      "Nothing|Phone 2|2023|599","Nothing|Phone 1|2022|449",
      "Motorola|Edge 50 Pro|2024|599","Motorola|Moto G84|2024|299",
      "Honor|Magic 6 Pro|2024|999","Honor|Magic V2|2024|1799","Honor|X8b|2024|229",
      "Realme|GT 5 Pro|2024|599","Realme|12 Pro+|2024|399",
    ],
  },
  tablettes: {
    Tablette: [
      "Apple|iPad Pro M4 13\"|2024|1599","Apple|iPad Pro M4 11\"|2024|1299","Apple|iPad Air M2|2024|799","Apple|iPad 10e gen.|2022|589","Apple|iPad Mini 7|2024|659","Apple|iPad 9e gen.|2021|389",
      "Samsung|Galaxy Tab S10 Ultra|2024|1179","Samsung|Galaxy Tab S9 FE|2023|449","Samsung|Galaxy Tab S9|2023|799","Samsung|Galaxy Tab A9+|2023|299","Samsung|Galaxy Tab A9|2023|199",
      "Xiaomi|Pad 6|2023|379","Xiaomi|Redmi Pad SE|2023|199",
      "Lenovo|Tab P12|2023|349","Lenovo|Tab M11|2024|199",
      "Huawei|MatePad 11.5|2023|399","Huawei|MatePad SE|2023|229",
      "Amazon|Fire HD 10|2023|149","Amazon|Fire HD 8|2022|99",
    ],
  },
  ordinateurs: {
    "PC Portable": [
      "Apple|MacBook Air M3 15\"|2024|1499","Apple|MacBook Air M3 13\"|2024|1299","Apple|MacBook Air M2|2022|1199","Apple|MacBook Air M1|2020|999",
      "Apple|MacBook Pro 16\" M3 Max|2023|3999","Apple|MacBook Pro 14\" M3 Pro|2023|2399","Apple|MacBook Pro 14\" M3|2023|1999",
      "Dell|XPS 16|2024|1799","Dell|XPS 15|2024|1599","Dell|XPS 13|2024|1199","Dell|Inspiron 16|2024|749","Dell|Inspiron 15|2024|599","Dell|Latitude 7440|2024|1599",
      "Lenovo|ThinkPad X1 Carbon G12|2024|1699","Lenovo|ThinkPad T14s|2024|1299","Lenovo|IdeaPad Slim 5|2024|699","Lenovo|Yoga 9i|2024|1599","Lenovo|Legion Pro 5|2024|1899",
      "HP|Spectre x360 16|2024|1649","HP|Spectre x360 14|2024|1449","HP|Pavilion Plus 16|2024|899","HP|Pavilion 15|2024|699","HP|EliteBook 840 G11|2024|1499",
      "Asus|ZenBook 14 OLED|2024|999","Asus|ROG Zephyrus G16|2024|2199","Asus|VivoBook 16|2024|599","Asus|TUF Gaming A15|2024|999",
      "Acer|Swift Go 14|2024|849","Acer|Aspire 5|2024|599","Acer|Nitro V 16|2024|1099",
      "Microsoft|Surface Laptop 6|2024|1199","Microsoft|Surface Pro 11|2024|1199",
      "Huawei|MateBook X Pro|2024|1699","Huawei|MateBook 14|2024|899",
    ],
    "PC Bureau": [
      "Dell|OptiPlex 7020|2024|899","HP|ProDesk 400 G7|2024|799","Lenovo|ThinkCentre M75q|2024|699",
    ],
    "All-in-One": [
      "Apple|iMac M3 24\"|2023|1599","Apple|iMac M1 24\"|2021|1299","HP|Envy 34|2024|1799","Lenovo|IdeaCentre AIO 5i|2024|999",
    ],
  },
  electromenager: {
    "Lave-linge": [
      "Bosch|Série 6 WGG24400|2023|649","Bosch|Série 8 WAX32E41|2023|899","Bosch|Série 4 WAN28241|2023|479",
      "Samsung|EcoBubble WW90T|2023|549","Samsung|WW11BBA046AW|2023|699","Samsung|WW80AGAS21AE|2023|449",
      "LG|AI DD F14R33|2023|599","LG|F94V33WHS|2023|499",
      "Miele|WSD 163 WCS|2023|1149","Miele|WCD 330 WCS|2023|1349",
      "Whirlpool|FreshCare+ FFB8248|2023|449","Whirlpool|FFBS 9458 WV|2023|529",
      "Siemens|iQ500 WG44G2F20|2023|629","Siemens|iQ700 WG54B2030|2023|849",
      "Electrolux|PerfectCare 700|2023|579","Electrolux|PerfectCare 900|2023|849",
      "Candy|Smart Pro CO 14105TE|2023|349","Indesit|BWE 101684X W|2023|379","Haier|HW100-B14959U1|2023|449","Beko|WUE 6512 PAR|2023|329",
    ],
    "Lave-vaisselle": [
      "Bosch|Série 4 SMV4HAX48E|2023|549","Bosch|Série 6 SMS6ZCI48E|2023|749","Bosch|Série 2 SMS2ITW41E|2023|449",
      "Miele|G 5210 SCi|2023|999","Miele|G 7310 SCi|2023|1349",
      "Siemens|iQ500 SN65ZX49CE|2023|699","Siemens|iQ300 SN63HX60CE|2023|549",
      "Whirlpool|WFC 3C42P|2023|449","Samsung|DW60M6040BB|2023|529",
      "Electrolux|EEM48320L|2023|599","LG|DF325FPS|2023|649","Beko|BDFN26430W|2023|399",
    ],
    "Sèche-linge": [
      "Bosch|Série 6 WTR85V08|2023|599","Bosch|Série 8 WTX87M90|2023|899",
      "Samsung|DV80TA020AE|2023|549","Miele|TED 455 WP|2023|1099",
      "Whirlpool|FFT M11 8X3B|2023|499","Siemens|WT45HVA1|2023|699","Electrolux|PerfectCare|2023|579",
    ],
    "Réfrigérateur": [
      "Samsung|RB34T602ESA|2023|799","Samsung|RF65A967ESR|2023|2499","Samsung|RB38C605DSA|2023|899",
      "LG|GBP62PZNBC|2023|849","LG|GSXV90MCDE|2023|2199",
      "Bosch|KGN39VLCT|2023|749","Bosch|KGN56XLEB|2023|899",
      "Liebherr|CNsfd 5723|2023|999","Liebherr|CBNsfc 572i|2023|1399",
      "Whirlpool|W7X 93A OX|2023|699","Beko|RCNA406K40DSN|2023|549","Haier|HB20FPAAA|2023|799",
    ],
    "Four": [
      "Bosch|Série 6 HBA5570S0|2023|549","Bosch|Série 8 HBG676ES6|2023|799",
      "Siemens|iQ500 HB578A0S6|2023|649","Samsung|NV75N5671RS|2023|599",
      "Whirlpool|W7 OM4 4S1 P|2023|499","De Dietrich|DOP7340X|2023|699",
      "Electrolux|EOF6P46X|2023|549","Miele|H 7164 BP|2023|1199",
    ],
    "Aspirateur balai": [
      "Dyson|V15 Detect Absolute|2023|699","Dyson|V12 Slim|2023|499","Dyson|V11 Absolute|2022|549","Dyson|V8 Absolute|2020|349",
      "Rowenta|X-Force Flex 14.60|2023|549","Rowenta|Air Force Flex 760|2023|399",
      "Samsung|Bespoke Jet AI|2024|899","Samsung|Jet 75|2023|449",
      "Shark|Detect Pro|2024|499","Miele|Triflex HX2|2023|649",
      "Bosch|Unlimited 7|2023|449","Xiaomi|G11|2023|299",
    ],
    "Aspirateur robot": [
      "iRobot|Roomba j9+|2023|899","iRobot|Roomba i5+|2023|549","iRobot|Roomba Combo j7+|2023|799",
      "Roborock|S8 Pro Ultra|2023|1199","Roborock|S7 MaxV Ultra|2022|899","Roborock|Q Revo|2023|649",
      "Ecovacs|Deebot X2 Omni|2023|999","Ecovacs|Deebot T20 Omni|2023|849",
      "Xiaomi|Robot Vacuum X10+|2023|599","Dreame|L20 Ultra|2024|899","Samsung|Jet Bot AI+|2023|1299",
    ],
    "Robot cuisine": [
      "Vorwerk|Thermomix TM6|2019|1399","Vorwerk|Thermomix TM5|2014|999",
      "Magimix|Cook Expert|2023|899","Moulinex|Companion XL|2023|599","Moulinex|Cookeo Touch WiFi|2023|379",
      "KitchenAid|Artisan 5KSM175|2023|649","Bosch|OptiMUM MUM9BX5S65|2023|549",
    ],
    "Cafetière expresso": [
      "De'Longhi|Magnifica S ECAM|2023|399","De'Longhi|Dinamica Plus|2023|799","De'Longhi|Magnifica Evo|2023|499",
      "Jura|E8 2024|2024|1299","Jura|D4|2023|699",
      "Sage|Barista Express|2023|599","Sage|Barista Pro|2023|799",
      "Krups|Evidence Eco EA897B|2023|499","Philips|Série 3200 LatteGo|2023|449",
    ],
    "Machine à café": [
      "Nespresso|Vertuo Next|2023|149","Nespresso|Vertuo Pop|2023|99","Nespresso|Pixie|2023|129",
      "Tassimo|My Way 2|2023|79","Dolce Gusto|Genio S Touch|2023|89",
    ],
    "Plaque induction": [
      "Bosch|PXE651FC1E|2023|599","Bosch|PIE631FB1E|2023|449","Siemens|EX675LYC1E|2023|699",
      "Sauter|SPI4664B|2023|549","Samsung|NZ64T3706AK|2023|499","De Dietrich|DPI7686XS|2023|799","Whirlpool|WB S2560 NE|2023|449",
    ],
    "Plaque vitrocéramique": [
      "Bosch|PKE611D17E|2023|349","Bosch|PKN645BA2E|2023|399",
      "Whirlpool|AKT 8090 NE|2023|279","Candy|CH64CCB|2023|199","Beko|HIC64502T|2023|249",
    ],
    "Micro-ondes": [
      "Samsung|MC28A5145VK|2023|189","Samsung|MS23T5018AK|2023|129",
      "Whirlpool|MWP 303 SB|2023|169","LG|MH6535GIS|2023|179","Sharp|R-374KM|2023|149",
    ],
    "Hotte aspirante": [
      "Bosch|DWB97FM50|2023|399","Siemens|LC97BHM50|2023|449",
      "Falmec|DERA 90cm|2023|549","Elica|Hidden 60cm|2023|399","Whirlpool|WHBS 93 F LE X|2023|349",
    ],
    "Four encastrable": [
      "Bosch|HBA5570S0|2023|549","Bosch|HBG676ES6|2023|799","Siemens|HB578A0S6|2023|649",
      "Samsung|NV75N5671RS|2023|599","Whirlpool|W7 OM4 4S1 P|2023|499","Miele|H 7164 BP|2023|1199",
    ],
    "Cuisinière mixte": [
      "De Dietrich|DCI 399 XE1|2023|799","Electrolux|EKM66980OK|2023|699",
      "Beko|FSE63310DW|2023|449","Faure|FCM6560PW|2023|399",
    ],
  },
  tv: {
    "Téléviseur": [
      "Samsung|QLED 55\" Q60D|2024|699","Samsung|QLED 65\" Q80D|2024|1199","Samsung|Neo QLED 65\" QN90D|2024|1799",
      "Samsung|OLED 55\" S90D|2024|1399","Samsung|The Frame 55\"|2024|999","Samsung|Crystal 55\" CU7170|2024|449",
      "LG|OLED 55\" C4|2024|1499","LG|OLED 65\" C4|2024|1999","LG|OLED 55\" B4|2024|1099",
      "LG|OLED 65\" G4|2024|2499","LG|NanoCell 55\" NANO81|2024|549",
      "Sony|Bravia XR A80L 55\"|2023|1499","Sony|Bravia 7 K-55XR70|2024|1499","Sony|Bravia 8 55\" OLED|2024|1699",
      "TCL|55\" C835 Mini LED|2023|599","TCL|65\" C845 Mini LED|2023|849","TCL|55\" C645|2023|399",
      "Hisense|55\" U8HQ Mini LED|2023|649","Hisense|65\" U7KQ|2023|749","Hisense|55\" A6K|2023|349",
      "Philips|55\" OLED 808 Ambilight|2023|1199","Philips|65\" PUS8808 Ambilight|2023|849",
    ],
    "Moniteur PC": [
      "Samsung|Odyssey G9 49\"|2023|1199","Samsung|ViewFinity S8 27\"|2023|449","Dell|UltraSharp U2724D|2024|549",
      "LG|UltraGear 27GP850|2023|399","LG|UltraFine Ergo 32UN880|2023|649","Asus|ProArt PA278QV|2023|349",
      "BenQ|PD2706U|2023|599",
    ],
    "Vidéoprojecteur": [
      "Epson|EH-TW7100|2023|1499","BenQ|TK860i|2024|1399","Samsung|The Freestyle 2|2024|799",
      "XGIMI|Horizon Ultra|2024|1699","Hisense|PL1 Laser|2024|1999",
    ],
    "Barre de son": [
      "Samsung|HW-Q990D|2024|1199","Samsung|HW-S800D|2024|599","Sony|HT-A7000|2023|1099",
      "LG|S95TR|2024|999","Sonos|Arc|2023|899","Bose|Smart Soundbar 900|2023|849","JBL|Bar 1300|2023|999",
    ],
  },
  consoles: {
    "Console de salon": [
      "Sony|PlayStation 5 Slim|2023|549","Sony|PlayStation 5 Pro|2024|799","Sony|PlayStation 5 Digital|2023|449",
      "Microsoft|Xbox Series X|2020|499","Microsoft|Xbox Series S|2020|299","Microsoft|Xbox Series S 1TB|2024|349",
    ],
    "Console portable": [
      "Nintendo|Switch OLED|2021|349","Nintendo|Switch Lite|2019|219","Nintendo|Switch 2|2025|449",
      "Valve|Steam Deck OLED 512GB|2023|569","Valve|Steam Deck OLED 1TB|2023|679",
      "Asus|ROG Ally Z1 Extreme|2023|699","Lenovo|Legion Go|2023|649",
    ],
    "Manette": [
      "Sony|DualSense PS5|2020|69","Sony|DualSense Edge PS5|2023|219",
      "Microsoft|Manette Xbox Elite Series 2|2019|179","Microsoft|Manette Xbox sans fil|2020|59",
      "Nintendo|Joy-Con (paire)|2017|79","Nintendo|Pro Controller|2017|69",
      "Scuf|Reflex Pro PS5|2023|229","8BitDo|Ultimate 2.4G|2023|49",
    ],
    "Casque gaming": [
      "Sony|Pulse 3D PS5|2020|99","Sony|Pulse Elite|2024|149",
      "SteelSeries|Arctis Nova Pro|2023|349","SteelSeries|Arctis Nova 7|2023|179",
      "Razer|BlackShark V2 Pro|2023|179","HyperX|Cloud III|2023|99","Logitech|G Pro X 2|2023|259",
    ],
  },
  audio: {
    "Écouteurs sans fil": [
      "Apple|AirPods Pro 2|2023|279","Apple|AirPods 4 ANC|2024|199","Apple|AirPods 4|2024|149","Apple|AirPods Max|2024|579",
      "Samsung|Galaxy Buds 3 Pro|2024|249","Samsung|Galaxy Buds FE|2023|109",
      "Sony|WF-1000XM5|2023|299","Sony|WF-C700N|2023|99",
      "Bose|QuietComfort Ultra Earbuds|2023|299","Bose|QuietComfort Earbuds II|2022|249",
      "JBL|Tour Pro 2|2023|229","JBL|Tune Beam|2023|79",
      "Nothing|Ear 2|2023|129","Jabra|Elite 10|2023|249","Google|Pixel Buds Pro 2|2024|229",
    ],
    "Casque audio": [
      "Sony|WH-1000XM5|2022|379","Sony|WH-1000XM4|2020|279",
      "Bose|QuietComfort Ultra|2023|449","Bose|QuietComfort 45|2021|299",
      "Apple|AirPods Max|2024|579","Sennheiser|Momentum 4|2022|349",
      "JBL|Tour One M2|2023|299","Marshall|Monitor III ANC|2024|299",
    ],
    "Enceinte Bluetooth": [
      "JBL|Charge 5|2021|179","JBL|Flip 6|2022|129","JBL|Xtreme 4|2024|349",
      "Sony|SRS-XB43|2023|199","Bose|SoundLink Flex|2023|149","Marshall|Stanmore III|2023|379",
      "Ultimate Ears|Boom 4|2024|149","Sonos|Roam 2|2024|179",
    ],
    "Enceinte connectée": [
      "Amazon|Echo 5e gen.|2024|59","Amazon|Echo Dot 5e gen.|2023|39","Amazon|Echo Show 10|2023|249",
      "Google|Nest Audio|2023|99","Google|Nest Mini 2|2023|49","Google|Nest Hub Max|2023|229",
      "Apple|HomePod 2|2023|349","Apple|HomePod Mini|2023|99",
      "Sonos|One SL|2023|199","Sonos|Era 300|2023|449",
    ],
  },
  photo: {
    "Appareil photo hybride": [
      "Sony|Alpha 7 IV|2021|2499","Sony|Alpha 7C II|2023|1999","Sony|Alpha 6700|2023|1499",
      "Canon|EOS R6 Mark II|2022|2499","Canon|EOS R8|2023|1699","Canon|EOS R50|2023|849",
      "Nikon|Z6 III|2024|2699","Nikon|Z50 II|2024|999","Fujifilm|X-T5|2022|1699","Fujifilm|X-S20|2023|1299",
    ],
    "Caméra action": [
      "GoPro|Hero 13 Black|2024|399","GoPro|Hero 12 Black|2023|349","DJI|Osmo Action 4|2023|349","Insta360|Ace Pro|2024|399",
    ],
    "Drone": [
      "DJI|Mini 4 Pro|2024|799","DJI|Air 3|2023|999","DJI|Mavic 3 Classic|2023|1399",
      "DJI|Avata 2|2024|449","DJI|Mini 3|2023|489",
    ],
  },
  plomberie: {
    "Robinet / Mitigeur": [
      "Grohe|Eurosmart Neuf|2023|89","Grohe|Minta Pull-Out|2023|189","Grohe|Essence|2023|229",
      "Hansgrohe|Talis M54|2023|199","Hansgrohe|Focus 100|2023|79",
      "Jacob Delafon|Kumin|2023|99","Roca|L20|2023|69",
    ],
    "WC / Toilettes": [
      "Geberit|Duofix Sigma 20|2023|399","Geberit|AquaClean Mera|2023|3499",
      "Grohe|Solido Compact|2023|349","Roca|Gap Rimless|2023|279","Villeroy & Boch|Subway 3.0|2023|549",
    ],
    "Chauffe-eau": [
      "Atlantic|Zénéo 200L|2023|549","Atlantic|Chaufféo Plus 100L|2023|349","Atlantic|Zénéo 150L|2023|479",
      "Thermor|Duralis 200L|2023|529","Thermor|Aéromax 5|2023|1799","Ariston|Velis Pro 80L|2023|399",
    ],
    "Ballon thermodynamique": [
      "Atlantic|Calypso 250L|2023|1999","Atlantic|Explorer V4 270L|2023|2499",
      "Thermor|Aéromax 5 250L|2023|2199",
    ],
    "Colonne de douche": [
      "Grohe|Euphoria SmartControl|2023|449","Hansgrohe|Crometta E 240|2023|249",
      "Grohe|Tempesta Cosmopolitan|2023|179","Jacob Delafon|July|2023|199",
    ],
  },
  chauffage: {
    "Chaudière gaz": [
      "De Dietrich|Naema 2 Micro 25|2023|2899","De Dietrich|MPX 24/28|2023|2199",
      "Saunier Duval|ThemaPlus Condens|2023|1899","Saunier Duval|Thelia Condens|2023|2499",
      "Viessmann|Vitodens 200-W|2023|3499","Elm Leblanc|Megalis Condens|2023|1699",
    ],
    "Pompe à chaleur": [
      "Atlantic|Alfea Extensa AI 8|2023|5999","Daikin|Altherma 3 R|2023|7999",
      "Mitsubishi|Ecodan Hydrobox|2023|6999","Bosch|Compress 5800i|2023|5499",
    ],
    "Radiateur électrique": [
      "Atlantic|Nirvana Digital|2023|499","Atlantic|Divali|2023|399","Atlantic|Agilia|2023|349",
      "Thermor|Baléares Digital|2023|449","Noirot|Bellagio Smart|2023|549","Acova|Fassane Premium|2023|599",
    ],
    "Climatiseur": [
      "Daikin|Perfera FTXM-R|2023|1299","Daikin|Emura III|2023|1599",
      "Mitsubishi|MSZ-LN|2023|1399","Samsung|WindFree Elite|2023|1199","LG|Dual Cool|2023|999",
    ],
    "Thermostat connecté": [
      "Atlantic|Cozy Touch|2023|179","Netatmo|Thermostat Intelligent|2023|179",
      "Tado°|Smart Thermostat V3+|2023|199","Google|Nest Learning 3|2023|249","Honeywell|T6R|2023|149",
    ],
  },
  jardin: {
    "Tondeuse": ["Bosch|AdvancedRotak 750|2023|349","Husqvarna|LC 140|2023|449","Stihl|RMA 248|2023|399","Einhell|GE-CM 36/37|2023|279"],
    "Tondeuse robot": ["Husqvarna|Automower 305|2023|999","Husqvarna|Automower 415X|2023|1999","Worx|Landroid M500|2023|649","Gardena|Sileno City 500|2023|799"],
    "Taille-haie": ["Bosch|AdvancedHedgeCut 36|2023|199","Stihl|HSA 56|2023|249","Gardena|EasyCut 450|2023|89"],
    "Nettoyeur haute pression": ["Kärcher|K5 Premium|2023|399","Kärcher|K2 Universal|2023|99","Nilfisk|Core 140|2023|249","Bosch|UniversalAquatak 135|2023|199"],
  },
  velo: {
    "Vélo électrique": ["Decathlon|Riverside 500E|2024|1299","Moustache|Samedi 27 Open|2024|2999","Trek|Verve+ 3|2024|2999","VanMoof|S5|2023|2498","Cowboy|Cruiser ST|2024|2990","Nakamura|E-City 110|2024|999"],
    "Trottinette électrique": ["Xiaomi|Electric Scooter 4 Pro|2024|599","Ninebot|KickScooter Max G2|2024|799","Dualtron|Mini Extra|2023|899","Segway|Ninebot F2 Plus|2024|449","Xiaomi|Electric Scooter 4|2024|449"],
    "VTT": ["Decathlon|Rockrider ST 540|2024|599","Trek|Marlin 7|2024|999","Specialized|Rockhopper|2024|799"],
  },
  montres: {
    "Montre connectée": [
      "Apple|Apple Watch Ultra 2|2024|899","Apple|Apple Watch Series 10|2024|449","Apple|Apple Watch SE 2|2023|279",
      "Samsung|Galaxy Watch 7|2024|319","Samsung|Galaxy Watch Ultra|2024|699","Samsung|Galaxy Watch FE|2024|219",
      "Google|Pixel Watch 3|2024|399","Garmin|Venu 3|2023|449","Garmin|Fenix 8|2024|999",
    ],
    "Bracelet connecté": [
      "Xiaomi|Smart Band 9|2024|39","Fitbit|Charge 6|2023|159","Samsung|Galaxy Fit 3|2024|59","Huawei|Band 9|2024|49",
    ],
  },
}

export const ISS_TPL = {
  Smartphone: [
    { n: "Écran cassé", rn: .08, rx: .22, d: "moyen", t: "1-2h", pr: .4, td: 3, yt: "remplacement écran", ix: "screen" },
    { n: "Batterie usée", rn: .04, rx: .08, d: "facile", t: "30min", pr: .35, td: 2, yt: "changement batterie", ix: "battery" },
    { n: "Caméra arrière HS", rn: .05, rx: .13, d: "moyen", t: "1h", pr: .45, td: 3, yt: "remplacement caméra", ix: "camera" },
    { n: "Caméra avant / Face ID", rn: .04, rx: .10, d: "difficile", t: "1-2h", pr: .4, td: 4, yt: "caméra avant réparation", ix: "front-camera" },
    { n: "Connecteur de charge", rn: .04, rx: .09, d: "moyen", t: "1h", pr: .3, td: 3, yt: "port de charge réparation", ix: "charging-port" },
    { n: "Haut-parleur", rn: .03, rx: .07, d: "moyen", t: "1h", pr: .3, td: 3, yt: "haut parleur réparation", ix: "speaker" },
    { n: "Micro HS", rn: .03, rx: .06, d: "moyen", t: "1h", pr: .3, td: 3, yt: "microphone réparation", ix: "microphone" },
    { n: "Bouton power / volume", rn: .02, rx: .05, d: "difficile", t: "1-2h", pr: .25, td: 4, yt: "bouton power réparation", ix: "buttons" },
    { n: "Vitre arrière cassée", rn: .03, rx: .10, d: "moyen", t: "1-2h", pr: .3, td: 4, yt: "vitre arrière remplacement", ix: "back-cover" },
    { n: "WiFi / Bluetooth HS", rn: .04, rx: .12, d: "difficile", t: "pro", pr: .4, td: 5, yt: "antenne wifi réparation", ix: "antenna" },
    { n: "Vibreur HS", rn: .02, rx: .04, d: "moyen", t: "45min", pr: .25, td: 3, yt: "vibreur remplacement", ix: "taptic-engine" },
  ],
  Tablette: [
    { n: "Écran cassé", rn: .10, rx: .28, d: "difficile", t: "2h", pr: .4, td: 4, yt: "remplacement écran tablette", ix: "screen" },
    { n: "Batterie usée", rn: .06, rx: .12, d: "moyen", t: "1h", pr: .35, td: 3, yt: "batterie tablette changement", ix: "battery" },
    { n: "Connecteur charge", rn: .05, rx: .10, d: "moyen", t: "1h", pr: .3, td: 3, yt: "port charge tablette", ix: "charging-port" },
    { n: "Haut-parleur", rn: .03, rx: .08, d: "moyen", t: "1h", pr: .3, td: 3, yt: "haut parleur tablette", ix: "speaker" },
    { n: "Bouton home / Touch ID", rn: .04, rx: .10, d: "difficile", t: "1-2h", pr: .35, td: 4, yt: "bouton home tablette", ix: "home-button" },
  ],
  "PC Portable": [
    { n: "Écran cassé", rn: .10, rx: .28, d: "difficile", t: "2-3h", pr: .45, td: 4, yt: "remplacement écran laptop", ix: "display" },
    { n: "Batterie usée", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .35, td: 2, yt: "changement batterie pc portable", ix: "battery" },
    { n: "Clavier défectueux", rn: .06, rx: .16, d: "moyen", t: "1-2h", pr: .4, td: 3, yt: "remplacement clavier laptop", ix: "keyboard" },
    { n: "Upgrade SSD", rn: .04, rx: .10, d: "facile", t: "30min", pr: .5, td: 1, yt: "upgrade ssd laptop", ix: "ssd" },
    { n: "Charnière cassée", rn: .06, rx: .15, d: "difficile", t: "2h", pr: .35, td: 4, yt: "charnière laptop réparation", ix: "hinge" },
    { n: "Ventilateur bruyant", rn: .03, rx: .08, d: "moyen", t: "1h", pr: .3, td: 3, yt: "ventilateur pc portable nettoyage", ix: "fan" },
    { n: "Touchpad HS", rn: .04, rx: .10, d: "moyen", t: "1-2h", pr: .35, td: 3, yt: "trackpad laptop remplacement", ix: "trackpad" },
    { n: "Port USB / HDMI", rn: .04, rx: .12, d: "difficile", t: "pro", pr: .3, td: 5, yt: "port usb laptop réparation", ix: "ports" },
    { n: "Upgrade RAM", rn: .03, rx: .08, d: "facile", t: "20min", pr: .6, td: 1, yt: "upgrade ram laptop", ix: "ram" },
  ],
  "Console de salon": [
    { n: "Lecteur disque HS", rn: .10, rx: .22, d: "difficile", t: "2h", pr: .4, td: 4, yt: "lecteur disque console remplacement", ix: "disc-drive" },
    { n: "Ventilateur bruyant", rn: .05, rx: .10, d: "moyen", t: "1h", pr: .3, td: 2, yt: "nettoyage ventilateur console", ix: "fan" },
    { n: "Port HDMI HS", rn: .08, rx: .18, d: "difficile", t: "pro", pr: .25, td: 5, yt: "réparation port hdmi console", ix: "hdmi" },
    { n: "Surchauffe / pâte thermique", rn: .03, rx: .06, d: "moyen", t: "1h", pr: .15, td: 2, yt: "changement pâte thermique console", ix: "thermal-paste" },
    { n: "Alimentation HS", rn: .10, rx: .20, d: "difficile", t: "1-2h", pr: .4, td: 4, yt: "alimentation console remplacement", ix: "power-supply" },
    { n: "SSD / stockage plein", rn: .06, rx: .14, d: "facile", t: "30min", pr: .5, td: 1, yt: "upgrade ssd console", ix: "ssd" },
    { n: "WiFi / Bluetooth", rn: .05, rx: .12, d: "difficile", t: "pro", pr: .3, td: 5, yt: "module wifi console", ix: "wifi" },
    { n: "Bouton power", rn: .03, rx: .08, d: "moyen", t: "1h", pr: .25, td: 3, yt: "bouton power console réparation", ix: "power-button" },
  ],
  "Console portable": [
    { n: "Écran cassé", rn: .12, rx: .30, d: "difficile", t: "2h", pr: .45, td: 4, yt: "remplacement écran console portable", ix: "screen" },
    { n: "Batterie faible", rn: .06, rx: .12, d: "moyen", t: "1h", pr: .35, td: 3, yt: "batterie console portable remplacement", ix: "battery" },
    { n: "Stick drift", rn: .04, rx: .08, d: "moyen", t: "45min", pr: .3, td: 2, yt: "stick drift réparation", ix: "joystick" },
    { n: "Rail Joy-Con / port", rn: .05, rx: .12, d: "difficile", t: "1-2h", pr: .3, td: 4, yt: "rail manette console remplacement", ix: "rail" },
    { n: "Ventilateur", rn: .04, rx: .08, d: "moyen", t: "1h", pr: .3, td: 3, yt: "ventilateur console portable", ix: "fan" },
    { n: "Haut-parleur", rn: .03, rx: .07, d: "moyen", t: "1h", pr: .3, td: 3, yt: "haut parleur console portable", ix: "speaker" },
  ],
  Manette: [
    { n: "Stick drift (joystick)", rn: .15, rx: .35, d: "moyen", t: "45min", pr: .25, td: 2, yt: "stick drift manette réparation", ix: "joystick" },
    { n: "Boutons défectueux", rn: .10, rx: .25, d: "moyen", t: "30min", pr: .2, td: 2, yt: "boutons manette réparation", ix: "buttons" },
    { n: "Gâchettes cassées", rn: .10, rx: .25, d: "moyen", t: "30min", pr: .25, td: 2, yt: "gâchette manette remplacement", ix: "triggers" },
    { n: "Batterie usée", rn: .10, rx: .20, d: "facile", t: "20min", pr: .3, td: 1, yt: "batterie manette remplacement", ix: "battery" },
    { n: "Bluetooth / connexion", rn: .12, rx: .30, d: "difficile", t: "pro", pr: .4, td: 5, yt: "bluetooth manette réparation", ix: "bluetooth" },
    { n: "Vibration HS", rn: .08, rx: .18, d: "moyen", t: "30min", pr: .2, td: 2, yt: "moteur vibration manette", ix: "haptics" },
  ],
  "Lave-linge": [
    { n: "Pompe de vidange", rn: .08, rx: .18, d: "moyen", t: "1-2h", pr: .3, td: 3, yt: "remplacement pompe vidange lave-linge", ix: "" },
    { n: "Roulements tambour", rn: .15, rx: .30, d: "difficile", t: "3-4h", pr: .35, td: 5, yt: "changement roulement tambour lave-linge", ix: "" },
    { n: "Joint de hublot", rn: .05, rx: .12, d: "facile", t: "30min", pr: .3, td: 1, yt: "remplacement joint hublot lave-linge", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "diagnostic carte électronique lave-linge", ix: "" },
    { n: "Résistance / chauffage", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "remplacement résistance lave-linge", ix: "" },
    { n: "Courroie", rn: .04, rx: .10, d: "facile", t: "30min", pr: .2, td: 1, yt: "changement courroie lave-linge", ix: "" },
    { n: "Électrovanne", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "remplacement électrovanne lave-linge", ix: "" },
    { n: "Palier tambour", rn: .12, rx: .25, d: "difficile", t: "2-3h", pr: .4, td: 4, yt: "changement palier tambour lave-linge", ix: "" },
    { n: "Charbon moteur", rn: .04, rx: .10, d: "moyen", t: "1h", pr: .25, td: 3, yt: "remplacement charbon moteur lave-linge", ix: "" },
  ],
  "Lave-vaisselle": [
    { n: "Pompe de cyclage", rn: .10, rx: .22, d: "moyen", t: "1-2h", pr: .35, td: 3, yt: "remplacement pompe cyclage lave-vaisselle", ix: "" },
    { n: "Bras de lavage", rn: .04, rx: .10, d: "facile", t: "15min", pr: .2, td: 1, yt: "nettoyage bras lavage lave-vaisselle", ix: "" },
    { n: "Joint de porte", rn: .04, rx: .10, d: "facile", t: "20min", pr: .25, td: 1, yt: "remplacement joint porte lave-vaisselle", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "diagnostic carte lave-vaisselle", ix: "" },
    { n: "Résistance", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "remplacement résistance lave-vaisselle", ix: "" },
    { n: "Pompe de vidange", rn: .06, rx: .15, d: "moyen", t: "1h", pr: .3, td: 3, yt: "remplacement pompe vidange lave-vaisselle", ix: "" },
  ],
  default: [
    { n: "Pièce d'usure", rn: .06, rx: .15, d: "facile", t: "1h", pr: .3, td: 2, yt: "remplacement pièce usure", ix: "" },
    { n: "Usure normale", rn: .05, rx: .12, d: "facile", t: "variable", pr: .25, td: 2, yt: "réparation entretien", ix: "" },
  ],
  "Sèche-linge": [
    { n: "Résistance HS", rn: .08, rx: .18, d: "moyen", t: "1-2h", pr: .35, td: 3, yt: "résistance sèche-linge", ix: "" },
    { n: "Courroie", rn: .04, rx: .10, d: "facile", t: "30min", pr: .2, td: 1, yt: "courroie sèche-linge", ix: "" },
    { n: "Joint de porte", rn: .04, rx: .10, d: "facile", t: "20min", pr: .25, td: 1, yt: "joint porte sèche-linge", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte sèche-linge", ix: "" },
    { n: "Pompe de vidange", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "pompe vidange sèche-linge", ix: "" },
  ],
  "Congélateur": [
    { n: "Compresseur HS", rn: .25, rx: .50, d: "difficile", t: "pro", pr: .5, td: 5, yt: "compresseur congélateur", ix: "" },
    { n: "Joint de porte", rn: .04, rx: .10, d: "facile", t: "20min", pr: .2, td: 1, yt: "joint congélateur", ix: "" },
    { n: "Thermostat", rn: .06, rx: .15, d: "moyen", t: "1h", pr: .3, td: 3, yt: "thermostat congélateur", ix: "" },
    { n: "Ventilateur", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "ventilateur congélateur", ix: "" },
  ],
  "Four": [
    { n: "Résistance HS", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "résistance four", ix: "" },
    { n: "Joint de porte", rn: .04, rx: .10, d: "facile", t: "20min", pr: .2, td: 1, yt: "joint four", ix: "" },
    { n: "Ventilateur", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "ventilateur four", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte four", ix: "" },
    { n: "Thermostat", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "thermostat four", ix: "" },
  ],
  "Four encastrable": [
    { n: "Résistance HS", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "résistance four encastrable", ix: "" },
    { n: "Joint de porte", rn: .04, rx: .10, d: "facile", t: "20min", pr: .2, td: 1, yt: "joint four encastrable", ix: "" },
    { n: "Ventilateur", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "ventilateur four encastrable", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte four encastrable", ix: "" },
  ],
  "Micro-ondes": [
    { n: "Magnétron HS", rn: .15, rx: .35, d: "difficile", t: "1-2h", pr: .5, td: 4, yt: "magnétron micro-ondes", ix: "" },
    { n: "Plaque vitrocéramique", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "plaque micro-ondes", ix: "" },
    { n: "Porte / charnière", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "porte micro-ondes", ix: "" },
    { n: "Carte électronique", rn: .12, rx: .25, d: "difficile", t: "pro", pr: .45, td: 5, yt: "carte micro-ondes", ix: "" },
  ],
  "Plaque gaz": [
    { n: "Bruleur encrassé", rn: .04, rx: .10, d: "facile", t: "30min", pr: .2, td: 1, yt: "nettoyage bruleur plaque gaz", ix: "" },
    { n: "Injecteur bouché", rn: .05, rx: .12, d: "facile", t: "30min", pr: .15, td: 1, yt: "injecteur plaque gaz", ix: "" },
    { n: "Thermocouple", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .25, td: 2, yt: "thermocouple plaque gaz", ix: "" },
    { n: "Robinet gaz", rn: .08, rx: .18, d: "difficile", t: "pro", pr: .35, td: 4, yt: "robinet plaque gaz", ix: "" },
  ],
  "Hotte aspirante": [
    { n: "Moteur HS", rn: .12, rx: .28, d: "moyen", t: "1-2h", pr: .4, td: 4, yt: "moteur hotte aspirante", ix: "" },
    { n: "Filtre encrassé", rn: .02, rx: .06, d: "facile", t: "10min", pr: .15, td: 1, yt: "filtre hotte", ix: "" },
    { n: "Interrupteur", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "interrupteur hotte", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte hotte aspirante", ix: "" },
  ],
  "Cuisinière mixte": [
    { n: "Résistance four HS", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "résistance four cuisinière", ix: "" },
    { n: "Plaque induction / gaz", rn: .10, rx: .25, d: "difficile", t: "pro", pr: .45, td: 5, yt: "plaque cuisinière mixte", ix: "" },
    { n: "Thermostat", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "thermostat cuisinière", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte cuisinière", ix: "" },
  ],
  "Robot cuisine": [
    { n: "Moteur / coupe HS", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .5, td: 5, yt: "moteur robot cuisine", ix: "" },
    { n: "Joint bol", rn: .04, rx: .10, d: "facile", t: "15min", pr: .2, td: 1, yt: "joint robot cuisine", ix: "" },
    { n: "Carte électronique", rn: .20, rx: .40, d: "difficile", t: "pro", pr: .55, td: 5, yt: "carte thermomix", ix: "" },
  ],
  "Cafetière expresso": [
    { n: "Pompe HS", rn: .10, rx: .22, d: "moyen", t: "1-2h", pr: .4, td: 4, yt: "pompe cafetière expresso", ix: "" },
    { n: "Joint / calcaire", rn: .04, rx: .10, d: "facile", t: "30min", pr: .2, td: 1, yt: "détartrage cafetière", ix: "" },
    { n: "Buse vapeur", rn: .05, rx: .12, d: "facile", t: "20min", pr: .25, td: 1, yt: "buse cafetière expresso", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte cafetière", ix: "" },
  ],
  "Machine à café": [
    { n: "Pompe / percolateur", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "pompe machine café", ix: "" },
    { n: "Calcaire", rn: .02, rx: .06, d: "facile", t: "15min", pr: .1, td: 1, yt: "détartrage nespresso", ix: "" },
    { n: "Réservoir / bac", rn: .03, rx: .08, d: "facile", t: "5min", pr: .15, td: 1, yt: "réservoir machine café", ix: "" },
  ],
  "WC / Toilettes": [
    { n: "Mécanisme chasse", rn: .08, rx: .18, d: "facile", t: "30min", pr: .25, td: 1, yt: "mécanisme chasse d'eau", ix: "" },
    { n: "Joint cuvette", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .2, td: 2, yt: "joint wc", ix: "" },
    { n: "Fuite", rn: .06, rx: .15, d: "moyen", t: "1h", pr: .25, td: 2, yt: "fuite wc réparation", ix: "" },
  ],
  "Ballon thermodynamique": [
    { n: "Résistance HS", rn: .08, rx: .18, d: "difficile", t: "pro", pr: .4, td: 5, yt: "résistance ballon thermodynamique", ix: "" },
    { n: "Anode", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "anode ballon", ix: "" },
    { n: "Groupe de sécurité", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "groupe sécurité ballon", ix: "" },
  ],
  "Colonne de douche": [
    { n: "Cartouche", rn: .10, rx: .25, d: "moyen", t: "1h", pr: .3, td: 2, yt: "cartouche colonne douche", ix: "" },
    { n: "Fuite", rn: .06, rx: .15, d: "moyen", t: "1h", pr: .25, td: 2, yt: "fuite colonne douche", ix: "" },
    { n: "Buse / pommeau", rn: .04, rx: .10, d: "facile", t: "20min", pr: .2, td: 1, yt: "pommeau douche", ix: "" },
  ],
  "Moniteur PC": [
    { n: "Rétroéclairage HS", rn: .10, rx: .22, d: "moyen", t: "2-3h", pr: .35, td: 4, yt: "rétroéclairage moniteur", ix: "" },
    { n: "Carte alimentation", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .4, td: 3, yt: "carte alimentation moniteur", ix: "" },
    { n: "Port HDMI / DisplayPort", rn: .06, rx: .14, d: "difficile", t: "pro", pr: .3, td: 5, yt: "port moniteur", ix: "" },
  ],
  "Enceinte Bluetooth": [
    { n: "Batterie usée", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .4, td: 3, yt: "batterie enceinte bluetooth", ix: "" },
    { n: "Haut-parleur HS", rn: .12, rx: .28, d: "difficile", t: "pro", pr: .5, td: 5, yt: "haut-parleur enceinte", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte enceinte", ix: "" },
  ],
  "Pompe à chaleur": [
    { n: "Carte électronique", rn: .08, rx: .18, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte pompe à chaleur", ix: "" },
    { n: "Compresseur", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .55, td: 5, yt: "compresseur pac", ix: "" },
    { n: "Détendeur", rn: .06, rx: .14, d: "difficile", t: "pro", pr: .4, td: 5, yt: "détendeur pac", ix: "" },
  ],
  "Radiateur électrique": [
    { n: "Résistance HS", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "résistance radiateur électrique", ix: "" },
    { n: "Thermostat", rn: .05, rx: .12, d: "facile", t: "30min", pr: .25, td: 1, yt: "thermostat radiateur", ix: "" },
    { n: "Carte électronique", rn: .12, rx: .25, d: "difficile", t: "pro", pr: .45, td: 5, yt: "carte radiateur", ix: "" },
  ],
  "Climatiseur": [
    { n: "Compresseur HS", rn: .20, rx: .45, d: "difficile", t: "pro", pr: .55, td: 5, yt: "compresseur climatiseur", ix: "" },
    { n: "Ventilateur", rn: .08, rx: .18, d: "moyen", t: "1-2h", pr: .35, td: 4, yt: "ventilateur climatiseur", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte climatiseur", ix: "" },
    { n: "Filtre encrassé", rn: .02, rx: .06, d: "facile", t: "10min", pr: .1, td: 1, yt: "filtre climatiseur", ix: "" },
  ],
  "Thermostat connecté": [
    { n: "Pile / alimentation", rn: .02, rx: .06, d: "facile", t: "5min", pr: .1, td: 1, yt: "pile thermostat", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .5, td: 5, yt: "thermostat connecté", ix: "" },
    { n: "Connexion WiFi", rn: .05, rx: .12, d: "moyen", t: "30min", pr: .2, td: 2, yt: "wifi thermostat", ix: "" },
  ],
  "Tondeuse": [
    { n: "Lame usée", rn: .04, rx: .10, d: "facile", t: "20min", pr: .25, td: 1, yt: "lame tondeuse", ix: "" },
    { n: "Filtre à air", rn: .02, rx: .06, d: "facile", t: "10min", pr: .15, td: 1, yt: "filtre tondeuse", ix: "" },
    { n: "Bougie", rn: .03, rx: .08, d: "facile", t: "15min", pr: .2, td: 1, yt: "bougie tondeuse", ix: "" },
    { n: "Moteur HS", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .5, td: 5, yt: "moteur tondeuse", ix: "" },
  ],
  "Tondeuse robot": [
    { n: "Batterie usée", rn: .12, rx: .28, d: "moyen", t: "1h", pr: .45, td: 3, yt: "batterie tondeuse robot", ix: "" },
    { n: "Lames", rn: .05, rx: .12, d: "facile", t: "20min", pr: .25, td: 1, yt: "lames tondeuse robot", ix: "" },
    { n: "Carte électronique", rn: .18, rx: .38, d: "difficile", t: "pro", pr: .55, td: 5, yt: "carte tondeuse robot", ix: "" },
  ],
  "Taille-haie": [
    { n: "Lames", rn: .06, rx: .14, d: "facile", t: "20min", pr: .3, td: 1, yt: "lames taille-haie", ix: "" },
    { n: "Câble", rn: .04, rx: .10, d: "moyen", t: "30min", pr: .2, td: 2, yt: "câble taille-haie", ix: "" },
    { n: "Moteur HS", rn: .12, rx: .28, d: "difficile", t: "pro", pr: .5, td: 5, yt: "moteur taille-haie", ix: "" },
  ],
  "Nettoyeur haute pression": [
    { n: "Lance / pistolet", rn: .05, rx: .12, d: "facile", t: "10min", pr: .25, td: 1, yt: "lance nettoyeur pression", ix: "" },
    { n: "Pompe HS", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .5, td: 5, yt: "pompe nettoyeur haute pression", ix: "" },
    { n: "Moteur", rn: .10, rx: .22, d: "moyen", t: "1-2h", pr: .4, td: 4, yt: "moteur nettoyeur pression", ix: "" },
  ],
  "Réfrigérateur": [
    { n: "Compresseur HS", rn: .25, rx: .50, d: "difficile", t: "pro", pr: .5, td: 5, yt: "diagnostic compresseur réfrigérateur", ix: "" },
    { n: "Thermostat", rn: .06, rx: .15, d: "moyen", t: "1h", pr: .3, td: 3, yt: "remplacement thermostat réfrigérateur", ix: "" },
    { n: "Joint de porte", rn: .04, rx: .10, d: "facile", t: "20min", pr: .2, td: 1, yt: "remplacement joint porte réfrigérateur", ix: "" },
    { n: "Ventilateur", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "remplacement ventilateur réfrigérateur", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "diagnostic carte réfrigérateur", ix: "" },
    { n: "Distributeur eau/glaçons", rn: .08, rx: .18, d: "moyen", t: "1-2h", pr: .35, td: 3, yt: "réparation distributeur eau réfrigérateur", ix: "" },
  ],
  "Aspirateur balai": [
    { n: "Batterie usée", rn: .10, rx: .20, d: "facile", t: "20min", pr: .4, td: 1, yt: "remplacement batterie aspirateur balai", ix: "" },
    { n: "Moteur HS", rn: .20, rx: .40, d: "difficile", t: "pro", pr: .5, td: 5, yt: "moteur aspirateur", ix: "" },
    { n: "Filtre bouché", rn: .03, rx: .08, d: "facile", t: "10min", pr: .2, td: 1, yt: "filtre aspirateur nettoyage", ix: "" },
    { n: "Brosse motorisée", rn: .08, rx: .18, d: "facile", t: "15min", pr: .35, td: 1, yt: "remplacement brosse aspirateur balai", ix: "" },
    { n: "Tube / manche cassé", rn: .06, rx: .14, d: "facile", t: "5min", pr: .3, td: 1, yt: "tube aspirateur remplacement", ix: "" },
  ],
  "Aspirateur robot": [
    { n: "Batterie usée", rn: .10, rx: .20, d: "moyen", t: "30min", pr: .4, td: 2, yt: "batterie aspirateur robot", ix: "" },
    { n: "Brosse principale", rn: .04, rx: .10, d: "facile", t: "10min", pr: .2, td: 1, yt: "brosse aspirateur robot", ix: "" },
    { n: "Capteurs HS", rn: .10, rx: .22, d: "difficile", t: "pro", pr: .4, td: 5, yt: "capteur aspirateur robot", ix: "" },
    { n: "Roue / roulette", rn: .05, rx: .12, d: "facile", t: "20min", pr: .25, td: 1, yt: "roue aspirateur robot", ix: "" },
    { n: "Réservoir / serpillère", rn: .06, rx: .14, d: "facile", t: "5min", pr: .3, td: 1, yt: "réservoir aspirateur robot", ix: "" },
    { n: "Station de charge", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "base charge robot aspirateur", ix: "" },
  ],
  Téléviseur: [
    { n: "Dalle cassée", rn: .35, rx: .65, d: "difficile", t: "pro", pr: .6, td: 5, yt: "dalle tv remplacement", ix: "" },
    { n: "Rétroéclairage HS", rn: .10, rx: .22, d: "moyen", t: "2-3h", pr: .35, td: 4, yt: "rétroéclairage tv led", ix: "" },
    { n: "Carte alimentation", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .4, td: 3, yt: "carte alimentation tv", ix: "" },
    { n: "Carte T-Con", rn: .08, rx: .16, d: "moyen", t: "1h", pr: .4, td: 3, yt: "carte tcon tv", ix: "" },
    { n: "Port HDMI", rn: .06, rx: .14, d: "difficile", t: "pro", pr: .3, td: 5, yt: "port hdmi tv soudure", ix: "" },
    { n: "Haut-parleurs", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .3, td: 3, yt: "haut parleur tv", ix: "" },
  ],
  "Écouteurs sans fil": [
    { n: "Batterie écouteur usée", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .3, td: 5, yt: "batterie écouteurs sans fil", ix: "" },
    { n: "Batterie boîtier usée", rn: .12, rx: .28, d: "difficile", t: "pro", pr: .3, td: 5, yt: "batterie boîtier écouteurs", ix: "" },
    { n: "Grille / mesh sale", rn: .03, rx: .08, d: "facile", t: "15min", pr: .15, td: 1, yt: "nettoyage grille écouteurs", ix: "" },
    { n: "Son d'un côté seulement", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .4, td: 5, yt: "écouteur un seul côté réparation", ix: "" },
  ],
  "Casque audio": [
    { n: "Coussinets usés", rn: .05, rx: .12, d: "facile", t: "5min", pr: .2, td: 1, yt: "remplacement coussinets casque", ix: "" },
    { n: "Batterie usée", rn: .10, rx: .22, d: "difficile", t: "pro", pr: .4, td: 5, yt: "batterie casque bluetooth", ix: "" },
    { n: "Arceau cassé", rn: .08, rx: .20, d: "moyen", t: "30min", pr: .35, td: 2, yt: "arceau casque réparation", ix: "" },
    { n: "Câble audio", rn: .04, rx: .10, d: "facile", t: "10min", pr: .2, td: 1, yt: "câble casque remplacement", ix: "" },
  ],
  "Vélo électrique": [
    { n: "Batterie usée", rn: .20, rx: .40, d: "facile", t: "10min", pr: .6, td: 1, yt: "batterie vélo électrique", ix: "" },
    { n: "Moteur HS", rn: .25, rx: .45, d: "difficile", t: "pro", pr: .5, td: 5, yt: "moteur vélo électrique", ix: "" },
    { n: "Display / compteur", rn: .06, rx: .14, d: "moyen", t: "30min", pr: .35, td: 2, yt: "écran vélo électrique", ix: "" },
    { n: "Freins", rn: .04, rx: .10, d: "facile", t: "30min", pr: .25, td: 1, yt: "freins vélo", ix: "" },
    { n: "Pneus / chambre à air", rn: .03, rx: .06, d: "facile", t: "20min", pr: .2, td: 1, yt: "pneu vélo électrique", ix: "" },
    { n: "Chaîne / dérailleur", rn: .04, rx: .10, d: "moyen", t: "30min", pr: .25, td: 2, yt: "chaîne vélo réparation", ix: "" },
  ],
  "Trottinette électrique": [
    { n: "Batterie usée", rn: .18, rx: .35, d: "moyen", t: "1h", pr: .5, td: 3, yt: "batterie trottinette électrique", ix: "" },
    { n: "Pneu crevé", rn: .05, rx: .12, d: "facile", t: "30min", pr: .2, td: 1, yt: "pneu trottinette électrique", ix: "" },
    { n: "Contrôleur HS", rn: .12, rx: .25, d: "difficile", t: "pro", pr: .45, td: 5, yt: "contrôleur trottinette", ix: "" },
    { n: "Frein", rn: .04, rx: .10, d: "facile", t: "20min", pr: .25, td: 1, yt: "frein trottinette électrique", ix: "" },
    { n: "Écran / display", rn: .06, rx: .14, d: "moyen", t: "30min", pr: .35, td: 2, yt: "écran trottinette remplacement", ix: "" },
  ],
  "Montre connectée": [
    { n: "Batterie usée", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .4, td: 5, yt: "batterie montre connectée remplacement", ix: "" },
    { n: "Écran cassé", rn: .20, rx: .40, d: "difficile", t: "pro", pr: .5, td: 5, yt: "écran montre connectée remplacement", ix: "" },
    { n: "Bracelet usé", rn: .03, rx: .08, d: "facile", t: "1min", pr: .15, td: 1, yt: "bracelet montre connectée", ix: "" },
    { n: "Capteurs HS", rn: .15, rx: .35, d: "difficile", t: "pro", pr: .5, td: 5, yt: "capteur montre connectée", ix: "" },
  ],
  "Plaque vitrocéramique": [
    { n: "Plaque fissurée", rn: .30, rx: .60, d: "difficile", t: "pro", pr: .65, td: 5, yt: "plaque vitrocéramique cassée", ix: "" },
    { n: "Foyer ne chauffe plus", rn: .10, rx: .22, d: "moyen", t: "1h", pr: .35, td: 3, yt: "foyer vitrocéramique HS", ix: "" },
    { n: "Carte électronique", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte vitrocéramique", ix: "" },
    { n: "Boutons / commandes", rn: .08, rx: .18, d: "moyen", t: "1h", pr: .35, td: 3, yt: "commande plaque cuisson", ix: "" },
  ],
  "Plaque induction": [
    { n: "Plaque fissurée", rn: .25, rx: .55, d: "difficile", t: "pro", pr: .6, td: 5, yt: "plaque induction cassée", ix: "" },
    { n: "Foyer ne chauffe plus", rn: .10, rx: .25, d: "moyen", t: "1-2h", pr: .35, td: 3, yt: "foyer induction HS", ix: "" },
    { n: "Carte électronique / puissance", rn: .15, rx: .30, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte puissance plaque induction", ix: "" },
    { n: "Ventilateur", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .3, td: 3, yt: "ventilateur plaque induction", ix: "" },
  ],
  "Robinet / Mitigeur": [
    { n: "Fuite au bec", rn: .15, rx: .35, d: "facile", t: "20min", pr: .2, td: 1, yt: "fuite robinet réparation", ix: "" },
    { n: "Cartouche usée", rn: .10, rx: .25, d: "facile", t: "30min", pr: .25, td: 1, yt: "cartouche mitigeur changement", ix: "" },
    { n: "Calcaire / débit faible", rn: .05, rx: .15, d: "facile", t: "30min", pr: .15, td: 1, yt: "détartrage robinet", ix: "" },
  ],
  "Chauffe-eau": [
    { n: "Résistance HS", rn: .08, rx: .18, d: "moyen", t: "1-2h", pr: .35, td: 3, yt: "résistance chauffe eau", ix: "" },
    { n: "Thermostat HS", rn: .06, rx: .14, d: "moyen", t: "1h", pr: .3, td: 3, yt: "thermostat chauffe eau", ix: "" },
    { n: "Anode usée", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "anode chauffe eau", ix: "" },
    { n: "Fuite / joint", rn: .04, rx: .10, d: "facile", t: "30min", pr: .2, td: 1, yt: "fuite chauffe eau joint", ix: "" },
    { n: "Groupe de sécurité", rn: .05, rx: .12, d: "moyen", t: "1h", pr: .25, td: 2, yt: "groupe sécurité chauffe eau", ix: "" },
  ],
  "Chaudière gaz": [
    { n: "Carte électronique", rn: .06, rx: .14, d: "difficile", t: "pro", pr: .5, td: 5, yt: "carte chaudière gaz", ix: "" },
    { n: "Panne allumage", rn: .04, rx: .12, d: "difficile", t: "pro", pr: .4, td: 5, yt: "allumage chaudière gaz", ix: "" },
    { n: "Échangeur entartré", rn: .06, rx: .15, d: "difficile", t: "pro", pr: .4, td: 5, yt: "échangeur chaudière", ix: "" },
    { n: "Sonde / capteur", rn: .03, rx: .08, d: "difficile", t: "pro", pr: .3, td: 5, yt: "sonde chaudière gaz", ix: "" },
    { n: "Circulateur HS", rn: .05, rx: .12, d: "difficile", t: "pro", pr: .4, td: 5, yt: "circulateur chaudière", ix: "" },
  ],
}

// Génération des produits
let _id = 1;
export const ITEMS = [];
for (const [catId, types] of Object.entries(RAW)) {
  for (const [ptype, list] of Object.entries(types)) {
    for (const raw of list) {
      const [brand, name, year, price] = raw.split("|");
      ITEMS.push({ id: _id++, name, brand, category: catId, productType: ptype, year: +year, priceNew: +price });
    }
  }
}

export const OCC_CATS = ["electromenager", "plomberie", "chauffage", "jardin"];

export const SIDEBAR_GROUPS = [
  { label: "Technologies", ids: ["smartphones", "tablettes", "ordinateurs", "tv", "consoles", "audio", "photo", "montres", "velo"] },
  { label: "Maison", ids: ["electromenager", "plomberie", "chauffage", "jardin"] },
];

export const CHIP_TO_PRODUCT = {
  "iPhone 13": ["Apple", "iPhone 13"],
  "MacBook Air M3": ["Apple", "MacBook Air M3 13\""],
  "Galaxy S24": ["Samsung", "Galaxy S24"],
  "Lave-linge Bosch": ["Bosch", "Série 6 WGG24400"],
  "PlayStation 5": ["Sony", "PlayStation 5 Slim"],
  "Dyson V15": ["Dyson", "V15 Detect Absolute"],
  "Thermomix TM6": ["Vorwerk", "Thermomix TM6"],
  "iPad Pro": ["Apple", "iPad Pro M4 13\""],
}

export const POPULAR_SEARCHES = [
  { label: "iPhone 13", intent: "Écran cassé", brand: "Apple", name: "iPhone 13" },
  { label: "Galaxy S24", intent: "Batterie HS", brand: "Samsung", name: "Galaxy S24" },
  { label: "PlayStation 5 Slim", intent: "Ne s'allume plus", brand: "Sony", name: "PlayStation 5 Slim" },
  { label: "Lave-linge : réparer ou remplacer", type: "general", catId: "electromenager", productType: "Lave-linge" },
  { label: "MacBook Air M3", intent: "Batterie usée", brand: "Apple", name: "MacBook Air M3 13\"" },
  { label: "Lave-vaisselle : réparer ou remplacer", type: "general", catId: "electromenager", productType: "Lave-vaisselle" },
  { label: "Réfrigérateur : réparer ou remplacer", type: "general", catId: "electromenager", productType: "Réfrigérateur" },
  { label: "Plaque induction : réparer ou remplacer", type: "general", catId: "electromenager", productType: "Plaque induction" },
  { label: "OLED C4", intent: "Dalle abîmée", brand: "LG", name: "OLED 55\" C4" },
  { label: "AirPods Pro", intent: "Son défaillant", brand: "Apple", name: "AirPods Pro 2" },
];

/** Recommandations pour utilisateurs sur iPhone/iPad — écosystème Apple en priorité */
export const POPULAR_SEARCHES_IPHONE = [
  { label: "iPhone 15", intent: "Écran cassé", brand: "Apple", name: "iPhone 15" },
  { label: "iPhone 14", intent: "Batterie HS", brand: "Apple", name: "iPhone 14" },
  { label: "iPhone 13", intent: "Écran cassé", brand: "Apple", name: "iPhone 13" },
  { label: "iPhone 16", intent: "Batterie usée", brand: "Apple", name: "iPhone 16" },
  { label: "MacBook Air M3", intent: "Batterie usée", brand: "Apple", name: "MacBook Air M3 13\"" },
  { label: "iPad Pro", intent: "Écran cassé", brand: "Apple", name: "iPad Pro M4 13\"" },
  { label: "AirPods Pro", intent: "Son défaillant", brand: "Apple", name: "AirPods Pro 2" },
  { label: "Lave-linge : réparer ou remplacer", type: "general", catId: "electromenager", productType: "Lave-linge" },
  { label: "Apple Watch", intent: "Batterie usée", brand: "Apple", name: "Apple Watch Series 10" },
  { label: "Lave-vaisselle : réparer ou remplacer", type: "general", catId: "electromenager", productType: "Lave-vaisselle" },
];

/** Marques affiliées uniquement — ne pas inclure les sites sans programme d'affiliation */
export const AFFILIATED_RETAILERS = ["Amazon", "Cdiscount", "Rakuten", "Fnac", "Darty", "Castorama", "Back Market", "ManoMano", "Spareka", "Rue du Commerce"];

/** Couleur du fond du logo (prolongement visuel, pas la couleur accent) */
export const LOGO_BG = {
  "/retailers/amazon.png": "#ffffff",
  "/retailers/cdiscount.png": "#0066B2",
  "/retailers/fnac.png": "#E4A100",
  "/retailers/darty.png": "#CE0E2D",
  "/retailers/castorama.png": "#E30613",
  "/retailers/manomano.png": "#00B2A9",
  "/retailers/backmarket.png": "#1A1A1A",
  "/retailers/rakuten.png": "#B00020",
  "/retailers/spareka.png": "#00B8D9",
  "/retailers/rueducommerce.png": "#E30613",
};

export const RET = {
  neuf: [
    { n: "Amazon", t: "Livraison rapide", c: "#FF9900", logo: "A", logoUrl: "/retailers/amazon.png" },
    { n: "Cdiscount", t: "Prix mini", c: "#00A651", logo: "C", logoUrl: "/retailers/cdiscount.png" },
    { n: "Rue du Commerce", t: "Tech & électroménager", c: "#E30613", logo: "R", logoUrl: "/retailers/rueducommerce.png" },
    { n: "Fnac", t: "Retrait 1h en magasin", c: "#E4A100", logo: "F", logoUrl: "/retailers/fnac.png" },
    { n: "Darty", t: "Garantie 2 ans", c: "#CE0E2D", logo: "D", logoUrl: "/retailers/darty.png" },
    { n: "Castorama", t: "Bricolage & maison", c: "#E30613", logo: "C", logoUrl: "/retailers/castorama.png" },
    { n: "ManoMano", t: "Bricolage", c: "#00B2A9", logo: "M", logoUrl: "/retailers/manomano.png" },
  ],
  occ: [
    { n: "Back Market", t: "N°1 reconditionné garanti", c: "#4DBC80", logo: "B", logoUrl: "/retailers/backmarket.png" },
    { n: "Amazon Renewed", t: "Garantie Amazon", c: "#FF9900", logo: "A", logoUrl: "/retailers/amazon.png" },
    { n: "Rakuten", t: "Occasion vérifiée", c: "#B00020", logo: "R", logoUrl: "/retailers/rakuten.png" },
    { n: "Cdiscount", t: "Occasion & reconditionné", c: "#00A651", logo: "C", logoUrl: "/retailers/cdiscount.png" },
  ],
  pcs: [
    { n: "Amazon", t: "Pièces détachées", c: "#FF9900", logo: "A", logoUrl: "/retailers/amazon.png" },
    { n: "Spareka", t: "Électroménager", c: "#00B8D9", logo: "S", logoUrl: "/retailers/spareka.png" },
    { n: "Rue du Commerce", t: "Tech & pièces", c: "#E30613", logo: "R", logoUrl: "/retailers/rueducommerce.png" },
    { n: "ManoMano", t: "Pièces & outillage", c: "#00B2A9", logo: "M", logoUrl: "/retailers/manomano.png" },
    { n: "Castorama", t: "Plomberie & bricolage", c: "#E30613", logo: "C", logoUrl: "/retailers/castorama.png" },
  ],
}

export const TECH_CATS = ["smartphones", "tablettes", "ordinateurs", "tv", "consoles", "audio", "photo", "montres", "velo"];

/** Catégories éligibles à l'indice de réparabilité (note sur 10, obligatoire sur les appareils électriques/électroniques) */
export const REPAIRABILITY_ELIGIBLE_CATS = ["electromenager", "chauffage", "jardin", "smartphones", "tablettes", "ordinateurs", "tv", "consoles", "audio", "photo", "montres", "velo"];

/** Catégories éligibles au bonus QualiRépar (10–45 € chez réparateur labellisé) */
export const QUALIREPAR_ELIGIBLE_CATS = ["electromenager", "chauffage", "jardin", "plomberie", "smartphones", "tablettes", "ordinateurs", "tv", "consoles", "audio", "photo", "montres", "velo"];

/** Indice de réparabilité indicatif par type de produit (moyenne, pour affichage vignette) — variable selon modèle */
export const REPAIRABILITY_INDEX_BY_TYPE = {
  "Lave-linge": 7.2, "Lave-vaisselle": 7.0, "Sèche-linge": 6.8, "Réfrigérateur": 6.5, "Congélateur": 6.2,
  "Four": 6.5, "Four encastrable": 6.5, "Micro-ondes": 6.8, "Plaque induction": 6.0, "Plaque vitrocéramique": 6.2, "Plaque gaz": 6.0,
  "Hotte aspirante": 6.5, "Cuisinière mixte": 5.8, "Aspirateur balai": 6.8, "Aspirateur robot": 5.5,
  "Robot cuisine": 5.5, "Cafetière expresso": 6.5, "Machine à café": 6.0,
  "Tondeuse": 6.5, "Tondeuse robot": 5.5, "Taille-haie": 6.2, "Nettoyeur haute pression": 6.8,
  "Climatiseur": 6.0, "Radiateur électrique": 6.5, "Thermostat connecté": 7.0, "Chauffe-eau": 5.5,
  "Robinet / Mitigeur": 7.0, "WC / Toilettes": 5.5, "Ballon thermodynamique": 5.5, "Colonne de douche": 6.0,
  // Tech
  Smartphone: 6.5, Tablette: 5.8, "PC Portable": 6.2, "PC Bureau": 7.5, "All-in-One": 5.0,
  Téléviseur: 5.5, "Console de salon": 6.0, "Console portable": 5.5, Manette: 7.0,
  "Écouteurs sans fil": 4.5, "Casque audio": 6.5, "Vélo électrique": 6.0, "Montre connectée": 4.0,
};

/** Indice de réparabilité par modèle (brand|name) — prioritaire sur REPAIRABILITY_INDEX_BY_TYPE quand défini
 * Sources : indicereparabilite.fr, Apple Support, seb117.fr — voir INDICES_REPARABILITE_SOURCES.md */
export const REPAIRABILITY_INDEX_BY_PRODUCT = {
  // Apple iPhone — indicereparabilite.fr, Apple PDF, seb117.fr
  "Apple|iPhone 16 Pro Max": 8.3,
  "Apple|iPhone 16 Pro": 8.3,
  "Apple|iPhone 16": 7.0,
  "Apple|iPhone 16 Plus": 7.0,
  "Apple|iPhone 15 Pro Max": 7.7,
  "Apple|iPhone 15 Pro": 7.6,
  "Apple|iPhone 15": 7.5,
  "Apple|iPhone 15 Plus": 7.5,
  "Apple|iPhone 14 Pro Max": 7.0,
  "Apple|iPhone 14 Pro": 7.0,
  "Apple|iPhone 14": 7.0,
  "Apple|iPhone 14 Plus": 7.0,
  "Apple|iPhone 13": 6.2,
  "Apple|iPhone 13 Pro": 6.2,
  "Apple|iPhone 13 Pro Max": 6.2,
  "Apple|iPhone 12": 6.0,
  "Apple|iPhone 11": 4.6,
  "Apple|iPhone SE 2022": 6.2,
  "Apple|iPhone XR": 4.5,
  // Samsung — indicereparabilite.fr, seb117.fr
  "Samsung|Galaxy S25 Ultra": 8.5,
  "Samsung|Galaxy S25+": 9.0,
  "Samsung|Galaxy S25": 8.5,
  "Samsung|Galaxy S24 Ultra": 8.5,
  "Samsung|Galaxy S24": 8.5,
  "Samsung|Galaxy S23": 8.2,
  "Samsung|Galaxy S22": 8.2,
  "Samsung|Galaxy A55": 8.5,
  "Samsung|Galaxy A54": 8.4,
  "Samsung|Galaxy A35": 8.0,
  "Samsung|Galaxy A25": 7.5,
  "Samsung|Galaxy A15": 7.0,
  "Samsung|Galaxy Z Flip 6": 8.0,
  "Samsung|Galaxy Z Fold 6": 6.5,
  // Google — seb117.fr, Charlestech
  "Google|Pixel 9 Pro XL": 8.2,
  "Google|Pixel 9 Pro": 8.2,
  "Google|Pixel 9": 8.2,
  "Google|Pixel 8 Pro": 8.2,
  "Google|Pixel 8a": 8.2,
  "Google|Pixel 8": 8.2,
  // Apple MacBook — Apple Support PDF
  "Apple|MacBook Air M3 15\"": 6.5,
  "Apple|MacBook Air M3 13\"": 6.5,
  "Apple|MacBook Air M2": 6.5,
  "Apple|MacBook Air M1": 6.2,
  "Apple|MacBook Pro 16\" M3 Max": 6.5,
  "Apple|MacBook Pro 14\" M3 Pro": 6.5,
  "Apple|MacBook Pro 14\" M3": 6.5,
  // Apple iPad — indicereparabilite (tablettes)
  "Apple|iPad Pro M4 13\"": 6.0,
  "Apple|iPad Pro M4 11\"": 6.0,
  "Apple|iPad Air M2": 6.0,
  "Apple|iPad 10e gen.": 5.8,
  "Apple|iPad Mini 7": 6.0,
  "Apple|iPad 9e gen.": 5.5,
};

/** Étapes de tutoriel adaptées par type de produit (eau = couper eau si applicable) */
export const TUTORIAL_STEPS_BY_PRODUCT = {
  "Lave-linge": ["Débrancher l'appareil et couper l'alimentation électrique et l'eau.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester l'étanchéité."],
  "Lave-vaisselle": ["Débrancher l'appareil et couper l'alimentation électrique et l'eau.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Sèche-linge": ["Débrancher l'appareil et couper l'alimentation. Vidanger le condensat si applicable.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Réfrigérateur": ["Débrancher l'appareil et vider le contenu.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et laisser reposer avant de rebrancher."],
  "Congélateur": ["Débrancher l'appareil et vider le contenu.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et laisser reposer avant de rebrancher."],
  "Four": ["Débrancher l'appareil et couper l'alimentation électrique.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Four encastrable": ["Débrancher l'appareil et couper l'alimentation électrique.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Micro-ondes": ["Débrancher l'appareil. Décharger le condensateur (risque électrique).", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Plaque induction": ["Débrancher l'appareil et couper l'alimentation électrique.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Plaque vitrocéramique": ["Débrancher l'appareil et couper l'alimentation électrique.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Plaque gaz": ["Couper le gaz au robinet d'arrivée.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et vérifier l'étanchéité au gaz."],
  "Hotte aspirante": ["Débrancher l'appareil et couper l'alimentation électrique.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Cuisinière mixte": ["Débrancher l'appareil. Couper le gaz si applicable.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Aspirateur balai": ["Débrancher ou retirer la batterie.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Aspirateur robot": ["Éteindre et retirer la batterie si possible.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Robot cuisine": ["Débrancher l'appareil.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Cafetière expresso": ["Débrancher et vider le réservoir d'eau.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Machine à café": ["Débrancher et vider le réservoir.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Chauffe-eau": ["Couper l'alimentation électrique et l'eau.", "Vidanger le ballon avant toute intervention.", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter, remplir et tester l'étanchéité."],
  "Robinet / Mitigeur": ["Couper l'eau au robinet d'arrivée général ou sous l'évier.", "Démonter le robinet pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester l'étanchéité."],
  "WC / Toilettes": ["Couper l'eau au robinet d'arrivée des toilettes.", "Vider la chasse. Démonter pour accéder au composant (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Ballon thermodynamique": ["Couper l'alimentation électrique et l'eau.", "Vidanger le ballon avant toute intervention.", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter, remplir et tester."],
  "Colonne de douche": ["Couper l'eau au robinet d'arrivée.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester l'étanchéité."],
  "Chaudière gaz": ["Couper le gaz au robinet d'arrivée et l'alimentation électrique. Intervention réservée au professionnel agréé.", "Diagnostiquer le composant défaillant (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter, purger et tester."],
  "Pompe à chaleur": ["Couper l'alimentation électrique. Vidanger si nécessaire.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter, mettre sous vide et recharger (pro)."],
  "Climatiseur": ["Débrancher l'appareil et couper l'alimentation électrique.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Tondeuse": ["Couper l'alimentation (débrancher ou retirer la bougie pour thermique).", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "Nettoyeur haute pression": ["Débrancher et purger la pression restante.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  // Tech
  Smartphone: ["Éteindre et retirer la batterie si possible.", "Démonter l'appareil (outils de précision, chauffage pour adhésif écran).", "Remplacer le composant défectueux (voir le tutoriel vidéo ci-dessous).", "Remonter et tester."],
  Tablette: ["Éteindre l'appareil.", "Démonter en suivant le tutoriel vidéo (adhésif, connecteurs fragiles).", "Remplacer le composant défectueux.", "Remonter et tester."],
  "PC Portable": ["Débrancher et retirer la batterie.", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "PC Bureau": ["Débrancher l'alimentation et tous les câbles.", "Ouvrir le boîtier et accéder au composant concerné.", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
  "All-in-One": ["Débrancher l'appareil.", "Démonter avec précaution (écran collé, câbles fragiles).", "Remplacer le composant défectueux.", "Remonter et tester."],
  Téléviseur: ["Débrancher et attendre 24 h (condensateurs).", "Démonter le dos de la TV pour accéder aux cartes.", "Remplacer la carte ou le composant défectueux.", "Remonter et tester."],
  "Console de salon": ["Débrancher et retirer les vis de sécurité.", "Démonter pour accéder au composant concerné.", "Remplacer la pièce défectueuse.", "Remonter et tester."],
  "Console portable": ["Éteindre et retirer la batterie si possible.", "Démonter en suivant le tutoriel vidéo.", "Remplacer le composant défectueux.", "Remonter et tester."],
  Manette: ["Retirer les vis de sécurité (souvent sous les poignées).", "Ouvrir et accéder au composant concerné.", "Remplacer (stick, bouton, câble).", "Remonter et tester."],
  "Écouteurs sans fil": ["Ouvrir le boîtier (souvent collé).", "Accéder à la batterie ou au composant.", "Remplacer si possible (soudure délicate).", "Remonter et tester."],
  "Casque audio": ["Démonter les coussinets si nécessaire.", "Accéder au câble ou au driver.", "Remplacer le composant défectueux.", "Remonter et tester."],
  "Vélo électrique": ["Couper l'alimentation (batterie débranchée).", "Démonter pour accéder au composant concerné.", "Remplacer la pièce défectueuse.", "Remonter et tester."],
  "Montre connectée": ["Retirer la batterie si possible (modèles réparables).", "Démonter avec outils de précision.", "Remplacer le composant (souvent réservé au pro).", "Remonter et tester l'étanchéité."],
  default: ["Débrancher l'appareil et couper l'alimentation (eau si applicable).", "Démonter pour accéder au composant concerné (voir le tutoriel vidéo ci-dessous).", "Remplacer la pièce défectueuse par une pièce compatible.", "Remonter et tester."],
};

export const WHEN_REPAIR_SPEC = {
  "Lave-linge": {
    reparer: "Pour un lave-linge, la réparation est pertinente quand la panne concerne une pièce d'usure classique : joint de hublot, pompe de vidange, courroie ou charbon moteur. Le coût reste souvent sous 30 % du neuf. Les roulements sont plus délicats (démontage du tambour) mais réparables par un pro.",
    remplacer: "Remplacer si la carte électronique est HS (coût prohibitif), si les roulements ont endommagé le bloc tambour, ou si l'appareil a plus de 10 ans. L'occasion/reconditionné est rare pour le gros électroménager — le neuf avec garantie reste la référence.",
  },
  "Lave-vaisselle": {
    reparer: "Pour un lave-vaisselle, les pannes courantes (pompe de cyclage, joint de porte, bras de lavage) sont souvent réparables à moindre coût. La résistance et la pompe de vidange sont accessibles. Vérifier la disponibilité des pièces avant de décider.",
    remplacer: "Remplacer si la carte électronique est HS ou si la cuve fuit. Un lave-vaisselle de plus de 8 ans avec une panne majeure justifie souvent le remplacement par du neuf.",
  },
  "Réfrigérateur": {
    reparer: "Pour un réfrigérateur, le joint de porte, le thermostat et le ventilateur sont réparables. Un compresseur HS est en revanche rarement rentable à remplacer — le coût dépasse souvent 50 % du neuf.",
    remplacer: "Remplacer si le compresseur est HS, si la fuite de gaz est avérée, ou si l'appareil a plus de 12 ans. Le reconditionné est peu courant — privilégier le neuf avec garantie constructeur.",
  },
  "Plaque induction": {
    reparer: "Pour une plaque induction, seule une panne de foyer isolé ou de ventilateur peut être réparée à coût raisonnable. La plaque vitrocéramique fissurée ou la carte de puissance HS rendent la réparation peu rentable.",
    remplacer: "Remplacer si la plaque est fissurée (risque électrique) ou si la carte électronique est HS. Les plaques de cuisson se trouvent peu en reconditionné — le neuf reste la norme.",
  },
  "Plaque vitrocéramique": {
    reparer: "Pour une plaque vitrocéramique, un foyer qui ne chauffe plus peut parfois être réparé (résistance, connexion). La plaque fissurée impose le remplacement pour des raisons de sécurité.",
    remplacer: "Remplacer si la plaque est cassée ou si la carte électronique est HS. Le neuf est la référence pour ce type d'appareil.",
  },
  "Chauffe-eau": {
    reparer: "Pour un chauffe-eau, la résistance, le thermostat, l'anode et le groupe de sécurité sont des pièces d'usure courantes et remplaçables. Une fuite sur le corps du ballon impose en revanche le remplacement.",
    remplacer: "Remplacer si le ballon fuit, si la cuve est entartrée (eau rouillée), ou si l'appareil a plus de 15 ans. Un pro peut diagnostiquer rapidement.",
  },
  "Chaudière gaz": {
    reparer: "Pour une chaudière gaz, les interventions (carte électronique, circulateur, sonde) relèvent quasi exclusivement du professionnel agréé. La réparation est pertinente si le coût reste sous 30 % du neuf et que l'appareil est récent.",
    remplacer: "Remplacer si la chaudière a plus de 15 ans, si l'échangeur est percé, ou si la réparation dépasse 40 % du prix d'une chaudière neuve. Obligation légale de faire intervenir un pro qualifié.",
  },
  "Robinet / Mitigeur": {
    reparer: "Pour un robinet ou mitigeur, la cartouche, le joint et le flexible sont des pièces standard facilement remplaçables. La réparation est presque toujours rentable — évitez de remplacer tout le robinet pour une fuite au bec.",
    remplacer: "Remplacer si le corps du robinet est fêlé, si les filetages sont usés, ou si le modèle n'existe plus (pièces introuvables).",
  },
  "Tondeuse": {
    reparer: "Pour une tondeuse thermique, la lame, le filtre à air, la bougie et le câble de débrayage sont des pièces d'usure courantes. Une tondeuse électrique : câble, interrupteur, moteur (si disponible).",
    remplacer: "Remplacer si le bloc moteur est HS (thermique) ou si la tondeuse a plus de 10 ans avec une panne coûteuse. L'occasion est courante pour le jardin.",
  },
  "Tondeuse robot": {
    reparer: "Pour une tondeuse robot, la batterie et les lames sont remplaçables. Les capteurs et la carte électronique relèvent du SAV constructeur — vérifier la garantie et les pièces disponibles.",
    remplacer: "Remplacer si la carte est HS ou si le modèle n'est plus supporté (pièces introuvables). Le reconditionné existe peu — le neuf reste la référence.",
  },
  // Tech — personnalisés par produit
  Smartphone: {
    reparer: "Pour un smartphone, la réparation est pertinente quand la panne est courante (écran, batterie, connecteur) et que le coût reste sous 30 % du neuf. Les pièces sont disponibles et de nombreux tutoriels existent.",
    remplacer: "Remplacer si le coût dépasse 40 % du neuf, si plusieurs pannes s'accumulent, ou si l'appareil a plus de 5 ans. Le reconditionné est très en vogue : même marque, garantie, prix réduit.",
  },
  Tablette: {
    reparer: "Pour une tablette, l'écran et la batterie sont les pannes les plus réparables. Le coût doit rester sous 35 % du neuf. Les tutoriels vidéo aident pour les modèles populaires.",
    remplacer: "Remplacer si l'écran est trop cher à remplacer (souvent 40–50 % du neuf) ou si la tablette a plus de 6 ans. Le reconditionné existe pour iPad et Galaxy Tab.",
  },
  "PC Portable": {
    reparer: "Pour un PC portable, batterie, clavier, SSD et ventilateur sont souvent réparables en DIY. La réparation est pertinente si le coût reste sous 30 % du neuf et que l'appareil a moins de 6 ans.",
    remplacer: "Remplacer si la carte mère est HS, si l'écran coûte trop cher, ou si le portable a plus de 7 ans. Le reconditionné professionnel (ThinkPad, Latitude) offre un bon rapport qualité/prix.",
  },
  "PC Bureau": {
    reparer: "Pour un PC fixe, la réparation est souvent simple : alimentation, RAM, disque. Les composants sont modulaires et facilement remplaçables.",
    remplacer: "Remplacer si la carte mère ou le processeur est HS, ou si l'âge dépasse 8 ans. L'occasion est courante pour les PC bureaux.",
  },
  "All-in-One": {
    reparer: "Pour un All-in-One, la réparation est plus délicate : composants intégrés, écran collé. Pertinent uniquement pour des pannes simples (RAM, disque) à coût raisonnable.",
    remplacer: "Remplacer si l'écran ou la carte mère est HS — le coût dépasse souvent 50 % du neuf. Le reconditionné existe pour iMac et équivalents.",
  },
  Téléviseur: {
    reparer: "Pour une TV, seules les pannes mineures (carte alimentation, rétroéclairage) sont parfois réparables. La dalle cassée impose le remplacement.",
    remplacer: "Remplacer si la dalle est endommagée (coût prohibitif) ou si la TV a plus de 8 ans. Les TV se déprécient vite — le neuf offre souvent un meilleur rapport qualité/prix.",
  },
  "Console de salon": {
    reparer: "Pour une console, ventilateur, lecteur disque et alimentation sont réparables. Pertinent si le coût reste sous 35 % du neuf et que la console est récente.",
    remplacer: "Remplacer si la carte mère est HS ou si la console a plus de 6 ans. Le reconditionné est très courant pour les consoles de jeu.",
  },
  "Console portable": {
    reparer: "Pour une console portable (Switch, Steam Deck), écran et batterie sont les pannes les plus réparables. Les tutoriels existent pour les modèles populaires.",
    remplacer: "Remplacer si l'écran ou la carte mère est HS. Le reconditionné est courant pour la Switch.",
  },
  Manette: {
    reparer: "Pour une manette, le stick drift et les boutons sont souvent réparables en DIY. Coût faible, tutoriels nombreux.",
    remplacer: "Remplacer si la réparation échoue ou si la manette est très usée. Les manettes neuves restent abordables.",
  },
  "Écouteurs sans fil": {
    reparer: "Pour des écouteurs sans fil, la réparation est rarement rentable : composants miniaturisés, soudure délicate. La batterie peut parfois être changée sur certains modèles.",
    remplacer: "Remplacer dans la plupart des cas. Le reconditionné existe pour AirPods et équivalents.",
  },
  "Casque audio": {
    reparer: "Pour un casque, les coussinets et le câble sont facilement remplaçables. La réparation est pertinente si le coût reste sous 25 % du neuf.",
    remplacer: "Remplacer si le driver ou la carte Bluetooth est HS. Le reconditionné est courant pour les casques premium.",
  },
  "Vélo électrique": {
    reparer: "Pour un VAE, batterie et moteur sont les pièces les plus coûteuses. Le reste (freins, câbles, pneus) est souvent réparable en DIY ou chez un vélociste.",
    remplacer: "Remplacer si la batterie ou le moteur est HS et que le coût dépasse 40 % du neuf. L'occasion est courante pour les vélos électriques.",
  },
  "Montre connectée": {
    reparer: "Pour une montre connectée, la réparation est rarement rentable : composants miniaturisés, étanchéité à préserver. La batterie peut parfois être changée sur certains modèles.",
    remplacer: "Remplacer dans la plupart des cas. Le reconditionné existe pour Apple Watch et Galaxy Watch.",
  },
}
