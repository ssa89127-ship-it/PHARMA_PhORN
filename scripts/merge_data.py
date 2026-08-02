#!/usr/bin/env python3
"""Merge generated medicines into generated-data.json, preserving existing pharmacies."""
import json
import sys
sys.path.insert(0, '.')
from generate_medicines import generate_medicines

with open('src/lib/generated-data.json') as f:
    data = json.load(f)

medicines, prices = generate_medicines()
data['generatedMedicines'] = medicines
data['generatedMedicinePrices'] = prices

with open('src/lib/generated-data.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated: {len(medicines)} medicines, {len(prices)} price entries")
print(f"Pharmacies preserved: {len(data['generatedPharmacies'])}")
