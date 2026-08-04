# -*- coding: utf-8 -*-
"""SINGLE SOURCE OF TRUTH for the Hands-On AI Science book domain.

Usage:  python set_book_domain.py <domain>      e.g. apartsin.com  |  icsgen-ai.org

Rewrites every <book>.<olddomain> reference to <book>.<newdomain> across the homepage
site and all 12 book repos (HTML, JS, JSON, XML, sitemaps, generator scripts, docs),
sets each repo's CNAME custom-domain file, and stamps _meta/book-domain.txt.
Idempotent and targeted (only the 12 known book subdomains are touched). Records the
exact files changed per repo so git staging stays precise.
"""
import io, re, os, sys, subprocess, json

if len(sys.argv) != 2 or "." not in sys.argv[1]:
    print("usage: set_book_domain.py <domain>  (e.g. apartsin.com | icsgen-ai.org)"); sys.exit(1)
NEW = sys.argv[1].strip().lower()

BOOKS_ROOT = r"E:\Projects\Books"
HOMEPAGE   = r"E:\Projects\HomePage\onesite"

FOLDER_SELF = {
    "LangaugeAI":"llmbook","VisionAI":"visionbook","ScalableAI":"scalablebook",
    "TemporalAI":"temporalbook","EmbodiedAI":"embodiedbook","DiscoveryAI":"discoverybook",
    "NeuromorphicAI":"neuromorphicbook","SensorAI":"sensorbook","QuantumAI":"quantumbook",
    "AgenticAI":"agenticbook","TabularAI":"tabularbook","AudioAI":"audiobook",
}
SUBS = list(FOLDER_SELF.values())
# match <sub>.<olddomain> for either known domain, not part of a longer token
PAT = re.compile(r'(?<![A-Za-z0-9._-])(' + "|".join(SUBS) + r')\.(?:apartsin\.com|icsgen-ai\.org)')
REPL = lambda m: "%s.%s" % (m.group(1), NEW)

BOOK_EXTS = (".html",".xml",".txt",".json",".md",".py",".toml",".yml",".yaml",".js")
HOME_EXTS = (".html",".js",".json",".md")
SKIP = ("vendor/","pagefind/","node_modules/",".git/")   # keep KDP so rebuilt epubs match

def tracked(repo, exts):
    out = subprocess.run(["git","-C",repo,"ls-files"], capture_output=True, text=True).stdout
    for f in out.splitlines():
        if f.endswith(exts) and not any(f.startswith(s) or ("/"+s) in f for s in SKIP):
            yield f

def sweep(repo, exts):
    changed=[]
    for rel in tracked(repo, exts):
        p=os.path.join(repo, rel)
        try: s=io.open(p, encoding="utf-8").read()
        except Exception: continue
        new,n = PAT.subn(REPL, s)
        if n:
            io.open(p,"w",encoding="utf-8",newline="").write(new); changed.append(rel)
    return changed

result={}
for folder, sub in FOLDER_SELF.items():
    repo=os.path.join(BOOKS_ROOT, folder)
    ch=sweep(repo, BOOK_EXTS)
    cn=os.path.join(repo,"CNAME")
    if os.path.exists(cn):
        cur=io.open(cn,encoding="utf-8").read().strip()
        want="%s.%s"%(sub,NEW)
        if cur!=want:
            io.open(cn,"w",encoding="utf-8",newline="").write(want+"\n"); ch.append("CNAME")
    result[repo]=ch
    print("%-14s %d files"%(folder,len(ch)))

ch=sweep(HOMEPAGE, HOME_EXTS)
# stamp the marker (single-source record of the active domain)
marker=os.path.join(HOMEPAGE,"_meta","book-domain.txt")
io.open(marker,"w",encoding="utf-8",newline="").write(NEW+"\n")
ch.append("_meta/book-domain.txt")
result[HOMEPAGE]=ch
print("homepage       %d files"%len(ch))

json.dump(result, io.open(r"E:\tmp\claude\domain_changed.json","w",encoding="utf-8"))
print("\nactive book domain -> %s   (changed lists written)"%NEW)
