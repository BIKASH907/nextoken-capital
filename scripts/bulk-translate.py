#!/usr/bin/env python3
"""
Bulk machine-translates the English source dictionary to every supported language.

Strategy: flatten to a list of strings, batch-translate the list in one call
per language (deep-translator supports translate_batch), then reassemble.

Reads:   public/locales/en/common.json
Writes:  public/locales/<lang>/common.json
"""
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("deep-translator not installed. Run: pip3 install deep-translator --break-system-packages")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "locales" / "en" / "common.json"

LANGS = [
    "de","fr","es","it","pt","nl","pl","cs","ro","el","hu","bg","hr",
    "sk","sl","lt","lv","et","fi","sv","da","mt","ga","ar","zh","ja",
    "ko","hi","ne","th","vi","ms","id","tr","ru","uk","he","sw","af",
    "bn","ur","fa","fil",
]

GOOGLE_CODE = {"zh": "zh-CN", "fil": "tl", "he": "iw"}

PLACEHOLDER_RE = re.compile(r"\{\{[^}]+\}\}")
SKIP_LITERALS = {"EUR 100", "0.2%", "ERC-3643", "Polygon", "MetaMask",
                 "WalletConnect", "Sumsub", "Monerium", "NXT", "NEXTOKEN",
                 "CAPITAL", "© {{year}} Nextoken Capital UAB. All rights reserved.",
                 "Nextoken Capital UAB", "MiCA-ready architecture"}


def flatten(obj, path=()):
    """Yield (path_tuple, string) for every string leaf."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from flatten(v, path + (k,))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from flatten(v, path + (i,))
    elif isinstance(obj, str):
        yield path, obj


def set_path(obj, path, value):
    for k in path[:-1]:
        obj = obj[k]
    obj[path[-1]] = value


def protect(text):
    holders = []
    def sub(m):
        holders.append(m.group(0))
        return f"<x{len(holders)-1}/>"
    return PLACEHOLDER_RE.sub(sub, text), holders


def restore(text, holders):
    for i, h in enumerate(holders):
        for variant in (f"<x{i}/>", f"< x{i}/>", f"<x{i} />", f"<x {i}/>", f"< x{i} />"):
            text = text.replace(variant, h)
    return text


def main():
    src = json.loads(SRC.read_text(encoding="utf-8"))
    flat = list(flatten(src))
    raw_strings = [s for _, s in flat]
    print(f"Source has {len(flat)} string leaves")

    for lang in LANGS:
        out_dir = ROOT / "public" / "locales" / lang
        out_path = out_dir / "common.json"
        out_dir.mkdir(parents=True, exist_ok=True)
        if out_path.exists():
            print(f"[skip] {lang}")
            continue

        google_lang = GOOGLE_CODE.get(lang, lang)
        t0 = time.time()
        try:
            translator = GoogleTranslator(source="en", target=google_lang)
        except Exception as e:
            print(f"[err]  {lang}: init: {e}")
            continue

        # Pre-protect placeholders, mark literals to leave alone.
        protected = []
        holders_list = []
        for s in raw_strings:
            if s in SKIP_LITERALS or not s.strip():
                protected.append(None)
                holders_list.append([])
            else:
                p, h = protect(s)
                protected.append(p)
                holders_list.append(h)

        # Send only non-None strings as a batch.
        to_send_indices = [i for i, p in enumerate(protected) if p is not None]
        to_send = [protected[i] for i in to_send_indices]
        try:
            translated_batch = translator.translate_batch(to_send)
        except Exception as e:
            print(f"[err]  {lang}: batch: {e}")
            continue

        if not translated_batch or len(translated_batch) != len(to_send):
            print(f"[err]  {lang}: batch size mismatch ({len(translated_batch) if translated_batch else 0}/{len(to_send)})")
            continue

        # Reassemble
        final = [None] * len(raw_strings)
        for j, idx in enumerate(to_send_indices):
            t = translated_batch[j]
            if not t:
                final[idx] = raw_strings[idx]
            else:
                final[idx] = restore(t, holders_list[idx])
        for i, s in enumerate(raw_strings):
            if final[i] is None:
                final[i] = s

        # Write back into nested structure.
        out_obj = json.loads(json.dumps(src))  # deep clone
        for (path, _), value in zip(flat, final):
            set_path(out_obj, path, value)

        out_path.write_text(json.dumps(out_obj, ensure_ascii=False, indent=2) + "\n",
                            encoding="utf-8")
        print(f"[ok]   {lang} ({time.time()-t0:.1f}s)")


if __name__ == "__main__":
    main()
