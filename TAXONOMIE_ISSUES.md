# Taxonomie des problèmes (issue types) — Compare.

**Source unique** : `src/lib/data.js` → `ISS_TPL`  
**Utilisation** : `getIssues(item)` dans `src/lib/helpers.js` → `ISS_TPL[item.productType] || ISS_TPL.default`

---

## Convention des clés

- **Label** : `n` (affiché à l'écran)
- **Clé technique (ix)** : champ `ix` quand présent (ex: `screen`, `battery`). Sinon vide.
- **issue_type pour CSV** : utiliser le slug du label = `slugify(n)` = minuscules, sans accents, espaces → tirets  
  Exemple : "Écran cassé" → `ecran-casse`

---

## Produits utilisant `default` (2 problèmes communs)

Les types de produits suivants **n'ont pas d'entrée dans ISS_TPL** et utilisent donc `default` :

- PC Bureau
- All-in-One
- Vidéoprojecteur
- Barre de son
- Enceinte connectée
- Platine vinyle
- Appareil photo hybride
- Appareil photo compact
- Caméra action
- Drone
- Casque gaming
- VTT
- Bracelet connecté

**Liste default** (identique pour tous) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Pièce d'usure | piece-d-usure | (vide) |
| 2 | Usure normale | usure-normale | (vide) |

---

## Par catégorie et type de produit

### smartphones

**Smartphone** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Écran cassé | ecran-casse | screen |
| 2 | Batterie usée | batterie-usee | battery |
| 3 | Caméra arrière HS | camera-arriere-hs | camera |
| 4 | Caméra avant / Face ID | camera-avant-face-id | front-camera |
| 5 | Connecteur de charge | connecteur-de-charge | charging-port |
| 6 | Haut-parleur | haut-parleur | speaker |
| 7 | Micro HS | micro-hs | microphone |
| 8 | Bouton power / volume | bouton-power-volume | buttons |
| 9 | Vitre arrière cassée | vitre-arriere-cassee | back-cover |
| 10 | WiFi / Bluetooth HS | wifi-bluetooth-hs | antenna |
| 11 | Vibreur HS | vibreur-hs | taptic-engine |

---

### tablettes

**Tablette** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Écran cassé | ecran-casse | screen |
| 2 | Batterie usée | batterie-usee | battery |
| 3 | Connecteur charge | connecteur-charge | charging-port |
| 4 | Haut-parleur | haut-parleur | speaker |
| 5 | Bouton home / Touch ID | bouton-home-touch-id | home-button |

---

### ordinateurs

**PC Portable** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Écran cassé | ecran-casse | display |
| 2 | Batterie usée | batterie-usee | battery |
| 3 | Clavier défectueux | clavier-defectueux | keyboard |
| 4 | Upgrade SSD | upgrade-ssd | ssd |
| 5 | Charnière cassée | charniere-cassee | hinge |
| 6 | Ventilateur bruyant | ventilateur-bruyant | fan |
| 7 | Touchpad HS | touchpad-hs | trackpad |
| 8 | Port USB / HDMI | port-usb-hdmi | ports |
| 9 | Upgrade RAM | upgrade-ram | ram |

**PC Bureau** : utilise `default`  
**All-in-One** : utilise `default`

---

### consoles

**Console de salon** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Lecteur disque HS | lecteur-disque-hs | disc-drive |
| 2 | Ventilateur bruyant | ventilateur-bruyant | fan |
| 3 | Port HDMI HS | port-hdmi-hs | hdmi |
| 4 | Surchauffe / pâte thermique | surchauffe-pate-thermique | thermal-paste |
| 5 | Alimentation HS | alimentation-hs | power-supply |
| 6 | SSD / stockage plein | ssd-stockage-plein | ssd |
| 7 | WiFi / Bluetooth | wifi-bluetooth | wifi |
| 8 | Bouton power | bouton-power | power-button |

**Console portable** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Écran cassé | ecran-casse | screen |
| 2 | Batterie faible | batterie-faible | battery |
| 3 | Stick drift | stick-drift | joystick |
| 4 | Rail Joy-Con / port | rail-joy-con-port | rail |
| 5 | Ventilateur | ventilateur | fan |
| 6 | Haut-parleur | haut-parleur | speaker |

**Manette** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Stick drift (joystick) | stick-drift-joystick | joystick |
| 2 | Boutons défectueux | boutons-defectueux | buttons |
| 3 | Gâchettes cassées | gachettes-cassees | triggers |
| 4 | Batterie usée | batterie-usee | battery |
| 5 | Bluetooth / connexion | bluetooth-connexion | bluetooth |
| 6 | Vibration HS | vibration-hs | haptics |

**Casque gaming** : utilise `default`

---

### tv

**Téléviseur** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Dalle cassée | dalle-cassee | (vide) |
| 2 | Rétroéclairage HS | retroeclairage-hs | (vide) |
| 3 | Carte alimentation | carte-alimentation | (vide) |
| 4 | Carte T-Con | carte-t-con | (vide) |
| 5 | Port HDMI | port-hdmi | (vide) |
| 6 | Haut-parleurs | haut-parleurs | (vide) |

**Moniteur PC** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Rétroéclairage HS | retroeclairage-hs | (vide) |
| 2 | Carte alimentation | carte-alimentation | (vide) |
| 3 | Port HDMI / DisplayPort | port-hdmi-displayport | (vide) |

**Vidéoprojecteur** : utilise `default`  
**Barre de son** : utilise `default`

---

### audio

**Écouteurs sans fil** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie écouteur usée | batterie-ecouteur-usee | (vide) |
| 2 | Batterie boîtier usée | batterie-boitier-usee | (vide) |
| 3 | Grille / mesh sale | grille-mesh-sale | (vide) |
| 4 | Son d'un côté seulement | son-dun-cote-seulement | (vide) |

**Casque audio** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Coussinets usés | coussinets-uses | (vide) |
| 2 | Batterie usée | batterie-usee | (vide) |
| 3 | Arceau cassé | arceau-casse | (vide) |
| 4 | Câble audio | cable-audio | (vide) |

**Enceinte Bluetooth** (liste dédiée) :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Haut-parleur HS | haut-parleur-hs | (vide) |
| 3 | Carte électronique | carte-electronique | (vide) |

**Enceinte connectée** : utilise `default`  
**Platine vinyle** : utilise `default`

---

### electromenager

**Lave-linge** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Pompe de vidange | pompe-de-vidange | (vide) |
| 2 | Roulements tambour | roulements-tambour | (vide) |
| 3 | Joint de hublot | joint-de-hublot | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |
| 5 | Résistance / chauffage | resistance-chauffage | (vide) |
| 6 | Courroie | courroie | (vide) |
| 7 | Électrovanne | electrovanne | (vide) |
| 8 | Palier tambour | palier-tambour | (vide) |
| 9 | Charbon moteur | charbon-moteur | (vide) |

**Lave-vaisselle** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Pompe de cyclage | pompe-de-cyclage | (vide) |
| 2 | Bras de lavage | bras-de-lavage | (vide) |
| 3 | Joint de porte | joint-de-porte | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |
| 5 | Résistance | resistance | (vide) |
| 6 | Pompe de vidange | pompe-de-vidange | (vide) |

**Sèche-linge** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance HS | resistance-hs | (vide) |
| 2 | Courroie | courroie | (vide) |
| 3 | Joint de porte | joint-de-porte | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |
| 5 | Pompe de vidange | pompe-de-vidange | (vide) |

**Réfrigérateur** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Compresseur HS | compresseur-hs | (vide) |
| 2 | Thermostat | thermostat | (vide) |
| 3 | Joint de porte | joint-de-porte | (vide) |
| 4 | Ventilateur | ventilateur | (vide) |
| 5 | Carte électronique | carte-electronique | (vide) |
| 6 | Distributeur eau/glaçons | distributeur-eau-glacons | (vide) |

**Congélateur** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Compresseur HS | compresseur-hs | (vide) |
| 2 | Joint de porte | joint-de-porte | (vide) |
| 3 | Thermostat | thermostat | (vide) |
| 4 | Ventilateur | ventilateur | (vide) |

**Four** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance HS | resistance-hs | (vide) |
| 2 | Joint de porte | joint-de-porte | (vide) |
| 3 | Ventilateur | ventilateur | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |
| 5 | Thermostat | thermostat | (vide) |

**Four encastrable** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance HS | resistance-hs | (vide) |
| 2 | Joint de porte | joint-de-porte | (vide) |
| 3 | Ventilateur | ventilateur | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |

**Micro-ondes** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Magnétron HS | magnetron-hs | (vide) |
| 2 | Plaque vitrocéramique | plaque-vitrocéramique | (vide) |
| 3 | Porte / charnière | porte-charniere | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |

**Aspirateur balai** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Moteur HS | moteur-hs | (vide) |
| 3 | Filtre bouché | filtre-bouche | (vide) |
| 4 | Brosse motorisée | brosse-motorisee | (vide) |
| 5 | Tube / manche cassé | tube-manche-casse | (vide) |

**Aspirateur robot** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Brosse principale | brosse-principale | (vide) |
| 3 | Capteurs HS | capteurs-hs | (vide) |
| 4 | Roue / roulette | roue-roulette | (vide) |
| 5 | Réservoir / serpillère | reservoir-serrpillere | (vide) |
| 6 | Station de charge | station-de-charge | (vide) |

**Robot cuisine** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Moteur / coupe HS | moteur-coupe-hs | (vide) |
| 2 | Joint bol | joint-bol | (vide) |
| 3 | Carte électronique | carte-electronique | (vide) |

**Cafetière expresso** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Pompe HS | pompe-hs | (vide) |
| 2 | Joint / calcaire | joint-calcaire | (vide) |
| 3 | Buse vapeur | buse-vapeur | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |

**Machine à café** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Pompe / percolateur | pompe-percolateur | (vide) |
| 2 | Calcaire | calcaire | (vide) |
| 3 | Réservoir / bac | reservoir-bac | (vide) |

**Plaque induction** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Plaque fissurée | plaque-fissuree | (vide) |
| 2 | Foyer ne chauffe plus | foyer-ne-chauffe-plus | (vide) |
| 3 | Carte électronique / puissance | carte-electronique-puissance | (vide) |
| 4 | Ventilateur | ventilateur | (vide) |

**Plaque vitrocéramique** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Plaque fissurée | plaque-fissuree | (vide) |
| 2 | Foyer ne chauffe plus | foyer-ne-chauffe-plus | (vide) |
| 3 | Carte électronique | carte-electronique | (vide) |
| 4 | Boutons / commandes | boutons-commandes | (vide) |

**Plaque gaz** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Bruleur encrassé | bruleur-encrasse | (vide) |
| 2 | Injecteur bouché | injecteur-bouche | (vide) |
| 3 | Thermocouple | thermocouple | (vide) |
| 4 | Robinet gaz | robinet-gaz | (vide) |

**Hotte aspirante** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Moteur HS | moteur-hs | (vide) |
| 2 | Filtre encrassé | filtre-encrasse | (vide) |
| 3 | Interrupteur | interrupteur | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |

**Cuisinière mixte** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance four HS | resistance-four-hs | (vide) |
| 2 | Plaque induction / gaz | plaque-induction-gaz | (vide) |
| 3 | Thermostat | thermostat | (vide) |
| 4 | Carte électronique | carte-electronique | (vide) |

---

### plomberie

**Robinet / Mitigeur** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Fuite au bec | fuite-au-bec | (vide) |
| 2 | Cartouche usée | cartouche-usee | (vide) |
| 3 | Calcaire / débit faible | calcaire-debit-faible | (vide) |

**WC / Toilettes** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Mécanisme chasse | mecanisme-chasse | (vide) |
| 2 | Joint cuvette | joint-cuvette | (vide) |
| 3 | Fuite | fuite | (vide) |

**Chauffe-eau** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance HS | resistance-hs | (vide) |
| 2 | Thermostat HS | thermostat-hs | (vide) |
| 3 | Anode usée | anode-usee | (vide) |
| 4 | Fuite / joint | fuite-joint | (vide) |
| 5 | Groupe de sécurité | groupe-de-securite | (vide) |

**Ballon thermodynamique** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance HS | resistance-hs | (vide) |
| 2 | Anode | anode | (vide) |
| 3 | Groupe de sécurité | groupe-de-securite | (vide) |

**Colonne de douche** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Cartouche | cartouche | (vide) |
| 2 | Fuite | fuite | (vide) |
| 3 | Buse / pommeau | buse-pommeau | (vide) |

---

### chauffage

**Chaudière gaz** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Carte électronique | carte-electronique | (vide) |
| 2 | Panne allumage | panne-allumage | (vide) |
| 3 | Échangeur entartré | echangeur-entartre | (vide) |
| 4 | Sonde / capteur | sonde-capteur | (vide) |
| 5 | Circulateur HS | circulateur-hs | (vide) |

**Pompe à chaleur** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Carte électronique | carte-electronique | (vide) |
| 2 | Compresseur | compresseur | (vide) |
| 3 | Détendeur | detendeur | (vide) |

**Radiateur électrique** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Résistance HS | resistance-hs | (vide) |
| 2 | Thermostat | thermostat | (vide) |
| 3 | Carte électronique | carte-electronique | (vide) |

**Climatiseur** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Compresseur HS | compresseur-hs | (vide) |
| 2 | Ventilateur | ventilateur | (vide) |
| 3 | Carte électronique | carte-electronique | (vide) |
| 4 | Filtre encrassé | filtre-encrasse | (vide) |

**Thermostat connecté** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Pile / alimentation | pile-alimentation | (vide) |
| 2 | Carte électronique | carte-electronique | (vide) |
| 3 | Connexion WiFi | connexion-wifi | (vide) |

---

### jardin

**Tondeuse** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Lame usée | lame-usee | (vide) |
| 2 | Filtre à air | filtre-a-air | (vide) |
| 3 | Bougie | bougie | (vide) |
| 4 | Moteur HS | moteur-hs | (vide) |

**Tondeuse robot** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Lames | lames | (vide) |
| 3 | Carte électronique | carte-electronique | (vide) |

**Taille-haie** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Lames | lames | (vide) |
| 2 | Câble | cable | (vide) |
| 3 | Moteur HS | moteur-hs | (vide) |

**Nettoyeur haute pression** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Lance / pistolet | lance-pistolet | (vide) |
| 2 | Pompe HS | pompe-hs | (vide) |
| 3 | Moteur | moteur | (vide) |

---

### velo

**Vélo électrique** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Moteur HS | moteur-hs | (vide) |
| 3 | Display / compteur | display-compteur | (vide) |
| 4 | Freins | freins | (vide) |
| 5 | Pneus / chambre à air | pneus-chambre-a-air | (vide) |
| 6 | Chaîne / dérailleur | chaine-derailleur | (vide) |

**Trottinette électrique** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Pneu crevé | pneu-creve | (vide) |
| 3 | Contrôleur HS | controleur-hs | (vide) |
| 4 | Frein | frein | (vide) |
| 5 | Écran / display | ecran-display | (vide) |

**VTT** : utilise `default`

---

### montres

**Montre connectée** :
| # | Label | issue_type (slug) | ix |
|---|-------|-------------------|-----|
| 1 | Batterie usée | batterie-usee | (vide) |
| 2 | Écran cassé | ecran-casse | (vide) |
| 3 | Bracelet usé | bracelet-use | (vide) |
| 4 | Capteurs HS | capteurs-hs | (vide) |

**Bracelet connecté** : utilise `default`

---

### photo

**Appareil photo hybride** : utilise `default`  
**Appareil photo compact** : utilise `default`  
**Caméra action** : utilise `default`  
**Drone** : utilise `default`

---

## Pour le CSV `offers`

**Conditions** : `new` | `refurbished` | `parts`

**issue_type** : utiliser le slug du label (ex: `ecran-casse`, `batterie-usee`, `piece-dusure`).  
Le slug est généré par `slugify(issue.name)` dans `src/lib/routes.js` :
- minuscules
- sans accents (é → e)
- espaces → tirets
- caractères non alphanumériques → tirets

---

## Sources contradictoires

**Aucune** : une seule source de vérité (`ISS_TPL` dans `data.js`). Les `POPULAR_SEARCHES` et `POPULAR_SEARCHES_IPHONE` contiennent des `intent` (ex: "Écran cassé", "Batterie HS") qui sont des libellés de problèmes pour l'affichage, pas une taxonomie distincte — ils correspondent à des labels existants dans ISS_TPL.

---

## Note sur Micro-ondes

Dans ISS_TPL ligne 452, le 2e item est `{ n: "Plaque vitrocéramique"` — il s'agit probablement d'une erreur (le micro-ondes n'a pas de plaque vitrocéramique au sens cuisson). C'est la donnée telle qu'elle existe dans le projet.

---

## Liste exhaustive des slugs pour CSV `offers`

**Conditions** : `new` | `refurbished` | `parts`

**issue_type** : utiliser exactement l'un des slugs ci-dessous (générés par `slugify(n)` du projet).  
L'apostrophe dans "Pièce d'usure" donne `piece-d-usure` (apostrophe → tiret).

```
alimentation-hs
anode
anode-usee
arceau-casse
batterie-boitier-usee
batterie-ecouteur-usee
batterie-faible
batterie-usee
bluetooth-connexion
bougie
bouton-home-touch-id
bouton-power
bouton-power-volume
boutons-commandes
boutons-defectueux
bracelet-use
bras-de-lavage
brosse-motorisee
brosse-principale
bruleur-encrasse
buse-pommeau
buse-vapeur
cable
cable-audio
calcaire
calcaire-debit-faible
camera-arriere-hs
camera-avant-face-id
capteurs-hs
carte-alimentation
carte-electronique
carte-electronique-puissance
carte-t-con
cartouche
cartouche-usee
chaine-derailleur
charbon-moteur
charniere-cassee
circulateur-hs
clavier-defectueux
compresseur
compresseur-hs
connecteur-charge
connecteur-de-charge
connexion-wifi
controleur-hs
courroie
coussinets-uses
dalle-cassee
detendeur
display-compteur
distributeur-eau-glacons
echangeur-entartre
ecran-casse
ecran-display
electrovanne
filtre-a-air
filtre-bouche
filtre-encrasse
foyer-ne-chauffe-plus
frein
freins
fuite
fuite-au-bec
fuite-joint
gachettes-cassees
grille-mesh-sale
groupe-de-securite
haut-parleur
haut-parleur-hs
haut-parleurs
injecteur-bouche
interrupteur
joint-bol
joint-calcaire
joint-cuvette
joint-de-hublot
joint-de-porte
lame-usee
lames
lance-pistolet
lecteur-disque-hs
magnetron-hs
mecanisme-chasse
micro-hs
moteur
moteur-coupe-hs
moteur-hs
palier-tambour
panne-allumage
piece-d-usure
pile-alimentation
plaque-fissuree
plaque-induction-gaz
plaque-vitroceramique
pneu-creve
pneus-chambre-a-air
pompe-de-cyclage
pompe-de-vidange
pompe-hs
pompe-percolateur
port-hdmi
port-hdmi-displayport
port-hdmi-hs
port-usb-hdmi
porte-charniere
rail-joy-con-port
reservoir-bac
reservoir-serpillere
resistance
resistance-chauffage
resistance-four-hs
resistance-hs
retroeclairage-hs
robinet-gaz
roue-roulette
roulements-tambour
son-d-un-cote-seulement
sonde-capteur
ssd-stockage-plein
station-de-charge
stick-drift
stick-drift-joystick
surchauffe-pate-thermique
thermocouple
thermostat
thermostat-hs
touchpad-hs
tube-manche-casse
upgrade-ram
upgrade-ssd
usure-normale
ventilateur
ventilateur-bruyant
vibration-hs
vibreur-hs
vitre-arriere-cassee
wifi-bluetooth
wifi-bluetooth-hs
```

**Important** : chaque type de produit n'accepte qu'un sous-ensemble de ces slugs. Pour un CSV valide, associer `issue_type` au `product_type` correspondant (voir les tableaux par catégorie ci-dessus).
