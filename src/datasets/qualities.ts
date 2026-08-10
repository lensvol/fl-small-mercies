// This information was compiled using data submitted to the "Fallen London Wiki"
// (https://fallenlondon.wiki) by its contributors and is used here under
// CC-BY-SA 3.0 license (https://creativecommons.org/licenses/by-sa/3.0/)

/* BEGIN: Pyramidal Qualities */
const PYRAMIDAL_QUALITY_IDS: Set<number> = new Set([
    209, // Watchful
    210, // Shadowy
    211, // Dangerous
    212, // Persuasive
    213, // Knife-and-Candle Rank
    214, // Wounds
    215, // Scandal
    216, // Suspicion
    217, // Nightmares
    230, // Preparing for a Daring Escape
    231, // A Stranger
    233, // Homeless!
    234, // Having Recurring Dreams: Is Someone There?
    235, // Having Recurring Dreams: Death by Water
    236, // Having Recurring Dreams: What the Thunder Said
    237, // Having Recurring Dreams: The Burial of the Dead
    238, // Having Recurring Dreams: The Fire Sermon
    239, // Having Recurring Dreams: A Game of Chess
    240, // Menace Eradication Contract: Destroy Ferocious Rat
    245, // Commission: Praising Fungus in Verse
    246, // Commission: Immortalise Jack-of-Smiles in a Penny Dreadful!
    247, // Commission: Write about Prisoner's Honey
    249, // Seduction: Artist
    250, // Seduction: Artist's Model
    251, // Seduction: Honey-Sipping Jewel-Thief
    252, // Seduction: Honey-Sipping Heiress
    253, // Villainy: Area-Diving
    255, // Seeking...
    256, // Investigating...
    257, // Inspired...
    258, // Fascinating...
    259, // Running Battle...
    261, // Disappearing...
    262, // Casing...
    264, // Daring
    265, // Heartless
    266, // Magnanimous
    267, // Ruthless
    268, // Forceful
    269, // Subtle
    270, // Hedonist
    271, // Ambition: Heart's Desire!
    272, // Ambition: Bag a Legend!
    273, // Ambition: Light Fingers!
    274, // Ambition: Nemesis
    275, // Ambition: Enigma
    276, // Connected: Bohemian
    277, // Connected: The Great Game
    278, // Connected: Criminals
    279, // Connected: Urchins
    280, // Connected: The Church
    281, // Connected: Hell
    282, // Connected: The Docks
    283, // Connected: The Tomb-Colonies
    284, // Connected: The Widow
    285, // Connected: Revolutionaries
    286, // Connected: The Constables
    287, // Connected: Society
    288, // Connected: Rubbery Men
    289, // Vermin-free
    412, // From the Less Imaginary Suitcase
    427, // Route: The Shuttered Palace
    428, // Route: Wolfstack Docks
    429, // Route: The Forgotten Quarter
    430, // Route: The Flit
    439, // An Infernal Informant
    440, // A Constables' Pet
    444, // Ambition: Heart's Desire - The Bishop of St Fiacre's
    446, // Heart's Desire: Scrawled Notes on the Walls
    452, // An Annoyance to Jack-of-Smiles
    454, // Inconvenienced by Your Aunt
    456, // Marked by the Eater-of-Chains
    460, // Ambition: Nemesis - Forgotten Quarter
    472, // A Courier for the Dead
    475, // Acquaintance: the Sardonic Music-Hall Singer
    478, // Tragedy: Death of a Spouse
    479, // Tragedy: Death of a Lover
    480, // Tragedy: Death of a Brother
    481, // Tragedy: Death of a Daughter
    483, // Acquaintance: the Regretful Soldier
    487, // The Bazaar's Questions
    488, // Villainy: Stealing Paintings for the Topsy King
    489, // A Veteran of Mr Sacks' Visits
    490, // Connected: The Masters of the Bazaar
    494, // Commissioned to Enact Love's Revenge
    495, // Acquaintance: the Repentant Forger
    497, // Acquaintance: the Wry Functionary
    500, // Steadfast
    501, // Hearing Rumours of Virginia's Progress
    502, // Hearing Rumours of Orthos' Progress
    503, // Archaeologist
    504, // Connected: The Duchess
    505, // Engaged in a Rivalry of Antiquities
    508, // An Admirer of Art -
    509, // An Admirer of Beauty -
    510, // A Scholar of the Correspondence
    511, // Seduction: a Rising Artist
    512, // Seduction: a Rising Artist's Model
    519, // Ascending the Reliables List of Mr Pages
    521, // Melancholy
    522, // Hearing Things...or are you?
    526, // Plotting against the Masters
    528, // An Umpire of the Game of Knife-and-Candle
    532, // A Neddy Man
    533, // A Union Sympathiser
    535, // Master Thief
    545, // Making Waves
    547, // Duelling with the Black Ribbon
    548, // A Fearsome Duellist
    550, // Route: Mrs Plenty's Most Distracting Carnival
    551, // A Bringer of Death
    564, // Involved in the Soul Trade
    569, // Acquiring Exhibits for the Labyrinth of Tigers
    570, // A Procurer of Savage Beasts
    571, // The Hunt Is On!
    572, // Austere
    573, // Making Use of Cats
    574, // Making Use of Bats
    575, // Embroiled in the Wars of Illusion
    576, // Investigating the Rubbery Murders
    579, // A Nocturnal Visitor to the Palace Cellars
    580, // A Zailor in the Making
    581, // In Contact with a Long-Lost Daughter
    583, // Inciting a Simian Revenge?
    584, // Planning a Theft from the Museum of Mistakes
    586, // Ambition: Heart's Desire - the Topsy King
    591, // On the Trail of the Cheesemonger
    592, // An Agent of the Cheesemonger
    594, // The Great Game: A Fine Piece in the Game -
    596, // An Intimate of Devils
    598, // Connected: Benthic
    599, // Connected: Summerset
    600, // Featuring in the Tales of the University
    602, // Term Passing...
    604, // Route: The University
    605, // The Protégé of a Mysterious Benefactor
    611, // One Who Has Indulged in Unknown Pleasures
    612, // Ambition: Nemesis - Shuttered Palace
    614, // Seen with an Acclaimed Beauty
    615, // Seen with a Barbed Wit
    621, // Uncovering the Secrets of the Face-Tailor
    622, // In the Labyrinth of Tigers, Navigating Coil
    623, // Making Progress in the Labyrinth of Tigers
    624, // Time Passing in the Labyrinth
    625, // Route: The Labyrinth of Tigers
    626, // Carving out a Reputation at Court
    636, // Banished from the Court -
    638, // In the Lead
    646, // Assisting a Keen-Eyed Lapidary
    647, // In Search of a Stiff Drink
    648, // Investigating a threat to your Rat Companions...
    649, // Unwelcome at the University -
    651, // A Veteran of All Hallows' Eve
    654, // Sympathetic about Ratly Concerns
    662, // Caught Up in a Soldier's Heartbreaking Tale
    663, // The Boatman's Opponent
    664, // Uncovering Secrets Framed in Gold
    667, // Solving Cases around London
    670, // Having Rodentine Minions Investigate...
    671, // Serenity of the Plaster Face
    672, // Seeking the Meaning of the Plaster Face
    682, // Connected: Glass
    683, // Connected: Shroud
    684, // Day of the Week
    685, // Tales of Mahogany Hall
    686, // Plagued by a Popular Song
    687, // Playing with Broken Toys
    695, // Intimate with a Revolutionary Firebrand
    696, // Route: Mahogany Hall
    698, // Looking for your Soul
    699, // Attending to the Needs of a Singular Plant
    731, // Raking the Muck of the Neath
    733, // Pygmalion
    766, // Visiting Flute Street
    771, // An Explorer of the Unterzee -
    772, // Entangled with the Legal Profession
    774, // Stormy-Eyed
    778, // Shaping Clay
    780, // Having Transportation Difficulties
    783, // Making Friends among the Young Stags
    785, // Sniffing Around The Parthenaeum
    787, // Pursuing a Case of Books
    789, // Facing the Rat Army
    791, // Making Friends among God's Editors
    795, // Gaining a Criminal Reputation
    798, // Committed:
    799, // Courting the Celebrated Artist's Model
    800, // Courting the Master Jewel Thief
    803, // Route: Bazaar Side-Streets
    804, // In Possession of a Peculiar Personal Enhancement -
    806, // Indulging a Less than Laudable Laudanum Habit
    807, // Approaching Journey's End
    808, // Troubled Waters
    819, // Time Passing in the Southern Archipelago
    820, // Dramatic Tension
    826, // Acquainted with Miriam Plenty's Past
    839, // An Experienced Zailor:
    840, // Learning from a Silk-Clad Expert
    846, // Taming the Beast
    847, // Thwarting Beastly Devils
    850, // In the Company of Monsters
    854, // Exploring the Orphanage
    855, // Attracting Attention in the Orphanage
    856, // Sign of the Chiropteromantic Zodiac:
    859, // Route: Wilmot's End
    860, // Doing Business in Wilmot's End
    861, // Walking the Paths of Wilmot's End
    864, // Searching out a Missing Woman
    865, // Looking in High Places and Low
    866, // Talk of the Town
    867, // Fighting a War of Assassins
    869, // Enjoying Lethal Prominence -
    870, // On the Velocipede Squad
    871, // Riding the Savage Cobbles
    873, // Working toward a Foreign Posting
    879, // Bound in Diocesan Intrigue
    880, // Hellfarer
    881, // Fist of the Bazaar
    882, // Empire's Kingmaker
    883, // Why You Fight -
    885, // A Brazen Fate -
    886, // The Spinning of the Wheels
    888, // Mysteries of the Foreign Office
    894, // Orthos is Coming!
    895, // Embarking on a Voyage of Scientific Discovery
    914, // Defender of Truth -
    916, // Prophet of the Gutter -
    917, // Cardinal of Conspiracy -
    937, // Seeking a Better Class of Violence
    938, // Enjoying the bohemian atmosphere of Veilgarden
    939, // Unravelling a Coded Message
    940, // Collecting Clues for the Clay Coalman
    942, // Befriending a Rooftop Urchin
    950, // Respectable
    957, // Dreaded
    958, // Bizarre
    960, // Seeing through the Eyes of Icarus
    961, // Touched by Fingerwork
    962, // Walking the Falling Cities
    963, // Approaching the Gates of the Garden
    977, // Polythreme Ho!
    978, // Screaming Map: A Visitor!
    979, // Looking for the Exceptional Rose
    988, // Free of the Name
    990, // Recalling a Dream of Other Places
    992, // The Dilmun Club: Loyalties
    994, // The Subject of Admiring Attention
    995, // Impossible!
    996, // Mired in Clay
    998, // Caught in the Gear's Teeth
    999, // Writing of your Polythreme Travels
    1000, // Spying on Polythreme
    1019, // Causing the wrong sort of interest
    1021, // Getting to Know Cobblestone Rogues and Back-Alley Saints
    1022, // Family and Law
    1025, // Playing with Soul
    1026, // The Blind Pianist and the Sallow Spirifer
    1028, // Someone Is Coming
    1029, // Spending Secrets
    1031, // Counting the Days
    1034, // An Unfinished Story
    1037, // A Pocketful of Loose Change
    1042, // The Photographer and the Contrarian
    1061, // Iron Republic Days
    1071, // Remembering the Orphanage
    1074, // The Jack-of-Smiles Case
    1076, // Seeking the Next Breakthrough on the Jack Case
    1077, // Changed by the Iron Republic
    1080, // Jack's Gone -
    1096, // Are they talking about you?
    10065, // Planning a Heist:
    10164, // Target Security:
    10279, // Putting the Pieces Together: the Drownies
    12293, // A Clear Path
    12620, // A Connoisseur of Neathy Delights
    12679, // Investigating the Twelve Days of Mr Sacks with:
    13615, // Profession:
    13837, // A Particular Day in the Neath
    16272, // Acquaintance: the Captivating Princess
    17766, // A Participant in the Underground Leagues of Knife-and-Candle
    20418, // You have a Knife-and-Candle Pact with...
    20920, // Sponsored in the Game of Knife-and-Candle
    22333, // Your Quarry:
    101598, // Engaged in a Scheme: an Orphanage
    101830, // Engaged in a Scheme: a Salon
    102154, // Quarry's Greed
    102574, // The Smuggler's Lamp
    105134, // A Possible Future:
    105135, // The Mark of Destiny
    106226, // Advancing the Liberation of Night:
    106757, // Noman Knows
    106759, // A Criminal Record:
    107481, // Seen with
    107482, // Engaged to
    107483, // Betrayed by
    107562, // Fleeting Recollections
    109222, // The Great Game - Opening Moves
    109921, // Sunless Sea: Advice for the Navigator
    110559, // Parabolan Places:
    111901, // Picking Through the Wreckers' Cove
    113277, // The Date -
    113767, // Exposed by
    116075, // Sunless Sea: A Soothe & Cooper Long-Box
    116136, // You Disposed of a Whisper-Locked Sea-Chest
    117090, // Empty Skin
    117894, // An Episode for Exceptional Friends
    118811, // Time Passing in Office
    119722, // Business at the Dish & Spoon:
    121992, // Renown: Criminals
    122871, // Investigating the Silken Chapel
    122882, // A Confession of Whimsy from the Bishop of Southwark
    122883, // A Confession of Pride from the Bandaged Poissonnier
    122884, // A Confession of Violence from the Presbyterate Adventuress
    122885, // A Confession of Curiosity from the Genial Magician
    122886, // A Confession of Guile from the Haunted Doctor
    122887, // A Confession of Impropriety from the Nacreous Outcast
    123145, // Drawing from a Pilfered Sack
    123289, // Recognised by the Order Vespertine
    124661, // Recently divorced
    125528, // Renown: The Docks
    125787, // Renown: Tomb-Colonies
    126001, // Renown: Rubbery Men
    126280, // Asked to an Austere Date
    126367, // Offering to Aid a Wounded Friend
    126588, // Offering a Masterclass
    126820, // Significant
    126989, // Offered a Tiny Sip of Hesperidean Cider
    127011, // Scatheless
    127150, // Learning about the Election
    127187, // A Free Gift
    127409, // Changing Candidate
    127558, // A Participant in the 1894 Election
    127585, // Hoping for Help With a Scandal
    127603, // Tending a Friend with Nightmares
    127659, // Invited to Coffee at Caligula's
    127664, // Zailing Difficulty
    127768, // An Encounter with Jenny
    128222, // Access to Breakwater House
    128248, // Invited to Dinner at Dante's Grill
    129057, // Opening a Confession
    129106, // Hallowmas: The Aftermath of An Explosion of Revelations
    129666, // Renown: Urchins
    129690, // Considering Criminal Conundrums
    129935, // Sinning Jenny's Finishing School
    130201, // Humbly Proposing
    130202, // Requesting a Friend's Testimony
    130280, // Extravagantly Proposing
    130302, // Throwing a Humble Wedding
    130303, // Throwing an Extravagant Wedding
    130575, // Summoned to Testify at a Friend's Divorce
    130578, // Your Spouse's Requests for a Peaceful Testimony
    130579, // Requesting your Spouse's Cooperation in Court
    130580, // Divorce Papers
    130581, // Beginning Divorce Proceedings
    130728, // Asking your Spouse to an Indulgent Evening Out
    130730, // Asking your Spouse to a Decorous Evening Out
    130732, // Asking your Spouse to a Honey-Fuelled Evening
    131572, // Visions of the Blue Kingdom
    131592, // Suspected by the Constables
    131732, // Tremors in the Cobbles
    132349, // Responding to a Calling Card
    132371, // The Avoidance of Sleep
    132801, // Renown: Hell
    132802, // Renown: Constables
    132902, // An Admission of Affection
    132947, // Asked to an Indulgent Date
    132948, // Invited to a Chaperoned Date
    132978, // Approached to be a Patron
    132982, // Offered a Dangerous Masterclass
    132983, // Offered a Persuasive Masterclass
    132984, // Offered a Shadowy Masterclass
    132985, // Offered a Watchful Masterclass
    133045, // Renown: The Great Game
    133115, // Attending a Mayoral Ball
    133232, // Not Supporting Feducci
    133234, // Not Supporting the Implacable Detective
    133411, // Invited to join a Patron's Patron
    133465, // A Hallowmas Reveller of Old
    133560, // Invited to Loiter
    133561, // Loitering
    133828, // Renown: The Church
    133830, // Renown: Bohemians
    133832, // Renown: Revolutionaries
    133834, // Renown: Society
    133917, // Knowledge of the Arts
    133970, // The Revolution's Store
    134135, // A Mirror for Princes
    134913, // Procuring Cantigaster Venom
    134914, // Securing the Medusa
    134916, // A Devilment with the Tankards
    134917, // Summoning the Opponent
    134918, // Double or Nothing
    134968, // A Certificate indicating Feducci's Acknowledgement
    135009, // The Cheery Man's Fate
    135010, // The Last Constable's Fate
    135079, // Resetting the Last Constable and Cheery Man
    135135, // Casus Belli
    135136, // The Fall of Vesture
    135137, // The Regency's End
    135262, // A Turn in the Game
    136357, // Looking for Love
    138860, // In Arbor I Walked With
    138861, // An Ambassador
    139734, // Dawnburnt
    140081, // Stars Under Skin
    140293, // Away with your diary
    140359, // The Innocuous Comb
    140491, // Key of Bugs
    140643, // Noticed by the Merry Captain
    140644, // Noticed by the Saturnine Duke
    140645, // Noticed by the Queen of Air and Darkness
    140694, // Route: Moloch Street
    140715, // Your Own Parabolan Base-Camp
    140747, // Visiting your Risen Brother
    140757, // Route: The Department of Menace Eradication
    140758, // Route: The Medusa's Head
    140765, // Discovered: the Temple Club
    140768, // Discovered: the Archaeological Dig
    140784, // Key Writing Desk Lodgings
    140789, // Route: The Blind Helmsman
    140792, // Dreaming in Viric
    140826, // Kataleptic Toxicology
    140827, // Visiting your Risen Daughter
    140828, // Visiting your Risen Spouse
    140830, // Monstrous Anatomy
    140873, // A Player of Chess
    140875, // Route: Doubt Street
    140896, // Glasswork
    140897, // Shapeling Arts
    140903, // Disgruntlement among the Students
    140917, // Light Fingers - Finding the Music-hall Singer
    140919, // Betrothed to a Masked Villain!
    140940, // Route: The Chessboard
    140942, // Ambition: A Marvellous Venue
    140943, // Ambition: A Marvellous Deck
    140948, // Halfway through the Mirror
    140960, // Dream Vessel
    140961, // Transported your Library
    140963, // Parabolan Tree Season
    140966, // Proofed Against Poison
    140969, // Artisan of the Red Science
    140998, // Mithridacy
    141012, // Thhhooosothorooooothhhhh
    141021, // Time to visit Clara
    141024, // The Hammers of Jasper and Frank
    141025, // The Strength of Hephaesta
    141026, // Haunted by Stairs
    141027, // Seeing in Apocyan
    141036, // Bragging Rights at the Medusa's Head
    141048, // A Convincing Corpse
    141108, // Found Employment for an Old Friend
    141167, // Fed a hybrid to the Hybrid
    141175, // Lost Wealth
    141210, // Your Opponent
    141228, // In Corporate Debt
    141232, // Knowledge of Thine Enemy
    141238, // The Fate of Poor Edward
    141251, // Laboratory Services from Hephaesta
    141256, // Brass-Buttoned Displeasure
    141259, // A Battalion of Obedient Dreams
    141260, // Topsy by Halves
    141287, // Paramount Presence of the Ancient Regime
    141288, // Laboratory Services from Cora Bagley
    141355, // Visiting Tristram Bagley
    141357, // Speculation about Whitsun
    141381, // Humouring a Buyer of Transports
    141395, // Jericho Locks: Darkness
    141396, // Magistracy of the Evenlode: Darkness
    141397, // Seeing Banditry in the Upper River
    141398, // Tracklayers' Displeasure
    141474, // Ealing Gardens: Darkness
    141623, // Steward of the Discordance
    141669, // Discovered: Irem
    141785, // Hint about Jenny
    141793, // Made Sentiment 1
    141794, // Made Sentiment 2
    141795, // Made Sentiment 3
    141796, // Made Sentiment 4
    141797, // Made Sentiment 5
    141798, // Made Sentiment 6
    141870, // On the Trail of the Clay Highwayman
    141872, // Acclimating to Pressure
    141878, // Chasing the Glow of Peligin
    141888, // Route: the Edict of Towers
    141909, // Disgruntlement among the Expedition
    141945, // Para-Archaeologist
    141968, // Altered, Somehow
    142008, // The Knight of Hallowmas
    142009, // Moulin: Darkness
    142015, // Growing...
    142035, // Balmoral: Darkness
    142036, // Station VIII: Darkness
    142037, // Burrow-Infra-Mump: Darkness
    142039, // Hurlers: Darkness
    142040, // Marigold: Darkness
    142070, // Deciphering...
    142216, // Corresponding...
    142232, // Furnace Ancona's Wounds
    142245, // A Marauder of the Clay Highwayman
    142257, // Shuttered your Lair in the Marshes
    142262, // Loaned Out your Rooftop Shack
    142264, // Loaned Out your Rooms Above a Bookshop
    142266, // Avoiding your Handsome Townhouse
    142268, // Avoiding a Smoky Flophouse Dormitory
    142271, // Let Out your Premises at the Bazaar
    142273, // Hurlyburly
    142300, // Zailing locally
    142371, // Charity Is Such A Filthy Word
    142389, // A Philosophical Courtship
    142392, // Stoking the Stove
    142428, // Steward's Trust
    142517, // Eastern Wind
    142518, // Having Recurring Dreams: Upon a Painted Sea
    142519, // Southern Wind
    142580, // Invited to Tea at Beatrice's
    142616, // No Longer Testing
    142639, // Northern Wind
    142642, // Having Recurring Dreams: I Shot the Albatross
    142643, // Having Recurring Dreams: Betwixt Us and the Sun
    142716, // Khaganian Front: Obfuscation
    142722, // Taimen's Attention
    142893, // In Pursuit of a Zee-Beast
    142900, // The City Waning
    142962, // Delving Beneath the Streets
    142964, // Fueling the Excavation
    142987, // Hinterland City - Refused
    142993, // Chirurgical Touch
    143007, // Volunteering in:
    143011, // Old Zalt
    143036, // Having Recurring Dreams: Nothing Beside Remains
    143109, // Supporting the Noughts
    143110, // Supporting the Crosses
    143133, // Theoretical Methods
    143159, // No Longer Fatigued
    143184, // A Victim of Frequent Betrayals
    143214, // Witnessed by the Silent Shame
    143246, // Advertising Profile: Campaign Duration
    143250, // Investigating Polythreme
    143274, // Perambulating...
    143275, // Awakening...
    143277, // COMMUNION
    143278, // IPSEITY
    143282, // Preparations for a Vast Revel
    143364, // COGNISANCE
    143365, // ALLURE
    143575, // Receptivity of the Lamp-Cats
    143576, // Miners' Preparations
    143578, // Iron & Misery Scintillack Extraction
    143579, // Feline Argentation
    143597, // Naturalist's Acceptance
    143598, // Naturalist's Malleability
    143599, // Naturalist's Cunning
    143693, // Revelling...
    143743, // Identifying...
    143774, // Surveying Progress
    143858, // Besieged by Wax
    143876, // Knowledge of the Crossroads
    143977, // Having Recurring Dreams: Rosy Colours Leaping on the Wall
    144019, // Tracking Down the Charwoman
    144023, // Chasing Down Your Bounty
    144064, // Respected by the Corsairs
    144104, // Poisoner's Progress
    144108, // Elusiveness of your Target
    144131, // Manacled
    144195, // Playing with Soul: Waiting for a Reprise
    144205, // Pedestrian Peregrinations
    144226, // Poison Tolerance of Your Target
    144232, // Unravelling
    144233, // Fivefold Devotion
    144339, // Growing a Prized Plant
    144467, // Fuel Depletion of your Airship
    144497, // The Admiration of Station IX
    144518, // Call to Arms: Hell (Quality)
    144520, // Call to Arms: Khanate
    144522, // Call to Arms: Polythreme (Quality)
    144524, // Call to Arms: Docks
    144526, // Call to Arms: Godfall (Quality)
    144528, // Call to Arms: Gaider's Mourn (Quality)
    144580, // The Machinations of the Masters (Quality)
    144603, // Habituated to the Hinterland
    144604, // The Mind's Ascent
    144611, // An Ace in Hand
    144681, // Developing...
    144682, // Hinterland City - Infrastructural Focus
    144785, // A Worker in the Common Cause
    144811, // A Panther's Progress
    144818, // Chthonosophy
    144825, // Hearts' Game: Counterplay
    144907, // Volatility of Your Cargo
    144908, // Progress Towards Admiralty Ordnance Depôt № 8
    144929, // The Fate of the Zubmariner:
    144968, // The Inconstant Friendship of a Retired Zubmariner
    145003, // Preparing for Ecdysis
    145047, // Noises in the Library
    145196, // The Leviathan's Call
    145233, // Unwound Thread
    145325, // Imagination: The Princess' Favour
    145478, // Having Recurring Dreams: the Forests of the Night
    145542, // Intellect: Lessons from the Boatman
    145562, // Detecting...
    145628, // Tending the Colossus
    145713, // Match Integrity Report
    145746, // Burning the Candle at Both Ends
    145773, // Key of Agents
    145787, // Notes on a Joyous Entry
    145788, // Fuel for Glory's Fire
    145792, // As Above Becomes Below
    145796, // Acclimating to Prolonged Inversion
    145797, // Tasting Ichor
    145798, // Awakening to Miracle
    145803, // Opening Another Eye
    145806, // Stone-Hearted
    145807, // Salt-Veined
    145853, // Things Fall Apart
    145916, // Anomalous Nonlinearities in Outcome Distribution
    145923, // Sneaking...
    145937, // One Half of a Calendar
    145944, // Exploration
    145987, // The Tyranny of the Last Duchess
    146034, // A Brief Stint as an Eel
    146049, // Martyrdom of Saint B
    146074, // The Kings' Song
    146145, // On the Trail of the Ducal Mint
    146151, // Void Ab Initio
    146176, // Capturing a Law
    146287, // Right, But Not Correct
    146288, // Wayward Widdershins
    146600, // A Complication in Delivery
    146606, // A Song in the Blood
    146607, // A Dance in the Bones
    146608, // A Seed in the Self
    146619, // A Light in the Heart
    146621, // An Ache in the Soul
    146622, // A Feather on the Wing
    146706, // Red Rapture
    146707, // Red Thirst
    146708, // Red Hunger
    146712, // The Inviting Shadows
    146867, // Getting to Know the Clay Courier
    146919, // February Voted
    146923, // August Voted
    146925, // October Voted
    147071, // A History Scarred and Ragged
]);

/* END: Pyramidal Qualities */

export {PYRAMIDAL_QUALITY_IDS};