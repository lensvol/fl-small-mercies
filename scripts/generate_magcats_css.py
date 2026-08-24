#!/usr/bin/env python3
import sys


OLD_MAGCATS_ART = dict([
    ["kataleptictoxicology_sidebar", "honeyjar"],
    ["monstrousanatomy_sidebar", "tentacle"],
    ["playerofchess_sidebar", "chesspiece"],
    ["glasswork_sidebar", "mirror"],
    ["shapelingarts_sidebar", "amber2"],
    ["artisanredscience_sidebar", "dawnmachine"],
    ["mithridacy_sidebar", "snakehead2"],
    ["stewardofdiscordance_sidebar", "black"],
    ["zeefaring_sidebar", "captainhat"],
    ["chthonosophy_sidebar", "stalagmite"],
])

RED_MAGCATS_ART = dict([
    ["kataleptictoxicology_sidebar", "kataleptictoxicology"],
    ["monstrousanatomy_sidebar", "monstrousanatomy"],
    ["playerofchess_sidebar", "playerofchess"],
    ["glasswork_sidebar", "glasswork"],
    ["shapelingarts_sidebar", "shapelingarts"],
    ["artisanredscience_sidebar", "artisanredscience"],
    ["mithridacy_sidebar", "mithridacy"],
    ["stewardofdiscordance_sidebar", "stewardofdiscordance"],
    ["zeefaring_sidebar", "zeefaring"],
    ["chthonosophy_sidebar", "chthonosophy"],
])


if __name__ == "__main__":
    icon_sets = {
        "classic": OLD_MAGCATS_ART,
        "red": RED_MAGCATS_ART,
    }

    currentSet = icon_sets[sys.argv[1]]

    for original, replacement in currentSet.items():
        print(f'''
img[src="//images.fallenlondon.com/icons/{original}.png"]{{
    content: url("//images.fallenlondon.com/icons/{replacement}.png")
}}''')
