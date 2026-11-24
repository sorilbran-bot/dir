#!/usr/bin/env python3
"""Timestamp Detroit Innovation Record files with OpenTimestamps.

  python scripts/timestamp.py stamp    # stamp any record file whose exact contents haven't been stamped yet
  python scripts/timestamp.py upgrade  # finish pending proofs once Bitcoin has confirmed them

For every version of a record, this keeps a stamped copy and its proof:
  public/proofs/DIR-2026-0001/<first 12 characters of the fingerprint>.md      (the exact bytes that were stamped)
  public/proofs/DIR-2026-0001/<first 12 characters of the fingerprint>.md.ots  (the OpenTimestamps proof)
and lists every version in public/proofs/index.json, which the record pages read.
Older versions are never deleted, so the full history of every record stays checkable.
"""
import datetime
import hashlib
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
RECORDS = ROOT / "src" / "content" / "records"
PROOFS = ROOT / "public" / "proofs"
MANIFEST = PROOFS / "index.json"


def load():
    return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}


def save(m):
    PROOFS.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(m, indent=2, sort_keys=True) + "\n")


def now():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def stamp():
    m = load()
    stamped = 0
    for f in sorted(RECORDS.glob("*.md")):
        data = f.read_bytes()
        if re.search(rb"^example:\s*true\s*$", data, re.M):
            continue  # fictional preview records are never stamped
        rid = f.stem
        sha = hashlib.sha256(data).hexdigest()
        versions = m.setdefault(rid, [])
        if any(v["sha256"] == sha for v in versions):
            continue  # this exact version is already stamped
        d = PROOFS / rid
        d.mkdir(parents=True, exist_ok=True)
        copy = d / f"{sha[:12]}.md"
        copy.write_bytes(data)
        r = subprocess.run(["ots", "stamp", str(copy)], capture_output=True, text=True)
        if r.returncode != 0 or not copy.with_name(copy.name + ".ots").exists():
            print(f"!! could not stamp {rid}: {r.stderr.strip()}", file=sys.stderr)
            copy.unlink(missing_ok=True)
            if not any(d.iterdir()):
                d.rmdir()
            continue
        versions.append({
            "sha256": sha,
            "file": f"/proofs/{rid}/{copy.name}",
            "proof": f"/proofs/{rid}/{copy.name}.ots",
            "stamped": now(),
            "status": "pending",
        })
        stamped += 1
        print(f"stamped {rid} {sha[:12]}")
    save(m)
    print(f"{stamped} new version(s) stamped")


def upgrade():
    m = load()
    done = 0
    for rid, versions in m.items():
        for v in versions:
            if v["status"] != "pending":
                continue
            ots = ROOT / "public" / v["proof"].lstrip("/")
            if not ots.exists():
                continue
            subprocess.run(["ots", "upgrade", str(ots)], capture_output=True, text=True)
            info = subprocess.run(["ots", "info", str(ots)], capture_output=True, text=True).stdout
            block = re.search(r"BitcoinBlockHeaderAttestation\((\d+)\)", info)
            if block:
                v["status"] = "anchored"
                v["bitcoin_block"] = int(block.group(1))
                v["anchored_checked"] = now()
                done += 1
                print(f"anchored {rid} {v['sha256'][:12]} in block {block.group(1)}")
            # remove the backup file ots leaves behind after an upgrade
            bak = ots.with_name(ots.name + ".bak")
            bak.unlink(missing_ok=True)
    save(m)
    print(f"{done} proof(s) anchored in Bitcoin")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    {"stamp": stamp, "upgrade": upgrade}.get(cmd, lambda: sys.exit(__doc__))()
