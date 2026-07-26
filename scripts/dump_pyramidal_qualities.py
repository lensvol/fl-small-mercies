import json
import sys
from collections import OrderedDict
import ssl
from urllib import parse, request

def make_wiki_call(query: str) -> dict:
    data = parse.urlencode(
        {
            "action": "ask",
            "format": "json",
            "query": query,
        }
    ).encode()

    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = request.Request("https://fallenlondon.wiki/w/api.php", data=data)
    with request.urlopen(req, context=ctx) as response:
        return json.loads(response.read())["query"]

def main():
    wiki_info = make_wiki_call("[[Increase Type::Pyramidal]]|?=Name|?ID|limit=9999")

    results = {}
    for name, record in wiki_info["results"].items():
        if len(record["printouts"]["ID"]) == 0:
            continue

        quality_id = record["printouts"]["ID"][0]
        results[quality_id] = name

    print("""
// This information was compiled using data submitted to the "Fallen London Wiki"
// (https://fallenlondon.wiki) by its contributors and is used here under
// CC-BY-SA 3.0 license (https://creativecommons.org/licenses/by-sa/3.0/)

""")
    print("const PYRAMIDAL_QUALITY_IDS: number[] = [")
    for quality_id, name in sorted(results.items(), key=lambda it: it[0]):
        print(f"    // {name}")
        print(f"    {quality_id},")
    print("];")
    print()
    print("export {PYRAMIDAL_QUALITY_IDS};")

if __name__ == "__main__":
    main()
