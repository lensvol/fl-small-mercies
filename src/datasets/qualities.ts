// This information was compiled using data submitted to the "Fallen London Wiki"
// (https://fallenlondon.wiki) by its contributors and is used here under
// CC-BY-SA 3.0 license (https://creativecommons.org/licenses/by-sa/3.0/)

const PYRAMIDAL_QUALITY_IDS: number[] = [
    // Watchful
    209,
    // Shadowy
    210,
    // Dangerous
    211,
    // Persuasive
    212,
    // Knife-and-Candle Rank
    213,
    // Wounds
    214,
    // Scandal
    215,
    // Suspicion
    216,
    // Nightmares
    217,
    // Preparing for a Daring Escape
    230,
    // A Stranger
    231,
    // Homeless!
    233,
    // Having Recurring Dreams: Is Someone There?
    234,
    // Having Recurring Dreams: Death by Water
    235,
    // Having Recurring Dreams: What the Thunder Said
    236,
    // Having Recurring Dreams: The Burial of the Dead
    237,
    // Having Recurring Dreams: The Fire Sermon
    238,
    // Having Recurring Dreams: A Game of Chess
    239,
    // Menace Eradication Contract: Destroy Ferocious Rat
    240,
    // Commission: Praising Fungus in Verse
    245,
    // Commission: Immortalise Jack-of-Smiles in a Penny Dreadful!
    246,
    // Commission: Write about Prisoner's Honey
    247,
    // Seduction: Artist
    249,
    // Seduction: Artist's Model
    250,
    // Seduction: Honey-Sipping Jewel-Thief
    251,
    // Seduction: Honey-Sipping Heiress
    252,
    // Villainy: Area-Diving
    253,
    // Seeking...
    255,
    // Investigating...
    256,
    // Inspired...
    257,
    // Fascinating...
    258,
    // Running Battle...
    259,
    // Disappearing...
    261,
    // Casing...
    262,
    // Daring
    264,
    // Heartless
    265,
    // Magnanimous
    266,
    // Ruthless
    267,
    // Forceful
    268,
    // Subtle
    269,
    // Hedonist
    270,
    // Ambition: Heart's Desire!
    271,
    // Ambition: Bag a Legend!
    272,
    // Ambition: Light Fingers!
    273,
    // Ambition: Nemesis
    274,
    // Ambition: Enigma
    275,
    // Connected: Bohemian
    276,
    // Connected: The Great Game
    277,
    // Connected: Criminals
    278,
    // Connected: Urchins
    279,
    // Connected: The Church
    280,
    // Connected: Hell
    281,
    // Connected: The Docks
    282,
    // Connected: The Tomb-Colonies
    283,
    // Connected: The Widow
    284,
    // Connected: Revolutionaries
    285,
    // Connected: The Constables
    286,
    // Connected: Society
    287,
    // Connected: Rubbery Men
    288,
    // Vermin-free
    289,
    // From the Less Imaginary Suitcase
    412,
    // Route: The Shuttered Palace
    427,
    // Route: Wolfstack Docks
    428,
    // Route: The Forgotten Quarter
    429,
    // Route: The Flit
    430,
    // Tracking down the Manager
    438,
    // An Infernal Informant
    439,
    // A Constables' Pet
    440,
    // Ambition: Heart's Desire - The Bishop of St Fiacre's
    444,
    // Heart's Desire: Scrawled Notes on the Walls
    446,
    // An Annoyance to Jack-of-Smiles
    452,
    // Inconvenienced by Your Aunt
    454,
    // Marked by the Eater-of-Chains
    456,
    // Ambition: Nemesis - Forgotten Quarter
    460,
    // A Courier for the Dead
    472,
    // Acquaintance: the Sardonic Music-Hall Singer
    475,
    // Tragedy: Death of a Spouse
    478,
    // Tragedy: Death of a Lover
    479,
    // Tragedy: Death of a Brother
    480,
    // Tragedy: Death of a Daughter
    481,
    // Acquaintance: the Regretful Soldier
    483,
    // The Bazaar's Questions
    487,
    // Villainy: Stealing Paintings for the Topsy King
    488,
    // A Veteran of Mr Sacks' Visits
    489,
    // Connected: The Masters of the Bazaar
    490,
    // Commissioned to Enact Love's Revenge
    494,
    // Acquaintance: the Repentant Forger
    495,
    // Acquaintance: the Wry Functionary
    497,
    // Steadfast
    500,
    // Hearing Rumours of Virginia's Progress
    501,
    // Hearing Rumours of Orthos' Progress
    502,
    // Archaeologist
    503,
    // Connected: The Duchess
    504,
    // Engaged in a Rivalry of Antiquities
    505,
    // An Admirer of Art -
    508,
    // An Admirer of Beauty -
    509,
    // A Scholar of the Correspondence
    510,
    // Seduction: a Rising Artist
    511,
    // Seduction: a Rising Artist's Model
    512,
    // Ascending the Reliables List of Mr Pages
    519,
    // Melancholy
    521,
    // Hearing Things...or are you?
    522,
    // Plotting against the Masters
    526,
    // An Umpire of the Game of Knife-and-Candle
    528,
    // A Neddy Man
    532,
    // A Union Sympathiser
    533,
    // Master Thief
    535,
    // Making Waves
    545,
    // Duelling with the Black Ribbon
    547,
    // A Fearsome Duellist
    548,
    // Route: Mrs Plenty's Most Distracting Carnival
    550,
    // A Bringer of Death
    551,
    // Involved in the Soul Trade
    564,
    // Acquiring Exhibits for the Labyrinth of Tigers
    569,
    // A Procurer of Savage Beasts
    570,
    // The Hunt Is On!
    571,
    // Austere
    572,
    // Making Use of Cats
    573,
    // Making Use of Bats
    574,
    // Embroiled in the Wars of Illusion
    575,
    // Investigating the Rubbery Murders
    576,
    // A Nocturnal Visitor to the Palace Cellars
    579,
    // A Zailor in the Making
    580,
    // In Contact with a Long-Lost Daughter
    581,
    // Inciting a Simian Revenge?
    583,
    // Planning a Theft from the Museum of Mistakes
    584,
    // Ambition: Heart's Desire - the Topsy King
    586,
    // On the Trail of the Cheesemonger
    591,
    // An Agent of the Cheesemonger
    592,
    // The Great Game: A Fine Piece in the Game -
    594,
    // An Intimate of Devils
    596,
    // Connected: Benthic
    598,
    // Connected: Summerset
    599,
    // Featuring in the Tales of the University
    600,
    // Term Passing...
    602,
    // Route: The University
    604,
    // The Protégé of a Mysterious Benefactor
    605,
    // One Who Has Indulged in Unknown Pleasures
    611,
    // Ambition: Nemesis - Shuttered Palace
    612,
    // Seen with an Acclaimed Beauty
    614,
    // Seen with a Barbed Wit
    615,
    // Uncovering the Secrets of the Face-Tailor
    621,
    // In the Labyrinth of Tigers, Navigating Coil
    622,
    // Making Progress in the Labyrinth of Tigers
    623,
    // Time Passing in the Labyrinth
    624,
    // Route: The Labyrinth of Tigers
    625,
    // Carving out a Reputation at Court
    626,
    // Banished from the Court -
    636,
    // In the Lead
    638,
    // Assisting a Keen-Eyed Lapidary
    646,
    // In Search of a Stiff Drink
    647,
    // Investigating a threat to your Rat Companions...
    648,
    // Unwelcome at the University -
    649,
    // A Veteran of All Hallows' Eve
    651,
    // Sympathetic about Ratly Concerns
    654,
    // Caught Up in a Soldier's Heartbreaking Tale
    662,
    // The Boatman's Opponent
    663,
    // Uncovering Secrets Framed in Gold
    664,
    // Solving Cases around London
    667,
    // Having Rodentine Minions Investigate...
    670,
    // Serenity of the Plaster Face
    671,
    // Seeking the Meaning of the Plaster Face
    672,
    // Connected: Glass
    682,
    // Connected: Shroud
    683,
    // Day of the Week
    684,
    // Tales of Mahogany Hall
    685,
    // Plagued by a Popular Song
    686,
    // Playing with Broken Toys
    687,
    // Intimate with a Revolutionary Firebrand
    695,
    // Route: Mahogany Hall
    696,
    // Looking for your Soul
    698,
    // Attending to the Needs of a Singular Plant
    699,
    // Raking the Muck of the Neath
    731,
    // Pygmalion
    733,
    // Visiting Flute Street
    766,
    // An Explorer of the Unterzee -
    771,
    // Entangled with the Legal Profession
    772,
    // Stormy-Eyed
    774,
    // Shaping Clay
    778,
    // Having Transportation Difficulties
    780,
    // Making Friends among the Young Stags
    783,
    // Sniffing Around The Parthenaeum
    785,
    // Pursuing a Case of Books
    787,
    // Facing the Rat Army
    789,
    // Making Friends among God's Editors
    791,
    // Gaining a Criminal Reputation
    795,
    // Committed:
    798,
    // Courting the Celebrated Artist's Model
    799,
    // Courting the Master Jewel Thief
    800,
    // Route: Bazaar Side-Streets
    803,
    // In Possession of a Peculiar Personal Enhancement -
    804,
    // Indulging a Less than Laudable Laudanum Habit
    806,
    // Approaching Journey's End
    807,
    // Troubled Waters
    808,
    // Time Passing in the Southern Archipelago
    819,
    // Dramatic Tension
    820,
    // Acquainted with Miriam Plenty's Past
    826,
    // An Experienced Zailor:
    839,
    // Learning from a Silk-Clad Expert
    840,
    // Taming the Beast
    846,
    // Thwarting Beastly Devils
    847,
    // In the Company of Monsters
    850,
    // Exploring the Orphanage
    854,
    // Attracting Attention in the Orphanage
    855,
    // Sign of the Chiropteromantic Zodiac:
    856,
    // Route: Wilmot's End
    859,
    // Doing Business in Wilmot's End
    860,
    // Walking the Paths of Wilmot's End
    861,
    // Searching out a Missing Woman
    864,
    // Looking in High Places and Low
    865,
    // Talk of the Town
    866,
    // Fighting a War of Assassins
    867,
    // Enjoying Lethal Prominence -
    869,
    // On the Velocipede Squad
    870,
    // Riding the Savage Cobbles
    871,
    // Working toward a Foreign Posting
    873,
    // Bound in Diocesan Intrigue
    879,
    // Hellfarer
    880,
    // Fist of the Bazaar
    881,
    // Empire's Kingmaker
    882,
    // Why You Fight -
    883,
    // A Brazen Fate -
    885,
    // The Spinning of the Wheels
    886,
    // Mysteries of the Foreign Office
    888,
    // Orthos is Coming!
    894,
    // Embarking on a Voyage of Scientific Discovery
    895,
    // Defender of Truth -
    914,
    // Prophet of the Gutter -
    916,
    // Cardinal of Conspiracy -
    917,
    // Seeking a Better Class of Violence
    937,
    // Enjoying the bohemian atmosphere of Veilgarden
    938,
    // Unravelling a Coded Message
    939,
    // Collecting Clues for the Clay Coalman
    940,
    // Befriending a Rooftop Urchin
    942,
    // Respectable
    950,
    // Dreaded
    957,
    // Bizarre
    958,
    // Seeing through the Eyes of Icarus
    960,
    // Touched by Fingerwork
    961,
    // Walking the Falling Cities
    962,
    // Approaching the Gates of the Garden
    963,
    // Polythreme Ho!
    977,
    // Screaming Map: A Visitor!
    978,
    // Looking for the Exceptional Rose
    979,
    // Free of the Name
    988,
    // Recalling a Dream of Other Places
    990,
    // The Dilmun Club: Loyalties
    992,
    // The Subject of Admiring Attention
    994,
    // Impossible!
    995,
    // Mired in Clay
    996,
    // Caught in the Gear's Teeth
    998,
    // Writing of your Polythreme Travels
    999,
    // Spying on Polythreme
    1000,
    // Causing the wrong sort of interest
    1019,
    // Getting to Know Cobblestone Rogues and Back-Alley Saints
    1021,
    // Family and Law
    1022,
    // Playing with Soul
    1025,
    // The Blind Pianist and the Sallow Spirifer
    1026,
    // Someone Is Coming
    1028,
    // Spending Secrets
    1029,
    // Counting the Days
    1031,
    // An Unfinished Story
    1034,
    // A Pocketful of Loose Change
    1037,
    // The Photographer and the Contrarian
    1042,
    // Iron Republic Days
    1061,
    // Remembering the Orphanage
    1071,
    // The Jack-of-Smiles Case
    1074,
    // Seeking the Next Breakthrough on the Jack Case
    1076,
    // Changed by the Iron Republic
    1077,
    // Jack's Gone -
    1080,
    // Are they talking about you?
    1096,
    // Planning a Heist:
    10065,
    // Target Security:
    10164,
    // Putting the Pieces Together: the Drownies
    10279,
    // A Clear Path
    12293,
    // A Connoisseur of Neathy Delights
    12620,
    // Investigating the Twelve Days of Mr Sacks with:
    12679,
    // Profession:
    13615,
    // A Particular Day in the Neath
    13837,
    // Acquaintance: the Captivating Princess
    16272,
    // A Participant in the Underground Leagues of Knife-and-Candle
    17766,
    // You have a Knife-and-Candle Pact with...
    20418,
    // Sponsored in the Game of Knife-and-Candle
    20920,
    // Your Quarry:
    22333,
    // Engaged in a Scheme: an Orphanage
    101598,
    // Engaged in a Scheme: a Salon
    101830,
    // Quarry's Greed
    102154,
    // The Smuggler's Lamp
    102574,
    // A Possible Future:
    105134,
    // The Mark of Destiny
    105135,
    // Advancing the Liberation of Night:
    106226,
    // Noman Knows
    106757,
    // A Criminal Record:
    106759,
    // Seen with
    107481,
    // Engaged to
    107482,
    // Betrayed by
    107483,
    // Fleeting Recollections
    107562,
    // The Great Game - Opening Moves
    109222,
    // Sunless Sea: Advice for the Navigator
    109921,
    // Parabolan Places:
    110559,
    // Picking Through the Wreckers' Cove
    111901,
    // The Date -
    113277,
    // Exposed by
    113767,
    // Sunless Sea: A Soothe & Cooper Long-Box
    116075,
    // You Disposed of a Whisper-Locked Sea-Chest
    116136,
    // Empty Skin
    117090,
    // An Episode for Exceptional Friends
    117894,
    // Time Passing in Office
    118811,
    // Business at the Dish & Spoon:
    119722,
    // Renown: Criminals
    121992,
    // Investigating the Silken Chapel
    122871,
    // A Confession of Whimsy from the Bishop of Southwark
    122882,
    // A Confession of Pride from the Bandaged Poissonnier
    122883,
    // A Confession of Violence from the Presbyterate Adventuress
    122884,
    // A Confession of Curiosity from the Genial Magician
    122885,
    // A Confession of Guile from the Haunted Doctor
    122886,
    // A Confession of Impropriety from the Nacreous Outcast
    122887,
    // Drawing from a Pilfered Sack
    123145,
    // Recognised by the Order Vespertine
    123289,
    // Recently divorced
    124661,
    // Renown: The Docks
    125528,
    // Renown: Tomb-Colonies
    125787,
    // Renown: Rubbery Men
    126001,
    // Asked to an Austere Date
    126280,
    // Offering to Aid a Wounded Friend
    126367,
    // Offering a Masterclass
    126588,
    // Significant
    126820,
    // Offered a Tiny Sip of Hesperidean Cider
    126989,
    // Scatheless
    127011,
    // Learning about the Election
    127150,
    // A Free Gift
    127187,
    // Changing Candidate
    127409,
    // A Participant in the 1894 Election
    127558,
    // Hoping for Help With a Scandal
    127585,
    // Tending a Friend with Nightmares
    127603,
    // Invited to Coffee at Caligula's
    127659,
    // Zailing Difficulty
    127664,
    // An Encounter with Jenny
    127768,
    // Access to Breakwater House
    128222,
    // Invited to Dinner at Dante's Grill
    128248,
    // Opening a Confession
    129057,
    // Hallowmas: The Aftermath of An Explosion of Revelations
    129106,
    // Renown: Urchins
    129666,
    // Considering Criminal Conundrums
    129690,
    // Sinning Jenny's Finishing School
    129935,
    // Humbly Proposing
    130201,
    // Requesting a Friend's Testimony
    130202,
    // Extravagantly Proposing
    130280,
    // Throwing a Humble Wedding
    130302,
    // Throwing an Extravagant Wedding
    130303,
    // Summoned to Testify at a Friend's Divorce
    130575,
    // Your Spouse's Requests for a Peaceful Testimony
    130578,
    // Requesting your Spouse's Cooperation in Court
    130579,
    // Divorce Papers
    130580,
    // Beginning Divorce Proceedings
    130581,
    // Asking your Spouse to an Indulgent Evening Out
    130728,
    // Asking your Spouse to a Decorous Evening Out
    130730,
    // Asking your Spouse to a Honey-Fuelled Evening
    130732,
    // Visions of the Blue Kingdom
    131572,
    // Suspected by the Constables
    131592,
    // Tremors in the Cobbles
    131732,
    // Responding to a Calling Card
    132349,
    // The Avoidance of Sleep
    132371,
    // Renown: Hell
    132801,
    // Renown: Constables
    132802,
    // An Admission of Affection
    132902,
    // Asked to an Indulgent Date
    132947,
    // Invited to a Chaperoned Date
    132948,
    // Approached to be a Patron
    132978,
    // Offered a Dangerous Masterclass
    132982,
    // Offered a Persuasive Masterclass
    132983,
    // Offered a Shadowy Masterclass
    132984,
    // Offered a Watchful Masterclass
    132985,
    // Renown: The Great Game
    133045,
    // Attending a Mayoral Ball
    133115,
    // Not Supporting Feducci
    133232,
    // Not Supporting the Implacable Detective
    133234,
    // Invited to join a Patron's Patron
    133411,
    // A Hallowmas Reveller of Old
    133465,
    // Invited to Loiter
    133560,
    // Loitering
    133561,
    // Renown: The Church
    133828,
    // Renown: Bohemians
    133830,
    // Renown: Revolutionaries
    133832,
    // Renown: Society
    133834,
    // Knowledge of the Arts
    133917,
    // The Revolution's Store
    133970,
    // A Mirror for Princes
    134135,
    // Procuring Cantigaster Venom
    134913,
    // Securing the Medusa
    134914,
    // A Devilment with the Tankards
    134916,
    // Summoning the Opponent
    134917,
    // Double or Nothing
    134918,
    // A Certificate indicating Feducci's Acknowledgement
    134968,
    // The Cheery Man's Fate
    135009,
    // The Last Constable's Fate
    135010,
    // Resetting the Last Constable and Cheery Man
    135079,
    // Casus Belli
    135135,
    // The Fall of Vesture
    135136,
    // The Regency's End
    135137,
    // A Turn in the Game
    135262,
    // Looking for Love
    136357,
    // In Arbor I Walked With
    138860,
    // An Ambassador
    138861,
    // Dawnburnt
    139734,
    // Stars Under Skin
    140081,
    // Away with your diary
    140293,
    // The Innocuous Comb
    140359,
    // Key of Bugs
    140491,
    // Noticed by the Merry Captain
    140643,
    // Noticed by the Saturnine Duke
    140644,
    // Noticed by the Queen of Air and Darkness
    140645,
    // Route: Moloch Street
    140694,
    // Your Own Parabolan Base-Camp
    140715,
    // Visiting your Risen Brother
    140747,
    // Route: The Department of Menace Eradication
    140757,
    // Route: The Medusa's Head
    140758,
    // Discovered: the Temple Club
    140765,
    // Discovered: the Archaeological Dig
    140768,
    // Key Writing Desk Lodgings
    140784,
    // Route: The Blind Helmsman
    140789,
    // Dreaming in Viric
    140792,
    // Kataleptic Toxicology
    140826,
    // Visiting your Risen Daughter
    140827,
    // Visiting your Risen Spouse
    140828,
    // Monstrous Anatomy
    140830,
    // A Player of Chess
    140873,
    // Route: Doubt Street
    140875,
    // Glasswork
    140896,
    // Shapeling Arts
    140897,
    // Disgruntlement among the Students
    140903,
    // Light Fingers - Finding the Music-hall Singer
    140917,
    // Betrothed to a Masked Villain!
    140919,
    // Route: The Chessboard
    140940,
    // Ambition: A Marvellous Venue
    140942,
    // Ambition: A Marvellous Deck
    140943,
    // Halfway through the Mirror
    140948,
    // Dream Vessel
    140960,
    // Transported your Library
    140961,
    // Parabolan Tree Season
    140963,
    // Proofed Against Poison
    140966,
    // Artisan of the Red Science
    140969,
    // Mithridacy
    140998,
    // Thhhooosothorooooothhhhh
    141012,
    // Time to visit Clara
    141021,
    // The Hammers of Jasper and Frank
    141024,
    // The Strength of Hephaesta
    141025,
    // Haunted by Stairs
    141026,
    // Seeing in Apocyan
    141027,
    // Bragging Rights at the Medusa's Head
    141036,
    // A Convincing Corpse
    141048,
    // Found Employment for an Old Friend
    141108,
    // Fed a hybrid to the Hybrid
    141167,
    // Lost Wealth
    141175,
    // Your Opponent
    141210,
    // In Corporate Debt
    141228,
    // Knowledge of Thine Enemy
    141232,
    // The Fate of Poor Edward
    141238,
    // Laboratory Services from Hephaesta
    141251,
    // Brass-Buttoned Displeasure
    141256,
    // A Battalion of Obedient Dreams
    141259,
    // Topsy by Halves
    141260,
    // Paramount Presence of the Ancient Regime
    141287,
    // Laboratory Services from Cora Bagley
    141288,
    // Visiting Tristram Bagley
    141355,
    // Speculation about Whitsun
    141357,
    // Humouring a Buyer of Transports
    141381,
    // Jericho Locks: Darkness
    141395,
    // Magistracy of the Evenlode: Darkness
    141396,
    // Seeing Banditry in the Upper River
    141397,
    // Tracklayers' Displeasure
    141398,
    // Ealing Gardens: Darkness
    141474,
    // Steward of the Discordance
    141623,
    // Discovered: Irem
    141669,
    // Hint about Jenny
    141785,
    // Made Sentiment 1
    141793,
    // Made Sentiment 2
    141794,
    // Made Sentiment 3
    141795,
    // Made Sentiment 4
    141796,
    // Made Sentiment 5
    141797,
    // Made Sentiment 6
    141798,
    // On the Trail of the Clay Highwayman
    141870,
    // Acclimating to Pressure
    141872,
    // Chasing the Glow of Peligin
    141878,
    // Route: the Edict of Towers
    141888,
    // Disgruntlement among the Expedition
    141909,
    // Para-Archaeologist
    141945,
    // Altered, Somehow
    141968,
    // The Knight of Hallowmas
    142008,
    // Moulin: Darkness
    142009,
    // Growing...
    142015,
    // Balmoral: Darkness
    142035,
    // Station VIII: Darkness
    142036,
    // Burrow-Infra-Mump: Darkness
    142037,
    // Hurlers: Darkness
    142039,
    // Marigold: Darkness
    142040,
    // Deciphering...
    142070,
    // Corresponding...
    142216,
    // Furnace Ancona's Wounds
    142232,
    // A Marauder of the Clay Highwayman
    142245,
    // Shuttered your Lair in the Marshes
    142257,
    // Loaned Out your Rooftop Shack
    142262,
    // Loaned Out your Rooms Above a Bookshop
    142264,
    // Avoiding your Handsome Townhouse
    142266,
    // Avoiding a Smoky Flophouse Dormitory
    142268,
    // Let Out your Premises at the Bazaar
    142271,
    // Hurlyburly
    142273,
    // Zailing locally
    142300,
    // Charity Is Such A Filthy Word
    142371,
    // A Philosophical Courtship
    142389,
    // Stoking the Stove
    142392,
    // Steward's Trust
    142428,
    // Eastern Wind
    142517,
    // Having Recurring Dreams: Upon a Painted Sea
    142518,
    // Southern Wind
    142519,
    // Invited to Tea at Beatrice's
    142580,
    // No Longer Testing
    142616,
    // Northern Wind
    142639,
    // Having Recurring Dreams: I Shot the Albatross
    142642,
    // Having Recurring Dreams: Betwixt Us and the Sun
    142643,
    // Khaganian Front: Obfuscation
    142716,
    // Taimen's Attention
    142722,
    // In Pursuit of a Zee-Beast
    142893,
    // The City Waning
    142900,
    // Delving Beneath the Streets
    142962,
    // Fueling the Excavation
    142964,
    // Hinterland City - Refused
    142987,
    // Chirurgical Touch
    142993,
    // Volunteering in:
    143007,
    // Old Zalt
    143011,
    // Having Recurring Dreams: Nothing Beside Remains
    143036,
    // Supporting the Noughts
    143109,
    // Supporting the Crosses
    143110,
    // Theoretical Methods
    143133,
    // No Longer Fatigued
    143159,
    // A Victim of Frequent Betrayals
    143184,
    // Witnessed by the Silent Shame
    143214,
    // Advertising Profile: Campaign Duration
    143246,
    // Investigating Polythreme
    143250,
    // Perambulating...
    143274,
    // Awakening...
    143275,
    // COMMUNION
    143277,
    // IPSEITY
    143278,
    // Preparations for a Vast Revel
    143282,
    // COGNISANCE
    143364,
    // ALLURE
    143365,
    // Receptivity of the Lamp-Cats
    143575,
    // Miners' Preparations
    143576,
    // Iron & Misery Scintillack Extraction
    143578,
    // Feline Argentation
    143579,
    // Naturalist's Acceptance
    143597,
    // Naturalist's Malleability
    143598,
    // Naturalist's Cunning
    143599,
    // Revelling...
    143693,
    // Identifying...
    143743,
    // Surveying Progress
    143774,
    // Besieged by Wax
    143858,
    // Knowledge of the Crossroads
    143876,
    // Having Recurring Dreams: Rosy Colours Leaping on the Wall
    143977,
    // Tracking Down the Charwoman
    144019,
    // Chasing Down Your Bounty
    144023,
    // Respected by the Corsairs
    144064,
    // Poisoner's Progress
    144104,
    // Elusiveness of your Target
    144108,
    // Manacled
    144131,
    // Playing with Soul: Waiting for a Reprise
    144195,
    // Pedestrian Peregrinations
    144205,
    // Poison Tolerance of Your Target
    144226,
    // Unravelling
    144232,
    // Fivefold Devotion
    144233,
    // Growing a Prized Plant
    144339,
    // Fuel Depletion of your Airship
    144467,
    // The Admiration of Station IX
    144497,
    // Call to Arms: Hell (Quality)
    144518,
    // Call to Arms: Khanate
    144520,
    // Call to Arms: Polythreme (Quality)
    144522,
    // Call to Arms: Docks
    144524,
    // Call to Arms: Godfall (Quality)
    144526,
    // Call to Arms: Gaider's Mourn (Quality)
    144528,
    // The Machinations of the Masters (Quality)
    144580,
    // Habituated to the Hinterland
    144603,
    // The Mind's Ascent
    144604,
    // An Ace in Hand
    144611,
    // Developing...
    144681,
    // Hinterland City - Infrastructural Focus
    144682,
    // A Worker in the Common Cause
    144785,
    // A Panther's Progress
    144811,
    // Chthonosophy
    144818,
    // Hearts' Game: Counterplay
    144825,
    // Volatility of Your Cargo
    144907,
    // Progress Towards Admiralty Ordnance Depôt № 8
    144908,
    // The Fate of the Zubmariner:
    144929,
    // The Inconstant Friendship of a Retired Zubmariner
    144968,
    // Preparing for Ecdysis
    145003,
    // Noises in the Library
    145047,
    // The Leviathan's Call
    145196,
    // Unwound Thread
    145233,
    // Imagination: The Princess' Favour
    145325,
    // Having Recurring Dreams: the Forests of the Night
    145478,
    // Intellect: Lessons from the Boatman
    145542,
    // Detecting...
    145562,
    // Tending the Colossus
    145628,
    // Match Integrity Report
    145713,
    // Burning the Candle at Both Ends
    145746,
    // Key of Agents
    145773,
    // Notes on a Joyous Entry
    145787,
    // Fuel for Glory's Fire
    145788,
    // As Above Becomes Below
    145792,
    // Acclimating to Prolonged Inversion
    145796,
    // Tasting Ichor
    145797,
    // Awakening to Miracle
    145798,
    // Opening Another Eye
    145803,
    // Stone-Hearted
    145806,
    // Salt-Veined
    145807,
    // Things Fall Apart
    145853,
    // Anomalous Nonlinearities in Outcome Distribution
    145916,
    // Sneaking...
    145923,
    // One Half of a Calendar
    145937,
    // Exploration
    145944,
    // The Tyranny of the Last Duchess
    145987,
    // A Brief Stint as an Eel
    146034,
    // Martyrdom of Saint B
    146049,
    // The Kings' Song
    146074,
    // On the Trail of the Ducal Mint
    146145,
    // Void Ab Initio
    146151,
    // Capturing a Law
    146176,
    // Right, But Not Correct
    146287,
    // Wayward Widdershins
    146288,
    // A Complication in Delivery
    146600,
    // A Song in the Blood
    146606,
    // A Dance in the Bones
    146607,
    // A Seed in the Self
    146608,
    // A Light in the Heart
    146619,
    // An Ache in the Soul
    146621,
    // A Feather on the Wing
    146622,
    // Red Rapture
    146706,
    // Red Thirst
    146707,
    // Red Hunger
    146708,
    // The Inviting Shadows
    146712,
    // Getting to Know the Clay Courier
    146867,
    // February Voted
    146919,
    // August Voted
    146923,
    // October Voted
    146925,
    // A History Scarred and Ragged
    147071,
];

export {PYRAMIDAL_QUALITY_IDS};
