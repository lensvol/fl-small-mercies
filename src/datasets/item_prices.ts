const ITEM_PRICES_BY_ID: Map<number, number> = new Map([
    // Pennies
    [22390, 0.01],
    // Crystallised Curio
    [142359, 2.50],
    // Stashed Treasure
    [144025, 0.01],
    // Pieces of Plunder Weighing Down Your Hold
    [144024, 0.01],
    // Hillmover
    [140900, 12.50],
    // Shard of Glim the Size of a Small Child
    [142094, 16.50
    // Unassuming Crate
    [142710, 20.00],
    // Hiding Place of a Peculiar Item
    [142447, 102.50],
    // A Blue and Shining Stone
    [22523, 12.5],
    // A Boxed Cat?
    [634, 0.1],
    // A Headful of Picaresque Tales
    [22522, 12.5],
    // A Miniature Model Ship (via Certifiable Scrap)
    [108650, 10 * 0.4875],
    // A Mislaid Diamond
    [144306, 12.5],
    // A Monstrous Orb
    [102578, 6],
    // A Partially Unwrapped Cat?
    [635, 0.5],
    // A River In A Box
    [16677, 32.5],
    // A Sealed Copy of the Crimson Book (via Touching Love Story)
    [107903, 625 * 2.5],
    // A Seat at the Board
    [144796, 1562.5],
    // A Tasting Flight of Targeted Toxins
    [142504, 1562.5],
    // Admiral-in-a-Box (via Certifiable Scrap)
    [141644, 5 * 0.4875],
    // Aeolian Scream
    [773, 2.5],
    // Albatross Wing
    [140850, 12.5],
    // Alluring Accomplice
    [350, 62.5],
    // Amanita Sherry
    [928, 0.1],
    // Amber-Topped Walking-Stick
    [335, 32.4],
    // Ambiguous Eolith
    [122485, 0.5],
    // An Identity Uncovered!
    [657, 2.5],
    // Anarchist's Sable
    [1044, 6],
    // Ancient Hunting Rifle
    [329, 12.5],
    // Anning's Patent Ribcage Breastplate (via Hinterland Scrip)
    [142588, 1750 * 0.5],
    // Annings' Complete and Reliable Kit for the Preservation and Display of Skeletons (via Hinterland Scrip)
    [141546, 62 * 0.5],
    // Anticandle (via Bone Fragments)
    [142750, 250 * 0.01],
    // Antique Constable's Badge
    [748, 25],
    // Antique Mystery
    [946, 12.5],
    // Apostate's Psalm
    [142250, 2.5],
    // Appalling Secret
    [390, 0.15],
    // Araby Fighting-Weasel
    [498, 0.5],
    // Ascended Ambergris (via Stuiver)
    [145002, 50 * 0.05],
    // Avid Glove
    [294, 6.4],
    // Baited Riddle (via Whispered Hint)
    [143912, 6250 * 0.01],
    // Bandage Scrap (via Shard of Glim)
    [144247, 1 * 0.01],
    // Baptised Rattus Faber Corpse
    [14620, 2.5],
    // Basket of Rubbery Pies
    [140894, 2.5],
    // Bat with Attitude
    [485, 12.5],
    // Battered Grey Overcoat
    [315, 6.4],
    // Bazaar Permit
    [741, 12.5],
    // Beguiling Mask
    [310, 62.5],
    // Bejewelled Lens
    [763, 12.5],
    // Bengal Tigress
    [728, 312.5],
    // Bessemer Steel Ingot (via Tempestuous Tale)
    [141159, 1 * 0.5],
    // Bifurcated Owl
    [899, 200],
    // Blackmail Material
    [858, 12.5],
    // Blood Oath (via Stuiver)
    [146694, 10 * 0.05],
    // Bloodstained Suit
    [722, 0.2],
    // Bone Fragments
    [140889, 0.01],
    // Book of Hidden Bodies
    [746, 6],
    // Bottle of Broken Giant 1844
    [823, 2.5],
    // Bottle of Fourth City Airag: Year of the Tortoise
    [824, 62.5],
    // Bottle of Greyfields 1868 First Sporing
    [473, 0.2],
    // Bottle of Greyfields 1879
    [382, 0.01],
    // Bottle of Greyfields 1882
    [383, 0.02],
    // Bottle of Morelways 1872
    [815, 0.1],
    // Bottle of Strangling Willow Absinthe
    [822, 0.5],
    // Bottled Oblivion
    [557, 0.01],
    // Brass Ring
    [482, 12.5],
    // Breath of the Void
    [934, 1560],
    // Bright Brass Skull
    [749, 60],
    // Brilliant Soul
    [668, 0.5],
    // Bundle of Fourth City Rags
    [314, 0.3],
    // Bundle of Glad Rags
    [723, 0.2],
    // Bundle of Ragged Clothing
    [313, 0.01],
    // Captivating Ballad
    [142386, 62.5],
    // Carnelian Sapphire Pendant
    [145127, 75],
    // Cartographer's Hoard
    [141189, 312.5],
    // Carved Ball of Stygian Ivory
    [122483, 2.5],
    // Caustic Apocryphon (via Stuiver)
    [144751, 250 * 0.05],
    // Cave-Aged Code of Honour (via Legal Document)
    [141883, 1 * 12.5],
    // Celebrated Short Story
    [18396, 130],
    // Cellar of Wine
    [736, 12.5],
    // Cheerful Goldfish
    [464, 0.04],
    // Chimerical Archive
    [142448, 62.5],
    // Classic Short Story
    [18381, 180],
    // Clockwork Drownie (via Certifiable Scrap)
    [141643, 5 * 0.4875],
    // Collection of Curiosities
    [743, 6],
    // Compelling Short Story
    [18308, 30],
    // Competent Short Story
    [18100, 10],
    // Complaisant Frost-Moth
    [23899, 5],
    // Comprehensive Bribe
    [742, 12.5],
    // Compromising Document
    [830, 0.5],
    // Conceptual Breakthrough in Currency Design
    [142754, 12.5],
    // Copper Cipher Ring
    [758, 37.5],
    // Correspondence Plaque
    [932, 0.5],
    // Corresponding Ocelot
    [877, 35],
    // Corsetted Dress
    [717, 12.5],
    // Coruscating Soul
    [669, 312.5],
    // Crackling Device
    [142840, 62.5],
    // Crate of Incorruptible Biscuits
    [140892, 2.5],
    // Cryptic Clue
    [389, 0.02],
    // Cryptobotanical Rosette
    [862, 0.5],
    // Dark-Dewed Cherry
    [618, 0.7],
    // Dazed Raven Advisor
    [342, 6.4],
    // Deep-zee Catch
    [122484, 0.5],
    // Deshrieked Mandrake
    [343, 6.4],
    // Devilbone Die
    [653, 0.9],
    // Devilish Fedora
    [21847, 200],
    // Devilish Probability Distributor
    [141281, 62.5],
    // Devilishly Slinky Evening Gown (via Hinterland Scrip)
    [141680, 500 * 0.5],
    // Devious Henchman
    [348, 12.5],
    // Devious Raven Advisor
    [14734, 90],
    // Diary of the Dead
    [762, 60],
    // Dignified Tailcoat
    [320, 12.5],
    // Direful Reflection
    [105858, 12.5],
    // Dismal Victuals (via Touching Love Story)
    [144241, 1 * 2.5],
    // Distinguished Gentleman's Outfit
    [322, 62.5],
    // Dove Mask Shard
    [678, 0.25],
    // Dreadful Surmise
    [814, 312.5],
    // Dreamy Raven Advisor
    [14431, 9],
    // Drop of Prisoner's Honey
    [391, 0.02],
    // Dubious Testimony
    [13929, 0.5],
    // Eager Glove
    [293, 2.5],
    // Edicts of the First City
    [142087, 312.5],
    // Elegant Emerald Gown
    [321, 62.5],
    // Element of Dawn
    [122493, 62.5],
    // Elemental Secret
    [14975, 312.5],
    // Emergency Blunderbuss
    [1004, 0.2],
    // Emetic Revelation (via Cryptic Clue)
    [142709, 625 * 0.02],
    // Endowment of a University Fellowship
    [759, 50],
    // Engraved Pewter Tankard
    [757, 47.5],
    // Entry in Slowcake's Exceptionals
    [752, 27.5],
    // Epaulette Mate (via Hinterland Scrip)
    [140971, 50 * 0.5],
    // Exceptional Hat
    [311, 62.5],
    // Exceptional Short Story
    [18310, 60],
    // Exigent Note
    [143056, 62.5],
    // Exquisite Ivory Gown
    [326, 230.4],
    // Extraordinary Hat
    [312, 312.5],
    // Extraordinary Implication
    [809, 2.5],
    // Extraordinary Short Story
    [18311, 70],
    // Eyeless Skull
    [23504, 30],
    // F.F. Gebrandt's Flame-Resilient Paper
    [142190, 0.5],
    // F.F. Gebrandt's Superior Laudanum
    [477, 0.1],
    // F.F. Gebrandt's Tincture of Vigour
    [470, 0.1],
    // F.F. Gebrandt's Tincture of Vigour: Half-Full
    [471, 0.03],
    // Fabulous Diamond
    [12187, 312.5],
    // Faded Morning Suit
    [726, 0.2],
    // Fairly Tame Sorrow-Spider
    [344, 6.4],
    // False Hagiotoponym
    [142249, 62.5],
    // False Lead
    [813, 0.02],
    // Far Khanate Lacquered Armour
    [21892, 200],
    // Favour in High Places
    [744, 12.5],
    // Fecund Amber Tiara
    [21845, 200],
    // Femur of a Jurassic Beast (via Hinterland Scrip)
    [140773, 2 * 0.5],
    // Femur of a Surface Deer
    [140771, 0.1],
    // Final Breath
    [141161, 0.5],
    // Fingerking Scale (via Correspondence Plaque)
    [144217, 1 * 0.5],
    // Firkin of Hesperidean Cider
    [410, 80000],
    // First City Coin
    [582, 0.25],
    // Fistful of Surface Currency
    [421, 0.03],
    // Flask of Abominable Salts
    [476, 0.1],
    // Flawed Diamond
    [449, 0.12],
    // Fluke Spine, Freely Given (via Knotted Humerus)
    [144215, 1 * 3.0],
    // Fluke-Core
    [106683, 1560],
    // Focused Albatross
    [140724, 12.5],
    // Formidable Gown
    [720, 12.5],
    // Fossilised Forelimb (via Hinterland Scrip)
    [141540, 25 * 0.5],
    // Fourth-City Echo (via Rat-Shilling)
    [142797, 125 * 0.1],
    // Foxfire Candle Stub
    [374, 0.01],
    // Fragment of White Gold
    [676, 0.4],
    // Fragment of the Tragedy Procedures
    [123213, 62.5],
    // Fraught Research Assistant
    [118788, 12.5],
    // Frayed Thread (via Silk Scrap)
    [144315, 1 * 0.01],
    // Fungal Dangers and Poisons: A Guide for New Growers (via Hinterland Scrip)
    [141569, 40 * 0.5],
    // Gay Bonnet
    [308, 2.5],
    // Gentleman's Athletic Support
    [718, 6.4],
    // Gentleman's Hat
    [305, 2.5],
    // Gift of Scorn
    [560, 0.2],
    // Gift of Transcendent Devotion
    [561, 2],
    // Glim-Encrusted Carapace (via Stuiver)
    [145008, 1250 * 0.05],
    // Glimpse of Anathema
    [145282, 312.5],
    // Grubby Urchin
    [346, 14.4],
    // Hand-picked Peppercaps (via Hinterland Scrip)
    [141541, 1 * 0.5],
    // Haunted-looking Dog
    [818, 2],
    // Helical Thighbone (via Hinterland Scrip)
    [141480, 2 * 0.5],
    // Highwayman's Cloak (via Hinterland Scrip)
    [141627, 400 * 0.5],
    // Horsehead Amulet
    [468, 2],
    // Impossible Theorem
    [106142, 1562.6],
    // Incisive Observation
    [140898, 0.5],
    // Infernal Contract
    [426, 0.2],
    // Infernal Sharpshooter's Rifle
    [21896, 210],
    // Infernally Well-cut Suit (via Hinterland Scrip)
    [141681, 500 * 0.5],
    // Inkling of Identity
    [656, 0.1],
    // Insatiable Glove
    [301, 62.5],
    // Intriguer's Compendium
    [931, 312.5],
    // Intriguing Snippet
    [588, 0.2],
    // Iron Hat
    [304, 6.4],
    // Iron Republic Journal
    [1064, 15],
    // Irresistible Drum
    [338, 25.6],
    // Ivory Humerus (via Hinterland Scrip)
    [140849, 25 * 0.5],
    // Jade Fragment
    [377, 0.01],
    // Jasmine Leaves
    [141374, 0.1],
    // Journal of Infamy
    [525, 0.5],
    // Judgements' Egg
    [122486, 62.5],
    // Knob of Scintillack
    [122495, 2.5],
    // Legal Document
    [739, 12.5],
    // Legenda Cosmogone
    [142295, 312.5],
    // Light-Drinking Cravat
    [145126, 6.25],
    // Limpid Soul (via Knob of Scintillack)
    [144219, 1 * 2.5],
    // Lithification Liquid (via Hinterland Scrip)
    [141548, 12 * 0.5],
    // Live Specimen
    [122488, 2.5],
    // London Street Sign
    [392, 2.5],
    // Lucky Weasel
    [441, 0.2],
    // Lump of Lamplighter Beeswax
    [384, 0.01],
    // M. Demeaux's Advice for Captains: Commemorative Edition
    [116011, 5],
    // Magisterial Lager (via Hinterland Scrip)
    [141574, 1 * 0.5],
    // Magnificent Diamond
    [12188, 12.5],
    // Magnificent Midnight-Blue Evening Gown
    [324, 90],
    // Maidservant's Uniform
    [725, 0.2],
    // Malevolent Monkey
    [351, 45],
    // Maniac's Prayer
    [935, 0.1],
    // Map Scrap
    [920, 0.1],
    // Mask of the Rose
    [555, 0.1],
    // Masterful Short Story
    [18312, 80],
    // Memory of Distant Shores
    [825, 0.5],
    // Memory of Light (via Cryptic Clue)
    [589, 25 * 0.02],
    // Memory of Moonlight (via Stuiver)
    [144977, 250 * 0.05],
    // Memory of Sunlight (via Mourning Candle)
    [144218, 1 * 2.5],
    // Memory of a Much Stranger Self (via Stuiver)
    [144983, 250 * 0.05],
    // Memory of a Shadow in Varchas (via Hinterland Scrip)
    [142659, 25 * 0.5],
    // Meticulously Altered Stocking (via Primordial Shriek)
    [106571, 2000 * 2.5],
    // Midnight Matriarch
    [21898, 200],
    // Mirthless Compendium of Statistical Observations
    [141283, 12.5],
    // Misplaced Ring (via Hinterland Scrip)
    [142589, 1750 * 0.5],
    // Model Infernal Locomotive (via Certifiable Scrap)
    [141641, 5 * 0.4875],
    // Modish Bonnet
    [465, 0.5],
    // Moon-Pearl
    [379, 0.01],
    // Morning Suit
    [719, 14.4],
    // Mountain-sherd
    [122492, 62.5],
    // Mourning Candle
    [951, 2.5],
    // Moves in the Great Game
    [122490, 0.5],
    // Much-Needed Gap (via Assortment of Khaganian Coinage)
    [142855, 125 * 0.5],
    // Muscaria Brandy
    [927, 2.5],
    // Mystery of the Elder Continent
    [587, 0.5],
    // Mystic Raven Advisor
    [14731, 90],
    // Neddy Suit
    [1043, 6],
    // Neo-Echo (via Jasmine Leaves)
    [144213, 1 * 0.1],
    // Nevercold Brass Sliver
    [387, 0.01],
    // Nicatorean Relic
    [141916, 2.5],
    // Night on the Town
    [735, 2.5],
    // Night-Trimmed Frock Coat
    [323, 90],
    // Night-Whisper
    [933, 62.5],
    // Nightsoil of the Bazaar (via Hinterland Scrip)
    [141158, 1 * 0.5],
    // Nikolas & Sons Instant Ablution Absolution
    [523, 0.25],
    // No Currency (via Venom-Ruby)
    [144214, 1 * 0.1],
    // Nodule of Deep Amber
    [385, 0.01],
    // Nodule of Fecund Amber
    [16308, 312.5],
    // Nodule of Pulsating Amber
    [754, 62.5],
    // Nodule of Trembling Amber
    [949, 12.5],
    // O'Boyle's Practical Primer in the Various Languages of Nippon, Tartary, Cathay and the Princedoms of the Raj
    [756, 27.5],
    // Obdurate Stallion
    [875, 35],
    // Ocular Toadbeast
    [876, 35],
    // Old Bone Skeleton Key
    [753, 57.5],
    // Oneiric Pearl (via Assortment of Khaganian Coinage)
    [142666, 125 * 0.5],
    // Oneiromantic Revelation
    [142662, 62.5],
    // Ornate Typewriter
    [755, 30],
    // Ostentatious Diamond
    [12186, 0.5],
    // Ounce of Lily-Balm (via Brilliant Soul)
    [144243, 1 * 0.5],
    // Outfit of Black Felt Garments
    [317, 2.88],
    // Overgoat
    [355, 5856.4],
    // Page from the Liber Visionis
    [619, 0.5],
    // Pair of Balmoral Boots (via Hinterland Scrip)
    [141538, 125 * 0.5],
    // Pair of Cracksman's Mittens
    [296, 6.4],
    // Pair of Cutpurse's Mittens
    [292, 1.6],
    // Pair of Dancemaster's Dabs
    [298, 6.4],
    // Pair of Forgotten Spidersilk Slippers
    [23902, 160],
    // Pair of Hushed Spidersilk Slippers
    [363, 160],
    // Pair of Iron Manacles
    [290, 0.4],
    // Pair of Irrigo Goggles
    [23901, 12.8],
    // Pair of Kingscale Boots
    [21846, 230],
    // Pair of Knife-and-Candler's Gloves
    [295, 2.5],
    // Pair of Lady's Lace Gloves
    [299, 6.4],
    // Pair of Leg Irons
    [356, 0.4],
    // Pair of Lenguals
    [21848, 200],
    // Pair of Luminous Neathglass Goggles
    [307, 6.4],
    // Pair of Magician's Gloves
    [291, 2.5],
    // Pair of Master Thief's Hands
    [302, 160],
    // Pair of Masterwork Dancing Slippers
    [360, 32.4],
    // Pair of Neathglass Goggles
    [306, 2.5],
    // Pair of Ratskin Boots
    [362, 62.5],
    // Pair of Savage Hob-Nailed Boots
    [361, 6.4],
    // Pair of Scarlet Stockings of Dubious Origin
    [467, 0.4],
    // Pair of Scuffed Boots
    [765, 0.1],
    // Pair of Spiderchitin Gauntlets
    [297, 6.4],
    // Pair of Spidersilk Slippers
    [359, 6.4],
    // Pair of Squeakless Boots
    [358, 2.5],
    // Pair of Stylish Riding Boots
    [357, 2.5],
    // Pair of Vakeskin Boots
    [364, 160],
    // Palimpsest Scrap
    [142251, 0.5],
    // Parabola-Linen Frock
    [21893, 230],
    // Parabola-Linen Scrap
    [924, 62.5],
    // Parabola-Linen Suit
    [21891, 230],
    // Parabolan Parable
    [142463, 312.5],
    // Partial Map
    [956, 2.5],
    // Patent Osteological Sand and Wax (via Hinterland Scrip)
    [141543, 12 * 0.5],
    // Patent Scrutinizer
    [339, 6.4],
    // Patent Scrutinizer Deluxe!
    [340, 160],
    // Personal Recommendation
    [740, 6],
    // Philosophical Raven Advisor
    [14730, 40],
    // Phosphorescent Scarab
    [652, 0.1],
    // Piece of Rostygold
    [375, 0.01],
    // Pirate Hat
    [466, 0.5],
    // Poison-Tipped Umbrella
    [729, 225],
    // Portfolio of Souls
    [747, 12.5],
    // Pot of Venison Marrow
    [141486, 0.5],
    // Presbyterate Passphrase
    [852, 2.5],
    // Preserved Surface Blooms
    [141157, 2.5],
    // Primaeval Hint
    [832, 62.5],
    // Primordial Shriek
    [388, 0.02],
    // Prison Shiv
    [491, 0.01],
    // Prisoner's Mask
    [303, 0.04],
    // Proscribed Material
    [420, 0.04],
    // Puzzle-Damask Scrap
    [923, 12.5],
    // Puzzling Map
    [959, 12.5],
    // Queen Mate (via Hinterland Scrip)
    [140970, 50 * 0.5],
    // Queer Soul
    [122798, 2.5],
    // Railway Steel (via Hinterland Scrip)
    [141162, 19 * 0.5],
    // Rat on a String
    [376, 0.01],
    // Ratskin Suit
    [318, 62.5],
    // Rattus Faber Bandit-Chief
    [353, 160],
    // Rattus Faber Rifle
    [331, 2.5],
    // Ratty Reliquary
    [123214, 12.5],
    // Ratwork Derringer
    [332, 250],
    // Ratwork Mechanism (via Stuiver)
    [145640, 250 * 0.05],
    // Ratwork Watch
    [655, 230],
    // Ravenglass Knife
    [330, 51.2],
    // Ravenous Henchman
    [23900, 28.8],
    // Ray-Drenched Cinder
    [1053, 312.5],
    // Red-Feathered Pin
    [761, 35],
    // Relatively Safe Zee Lane
    [143646, 62.5],
    // Relic of the Fifth City
    [145558, 2.5],
    // Relic of the Fourth City
    [423, 0.05],
    // Relic of the Second City
    [425, 0.15],
    // Relic of the Third City
    [424, 0.1],
    // Reported Location of a One-Time Prince of Hell
    [929, 1560],
    // Reprehensible Lizard
    [442, 0.2],
    // Respectable Grey Gown
    [319, 14.4],
    // Ridiculous Hat
    [556, 0.01],
    // Ring of Stone
    [675, 0.3],
    // Ripened Wheel of Hellworm Cheese
    [143588, 62.5],
    // Romantic Notion
    [531, 0.1],
    // Roof-Chart (via Stuiver)
    [144982, 50 * 0.05],
    // Rookery Password
    [751, 60],
    // Rostygold Ring
    [145128, 6.25],
    // Rough Gown
    [721, 0.2],
    // Royal-Blue Feather
    [122494, 0.5],
    // Rubbery Associate
    [354, 0.2],
    // Rubbery Conspirator
    [448, 0.01],
    // Rubbery Euphonium
    [817, 3],
    // Rumour of the Upper River
    [141194, 2.5],
    // Rumourmonger's Network
    [930, 1560],
    // Rusted Stirrup
    [141913, 0.1],
    // Ruthless Henchman
    [349, 62.5],
    // Salt Steppe Atlas
    [142202, 62.5],
    // Salt Weasel
    [816, 2.5],
    // Sample of Lacreous Affection
    [143044, 312.5],
    // Sample of Roof-Drip (via Stuiver)
    [144821, 2 * 0.05],
    // Sap of the Cedar at the Crossroads (via Hinterland Scrip)
    [143050, 125 * 0.5],
    // Sapphire
    [643, 0.12],
    // Sausage About Which No One Complains
    [140891, 12.5],
    // Scrap of Incendiary Gossip
    [659, 0.5],
    // Scrap of Ivory Organza
    [925, 312.5],
    // Scuttering Squad
    [1005, 10],
    // Searing Enigma
    [821, 62.5],
    // Secluded Address
    [658, 0.5],
    // Secret College (via Searing Enigma)
    [118813, 25 * 62.5],
    // Selenitic Fragment (via Aeolian Scream)
    [144296, 1 * 2.5],
    // Semiotic Monocle
    [727, 312.5],
    // Set of Intricate Kifers
    [337, 312.5],
    // Set of Kifers
    [336, 32.4],
    // Set of Workman's Clothes
    [436, 0.08],
    // Seven-Throated Warbler
    [140709, 12.5],
    // Shabby Opera Cloak
    [724, 0.2],
    // Shard of Glim
    [378, 0.01],
    // Shard of Lightless Glim (via Piece of Rostygold)
    [144216, 1 * 0.01],
    // Short Story
    [18101, 2],
    // Shrivelled Ball
    [677, 0.3],
    // Sighting of a Parabolan Landmark
    [142660, 0.1],
    // Silent Soul
    [23695, 12.5],
    // Silk Scrap
    [381, 0.01],
    // Silvered Cat's Claw
    [141917, 0.1],
    // Skyglass Knife
    [327, 3.2],
    // Slavering Dream-Hound
    [878, 35],
    // Smock of Four Thousand Three Hundred and Eight Pockets
    [21895, 210],
    // Sneak-Thief's Mask
    [309, 10],
    // Snuffer's Face
    [21894, 200],
    // Sober Dress
    [435, 0.08],
    // Solacefruit
    [122491, 0.5],
    // Soothe & Cooper Long-Box (via An Identity Uncovered!)
    [114982, 25 * 2.5],
    // Soul
    [386, 0.02],
    // Sporing Bonnet
    [544, 1.5],
    // Stained Red Velvet Gown
    [316, 6.4],
    // Stalemate (via Hinterland Scrip)
    [140980, 125 * 0.5],
    // Starry-Eyed Scoundrel
    [140648, 14],
    // Starstone Demark
    [936, 312.5],
    // Starved Expression (via Stuiver)
    [144822, 10 * 0.05],
    // Stolen Correspondence
    [422, 0.05],
    // Stolen Kiss
    [944, 2.5],
    // Storm-Threnody
    [849, 12.5],
    // Strange-Shore Parabola Frock
    [23897, 470],
    // Strange-Shore Parabola Suit
    [23898, 470],
    // Strong-Backed Labour
    [764, 2.5],
    // Sulky Bat
    [443, 0.2],
    // Sumptuous Dandy's Outfit
    [325, 230],
    // Surface-Silk Scrap
    [907, 0.1],
    // Survey of the Neath's Bones (via Hinterland Scrip)
    [141170, 1 * 0.5],
    // Sworn Statement
    [13928, 2.5],
    // Tailfeather Brilliant as Flame
    [141160, 2.5],
    // Tale of Terror!!
    [828, 0.5],
    // Talkative Rattus Faber
    [558, 0.5],
    // Tantalising Possibility
    [145109, 0.1],
    // Tasselled Sword-Cane
    [334, 14.4],
    // Tasselled Walking-Stick
    [333, 2.5],
    // Tempestuous Tale (via Stuiver)
    [144955, 10 * 0.05],
    // Tentacle Mitts (via Hinterland Scrip)
    [141628, 400 * 0.5],
    // Thirsty Bombazine Scrap
    [922, 2.5],
    // Thrilling Short Story
    [18309, 50],
    // Tin of Zzoup
    [121611, 2.5],
    // Tinned Ham
    [141542, 63.5],
    // Tiny Jewelled Reliquary
    [750, 35],
    // Touching Love Story
    [945, 2.5],
    // Trace of Viric
    [141914, 0.5],
    // Tracklayer's Helmet (via Hinterland Scrip)
    [141539, 125 * 0.5],
    // Trade Secret
    [13640, 60],
    // Tub of Gloam-Foam
    [21897, 200],
    // Twelve-Carat Diamond Ring
    [730, 225],
    // Uncanny Incunabulum
    [812, 12.5],
    // Unearthly Fossil
    [810, 2.5],
    // Unidentified Thigh Bone (via Hinterland Scrip)
    [140756, 1 * 0.5],
    // Unjustifiable Necktie
    [145129, 75],
    // Unlawful Device
    [141946, 12.5],
    // Unloved Short Story
    [18379, 1],
    // Unprovenanced Artefact
    [122487, 2.5],
    // Unscrupulous Raven Advisor
    [14733, 40],
    // Unusual Love Story
    [829, 0.5],
    // Use of Villains
    [737, 6],
    // Veils-Velvet Scrap
    [926, 1560],
    // Venge-Rat Corpse
    [14621, 0.5],
    // Venom-Ruby
    [642, 0.1],
    // Venom-Ruby Lure
    [145125, 6.25],
    // Vestige of a Starlit Reverie
    [143045, 312.5],
    // Vial of Cantigaster Venom
    [104821, 312.5],
    // Vial of Masters' Blood
    [24121, 1562.6],
    // Vial of Tears of the Bazaar
    [12350, 312.5],
    // Vienna Opening (via Hinterland Scrip)
    [140978, 5 * 0.5],
    // Virginia's Spare Pillbox Hat
    [140608, 35],
    // Vision of the Surface
    [827, 0.5],
    // Vital Intelligence
    [122489, 12.5],
    // Vitreous Almanac
    [142661, 12.5],
    // Volume of Collated Research
    [745, 2.5],
    // Voracious Glove
    [300, 57.6],
    // Wary Raven Advisor
    [14732, 9],
    // Waswood Almanac
    [142669, 312.5],
    // Weasel of Woe
    [144549, 100],
    // Whirring Contraption
    [738, 6],
    // Whisper-Satin Scrap
    [915, 0.5],
    // Whispered Hint
    [380, 0.01],
    // Winsome Dispossessed Orphan
    [347, 32.4],
    // Wolfie
    [484, 0.01],
    // Working Rat
    [345, 32.4],
    // Zee-Ztory
    [831, 0.5],
    // Übergoat
    [102305, 11712.8],
]);

export {ITEM_PRICES_BY_ID};

