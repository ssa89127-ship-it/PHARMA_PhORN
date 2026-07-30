import * as fs from "fs";

const forms = ["tablet", "capsule", "syrup", "cream", "injection", "drops", "inhaler", "spray", "ointment", "solution"];

const categories = [
  { key: "pain-relief", name: "Og'riq qoldiruvchi", nameRu: "Обезболивающие", nameEn: "Pain Relief" },
  { key: "antibiotics", name: "Antibiotiklar", nameRu: "Антибиотики", nameEn: "Antibiotics" },
  { key: "cardiovascular", name: "Yurak-qon tomir", nameRu: "Сердечно-сосудистые", nameEn: "Cardiovascular" },
  { key: "diabetes", name: "Qandli diabet", nameRu: "Диабет", nameEn: "Diabetes" },
  { key: "allergy", name: "Allergiyaga qarshi", nameRu: "Противоаллергические", nameEn: "Allergy" },
  { key: "digestive", name: "Ovqat hazm qilish", nameRu: "Пищеварительные", nameEn: "Digestive" },
  { key: "vitamins", name: "Vitaminlar", nameRu: "Витамины", nameEn: "Vitamins" },
  { key: "respiratory", name: "Nafas olish", nameRu: "Дыхательные", nameEn: "Respiratory" },
  { key: "hormones", name: "Gormonlar", nameRu: "Гормоны", nameEn: "Hormones" },
  { key: "nervous", name: "Asab tizimi", nameRu: "Нервная система", nameEn: "Nervous System" },
  { key: "dermatology", name: "Teri kasalliklari", nameRu: "Дерматология", nameEn: "Dermatology" },
  { key: "eye", name: "Ko'z kasalliklari", nameRu: "Глазные", nameEn: "Eye Care" },
  { key: "immune", name: "Immunitet", nameRu: "Иммунитет", nameEn: "Immune System" },
  { key: "kidney", name: "Buyrak-siydik", nameRu: "Почки и мочевыводящие", nameEn: "Kidney & Urinary" },
  { key: "blood", name: "Qon aylanishi", nameRu: "Кровь", nameEn: "Blood" },
  { key: "other", name: "Boshqa", nameRu: "Другие", nameEn: "Other" },
];

const uzMfrs = [
  "O'z Pharma", "Denov Farm", "Samarqand Farm", "Buxoro Farm", "Navoiy Farm",
  "Nukus Farm", "Andijon Farm", "Farg'ona Farm", "Qo'qon Farm", "Termiz Farm",
  "Farmalife", "Tashkent Pharm", "Artel Pharma", "Novo Pharm", "Dori-Darmon"
];

const intMfrs = [
  "Sanofi", "Novartis", "Bayer", "Pfizer", "GSK", "Berlin-Chemie",
  "Gedeon Richter", "Dr. Reddy's", "Teva", "Hexal", "Merkle", "Nycomed",
  "Boehringer", "J&J", "MSD", "AstraZeneca", "Novo Nordisk", "Abbott", "Roche", "Sandoz"
];

const allMfrs = [...uzMfrs, ...intMfrs];

const strengths = ["5mg", "10mg", "20mg", "25mg", "50mg", "100mg", "200mg", "250mg", "400mg", "500mg", "1000mg", "1%", "2.5%", "5%"];

const medicines = [];
const pharmacies = [];

// === Generate Pharmacies ===
const pharmNames = [
  "Farmalife", "Dorixona 777", "Aziza Dorixona", "Sog'lik Dorixona", "Shifo Dorixona",
  "Hayot Dorixona", "Dori-Darmon", "Farm-Market", "Vita Dorixona", "Abu Ali Ibn Sino",
  "OXYMED", "Arzon Apteka", "City Pharm", "APOTHECA", "TABLET",
  "DAVO Pharmacy", "OZON Pharmacy", "ECO MED", "ROSINKA", "03 Pharmacy",
  "999 Pharmacy", "A5 Pharmacy", "VITAMINO", "Best Pharm", "Zamin Pharm",
  "Grandpharm", "SHAFRAN", "NAVBAHOR", "VAKSINA", "Salomatlik Dorixona",
  "Nasaf Dorixona", "Samarqand Dorixona", "Buxoro Dorixona", "Zamin Dorixona"
];

const tashkentLocs = [
  { name: "Chilonzor", count: 3, lat: 41.277, lng: 69.220 },
  { name: "Yunusobod", count: 3, lat: 41.347, lng: 69.300 },
  { name: "Mirzo Ulug'bek", count: 3, lat: 41.318, lng: 69.307 },
  { name: "Mirobod", count: 2, lat: 41.295, lng: 69.277 },
  { name: "Yakkasaroy", count: 2, lat: 41.283, lng: 69.250 },
  { name: "Shayxontohur", count: 2, lat: 41.313, lng: 69.252 },
  { name: "Olmazor", count: 2, lat: 41.347, lng: 69.211 },
  { name: "Sergeli", count: 2, lat: 41.236, lng: 69.204 },
  { name: "Uchtepa", count: 2, lat: 41.305, lng: 69.164 },
  { name: "Yashnobod", count: 1, lat: 41.330, lng: 69.340 },
  { name: "Bektemir", count: 1, lat: 41.264, lng: 69.339 },
  { name: "Yangihayot", count: 1, lat: 41.249, lng: 69.153 },
];

const regionLocs = [
  { name: "Samarqand", lat: 39.627, lng: 66.975 },
  { name: "Buxoro", lat: 39.768, lng: 64.455 },
  { name: "Farg'ona", lat: 40.387, lng: 71.787 },
  { name: "Namangan", lat: 41.000, lng: 71.672 },
  { name: "Andijon", lat: 40.782, lng: 72.345 },
  { name: "Qarshi", lat: 38.830, lng: 65.790 },
  { name: "Nukus", lat: 42.468, lng: 59.608 },
  { name: "Navoiy", lat: 40.084, lng: 65.378 },
  { name: "Jizzax", lat: 40.118, lng: 67.836 },
  { name: "Termiz", lat: 37.240, lng: 67.278 },
  { name: "Urganch", lat: 41.550, lng: 60.633 },
  { name: "Guliston", lat: 40.490, lng: 68.783 },
];

const streets = [
  "Bunyodkor shoh ko'chasi", "Amir Temur shoh ko'chasi", "Mirzo Ulug'bek ko'chasi",
  "Chilonzor ko'chasi", "Yunusobod ko'chasi", "Mirobod ko'chasi",
  "Olmazor ko'chasi", "Sergeli ko'chasi", "Uchtepa ko'chasi",
  "Navoiy ko'chasi", "Babur ko'chasi", "Farg'ona yo'li",
  "G'afur G'ulom ko'chasi", "Nukus ko'chasi", "Xadra ko'chasi",
  "Shota Rustaveli ko'chasi", "Muqimiy ko'chasi", "A. Fitrat ko'chasi",
  "Istiqlol ko'chasi", "Turkiston ko'chasi",
];

const phones = [
  "+998 71 200-54-00", "+998 90 123-45-67", "+998 93 800-12-34",
  "+998 94 651-11-22", "+998 97 100-20-30", "+998 95 888-99-00",
  "+998 91 777-66-55", "+998 99 333-44-55", "+998 90 222-11-33",
  "+998 93 456-78-90", "+998 98 111-22-33", "+998 71 230-45-67",
  "+998 90 500-60-70", "+998 97 222-33-44", "+998 94 400-50-60",
];

let pharmIdx = 0;

for (const loc of tashkentLocs) {
  for (let i = 0; i < loc.count; i++) {
    const name = pharmNames[pharmIdx % pharmNames.length];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const phone = phones[Math.floor(Math.random() * phones.length)];
    const rating = parseFloat((4 + Math.random()).toFixed(1));
    pharmacies.push({
      id: "ph-" + (pharmIdx + 1),
      name: name + " Dorixona",
      slug: (name + " dorixona " + loc.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      address: street + ", " + (Math.floor(Math.random() * 120) + 1) + "-uy",
      city: "Toshkent",
      state: loc.name + " tumani",
      phone,
      lat: loc.lat + (Math.random() - 0.5) * 0.015,
      lng: loc.lng + (Math.random() - 0.5) * 0.015,
      rating: Math.min(rating, 5),
      is24h: Math.random() > 0.6,
      freeDelivery: Math.random() > 0.5,
      deliveryFee: 0,
      deliveryTime: "",
    });
    pharmIdx++;
  }
}

for (const loc of regionLocs) {
  const name = pharmNames[pharmIdx % pharmNames.length];
  const phone = phones[Math.floor(Math.random() * phones.length)];
  const rating = parseFloat((4 + Math.random()).toFixed(1));
  pharmacies.push({
    id: "ph-" + (pharmIdx + 1),
    name: name + " Dorixona",
    slug: (name + " dorixona " + loc.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    address: loc.name + " shahar, markaziy ko'cha, " + (Math.floor(Math.random() * 50) + 1) + "-uy",
    city: loc.name,
    state: loc.name + " viloyati",
    phone,
    lat: loc.lat + (Math.random() - 0.5) * 0.01,
    lng: loc.lng + (Math.random() - 0.5) * 0.01,
    rating: Math.min(rating, 5),
    is24h: Math.random() > 0.7,
    freeDelivery: Math.random() > 0.6,
    deliveryFee: 0,
    deliveryTime: "",
  });
  pharmIdx++;
}

// Set delivery fees and times
for (const ph of pharmacies) {
  ph.deliveryFee = ph.freeDelivery ? 0 : Math.floor(Math.random() * 5000) + 2000;
  ph.deliveryTime = Math.floor(Math.random() * 40) + 20 + "-" + (Math.floor(Math.random() * 30) + 45) + " min";
}

// === Generate Medicines ===
const nameGroups = [
  // Pain Relief
  { names: ["Paratsetamol", "Ibuprofen", "Diklofenak", "Ketorolak", "Naproksen", "Drotaverin",
    "Indometazin", "Piroksikam", "Meloksikam", "Ketoprofen", "Nimesulid", "Fluriprofen",
    "Lidokain", "Novokain", "Artikain", "Tramadol", "Kodein", "Pentazotsin"], cat: "pain-relief", rx: false },
  // Antibiotics
  { names: ["Amoksitsillin", "Amoksiklav", "Augmentin", "Penisillin", "Oksasillin",
    "Ampitsillin", "Sefaleksin", "Sefuroksim", "Sefotaksim", "Seftriakson",
    "Sefiksim", "Sefepim", "Sefpodoksim", "Azitromitsin", "Eritromitsin",
    "Klindamitsin", "Kliritromitsin", "Roksitromitsin", "Tetratsiklin", "Doksitsiklin",
    "Siprofloksatsin", "Levofloksatsin", "Moksifloksatsin", "Norfloksatsin", "Ofloksatsin",
    "Metranidazol", "Ornidazol", "Tinidazol", "Nitrofurantoin", "FUragin"], cat: "antibiotics", rx: true },
  // Cardiovascular
  { names: ["Amlodipin", "Lisinopril", "Kaptopril", "Enalapril", "Ramipril", "Losartan",
    "Valsartan", "Metoprolol", "Atenolol", "Propranolol", "Karvedilol", "Nebivolol",
    "Atorvastatin", "Rozuvastatin", "Simvastatin", "Pravastatin", "Digoksin", "Nitroglyserin",
    "Izosorbid", "Verapamil", "Diltiazem", "Nifedipin", "Felodipin", "Furosemid",
    "Spironolakton", "Indapamid", "Hipotiazid", "Klopidogrel", "Varfarin", "Dabigatran"], cat: "cardiovascular", rx: true },
  // Diabetes
  { names: ["Metformin", "Glipizid", "Glibenkalamid", "Glimepirid", "Gliklazid",
    "Siofor", "Diabeton", "Maninil", "Amaril", "Pioglitazon",
    "Sitagliptin", "Vildagliptin", "Saksagliptin", "Empagliflozin", "Dapagliflozin",
    "Liraglutid", "Insulin Novorapid", "Insulin Lantus", "Insulin Humalog", "Insulin Protafan"], cat: "diabetes", rx: true },
  // Allergy
  { names: ["Tsitirizin", "Loratadin", "Dezloratadin", "Feksofenadin", "Ebastin",
    "Xloropiramin", "Dimedrol", "Pipolfen", "Diazolin", "Ketotifen",
    "Kromoglikat", "Nedokromil", "Montelukast", "Zafirlukast", "Prednizolon",
    "Deksametazon", "Betametazon", "Gidrokortizon", "Flutikazon", "Beklometazon"], cat: "allergy", rx: false },
  // Digestive
  { names: ["Omeprazol", "Pantoprazol", "Lansoprazol", "Esomeprazol", "Rabeprazol",
    "Ranitidin", "Famotidin", "Simetidin", "Domperidon", "Metoklopramid",
    "Loperamid", "Smekta", "Enterosgel", "Linex", "Bifidumbakterin",
    "Laktobakterin", "Pankreatin", "Kreon", "Festal", "Mezim",
    "Allohol", "Xolenzim", "Ursodeoksixolat", "Gepabene", "Karsil"], cat: "digestive", rx: false },
  // Vitamins
  { names: ["Vitamin C", "Vitamin D3", "Vitamin E", "Vitamin A", "Vitamin B1",
    "Vitamin B6", "Vitamin B12", "Folat kislota", "Niasin", "Riboflavin",
    "Biotin", "Pantotenat", "Kalsiy+D3", "Magniy B6", "Temir preparati",
    "Rux preparati", "Selen preparati", "Yodomarin", "Vitrum", "Complivit",
    "Supradin", "Alphabet", "Duovit", "Osteokear", "Askorbinka"], cat: "vitamins", rx: false },
  // Respiratory
  { names: ["Ambroksol", "Asetilsistein", "Bromgeksin", "Karbotsistein", "Butamirat",
    "Prenoksdiazin", "Levodropropizin", "Salbutamol", "Fenoterol", "Ipratropiy",
    "Formoterol", "Salmeterol", "Budesonid", "Flutikazon", "Mometazon",
    "Teofillin", "Aminofillin", "Montelukast", "Zafirlukast", "Kromoglikat"], cat: "respiratory", rx: false },
  // Hormones
  { names: ["Tiroksin", "Levotiroksin", "Merkazolil", "Propitsil", "Estradiol",
    "Progesteron", "Testosteron", "Danazol", "Bromokriptin", "Oksitotsin",
    "Glukagon", "Kalsitonin", "Somatotropin", "Gonadotropin", "Klomifen"], cat: "hormones", rx: true },
  // Nervous system
  { names: ["Diazepam", "Klonazepam", "Lorazepam", "Fenobarbital", "Karbamazepin",
    "Valproat", "Lamotrigin", "Levetiratsetam", "Fenitoin", "Gabapentin",
    "Pregabalin", "Amitriptilin", "Fluoksetin", "Paroksetin", "Sertralin",
    "Sitalopram", "Venlafaksin", "Mirtazapin", "Xlarpromazin", "Risperidon"], cat: "nervous", rx: true },
  // Dermatology
  { names: ["Klotrimazol", "Mikonazol", "Terbinafin", "Flukonazol", "Atsiklovir",
    "Benzoil peroksid", "Izotretinoin", "Adapalen", "Tretinoin", "Mometazon",
    "Pimekrolimus", "Tacrolimus", "Salitsil kislota", "Mochevina", "Sink oksidi",
    "Panthenol", "D-Panthenol", "Levomekol", "Actovegin", "Solcoseryl"], cat: "dermatology", rx: false },
  // Eye
  { names: ["Tropikamid", "Siklopentolat", "Atropin", "Timolol", "Dorzolamid",
    "Latanoprost", "Travoprost", "Brimonidin", "Ofloksatsin", "Moksifloksatsin",
    "Tobramitsin", "Ketotifen", "Olopatadin", "Nafazolin", "Oksimetazolin"], cat: "eye", rx: false },
  // Immune
  { names: ["Interferon", "Sikloferon", "Kagotsel", "Arbidol", "Ingavirin",
    "Anaferon", "Oscillococcinum", "Imudon", "Bronomunal", "Ribomunil",
    "Lizobakt", "Echinatsiya", "Immunal", "Timogen", "Timalin"], cat: "immune", rx: false },
  // Kidney
  { names: ["Tsiston", "Fitolit", "Urolesan", "FUragin", "Kanefron",
    "Sulgin", "Ftalazol", "Biseptol", "Furadonin", "Palin"], cat: "kidney", rx: true },
  // Blood
  { names: ["Rivaroksaban", "Apiksaban", "Xeparin", "Enoksiparin", "Kurantil",
    "Trental", "Pentoksifilin", "Dipiridamol", "Streptokinaza", "Urokinaza"], cat: "blood", rx: true },
  // Other
  { names: ["Allopurinol", "Aktifast", "Supraks", "Fenistil", "Zodak",
    "Erius", "Dezal", "Aqualor", "Morenazal", "Pinosol",
    "Tizin", "Vizin", "Otrivin", "Nazol", "Snoop"], cat: "other", rx: false },
];

let medIdx = 0;

for (const group of nameGroups) {
  for (const name of group.names) {
    for (let variant = 0; variant < 3; variant++) {
      const mfr = allMfrs[Math.floor(Math.random() * allMfrs.length)];
      const form = forms[Math.floor(Math.random() * forms.length)];
      const strength = strengths[Math.floor(Math.random() * strengths.length)];
      const basePrice = Math.floor(Math.random() * 55000) + 3000;
      const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 25) + 5 : 0;
      const rx = group.rx || Math.random() > 0.7;
      const cat = categories.find(c => c.key === group.cat);
      
      medicines.push({
        id: "med-" + (medIdx + 1),
        name: name + " " + strength + (variant > 0 ? " #" + (variant + 1) : ""),
        slug: (name + " " + strength + " " + mfr).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        genericName: name,
        description: (cat ? cat.name : "Dori") + " uchun preparat. " + mfr + " tomonidan ishlab chiqarilgan.",
        image: "/images/medicine-" + ((medIdx % 10) + 1) + ".svg",
        manufacturer: mfr,
        category: cat ? cat.name : "Boshqa",
        dosage: strength,
        form: form,
        strength: strength,
        prescriptionRequired: rx,
        unitPrice: basePrice,
        basePrice: discount > 0 ? basePrice + Math.floor(basePrice * discount / 100) : basePrice,
        discountedPrice: discount > 0 ? basePrice : undefined,
        discount: discount > 0 ? discount : undefined,
        stockQuantity: Math.floor(Math.random() * 500) + 10,
        isAvailable: true,
        requiresPrescription: rx,
        sideEffects: ["Ko'ngil aynish", "Bosh og'rig'i", "Allergik reaksiya"],
        alternatives: [],
        createdAt: "2024-01-01",
        updatedAt: "2024-11-01",
      });
      medIdx++;
    }
  }
}

// === Generate Medicine Prices ===
const medicinePrices = {};
const priceKeys = medicines.slice(0, Math.min(medicines.length, 300)).map(m => m.id);

for (const medId of priceKeys) {
  const prices = [];
  const numPharms = Math.floor(Math.random() * 6) + 2;
  const usedPharmIds = new Set();
  
  for (let j = 0; j < numPharms && j < pharmacies.length; j++) {
    let pIdx;
    do {
      pIdx = Math.floor(Math.random() * pharmacies.length);
    } while (usedPharmIds.has(pIdx));
    usedPharmIds.add(pIdx);
    
    const pharm = pharmacies[pIdx];
    // Find the base price from the medicine
    const med = medicines.find(m => m.id === medId);
    const priceBase = med ? med.unitPrice : 5000;
    const variation = Math.floor(Math.random() * 10000) - 3000;
    const finalPrice = Math.max(priceBase + variation, 2000);
    const origPrice = finalPrice + Math.floor(finalPrice * (Math.floor(Math.random() * 20) + 5) / 100);
    
    prices.push({
      pharmacyId: pharm.id,
      pharmacyName: pharm.name,
      pharmacyLogo: "/images/pharmacy-" + ((pIdx % 5) + 1) + ".svg",
      pharmacyRating: pharm.rating,
      price: finalPrice,
      originalPrice: Math.random() > 0.3 ? origPrice : undefined,
      discount: Math.random() > 0.3 ? Math.floor((1 - finalPrice / origPrice) * 100) : undefined,
      deliveryFee: pharm.deliveryFee,
      deliveryTime: pharm.deliveryTime,
      isAvailable: true,
      stockQuantity: Math.floor(Math.random() * 200) + 5,
      distance: parseFloat((Math.random() * 5 + 0.3).toFixed(1)),
    });
  }
  medicinePrices[medId] = prices;
}

// === Write Output ===
const output = {
  generatedPharmacies: pharmacies,
  generatedMedicines: medicines,
  generatedMedicinePrices: medicinePrices,
};

fs.writeFileSync("src/lib/generated-data.json", JSON.stringify(output, null, 2), "utf-8");
console.log("Done! Generated:");
console.log("  - " + pharmacies.length + " pharmacies");
console.log("  - " + medicines.length + " medicines");
console.log("  - " + Object.keys(medicinePrices).length + " medicine price records");
console.log("Written to src/lib/generated-data.json");
