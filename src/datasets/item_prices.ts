const ITEM_PRICES_BY_ID: Map<number, number> = new Map([
    // Aeolian Scream
    [773, 2.50],
    // An Identity Uncovered!
    [657, 2.50],
    // Assortment of Khaganian Coinage
    [142708, 0.50],
    // Attar
    [139723, 4.17],
    // Bone Fragments
    [140889, 0.01],
    // Brilliant Soul
    [668, 0.50],
    // Certifiable Scrap
    [918, 0.49],
    // Correspondence Plaque
    [932, 0.50],
    // Cryptic Clue
    [389, 0.02],
    // Crystallised Curio
    [142359, 2.50],
    // Hiding Place of a Peculiar Item
    [142447, 102.50],
    // Hillmover
    [140900, 12.50],
    // Hinterland Scrip
    [125025, 0.50],
    // Jasmine Leaves
    [141374, 0.10],
    // Knob of Scintillack
    [122495, 2.50],
    // Knotted Humerus
    [140772, 3.00],
    // Legal Document
    [739, 12.50],
    // Moon-Pearl
    [379, 0.01],
    // Mourning Candle
    [951, 2.50],
    // Pennies
    [22390, 0.01],
    // Piece of Rostygold
    [375, 0.01],
    // Pieces of Plunder Weighing Down Your Hold
    [144024, 0.01],
    // Primordial Shriek
    [388, 0.02],
    // Rat-Shilling
    [143057, 0.10],
    // Searing Enigma
    [821, 62.50],
    // Shard of Glim
    [378, 0.01],
    // Shard of Glim the Size of a Small Child
    [142094, 16.50],
    // Silk Scrap
    [381, 0.01],
    // Stashed Treasure
    [144025, 0.01],
    // Stuiver
    [144995, 0.05],
    // Tempestuous Tale (via Stuiver)
    [144955, 10 * 0.05],
    // Touching Love Story
    [945, 2.50],
    // Traces of the Tabernacle
    [146438, 0.01],
    // Unassuming Crate
    [142710, 20.00],
    // Venom-Ruby
    [642, 0.10],
    // Whispered Hint
    [380, 0.01],
    // A Blue and Shining Stone
    [22523, 12.50],
    // A Boxed Cat?
    [634, 0.10],
    // A Headful of Picaresque Tales
    [22522, 12.50],
    // A Miniature Model Ship (via Certifiable Scrap)
    [108650, 10 * 0.49],
    // A Mislaid Diamond
    [144306, 12.50],
    // A Monstrous Orb
    [102578, 6.00],
    // A Partially Unwrapped Cat?
    [635, 0.50],
    // A River In A Box
    [16677, 32.50],
    // A Sealed Copy of the Crimson Book (via Touching Love Story)
    [107903, 625 * 2.50],
    // A Seat at the Board
    [144796, 1562.50],
    // A Tasting Flight of Targeted Toxins
    [142504, 1562.50],
    // Admiral-in-a-Box (via Certifiable Scrap)
    [141644, 5 * 0.49],
    // Albatross Wing
    [140850, 12.50],
    // Alluring Accomplice
    [350, 62.50],
    // Amanita Sherry
    [928, 0.10],
    // Amber-Topped Walking-Stick
    [335, 32.40],
    // Ambiguous Eolith
    [122485, 0.50],
    // Anarchist's Sable
    [1044, 6.00],
    // Ancient Hunting Rifle
    [329, 12.50],
    // Anning's Patent Ribcage Breastplate (via Hinterland Scrip)
    [142588, 1750 * 0.50],
    // Annings' Complete and Reliable Kit for the Preservation and Display of Skeletons (via Hinterland Scrip)
    [141546, 62 * 0.50],
    // Anticandle (via Bone Fragments)
    [142750, 250 * 0.01],
    // Antique Constable's Badge
    [748, 25.00],
    // Antique Mystery
    [946, 12.50],
    // Apostate's Psalm
    [142250, 2.50],
    // Appalling Secret
    [390, 0.15],
    // Araby Fighting-Weasel
    [498, 0.50],
    // Ascended Ambergris (via Stuiver)
    [145002, 50 * 0.05],
    // Avid Glove
    [294, 6.40],
    // Baited Riddle (via Whispered Hint)
    [143912, 6250 * 0.01],
    // Bandage Scrap (via Shard of Glim)
    [144247, 0.01],
    // Baptised Rattus Faber Corpse
    [14620, 2.50],
    // Basket of Rubbery Pies
    [140894, 2.50],
    // Bat with Attitude
    [485, 12.50],
    // Battered Grey Overcoat
    [315, 6.40],
    // Bazaar Permit
    [741, 12.50],
    // Beguiling Mask
    [310, 62.50],
    // Bejewelled Lens
    [763, 12.50],
    // Bengal Tigress
    [728, 312.50],
    // Bessemer Steel Ingot (via Tempestuous Tale)
    [141159, 0.50],
    // Bifurcated Owl
    [899, 200.00],
    // Blackmail Material
    [858, 12.50],
    // Blood Oath (via Stuiver)
    [146694, 10 * 0.05],
    // Bloodstained Suit
    [722, 0.20],
    // Book of Hidden Bodies
    [746, 6.00],
    // Bottle of Broken Giant 1844
    [823, 2.50],
    // Bottle of Fourth City Airag: Year of the Tortoise
    [824, 62.50],
    // Bottle of Greyfields 1868 First Sporing
    [473, 0.20],
    // Bottle of Greyfields 1879
    [382, 0.01],
    // Bottle of Greyfields 1882
    [383, 0.02],
    // Bottle of Morelways 1872
    [815, 0.10],
    // Bottle of Strangling Willow Absinthe
    [822, 0.50],
    // Bottled Oblivion
    [557, 0.01],
    // Brass Ring
    [482, 12.50],
    // Breath of the Void
    [934, 1560.00],
    // Bright Brass Skull
    [749, 60.00],
    // Bundle of Fourth City Rags
    [314, 0.30],
    // Bundle of Glad Rags
    [723, 0.20],
    // Bundle of Ragged Clothing
    [313, 0.01],
    // Captivating Ballad
    [142386, 62.50],
    // Carnelian Sapphire Pendant
    [145127, 75.00],
    // Cartographer's Hoard
    [141189, 312.50],
    // Carved Ball of Stygian Ivory
    [122483, 2.50],
    // Caustic Apocryphon (via Stuiver)
    [144751, 250 * 0.05],
    // Cave-Aged Code of Honour (via Legal Document)
    [141883, 12.50],
    // Celebrated Short Story
    [18396, 130.00],
    // Cellar of Wine
    [736, 12.50],
    // Cheerful Goldfish
    [464, 0.04],
    // Chimerical Archive
    [142448, 62.50],
    // Classic Short Story
    [18381, 180.00],
    // Clockwork Drownie (via Certifiable Scrap)
    [141643, 5 * 0.49],
    // Collection of Curiosities
    [743, 6.00],
    // Compelling Short Story
    [18308, 30.00],
    // Competent Short Story
    [18100, 10.00],
    // Complaisant Frost-Moth
    [23899, 5.00],
    // Comprehensive Bribe
    [742, 12.50],
    // Compromising Document
    [830, 0.50],
    // Conceptual Breakthrough in Currency Design
    [142754, 12.50],
    // Copper Cipher Ring
    [758, 37.50],
    // Corresponding Ocelot
    [877, 35.00],
    // Corsetted Dress
    [717, 12.50],
    // Coruscating Soul
    [669, 312.50],
    // Crackling Device
    [142840, 62.50],
    // Crate of Incorruptible Biscuits
    [140892, 2.50],
    // Cryptobotanical Rosette
    [862, 0.50],
    // Dark-Dewed Cherry
    [618, 0.70],
    // Dazed Raven Advisor
    [342, 6.40],
    // Deep-zee Catch
    [122484, 0.50],
    // Deshrieked Mandrake
    [343, 6.40],
    // Devilbone Die
    [653, 0.90],
    // Devilish Fedora
    [21847, 200.00],
    // Devilish Probability Distributor
    [141281, 62.50],
    // Devilishly Slinky Evening Gown (via Hinterland Scrip)
    [141680, 500 * 0.50],
    // Devious Henchman
    [348, 12.50],
    // Devious Raven Advisor
    [14734, 90.00],
    // Diary of the Dead
    [762, 60.00],
    // Dignified Tailcoat
    [320, 12.50],
    // Direful Reflection
    [105858, 12.50],
    // Dismal Victuals (via Touching Love Story)
    [144241, 2.50],
    // Distinguished Gentleman's Outfit
    [322, 62.50],
    // Dove Mask Shard
    [678, 0.25],
    // Dreadful Surmise
    [814, 312.50],
    // Dreamy Raven Advisor
    [14431, 9.00],
    // Drop of Prisoner's Honey
    [391, 0.02],
    // Dubious Testimony
    [13929, 0.50],
    // Eager Glove
    [293, 2.50],
    // Edicts of the First City
    [142087, 312.50],
    // Elegant Emerald Gown
    [321, 62.50],
    // Element of Dawn
    [122493, 62.50],
    // Elemental Secret
    [14975, 312.50],
    // Emergency Blunderbuss
    [1004, 0.20],
    // Emetic Revelation (via Cryptic Clue)
    [142709, 625 * 0.02],
    // Endowment of a University Fellowship
    [759, 50.00],
    // Engraved Pewter Tankard
    [757, 47.50],
    // Entry in Slowcake's Exceptionals
    [752, 27.50],
    // Epaulette Mate (via Hinterland Scrip)
    [140971, 50 * 0.50],
    // Exceptional Hat
    [311, 62.50],
    // Exceptional Short Story
    [18310, 60.00],
    // Exigent Note
    [143056, 62.50],
    // Exquisite Ivory Gown
    [326, 230.40],
    // Extraordinary Hat
    [312, 312.50],
    // Extraordinary Implication
    [809, 2.50],
    // Extraordinary Short Story
    [18311, 70.00],
    // Eyeless Skull
    [23504, 30.00],
    // F.F. Gebrandt's Flame-Resilient Paper
    [142190, 0.50],
    // F.F. Gebrandt's Superior Laudanum
    [477, 0.10],
    // F.F. Gebrandt's Tincture of Vigour
    [470, 0.10],
    // F.F. Gebrandt's Tincture of Vigour: Half-Full
    [471, 0.03],
    // Fabulous Diamond
    [12187, 312.50],
    // Faded Morning Suit
    [726, 0.20],
    // Fairly Tame Sorrow-Spider
    [344, 6.40],
    // False Hagiotoponym
    [142249, 62.50],
    // False Lead
    [813, 0.02],
    // Far Khanate Lacquered Armour
    [21892, 200.00],
    // Favour in High Places
    [744, 12.50],
    // Fecund Amber Tiara
    [21845, 200.00],
    // Femur of a Jurassic Beast (via Hinterland Scrip)
    [140773, 2 * 0.50],
    // Femur of a Surface Deer
    [140771, 0.10],
    // Final Breath
    [141161, 0.50],
    // Fingerking Scale (via Correspondence Plaque)
    [144217, 0.50],
    // Firkin of Hesperidean Cider
    [410, 80000.00],
    // First City Coin
    [582, 0.25],
    // Fistful of Surface Currency
    [421, 0.03],
    // Flask of Abominable Salts
    [476, 0.10],
    // Flawed Diamond
    [449, 0.12],
    // Fluke Spine, Freely Given (via Knotted Humerus)
    [144215, 3.00],
    // Fluke-Core
    [106683, 1560.00],
    // Focused Albatross
    [140724, 12.50],
    // Formidable Gown
    [720, 12.50],
    // Fossilised Forelimb (via Hinterland Scrip)
    [141540, 25 * 0.50],
    // Fourth-City Echo (via Rat-Shilling)
    [142797, 125 * 0.10],
    // Foxfire Candle Stub
    [374, 0.01],
    // Fragment of White Gold
    [676, 0.40],
    // Fragment of the Tragedy Procedures
    [123213, 62.50],
    // Fraught Research Assistant
    [118788, 12.50],
    // Frayed Thread (via Silk Scrap)
    [144315, 0.01],
    // Fungal Dangers and Poisons: A Guide for New Growers (via Hinterland Scrip)
    [141569, 40 * 0.50],
    // Gay Bonnet
    [308, 2.50],
    // Gentleman's Athletic Support
    [718, 6.40],
    // Gentleman's Hat
    [305, 2.50],
    // Gift of Scorn
    [560, 0.20],
    // Gift of Transcendent Devotion
    [561, 2.00],
    // Glim-Encrusted Carapace (via Stuiver)
    [145008, 1250 * 0.05],
    // Glimpse of Anathema
    [145282, 312.50],
    // Grubby Urchin
    [346, 14.40],
    // Hand-picked Peppercaps (via Hinterland Scrip)
    [141541, 0.50],
    // Haunted-looking Dog
    [818, 2.00],
    // Helical Thighbone (via Hinterland Scrip)
    [141480, 2 * 0.50],
    // Highwayman's Cloak (via Hinterland Scrip)
    [141627, 400 * 0.50],
    // Horsehead Amulet
    [468, 2.00],
    // Impossible Theorem
    [106142, 1562.60],
    // Incisive Observation
    [140898, 0.50],
    // Infernal Contract
    [426, 0.20],
    // Infernal Sharpshooter's Rifle
    [21896, 210.00],
    // Infernally Well-cut Suit (via Hinterland Scrip)
    [141681, 500 * 0.50],
    // Inkling of Identity
    [656, 0.10],
    // Insatiable Glove
    [301, 62.50],
    // Intriguer's Compendium
    [931, 312.50],
    // Intriguing Snippet
    [588, 0.20],
    // Iron Hat
    [304, 6.40],
    // Iron Republic Journal
    [1064, 15.00],
    // Irresistible Drum
    [338, 25.60],
    // Ivory Humerus (via Hinterland Scrip)
    [140849, 25 * 0.50],
    // Jade Fragment
    [377, 0.01],
    // Journal of Infamy
    [525, 0.50],
    // Judgements' Egg
    [122486, 62.50],
    // Legenda Cosmogone
    [142295, 312.50],
    // Light-Drinking Cravat
    [145126, 6.25],
    // Limpid Soul (via Knob of Scintillack)
    [144219, 2.50],
    // Lithification Liquid (via Hinterland Scrip)
    [141548, 12 * 0.50],
    // Live Specimen
    [122488, 2.50],
    // London Street Sign
    [392, 2.50],
    // Lucky Weasel
    [441, 0.20],
    // Lump of Lamplighter Beeswax
    [384, 0.01],
    // M. Demeaux's Advice for Captains: Commemorative Edition
    [116011, 5.00],
    // Magisterial Lager (via Hinterland Scrip)
    [141574, 0.50],
    // Magnificent Diamond
    [12188, 12.50],
    // Magnificent Midnight-Blue Evening Gown
    [324, 90.00],
    // Maidservant's Uniform
    [725, 0.20],
    // Malevolent Monkey
    [351, 45.00],
    // Maniac's Prayer
    [935, 0.10],
    // Map Scrap
    [920, 0.10],
    // Mask of the Rose
    [555, 0.10],
    // Masterful Short Story
    [18312, 80.00],
    // Memory of Distant Shores
    [825, 0.50],
    // Memory of Light (via Cryptic Clue)
    [589, 25 * 0.02],
    // Memory of Moonlight (via Stuiver)
    [144977, 250 * 0.05],
    // Memory of Sunlight (via Mourning Candle)
    [144218, 2.50],
    // Memory of a Much Stranger Self (via Stuiver)
    [144983, 250 * 0.05],
    // Memory of a Shadow in Varchas (via Hinterland Scrip)
    [142659, 25 * 0.50],
    // Meticulously Altered Stocking (via Primordial Shriek)
    [106571, 2000 * 2.50],
    // Midnight Matriarch
    [21898, 200.00],
    // Mirthless Compendium of Statistical Observations
    [141283, 12.50],
    // Misplaced Ring (via Hinterland Scrip)
    [142589, 1750 * 0.50],
    // Model Infernal Locomotive (via Certifiable Scrap)
    [141641, 5 * 0.49],
    // Modish Bonnet
    [465, 0.50],
    // Morning Suit
    [719, 14.40],
    // Mountain-sherd
    [122492, 62.50],
    // Moves in the Great Game
    [122490, 0.50],
    // Much-Needed Gap (via Assortment of Khaganian Coinage)
    [142855, 125 * 0.50],
    // Muscaria Brandy
    [927, 2.50],
    // Mystery of the Elder Continent
    [587, 0.50],
    // Mystic Raven Advisor
    [14731, 90.00],
    // Neddy Suit
    [1043, 6.00],
    // Neo-Echo (via Jasmine Leaves)
    [144213, 0.10],
    // Nevercold Brass Sliver
    [387, 0.01],
    // Nicatorean Relic
    [141916, 2.50],
    // Night on the Town
    [735, 2.50],
    // Night-Trimmed Frock Coat
    [323, 90.00],
    // Night-Whisper
    [933, 62.50],
    // Nightsoil of the Bazaar (via Hinterland Scrip)
    [141158, 0.50],
    // Nikolas & Sons Instant Ablution Absolution
    [523, 0.25],
    // No Currency (via Venom-Ruby)
    [144214, 0.10],
    // Nodule of Deep Amber
    [385, 0.01],
    // Nodule of Fecund Amber
    [16308, 312.50],
    // Nodule of Pulsating Amber
    [754, 62.50],
    // Nodule of Trembling Amber
    [949, 12.50],
    // O'Boyle's Practical Primer in the Various Languages of Nippon, Tartary, Cathay and the Princedoms of the Raj
    [756, 27.50],
    // Obdurate Stallion
    [875, 35.00],
    // Ocular Toadbeast
    [876, 35.00],
    // Old Bone Skeleton Key
    [753, 57.50],
    // Oneiric Pearl (via Assortment of Khaganian Coinage)
    [142666, 125 * 0.50],
    // Oneiromantic Revelation
    [142662, 62.50],
    // Ornate Typewriter
    [755, 30.00],
    // Ostentatious Diamond
    [12186, 0.50],
    // Ounce of Lily-Balm (via Brilliant Soul)
    [144243, 0.50],
    // Outfit of Black Felt Garments
    [317, 2.88],
    // Overgoat
    [355, 5856.40],
    // Page from the Liber Visionis
    [619, 0.50],
    // Pair of Balmoral Boots (via Hinterland Scrip)
    [141538, 125 * 0.50],
    // Pair of Cracksman's Mittens
    [296, 6.40],
    // Pair of Cutpurse's Mittens
    [292, 1.60],
    // Pair of Dancemaster's Dabs
    [298, 6.40],
    // Pair of Forgotten Spidersilk Slippers
    [23902, 160.00],
    // Pair of Hushed Spidersilk Slippers
    [363, 160.00],
    // Pair of Iron Manacles
    [290, 0.40],
    // Pair of Irrigo Goggles
    [23901, 12.80],
    // Pair of Kingscale Boots
    [21846, 230.00],
    // Pair of Knife-and-Candler's Gloves
    [295, 2.50],
    // Pair of Lady's Lace Gloves
    [299, 6.40],
    // Pair of Leg Irons
    [356, 0.40],
    // Pair of Lenguals
    [21848, 200.00],
    // Pair of Luminous Neathglass Goggles
    [307, 6.40],
    // Pair of Magician's Gloves
    [291, 2.50],
    // Pair of Master Thief's Hands
    [302, 160.00],
    // Pair of Masterwork Dancing Slippers
    [360, 32.40],
    // Pair of Neathglass Goggles
    [306, 2.50],
    // Pair of Ratskin Boots
    [362, 62.50],
    // Pair of Savage Hob-Nailed Boots
    [361, 6.40],
    // Pair of Scarlet Stockings of Dubious Origin
    [467, 0.40],
    // Pair of Scuffed Boots
    [765, 0.10],
    // Pair of Spiderchitin Gauntlets
    [297, 6.40],
    // Pair of Spidersilk Slippers
    [359, 6.40],
    // Pair of Squeakless Boots
    [358, 2.50],
    // Pair of Stylish Riding Boots
    [357, 2.50],
    // Pair of Vakeskin Boots
    [364, 160.00],
    // Palimpsest Scrap
    [142251, 0.50],
    // Parabola-Linen Frock
    [21893, 230.00],
    // Parabola-Linen Scrap
    [924, 62.50],
    // Parabola-Linen Suit
    [21891, 230.00],
    // Parabolan Parable
    [142463, 312.50],
    // Partial Map
    [956, 2.50],
    // Patent Osteological Sand and Wax (via Hinterland Scrip)
    [141543, 12 * 0.50],
    // Patent Scrutinizer
    [339, 6.40],
    // Patent Scrutinizer Deluxe!
    [340, 160.00],
    // Personal Recommendation
    [740, 6.00],
    // Philosophical Raven Advisor
    [14730, 40.00],
    // Phosphorescent Scarab
    [652, 0.10],
    // Pirate Hat
    [466, 0.50],
    // Poison-Tipped Umbrella
    [729, 225.00],
    // Portfolio of Souls
    [747, 12.50],
    // Pot of Venison Marrow
    [141486, 0.50],
    // Presbyterate Passphrase
    [852, 2.50],
    // Preserved Surface Blooms
    [141157, 2.50],
    // Primaeval Hint
    [832, 62.50],
    // Prison Shiv
    [491, 0.01],
    // Prisoner's Mask
    [303, 0.04],
    // Proscribed Material
    [420, 0.04],
    // Puzzle-Damask Scrap
    [923, 12.50],
    // Puzzling Map
    [959, 12.50],
    // Queen Mate (via Hinterland Scrip)
    [140970, 50 * 0.50],
    // Queer Soul
    [122798, 2.50],
    // Railway Steel (via Hinterland Scrip)
    [141162, 19 * 0.50],
    // Rat on a String
    [376, 0.01],
    // Ratskin Suit
    [318, 62.50],
    // Rattus Faber Bandit-Chief
    [353, 160.00],
    // Rattus Faber Rifle
    [331, 2.50],
    // Ratty Reliquary
    [123214, 12.50],
    // Ratwork Derringer
    [332, 250.00],
    // Ratwork Mechanism (via Moon-Pearl)
    [145640, 1250 * 0.01],
    // Ratwork Watch
    [655, 230.00],
    // Ravenglass Knife
    [330, 51.20],
    // Ravenous Henchman
    [23900, 28.80],
    // Ray-Drenched Cinder
    [1053, 312.50],
    // Red-Feathered Pin
    [761, 35.00],
    // Relatively Safe Zee Lane
    [143646, 62.50],
    // Relic of the Fifth City
    [145558, 2.50],
    // Relic of the Fourth City
    [423, 0.05],
    // Relic of the Second City
    [425, 0.15],
    // Relic of the Third City
    [424, 0.10],
    // Reported Location of a One-Time Prince of Hell
    [929, 1560.00],
    // Reprehensible Lizard
    [442, 0.20],
    // Respectable Grey Gown
    [319, 14.40],
    // Ridiculous Hat
    [556, 0.01],
    // Ring of Stone
    [675, 0.30],
    // Ripened Wheel of Hellworm Cheese
    [143588, 62.50],
    // Romantic Notion
    [531, 0.10],
    // Roof-Chart (via Stuiver)
    [144982, 50 * 0.05],
    // Rookery Password
    [751, 60.00],
    // Rostygold Ring
    [145128, 6.25],
    // Rough Gown
    [721, 0.20],
    // Royal-Blue Feather
    [122494, 0.50],
    // Rubbery Associate
    [354, 0.20],
    // Rubbery Conspirator
    [448, 0.01],
    // Rubbery Euphonium
    [817, 3.00],
    // Rumour of the Upper River
    [141194, 2.50],
    // Rumourmonger's Network
    [930, 1560.00],
    // Rusted Stirrup
    [141913, 0.10],
    // Ruthless Henchman
    [349, 62.50],
    // Salt Steppe Atlas
    [142202, 62.50],
    // Salt Weasel
    [816, 2.50],
    // Sample of Lacreous Affection
    [143044, 312.50],
    // Sample of Roof-Drip (via Stuiver)
    [144821, 2 * 0.05],
    // Sap of the Cedar at the Crossroads (via Hinterland Scrip)
    [143050, 125 * 0.50],
    // Sapphire
    [643, 0.12],
    // Sausage About Which No One Complains
    [140891, 12.50],
    // Scrap of Incendiary Gossip
    [659, 0.50],
    // Scrap of Ivory Organza
    [925, 312.50],
    // Scuttering Squad
    [1005, 10.00],
    // Secluded Address
    [658, 0.50],
    // Secret College (via Searing Enigma)
    [118813, 25 * 62.50],
    // Selenitic Fragment (via Aeolian Scream)
    [144296, 2.50],
    // Semiotic Monocle
    [727, 312.50],
    // Set of Intricate Kifers
    [337, 312.50],
    // Set of Kifers
    [336, 32.40],
    // Set of Workman's Clothes
    [436, 0.08],
    // Seven-Throated Warbler
    [140709, 12.50],
    // Shabby Opera Cloak
    [724, 0.20],
    // Shard of Lightless Glim (via Piece of Rostygold)
    [144216, 0.01],
    // Short Story
    [18101, 2.00],
    // Shrivelled Ball
    [677, 0.30],
    // Sighting of a Parabolan Landmark
    [142660, 0.10],
    // Silent Soul
    [23695, 12.50],
    // Silvered Cat's Claw
    [141917, 0.10],
    // Skyglass Knife
    [327, 3.20],
    // Slavering Dream-Hound
    [878, 35.00],
    // Smock of Four Thousand Three Hundred and Eight Pockets
    [21895, 210.00],
    // Sneak-Thief's Mask
    [309, 10.00],
    // Snuffer's Face
    [21894, 200.00],
    // Sober Dress
    [435, 0.08],
    // Solacefruit
    [122491, 0.50],
    // Soothe & Cooper Long-Box (via An Identity Uncovered!)
    [114982, 25 * 2.50],
    // Soul
    [386, 0.02],
    // Sporing Bonnet
    [544, 1.50],
    // Stained Red Velvet Gown
    [316, 6.40],
    // Stalemate (via Hinterland Scrip)
    [140980, 125 * 0.50],
    // Starry-Eyed Scoundrel
    [140648, 14.00],
    // Starstone Demark
    [936, 312.50],
    // Starved Expression (via Stuiver)
    [144822, 10 * 0.05],
    // Stolen Correspondence
    [422, 0.05],
    // Stolen Kiss
    [944, 2.50],
    // Storm-Threnody
    [849, 12.50],
    // Strange-Shore Parabola Frock
    [23897, 470.00],
    // Strange-Shore Parabola Suit
    [23898, 470.00],
    // Strong-Backed Labour
    [764, 2.50],
    // Sulky Bat
    [443, 0.20],
    // Sumptuous Dandy's Outfit
    [325, 230.00],
    // Surface-Silk Scrap
    [907, 0.10],
    // Survey of the Neath's Bones (via Hinterland Scrip)
    [141170, 0.50],
    // Sworn Statement
    [13928, 2.50],
    // Tailfeather Brilliant as Flame
    [141160, 2.50],
    // Tale of Terror!!
    [828, 0.50],
    // Talkative Rattus Faber
    [558, 0.50],
    // Tantalising Possibility
    [145109, 0.10],
    // Tasselled Sword-Cane
    [334, 14.40],
    // Tasselled Walking-Stick
    [333, 2.50],
    // Tentacle Mitts (via Hinterland Scrip)
    [141628, 400 * 0.50],
    // Thirsty Bombazine Scrap
    [922, 2.50],
    // Thrilling Short Story
    [18309, 50.00],
    // Tin of Zzoup
    [121611, 2.50],
    // Tinned Ham
    [141542, 63.50],
    // Tiny Jewelled Reliquary
    [750, 35.00],
    // Trace of Viric
    [141914, 0.50],
    // Tracklayer's Helmet (via Hinterland Scrip)
    [141539, 125 * 0.50],
    // Trade Secret
    [13640, 60.00],
    // Tub of Gloam-Foam
    [21897, 200.00],
    // Twelve-Carat Diamond Ring
    [730, 225.00],
    // Uncanny Incunabulum
    [812, 12.50],
    // Unearthly Fossil
    [810, 2.50],
    // Unidentified Thigh Bone (via Hinterland Scrip)
    [140756, 0.50],
    // Unjustifiable Necktie
    [145129, 75.00],
    // Unlawful Device
    [141946, 12.50],
    // Unloved Short Story
    [18379, 1.00],
    // Unprovenanced Artefact
    [122487, 2.50],
    // Unscrupulous Raven Advisor
    [14733, 40.00],
    // Unusual Love Story
    [829, 0.50],
    // Use of Villains
    [737, 6.00],
    // Veils-Velvet Scrap
    [926, 1560.00],
    // Venge-Rat Corpse
    [14621, 0.50],
    // Venom-Ruby Lure
    [145125, 6.25],
    // Vestige of a Starlit Reverie
    [143045, 312.50],
    // Vial of Cantigaster Venom
    [104821, 312.50],
    // Vial of Masters' Blood
    [24121, 1562.60],
    // Vial of Tears of the Bazaar
    [12350, 312.50],
    // Vienna Opening (via Hinterland Scrip)
    [140978, 5 * 0.50],
    // Virginia's Spare Pillbox Hat
    [140608, 35.00],
    // Vision of the Surface
    [827, 0.50],
    // Vital Intelligence
    [122489, 12.50],
    // Vitreous Almanac
    [142661, 12.50],
    // Volume of Collated Research
    [745, 2.50],
    // Voracious Glove
    [300, 57.60],
    // Wary Raven Advisor
    [14732, 9.00],
    // Waswood Almanac
    [142669, 312.50],
    // Weasel of Woe
    [144549, 100.00],
    // Whirring Contraption
    [738, 6.00],
    // Whisper-Satin Scrap
    [915, 0.50],
    // Winsome Dispossessed Orphan
    [347, 32.40],
    // Wolfie
    [484, 0.01],
    // Working Rat
    [345, 32.40],
    // Zee-Ztory
    [831, 0.50],
    // Übergoat
    [102305, 11712.80],
]);

const ITEM_PRICES_BY_NAME: Map<string, number> = new Map([
    ["A Blue and Shining Stone", 12.50],
    ["A Boxed Cat?", 0.10],
    ["A Headful of Picaresque Tales", 12.50],
    ["A Miniature Model Ship", 10 * 0.49],  // via Certifiable Scrap
    ["A Mislaid Diamond", 12.50],
    ["A Monstrous Orb", 6.00],
    ["A Partially Unwrapped Cat?", 0.50],
    ["A River In A Box", 32.50],
    ["A Sealed Copy of the Crimson Book", 625 * 2.50],  // via Touching Love Story
    ["A Seat at the Board", 1562.50],
    ["A Tasting Flight of Targeted Toxins", 1562.50],
    ["Admiral-in-a-Box", 5 * 0.49],  // via Certifiable Scrap
    ["Aeolian Scream", 2.50],
    ["Albatross Wing", 12.50],
    ["Alluring Accomplice", 62.50],
    ["Amanita Sherry", 0.10],
    ["Amber-Topped Walking-Stick", 32.40],
    ["Ambiguous Eolith", 0.50],
    ["An Identity Uncovered!", 2.50],
    ["Anarchist's Sable", 6.00],
    ["Ancient Hunting Rifle", 12.50],
    ["Anning's Patent Ribcage Breastplate", 1750 * 0.50],  // via Hinterland Scrip
    ["Annings' Complete and Reliable Kit for the Preservation and Display of Skeletons", 62 * 0.50],  // via Hinterland Scrip
    ["Anticandle", 250 * 0.01],  // via Bone Fragments
    ["Antique Constable's Badge", 25.00],
    ["Antique Mystery", 12.50],
    ["Apostate's Psalm", 2.50],
    ["Appalling Secret", 0.15],
    ["Araby Fighting-Weasel", 0.50],
    ["Ascended Ambergris", 50 * 0.05],  // via Stuiver
    ["Assortment of Khaganian Coinage", 0.50],
    ["Attar", 4.17],
    ["Avid Glove", 6.40],
    ["Baited Riddle", 6250 * 0.01],  // via Whispered Hint
    ["Bandage Scrap", 0.01],  // via Shard of Glim
    ["Baptised Rattus Faber Corpse", 2.50],
    ["Basket of Rubbery Pies", 2.50],
    ["Bat with Attitude", 12.50],
    ["Battered Grey Overcoat", 6.40],
    ["Bazaar Permit", 12.50],
    ["Beguiling Mask", 62.50],
    ["Bejewelled Lens", 12.50],
    ["Bengal Tigress", 312.50],
    ["Bessemer Steel Ingot", 0.50],  // via Tempestuous Tale
    ["Bifurcated Owl", 200.00],
    ["Blackmail Material", 12.50],
    ["Blood Oath", 10 * 0.05],  // via Stuiver
    ["Bloodstained Suit", 0.20],
    ["Bone Fragments", 0.01],
    ["Book of Hidden Bodies", 6.00],
    ["Bottle of Broken Giant 1844", 2.50],
    ["Bottle of Fourth City Airag: Year of the Tortoise", 62.50],
    ["Bottle of Greyfields 1868 First Sporing", 0.20],
    ["Bottle of Greyfields 1879", 0.01],
    ["Bottle of Greyfields 1882", 0.02],
    ["Bottle of Morelways 1872", 0.10],
    ["Bottle of Strangling Willow Absinthe", 0.50],
    ["Bottled Oblivion", 0.01],
    ["Brass Ring", 12.50],
    ["Breath of the Void", 1560.00],
    ["Bright Brass Skull", 60.00],
    ["Brilliant Soul", 0.50],
    ["Bundle of Fourth City Rags", 0.30],
    ["Bundle of Glad Rags", 0.20],
    ["Bundle of Ragged Clothing", 0.01],
    ["Captivating Ballad", 62.50],
    ["Carnelian Sapphire Pendant", 75.00],
    ["Cartographer's Hoard", 312.50],
    ["Carved Ball of Stygian Ivory", 2.50],
    ["Caustic Apocryphon", 250 * 0.05],  // via Stuiver
    ["Cave-Aged Code of Honour", 12.50],  // via Legal Document
    ["Celebrated Short Story", 130.00],
    ["Cellar of Wine", 12.50],
    ["Certifiable Scrap", 0.49],
    ["Cheerful Goldfish", 0.04],
    ["Chimerical Archive", 62.50],
    ["Classic Short Story", 180.00],
    ["Clockwork Drownie", 5 * 0.49],  // via Certifiable Scrap
    ["Collection of Curiosities", 6.00],
    ["Compelling Short Story", 30.00],
    ["Competent Short Story", 10.00],
    ["Complaisant Frost-Moth", 5.00],
    ["Comprehensive Bribe", 12.50],
    ["Compromising Document", 0.50],
    ["Conceptual Breakthrough in Currency Design", 12.50],
    ["Copper Cipher Ring", 37.50],
    ["Correspondence Plaque", 0.50],
    ["Corresponding Ocelot", 35.00],
    ["Corsetted Dress", 12.50],
    ["Coruscating Soul", 312.50],
    ["Crackling Device", 62.50],
    ["Crate of Incorruptible Biscuits", 2.50],
    ["Cryptic Clue", 0.02],
    ["Cryptobotanical Rosette", 0.50],
    ["Crystallised Curio", 2.50],
    ["Dark-Dewed Cherry", 0.70],
    ["Dazed Raven Advisor", 6.40],
    ["Deep-zee Catch", 0.50],
    ["Deshrieked Mandrake", 6.40],
    ["Devilbone Die", 0.90],
    ["Devilish Fedora", 200.00],
    ["Devilish Probability Distributor", 62.50],
    ["Devilishly Slinky Evening Gown", 500 * 0.50],  // via Hinterland Scrip
    ["Devious Henchman", 12.50],
    ["Devious Raven Advisor", 90.00],
    ["Diary of the Dead", 60.00],
    ["Dignified Tailcoat", 12.50],
    ["Direful Reflection", 12.50],
    ["Dismal Victuals", 2.50],  // via Touching Love Story
    ["Distinguished Gentleman's Outfit", 62.50],
    ["Dove Mask Shard", 0.25],
    ["Dreadful Surmise", 312.50],
    ["Dreamy Raven Advisor", 9.00],
    ["Drop of Prisoner's Honey", 0.02],
    ["Dubious Testimony", 0.50],
    ["Eager Glove", 2.50],
    ["Edicts of the First City", 312.50],
    ["Elegant Emerald Gown", 62.50],
    ["Element of Dawn", 62.50],
    ["Elemental Secret", 312.50],
    ["Emergency Blunderbuss", 0.20],
    ["Emetic Revelation", 625 * 0.02],  // via Cryptic Clue
    ["Endowment of a University Fellowship", 50.00],
    ["Engraved Pewter Tankard", 47.50],
    ["Entry in Slowcake's Exceptionals", 27.50],
    ["Epaulette Mate", 50 * 0.50],  // via Hinterland Scrip
    ["Exceptional Hat", 62.50],
    ["Exceptional Short Story", 60.00],
    ["Exigent Note", 62.50],
    ["Exquisite Ivory Gown", 230.40],
    ["Extraordinary Hat", 312.50],
    ["Extraordinary Implication", 2.50],
    ["Extraordinary Short Story", 70.00],
    ["Eyeless Skull", 30.00],
    ["F.F. Gebrandt's Flame-Resilient Paper", 0.50],
    ["F.F. Gebrandt's Superior Laudanum", 0.10],
    ["F.F. Gebrandt's Tincture of Vigour", 0.10],
    ["F.F. Gebrandt's Tincture of Vigour: Half-Full", 0.03],
    ["Fabulous Diamond", 312.50],
    ["Faded Morning Suit", 0.20],
    ["Fairly Tame Sorrow-Spider", 6.40],
    ["False Hagiotoponym", 62.50],
    ["False Lead", 0.02],
    ["Far Khanate Lacquered Armour", 200.00],
    ["Favour in High Places", 12.50],
    ["Fecund Amber Tiara", 200.00],
    ["Femur of a Jurassic Beast", 2 * 0.50],  // via Hinterland Scrip
    ["Femur of a Surface Deer", 0.10],
    ["Final Breath", 0.50],
    ["Fingerking Scale", 0.50],  // via Correspondence Plaque
    ["Firkin of Hesperidean Cider", 80000.00],
    ["First City Coin", 0.25],
    ["Fistful of Surface Currency", 0.03],
    ["Flask of Abominable Salts", 0.10],
    ["Flawed Diamond", 0.12],
    ["Fluke Spine, Freely Given", 3.00],  // via Knotted Humerus
    ["Fluke-Core", 1560.00],
    ["Focused Albatross", 12.50],
    ["Formidable Gown", 12.50],
    ["Fossilised Forelimb", 25 * 0.50],  // via Hinterland Scrip
    ["Fourth-City Echo", 125 * 0.10],  // via Rat-Shilling
    ["Foxfire Candle Stub", 0.01],
    ["Fragment of White Gold", 0.40],
    ["Fragment of the Tragedy Procedures", 62.50],
    ["Fraught Research Assistant", 12.50],
    ["Frayed Thread", 0.01],  // via Silk Scrap
    ["Fungal Dangers and Poisons: A Guide for New Growers", 40 * 0.50],  // via Hinterland Scrip
    ["Gay Bonnet", 2.50],
    ["Gentleman's Athletic Support", 6.40],
    ["Gentleman's Hat", 2.50],
    ["Gift of Scorn", 0.20],
    ["Gift of Transcendent Devotion", 2.00],
    ["Glim-Encrusted Carapace", 1250 * 0.05],  // via Stuiver
    ["Glimpse of Anathema", 312.50],
    ["Grubby Urchin", 14.40],
    ["Hand-picked Peppercaps", 0.50],  // via Hinterland Scrip
    ["Haunted-looking Dog", 2.00],
    ["Helical Thighbone", 2 * 0.50],  // via Hinterland Scrip
    ["Hiding Place of a Peculiar Item", 102.50],
    ["Highwayman's Cloak", 400 * 0.50],  // via Hinterland Scrip
    ["Hillmover", 12.50],
    ["Hinterland Scrip", 0.50],
    ["Horsehead Amulet", 2.00],
    ["Impossible Theorem", 1562.60],
    ["Incisive Observation", 0.50],
    ["Infernal Contract", 0.20],
    ["Infernal Sharpshooter's Rifle", 210.00],
    ["Infernally Well-cut Suit", 500 * 0.50],  // via Hinterland Scrip
    ["Inkling of Identity", 0.10],
    ["Insatiable Glove", 62.50],
    ["Intriguer's Compendium", 312.50],
    ["Intriguing Snippet", 0.20],
    ["Iron Hat", 6.40],
    ["Iron Republic Journal", 15.00],
    ["Irresistible Drum", 25.60],
    ["Ivory Humerus", 25 * 0.50],  // via Hinterland Scrip
    ["Jade Fragment", 0.01],
    ["Jasmine Leaves", 0.10],
    ["Journal of Infamy", 0.50],
    ["Judgements' Egg", 62.50],
    ["Knob of Scintillack", 2.50],
    ["Knotted Humerus", 3.00],
    ["Legal Document", 12.50],
    ["Legenda Cosmogone", 312.50],
    ["Light-Drinking Cravat", 6.25],
    ["Limpid Soul", 2.50],  // via Knob of Scintillack
    ["Lithification Liquid", 12 * 0.50],  // via Hinterland Scrip
    ["Live Specimen", 2.50],
    ["London Street Sign", 2.50],
    ["Lucky Weasel", 0.20],
    ["Lump of Lamplighter Beeswax", 0.01],
    ["M. Demeaux's Advice for Captains: Commemorative Edition", 5.00],
    ["Magisterial Lager", 0.50],  // via Hinterland Scrip
    ["Magnificent Diamond", 12.50],
    ["Magnificent Midnight-Blue Evening Gown", 90.00],
    ["Maidservant's Uniform", 0.20],
    ["Malevolent Monkey", 45.00],
    ["Maniac's Prayer", 0.10],
    ["Map Scrap", 0.10],
    ["Mask of the Rose", 0.10],
    ["Masterful Short Story", 80.00],
    ["Memory of Distant Shores", 0.50],
    ["Memory of Light", 25 * 0.02],  // via Cryptic Clue
    ["Memory of Moonlight", 250 * 0.05],  // via Stuiver
    ["Memory of Sunlight", 2.50],  // via Mourning Candle
    ["Memory of a Much Stranger Self", 250 * 0.05],  // via Stuiver
    ["Memory of a Shadow in Varchas", 25 * 0.50],  // via Hinterland Scrip
    ["Meticulously Altered Stocking", 2000 * 2.50],  // via Primordial Shriek
    ["Midnight Matriarch", 200.00],
    ["Mirthless Compendium of Statistical Observations", 12.50],
    ["Misplaced Ring", 1750 * 0.50],  // via Hinterland Scrip
    ["Model Infernal Locomotive", 5 * 0.49],  // via Certifiable Scrap
    ["Modish Bonnet", 0.50],
    ["Moon-Pearl", 0.01],
    ["Morning Suit", 14.40],
    ["Mountain-sherd", 62.50],
    ["Mourning Candle", 2.50],
    ["Moves in the Great Game", 0.50],
    ["Much-Needed Gap", 125 * 0.50],  // via Assortment of Khaganian Coinage
    ["Muscaria Brandy", 2.50],
    ["Mystery of the Elder Continent", 0.50],
    ["Mystic Raven Advisor", 90.00],
    ["Neddy Suit", 6.00],
    ["Neo-Echo", 0.10],  // via Jasmine Leaves
    ["Nevercold Brass Sliver", 0.01],
    ["Nicatorean Relic", 2.50],
    ["Night on the Town", 2.50],
    ["Night-Trimmed Frock Coat", 90.00],
    ["Night-Whisper", 62.50],
    ["Nightsoil of the Bazaar", 0.50],  // via Hinterland Scrip
    ["Nikolas & Sons Instant Ablution Absolution", 0.25],
    ["No Currency", 0.10],  // via Venom-Ruby
    ["Nodule of Deep Amber", 0.01],
    ["Nodule of Fecund Amber", 312.50],
    ["Nodule of Pulsating Amber", 62.50],
    ["Nodule of Trembling Amber", 12.50],
    ["O'Boyle's Practical Primer in the Various Languages of Nippon, Tartary, Cathay and the Princedoms of the Raj", 27.50],
    ["Obdurate Stallion", 35.00],
    ["Ocular Toadbeast", 35.00],
    ["Old Bone Skeleton Key", 57.50],
    ["Oneiric Pearl", 125 * 0.50],  // via Assortment of Khaganian Coinage
    ["Oneiromantic Revelation", 62.50],
    ["Ornate Typewriter", 30.00],
    ["Ostentatious Diamond", 0.50],
    ["Ounce of Lily-Balm", 0.50],  // via Brilliant Soul
    ["Outfit of Black Felt Garments", 2.88],
    ["Overgoat", 5856.40],
    ["Page from the Liber Visionis", 0.50],
    ["Pair of Balmoral Boots", 125 * 0.50],  // via Hinterland Scrip
    ["Pair of Cracksman's Mittens", 6.40],
    ["Pair of Cutpurse's Mittens", 1.60],
    ["Pair of Dancemaster's Dabs", 6.40],
    ["Pair of Forgotten Spidersilk Slippers", 160.00],
    ["Pair of Hushed Spidersilk Slippers", 160.00],
    ["Pair of Iron Manacles", 0.40],
    ["Pair of Irrigo Goggles", 12.80],
    ["Pair of Kingscale Boots", 230.00],
    ["Pair of Knife-and-Candler's Gloves", 2.50],
    ["Pair of Lady's Lace Gloves", 6.40],
    ["Pair of Leg Irons", 0.40],
    ["Pair of Lenguals", 200.00],
    ["Pair of Luminous Neathglass Goggles", 6.40],
    ["Pair of Magician's Gloves", 2.50],
    ["Pair of Master Thief's Hands", 160.00],
    ["Pair of Masterwork Dancing Slippers", 32.40],
    ["Pair of Neathglass Goggles", 2.50],
    ["Pair of Ratskin Boots", 62.50],
    ["Pair of Savage Hob-Nailed Boots", 6.40],
    ["Pair of Scarlet Stockings of Dubious Origin", 0.40],
    ["Pair of Scuffed Boots", 0.10],
    ["Pair of Spiderchitin Gauntlets", 6.40],
    ["Pair of Spidersilk Slippers", 6.40],
    ["Pair of Squeakless Boots", 2.50],
    ["Pair of Stylish Riding Boots", 2.50],
    ["Pair of Vakeskin Boots", 160.00],
    ["Palimpsest Scrap", 0.50],
    ["Parabola-Linen Frock", 230.00],
    ["Parabola-Linen Scrap", 62.50],
    ["Parabola-Linen Suit", 230.00],
    ["Parabolan Parable", 312.50],
    ["Partial Map", 2.50],
    ["Patent Osteological Sand and Wax", 12 * 0.50],  // via Hinterland Scrip
    ["Patent Scrutinizer", 6.40],
    ["Patent Scrutinizer Deluxe!", 160.00],
    ["Pennies", 0.01],
    ["Personal Recommendation", 6.00],
    ["Philosophical Raven Advisor", 40.00],
    ["Phosphorescent Scarab", 0.10],
    ["Piece of Rostygold", 0.01],
    ["Pieces of Plunder Weighing Down Your Hold", 0.01],
    ["Pirate Hat", 0.50],
    ["Poison-Tipped Umbrella", 225.00],
    ["Portfolio of Souls", 12.50],
    ["Pot of Venison Marrow", 0.50],
    ["Presbyterate Passphrase", 2.50],
    ["Preserved Surface Blooms", 2.50],
    ["Primaeval Hint", 62.50],
    ["Primordial Shriek", 0.02],
    ["Prison Shiv", 0.01],
    ["Prisoner's Mask", 0.04],
    ["Proscribed Material", 0.04],
    ["Puzzle-Damask Scrap", 12.50],
    ["Puzzling Map", 12.50],
    ["Queen Mate", 50 * 0.50],  // via Hinterland Scrip
    ["Queer Soul", 2.50],
    ["Railway Steel", 19 * 0.50],  // via Hinterland Scrip
    ["Rat on a String", 0.01],
    ["Rat-Shilling", 0.10],
    ["Ratskin Suit", 62.50],
    ["Rattus Faber Bandit-Chief", 160.00],
    ["Rattus Faber Rifle", 2.50],
    ["Ratty Reliquary", 12.50],
    ["Ratwork Derringer", 250.00],
    ["Ratwork Mechanism", 1250 * 0.01],  // via Moon-Pearl
    ["Ratwork Watch", 230.00],
    ["Ravenglass Knife", 51.20],
    ["Ravenous Henchman", 28.80],
    ["Ray-Drenched Cinder", 312.50],
    ["Red-Feathered Pin", 35.00],
    ["Relatively Safe Zee Lane", 62.50],
    ["Relic of the Fifth City", 2.50],
    ["Relic of the Fourth City", 0.05],
    ["Relic of the Second City", 0.15],
    ["Relic of the Third City", 0.10],
    ["Reported Location of a One-Time Prince of Hell", 1560.00],
    ["Reprehensible Lizard", 0.20],
    ["Respectable Grey Gown", 14.40],
    ["Ridiculous Hat", 0.01],
    ["Ring of Stone", 0.30],
    ["Ripened Wheel of Hellworm Cheese", 62.50],
    ["Romantic Notion", 0.10],
    ["Roof-Chart", 50 * 0.05],  // via Stuiver
    ["Rookery Password", 60.00],
    ["Rostygold Ring", 6.25],
    ["Rough Gown", 0.20],
    ["Royal-Blue Feather", 0.50],
    ["Rubbery Associate", 0.20],
    ["Rubbery Conspirator", 0.01],
    ["Rubbery Euphonium", 3.00],
    ["Rumour of the Upper River", 2.50],
    ["Rumourmonger's Network", 1560.00],
    ["Rusted Stirrup", 0.10],
    ["Ruthless Henchman", 62.50],
    ["Salt Steppe Atlas", 62.50],
    ["Salt Weasel", 2.50],
    ["Sample of Lacreous Affection", 312.50],
    ["Sample of Roof-Drip", 2 * 0.05],  // via Stuiver
    ["Sap of the Cedar at the Crossroads", 125 * 0.50],  // via Hinterland Scrip
    ["Sapphire", 0.12],
    ["Sausage About Which No One Complains", 12.50],
    ["Scrap of Incendiary Gossip", 0.50],
    ["Scrap of Ivory Organza", 312.50],
    ["Scuttering Squad", 10.00],
    ["Searing Enigma", 62.50],
    ["Secluded Address", 0.50],
    ["Secret College", 25 * 62.50],  // via Searing Enigma
    ["Selenitic Fragment", 2.50],  // via Aeolian Scream
    ["Semiotic Monocle", 312.50],
    ["Set of Intricate Kifers", 312.50],
    ["Set of Kifers", 32.40],
    ["Set of Workman's Clothes", 0.08],
    ["Seven-Throated Warbler", 12.50],
    ["Shabby Opera Cloak", 0.20],
    ["Shard of Glim", 0.01],
    ["Shard of Glim the Size of a Small Child", 16.50],
    ["Shard of Lightless Glim", 0.01],  // via Piece of Rostygold
    ["Short Story", 2.00],
    ["Shrivelled Ball", 0.30],
    ["Sighting of a Parabolan Landmark", 0.10],
    ["Silent Soul", 12.50],
    ["Silk Scrap", 0.01],
    ["Silvered Cat's Claw", 0.10],
    ["Skyglass Knife", 3.20],
    ["Slavering Dream-Hound", 35.00],
    ["Smock of Four Thousand Three Hundred and Eight Pockets", 210.00],
    ["Sneak-Thief's Mask", 10.00],
    ["Snuffer's Face", 200.00],
    ["Sober Dress", 0.08],
    ["Solacefruit", 0.50],
    ["Soothe & Cooper Long-Box", 25 * 2.50],  // via An Identity Uncovered!
    ["Soul", 0.02],
    ["Sporing Bonnet", 1.50],
    ["Stained Red Velvet Gown", 6.40],
    ["Stalemate", 125 * 0.50],  // via Hinterland Scrip
    ["Starry-Eyed Scoundrel", 14.00],
    ["Starstone Demark", 312.50],
    ["Starved Expression", 10 * 0.05],  // via Stuiver
    ["Stashed Treasure", 0.01],
    ["Stolen Correspondence", 0.05],
    ["Stolen Kiss", 2.50],
    ["Storm-Threnody", 12.50],
    ["Strange-Shore Parabola Frock", 470.00],
    ["Strange-Shore Parabola Suit", 470.00],
    ["Strong-Backed Labour", 2.50],
    ["Stuiver", 0.05],
    ["Sulky Bat", 0.20],
    ["Sumptuous Dandy's Outfit", 230.00],
    ["Surface-Silk Scrap", 0.10],
    ["Survey of the Neath's Bones", 0.50],  // via Hinterland Scrip
    ["Sworn Statement", 2.50],
    ["Tailfeather Brilliant as Flame", 2.50],
    ["Tale of Terror!!", 0.50],
    ["Talkative Rattus Faber", 0.50],
    ["Tantalising Possibility", 0.10],
    ["Tasselled Sword-Cane", 14.40],
    ["Tasselled Walking-Stick", 2.50],
    ["Tempestuous Tale", 10 * 0.05],  // via Stuiver
    ["Tentacle Mitts", 400 * 0.50],  // via Hinterland Scrip
    ["Thirsty Bombazine Scrap", 2.50],
    ["Thrilling Short Story", 50.00],
    ["Tin of Zzoup", 2.50],
    ["Tinned Ham", 63.50],
    ["Tiny Jewelled Reliquary", 35.00],
    ["Touching Love Story", 2.50],
    ["Trace of Viric", 0.50],
    ["Traces of the Tabernacle", 0.01],
    ["Tracklayer's Helmet", 125 * 0.50],  // via Hinterland Scrip
    ["Trade Secret", 60.00],
    ["Tub of Gloam-Foam", 200.00],
    ["Twelve-Carat Diamond Ring", 225.00],
    ["Unassuming Crate", 20.00],
    ["Uncanny Incunabulum", 12.50],
    ["Unearthly Fossil", 2.50],
    ["Unidentified Thigh Bone", 0.50],  // via Hinterland Scrip
    ["Unjustifiable Necktie", 75.00],
    ["Unlawful Device", 12.50],
    ["Unloved Short Story", 1.00],
    ["Unprovenanced Artefact", 2.50],
    ["Unscrupulous Raven Advisor", 40.00],
    ["Unusual Love Story", 0.50],
    ["Use of Villains", 6.00],
    ["Veils-Velvet Scrap", 1560.00],
    ["Venge-Rat Corpse", 0.50],
    ["Venom-Ruby", 0.10],
    ["Venom-Ruby Lure", 6.25],
    ["Vestige of a Starlit Reverie", 312.50],
    ["Vial of Cantigaster Venom", 312.50],
    ["Vial of Masters' Blood", 1562.60],
    ["Vial of Tears of the Bazaar", 312.50],
    ["Vienna Opening", 5 * 0.50],  // via Hinterland Scrip
    ["Virginia's Spare Pillbox Hat", 35.00],
    ["Vision of the Surface", 0.50],
    ["Vital Intelligence", 12.50],
    ["Vitreous Almanac", 12.50],
    ["Volume of Collated Research", 2.50],
    ["Voracious Glove", 57.60],
    ["Wary Raven Advisor", 9.00],
    ["Waswood Almanac", 312.50],
    ["Weasel of Woe", 100.00],
    ["Whirring Contraption", 6.00],
    ["Whisper-Satin Scrap", 0.50],
    ["Whispered Hint", 0.01],
    ["Winsome Dispossessed Orphan", 32.40],
    ["Wolfie", 0.01],
    ["Working Rat", 32.40],
    ["Zee-Ztory", 0.50],
    ["Übergoat", 11712.80],
]);

const ITEM_ID_BY_NAME: Map<string, number> = new Map([
    ["A Blue and Shining Stone", 22523],
    ["A Boxed Cat?", 634],
    ["A Headful of Picaresque Tales", 22522],
    ["A Miniature Model Ship", 108650],
    ["A Mislaid Diamond", 144306],
    ["A Monstrous Orb", 102578],
    ["A Partially Unwrapped Cat?", 635],
    ["A River In A Box", 16677],
    ["A Sealed Copy of the Crimson Book", 107903],
    ["A Seat at the Board", 144796],
    ["A Tasting Flight of Targeted Toxins", 142504],
    ["Admiral-in-a-Box", 141644],
    ["Aeolian Scream", 773],
    ["Albatross Wing", 140850],
    ["Alluring Accomplice", 350],
    ["Amanita Sherry", 928],
    ["Amber-Topped Walking-Stick", 335],
    ["Ambiguous Eolith", 122485],
    ["An Identity Uncovered!", 657],
    ["Anarchist's Sable", 1044],
    ["Ancient Hunting Rifle", 329],
    ["Anning's Patent Ribcage Breastplate", 142588],
    ["Annings' Complete and Reliable Kit for the Preservation and Display of Skeletons", 141546],
    ["Anticandle", 142750],
    ["Antique Constable's Badge", 748],
    ["Antique Mystery", 946],
    ["Apostate's Psalm", 142250],
    ["Appalling Secret", 390],
    ["Araby Fighting-Weasel", 498],
    ["Ascended Ambergris", 145002],
    ["Assortment of Khaganian Coinage", 142708],
    ["Attar", 139723],
    ["Avid Glove", 294],
    ["Baited Riddle", 143912],
    ["Bandage Scrap", 144247],
    ["Baptised Rattus Faber Corpse", 14620],
    ["Basket of Rubbery Pies", 140894],
    ["Bat with Attitude", 485],
    ["Battered Grey Overcoat", 315],
    ["Bazaar Permit", 741],
    ["Beguiling Mask", 310],
    ["Bejewelled Lens", 763],
    ["Bengal Tigress", 728],
    ["Bessemer Steel Ingot", 141159],
    ["Bifurcated Owl", 899],
    ["Blackmail Material", 858],
    ["Blood Oath", 146694],
    ["Bloodstained Suit", 722],
    ["Bone Fragments", 140889],
    ["Book of Hidden Bodies", 746],
    ["Bottle of Broken Giant 1844", 823],
    ["Bottle of Fourth City Airag: Year of the Tortoise", 824],
    ["Bottle of Greyfields 1868 First Sporing", 473],
    ["Bottle of Greyfields 1879", 382],
    ["Bottle of Greyfields 1882", 383],
    ["Bottle of Morelways 1872", 815],
    ["Bottle of Strangling Willow Absinthe", 822],
    ["Bottled Oblivion", 557],
    ["Brass Ring", 482],
    ["Breath of the Void", 934],
    ["Bright Brass Skull", 749],
    ["Brilliant Soul", 668],
    ["Bundle of Fourth City Rags", 314],
    ["Bundle of Glad Rags", 723],
    ["Bundle of Ragged Clothing", 313],
    ["Captivating Ballad", 142386],
    ["Carnelian Sapphire Pendant", 145127],
    ["Cartographer's Hoard", 141189],
    ["Carved Ball of Stygian Ivory", 122483],
    ["Caustic Apocryphon", 144751],
    ["Cave-Aged Code of Honour", 141883],
    ["Celebrated Short Story", 18396],
    ["Cellar of Wine", 736],
    ["Certifiable Scrap", 918],
    ["Cheerful Goldfish", 464],
    ["Chimerical Archive", 142448],
    ["Classic Short Story", 18381],
    ["Clockwork Drownie", 141643],
    ["Collection of Curiosities", 743],
    ["Compelling Short Story", 18308],
    ["Competent Short Story", 18100],
    ["Complaisant Frost-Moth", 23899],
    ["Comprehensive Bribe", 742],
    ["Compromising Document", 830],
    ["Conceptual Breakthrough in Currency Design", 142754],
    ["Copper Cipher Ring", 758],
    ["Correspondence Plaque", 932],
    ["Corresponding Ocelot", 877],
    ["Corsetted Dress", 717],
    ["Coruscating Soul", 669],
    ["Crackling Device", 142840],
    ["Crate of Incorruptible Biscuits", 140892],
    ["Cryptic Clue", 389],
    ["Cryptobotanical Rosette", 862],
    ["Crystallised Curio", 142359],
    ["Dark-Dewed Cherry", 618],
    ["Dazed Raven Advisor", 342],
    ["Deep-zee Catch", 122484],
    ["Deshrieked Mandrake", 343],
    ["Devilbone Die", 653],
    ["Devilish Fedora", 21847],
    ["Devilish Probability Distributor", 141281],
    ["Devilishly Slinky Evening Gown", 141680],
    ["Devious Henchman", 348],
    ["Devious Raven Advisor", 14734],
    ["Diary of the Dead", 762],
    ["Dignified Tailcoat", 320],
    ["Direful Reflection", 105858],
    ["Dismal Victuals", 144241],
    ["Distinguished Gentleman's Outfit", 322],
    ["Dove Mask Shard", 678],
    ["Dreadful Surmise", 814],
    ["Dreamy Raven Advisor", 14431],
    ["Drop of Prisoner's Honey", 391],
    ["Dubious Testimony", 13929],
    ["Eager Glove", 293],
    ["Edicts of the First City", 142087],
    ["Elegant Emerald Gown", 321],
    ["Element of Dawn", 122493],
    ["Elemental Secret", 14975],
    ["Emergency Blunderbuss", 1004],
    ["Emetic Revelation", 142709],
    ["Endowment of a University Fellowship", 759],
    ["Engraved Pewter Tankard", 757],
    ["Entry in Slowcake's Exceptionals", 752],
    ["Epaulette Mate", 140971],
    ["Exceptional Hat", 311],
    ["Exceptional Short Story", 18310],
    ["Exigent Note", 143056],
    ["Exquisite Ivory Gown", 326],
    ["Extraordinary Hat", 312],
    ["Extraordinary Implication", 809],
    ["Extraordinary Short Story", 18311],
    ["Eyeless Skull", 23504],
    ["F.F. Gebrandt's Flame-Resilient Paper", 142190],
    ["F.F. Gebrandt's Superior Laudanum", 477],
    ["F.F. Gebrandt's Tincture of Vigour", 470],
    ["F.F. Gebrandt's Tincture of Vigour: Half-Full", 471],
    ["Fabulous Diamond", 12187],
    ["Faded Morning Suit", 726],
    ["Fairly Tame Sorrow-Spider", 344],
    ["False Hagiotoponym", 142249],
    ["False Lead", 813],
    ["Far Khanate Lacquered Armour", 21892],
    ["Favour in High Places", 744],
    ["Fecund Amber Tiara", 21845],
    ["Femur of a Jurassic Beast", 140773],
    ["Femur of a Surface Deer", 140771],
    ["Final Breath", 141161],
    ["Fingerking Scale", 144217],
    ["Firkin of Hesperidean Cider", 410],
    ["First City Coin", 582],
    ["Fistful of Surface Currency", 421],
    ["Flask of Abominable Salts", 476],
    ["Flawed Diamond", 449],
    ["Fluke Spine, Freely Given", 144215],
    ["Fluke-Core", 106683],
    ["Focused Albatross", 140724],
    ["Formidable Gown", 720],
    ["Fossilised Forelimb", 141540],
    ["Fourth-City Echo", 142797],
    ["Foxfire Candle Stub", 374],
    ["Fragment of White Gold", 676],
    ["Fragment of the Tragedy Procedures", 123213],
    ["Fraught Research Assistant", 118788],
    ["Frayed Thread", 144315],
    ["Fungal Dangers and Poisons: A Guide for New Growers", 141569],
    ["Gay Bonnet", 308],
    ["Gentleman's Athletic Support", 718],
    ["Gentleman's Hat", 305],
    ["Gift of Scorn", 560],
    ["Gift of Transcendent Devotion", 561],
    ["Glim-Encrusted Carapace", 145008],
    ["Glimpse of Anathema", 145282],
    ["Grubby Urchin", 346],
    ["Hand-picked Peppercaps", 141541],
    ["Haunted-looking Dog", 818],
    ["Helical Thighbone", 141480],
    ["Hiding Place of a Peculiar Item", 142447],
    ["Highwayman's Cloak", 141627],
    ["Hillmover", 140900],
    ["Hinterland Scrip", 125025],
    ["Horsehead Amulet", 468],
    ["Impossible Theorem", 106142],
    ["Incisive Observation", 140898],
    ["Infernal Contract", 426],
    ["Infernal Sharpshooter's Rifle", 21896],
    ["Infernally Well-cut Suit", 141681],
    ["Inkling of Identity", 656],
    ["Insatiable Glove", 301],
    ["Intriguer's Compendium", 931],
    ["Intriguing Snippet", 588],
    ["Iron Hat", 304],
    ["Iron Republic Journal", 1064],
    ["Irresistible Drum", 338],
    ["Ivory Humerus", 140849],
    ["Jade Fragment", 377],
    ["Jasmine Leaves", 141374],
    ["Journal of Infamy", 525],
    ["Judgements' Egg", 122486],
    ["Knob of Scintillack", 122495],
    ["Knotted Humerus", 140772],
    ["Legal Document", 739],
    ["Legenda Cosmogone", 142295],
    ["Light-Drinking Cravat", 145126],
    ["Limpid Soul", 144219],
    ["Lithification Liquid", 141548],
    ["Live Specimen", 122488],
    ["London Street Sign", 392],
    ["Lucky Weasel", 441],
    ["Lump of Lamplighter Beeswax", 384],
    ["M. Demeaux's Advice for Captains: Commemorative Edition", 116011],
    ["Magisterial Lager", 141574],
    ["Magnificent Diamond", 12188],
    ["Magnificent Midnight-Blue Evening Gown", 324],
    ["Maidservant's Uniform", 725],
    ["Malevolent Monkey", 351],
    ["Maniac's Prayer", 935],
    ["Map Scrap", 920],
    ["Mask of the Rose", 555],
    ["Masterful Short Story", 18312],
    ["Memory of Distant Shores", 825],
    ["Memory of Light", 589],
    ["Memory of Moonlight", 144977],
    ["Memory of Sunlight", 144218],
    ["Memory of a Much Stranger Self", 144983],
    ["Memory of a Shadow in Varchas", 142659],
    ["Meticulously Altered Stocking", 106571],
    ["Midnight Matriarch", 21898],
    ["Mirthless Compendium of Statistical Observations", 141283],
    ["Misplaced Ring", 142589],
    ["Model Infernal Locomotive", 141641],
    ["Modish Bonnet", 465],
    ["Moon-Pearl", 379],
    ["Morning Suit", 719],
    ["Mountain-sherd", 122492],
    ["Mourning Candle", 951],
    ["Moves in the Great Game", 122490],
    ["Much-Needed Gap", 142855],
    ["Muscaria Brandy", 927],
    ["Mystery of the Elder Continent", 587],
    ["Mystic Raven Advisor", 14731],
    ["Neddy Suit", 1043],
    ["Neo-Echo", 144213],
    ["Nevercold Brass Sliver", 387],
    ["Nicatorean Relic", 141916],
    ["Night on the Town", 735],
    ["Night-Trimmed Frock Coat", 323],
    ["Night-Whisper", 933],
    ["Nightsoil of the Bazaar", 141158],
    ["Nikolas & Sons Instant Ablution Absolution", 523],
    ["No Currency", 144214],
    ["Nodule of Deep Amber", 385],
    ["Nodule of Fecund Amber", 16308],
    ["Nodule of Pulsating Amber", 754],
    ["Nodule of Trembling Amber", 949],
    ["O'Boyle's Practical Primer in the Various Languages of Nippon, Tartary, Cathay and the Princedoms of the Raj", 756],
    ["Obdurate Stallion", 875],
    ["Ocular Toadbeast", 876],
    ["Old Bone Skeleton Key", 753],
    ["Oneiric Pearl", 142666],
    ["Oneiromantic Revelation", 142662],
    ["Ornate Typewriter", 755],
    ["Ostentatious Diamond", 12186],
    ["Ounce of Lily-Balm", 144243],
    ["Outfit of Black Felt Garments", 317],
    ["Overgoat", 355],
    ["Page from the Liber Visionis", 619],
    ["Pair of Balmoral Boots", 141538],
    ["Pair of Cracksman's Mittens", 296],
    ["Pair of Cutpurse's Mittens", 292],
    ["Pair of Dancemaster's Dabs", 298],
    ["Pair of Forgotten Spidersilk Slippers", 23902],
    ["Pair of Hushed Spidersilk Slippers", 363],
    ["Pair of Iron Manacles", 290],
    ["Pair of Irrigo Goggles", 23901],
    ["Pair of Kingscale Boots", 21846],
    ["Pair of Knife-and-Candler's Gloves", 295],
    ["Pair of Lady's Lace Gloves", 299],
    ["Pair of Leg Irons", 356],
    ["Pair of Lenguals", 21848],
    ["Pair of Luminous Neathglass Goggles", 307],
    ["Pair of Magician's Gloves", 291],
    ["Pair of Master Thief's Hands", 302],
    ["Pair of Masterwork Dancing Slippers", 360],
    ["Pair of Neathglass Goggles", 306],
    ["Pair of Ratskin Boots", 362],
    ["Pair of Savage Hob-Nailed Boots", 361],
    ["Pair of Scarlet Stockings of Dubious Origin", 467],
    ["Pair of Scuffed Boots", 765],
    ["Pair of Spiderchitin Gauntlets", 297],
    ["Pair of Spidersilk Slippers", 359],
    ["Pair of Squeakless Boots", 358],
    ["Pair of Stylish Riding Boots", 357],
    ["Pair of Vakeskin Boots", 364],
    ["Palimpsest Scrap", 142251],
    ["Parabola-Linen Frock", 21893],
    ["Parabola-Linen Scrap", 924],
    ["Parabola-Linen Suit", 21891],
    ["Parabolan Parable", 142463],
    ["Partial Map", 956],
    ["Patent Osteological Sand and Wax", 141543],
    ["Patent Scrutinizer", 339],
    ["Patent Scrutinizer Deluxe!", 340],
    ["Pennies", 22390],
    ["Personal Recommendation", 740],
    ["Philosophical Raven Advisor", 14730],
    ["Phosphorescent Scarab", 652],
    ["Piece of Rostygold", 375],
    ["Pieces of Plunder Weighing Down Your Hold", 144024],
    ["Pirate Hat", 466],
    ["Poison-Tipped Umbrella", 729],
    ["Portfolio of Souls", 747],
    ["Pot of Venison Marrow", 141486],
    ["Presbyterate Passphrase", 852],
    ["Preserved Surface Blooms", 141157],
    ["Primaeval Hint", 832],
    ["Primordial Shriek", 388],
    ["Prison Shiv", 491],
    ["Prisoner's Mask", 303],
    ["Proscribed Material", 420],
    ["Puzzle-Damask Scrap", 923],
    ["Puzzling Map", 959],
    ["Queen Mate", 140970],
    ["Queer Soul", 122798],
    ["Railway Steel", 141162],
    ["Rat on a String", 376],
    ["Rat-Shilling", 143057],
    ["Ratskin Suit", 318],
    ["Rattus Faber Bandit-Chief", 353],
    ["Rattus Faber Rifle", 331],
    ["Ratty Reliquary", 123214],
    ["Ratwork Derringer", 332],
    ["Ratwork Mechanism", 145640],
    ["Ratwork Watch", 655],
    ["Ravenglass Knife", 330],
    ["Ravenous Henchman", 23900],
    ["Ray-Drenched Cinder", 1053],
    ["Red-Feathered Pin", 761],
    ["Relatively Safe Zee Lane", 143646],
    ["Relic of the Fifth City", 145558],
    ["Relic of the Fourth City", 423],
    ["Relic of the Second City", 425],
    ["Relic of the Third City", 424],
    ["Reported Location of a One-Time Prince of Hell", 929],
    ["Reprehensible Lizard", 442],
    ["Respectable Grey Gown", 319],
    ["Ridiculous Hat", 556],
    ["Ring of Stone", 675],
    ["Ripened Wheel of Hellworm Cheese", 143588],
    ["Romantic Notion", 531],
    ["Roof-Chart", 144982],
    ["Rookery Password", 751],
    ["Rostygold Ring", 145128],
    ["Rough Gown", 721],
    ["Royal-Blue Feather", 122494],
    ["Rubbery Associate", 354],
    ["Rubbery Conspirator", 448],
    ["Rubbery Euphonium", 817],
    ["Rumour of the Upper River", 141194],
    ["Rumourmonger's Network", 930],
    ["Rusted Stirrup", 141913],
    ["Ruthless Henchman", 349],
    ["Salt Steppe Atlas", 142202],
    ["Salt Weasel", 816],
    ["Sample of Lacreous Affection", 143044],
    ["Sample of Roof-Drip", 144821],
    ["Sap of the Cedar at the Crossroads", 143050],
    ["Sapphire", 643],
    ["Sausage About Which No One Complains", 140891],
    ["Scrap of Incendiary Gossip", 659],
    ["Scrap of Ivory Organza", 925],
    ["Scuttering Squad", 1005],
    ["Searing Enigma", 821],
    ["Secluded Address", 658],
    ["Secret College", 118813],
    ["Selenitic Fragment", 144296],
    ["Semiotic Monocle", 727],
    ["Set of Intricate Kifers", 337],
    ["Set of Kifers", 336],
    ["Set of Workman's Clothes", 436],
    ["Seven-Throated Warbler", 140709],
    ["Shabby Opera Cloak", 724],
    ["Shard of Glim", 378],
    ["Shard of Glim the Size of a Small Child", 142094],
    ["Shard of Lightless Glim", 144216],
    ["Short Story", 18101],
    ["Shrivelled Ball", 677],
    ["Sighting of a Parabolan Landmark", 142660],
    ["Silent Soul", 23695],
    ["Silk Scrap", 381],
    ["Silvered Cat's Claw", 141917],
    ["Skyglass Knife", 327],
    ["Slavering Dream-Hound", 878],
    ["Smock of Four Thousand Three Hundred and Eight Pockets", 21895],
    ["Sneak-Thief's Mask", 309],
    ["Snuffer's Face", 21894],
    ["Sober Dress", 435],
    ["Solacefruit", 122491],
    ["Soothe & Cooper Long-Box", 114982],
    ["Soul", 386],
    ["Sporing Bonnet", 544],
    ["Stained Red Velvet Gown", 316],
    ["Stalemate", 140980],
    ["Starry-Eyed Scoundrel", 140648],
    ["Starstone Demark", 936],
    ["Starved Expression", 144822],
    ["Stashed Treasure", 144025],
    ["Stolen Correspondence", 422],
    ["Stolen Kiss", 944],
    ["Storm-Threnody", 849],
    ["Strange-Shore Parabola Frock", 23897],
    ["Strange-Shore Parabola Suit", 23898],
    ["Strong-Backed Labour", 764],
    ["Stuiver", 144995],
    ["Sulky Bat", 443],
    ["Sumptuous Dandy's Outfit", 325],
    ["Surface-Silk Scrap", 907],
    ["Survey of the Neath's Bones", 141170],
    ["Sworn Statement", 13928],
    ["Tailfeather Brilliant as Flame", 141160],
    ["Tale of Terror!!", 828],
    ["Talkative Rattus Faber", 558],
    ["Tantalising Possibility", 145109],
    ["Tasselled Sword-Cane", 334],
    ["Tasselled Walking-Stick", 333],
    ["Tempestuous Tale", 144955],
    ["Tentacle Mitts", 141628],
    ["Thirsty Bombazine Scrap", 922],
    ["Thrilling Short Story", 18309],
    ["Tin of Zzoup", 121611],
    ["Tinned Ham", 141542],
    ["Tiny Jewelled Reliquary", 750],
    ["Touching Love Story", 945],
    ["Trace of Viric", 141914],
    ["Traces of the Tabernacle", 146438],
    ["Tracklayer's Helmet", 141539],
    ["Trade Secret", 13640],
    ["Tub of Gloam-Foam", 21897],
    ["Twelve-Carat Diamond Ring", 730],
    ["Unassuming Crate", 142710],
    ["Uncanny Incunabulum", 812],
    ["Unearthly Fossil", 810],
    ["Unidentified Thigh Bone", 140756],
    ["Unjustifiable Necktie", 145129],
    ["Unlawful Device", 141946],
    ["Unloved Short Story", 18379],
    ["Unprovenanced Artefact", 122487],
    ["Unscrupulous Raven Advisor", 14733],
    ["Unusual Love Story", 829],
    ["Use of Villains", 737],
    ["Veils-Velvet Scrap", 926],
    ["Venge-Rat Corpse", 14621],
    ["Venom-Ruby", 642],
    ["Venom-Ruby Lure", 145125],
    ["Vestige of a Starlit Reverie", 143045],
    ["Vial of Cantigaster Venom", 104821],
    ["Vial of Masters' Blood", 24121],
    ["Vial of Tears of the Bazaar", 12350],
    ["Vienna Opening", 140978],
    ["Virginia's Spare Pillbox Hat", 140608],
    ["Vision of the Surface", 827],
    ["Vital Intelligence", 122489],
    ["Vitreous Almanac", 142661],
    ["Volume of Collated Research", 745],
    ["Voracious Glove", 300],
    ["Wary Raven Advisor", 14732],
    ["Waswood Almanac", 142669],
    ["Weasel of Woe", 144549],
    ["Whirring Contraption", 738],
    ["Whisper-Satin Scrap", 915],
    ["Whispered Hint", 380],
    ["Winsome Dispossessed Orphan", 347],
    ["Wolfie", 484],
    ["Working Rat", 345],
    ["Zee-Ztory", 831],
    ["Übergoat", 102305],
]);

export {ITEM_PRICES_BY_ID, ITEM_PRICES_BY_NAME, ITEM_ID_BY_NAME};

