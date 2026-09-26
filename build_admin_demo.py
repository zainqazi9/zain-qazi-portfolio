import re

header_path = r"D:\Desktop\zain-portfolio\demos\admin-panel\Templates\header.html"
index_path = r"D:\Desktop\zain-portfolio\demos\admin-panel\Templates\index.html"
footer_path = r"D:\Desktop\zain-portfolio\demos\admin-panel\Templates\footer.html"
out_path = r"D:\Desktop\zain-portfolio\demos\admin-panel\index.html"

with open(header_path, "r", encoding="utf-8", errors="ignore") as f:
    header = f.read()

with open(index_path, "r", encoding="utf-8", errors="ignore") as f:
    body = f.read()

with open(footer_path, "r", encoding="utf-8", errors="ignore") as f:
    footer = f.read()

# Remove {% include ... %}
body = re.sub(r"\{%\s*include\s*[^%]+%\}", "", body)
# Combine
full = header + "\n" + body + "\n" + footer

# Replace {{ url_for('static', filename='...') }} with static/...
def replace_url(match):
    fn = match.group(1)
    return "static/" + fn

full = re.sub(r"\{\{\s*url_for\(\s*['\"]static['\"]\s*,\s*filename\s*=\s*['\"]([^'\"]+)['\"]\s*\)\s*\}\}", replace_url, full)

# Also fix any root links like href="/" to href="#"
full = full.replace('href="/"', 'href="#"')
full = full.replace('href="/orders"', 'href="#"')
full = full.replace('href="/products"', 'href="#"')
full = full.replace('href="/categories"', 'href="#"')
full = full.replace('href="/customers"', 'href="#"')
full = full.replace('href="/staff"', 'href="#"')
full = full.replace('href="/stock-alerts"', 'href="#"')
full = full.replace('href="/modals"', 'href="#"')
full = full.replace('href="/blank"', 'href="#"')
full = full.replace('href="/profile"', 'href="#"')
full = full.replace('href="/settings"', 'href="#"')
full = full.replace('href="/new-order"', 'href="#"')

# Add top back to portfolio banner
top_banner = """
<div style="background:#0f4c75; color:#ffffff; padding:10px 20px; font-family:sans-serif; font-size:14px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:99999; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
    <span><strong>adminZQ</strong> &mdash; Restaurant Command Center &amp; Management Suite (Zain Qazi)</span>
    <a href="../../index.html" style="color:#ffffff; text-decoration:none; background:rgba(255,255,255,0.2); padding:5px 14px; border-radius:4px; font-weight:bold;">&larr; Back to Portfolio</a>
</div>
"""
full = full.replace("<body>", "<body>\n" + top_banner)

with open(out_path, "w", encoding="utf-8") as f:
    f.write(full)

print("Generated demos/admin-panel/index.html successfully!")
