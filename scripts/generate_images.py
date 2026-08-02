#!/usr/bin/env python3
"""Generate doctor SVG avatars and medicine form images."""
import os

# ─── Doctor SVG Avatars ──────────────────────────────────────────────────────
DOCTORS = [
    {
        "id": "doc-1",
        "name": "Dr. Akbar Karimov",
        "specialty": "Terapevt",
        "color1": "#3b82f6", "color2": "#1d4ed8",
        "bg": "#dbeafe",
        "hair_color": "#1a1a2e",
        "skin": "#e8b89d",
        "stethoscope": True,
        "gender": "male",
    },
    {
        "id": "doc-2",
        "name": "Dr. Lola Rahmonova",
        "specialty": "Kardiolog",
        "color1": "#ec4899", "color2": "#be185d",
        "bg": "#fce7f3",
        "hair_color": "#1a1a2e",
        "skin": "#f0c8a0",
        "stethoscope": True,
        "gender": "female",
    },
    {
        "id": "doc-3",
        "name": "Dr. Jasur Tursunov",
        "specialty": "Pediatr",
        "color1": "#10b981", "color2": "#047857",
        "bg": "#d1fae5",
        "hair_color": "#2d1b00",
        "skin": "#c68642",
        "stethoscope": True,
        "gender": "male",
    },
    {
        "id": "doc-4",
        "name": "Dr. Nigora Azizova",
        "specialty": "Dermatolog",
        "color1": "#8b5cf6", "color2": "#6d28d9",
        "bg": "#ede9fe",
        "hair_color": "#1a1a2e",
        "skin": "#f5d0b0",
        "stethoscope": False,
        "gender": "female",
    },
    {
        "id": "doc-5",
        "name": "Dr. Bobur Hamidov",
        "specialty": "Nevrolog",
        "color1": "#f59e0b", "color2": "#d97706",
        "bg": "#fef3c7",
        "hair_color": "#1a1a2e",
        "skin": "#deb887",
        "stethoscope": True,
        "gender": "male",
    },
    {
        "id": "doc-6",
        "name": "Dr. Gulnora Salimova",
        "specialty": "Ortoped-Travmatolog",
        "color1": "#ef4444", "color2": "#dc2626",
        "bg": "#fee2e2",
        "hair_color": "#1a1a2e",
        "skin": "#e8b89d",
        "stethoscope": False,
        "gender": "female",
    },
]

def gen_doctor_svg(doc):
    d = doc
    is_f = d["gender"] == "female"
    
    # Hair style differences
    hair_female = f'''
        <ellipse cx="100" cy="62" rx="38" ry="40" fill="{d['hair_color']}" />
        <path d="M62 62 C62 40, 138 40, 138 62 L138 100 C138 100, 142 80, 130 75 L130 100" fill="{d['hair_color']}" />
        <path d="M62 62 C62 40, 100 25, 138 62" fill="{d['hair_color']}" />'''
    
    hair_male = f'''
        <ellipse cx="100" cy="65" rx="36" ry="32" fill="{d['hair_color']}" />
        <path d="M64 65 C64 45, 136 45, 136 65" fill="{d['hair_color']}" />'''
    
    hair = hair_female if is_f else hair_male
    
    # Face
    face = f'''
        <ellipse cx="100" cy="95" rx="30" ry="34" fill="{d['skin']}" />'''
    
    # Eyes
    eyes = f'''
        <ellipse cx="88" cy="90" rx="3.5" ry="4" fill="#1a1a2e" />
        <ellipse cx="112" cy="90" rx="3.5" ry="4" fill="#1a1a2e" />
        <circle cx="89.5" cy="89" r="1" fill="white" />
        <circle cx="113.5" cy="89" r="1" fill="white" />'''
    
    # Eyebrows
    brows = f'''
        <path d="M82 83 Q88 80 94 83" stroke="{d['hair_color']}" stroke-width="1.5" fill="none" />
        <path d="M106 83 Q112 80 118 83" stroke="{d['hair_color']}" stroke-width="1.5" fill="none" />'''
    
    # Smile
    smile = f'''
        <path d="M90 103 Q100 112 110 103" stroke="#c0392b" stroke-width="1.5" fill="none" />'''
    
    # Nose
    nose = f'''
        <path d="M100 93 L97 99 Q100 101 103 99 Z" fill="#c0a080" opacity="0.5" />'''
    
    # Body/coat
    body = f'''
        <path d="M65 130 Q65 115, 100 110 Q135 115, 135 130 L135 200 L65 200 Z" fill="white" />
        <path d="M65 130 Q65 115, 100 110 Q135 115, 135 130 L135 200 L65 200 Z" stroke="{d['color1']}" stroke-width="1.5" fill="none" />'''
    
    # Collar
    collar = f'''
        <path d="M85 115 L100 130 L115 115" stroke="{d['color1']}" stroke-width="2" fill="none" />'''
    
    # Name badge
    badge = f'''
        <rect x="75" y="145" width="50" height="16" rx="3" fill="{d['color1']}" />
        <text x="100" y="157" text-anchor="middle" fill="white" font-size="7" font-family="Arial, sans-serif" font-weight="bold">{d['specialty'][:12]}</text>'''
    
    # Stethoscope
    steth = ""
    if d["stethoscope"]:
        steth = f'''
        <path d="M88 118 Q85 140 90 155 Q95 165 100 160" stroke="#555" stroke-width="2" fill="none" />
        <circle cx="100" cy="162" r="4" fill="#555" />
        <circle cx="100" cy="162" r="2" fill="#888" />'''
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bg_{d['id']}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{d['color1']}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="{d['color2']}" stop-opacity="0.25" />
    </linearGradient>
    <linearGradient id="coat_{d['id']}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{d['color1']}" />
      <stop offset="100%" stop-color="{d['color2']}" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#bg_{d['id']})" />
  <circle cx="100" cy="100" r="85" fill="white" stroke="{d['color1']}" stroke-width="1" opacity="0.6" />
  {hair}
  {face}
  {brows}
  {eyes}
  {nose}
  {smile}
  {body}
  {collar}
  {badge}
  {steth}
</svg>'''
    return svg

# ─── Medicine Form Images (PNG-like SVGs) ───────────────────────────────────
def gen_medicine_svg(filename, form_type, color1, color2):
    """Generate a clean medicine product image."""
    forms = {
        "tablet": f'''
  <rect x="55" y="70" width="90" height="60" rx="30" fill="{color1}" />
  <rect x="55" y="70" width="90" height="30" rx="30" fill="{color2}" opacity="0.3" />
  <line x1="100" y1="70" x2="100" y2="130" stroke="white" stroke-width="0.5" opacity="0.4" />
  <text x="100" y="105" text-anchor="middle" fill="white" font-size="11" font-family="Arial" font-weight="bold">500mg</text>''',
        
        "capsule": f'''
  <rect x="50" y="65" width="100" height="70" rx="35" fill="{color1}" />
  <rect x="50" y="65" width="50" height="70" rx="35" fill="{color2}" />
  <line x1="100" y1="65" x2="100" y2="135" stroke="white" stroke-width="0.5" opacity="0.3" />
  <ellipse cx="75" cy="100" rx="3" ry="2" fill="white" opacity="0.3" />
  <ellipse cx="125" cy="100" rx="3" ry="2" fill="white" opacity="0.3" />''',
        
        "syrup": f'''
  <rect x="70" y="45" width="60" height="110" rx="5" fill="{color1}" opacity="0.2" />
  <rect x="70" y="45" width="60" height="110" rx="5" stroke="{color1}" stroke-width="2" fill="none" />
  <rect x="75" y="90" width="50" height="60" fill="{color1}" opacity="0.5" />
  <rect x="85" y="35" width="30" height="15" rx="3" fill="{color2}" />
  <text x="100" y="75" text-anchor="middle" fill="{color1}" font-size="10" font-family="Arial" font-weight="bold">SIROP</text>
  <rect x="90" y="125" width="20" height="25" rx="2" fill="#ccc" />''',
        
        "gel": f'''
  <rect x="65" y="40" width="70" height="120" rx="10" fill="{color1}" opacity="0.15" />
  <rect x="65" y="40" width="70" height="120" rx="10" stroke="{color1}" stroke-width="2" fill="none" />
  <rect x="65" y="40" width="70" height="35" rx="10" fill="{color2}" />
  <circle cx="100" cy="57" r="8" fill="white" opacity="0.3" />
  <text x="100" y="95" text-anchor="middle" fill="{color1}" font-size="10" font-family="Arial" font-weight="bold">GEL</text>''',
        
        "spray": f'''
  <rect x="80" y="50" width="40" height="100" rx="5" fill="{color1}" opacity="0.2" />
  <rect x="80" y="50" width="40" height="100" rx="5" stroke="{color1}" stroke-width="2" fill="none" />
  <rect x="88" y="30" width="24" height="25" rx="3" fill="{color2}" />
  <rect x="95" y="18" width="10" height="15" rx="2" fill="{color1}" />
  <text x="100" y="90" text-anchor="middle" fill="{color1}" font-size="9" font-family="Arial" font-weight="bold">SPREY</text>''',
        
        "injection": f'''
  <rect x="95" y="25" width="10" height="110" rx="2" fill="#ddd" />
  <rect x="95" y="25" width="10" height="40" rx="2" fill="{color1}" opacity="0.3" />
  <rect x="85" y="25" width="30" height="15" rx="3" fill="{color2}" />
  <rect x="97" y="135" width="6" height="20" rx="1" fill="#999" />
  <text x="100" y="80" text-anchor="middle" fill="{color1}" font-size="7" font-family="Arial" font-weight="bold">INJ</text>''',
        
        "drops": f'''
  <rect x="75" y="55" width="50" height="90" rx="8" fill="{color1}" opacity="0.2" />
  <rect x="75" y="55" width="50" height="90" rx="8" stroke="{color1}" stroke-width="2" fill="none" />
  <rect x="82" y="45" width="36" height="15" rx="4" fill="{color2}" />
  <rect x="95" y="38" width="10" height="10" rx="5" fill="{color1}" />
  <text x="100" y="90" text-anchor="middle" fill="{color1}" font-size="9" font-family="Arial" font-weight="bold">DAMLA</text>''',
    }
    
    form_map = {
        "paracetamol.jpg": "tablet",
        "capsule.jpg": "capsule",
        "syrup.jpg": "syrup",
        "gel.jpg": "gel",
        "spray.jpg": "spray",
        "injection.jpg": "injection",
        "inhaler.jpg": "spray",
        "suppository.jpg": "tablet",
    }
    
    ftype = form_map.get(filename, form_type)
    svg_content = forms.get(ftype, forms["tablet"])
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad_{filename.replace('.','_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{color1}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="{color2}" stop-opacity="0.15" />
    </linearGradient>
    <filter id="shadow_{filename.replace('.','_')}">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15" />
    </filter>
  </defs>
  <rect width="200" height="200" fill="url(#grad_{filename.replace('.','_')})" rx="16" />
  <g filter="url(#shadow_{filename.replace('.','_')})">
  {svg_content}
  </g>
</svg>'''
    return svg


if __name__ == "__main__":
    os.makedirs("public/images", exist_ok=True)
    
    # Generate doctor SVGs
    for doc in DOCTORS:
        svg = gen_doctor_svg(doc)
        path = f"public/images/{doc['id']}.svg"
        with open(path, "w") as f:
            f.write(svg)
        print(f"Generated: {path}")
    
    # Generate medicine form images
    med_images = {
        "paracetamol.jpg": ("tablet", "#2563eb", "#1e40af"),
        "capsule.jpg": ("capsule", "#dc2626", "#991b1b"),
        "syrup.jpg": ("syrup", "#059669", "#047857"),
        "gel.jpg": ("gel", "#7c3aed", "#5b21b6"),
        "spray.jpg": ("spray", "#ea580c", "#c2410c"),
        "injection.jpg": ("injection", "#0891b2", "#0e7490"),
        "inhaler.jpg": ("spray", "#2563eb", "#1e40af"),
        "suppository.jpg": ("tablet", "#be185d", "#9d174d"),
    }
    
    os.makedirs("public/images/medicines", exist_ok=True)
    for fname, (ftype, c1, c2) in med_images.items():
        svg = gen_medicine_svg(fname, ftype, c1, c2)
        path = f"public/images/medicines/{fname}"
        with open(path, "w") as f:
            f.write(svg)
        print(f"Generated: {path}")
    
    print("\nDone!")
