#!/usr/bin/env python3
"""Update medicine images to use category-specific SVGs."""
import json
import os

# Category -> filename mapping
CATEGORY_TO_IMAGE = {
    "Og'riq qoldiruvchi": "/images/medicines/categories/ogriq-qoldiruvchi.svg",
    "Antibiotiklar": "/images/medicines/categories/antibiotiklar.svg",
    "Yurak-qon tomir": "/images/medicines/categories/yurak-qon-tomir.svg",
    "Ovqat hazm qilish": "/images/medicines/categories/ovqat-hazm-qilish.svg",
    "Vitaminlar": "/images/medicines/categories/vitaminlar.svg",
    "Nafas olish": "/images/medicines/categories/nafas-olish.svg",
    "Qandli diabet": "/images/medicines/categories/qandli-diabet.svg",
    "Allergiyaga qarshi": "/images/medicines/categories/allergiyaga-qarshi.svg",
    "Asab tizimi": "/images/medicines/categories/asab-tizimi.svg",
    "Teri kasalliklari": "/images/medicines/categories/teri-kasalliklari.svg",
    "Ko'z dorilari": "/images/medicines/categories/koz-dorilari.svg",
    "Gormonlar": "/images/medicines/categories/gormonlar.svg",
    "Immunitet": "/images/medicines/categories/immunitet.svg",
    "Ginekologiya": "/images/medicines/categories/ginekologiya.svg",
    "Stomatologiya": "/images/medicines/categories/stomatologiya.svg",
    "Urologiya": "/images/medicines/categories/urologiya.svg",
    "Qon topish": "/images/medicines/categories/qon-topish.svg",
    "Revmatologiya": "/images/medicines/categories/revmatologiya.svg",
    "Endokrinologiya": "/images/medicines/categories/endokrinologiya.svg",
    "Gastroenterologiya": "/images/medicines/categories/gastroenterologiya.svg",
    "Nevrologiya": "/images/medicines/categories/nevrologiya.svg",
    "Psixiatriya": "/images/medicines/categories/psixiatriya.svg",
    "Allergologiya": "/images/medicines/categories/allergologiya.svg",
    "Immunologiya": "/images/medicines/categories/immunologiya.svg",
    "Onkologiya": "/images/medicines/categories/onkologiya.svg",
    "Onkologiya-kimyo": "/images/medicines/categories/onkologiya-kimyo.svg",
    "Bolalar": "/images/medicines/categories/bolalar.svg",
    "Bolalar salomatligi": "/images/medicines/categories/bolalar-salomatligi.svg",
    "Sport tibbiyoti": "/images/medicines/categories/sport-tibbiyoti.svg",
    "Kosmetologiya": "/images/medicines/categories/kosmetologiya.svg",
    "Gigiena": "/images/medicines/categories/gigiena.svg",
    "Tibbiy buyumlar": "/images/medicines/categories/tibbiy-buyumlar.svg",
    "O'simlik preparatlari": "/images/medicines/categories/osimlik-preparatlari.svg",
    "Uy sharoitida davolash": "/images/medicines/categories/uy-sharoitida-davolash.svg",
    "Ayollar salomatligi": "/images/medicines/categories/ayollar-salomatligi.svg",
    "Keksalik salomatlik": "/images/medicines/categories/keksalik-salomatlik.svg",
    "Hayvonlar uchun": "/images/medicines/categories/hayvonlar-uchun.svg",
    "Parfyumeriya": "/images/medicines/categories/parfyumeriya.svg",
    "Tish og'riq": "/images/medicines/categories/tish-ogriq.svg",
    "Oshqozon": "/images/medicines/categories/oshqozon.svg",
    "Qon bosimi": "/images/medicines/categories/qon-bosimi.svg",
    "Nafas yo'llari": "/images/medicines/categories/nafas-yollari.svg",
    "Ortopediya": "/images/medicines/categories/ortopediya.svg",
    "Otolaringologiya": "/images/medicines/categories/otolaringologiya.svg",
}

if __name__ == "__main__":
    with open('src/lib/generated-data.json') as f:
        data = json.load(f)
    
    updated = 0
    for med in data['generatedMedicines']:
        category = med['category']
        if category in CATEGORY_TO_IMAGE:
            med['image'] = CATEGORY_TO_IMAGE[category]
            updated += 1
    
    with open('src/lib/generated-data.json', 'w') as f:
        json.dump(data, f, ensure_ascii=False)
    
    print(f"Updated {updated} medicines with category images")
    
    # Show distribution
    images = {}
    for med in data['generatedMedicines']:
        img = med['image']
        images[img] = images.get(img, 0) + 1
    
    print(f"\nUnique images: {len(images)}")
    print("Top 10:")
    for img, count in sorted(images.items(), key=lambda x: -x[1])[:10]:
        print(f"  {img}: {count} medicines")
