#!/usr/bin/env python3
"""Generate unique medicine box SVG images for all 43 categories."""
import os

# Category -> (primary_color, secondary_color, accent_color)
CAT_COLORS = {
    "Og'riq qoldiruvchi": ("#E53935", "#FFCDD2", "#B71C1C"),
    "Antibiotiklar": ("#1565C0", "#BBDEFB", "#0D47A1"),
    "Yurak-qon tomir": ("#C62828", "#FFCDD2", "#880E4F"),
    "Ovqat hazm qilish": ("#2E7D32", "#C8E6C9", "#1B5E20"),
    "Vitaminlar": ("#F9A825", "#FFF9C4", "#F57F17"),
    "Nafas olish": ("#00897B", "#B2DFDB", "#004D40"),
    "Qandli diabet": ("#AD1457", "#F8BBD0", "#880E4F"),
    "Allergiyaga qarshi": ("#7B1FA2", "#E1BEE7", "#4A148C"),
    "Asab tizimi": ("#5C6BC0", "#C5CAE9", "#283593"),
    "Teri kasalliklari": ("#FF8F00", "#FFE0B2", "#E65100"),
    "Ko'z dorilari": ("#0277BD", "#B3E5FC", "#01579B"),
    "Gormonlar": ("#00695C", "#B2DFDB", "#004D40"),
    "Immunitet": ("#283593", "#C5CAE9", "#1A237E"),
    "Ginekologiya": ("#AD1457", "#F8BBD0", "#880E4F"),
    "Stomatologiya": ("#6D4C41", "#D7CCC8", "#3E2723"),
    "Urologiya": ("#01579B", "#B3E5FC", "#0D47A1"),
    "Qon topish": ("#B71C1C", "#FFCDD2", "#880E4F"),
    "Revmatologiya": ("#E65100", "#FFE0B2", "#BF360C"),
    "Endokrinologiya": ("#4A148C", "#E1BEE7", "#311B92"),
    "Gastroenterologiya": ("#1B5E20", "#C8E6C9", "#004D40"),
    "Nevrologiya": ("#311B92", "#D1C4E9", "#1A237E"),
    "Psixiatriya": ("#4527A0", "#D1C4E9", "#311B92"),
    "Allergologiya": ("#6A1B9A", "#E1BEE7", "#4A148C"),
    "Immunologiya": ("#1A237E", "#C5CAE9", "#0D47A1"),
    "Onkologiya": ("#880E4F", "#F8BBD0", "#4A148C"),
    "Onkologiya-kimyo": ("#B71C1C", "#FFCDD2", "#880E4F"),
    "Bolalar": ("#FF6F00", "#FFE0B2", "#E65100"),
    "Bolalar salomatligi": ("#FF8F00", "#FFF3E0", "#E65100"),
    "Sport tibbiyoti": ("#1B5E20", "#C8E6C9", "#004D40"),
    "Kosmetologiya": ("#E91E63", "#F8BBD0", "#C2185B"),
    "Gigiena": ("#0097A7", "#B2EBF2", "#006064"),
    "Tibbiy buyumlar": ("#546E7A", "#CFD8DC", "#37474F"),
    "O'simlik preparatlari": ("#33691E", "#DCEDC8", "#1B5E20"),
    "Uy sharoitida davolash": ("#795548", "#D7CCC8", "#4E342E"),
    "Ayollar salomatligi": ("#C2185B", "#F8BBD0", "#880E4F"),
    "Keksalik salomatlik": ("#78909C", "#ECEFF1", "#455A64"),
    "Hayvonlar uchun": ("#827717", "#F0F4C3", "#33691E"),
    "Parfyumeriya": ("#FF6F00", "#FFF3E0", "#E65100"),
    "Tish og'riq": ("#D84315", "#FFCCBC", "#BF360C"),
    "Oshqozon": ("#558B2F", "#DCEDC8", "#33691E"),
    "Qon bosimi": ("#1565C0", "#BBDEFB", "#0D47A1"),
    "Nafas yo'llari": ("#00897B", "#B2DFDB", "#004D40"),
}

# Form icons as SVG path data
FORM_PATHS = {
    "Tabletka": "M4 8h16v8H4z M6 8l2-4h8l2 4 M6 16l2 4h8l2-4",
    "Kapsula": "M12 2C8 2 4 6 4 10s4 8 8 8 8-4 8-8S16 2 12 2z",
    "Sirop": "M8 2v4l-2 2v10c0 2 2 4 6 4s6-2 6-4V8l-2-2V2z",
    "In'eksiya": "M12 2v16 M8 6h8 M8 10h8 M8 14h8",
    "Gel": "M4 4h16v16H4z M8 8h8v8H8z",
    "Krem": "M4 4h16v16H4z M6 6h12v4H6z",
    "Sprey": "M12 2v8 M8 10h8v10H8z M10 2h4v4h-4z",
    "Suppozitoriya": "M12 2c-3 0-6 3-6 8s3 10 6 10 6-5 6-10S15 2 12 2z",
    "Rastvor": "M8 2v6l-3 3v7c0 2 2 4 7 4s7-2 7-4v-7l-3-3V2z",
    "Suspenziya": "M8 2v6l-3 3v7c0 2 2 4 7 4s7-2 7-4v-7l-3-3V2z",
    "Kapli": "M12 2L6 10v8c0 4 3 6 6 6s6-2 6-6v-8L12 2z",
    "Tabletkalar": "M4 8h16v8H4z M6 8l2-4h8l2 4 M6 16l2 4h8l2-4",
    "Tabletka choy": "M6 2h12v4H6z M8 6v14h8V6z",
    "Jel": "M4 4h16v16H4z M8 8h8v8H8z",
    "Inhalyator": "M12 2v8 M8 10h8v10H8z M10 2h4v4h-4z",
    "Ingalyator": "M12 2v8 M8 10h8v10H8z M10 2h4v4h-4z",
    "Shaybo": "M6 2h12v4H6z M8 6v14h8V6z",
    "Losyon": "M8 2v6l-3 3v7c0 2 2 4 7 4s7-2 7-4v-7l-3-3V2z",
    "Poroshok": "M4 4h16v16H4z M8 8h8v8H8z",
    "Foam": "M4 4h16v16H4z M8 8h8v8H8z",
}

def generate_svg(category, colors):
    """Generate a medicine box SVG for a category."""
    primary, secondary, accent = colors
    
    # Truncate category name for display
    cat_display = category[:14] if len(category) > 14 else category
    
    # Get form icon path
    form_path = "M4 8h16v8H4z M6 8l2-4h8l2 4 M6 16l2 4h8l2-4"  # default tablet
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{secondary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="box" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:{primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{accent};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="200" height="200" fill="url(#bg)" rx="12"/>
  
  <!-- Medicine Box -->
  <g filter="url(#shadow)">
    <rect x="50" y="30" width="100" height="130" rx="8" fill="url(#box)"/>
    <rect x="50" y="30" width="100" height="35" rx="8" fill="{primary}" opacity="0.9"/>
    <rect x="50" y="55" width="100" height="10" fill="{primary}"/>
    <rect x="50" y="30" width="8" height="130" rx="4" fill="white" opacity="0.2"/>
  </g>
  
  <!-- Cross symbol -->
  <g transform="translate(100, 50)">
    <rect x="-15" y="-3" width="30" height="6" rx="3" fill="white" opacity="0.9"/>
    <rect x="-3" y="-15" width="6" height="30" rx="3" fill="white" opacity="0.9"/>
  </g>
  
  <!-- Category name -->
  <text x="100" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white">{cat_display}</text>
  
  <!-- Bottom label -->
  <rect x="55" y="135" width="90" height="18" rx="9" fill="white" opacity="0.95"/>
  <text x="100" y="148" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="{primary}">PHARMA</text>
  
  <!-- Decorative dots -->
  <circle cx="70" cy="165" r="3" fill="{primary}" opacity="0.3"/>
  <circle cx="100" cy="165" r="3" fill="{primary}" opacity="0.3"/>
  <circle cx="130" cy="165" r="3" fill="{primary}" opacity="0.3"/>
</svg>'''
    return svg


def main():
    output_dir = 'public/images/medicines/categories'
    os.makedirs(output_dir, exist_ok=True)
    
    generated = 0
    for category, colors in CAT_COLORS.items():
        # Create filename from category
        filename = category.lower()
        filename = filename.replace("'", "").replace("'", "")
        filename = filename.replace(" ", "-")
        filename = filename.replace("ı", "i").replace("ö", "o").replace("ü", "u")
        filename = filename.replace("ğ", "g").replace("ş", "s").replace("ç", "c")
        
        svg = generate_svg(category, colors)
        filepath = os.path.join(output_dir, f'{filename}.svg')
        
        with open(filepath, 'w') as f:
            f.write(svg)
        
        generated += 1
        print(f'Generated: {filename}.svg')
    
    print(f'\nTotal: {generated} category SVGs generated')


if __name__ == '__main__':
    main()
