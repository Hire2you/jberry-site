"""Parse the 10 blog docs and convert unique project photos to webp."""
from __future__ import annotations

import json
import re
from pathlib import Path

from PIL import Image

ROOT = Path(r"C:\Users\Dave\jberry-site")
BLOG_TXT = ROOT / ".tmp-blogs"
TMP = ROOT / ".tmp-projects"
OUT_IMG = ROOT / "public" / "images" / "blog"
OUT_JSON = ROOT / "data" / "blog"
PHONE_OLD = "07734 683686"
PHONE_NEW = "07920 731533"

OUT_IMG.mkdir(parents=True, exist_ok=True)
OUT_JSON.mkdir(parents=True, exist_ok=True)


def convert(src: Path, dest: Path, max_w: int = 1800) -> None:
    im = Image.open(src)
    im = im.convert("RGB")
    if im.width > max_w:
        h = int(im.height * (max_w / im.width))
        im = im.resize((max_w, h), Image.Resampling.LANCZOS)
    im.save(dest, "WEBP", quality=82, method=6)
    print(f"  {dest.name} {dest.stat().st_size // 1024}kb from {src.name[:60]}")


PHOTO = {
    "green-belt": TMP / "Project1/Project1/WhatsApp Image 2026-07-06 at 15.45.24 (6).jpeg",
    "conservation": TMP / "Extensions/Extensions/ext-03.jpg",
    "article-4": TMP / "Extensions/Extensions/ext-02-uai-720x484.jpg",
    "open-plan": TMP / "hertford-heath/Hertford Heath/Hertford Heath.jpeg",
    "open-plan-kitchen": TMP / "Extensions/Extensions/service-bespoke-kitchen-1.jpg",
    "open-plan-steel": TMP / "red-building/Red Building Project/WhatsApp Image 2026-07-13 at 16.01.45 (1).jpeg",
    "mistakes": TMP / "Extensions/Extensions/ext-01-uai-720x484.jpg",
    "planning": TMP / "Extensions/Extensions/IMG_0222-uai-1032x774.jpg",
    "flood": TMP / "red-building/Red Building Project/WhatsApp Image 2026-07-09 at 08.00.11.jpeg",
    "ldc": TMP / "Extensions/Extensions/ext-04.jpg",
    "regs": TMP / "hertford/Project Heartford/WhatsApp Image 2026-07-09 at 07.46.07 (1).jpeg",
    "party-wall": TMP / "Project1/Project1/WhatsApp Image 2026-07-06 at 15.45.26.jpeg",
    "foundations": TMP / "hertford/Project Heartford/WhatsApp Image 2026-07-09 at 07.46.07.jpeg",
    "orangery": TMP / "Project1/Project1/WhatsApp Image 2026-07-06 at 15.45.26.jpeg",
}

POSTS = [
    {
        "txt": "can-you-extend-in-the-green-belt.txt",
        "slug": "can-you-extend-in-the-green-belt",
        "category": "Planning",
        "cover": "green-belt",
        "cover_alt": "Timber-clad countryside extension with a slate roof, typical of a proportionate Green Belt addition",
        "cover_caption": "In the Green Belt, a proportionate extension that does not dwarf the original house is an explicit exception to the restrictions, not a ban.",
        "inline": [
            {
                "after_h2": "Designing a Green Belt extension that gets approved",
                "key": "orangery",
                "alt": "Finished rear orangery-style extension opening onto a stone patio",
                "caption": "A well-designed extension sits under the original house rather than competing with it.",
            }
        ],
    },
    {
        "txt": "extending-in-a-conservation-area-what-you-can-and-cannot-do.txt",
        "slug": "extending-in-a-conservation-area",
        "category": "Planning",
        "cover": "conservation",
        "cover_alt": "Glass garden room extension on a flint and stone period house, designed to sit quietly against the original building",
        "cover_caption": "In a conservation area the test is whether the extension preserves or enhances the character of the place, not whether you are banned from building.",
        "inline": [
            {
                "after_h2": "Designing an extension that gets approved",
                "key": "planning",
                "alt": "Brick rear extension with matching masonry and a run of bifold doors",
                "caption": "Matching brick, roof and detailing to the original house is usually what conservation officers want to see.",
            }
        ],
    },
    {
        "txt": "article-4-directions-explained-what-they-mean-for-your-home.txt",
        "slug": "article-4-directions-explained",
        "category": "Planning",
        "cover": "article-4",
        "cover_alt": "Substantial family home with brick, timber cladding and a clay tile roof, the kind of streetscape Article 4 directions are written to protect",
        "cover_caption": "An Article 4 direction does not stop you improving your home. It means you need permission for work that would otherwise be permitted development.",
        "inline": [
            {
                "after_h2": "What an Article 4 direction typically takes away",
                "key": "mistakes",
                "alt": "Single-storey brick rear extension with skylights and bifold doors",
                "caption": "Roof alterations and rear extensions are among the works Article 4 directions most often pull back into planning.",
            }
        ],
    },
    {
        "txt": "open-plan-living-what-steel-beams-and-knocking-through-actually-involve.txt",
        "slug": "open-plan-living-steel-beams",
        "category": "Guides",
        "cover": "open-plan",
        "cover_alt": "Open-plan kitchen extension with sliding doors to a sandstone patio, the finished result of a structural opening",
        "cover_caption": "Knocking through is a structural job: the wall you remove is usually holding the house up, and a steel beam has to take that load.",
        "inline": [
            {
                "after_h2": "What a steel beam does, and how it is sized",
                "key": "open-plan-steel",
                "alt": "Red-primed structural steel beams in place on the foundations of a house extension",
                "caption": "The steels go in before the new floor and walls. They are sized to a structural design and inspected by building control.",
            },
            {
                "after_h2": "What it is like to live through",
                "key": "open-plan-kitchen",
                "alt": "Finished open-plan kitchen with an island after knocking through",
                "caption": "The room you actually live in is the point of the steel. Get the opening and the light right, and the structure disappears.",
            },
        ],
    },
    {
        "txt": "the-most-common-house-extension-mistakes-and-how-to-avoid-them.txt",
        "slug": "house-extension-mistakes",
        "category": "Guides",
        "cover": "mistakes",
        "cover_alt": "Well-matched brick rear extension with bifold doors and rooflights, an example of getting the structure and the light right",
        "cover_caption": "Most expensive extension mistakes are made at the design stage, not on site: shrinking the steel, forgetting the light, or quoting a different job.",
        "inline": [
            {
                "after_h2": "Forgetting to design in light",
                "key": "open-plan",
                "alt": "Kitchen extension with a wide run of sliding doors bringing garden light into the room",
                "caption": "A deep rear extension without rooflights or a lantern often leaves the middle of the original house dark.",
            }
        ],
    },
    {
        "txt": "planning-permission-and-building-regulations.txt",
        "slug": "planning-permission-and-building-regulations",
        "category": "Planning",
        "cover": "planning",
        "cover_alt": "Completed single-storey rear extension with bifold doors on a brick family house",
        "cover_caption": "Planning permission is about whether you are allowed to build it. Building regulations are about whether it is built properly.",
        "inline": [
            {
                "after_h2": "Building regulations: the rules that always apply",
                "key": "foundations",
                "alt": "Beam-and-block floor going in against an existing house during an extension",
                "caption": "Building control inspects the work as it goes: foundations, structure, drainage, insulation and fire safety, then issues a completion certificate.",
            }
        ],
    },
    {
        "txt": "flood-risk-and-home-building-projects-what-you-need-to-know.txt",
        "slug": "flood-risk-and-home-building-projects",
        "category": "Planning",
        "cover": "flood",
        "cover_alt": "Foundation trench excavated through a patio for a house extension, the stage where ground and drainage issues show up",
        "cover_caption": "Flood risk rarely stops you extending. It changes how the extension is designed, drained and signed off.",
        "inline": [
            {
                "after_h2": "How flood risk affects the design and the cost",
                "key": "foundations",
                "alt": "Groundworks for an extension with excavation and concrete beams alongside the existing house",
                "caption": "Deeper or more complex foundations, and drainage that has to be diverted, are where flood risk usually shows up in the quote.",
            }
        ],
    },
    {
        "txt": "lawful-development-certificates-what-they-are-and-why-you-want-one.txt",
        "slug": "lawful-development-certificates",
        "category": "Planning",
        "cover": "ldc",
        "cover_alt": "Timber-clad garden extension with bifold doors, the kind of permitted-development project a lawful development certificate protects",
        "cover_caption": "A lawful development certificate is not required, but it is the piece of paper that proves your permitted-development project was lawful when you built it.",
        "inline": [
            {
                "after_h2": "Why get one when it is not legally required",
                "key": "mistakes",
                "alt": "Finished rear extension that would typically be confirmed with a lawful development certificate if built under permitted development",
                "caption": "Solicitors and buyers ask for evidence. An LDC is the cleanest answer at resale.",
            }
        ],
    },
    {
        "txt": "building-regulations-vs-planning-permission.txt",
        "slug": "building-regulations-vs-planning-permission",
        "category": "Planning",
        "cover": "regs",
        "cover_alt": "House extension under construction with foundation trenches and materials on site",
        "cover_caption": "Planning is permission to build. Building regulations are proof it was built to standard. You often need both, and they are not the same thing.",
        "inline": [
            {
                "after_h2": "What building regulations actually govern",
                "key": "open-plan-steel",
                "alt": "Structural steel going in on the foundations of a rear extension",
                "caption": "Steels, foundations, fire safety, insulation and drainage are building-control matters, whether or not planning was needed.",
            }
        ],
    },
    {
        "txt": "the-party-wall-act-explained-for-homeowners.txt",
        "slug": "party-wall-act-explained",
        "category": "Planning",
        "cover": "party-wall",
        "cover_alt": "Rear extension built against an existing house, the kind of work that usually needs party wall notices on a terrace or semi",
        "cover_caption": "The Party Wall Act is a neighbour process, not a planning application. On most terraces and semis, an extension or loft will trigger it.",
        "inline": [
            {
                "after_h2": "What actually counts as a party wall",
                "key": "foundations",
                "alt": "Extension groundworks tight against the existing house wall, typical of work near a shared boundary",
                "caption": "Excavating near a neighbour's foundations is one of the most common reasons the Act applies, even if you are not building on the wall itself.",
            }
        ],
    },
]


def phone(s: str) -> str:
    return s.replace(PHONE_OLD, PHONE_NEW).replace("07734683686", "07920 731533")


def norm(s: str) -> str:
    s = re.sub(r"\s*\([^)]*\)\s*", " ", s)
    return re.sub(r"\s+", " ", s).strip().lower()


def parse_file(path: Path) -> dict:
    lines = [ln.strip() for ln in path.read_text(encoding="utf-8").splitlines() if ln.strip()]
    # H2 list
    h2s = []
    if "Suggested H2 structure:" in lines:
        i = lines.index("Suggested H2 structure:") + 1
        while i < len(lines) and not lines[i].endswith(":") and not lines[i].startswith("Internal"):
            h2s.append(re.sub(r"\s*\([^)]*\)\s*$", "", lines[i]).strip())
            i += 1

    content_i = lines.index("CONTENT") + 1 if "CONTENT" in lines else 0
    stop_markers = {"METADATA", "IMAGE", "SUGGESTED CTA", "SCHEMA", "NOTES", "NOTES — how this follows the template, and its role in the cluster"}
    body = []
    i = content_i
    while i < len(lines) and lines[i] not in stop_markers and not lines[i].startswith("NOTES"):
        body.append(lines[i])
        i += 1

    meta_title = None
    meta_desc = None
    slug_line = None
    if "METADATA" in lines:
        mi = lines.index("METADATA") + 1
        while mi < len(lines) and lines[mi] not in {"IMAGE", "SCHEMA", "SUGGESTED CTA"}:
            if lines[mi].startswith("Meta title:"):
                meta_title = re.sub(r"\s*\(.*$", "", lines[mi][len("Meta title:") :]).strip()
            if lines[mi].startswith("Meta description:"):
                meta_desc = re.sub(r"\s*\(.*$", "", lines[mi][len("Meta description:") :]).strip()
            if lines[mi].startswith("Slug:"):
                slug_line = lines[mi]
            mi += 1

    h1 = body[0] if body else path.stem
    # drop duplicate H1
    paras = body[1:]

    h2_norms = [norm(h) for h in h2s]
    faq_start = None
    for idx, p in enumerate(paras):
        if p.lower() == "frequently asked questions":
            faq_start = idx
            break

    main = paras[:faq_start] if faq_start is not None else paras
    faq_lines = paras[faq_start + 1 :] if faq_start is not None else []

    blocks = []
    for p in main:
        p = phone(p)
        matched = None
        pn = norm(p)
        for h, hn in zip(h2s, h2_norms):
            if pn == hn or pn.startswith(hn) or hn.startswith(pn):
                if abs(len(pn) - len(hn)) < 24:
                    matched = h
                    break
        if matched:
            blocks.append({"type": "h2", "text": matched})
            continue
        if p.startswith("Common misconception."):
            blocks.append({"type": "callout", "label": "Common misconception", "text": phone(p[len("Common misconception.") :].strip())})
            continue
        if p.startswith("Worth knowing."):
            blocks.append({"type": "callout", "label": "Worth knowing", "text": phone(p[len("Worth knowing.") :].strip())})
            continue
        blocks.append({"type": "p", "text": p})

    faqs = []
    for fl in faq_lines:
        fl = phone(fl)
        if "?" not in fl:
            if faqs:
                faqs[-1]["a"] += " " + fl
            continue
        q, a = fl.split("?", 1)
        faqs.append({"q": q.strip() + "?", "a": a.strip()})

    return {
        "h1": h1,
        "meta_title": meta_title or h1,
        "meta_desc": meta_desc or "",
        "blocks": blocks,
        "faqs": faqs,
    }


RELATED = {
    "can-you-extend-in-the-green-belt": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/extending-in-a-conservation-area", "Extending in a conservation area"),
        ("/blog/article-4-directions-explained", "Article 4 directions explained"),
        ("/extensions/essex/epping", "House extensions in Epping"),
        ("/extensions/essex/ongar", "House extensions in Ongar"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
    "extending-in-a-conservation-area": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/article-4-directions-explained", "Article 4 directions explained"),
        ("/blog/can-you-extend-in-the-green-belt", "Can you extend in the Green Belt?"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
    "article-4-directions-explained": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/extending-in-a-conservation-area", "Extending in a conservation area"),
        ("/blog/lawful-development-certificates", "Lawful development certificates"),
        ("/extensions", "House extensions"),
        ("/loft-conversions", "Loft conversions"),
        ("/contact", "Contact us"),
    ],
    "open-plan-living-steel-beams": [
        ("/blog/house-extension-mistakes", "House extension mistakes"),
        ("/blog/house-extension-cost-guide", "House extension cost guide"),
        ("/blog/building-regulations-vs-planning-permission", "Building regulations vs planning permission"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
    "house-extension-mistakes": [
        ("/blog/open-plan-living-steel-beams", "Steel beams and knocking through"),
        ("/blog/house-extension-cost-guide", "House extension cost guide"),
        ("/blog/how-long-does-a-house-extension-take", "How long an extension takes"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
    "planning-permission-and-building-regulations": [
        ("/blog/building-regulations-vs-planning-permission", "Building regulations vs planning permission"),
        ("/blog/article-4-directions-explained", "Article 4 directions explained"),
        ("/blog/lawful-development-certificates", "Lawful development certificates"),
        ("/blog/party-wall-act-explained", "The Party Wall Act"),
        ("/extensions", "House extensions"),
        ("/loft-conversions", "Loft conversions"),
        ("/contact", "Contact us"),
    ],
    "flood-risk-and-home-building-projects": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/building-regulations-vs-planning-permission", "Building regulations vs planning permission"),
        ("/extensions/essex/grays", "House extensions in Grays"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
    "lawful-development-certificates": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/building-regulations-vs-planning-permission", "Building regulations vs planning permission"),
        ("/blog/article-4-directions-explained", "Article 4 directions explained"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
    "building-regulations-vs-planning-permission": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/lawful-development-certificates", "Lawful development certificates"),
        ("/blog/party-wall-act-explained", "The Party Wall Act"),
        ("/extensions", "House extensions"),
        ("/loft-conversions", "Loft conversions"),
        ("/contact", "Contact us"),
    ],
    "party-wall-act-explained": [
        ("/blog/planning-permission-and-building-regulations", "Planning permission and building regulations"),
        ("/blog/building-regulations-vs-planning-permission", "Building regulations vs planning permission"),
        ("/loft-conversions", "Loft conversions"),
        ("/extensions", "House extensions"),
        ("/contact", "Contact us"),
    ],
}


def insert_images(blocks: list, inline: list) -> list:
    out = []
    pending = {item["after_h2"]: item for item in inline}
    for b in blocks:
        out.append(b)
        if b.get("type") == "h2" and b["text"] in pending:
            item = pending.pop(b["text"])
            out.append(
                {
                    "type": "image",
                    "src": f"/images/blog/{item['key']}.webp",
                    "alt": item["alt"],
                    "caption": item.get("caption"),
                }
            )
    # if an after_h2 didn't match, append remaining images before last paras
    for item in pending.values():
        # insert after first h2
        inserted = False
        new = []
        for b in out:
            new.append(b)
            if not inserted and b.get("type") == "h2":
                new.append(
                    {
                        "type": "image",
                        "src": f"/images/blog/{item['key']}.webp",
                        "alt": item["alt"],
                        "caption": item.get("caption"),
                    }
                )
                inserted = True
        out = new if inserted else out + [
            {
                "type": "image",
                "src": f"/images/blog/{item['key']}.webp",
                "alt": item["alt"],
                "caption": item.get("caption"),
            }
        ]
    return out


def cta_from_blocks(blocks: list) -> dict:
    text = ""
    for b in reversed(blocks):
        if b.get("type") == "p" and "site visit" in b["text"].lower():
            text = b["text"]
            break
    if not text:
        text = f"Book a free, no-obligation site visit on {PHONE_NEW}. No pressure, and no obligation to proceed."
    return {
        "eyebrow": "Thinking about your own project?",
        "heading": "Get a straight answer for your home",
        "text": text,
    }


def main() -> None:
    print("Converting photos")
    used_keys = set()
    for post in POSTS:
        used_keys.add(post["cover"])
        for item in post["inline"]:
            used_keys.add(item["key"])
    for key in used_keys:
        src = PHOTO[key]
        if not src.exists():
            raise SystemExit(f"missing photo {key}: {src}")
        convert(src, OUT_IMG / f"{key}.webp")

    print("\nParsing blogs")
    for post in POSTS:
        parsed = parse_file(BLOG_TXT / post["txt"])
        blocks = insert_images(parsed["blocks"], post["inline"])
        plain = " ".join(
            b.get("text") or b.get("alt") or ""
            for b in blocks
            if b["type"] in {"p", "h2", "callout"}
        )
        data = {
            "slug": post["slug"],
            "title": parsed["h1"],
            "metaTitle": parsed["meta_title"],
            "description": parsed["meta_desc"],
            "publishedAt": "2026-08-21",
            "category": post["category"],
            "author": "Jason Berry",
            "coverSrc": f"/images/blog/{post['cover']}.webp",
            "coverAlt": post["cover_alt"],
            "coverCaption": post["cover_caption"],
            "blocks": blocks,
            "faqs": parsed["faqs"],
            "relatedLinks": [{"href": h, "label": l} for h, l in RELATED[post["slug"]]],
            "cta": cta_from_blocks(parsed["blocks"]),
            "plainText": plain,
        }
        out = OUT_JSON / f"{post['slug']}.json"
        out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        h2n = sum(1 for b in blocks if b["type"] == "h2")
        imgn = sum(1 for b in blocks if b["type"] == "image")
        print(f"  {post['slug']}: h2={h2n} faqs={len(parsed['faqs'])} imgs={imgn} blocks={len(blocks)}")


if __name__ == "__main__":
    main()
