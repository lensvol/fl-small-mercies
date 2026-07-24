import json
import sys
from collections import OrderedDict

def main():
    with open(sys.argv[1], "r") as fp:
        wiki_info = json.load(fp)

    # Some items have monetary value, but are traded in _storylets_ and not in Bazaar,
    # so our current dump query will not be able to extract them (╯°□°)╯︵ ┻━┻
    hardcoded_items = OrderedDict({
        # Pennies should be convertable to themselves
        "Pennies": [22390, 0.01],
        # Some items have monetary value, but are traded in _storylets_ and not in Bazaar,
        # so our current dump query will not be able to extract them (╯°□°)╯︵ ┻━┻
        "Attar": [139723, 4.1667],
        "Moon-Pearl": [379, 0.01],
        "Silk Scrap": [381, 0.01],
        "Traces of the Tabernacle": [146438, 0.01],
        "Stashed Treasure": [144025, 0.01],
        "Pieces of Plunder Weighing Down Your Hold": [144024, 0.01],
        "Bone Fragments": [140889, 0.01],
        "Shard of Glim": [378, 0.01],
        "Piece of Rostygold": [375, 0.01],
        "Whispered Hint": [380, 0.01],
        "Cryptic Clue": [389, 0.02],
        "Stuiver": [144995, 0.05],
        "Venom-Ruby": [642, 0.10],
        "Rat-Shilling": [143057, 0.10],
        "Jasmine Leaves": [141374, 0.10],
        "Certifiable Scrap": [918, 0.4875],
        "Correspondence Plaque": [932, 0.50],
        "Hinterland Scrip": [125025, 0.50],
        "Brilliant Soul": [668, 0.50],
        "Assortment of Khaganian Coinage": [142708, 0.5],
        # 10 Stuivers for a Tempestous Tale
        "Tempestuous Tale": [144955, 10 * 0.05],
        "Aeolian Scream": [773, 2.50],
        "Crystallised Curio": [142359, 2.50],
        "An Identity Uncovered!": [657, 2.50],
        "Knob of Scintillack": [122495, 2.50],
        "Touching Love Story": [945, 2.50],
        "Primordial Shriek": [388, 2.50],
        "Mourning Candle": [951, 2.50],
        "Knotted Humerus": [140772, 3.00],
        "Legal Document": [739, 12.50],
        "Hillmover": [140900, 12.50],
        "Shard of Glim the Size of a Small Child": [142094, 16.50],
        "Searing Enigma": [821, 62.50],
        "Unassuming Crate": [142710, 20.00],
        "Hiding Place of a Peculiar Item": [142447, 102.50],
    })

    calculated_prices: dict[int, Tuple[str, int, str]] = {
        qualityId: (name, f"{echo_price:.2f}", "")
        for name, (qualityId, echo_price) in sorted(hardcoded_items.items())
    }
    item_name_to_id = {
        name: qualityId for qualityId, (name, echo_price, comment) in calculated_prices.items()
    }

    for name, item in sorted(wiki_info["results"].items(), key=lambda k: k[0]):
        if not item["printouts"]["ID"]:
            continue

        item_id = int(item['printouts']['ID'][0])
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
                currency_id = item_name_to_id[other_currency]
                if currency_id in calculated_prices:
                    multiplier = f"{value} * " if value > 1 else ""
                    echo_price = f"{multiplier}{calculated_prices[currency_id][1]}"
                    break
        else:
            echo_price = f"{item_prices['Echo']:.2f}"

        if not echo_price:
            print(f"Item '{name}' has no price in Echoes: {item_prices}", file=sys.stderr)
            continue

        comment = f"via {other_currency}" if other_currency else ""
        calculated_prices[item_id] = (name, echo_price, comment)
        item_name_to_id[name] = item_id

    # Output first mapping for general purpose calculations
    print("const ITEM_PRICES_BY_ID: Map<number, number> = new Map([")
    for item_id, (name, echo_price, comment) in calculated_prices.items():
        print(f"    // {name}" + (f" ({comment})" if comment else ""))
        print(f"    [{item_id}, {echo_price}],")
    print("]);")
    print()

    # Output second mapping for reverse search of item price by its name (e.g. for tooltips)
    print("const ITEM_PRICES_BY_NAME: Map<string, number> = new Map([")
    for item_id, (name, echo_price, comment) in sorted(calculated_prices.items(), key=lambda it: it[1][0]):
        print(f'    ["{name}", {echo_price}],' + (f'  // {comment}' if comment else ""))
    print("]);")
    print()

    print("const ITEM_ID_BY_NAME: Map<string, number> = new Map([")
    for name, item_id in sorted(item_name_to_id.items(), key=lambda it: it[0]):
        print(f'    ["{name}", {item_id}],')
    print("]);")
    print()

    print("export {ITEM_PRICES_BY_ID, ITEM_PRICES_BY_NAME, ITEM_ID_BY_NAME};")
    print()

if __name__ == "__main__":
    main()