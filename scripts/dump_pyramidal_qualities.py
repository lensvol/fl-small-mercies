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

    output = []
    existing = []
    with open(sys.argv[1], "r") as fp:
        existing = fp.readlines()

    existing = map(str.rstrip, existing)

    in_header = True
    in_footer = False
    for line in existing:
        if in_header or in_footer:
            output.append(line)
        if "BEGIN: Pyramidal Qualities".lower() in line.lower():
            in_header = False

            output.append("const PYRAMIDAL_QUALITY_IDS: Set<number> = new Set([")
            for quality_id, name in sorted(results.items(), key=lambda it: it[0]):
                output.append(f"    {quality_id}, // {name}")
            output.append("]);")
            output.append("")
        elif "END: Pyramidal Qualities".lower() in line.lower():
            in_footer = True
            output.append(line)

    with open(sys.argv[1], "w") as fp:
        fp.write("\n".join(output))

    print(f"Pyramidal qualities processed: {len(results.items())}")


if __name__ == "__main__":
    main()
