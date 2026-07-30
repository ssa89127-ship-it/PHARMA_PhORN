import fs from "fs";

const data = JSON.parse(fs.readFileSync("src/lib/generated-data.json", "utf-8"));
const meds = data.generatedMedicines;

// Realistic medicine data for Uzbekistan
const realMeds = [
  // Pain Relief
  { n: "Paratsetamol 500mg tabletka", g: "Paratsetamol", m: "O'z Pharma", c: "Og'riq qoldiruvchi", f: "tablet", p: 3000, rx: false },
  { n: "Paratsetamol 200mg tabletka", g: "Paratsetamol", m: "Denov Farm", c: "Og'riq qoldiruvchi", f: "tablet", p: 2500, rx: false },
  { n: "Paratsetamol sirop 100ml", g: "Paratsetamol", m: "Samarqand Farm", c: "Og'riq qoldiruvchi", f: "syrup", p: 12000, rx: false },
  { n: "Ibuprofen 400mg tabletka", g: "Ibuprofen", m: "Farmalife", c: "Og'riq qoldiruvchi", f: "tablet", p: 8000, rx: false },
  { n: "Ibuprofen 200mg tabletka", g: "Ibuprofen", m: "Buxoro Farm", c: "Og'riq qoldiruvchi", f: "tablet", p: 5000, rx: false },
  { n: "Ibuprofen sirop 100ml", g: "Ibuprofen", m: "Novo Pharm", c: "Og'riq qoldiruvchi", f: "syrup", p: 15000, rx: false },
  { n: "Diklofenak 50mg tabletka", g: "Diklofenak", m: "Artel Pharma", c: "Og'riq qoldiruvchi", f: "tablet", p: 5000, rx: true },
  { n: "Diklofenak gel 5% 30g", g: "Diklofenak", m: "Tashkent Pharm", c: "Og'riq qoldiruvchi", f: "cream", p: 18000, rx: false },
  { n: "Diklofenak 75mg inyeksiya", g: "Diklofenak", m: "Farmalife", c: "Og'riq qoldiruvchi", f: "injection", p: 8000, rx: true },
  { n: "Meloksikam 15mg tabletka", g: "Meloksikam", m: "Novo Pharm", c: "Og'riq qoldiruvchi", f: "tablet", p: 12000, rx: true },
  { n: "Analgin 500mg tabletka", g: "Metamizol natriy", m: "O'z Pharma", c: "Og'riq qoldiruvchi", f: "tablet", p: 3000, rx: false },
  { n: "Analgin 50% inyeksiya 2ml", g: "Metamizol natriy", m: "Denov Farm", c: "Og'riq qoldiruvchi", f: "injection", p: 5000, rx: true },
  { n: "Spazmalgon tabletka", g: "Metamizol natriy", m: "Samarqand Farm", c: "Og'riq qoldiruvchi", f: "tablet", p: 6000, rx: false },
  { n: "No-shpa 40mg tabletka", g: "Drotaverin", m: "Sanofi", c: "Og'riq qoldiruvchi", f: "tablet", p: 15000, rx: false },
  { n: "Drotaverin 40mg tabletka", g: "Drotaverin", m: "Buxoro Farm", c: "Og'riq qoldiruvchi", f: "tablet", p: 5000, rx: false },
  { n: "Ketorol 10mg tabletka", g: "Ketorolak", m: "Dr. Reddy's", c: "Og'riq qoldiruvchi", f: "tablet", p: 18000, rx: true },
  { n: "Ketorol 30mg inyeksiya", g: "Ketorolak", m: "Dr. Reddy's", c: "Og'riq qoldiruvchi", f: "injection", p: 22000, rx: true },
  { n: "Nimesulid 100mg tabletka", g: "Nimesulid", m: "Novartis", c: "Og'riq qoldiruvchi", f: "tablet", p: 10000, rx: false },
  { n: "Nise gel 20g", g: "Nimesulid", m: "Dr. Reddy's", c: "Og'riq qoldiruvchi", f: "cream", p: 28000, rx: false },
  { n: "Aspirin 500mg tabletka", g: "Asetilsalitsil kislota", m: "Bayer", c: "Og'riq qoldiruvchi", f: "tablet", p: 5000, rx: false },
  { n: "Pentalgin tabletka", g: "Kombinatsiya", m: "Pharmstandard", c: "Og'riq qoldiruvchi", f: "tablet", p: 10000, rx: false },
  { n: "Tempalgin tabletka", g: "Metamizol+trankvilizator", m: "Sopharma", c: "Og'riq qoldiruvchi", f: "tablet", p: 8000, rx: false },
  { n: "Ketonal 100mg inyeksiya", g: "Ketoprofen", m: "Lek", c: "Og'riq qoldiruvchi", f: "injection", p: 15000, rx: true },
  { n: "Fastum gel 30g", g: "Ketoprofen", m: "Berlin-Chemie", c: "Og'riq qoldiruvchi", f: "cream", p: 40000, rx: false },
  { n: "Indometazin 25mg tabletka", g: "Indometazin", m: "Navoiy Farm", c: "Og'riq qoldiruvchi", f: "tablet", p: 5000, rx: true },
  { n: "Piroksikam 20mg kapsula", g: "Piroksikam", m: "Farmalife", c: "Og'riq qoldiruvchi", f: "capsule", p: 8000, rx: true },
  { n: "Movalis 15mg inyeksiya", g: "Meloksikam", m: "Boehringer", c: "Og'riq qoldiruvchi", f: "injection", p: 35000, rx: true },
  { n: "Celebrex 200mg kapsula", g: "Selekoksib", m: "Pfizer", c: "Og'riq qoldiruvchi", f: "capsule", p: 50000, rx: true },
  { n: "Arcoxia 90mg tabletka", g: "Etarikoksib", m: "MSD", c: "Og'riq qoldiruvchi", f: "tablet", p: 55000, rx: true },

  // Antibiotics
  { n: "Amoksitsillin 500mg kapsula", g: "Amoksitsillin", m: "O'z Pharma", c: "Antibiotiklar", f: "capsule", p: 8000, rx: true },
  { n: "Amoksitsillin 250mg kapsula", g: "Amoksitsillin", m: "Denov Farm", c: "Antibiotiklar", f: "capsule", p: 5000, rx: true },
  { n: "Amoksitsillin sirop 100ml", g: "Amoksitsillin", m: "Samarqand Farm", c: "Antibiotiklar", f: "syrup", p: 15000, rx: true },
  { n: "Amoksiklav 625mg tabletka", g: "Amoksitsillin+klavulanat", m: "Lek", c: "Antibiotiklar", f: "tablet", p: 25000, rx: true },
  { n: "Amoksiklav sirop 100ml", g: "Amoksitsillin+klavulanat", m: "Lek", c: "Antibiotiklar", f: "syrup", p: 30000, rx: true },
  { n: "Sefaleksin 500mg kapsula", g: "Sefaleksin", m: "Farmalife", c: "Antibiotiklar", f: "capsule", p: 12000, rx: true },
  { n: "Seftriakson 1g poroshok", g: "Seftriakson", m: "Novo Pharm", c: "Antibiotiklar", f: "injection", p: 15000, rx: true },
  { n: "Sefuroksim 500mg tabletka", g: "Sefuroksim", m: "GSK", c: "Antibiotiklar", f: "tablet", p: 35000, rx: true },
  { n: "Sefiksim 400mg kapsula", g: "Sefiksim", m: "Tashkent Pharm", c: "Antibiotiklar", f: "capsule", p: 28000, rx: true },
  { n: "Sefepim 1g poroshok", g: "Sefepim", m: "Bristol", c: "Antibiotiklar", f: "injection", p: 30000, rx: true },
  { n: "Azitromitsin 500mg kapsula", g: "Azitromitsin", m: "Sanofi", c: "Antibiotiklar", f: "capsule", p: 18000, rx: true },
  { n: "Azitromitsin 250mg kapsula", g: "Azitromitsin", m: "Denov Farm", c: "Antibiotiklar", f: "capsule", p: 12000, rx: true },
  { n: "Azitromitsin sirop 100ml", g: "Azitromitsin", m: "Pliva", c: "Antibiotiklar", f: "syrup", p: 25000, rx: true },
  { n: "Eritromitsin 500mg tabletka", g: "Eritromitsin", m: "Farmalife", c: "Antibiotiklar", f: "tablet", p: 8000, rx: true },
  { n: "Klindamitsin 300mg kapsula", g: "Klindamitsin", m: "Pfizer", c: "Antibiotiklar", f: "capsule", p: 22000, rx: true },
  { n: "Klindamitsin 600mg inyeksiya", g: "Klindamitsin", m: "Pfizer", c: "Antibiotiklar", f: "injection", p: 28000, rx: true },
  { n: "Doksitsiklin 100mg kapsula", g: "Doksitsiklin", m: "Novo Pharm", c: "Antibiotiklar", f: "capsule", p: 10000, rx: true },
  { n: "Tetratsiklin 250mg tabletka", g: "Tetratsiklin", m: "O'z Pharma", c: "Antibiotiklar", f: "tablet", p: 4000, rx: true },
  { n: "Siprofloksatsin 500mg tabletka", g: "Siprofloksatsin", m: "Artel Pharma", c: "Antibiotiklar", f: "tablet", p: 8000, rx: true },
  { n: "Siprofloksatsin 200mg inyeksiya", g: "Siprofloksatsin", m: "Bayer", c: "Antibiotiklar", f: "injection", p: 15000, rx: true },
  { n: "Levofloksatsin 500mg tabletka", g: "Levofloksatsin", m: "Sanofi", c: "Antibiotiklar", f: "tablet", p: 18000, rx: true },
  { n: "Moksifloksatsin 400mg tabletka", g: "Moksifloksatsin", m: "Bayer", c: "Antibiotiklar", f: "tablet", p: 45000, rx: true },
  { n: "Ofloksatsin 200mg tabletka", g: "Ofloksatsin", m: "Denov Farm", c: "Antibiotiklar", f: "tablet", p: 7000, rx: true },
  { n: "Biseptol 480mg tabletka", g: "Kotrimoksazol", m: "Polpharma", c: "Antibiotiklar", f: "tablet", p: 8000, rx: true },
  { n: "Biseptol sirop 100ml", g: "Kotrimoksazol", m: "Medana", c: "Antibiotiklar", f: "syrup", p: 15000, rx: true },
  { n: "Metronidazol 250mg tabletka", g: "Metronidazol", m: "O'z Pharma", c: "Antibiotiklar", f: "tablet", p: 4000, rx: true },
  { n: "Metronidazol 100ml infuziya", g: "Metronidazol", m: "Farmalife", c: "Antibiotiklar", f: "solution", p: 8000, rx: true },
  { n: "Nitrofurantoin 100mg tabletka", g: "Nitrofurantoin", m: "Farmalife", c: "Antibiotiklar", f: "tablet", p: 6000, rx: true },
  { n: "FUragin 50mg tabletka", g: "FUragin", m: "Ozon", c: "Antibiotiklar", f: "tablet", p: 8000, rx: true },

  // Cardiovascular
  { n: "Amlodipin 5mg tabletka", g: "Amlodipin", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Amlodipin 10mg tabletka", g: "Amlodipin", m: "Novo Pharm", c: "Yurak-qon tomir", f: "tablet", p: 10000, rx: true },
  { n: "Lisinopril 10mg tabletka", g: "Lisinopril", m: "Artel Pharma", c: "Yurak-qon tomir", f: "tablet", p: 10000, rx: true },
  { n: "Lisinopril 5mg tabletka", g: "Lisinopril", m: "Denov Farm", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Kaptopril 25mg tabletka", g: "Kaptopril", m: "O'z Pharma", c: "Yurak-qon tomir", f: "tablet", p: 5000, rx: true },
  { n: "Enalapril 10mg tabletka", g: "Enalapril", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 6000, rx: true },
  { n: "Enalapril 20mg tabletka", g: "Enalapril", m: "Samarqand Farm", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Ramipril 5mg tabletka", g: "Ramipril", m: "Sanofi", c: "Yurak-qon tomir", f: "tablet", p: 18000, rx: true },
  { n: "Losartan 50mg tabletka", g: "Losartan", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 12000, rx: true },
  { n: "Losartan 25mg tabletka", g: "Losartan", m: "Novartis", c: "Yurak-qon tomir", f: "tablet", p: 10000, rx: true },
  { n: "Valsartan 80mg tabletka", g: "Valsartan", m: "Novartis", c: "Yurak-qon tomir", f: "tablet", p: 22000, rx: true },
  { n: "Metoprolol 50mg tabletka", g: "Metoprolol", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Atenolol 50mg tabletka", g: "Atenolol", m: "O'z Pharma", c: "Yurak-qon tomir", f: "tablet", p: 5000, rx: true },
  { n: "Nebivolol 5mg tabletka", g: "Nebivolol", m: "Berlin-Chemie", c: "Yurak-qon tomir", f: "tablet", p: 25000, rx: true },
  { n: "Atorvastatin 20mg tabletka", g: "Atorvastatin", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 15000, rx: true },
  { n: "Atorvastatin 10mg tabletka", g: "Atorvastatin", m: "Denov Farm", c: "Yurak-qon tomir", f: "tablet", p: 10000, rx: true },
  { n: "Rozuvastatin 10mg tabletka", g: "Rozuvastatin", m: "AstraZeneca", c: "Yurak-qon tomir", f: "tablet", p: 30000, rx: true },
  { n: "Simvastatin 20mg tabletka", g: "Simvastatin", m: "Novo Pharm", c: "Yurak-qon tomir", f: "tablet", p: 12000, rx: true },
  { n: "Digoksin 0.25mg tabletka", g: "Digoksin", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 5000, rx: true },
  { n: "Nitroglyserin 0.5mg tabletka", g: "Nitroglyserin", m: "Samarqand Farm", c: "Yurak-qon tomir", f: "tablet", p: 4000, rx: true },
  { n: "Izosorbid 20mg tabletka", g: "Izosorbid dinitrat", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Verapamil 40mg tabletka", g: "Verapamil", m: "O'z Pharma", c: "Yurak-qon tomir", f: "tablet", p: 6000, rx: true },
  { n: "Nifedipin 10mg tabletka", g: "Nifedipin", m: "Bayer", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Furosemid 40mg tabletka", g: "Furosemid", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 4000, rx: true },
  { n: "Furosemid 20mg inyeksiya", g: "Furosemid", m: "Novo Pharm", c: "Yurak-qon tomir", f: "injection", p: 6000, rx: true },
  { n: "Spironolakton 25mg tabletka", g: "Spironolakton", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 6000, rx: true },
  { n: "Veroshpiron 25mg tabletka", g: "Spironolakton", m: "Gedeon Richter", c: "Yurak-qon tomir", f: "tablet", p: 15000, rx: true },
  { n: "Indapamid 2.5mg tabletka", g: "Indapamid", m: "Servier", c: "Yurak-qon tomir", f: "tablet", p: 12000, rx: true },
  { n: "Klopidogrel 75mg tabletka", g: "Klopidogrel", m: "Sanofi", c: "Yurak-qon tomir", f: "tablet", p: 25000, rx: true },
  { n: "Kardiomagnil 75mg tabletka", g: "Asetilsalitsil kislota", m: "Nycomed", c: "Yurak-qon tomir", f: "tablet", p: 18000, rx: false },
  { n: "Trombo ASS 100mg tabletka", g: "Asetilsalitsil kislota", m: "Lanna Pharma", c: "Yurak-qon tomir", f: "tablet", p: 10000, rx: false },
  { n: "Varfarin 5mg tabletka", g: "Varfarin", m: "Farmalife", c: "Yurak-qon tomir", f: "tablet", p: 8000, rx: true },
  { n: "Kurantil 25mg tabletka", g: "Dipiridamol", m: "Berlin-Chemie", c: "Yurak-qon tomir", f: "tablet", p: 15000, rx: true },
];

const moreCats = [
  // Diabetes
  { n: "Metformin 500mg tabletka", g: "Metformin", m: "Farmalife", c: "Qandli diabet", f: "tablet", p: 8000, rx: true },
  { n: "Metformin 850mg tabletka", g: "Metformin", m: "Denov Farm", c: "Qandli diabet", f: "tablet", p: 10000, rx: true },
  { n: "Metformin 1000mg tabletka", g: "Metformin", m: "Samarqand Farm", c: "Qandli diabet", f: "tablet", p: 12000, rx: true },
  { n: "Glipizid 5mg tabletka", g: "Glipizid", m: "Farmalife", c: "Qandli diabet", f: "tablet", p: 10000, rx: true },
  { n: "Glibenkalamid 5mg tabletka", g: "Glibenkalamid", m: "O'z Pharma", c: "Qandli diabet", f: "tablet", p: 5000, rx: true },
  { n: "Glimepirid 2mg tabletka", g: "Glimepirid", m: "Sanofi", c: "Qandli diabet", f: "tablet", p: 15000, rx: true },
  { n: "Gliklazid 60mg tabletka", g: "Gliklazid", m: "Servier", c: "Qandli diabet", f: "tablet", p: 20000, rx: true },
  { n: "Diabeton 60mg tabletka", g: "Gliklazid", m: "Servier", c: "Qandli diabet", f: "tablet", p: 25000, rx: true },
  { n: "Siofor 500mg tabletka", g: "Metformin", m: "Berlin-Chemie", c: "Qandli diabet", f: "tablet", p: 18000, rx: true },
  { n: "Maninil 5mg tabletka", g: "Glibenkalamid", m: "Farmalife", c: "Qandli diabet", f: "tablet", p: 12000, rx: true },
  { n: "Insulin Novorapid 100ED/ml", g: "Insulin aspart", m: "Novo Nordisk", c: "Qandli diabet", f: "injection", p: 85000, rx: true },
  { n: "Insulin Lantus 100ED/ml", g: "Insulin glargin", m: "Sanofi", c: "Qandli diabet", f: "injection", p: 95000, rx: true },
  { n: "Insulin Humalog 100ED/ml", g: "Insulin lizpro", m: "Lilly", c: "Qandli diabet", f: "injection", p: 90000, rx: true },
  { n: "Insulin Protafan 100ED/ml", g: "Insulin izofan", m: "Novo Nordisk", c: "Qandli diabet", f: "injection", p: 70000, rx: true },
  { n: "Insulin Aktrapid 100ED/ml", g: "Insulin solishtirma", m: "Novo Nordisk", c: "Qandli diabet", f: "injection", p: 65000, rx: true },
  { n: "Insulin Detemir 100ED/ml", g: "Insulin detemir", m: "Novo Nordisk", c: "Qandli diabet", f: "injection", p: 100000, rx: true },

  // Allergy
  { n: "Loratadin 10mg tabletka", g: "Loratadin", m: "Farmalife", c: "Allergiyaga qarshi", f: "tablet", p: 5000, rx: false },
  { n: "Loratadin sirop 100ml", g: "Loratadin", m: "Denov Farm", c: "Allergiyaga qarshi", f: "syrup", p: 12000, rx: false },
  { n: "Tsitirizin 10mg tabletka", g: "Tsitirizin", m: "O'z Pharma", c: "Allergiyaga qarshi", f: "tablet", p: 5000, rx: false },
  { n: "Tsitirizin tomchi 20ml", g: "Tsitirizin", m: "Samarqand Farm", c: "Allergiyaga qarshi", f: "drops", p: 15000, rx: false },
  { n: "Zodak 10mg tabletka", g: "Tsitirizin", m: "Farmalife", c: "Allergiyaga qarshi", f: "tablet", p: 12000, rx: false },
  { n: "Erius 5mg tabletka", g: "Dezloratadin", m: "Schering-Plough", c: "Allergiyaga qarshi", f: "tablet", p: 25000, rx: false },
  { n: "Feksofenadin 120mg tabletka", g: "Feksofenadin", m: "Sanofi", c: "Allergiyaga qarshi", f: "tablet", p: 18000, rx: false },
  { n: "Suprastin 25mg tabletka", g: "Xloropiramin", m: "Farmalife", c: "Allergiyaga qarshi", f: "tablet", p: 6000, rx: false },
  { n: "Dimedrol 50mg tabletka", g: "Difengidramin", m: "O'z Pharma", c: "Allergiyaga qarshi", f: "tablet", p: 3000, rx: false },
  { n: "Ketotifen 1mg tabletka", g: "Ketotifen", m: "Farmalife", c: "Allergiyaga qarshi", f: "tablet", p: 8000, rx: false },
  { n: "Fenistil tomchi 20ml", g: "Dimetinden", m: "Novartis", c: "Allergiyaga qarshi", f: "drops", p: 28000, rx: false },
  { n: "Fenistil gel 30g", g: "Dimetinden", m: "Novartis", c: "Allergiyaga qarshi", f: "cream", p: 25000, rx: false },
  { n: "Dezal 5mg tabletka", g: "Dezloratadin", m: "Farmalife", c: "Allergiyaga qarshi", f: "tablet", p: 15000, rx: false },

  // Digestive
  { n: "Omeprazol 20mg kapsula", g: "Omeprazol", m: "Farmalife", c: "Ovqat hazm qilish", f: "capsule", p: 8000, rx: false },
  { n: "Omeprazol 40mg kapsula", g: "Omeprazol", m: "Denov Farm", c: "Ovqat hazm qilish", f: "capsule", p: 12000, rx: false },
  { n: "Pantoprazol 40mg tabletka", g: "Pantoprazol", m: "Nycomed", c: "Ovqat hazm qilish", f: "tablet", p: 18000, rx: false },
  { n: "Esomeprazol 20mg kapsula", g: "Esomeprazol", m: "AstraZeneca", c: "Ovqat hazm qilish", f: "capsule", p: 25000, rx: false },
  { n: "Ranitidin 150mg tabletka", g: "Ranitidin", m: "O'z Pharma", c: "Ovqat hazm qilish", f: "tablet", p: 5000, rx: false },
  { n: "Famotidin 20mg tabletka", g: "Famotidin", m: "Farmalife", c: "Ovqat hazm qilish", f: "tablet", p: 6000, rx: false },
  { n: "Almagel suspensiya 170ml", g: "Almagel", m: "Balkan Pharma", c: "Ovqat hazm qilish", f: "syrup", p: 20000, rx: false },
  { n: "Fosfalugel 16g paket", g: "Fosfatlyugel", m: "Farmalife", c: "Ovqat hazm qilish", f: "syrup", p: 25000, rx: false },
  { n: "Maaloks suspensiya 250ml", g: "Maaloks", m: "Sanofi", c: "Ovqat hazm qilish", f: "syrup", p: 28000, rx: false },
  { n: "Domperidon 10mg tabletka", g: "Domperidon", m: "Farmalife", c: "Ovqat hazm qilish", f: "tablet", p: 8000, rx: false },
  { n: "Metoklopramid 10mg tabletka", g: "Metoklopramid", m: "O'z Pharma", c: "Ovqat hazm qilish", f: "tablet", p: 4000, rx: true },
  { n: "Loperamid 2mg kapsula", g: "Loperamid", m: "Farmalife", c: "Ovqat hazm qilish", f: "capsule", p: 5000, rx: false },
  { n: "Smekta 3g paket", g: "Dioktaedrik smektit", m: "Farmalife", c: "Ovqat hazm qilish", f: "powder", p: 6000, rx: false },
  { n: "Enterosgel 225g", g: "Polimetilsiloksan", m: "Farmalife", c: "Ovqat hazm qilish", f: "syrup", p: 30000, rx: false },
  { n: "Linex kapsula", g: "Probiotik", m: "Sandoz", c: "Ovqat hazm qilish", f: "capsule", p: 22000, rx: false },
  { n: "Linux kapsula", g: "Laktobakterin", m: "Samarqand Farm", c: "Ovqat hazm qilish", f: "capsule", p: 15000, rx: false },
  { n: "Pankreatin 25ED tabletka", g: "Pankreatin", m: "Farmalife", c: "Ovqat hazm qilish", f: "tablet", p: 6000, rx: false },
  { n: "Kreon 10000 kapsula", g: "Pankreatin", m: "Abbott", c: "Ovqat hazm qilish", f: "capsule", p: 35000, rx: false },
  { n: "Festal tabletka", g: "Pankreatin", m: "Sanofi", c: "Ovqat hazm qilish", f: "tablet", p: 8000, rx: false },
  { n: "Mezim 10000 tabletka", g: "Pankreatin", m: "Berlin-Chemie", c: "Ovqat hazm qilish", f: "tablet", p: 15000, rx: false },
  { n: "Allohol tabletka", g: "Allohol", m: "Farmalife", c: "Ovqat hazm qilish", f: "tablet", p: 4000, rx: false },
  { n: "Karsil tabletka", g: "Silimarin", m: "Sopharma", c: "Ovqat hazm qilish", f: "tablet", p: 18000, rx: false },
  { n: "Gepabene kapsula", g: "Silimarin+metoklopramid", m: "Merkle", c: "Ovqat hazm qilish", f: "capsule", p: 30000, rx: false },
  { n: "Ursosan 250mg kapsula", g: "Ursodeoksixolat", m: "Farmalife", c: "Ovqat hazm qilish", f: "capsule", p: 25000, rx: true },

  // Respiratory
  { n: "Ambroksol 30mg tabletka", g: "Ambroksol", m: "Farmalife", c: "Nafas olish", f: "tablet", p: 5000, rx: false },
  { n: "Ambroksol sirop 100ml", g: "Ambroksol", m: "Denov Farm", c: "Nafas olish", f: "syrup", p: 12000, rx: false },
  { n: "Lazolvan 30mg tabletka", g: "Ambroksol", m: "Boehringer", c: "Nafas olish", f: "tablet", p: 18000, rx: false },
  { n: "Lazolvan sirop 100ml", g: "Ambroksol", m: "Boehringer", c: "Nafas olish", f: "syrup", p: 25000, rx: false },
  { n: "ACC 100mg kapsula", g: "Asetilsistein", m: "Hexal", c: "Nafas olish", f: "capsule", p: 12000, rx: false },
  { n: "ACC 200mg kapsula", g: "Asetilsistein", m: "Hexal", c: "Nafas olish", f: "capsule", p: 18000, rx: false },
  { n: "Bromgeksin 8mg tabletka", g: "Bromgeksin", m: "O'z Pharma", c: "Nafas olish", f: "tablet", p: 4000, rx: false },
  { n: "Bromgeksin sirop 100ml", g: "Bromgeksin", m: "Samarqand Farm", c: "Nafas olish", f: "syrup", p: 10000, rx: false },
  { n: "Salbutamol 100mkg inhaler", g: "Salbutamol", m: "Farmalife", c: "Nafas olish", f: "inhaler", p: 25000, rx: true },
  { n: "Pulmicort 0.5mg inhaler", g: "Budesonid", m: "AstraZeneca", c: "Nafas olish", f: "inhaler", p: 45000, rx: true },
  { n: "Berodual inhaler", g: "Fenoterol+ipratropiy", m: "Boehringer", c: "Nafas olish", f: "inhaler", p: 35000, rx: true },
  { n: "Serevent 25mkg inhaler", g: "Salmeterol", m: "GSK", c: "Nafas olish", f: "inhaler", p: 55000, rx: true },
  { n: "Eufilin 240mg tabletka", g: "Aminofillin", m: "Farmalife", c: "Nafas olish", f: "tablet", p: 5000, rx: true },
  { n: "Stoptussin tabletka", g: "Butamirat", m: "Teva", c: "Nafas olish", f: "tablet", p: 20000, rx: false },
  { n: "Sinekod tomchi 20ml", g: "Butamirat", m: "Novartis", c: "Nafas olish", f: "drops", p: 28000, rx: false },
  { n: "Libeksin 100mg tabletka", g: "Prenoksdiazin", m: "Sanofi", c: "Nafas olish", f: "tablet", p: 22000, rx: true },
  { n: "Mukaltin tabletka", g: "Altea", m: "Farmalife", c: "Nafas olish", f: "tablet", p: 2000, rx: false },
  { n: "Pektussin tabletka", g: "O'simlik", m: "O'z Pharma", c: "Nafas olish", f: "tablet", p: 3000, rx: false },

  // Vitamins
  { n: "Vitamin C 500mg tabletka", g: "Askorbin kislota", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 5000, rx: false },
  { n: "Vitamin C 1000mg tabletka", g: "Askorbin kislota", m: "O'z Pharma", c: "Vitaminlar", f: "tablet", p: 8000, rx: false },
  { n: "Vitamin D3 2000IU tabletka", g: "Xolekalsiferol", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 15000, rx: false },
  { n: "Vitamin D3 400IU tomchi", g: "Xolekalsiferol", m: "Denov Farm", c: "Vitaminlar", f: "drops", p: 20000, rx: false },
  { n: "Vitamin E 400IU kapsula", g: "Tokoferol", m: "Samarqand Farm", c: "Vitaminlar", f: "capsule", p: 10000, rx: false },
  { n: "Vitamin B1 100mg tabletka", g: "Tiamin", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 5000, rx: false },
  { n: "Vitamin B6 50mg tabletka", g: "Piridoksin", m: "O'z Pharma", c: "Vitaminlar", f: "tablet", p: 5000, rx: false },
  { n: "Vitamin B12 1000mkg inyeksiya", g: "Sianokobalamin", m: "Farmalife", c: "Vitaminlar", f: "injection", p: 8000, rx: true },
  { n: "Folat kislota 5mg tabletka", g: "Folat kislota", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 4000, rx: false },
  { n: "Magne B6 50mg tabletka", g: "Magniy", m: "Sanofi", c: "Vitaminlar", f: "tablet", p: 25000, rx: false },
  { n: "Kalsiy D3 500mg tabletka", g: "Kalsiy karbonat", m: "Nycomed", c: "Vitaminlar", f: "tablet", p: 20000, rx: false },
  { n: "Kalsiy glukonat 500mg tabletka", g: "Kalsiy", m: "O'z Pharma", c: "Vitaminlar", f: "tablet", p: 4000, rx: false },
  { n: "Temir preparati 200mg tabletka", g: "Temir sulfat", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 8000, rx: false },
  { n: "Yodomarin 200mkg tabletka", g: "Kaliy yodid", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 12000, rx: false },
  { n: "Rux preparati 25mg tabletka", g: "Rux sulfat", m: "Denov Farm", c: "Vitaminlar", f: "tablet", p: 8000, rx: false },
  { n: "Vitrum multivitamin tabletka", g: "Multivitamin", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 35000, rx: false },
  { n: "Complivit tabletka", g: "Multivitamin", m: "Pharmstandard", c: "Vitaminlar", f: "tablet", p: 20000, rx: false },
  { n: "Supradin tabletka", g: "Multivitamin", m: "Bayer", c: "Vitaminlar", f: "tablet", p: 28000, rx: false },
  { n: "Multi-tabs tabletka", g: "Multivitamin", m: "Pfizer", c: "Vitaminlar", f: "tablet", p: 25000, rx: false },
  { n: "Duovit tabletka", g: "Multivitamin", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 15000, rx: false },
  { n: "Askorbinka 100mg tabletka", g: "Vitamin C", m: "Samarqand Farm", c: "Vitaminlar", f: "tablet", p: 3000, rx: false },
  { n: "Omega-3 1000mg kapsula", g: "Omega-3", m: "Farmalife", c: "Vitaminlar", f: "capsule", p: 30000, rx: false },
  { n: "Koenzim Q10 100mg kapsula", g: "Koenzim Q10", m: "Denov Farm", c: "Vitaminlar", f: "capsule", p: 35000, rx: false },
  { n: "Melatonin 3mg tabletka", g: "Melatonin", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 15000, rx: false },
  { n: "Ginkgo Biloba 120mg kapsula", g: "Ginkgo", m: "Farmalife", c: "Vitaminlar", f: "capsule", p: 25000, rx: false },
  { n: "Glytsin 100mg tabletka", g: "Glisin", m: "O'z Pharma", c: "Vitaminlar", f: "tablet", p: 5000, rx: false },
  { n: "Selen 200mkg tabletka", g: "Selen", m: "Farmalife", c: "Vitaminlar", f: "tablet", p: 12000, rx: false },
];

const allReal = [...realMeds, ...moreCats];

const manufacturers = [...new Set(allReal.map(m => m.m))];
const categories = [...new Set(allReal.map(m => m.c))];
const forms = [...new Set(allReal.map(m => m.f))];

const updatedMeds = allReal.map((m, i) => ({
  id: "med-" + (i + 1),
  name: m.n,
  slug: m.n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  genericName: m.g,
  description: `${m.c} kategoriyasidagi dori. ${m.m} tomonidan ishlab chiqarilgan. ${m.n}.`,
  image: "/images/medicine-" + ((i % 10) + 1) + ".svg",
  manufacturer: m.m,
  category: m.c,
  dosage: m.n.split(" ").pop() || "standart",
  form: m.f,
  strength: m.n.split(" ").pop() || "standart",
  prescriptionRequired: m.rx,
  unitPrice: m.p,
  basePrice: Math.floor(m.p * 1.15),
  discountedPrice: Math.random() > 0.5 ? m.p : undefined,
  discount: Math.random() > 0.5 ? Math.floor(Math.random() * 20 + 5) : undefined,
  stockQuantity: Math.floor(Math.random() * 500) + 10,
  isAvailable: true,
  requiresPrescription: m.rx,
  sideEffects: ["Ko'ngil aynish", "Bosh og'rig'i", "Allergik reaksiya"],
  alternatives: [],
  createdAt: "2024-01-01",
  updatedAt: "2024-11-01",
}));

// Generate price records for first 300 medicines
const priceRecords = {};
const pharms = data.generatedPharmacies;
for (let i = 0; i < Math.min(updatedMeds.length, 300); i++) {
  const med = updatedMeds[i];
  const numPharms = Math.floor(Math.random() * 5) + 2;
  const prices = [];
  const used = new Set();
  for (let j = 0; j < numPharms && j < pharms.length; j++) {
    let pi;
    do { pi = Math.floor(Math.random() * pharms.length); } while (used.has(pi));
    used.add(pi);
    const ph = pharms[pi];
    const variation = Math.floor(Math.random() * med.unitPrice * 0.4) - Math.floor(med.unitPrice * 0.2);
    const finalPrice = Math.max(med.unitPrice + variation, Math.floor(med.unitPrice * 0.7));
    prices.push({
      pharmacyId: ph.id,
      pharmacyName: ph.name,
      pharmacyLogo: "/images/pharmacy-" + ((pi % 5) + 1) + ".svg",
      pharmacyRating: ph.rating,
      price: finalPrice,
      originalPrice: finalPrice > med.unitPrice ? undefined : Math.floor(med.unitPrice * 1.2),
      discount: finalPrice < med.unitPrice ? Math.floor((1 - finalPrice / (med.unitPrice * 1.2)) * 100) : undefined,
      deliveryFee: ph.deliveryFee,
      deliveryTime: ph.deliveryTime,
      isAvailable: true,
      stockQuantity: Math.floor(Math.random() * 200) + 5,
      distance: parseFloat((Math.random() * 5 + 0.3).toFixed(1)),
    });
  }
  priceRecords[med.id] = prices;
}

data.generatedMedicines = updatedMeds;
data.generatedMedicinePrices = priceRecords;

fs.writeFileSync("src/lib/generated-data.json", JSON.stringify(data, null, 2));
console.log("Fixed! Total medicines:", updatedMeds.length);
console.log("Categories:", [...new Set(updatedMeds.map(m => m.category))].join(", "));
console.log("Price range:", Math.min(...updatedMeds.map(m => m.unitPrice)).toLocaleString("uz-UZ"), "-", Math.max(...updatedMeds.map(m => m.unitPrice)).toLocaleString("uz-UZ"), "so'm");
