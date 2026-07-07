import json
import sys

def main():
    with open(sys.argv[1], "r") as fp:
        wiki_info = json.load(fp)

    print("const ITEM_PRICES_BY_ID: Map<number, number> = new Map([")

    conversion_rates = {
        "Certifiable Scrap": 0.4875,
        "Hinterland Scrip": 0.5,
        "Stuiver": 0.05,
        # TODO: Technically everything below is also an item and we should
        # look their price up... but I am lazy.
        "Assortment of Khaganian Coinage": 0.5,
        "Correspondence Plaque": 0.5,
        # The prices is actually a skeleton part, so here we give an estimate
        # what it would bring you as a part of the skeleton
        "Aeolian Scream": 2.50,
        "Knotted Humerus": 3.00,
        "Piece of Rostygold": 0.01,
        "An Identity Uncovered!": 2.50,
        "Primordial Shriek": 2.50,
        "Silk Scrap": 0.01,
        "Bone Fragments": 0.01,
        "Shard of Glim": 0.01,
        "Cryptic Clue": 0.02,
        "Legal Document": 12.50,
        "Mourning Candle": 2.5,
        "Jasmine Leaves": 0.1,
        "Brilliant Soul": 0.5,
        "Searing Enigma": 62.50,
        "Venom-Ruby": 0.10,
        "Knob of Scintillack": 2.50,
        "Rat-Shilling": 0.10,
        # 10 Stuivers for a Tempestous Tale
        "Tempestuous Tale": 10 * 0.05,
        "Touching Love Story": 2.5,
        "Whispered Hint": 0.01,
    }

    # Pennies should be convertable to themselves
    print(f"    // Pennies")
    print(f"    [22390, 0.01],")

    # For some reason nautical items are not listed by our query to Wiki ¯\_(ツ)_/¯
    print(f"    // Stashed Treasure")
    print(f"    [144025, 0.01],")
    print(f"    // Editing Pieces of Plunder Weighing Down Your Hold")
    print(f"    [144024, 0.01],")

    for name, item in sorted(wiki_info["results"].items(), key=lambda k: k[0]):
        if not item["printouts"]["ID"]:
            continue

        echo_price = None
        item_prices = {}
        for sell_info in item["printouts"]["Sells for"]:
            currency = sell_info["Currency"]["item"][0]["fulltext"]
            price = sell_info["Price"]["item"][0]
            item_prices[currency] = price

        other_currency = None
        if "Echo" not in item_prices:
            # Convert other currencies into Echoes
            for other_currency, value in item_prices.items():
                if other_currency in conversion_rates:
                    echo_price = f"{value} * {conversion_rates[other_currency]}"
                    break
        else:
            echo_price = str(item_prices["Echo"])

        if not echo_price:
            print(f"Item '{name}' has no price in Echoes: {item_prices}")
            continue

        print(f"    // {name}" + (f" (via {other_currency})" if other_currency else ""))
        print(f"    [{item['printouts']['ID'][0]}, {echo_price}],")
    print("]);")
    print();
    print("export {ITEM_PRICES_BY_ID};")
    print()

if __name__ == "__main__":
    main()