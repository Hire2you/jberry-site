"""Generate the 34 unpublished town/hub landing pages from extracted briefs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(r"C:\Users\Dave\jberry-site")
SRC = ROOT / ".tmp-landings"
PHONE = "07920 731533"

LOFT_IMGS = [
    "/images/hero-dormer.webp",
    "/images/loft-dormer-front.webp",
    "/images/loft-hip-to-gable.webp",
    "/images/loft-mansard.webp",
    "/images/loft-wardrobes.webp",
]
EXT_IMGS = [
    "/images/hero-rear-extension.webp",
    "/images/extension-rear-bifolds.webp",
    "/images/extension-bifolds.webp",
    "/images/extension-brick-orangery.webp",
    "/images/blog/open-plan.webp",
    "/images/blog/planning.webp",
    "/images/blog/mistakes.webp",
    "/images/blog/conservation.webp",
    "/images/blog/green-belt.webp",
    "/images/kitchen-granite.webp",
]


def phone(s: str) -> str:
    s = s.replace("07734 683686", PHONE).replace("07734683686", PHONE)
    s = s.replace("[PHONE]", PHONE).replace("Call [PHONE]", f"Call {PHONE}")
    s = s.replace("+447734683686", "+447920731533")
    return s


def clean(s: str) -> str:
    s = phone(s)
    s = re.sub(r"\[Trust-signal slot:[^\]]*\]", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def meta_line(lines: list[str], prefix: str) -> str:
    for ln in lines:
        if ln.lower().startswith(prefix.lower()):
            val = ln[len(prefix) :].strip()
            val = re.sub(r"\s*\(.*$", "", val)
            val = re.sub(r"\s*Trim to.*$", "", val, flags=re.I)
            return val.strip(" .")
    return ""


def body_lines(text: str) -> list[str]:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    start = 0
    for i, ln in enumerate(lines):
        if ln in {"PAGE COPY", "Full Content"}:
            start = i + 1
            break
    out = []
    for ln in lines[start:]:
        if ln.startswith("SCHEMA") or ln.startswith("FAQ Schema") or ln.startswith("FAQPage"):
            break
        if ln.startswith("NOTES") or ln.startswith("Notes:"):
            break
        if ln in {"json", "CTA"}:
            continue
        if ln.startswith("[Trust-signal"):
            continue
        out.append(ln)
    return out


def suggested_h2s(text: str) -> list[str]:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    h2s = []
    collecting = False
    for ln in lines:
        low = ln.lower()
        if "suggested h2" in low:
            collecting = True
            continue
        if collecting:
            if low.startswith("internal linking") or low.startswith("schema"):
                break
            if ln.startswith("(") or ln.startswith("CTA"):
                continue
            h2s.append(re.sub(r"\s*\([^)]*\)\s*$", "", ln).strip())
    return [h for h in h2s if h]


def split_sections(body: list[str], h2s: list[str]) -> tuple[list[str], list[tuple[str, list[str]]]]:
    norms = [(h, re.sub(r"\s+", " ", h).strip().lower()) for h in h2s]
    intro: list[str] = []
    sections: list[tuple[str, list[str]]] = []
    current: str | None = None
    buf: list[str] = []
    started = False
    for ln in body:
        n = re.sub(r"\s+", " ", ln).strip().lower()
        matched = None
        for h, hn in norms:
            if n == hn or n.startswith(hn) or (len(n) < 80 and hn.startswith(n) and abs(len(n) - len(hn)) < 20):
                matched = h
                break
        # also treat short title-case lines that equal an h2 loosely
        if matched is None and len(ln) < 90 and not ln.endswith(".") and current is not None:
            for h, hn in norms:
                if hn in n or n in hn:
                    matched = h
                    break
        if matched:
            if current is None:
                intro = buf[:]
            else:
                sections.append((current, buf))
            current = matched
            buf = []
            started = True
            continue
        buf.append(ln)
    if current is None:
        intro = buf
    else:
        sections.append((current, buf))
    # drop duplicate H1 from intro
    if intro and (intro[0].lower().startswith("loft conversions in") or intro[0].lower().startswith("house extensions in") or intro[0].lower().startswith("builders in")):
        intro = intro[1:]
    intro = [p for p in intro if not p.lower().startswith("talk to us")]
    return intro, sections


def parse_faqs(body: list[str]) -> list[dict]:
    faqs = []
    start = None
    for i, ln in enumerate(body):
        if ln.lower() == "frequently asked questions":
            start = i + 1
            break
    if start is None:
        return faqs
    for ln in body[start:]:
        ln = clean(ln)
        if not ln or ln.startswith("{") or ln.startswith('"'):
            break
        if "?" not in ln:
            if faqs:
                faqs[-1]["a"] += " " + ln
            continue
        q, a = ln.split("?", 1)
        faqs.append({"q": q.strip() + "?", "a": a.strip()})
    return faqs


def paras(lines: list[str]) -> list[str]:
    out = []
    for ln in lines:
        c = clean(ln)
        if not c:
            continue
        if c.lower().startswith("talk to us"):
            continue
        if "cost calculator" in c.lower() and "href" in c.lower():
            continue
        out.append(c)
    return out


def join_paras(lines: list[str]) -> str:
    return " ".join(paras(lines))


def pick_img(pool: list[str], i: int) -> str:
    return pool[i % len(pool)]


def write_page(path: Path, json_import: str, fn: str, service_type: str, crumbs: list[tuple[str, str]]) -> None:
    crumb_js = ",\n          ".join(
        [f"{{ name: '{n}', path: '{p}' }}" for n, p in crumbs]
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f"""import type {{ Metadata }} from 'next';
import landing from '{json_import}';
import {{
  breadcrumbSchema,
  faqSchema,
  JsonLd,
  localBusinessSchema,
  townServiceSchema,
}} from '@/lib/schema';
import TownExtensionLanding from '@/components/TownExtensionLanding';

export const metadata: Metadata = {{
  title: {{ absolute: landing.seo.title }},
  description: landing.seo.description,
  alternates: {{ canonical: landing.seo.canonical }},
  openGraph: {{
    title: landing.seo.title,
    description: landing.seo.description,
    url: landing.seo.canonical,
    images: [{{ url: landing.hero.image.src, alt: landing.hero.image.alt }}],
  }},
}};

export default function {fn}() {{
  return (
    <>
      <JsonLd
        data={{townServiceSchema({{
          serviceType: '{service_type}',
          townName: landing.town,
          path: landing.seo.canonical,
        }})}}
      />
      <JsonLd data={{localBusinessSchema()}} />
      <JsonLd
        data={{breadcrumbSchema([
          {crumb_js},
        ])}}
      />
      <JsonLd data={{faqSchema(landing.faqs)}} />
      <TownExtensionLanding data={{landing}} />
    </>
  );
}}
""",
        encoding="utf-8",
    )


def write_hub_page(path: Path, json_import: str, fn: str, component: str, service: str, area: str, area_type: str | None, crumbs: list[tuple[str, str]]) -> None:
    crumb_js = ",\n          ".join([f"{{ name: '{n}', path: '{p}' }}" for n, p in crumbs])
    extra = f",\n          areaType: '{area_type}'," if area_type else ""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f"""import type {{ Metadata }} from 'next';
import hub from '{json_import}';
import {{ countyServiceSchema, breadcrumbSchema, faqSchema, JsonLd }} from '@/lib/schema';
import {component} from '@/components/{component}';

export const metadata: Metadata = {{
  title: {{ absolute: hub.seo.title }},
  description: hub.seo.description,
  alternates: {{ canonical: hub.seo.canonical }},
  openGraph: {{
    title: hub.seo.title,
    description: hub.seo.description,
    url: hub.seo.canonical,
    images: [{{ url: hub.hero.image.src, alt: hub.hero.image.alt }}],
  }},
}};

export default function {fn}() {{
  return (
    <>
      <JsonLd
        data={{countyServiceSchema({{
          serviceType: '{service}',
          areaName: hub.county,
          path: hub.seo.canonical,{extra}
        }})}}
      />
      <JsonLd
        data={{breadcrumbSchema([
          {crumb_js},
        ])}}
      />
      <JsonLd data={{faqSchema(hub.faqs)}} />
      <{component} data={{hub}} />
    </>
  );
}}
""",
        encoding="utf-8",
    )


def section_by(sections, *keys: str) -> tuple[str, list[str]] | None:
    for title, lines in sections:
        t = title.lower()
        if any(k in t for k in keys):
            return title, lines
    return None


def build_loft_town(cfg: dict, text: str, idx: int) -> dict:
    body = body_lines(text)
    h2s = suggested_h2s(text)
    intro, sections = split_sections(body, h2s)
    faqs = parse_faqs(body)
    intro_p = paras(intro)[:3]
    if len(intro_p) < 2 and intro:
        intro_p = paras(intro)

    homes_s = section_by(sections, "roof", "suits", "what type", "homes", "bungalow", "modest", "newer", "estate", "cut roof", "truss", "daylight", "glazing", "anatomy", "terrace", "materials", "external", "will you get") or (sections[0] if sections else ("Your loft", intro[:1]))
    types_s = section_by(sections, "suits", "which conversion", "type") 
    if types_s is None:
        types_s = sections[1] if len(sections) > 1 else homes_s
    plan_s = section_by(sections, "planning", "permission", "building regulations", "party wall", "will you get")
    why_s = section_by(sections, "why homeowner", "why ", "cost")

    homes_lines = paras(homes_s[1])
    types_lines = paras(types_s[1])
    plan_lines = paras(plan_s[1]) if plan_s else []
    why_lines = paras(why_s[1]) if why_s else []

    why_text = join_paras(why_lines)
    cost_text = why_text
    if "on cost" in why_text.lower():
        parts = re.split(r"(?i)on cost[, ]", why_text, maxsplit=1)
        if len(parts) == 2:
            why_text, cost_text = parts[0].strip(), "On cost, " + parts[1].strip()
    elif "the cost calculator" in why_text.lower():
        i = why_text.lower().find("the cost calculator")
        # find sentence start before calculator for cost
        cut = why_text.rfind(". ", 0, i)
        if cut > 80:
            why_text, cost_text = why_text[: cut + 1].strip(), why_text[cut + 2 :].strip()

    cta_text = cfg.get("cta") or (
        f"Call {PHONE} or request a callback, and we will look at your roof, tell you honestly what it will take, and give you a real, itemised figure. Free site visit, no pressure, no obligation."
    )
    # last intro para sometimes is a CTA with phone
    cta_from_intro = next((p for p in intro_p if PHONE in p or "site visit" in p.lower()), None)
    if cta_from_intro and len(intro_p) > 1:
        intro_p = [p for p in intro_p if p != cta_from_intro]
        cta_text = cta_from_intro if "Call" in cta_from_intro or "callback" in cta_from_intro.lower() else cta_text

    hero = pick_img(LOFT_IMGS, idx)
    mid = pick_img(LOFT_IMGS, idx + 2)
    town = cfg["town"]
    data = {
        "serviceSlug": "loft-conversions",
        "town": town,
        "county": cfg["county"],
        "countySlug": cfg["countySlug"],
        "townSlug": cfg["townSlug"],
        "seo": {
            "title": meta_line(text.splitlines(), "Meta title:") or f"Loft Conversions in {town} | J Berry Construction",
            "description": meta_line(text.splitlines(), "Meta description:") or f"Loft conversions in {town}. We match the conversion to your roof and handle planning and building regs. Free site visit.",
            "canonical": cfg["canonical"],
        },
        "hero": {
            "image": {
                "src": hero,
                "alt": f"Loft conversion on a family home in {town} by J Berry Construction",
            },
            "eyebrow": f"Loft conversions · {town}",
            "headline": f"Loft Conversions in {town}",
        },
        "intro": {
            "paragraphs": intro_p[:2] if len(intro_p) >= 2 else (intro_p or [f"We design and build loft conversions in {town}."]),
            "cta": {
                "title": f"Weighing up a loft conversion in {town}?",
                "text": cta_text if "Call" in cta_text or "callback" in cta_text.lower() else f"Call {PHONE} or request a callback. Free site visit, no pressure, no obligation.",
                "secondaryCta": "Request a callback",
            },
        },
        "homes": {
            "title": homes_s[0],
            "intro": homes_lines[0] if homes_lines else join_paras(homes_s[1])[:280],
            "body": homes_lines[1] if len(homes_lines) > 1 else (homes_lines[0] if homes_lines else ""),
            "closing": " ".join(homes_lines[2:]) if len(homes_lines) > 2 else (homes_lines[-1] if homes_lines else ""),
            "image": {"src": mid, "alt": f"Finished loft conversion suited to {town} homes"},
        },
        "extensionTypes": {
            "title": types_s[0],
            "intro": join_paras(types_s[1]),
            "image": {"src": pick_img(LOFT_IMGS, idx + 1), "alt": f"Loft conversion type suited to houses in {town}"},
        },
        "planning": {
            "title": plan_s[0] if plan_s else f"Planning in {town}",
            "paragraphs": plan_lines or [f"We check your planning position in {town} and handle whichever route applies."],
        },
        "whyUs": {
            "title": "Why homeowners choose us",
            "text": why_text or join_paras(why_lines) or f"We have built for homeowners since 1995, and most of our work comes through recommendation. One team runs the work start to finish, and we handle the planning, party wall and building regulations through to the completion certificate.",
        },
        "cost": {
            "title": "What it costs",
            "paragraphs": [cost_text] if cost_text else [f"Cost depends on the type of conversion your {town} roof needs. A free site visit gets you a real, itemised figure."],
            "cta": {
                "title": "Want a real figure?",
                "text": f"Book a free site visit and we will look at your actual roof and give you a real, itemised figure.",
                "secondaryCta": "Get a free quote",
            },
        },
        "faqs": faqs,
        "relatedLinks": cfg["related"],
        "cta": {
            "eyebrow": "Start your loft conversion",
            "title": f"Weighing up a loft conversion in {town}?",
            "text": cta_text if PHONE in cta_text else f"Call {PHONE}, request a callback, or book a free, no-obligation site visit. No pressure, and no obligation to proceed.",
        },
    }
    return data


def headingish(ln: str) -> bool:
    if len(ln) > 90:
        return False
    if ln.endswith(".") and len(ln) > 50:
        return False
    if ln.lower().startswith("talk to us"):
        return True
    words = ln.split()
    if len(words) <= 12 and ln[0].isupper():
        return True
    return False


def split_ext_content(body: list[str]) -> tuple[list[str], list[tuple[str, list[str]]]]:
    keys = [
        "why homeowners",
        "the extensions we build",
        "the extension types",
        "a recent",
        "opening up",
        "the steel",
        "planning permission",
        "why the ground",
        "ground conditions",
        "what an extension costs",
        "what does an extension cost",
        "what the build",
        "how long",
        "materials",
        "your options",
        "the essex areas",
        "the kent areas",
        "the hertfordshire areas",
        "frequently asked",
        "what we do",
        "hertfordshire homes",
        "planning in",
        "why kent",
        "why essex",
        "why hertfordshire",
        "what it costs",
        "what a loft",
        "kent roofs",
        "the kent areas we cover",
    ]
    intro = []
    sections = []
    current = None
    buf: list[str] = []
    for ln in body:
        n = ln.lower().strip()
        matched = None
        for k in keys:
            if n.startswith(k) or n == k:
                matched = ln
                break
        if matched is None and headingish(ln) and any(k in n for k in keys):
            matched = ln
        if matched:
            if current is None:
                intro = buf
            else:
                sections.append((current, buf))
            current = matched
            buf = []
            continue
        buf.append(ln)
    if current is None:
        intro = buf
    else:
        sections.append((current, buf))
    if intro and intro[0].lower().startswith(("house extensions in", "builders in", "loft conversions in")):
        intro = intro[1:]
    intro = [p for p in intro if not p.lower().startswith("talk to us")]
    return intro, sections


def bullets(lines: list[str]) -> list[str]:
    items = []
    rest = []
    for ln in paras(lines):
        if len(ln) < 220 and (ln[:1].isupper()) and (
            ln.lower().startswith(("the ", "a ", "rear", "side", "full-", "double", "kitchen", "sympathetic", "single", "wrap", "over-", "garage", "combine"))
            or ln.count(".") <= 2 and len(ln) < 160
        ):
            items.append(ln)
        else:
            rest.append(ln)
    return items or paras(lines)


def build_ext_town(cfg: dict, text: str, idx: int) -> dict:
    body = body_lines(text)
    intro, sections = split_ext_content(body)
    faqs = parse_faqs(body)
    intro_p = paras(intro)[:3]
    types_s = section_by(sections, "extensions we build", "extension types", "your options", "what we do")
    why_s = section_by(sections, "why homeowner", "why ")
    plan_s = section_by(sections, "planning")
    ground_s = section_by(sections, "ground")
    cost_s = section_by(sections, "cost")
    place_s = section_by(sections, "materials", "recent")
    homes_s = section_by(sections, "steel", "opening up", "recent")
    build_s = section_by(sections, "the build", "how long")

    town = cfg["town"]
    types_items = bullets(types_s[1]) if types_s else []
    cta = f"Book a free, no-obligation site visit and we will talk through what will actually work on your house and what it will cost. Call {PHONE}."
    cta_intro = next((p for p in intro_p if "site visit" in p.lower() or "callback" in p.lower()), None)
    if cta_intro:
        intro_p = [p for p in intro_p if p != cta_intro]
        cta = cta_intro

    data = {
        "serviceSlug": "extensions",
        "town": town,
        "county": cfg["county"],
        "countySlug": cfg["countySlug"],
        "townSlug": cfg["townSlug"],
        "seo": {
            "title": meta_line(text.splitlines(), "Meta title:") or f"House Extensions in {town} | J Berry Construction",
            "description": meta_line(text.splitlines(), "Meta description:") or f"Extension design and build in {town}. Planning handled. Free site visit. Call {PHONE}.",
            "canonical": cfg["canonical"],
        },
        "hero": {
            "image": {
                "src": pick_img(EXT_IMGS, idx),
                "alt": f"House extension in {town} by J Berry Construction",
            },
            "eyebrow": f"House extensions · {town}",
            "headline": f"House Extensions in {town}",
        },
        "intro": {
            "paragraphs": intro_p[:2] if len(intro_p) >= 2 else (intro_p or [f"We design and build house extensions in {town}."]),
            "cta": {
                "title": f"Thinking about extending your {town} home?",
                "text": cta if "Call" in cta or "visit" in cta.lower() else f"Book a free, no-obligation site visit. Call {PHONE}.",
                "secondaryCta": "Request a callback",
            },
        },
        "extensionTypes": {
            "title": types_s[0] if types_s else f"The extensions we build in {town}",
            "items": types_items[:8] if types_items else [join_paras(types_s[1])] if types_s else [f"Rear, side and double storey extensions matched to {town} houses."],
            "image": {"src": pick_img(EXT_IMGS, idx + 1), "alt": f"Rear extension suited to homes in {town}"},
        },
        "planning": {
            "title": plan_s[0] if plan_s else f"Planning in {town}",
            "paragraphs": paras(plan_s[1]) if plan_s else [f"We check your planning position and handle any application."],
        },
        "whyUs": {
            "title": why_s[0] if why_s else "Why homeowners here choose us",
            "text": join_paras(why_s[1]) if why_s else "One team runs the job from start to finish. We handle the planning and the building regulations. Our quotes are itemised. Most of our work comes through recommendation.",
        },
        "cost": {
            "title": cost_s[0] if cost_s else "What it costs",
            "paragraphs": paras(cost_s[1]) if cost_s else [f"Cost depends on size, specification and the ground. A free site visit gets you a real, itemised figure."],
            "cta": {
                "title": "Want a real figure for your project?",
                "text": f"Book a free site visit and we will price the actual work, with a clear itemised quote and no pressure to proceed.",
                "secondaryCta": "Get a free quote",
            },
        },
        "faqs": faqs,
        "relatedLinks": cfg["related"],
        "cta": {
            "eyebrow": "Start your extension",
            "title": f"Thinking about extending your {town} home?",
            "text": cta if PHONE in cta else f"Call {PHONE}, request a callback, or book a free, no-obligation site visit. No pressure, and no obligation to proceed.",
        },
    }
    if homes_s:
        hl = paras(homes_s[1])
        data["homes"] = {
            "title": homes_s[0],
            "intro": hl[0] if hl else "",
            "body": hl[1] if len(hl) > 1 else (hl[0] if hl else ""),
            "closing": " ".join(hl[2:]) if len(hl) > 2 else (hl[-1] if hl else ""),
            "image": {"src": pick_img(EXT_IMGS, idx + 2), "alt": f"Open-plan extension in {town}"},
        }
    if ground_s:
        data["ground"] = {"title": ground_s[0], "paragraphs": paras(ground_s[1])}
    if place_s and place_s is not homes_s:
        data["place"] = {"title": place_s[0], "paragraphs": paras(place_s[1])}
    if build_s:
        data["buildProcess"] = {"title": build_s[0], "text": join_paras(build_s[1])}
    return data


def roof_types_from(lines: list[str], idx: int) -> list[dict]:
    types = []
    current = None
    buf = []
    labels = [
        ("hipped", "Hip-to-gable", "1930s hipped semis"),
        ("victorian", "L-shaped dormer", "Victorian & Edwardian terraces"),
        ("edwardian", "L-shaped dormer", "Victorian & Edwardian terraces"),
        ("weald", "Rooflight", "Wealden and period roofs"),
        ("detached", "Rooflight", "Detached with good head height"),
        ("mansard", "Mansard", "Terraced & period settings"),
        ("conservation", "Rooflight", "Conservation and protected settings"),
        ("bungalow", "Dormer / chalet", "Bungalows and chalets"),
    ]
    paras_l = paras(lines)
    # keep as 3-4 chunks
    chunks = []
    bufp = []
    for p in paras_l:
        if bufp and (p.lower().startswith("the 1930") or p.lower().startswith("the victorian") or p.lower().startswith("in the weald") or p.lower().startswith("detached") or p.lower().startswith("the point")):
            chunks.append(" ".join(bufp))
            bufp = [p]
        else:
            bufp.append(p)
    if bufp:
        chunks.append(" ".join(bufp))
    imgs = LOFT_IMGS
    for i, chunk in enumerate(chunks[:4]):
        stock, conv = "Local roof stock", "Matched conversion"
        cl = chunk.lower()
        for needle, conv_n, stock_n in labels:
            if needle in cl:
                conv, stock = conv_n, stock_n
                break
        if chunk.lower().startswith("the point"):
            continue
        types.append({
            "roofStock": stock,
            "conversion": conv,
            "text": chunk,
            "image": imgs[i % len(imgs)],
            "imageAlt": f"{conv} loft conversion",
        })
    if not types:
        types.append({
            "roofStock": "Local roofs",
            "conversion": "Matched to the house",
            "text": join_paras(lines),
            "image": imgs[0],
            "imageAlt": "Loft conversion matched to the roof",
        })
    return types


def build_loft_hub(cfg: dict, text: str, idx: int) -> dict:
    body = body_lines(text)
    h2s = suggested_h2s(text)
    intro, sections = split_sections(body, h2s)
    faqs = parse_faqs(body)
    areas_s = section_by(sections, "areas we cover")
    roofs_s = section_by(sections, "roofs")
    plan_s = section_by(sections, "planning")
    involves_s = section_by(sections, "involves", "what a loft conversion involves")
    why_s = section_by(sections, "why")
    cost_s = section_by(sections, "cost")
    intro_p = paras(intro)[:2]
    plan_lines = paras(plan_s[1]) if plan_s else []
    permitted = [p for p in plan_lines if "always" not in p.lower()[:20]]
    always = [p for p in plan_lines if "always" in p.lower() or "building-reg" in p.lower() or "party wall" in p.lower()]
    if not always and len(plan_lines) >= 2:
        always = plan_lines[-1:]
        permitted = plan_lines[:-1]
    county = cfg["county"]
    return {
        "serviceSlug": "loft-conversions",
        "county": county,
        "countySlug": cfg["countySlug"],
        "seo": {
            "title": meta_line(text.splitlines(), "Meta title:") or f"Loft Conversions in {county} | J Berry Construction",
            "description": meta_line(text.splitlines(), "Meta description:") or f"Loft conversions across {county}. We handle planning and building regs.",
            "canonical": cfg["canonical"],
        },
        "hero": {
            "image": {"src": pick_img(LOFT_IMGS, idx), "alt": f"Loft conversion in {county} by J.Berry"},
            "eyebrow": f"Loft conversions · {county}",
            "headline": f"Loft Conversions in {county}",
            "sub": intro_p[0][:180] if intro_p else f"Loft conversions across {county}, matched to your roof.",
        },
        "intro": intro_p or [f"We design and build loft conversions across {county}."],
        "introImage": {"src": pick_img(LOFT_IMGS, idx + 1), "alt": f"Dormer loft conversion in {county}"},
        "areas": {
            "title": areas_s[0] if areas_s else f"The {county} areas we cover",
            "intro": join_paras(areas_s[1]) if areas_s else "",
            "clusters": cfg["clusters"],
        },
        "roofs": {
            "title": roofs_s[0] if roofs_s else f"{county} roofs, and the loft conversions that suit them",
            "intro": paras(roofs_s[1])[0] if roofs_s and paras(roofs_s[1]) else "",
            "closing": paras(roofs_s[1])[-1] if roofs_s and paras(roofs_s[1]) else "Your roof largely chooses the conversion.",
            "types": roof_types_from(roofs_s[1] if roofs_s else [], idx),
        },
        "planning": {
            "title": plan_s[0] if plan_s else f"Loft planning in {county}",
            "intro": permitted[0] if permitted else join_paras(plan_lines),
            "permitted": {
                "title": "Often permitted development",
                "points": permitted[1:5] if len(permitted) > 1 else permitted or ["Many loft conversions can be done under permitted development within the volume limits."],
            },
            "always": {
                "title": "Always required",
                "points": always or ["Every loft conversion needs full building-regulations approval and a completion certificate."],
            },
            "blogLink": {
                "href": "/blog/planning-permission-and-building-regulations",
                "label": "Read the planning permission and building regulations guide",
            },
        },
        "involves": {
            "title": involves_s[0] if involves_s else "What a loft conversion involves",
            "intro": join_paras(involves_s[1]) if involves_s else "A loft conversion is a proper building project. We design and build it with one team from start to finish.",
            "steps": [
                {"step": "01", "title": "Structural floor", "text": "A new structural floor, often on steel beams, built to carry the room and meet building regulations."},
                {"step": "02", "title": "Roof works", "text": "The roof works for a dormer, mansard or rooflights, tiled, weatherproofed and finished to match your home."},
                {"step": "03", "title": "Staircase & fire escape", "text": "A compliant staircase and the fire-safety escape route the regs require."},
                {"step": "04", "title": "Insulation & fit-out", "text": "Insulation, plastering, electrics and plumbing, then the room itself, fitted and finished."},
                {"step": "05", "title": "Planning & sign-off", "text": "We handle planning and building regulations through to the completion certificate."},
            ],
        },
        "whyUs": {
            "title": why_s[0] if why_s else f"Why {county} homeowners choose us",
            "intro": "A few honest reasons homeowners here choose us:",
            "reasons": [
                {"title": "Established since 1995", "text": paras(why_s[1])[0] if why_s and paras(why_s[1]) else "We have been building for homeowners since 1995, and most of our work comes through recommendation."},
                {"title": "One team, clear contact", "text": "We work as one team with a clear point of contact. You deal with the people who priced and build your job."},
                {"title": "Honest cost and time", "text": "We quote clearly and itemise it, and handle planning and building regulations through to the completion certificate."},
                {"title": "Honest advice", "text": paras(why_s[1])[-1] if why_s and paras(why_s[1]) else "Because we also build extensions, we can tell you honestly whether a loft is the right route."},
            ],
            "sidewaysLink": cfg["sideways"],
        },
        "cost": {
            "title": cost_s[0] if cost_s else "What a loft conversion costs",
            "intro": paras(cost_s[1])[0] if cost_s and paras(cost_s[1]) else "Cost depends most on the type of conversion your roof needs.",
            "ladder": [
                {"name": "Rooflight", "note": "Usually the most cost-effective"},
                {"name": "Dormer", "note": "The most common we build"},
                {"name": "Mansard", "note": "Maximum space, highest cost"},
            ],
            "closing": paras(cost_s[1])[-1] if cost_s and paras(cost_s[1]) else "A free site visit gets you a real, itemised quote.",
            "costLink": {"href": "/cost-guides/loft-conversion-cost", "label": "Read the loft conversion cost guide"},
            "included": [
                "Full structural work: steels, floor joists and building regs compliance",
                "Dormer or roof alterations, tiling and weatherproofing",
                "Staircase design and installation",
                "First and second fix electrics and plumbing",
                "Plastering, insulation to current regs, and decoration",
                "Planning and building regulations through to completion certificate",
            ],
        },
        "faqs": faqs,
        "relatedLinks": cfg["related"],
        "cta": {
            "eyebrow": "Start your loft conversion",
            "title": f"Thinking about converting your loft in {county}?",
            "text": f"Call {PHONE}, request a callback, or book a free, no-obligation site visit. We will check your roof and tell you honestly which conversion suits. No pressure, and no obligation to proceed.",
        },
    }


def type_items_from(lines: list[str]) -> list[dict]:
    items = []
    imgs = EXT_IMGS
    for i, ln in enumerate(bullets(lines)[:4]):
        name = ln.split(".")[0][:48]
        items.append({"name": name, "text": ln, "image": imgs[i % len(imgs)], "imageAlt": name})
    if not items:
        items.append({"name": "Rear extension", "text": join_paras(lines), "image": imgs[0], "imageAlt": "Rear extension"})
    return items


def build_ext_hub(cfg: dict, text: str, idx: int) -> dict:
    body = body_lines(text)
    intro, sections = split_ext_content(body)
    # also try suggested h2 split for PAGE COPY hubs
    if not sections:
        h2s = suggested_h2s(text)
        intro, sections = split_sections(body, h2s)
    faqs = parse_faqs(body)
    intro_p = paras(intro)[:2]
    types_s = section_by(sections, "extension types", "extensions we build", "homes", "what we do", "projects that suit")
    plan_s = section_by(sections, "planning")
    ground_s = section_by(sections, "ground", "tight")
    why_s = section_by(sections, "why")
    cost_s = section_by(sections, "cost")
    areas_s = section_by(sections, "areas we cover")
    county = cfg["county"]
    types = type_items_from(types_s[1]) if types_s else type_items_from(["Rear extensions. Side and wrap-around. Double storey."])
    ground_lines = paras(ground_s[1]) if ground_s else paras(plan_s[1] if plan_s else [])
    tight_items = []
    for i, p in enumerate(ground_lines[:3] or ["We check the ground and the rules before we price the work."]):
        tight_items.append({"title": ["Ground", "Access", "Neighbours"][i % 3], "text": p})
    return {
        "serviceSlug": "extensions",
        "county": county,
        "countySlug": cfg["countySlug"],
        "seo": {
            "title": meta_line(text.splitlines(), "Meta title:") or f"House Extensions in {county} | J Berry Construction",
            "description": meta_line(text.splitlines(), "Meta description:") or f"House extension design and build across {county}. Planning handled. Free site visit.",
            "canonical": cfg["canonical"],
        },
        "hero": {
            "image": {"src": pick_img(EXT_IMGS, idx), "alt": f"House extension in {county} by J Berry Construction"},
            "eyebrow": f"House extensions · {county}",
            "headline": cfg.get("h1") or f"House Extensions in {county}",
            "sub": intro_p[0][:200] if intro_p else f"Extensions across {county}, designed around the house they join.",
        },
        "intro": intro_p or [f"We design and build house extensions across {county}."],
        "introImage": {
            "src": pick_img(EXT_IMGS, idx + 1),
            "alt": f"Rear extension on a family home in {county}",
        },
        "sideReturn": {
            "title": (plan_s or types_s or ("Planning", []))[0],
            "paragraphs": paras((plan_s or types_s)[1])[:4] if (plan_s or types_s) else intro_p,
            "image": {"src": pick_img(EXT_IMGS, idx + 2), "alt": f"Extension in {county}"},
        },
        "types": {
            "title": types_s[0] if types_s else "The extension types that suit these homes",
            "intro": paras(types_s[1])[0] if types_s and paras(types_s[1]) else "The right extension depends on the house and the space around it.",
            "closing": paras(types_s[1])[-1] if types_s and paras(types_s[1]) else "We match the extension to your actual house.",
            "items": types,
        },
        "tightSite": {
            "title": ground_s[0] if ground_s else f"Building in {county}",
            "intro": tight_items[0]["text"] if tight_items else "",
            "closing": "None of this is exotic when it is planned for at the start.",
            "items": tight_items,
        },
        "project": {
            "title": cfg.get("projectTitle") or f"How we work in {county}",
            "text": cfg.get("projectText") or (join_paras(why_s[1]) if why_s else f"One team runs the job from first visit to completion certificate."),
        },
        "planning": {
            "title": plan_s[0] if plan_s else f"Planning in {county}",
            "intro": paras(plan_s[1])[0] if plan_s and paras(plan_s[1]) else "",
            "paragraphs": paras(plan_s[1])[1:] if plan_s and len(paras(plan_s[1])) > 1 else paras(plan_s[1]) if plan_s else [],
        },
        "whyUs": {
            "title": why_s[0] if why_s else f"Why {county} homeowners choose us",
            "paragraphs": paras(why_s[1]) if why_s else ["We have built for homeowners since 1995, and most of our work comes through recommendation."],
            "sidewaysLink": cfg["sideways"],
        },
        "areas": {
            "title": areas_s[0] if areas_s else f"Where we work in {county}",
            "intro": join_paras(areas_s[1]) if areas_s else f"We work across {county}. Local pages with detail on housing stock and planning:",
            "closing": "If your area is not listed, call us anyway.",
            "towns": cfg["towns"],
        },
        "cost": {
            "title": cost_s[0] if cost_s else "What it costs",
            "paragraphs": paras(cost_s[1]) if cost_s else ["Cost depends on size, specification and the ground. A free site visit gets you a real figure."],
            "costLink": {"href": "/blog/house-extension-cost-guide", "label": "Read the house extension cost guide"},
        },
        "faqs": faqs,
        "relatedLinks": cfg["related"],
        "cta": {
            "eyebrow": "Start your extension",
            "title": f"Thinking about a project in {county}?",
            "text": f"Call {PHONE}, request a callback, or book a free, no-obligation site visit. No pressure, and no obligation to proceed.",
        },
    }


def link(*pairs):
    return [{"href": h, "label": l} for h, l in pairs]


# --- configs ---
LE = "/loft-conversions/essex"
LL = "/loft-conversions/london"
LK = "/loft-conversions/kent"
LH = "/loft-conversions/hertfordshire"
EE = "/extensions/essex"
EL = "/extensions/london"
EK = "/extensions/kent"
EH = "/extensions/hertfordshire"

def loft_related(town_slug, extras=None):
    base = [
        ("/loft-conversions", "Loft conversions overview"),
        (LE, "Loft conversions in Essex"),
        ("/blog/how-long-does-a-loft-conversion-take", "How long does a loft conversion take?"),
        ("/cost-guides/loft-conversion-cost", "Loft conversion cost guide"),
        ("/contact", "Contact us"),
    ]
    if extras:
        base = extras + base
    return link(*base)


TOWNS = [
    # Essex lofts
    {"kind": "loft-town", "src": "loft-essex-epping", "town": "Epping", "county": "Essex", "countySlug": "essex", "townSlug": "epping", "canonical": f"{LE}/epping", "fn": "EppingLoftConversionsPage", "related": loft_related("epping", [(f"{EE}/epping", "House extensions in Epping"), (f"{LE}/loughton", "Loft conversions in Loughton")])},
    {"kind": "loft-town", "src": "loft-essex-chigwell", "town": "Chigwell", "county": "Essex", "countySlug": "essex", "townSlug": "chigwell", "canonical": f"{LE}/chigwell", "fn": "ChigwellLoftConversionsPage", "related": loft_related("chigwell", [(f"{EE}/chigwell", "House extensions in Chigwell"), (f"{LE}/loughton", "Loft conversions in Loughton")])},
    {"kind": "loft-town", "src": "loft-essex-harlow", "town": "Harlow", "county": "Essex", "countySlug": "essex", "townSlug": "harlow", "canonical": f"{LE}/harlow", "fn": "HarlowLoftConversionsPage", "related": loft_related("harlow", [(f"{EE}/harlow", "House extensions in Harlow"), (f"{LE}/epping", "Loft conversions in Epping")])},
    {"kind": "loft-town", "src": "loft-essex-brentwood", "town": "Brentwood", "county": "Essex", "countySlug": "essex", "townSlug": "brentwood", "canonical": f"{LE}/brentwood", "fn": "BrentwoodLoftConversionsPage", "related": loft_related("brentwood", [(f"{EE}/brentwood", "House extensions in Brentwood"), (f"{LE}/billericay", "Loft conversions in Billericay")])},
    {"kind": "loft-town", "src": "loft-essex-great-dunmow", "town": "Great Dunmow", "county": "Essex", "countySlug": "essex", "townSlug": "great-dunmow", "canonical": f"{LE}/great-dunmow", "fn": "GreatDunmowLoftConversionsPage", "related": loft_related("great-dunmow", [(f"{EE}/great-dunmow", "House extensions in Great Dunmow"), (f"{LE}/braintree", "Loft conversions in Braintree")])},
    {"kind": "loft-town", "src": "loft-essex-wickford", "town": "Wickford", "county": "Essex", "countySlug": "essex", "townSlug": "wickford", "canonical": f"{LE}/wickford", "fn": "WickfordLoftConversionsPage", "related": loft_related("wickford", [(f"{EE}/wickford", "House extensions in Wickford"), (f"{LE}/basildon", "Loft conversions in Basildon")])},
    {"kind": "loft-town", "src": "loft-essex-rayleigh", "town": "Rayleigh", "county": "Essex", "countySlug": "essex", "townSlug": "rayleigh", "canonical": f"{LE}/rayleigh", "fn": "RayleighLoftConversionsPage", "related": loft_related("rayleigh", [(f"{LE}/southend-on-sea", "Loft conversions in Southend-on-Sea"), (f"{LE}/wickford", "Loft conversions in Wickford")])},
    {"kind": "loft-town", "src": "loft-essex-saffron-walden", "town": "Saffron Walden", "county": "Essex", "countySlug": "essex", "townSlug": "saffron-walden", "canonical": f"{LE}/saffron-walden", "fn": "SaffronWaldenLoftConversionsPage", "related": loft_related("saffron-walden", [(f"{LE}/great-dunmow", "Loft conversions in Great Dunmow"), (f"{LE}/braintree", "Loft conversions in Braintree")])},
    {"kind": "loft-town", "src": "loft-essex-ongar", "town": "Ongar", "county": "Essex", "countySlug": "essex", "townSlug": "ongar", "canonical": f"{LE}/ongar", "fn": "OngarLoftConversionsPage", "related": loft_related("ongar", [(f"{EE}/ongar", "House extensions in Ongar"), (f"{LE}/epping", "Loft conversions in Epping")])},
    {"kind": "loft-town", "src": "loft-essex-basildon", "town": "Basildon", "county": "Essex", "countySlug": "essex", "townSlug": "basildon", "canonical": f"{LE}/basildon", "fn": "BasildonLoftConversionsPage", "related": loft_related("basildon", [(f"{EE}/basildon", "House extensions in Basildon"), (f"{LE}/billericay", "Loft conversions in Billericay")])},
    {"kind": "loft-town", "src": "loft-essex-maldon", "town": "Maldon", "county": "Essex", "countySlug": "essex", "townSlug": "maldon", "canonical": f"{LE}/maldon", "fn": "MaldonLoftConversionsPage", "related": loft_related("maldon", [(f"{EE}/maldon", "House extensions in Maldon"), (f"{LE}/witham", "Loft conversions in Witham")])},
]


def ext_related(pairs):
    return link(*pairs, *[( "/extensions", "House extensions overview"), ("/blog/house-extension-cost-guide", "House extension cost guide"), ("/contact", "Contact us")])


EXT_TOWNS = [
    {"kind": "ext-town", "src": "ext-london-woodford", "town": "Woodford", "county": "London", "countySlug": "london", "townSlug": "woodford", "canonical": f"{EL}/woodford", "fn": "WoodfordExtensionsPage", "related": ext_related([(EL, "House extensions in London"), (f"{EL}/wanstead", "House extensions in Wanstead"), (f"{EE}/chigwell", "House extensions in Chigwell"), (LL, "Loft conversions in London")])},
    {"kind": "ext-town", "src": "ext-london-wanstead", "town": "Wanstead", "county": "London", "countySlug": "london", "townSlug": "wanstead", "canonical": f"{EL}/wanstead", "fn": "WansteadExtensionsPage", "related": ext_related([(EL, "House extensions in London"), (f"{EL}/woodford", "House extensions in Woodford"), (f"{EL}/leytonstone", "House extensions in Leytonstone")])},
    {"kind": "ext-town", "src": "ext-london-chingford", "town": "Chingford", "county": "London", "countySlug": "london", "townSlug": "chingford", "canonical": f"{EL}/chingford", "fn": "ChingfordExtensionsPage", "related": ext_related([(EL, "House extensions in London"), (f"{EL}/walthamstow", "House extensions in Walthamstow"), (f"{EL}/enfield", "House extensions in Enfield")])},
    {"kind": "ext-town", "src": "ext-london-walthamstow", "town": "Walthamstow", "county": "London", "countySlug": "london", "townSlug": "walthamstow", "canonical": f"{EL}/walthamstow", "fn": "WalthamstowExtensionsPage", "related": ext_related([(EL, "House extensions in London"), (f"{EL}/chingford", "House extensions in Chingford"), (f"{EL}/leytonstone", "House extensions in Leytonstone")])},
    {"kind": "ext-town", "src": "ext-london-enfield", "town": "Enfield", "county": "London", "countySlug": "london", "townSlug": "enfield", "canonical": f"{EL}/enfield", "fn": "EnfieldExtensionsPage", "related": ext_related([(EL, "House extensions in London"), (f"{EL}/chingford", "House extensions in Chingford"), (f"{EL}/hornchurch", "House extensions in Hornchurch")])},
    {"kind": "ext-town", "src": "ext-essex-buckhurst-hill", "town": "Buckhurst Hill", "county": "Essex", "countySlug": "essex", "townSlug": "buckhurst-hill", "canonical": f"{EE}/buckhurst-hill", "fn": "BuckhurstHillExtensionsPage", "related": ext_related([(EE, "House extensions in Essex"), (f"{EE}/loughton", "House extensions in Loughton"), (f"{LE}/buckhurst-hill", "Loft conversions in Buckhurst Hill")])},
    {"kind": "ext-town", "src": "ext-essex-great-dunmow", "town": "Great Dunmow", "county": "Essex", "countySlug": "essex", "townSlug": "great-dunmow", "canonical": f"{EE}/great-dunmow", "fn": "GreatDunmowExtensionsPage", "related": ext_related([(EE, "House extensions in Essex"), (f"{EE}/braintree", "House extensions in Braintree"), (f"{LE}/great-dunmow", "Loft conversions in Great Dunmow")])},
    {"kind": "ext-town", "src": "ext-kent-sevenoaks", "town": "Sevenoaks", "county": "Kent", "countySlug": "kent", "townSlug": "sevenoaks", "canonical": f"{EK}/sevenoaks", "fn": "SevenoaksExtensionsPage", "related": ext_related([(EK, "House extensions in Kent"), (f"{EK}/tunbridge-wells", "House extensions in Tunbridge Wells"), (f"{LK}/sevenoaks", "Loft conversions in Sevenoaks")])},
    {"kind": "ext-town", "src": "ext-kent-tunbridge-wells", "town": "Tunbridge Wells", "county": "Kent", "countySlug": "kent", "townSlug": "tunbridge-wells", "canonical": f"{EK}/tunbridge-wells", "fn": "TunbridgeWellsExtensionsPage", "related": ext_related([(EK, "House extensions in Kent"), (f"{EK}/sevenoaks", "House extensions in Sevenoaks"), (f"{LK}/tunbridge-wells", "Loft conversions in Tunbridge Wells")])},
    {"kind": "ext-town", "src": "ext-kent-orpington", "town": "Orpington", "county": "Kent", "countySlug": "kent", "townSlug": "orpington", "canonical": f"{EK}/orpington", "fn": "OrpingtonExtensionsPage", "related": ext_related([(EK, "House extensions in Kent"), (f"{LK}/bromley", "Loft conversions in Bromley"), (EL, "House extensions in London")])},
    {"kind": "ext-town", "src": "ext-herts-bishops-stortford", "town": "Bishop's Stortford", "county": "Hertfordshire", "countySlug": "hertfordshire", "townSlug": "bishops-stortford", "canonical": f"{EH}/bishops-stortford", "fn": "BishopsStortfordExtensionsPage", "related": ext_related([(EH, "House extensions in Hertfordshire"), (f"{EH}/sawbridgeworth", "House extensions in Sawbridgeworth"), (LH, "Loft conversions in Hertfordshire")])},
    {"kind": "ext-town", "src": "ext-herts-sawbridgeworth", "town": "Sawbridgeworth", "county": "Hertfordshire", "countySlug": "hertfordshire", "townSlug": "sawbridgeworth", "canonical": f"{EH}/sawbridgeworth", "fn": "SawbridgeworthExtensionsPage", "related": ext_related([(EH, "House extensions in Hertfordshire"), (f"{EH}/bishops-stortford", "House extensions in Bishop's Stortford"), (f"{EE}/harlow", "House extensions in Harlow")])},
]

KENT_LOFT_TOWNS = [
    {"kind": "loft-town", "src": "loft-kent-sevenoaks", "town": "Sevenoaks", "county": "Kent", "countySlug": "kent", "townSlug": "sevenoaks", "canonical": f"{LK}/sevenoaks", "fn": "SevenoaksLoftConversionsPage", "related": link((LK, "Loft conversions in Kent"), (f"{EK}/sevenoaks", "House extensions in Sevenoaks"), (f"{LK}/tunbridge-wells", "Loft conversions in Tunbridge Wells"), ("/loft-conversions", "Loft conversions overview"), ("/contact", "Contact us"))},
    {"kind": "loft-town", "src": "loft-kent-bromley", "town": "Bromley", "county": "Kent", "countySlug": "kent", "townSlug": "bromley", "canonical": f"{LK}/bromley", "fn": "BromleyLoftConversionsPage", "related": link((LK, "Loft conversions in Kent"), (f"{EK}/orpington", "House extensions in Orpington"), (f"{LK}/dartford", "Loft conversions in Dartford"), ("/loft-conversions", "Loft conversions overview"), ("/contact", "Contact us"))},
    {"kind": "loft-town", "src": "loft-kent-tunbridge-wells", "town": "Tunbridge Wells", "county": "Kent", "countySlug": "kent", "townSlug": "tunbridge-wells", "canonical": f"{LK}/tunbridge-wells", "fn": "TunbridgeWellsLoftConversionsPage", "related": link((LK, "Loft conversions in Kent"), (f"{EK}/tunbridge-wells", "House extensions in Tunbridge Wells"), (f"{LK}/sevenoaks", "Loft conversions in Sevenoaks"), ("/contact", "Contact us"))},
    {"kind": "loft-town", "src": "loft-kent-maidstone", "town": "Maidstone", "county": "Kent", "countySlug": "kent", "townSlug": "maidstone", "canonical": f"{LK}/maidstone", "fn": "MaidstoneLoftConversionsPage", "related": link((LK, "Loft conversions in Kent"), (f"{LK}/tunbridge-wells", "Loft conversions in Tunbridge Wells"), ("/loft-conversions", "Loft conversions overview"), ("/contact", "Contact us"))},
    {"kind": "loft-town", "src": "loft-kent-dartford", "town": "Dartford", "county": "Kent", "countySlug": "kent", "townSlug": "dartford", "canonical": f"{LK}/dartford", "fn": "DartfordLoftConversionsPage", "related": link((LK, "Loft conversions in Kent"), (f"{LK}/gravesend", "Loft conversions in Gravesend"), (f"{LK}/bromley", "Loft conversions in Bromley"), ("/contact", "Contact us"))},
    {"kind": "loft-town", "src": "loft-kent-gravesend", "town": "Gravesend", "county": "Kent", "countySlug": "kent", "townSlug": "gravesend", "canonical": f"{LK}/gravesend", "fn": "GravesendLoftConversionsPage", "related": link((LK, "Loft conversions in Kent"), (f"{LK}/dartford", "Loft conversions in Dartford"), ("/blog/how-long-does-a-loft-conversion-take", "How long a loft conversion takes"), ("/contact", "Contact us"))},
]


def main() -> None:
    all_towns = TOWNS + EXT_TOWNS + KENT_LOFT_TOWNS
    for i, cfg in enumerate(all_towns):
        text = (SRC / f"{cfg['src']}.txt").read_text(encoding="utf-8")
        if cfg["kind"] == "loft-town":
            data = build_loft_town(cfg, text, i)
            jname = f"{cfg['townSlug']}-lofts.json" if cfg["countySlug"] != "essex" or cfg["townSlug"] not in {"epping"} else f"{cfg['townSlug']}-lofts.json"
            # unique json names: town-county-service if clash
            jpath = ROOT / "data" / "town-landings" / f"{cfg['townSlug']}-{'lofts' if cfg['kind']=='loft-town' else 'extensions'}.json"
            if cfg["kind"] == "loft-town":
                jpath = ROOT / "data" / "town-landings" / f"{cfg['townSlug']}-lofts.json"
            # kent/herts vs essex same slug: sevenoaks-lofts vs sevenoaks-extensions already different suffix
            jpath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            app = ROOT / "app" / "loft-conversions" / cfg["countySlug"] / cfg["townSlug"] / "page.tsx"
            crumbs = [
                ("Home", "/"),
                ("Loft Conversions", "/loft-conversions"),
                (cfg["county"], f"/loft-conversions/{cfg['countySlug']}"),
                (cfg["town"].replace("'", "\\'"), cfg["canonical"]),
            ]
            write_page(app, f"@/data/town-landings/{jpath.name}", cfg["fn"], "Loft conversions", crumbs)
        else:
            data = build_ext_town(cfg, text, i)
            jpath = ROOT / "data" / "town-landings" / f"{cfg['townSlug']}-extensions.json"
            jpath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            app = ROOT / "app" / "extensions" / cfg["countySlug"] / cfg["townSlug"] / "page.tsx"
            crumbs = [
                ("Home", "/"),
                ("House Extensions", "/extensions"),
                (cfg["county"], f"/extensions/{cfg['countySlug']}"),
                (cfg["town"].replace("'", "\\'"), cfg["canonical"]),
            ]
            write_page(app, f"@/data/town-landings/{jpath.name}", cfg["fn"], "House extension design and build", crumbs)
        print("TOWN", cfg["canonical"], "faqs", len(data.get("faqs", [])), "intro", len(data["intro"]["paragraphs"]))

    # hubs
    hubs = [
        {
            "kind": "loft-hub",
            "src": "hub-loft-kent",
            "county": "Kent",
            "countySlug": "kent",
            "canonical": LK,
            "fn": "KentLoftConversionsPage",
            "clusters": [
                {"name": "North and estuary", "towns": [
                    {"name": "Dartford", "slug": "kent/dartford"},
                    {"name": "Gravesend", "slug": "kent/gravesend"},
                    {"name": "Swanley", "slug": None},
                ]},
                {"name": "London fringe", "towns": [
                    {"name": "Bromley", "slug": "kent/bromley"},
                    {"name": "Orpington", "slug": None},
                    {"name": "Chislehurst", "slug": None},
                    {"name": "Beckenham", "slug": None},
                    {"name": "Bexleyheath & Sidcup", "slug": None},
                ]},
                {"name": "West and mid Kent", "towns": [
                    {"name": "Sevenoaks", "slug": "kent/sevenoaks"},
                    {"name": "Tonbridge", "slug": None},
                    {"name": "Tunbridge Wells", "slug": "kent/tunbridge-wells"},
                    {"name": "Maidstone", "slug": "kent/maidstone"},
                    {"name": "Sittingbourne", "slug": None},
                ]},
            ],
            "sideways": {"href": EK, "label": "Considering ground-floor space instead? See house extensions in Kent"},
            "related": link(("/loft-conversions", "Loft conversions overview"), (LE, "Loft conversions in Essex"), (LL, "Loft conversions in London"), (EK, "House extensions in Kent"), ("/contact", "Contact us")),
        },
        {
            "kind": "loft-hub",
            "src": "hub-loft-herts",
            "county": "Hertfordshire",
            "countySlug": "hertfordshire",
            "canonical": LH,
            "fn": "HertfordshireLoftConversionsPage",
            "clusters": [
                {"name": "East Hertfordshire", "towns": [
                    {"name": "Sawbridgeworth", "slug": None},
                    {"name": "Bishop's Stortford", "slug": None},
                    {"name": "Hertford", "slug": None},
                    {"name": "Ware", "slug": None},
                    {"name": "Hoddesdon", "slug": None},
                ]},
            ],
            "sideways": {"href": EH, "label": "Need ground-floor space instead? See house extensions in Hertfordshire"},
            "related": link(("/loft-conversions", "Loft conversions overview"), (LE, "Loft conversions in Essex"), (EH, "House extensions in Hertfordshire"), (f"{EH}/sawbridgeworth", "House extensions in Sawbridgeworth"), ("/contact", "Contact us")),
        },
        {
            "kind": "ext-hub",
            "src": "hub-ext-essex",
            "county": "Essex",
            "countySlug": "essex",
            "canonical": EE,
            "fn": "EssexHouseExtensionsPage",
            "h1": "House Extensions in Essex",
            "sideways": {"href": LE, "label": "Need a bedroom instead of a bigger kitchen? See loft conversions in Essex"},
            "towns": [
                {"name": "Basildon", "slug": "basildon"},
                {"name": "Billericay", "slug": "billericay"},
                {"name": "Braintree", "slug": "braintree"},
                {"name": "Brentwood", "slug": "brentwood"},
                {"name": "Buckhurst Hill", "slug": "buckhurst-hill"},
                {"name": "Chelmsford", "slug": "chelmsford"},
                {"name": "Chigwell", "slug": "chigwell"},
                {"name": "Colchester", "slug": "colchester"},
                {"name": "Epping", "slug": "epping"},
                {"name": "Grays", "slug": "grays"},
                {"name": "Great Dunmow", "slug": "great-dunmow"},
                {"name": "Harlow", "slug": "harlow"},
                {"name": "Leigh-on-Sea", "slug": "leigh-on-sea"},
                {"name": "Loughton", "slug": "loughton"},
                {"name": "Maldon", "slug": "maldon"},
                {"name": "Ongar", "slug": "ongar"},
                {"name": "Wickford", "slug": "wickford"},
                {"name": "Witham", "slug": "witham"},
            ],
            "related": link(("/extensions", "House extensions overview"), (EL, "House extensions in London"), (EK, "House extensions in Kent"), (LE, "Loft conversions in Essex"), ("/blog/can-you-extend-in-the-green-belt", "Can you extend in the Green Belt?"), ("/contact", "Contact us")),
        },
        {
            "kind": "ext-hub",
            "src": "hub-ext-kent",
            "county": "Kent",
            "countySlug": "kent",
            "canonical": EK,
            "fn": "KentHouseExtensionsPage",
            "h1": "House Extensions in Kent",
            "sideways": {"href": LK, "label": "Need a bedroom instead of a bigger kitchen? See loft conversions in Kent"},
            "towns": [
                {"name": "Sevenoaks", "slug": "sevenoaks"},
                {"name": "Tunbridge Wells", "slug": "tunbridge-wells"},
                {"name": "Orpington", "slug": "orpington"},
                {"name": "Dartford", "slug": None},
                {"name": "Maidstone", "slug": None},
                {"name": "Gravesend", "slug": None},
            ],
            "related": link(("/extensions", "House extensions overview"), (EE, "House extensions in Essex"), (LK, "Loft conversions in Kent"), ("/blog/extending-in-a-conservation-area", "Extending in a conservation area"), ("/contact", "Contact us")),
        },
        {
            "kind": "ext-hub",
            "src": "hub-ext-herts",
            "county": "Hertfordshire",
            "countySlug": "hertfordshire",
            "canonical": EH,
            "fn": "HertfordshireHouseExtensionsPage",
            "h1": "Builders in Hertfordshire: Extensions, Renovations, Lofts and Kitchens",
            "projectTitle": "Based in Sawbridgeworth",
            "projectText": "We are a Hertfordshire builder based in Sawbridgeworth, so this is our home county. We design and build extensions, loft conversions, kitchens and renovations across East Herts, and we are close enough to run the jobs properly.",
            "sideways": {"href": LH, "label": "Looking for a loft conversion? See loft conversions in Hertfordshire"},
            "towns": [
                {"name": "Sawbridgeworth", "slug": "sawbridgeworth"},
                {"name": "Bishop's Stortford", "slug": "bishops-stortford"},
                {"name": "Hertford", "slug": None},
                {"name": "Ware", "slug": None},
                {"name": "Hoddesdon", "slug": None},
            ],
            "related": link(("/extensions", "House extensions overview"), (LH, "Loft conversions in Hertfordshire"), (EE, "House extensions in Essex"), ("/blog/can-you-extend-in-the-green-belt", "Can you extend in the Green Belt?"), ("/contact", "Contact us")),
        },
    ]

    for i, cfg in enumerate(hubs):
        text = (SRC / f"{cfg['src']}.txt").read_text(encoding="utf-8")
        if cfg["kind"] == "loft-hub":
            data = build_loft_hub(cfg, text, i)
            jpath = ROOT / "data" / "county-hubs" / f"loft-{cfg['countySlug'] if cfg['countySlug'] != 'hertfordshire' else 'hertfordshire'}.json"
            if cfg["countySlug"] == "kent":
                jpath = ROOT / "data" / "county-hubs" / "loft-kent.json"
            else:
                jpath = ROOT / "data" / "county-hubs" / "loft-hertfordshire.json"
            jpath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            app = ROOT / "app" / "loft-conversions" / cfg["countySlug"] / "page.tsx"
            write_hub_page(
                app,
                f"@/data/county-hubs/{jpath.name}",
                cfg["fn"],
                "CountyHubLanding",
                "Loft conversions",
                cfg["county"],
                None,
                [("Home", "/"), ("Loft Conversions", "/loft-conversions"), (cfg["county"], cfg["canonical"])],
            )
        else:
            data = build_ext_hub(cfg, text, i)
            jpath = ROOT / "data" / "county-hubs" / f"extensions-{cfg['countySlug']}.json"
            jpath.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            app = ROOT / "app" / "extensions" / cfg["countySlug"] / "page.tsx"
            write_hub_page(
                app,
                f"@/data/county-hubs/{jpath.name}",
                cfg["fn"],
                "ExtensionCountyHubLanding",
                "House extensions",
                cfg["county"],
                "AdministrativeArea",
                [("Home", "/"), ("House Extensions", "/extensions"), (cfg["county"], cfg["canonical"])],
            )
        print("HUB", cfg["canonical"], "faqs", len(data.get("faqs", [])))


if __name__ == "__main__":
    main()
