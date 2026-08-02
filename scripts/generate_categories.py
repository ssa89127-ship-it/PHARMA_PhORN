#!/usr/bin/env python3
"""Add 20+ more medicine categories and expand to 15k+ medicines."""
import json
import random

random.seed(123)

# ─── NEW CATEGORIES with real drugs ──────────────────────────────────────────
NEW_CATEGORIES = {
    "Revmatologiya": [
        ("Metotreksat", "Metotreksat", ["2.5mg", "7.5mg", "10mg", "15mg"], ["tabletka", "in'ektsiya"]),
        ("Sulfasalazin", "Sulfasalazin", ["500mg"], ["tabletka"]),
        ("Leflunomid", "Leflunomid", ["10mg", "20mg"], ["tabletka"]),
        ("Hydroxychloroquine", "Gidroksixloroxin", ["200mg"], ["tabletka"]),
        ("Azathioprine", "Azatioprin", ["50mg"], ["tabletka"]),
        ("Mycophenolate", "Mofetil mikofenolat", ["500mg"], ["tabletka"]),
        ("Cyclosporin", "Siklosporin", ["25mg", "50mg", "100mg"], ["kapsula"]),
        ("Adalimumab", "Adalimumab", ["40mg"], ["in'ektsiya"]),
        ("Etanercept", "Etanercept", ["25mg", "50mg"], ["in'ektsiya"]),
        ("Celecoxib", "Tseleoksib", ["100mg", "200mg"], ["kapsula"]),
        ("Etoricoxib", "Etorikoksib", ["60mg", "90mg", "120mg"], ["tabletka"]),
        ("Meloxicam", "Meloksikam", ["7.5mg", "15mg"], ["tabletka"]),
        ("Piroxicam", "Piroksikam", ["10mg", "20mg"], ["tabletka"]),
        ("Tenoxicam", "Tenoksikam", ["20mg"], ["tabletka"]),
        ("Lornoxicam", "Lornoksikam", ["4mg", "8mg"], ["tabletka"]),
        ("Nabumetone", "Nabumeton", ["500mg"], ["tabletka"]),
        ("Naproxen", "Naproksen", ["250mg", "500mg"], ["tabletka"]),
        ("Tiaprofenic acid", "Tiaprofen kislota", ["100mg", "300mg"], ["tabletka"]),
    ],
    "Endokrinologiya": [
        ("L-tiroksin", "Levotiroksin", ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg", "150mcg"], ["tabletka"]),
        ("Eutiroks", "Levotiroksin", ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg"], ["tabletka"]),
        ("Mercazolil", "Tiamazol", ["5mg", "10mg"], ["tabletka"]),
        ("Tyrozol", "Tiamazol", ["10mg"], ["tabletka"]),
        ("Propitsil", "Propiltiouratsil", ["50mg", "100mg"], ["tabletka"]),
        ("Metformin", "Metformin", ["500mg", "850mg", "1000mg"], ["tabletka"]),
        ("Glucophage", "Metformin", ["500mg", "850mg", "1000mg"], ["tabletka"]),
        ("Siofor", "Metformin", ["500mg", "850mg", "1000mg"], ["tabletka"]),
        ("Diabeton", "Gliklazid", ["80mg"], ["tabletka"]),
        ("Amaril", "Glimepirid", ["1mg", "2mg", "3mg", "4mg"], ["tabletka"]),
        ("Januvia", "Sitagliptin", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Galvus", "Vildagliptin", ["50mg"], ["tabletka"]),
        ("Ongliza", "Saxagliptin", ["2.5mg", "5mg"], ["tabletka"]),
        ("Xenical", "Orlistat", ["120mg"], ["kapsula"]),
        ("Insulin NovoRapid", "Insulin aspart", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Lantus", "Insulin glargine", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Humalog", "Insulin lyspro", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Protaphane", "Insulin izofan", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Actrapid", "Insulin inson", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Fiasp", "Insulin aspart tez", ["100 IU/ml"], ["in'ektsiya"]),
    ],
    "Gastroenterologiya": [
        ("Omeprazol", "Omeprazol", ["10mg", "20mg", "40mg"], ["kapsula"]),
        ("Pantoprazol", "Pantoprazol", ["20mg", "40mg"], ["tabletka"]),
        ("Rabeprazol", "Rabeprazol", ["10mg", "20mg"], ["tabletka"]),
        ("Esomeprazol", "Esomeprazol", ["20mg", "40mg"], ["tabletka", "kapsula"]),
        ("Lansoprazol", "Lansoprazol", ["15mg", "30mg"], ["kapsula"]),
        ("Famotidin", "Famotidin", ["20mg", "40mg"], ["tabletka"]),
        ("Ranitidin", "Ranitidin", ["150mg", "300mg"], ["tabletka"]),
        ("Cimetidin", "Simetidin", ["200mg", "400mg"], ["tabletka"]),
        ("Maalox", "Alüminiy/Magniy gidroksidi", ["suspenziya", "tabletka"]),
        ("Almagel", "Alüminiy/Magniy", ["suspenziya", "tabletka"]),
        ("Gaviscon", "Natriy alginat", ["suspenziya"]),
        ("Fosfalugel", "Alüminiy fosfat", ["gel"]),
        ("De-Nol", "Vismut subtsitrat", ["120mg"], ["tabletka"]),
        ("Smecta", "Diosmektit", ["3g"], ["paket"]),
        ("Enterosgel", "Metilsilatik kislota", ["225g"], ["gel"]),
        ("Polysorb", "Kolloidli silika", ["3g", "6g", "9g"], ["paket"]),
        ("Lactofiltrum", "Laktuloza/Lignin", ["375mg"], ["tabletka"]),
        ("Creon", "Pancreatin", ["10000", "25000"], ["kapsula"]),
        ("Mezim", "Pancreatin", ["10000"], ["tabletka"]),
        ("Festal", "Pancreatin/Hemitsellulaz", ["tabletka"]),
        ("Enzistal", "Pancreatin/Hemitsellulaz", ["tabletka"]),
        ("Pankreatin", "Pancreatin", ["100mg"], ["tabletka"]),
        ("Trimedat", "Trimebutin", ["100mg", "200mg"], ["tabletka"]),
        ("Duspatalin", "Mebeverin", ["135mg", "200mg"], ["tabletka"]),
        ("No-Spa", "Drotaverin", ["40mg"], ["tabletka"]),
        ("Buscopan", "Hüskopolin bromid", ["10mg"], ["tabletka"]),
        ("Loperamid", "Loperamid", ["2mg"], ["tabletka"]),
        ("Imodium", "Loperamid", ["2mg"], ["kapsula"]),
        ("Linex", "Laktobatsilluslar", ["kapsula"]),
        ("Bifiform", "Bifidobakteriyalar", ["kapsula"]),
        ("Acipol", "Acidofilus laktobatsilluslar", ["kapsula"]),
        ("Hilak Forte", "Metabolitlar", ["30ml"], ["eritma"]),
        ("Motilium", "Domperidon", ["10mg"], ["tabletka"]),
        ("Zeercal", "Metoklopramid", ["10mg"], ["tabletka"]),
        ("Ursosan", "Ursodeoksikholik kislota", ["250mg"], ["kapsula"]),
        ("Urdoks", "Ursodeoksikholik kislota", ["300mg"], ["kapsula"]),
        ("Hofitol", "Artishok ekstrakti", ["200mg"], ["tabletka"]),
    ],
    "Nevrologiya": [
        ("Piratsetam", "Piratsetam", ["400mg", "800mg", "1200mg"], ["tabletka", "kapsula"]),
        ("Nootropil", "Piratsetam", ["400mg", "800mg"], ["tabletka"]),
        ("Cinnarizin", "Tsinnarizin", ["25mg"], ["tabletka"]),
        ("Stugeron", "Tsinnarizin", ["25mg"], ["tabletka"]),
        ("Vinpocetine", "Vintsetsin", ["5mg", "10mg"], ["tabletka"]),
        ("Cavinton", "Vintsetsin", ["5mg", "10mg"], ["tabletka"]),
        ("Instenon", "Etomivan/Heptaminol", ["tabletka"]),
        ("Sermion", "Nicergolin", ["5mg", "10mg", "30mg"], ["tabletka"]),
        ("Glycine", "Glitsin", ["100mg"], ["tabletka"]),
        ("Phenibut", "Fenibut", ["250mg"], ["tabletka"]),
        ("Picamilon", "Pikamilon", ["50mg", "100mg"], ["tabletka"]),
        ("Tenoten", "Homeopatik", ["tabletka"]),
        ("Afobazol", "Fabomotizol", ["10mg"], ["tabletka"]),
        ("Grandaxin", "Tofizolam", ["50mg"], ["tabletka"]),
        ("Gidazepam", "Gidazepam", ["20mg"], ["tabletka"]),
        ("Oksazepam", "Oksazepam", ["10mg", "25mg"], ["tabletka"]),
        ("Amitriptilin", "Amitriptilin", ["25mg", "50mg"], ["tabletka"]),
        ("Gabapentin", "Gabapentin", ["300mg", "600mg"], ["kapsula"]),
        ("Pregabalin", "Pregabalin", ["25mg", "75mg", "150mg", "300mg"], ["kapsula"]),
        ("Carbamazepine", "Karbamazepin", ["200mg", "400mg"], ["tabletka"]),
        ("Valproic acid", "Natriy valproat", ["200mg", "500mg"], ["tabletka"]),
        ("Topiramate", "Topiramat", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Lamotrigine", "Lamotrijin", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Levetiracetam", "Levetiratsetam", ["250mg", "500mg", "1000mg"], ["tabletka"]),
        ("Phenytoin", "Fenitoin", ["100mg"], ["tabletka"]),
        ("Seduxen", "Diazepam", ["2mg", "5mg"], ["tabletka"]),
        ("Relanium", "Diazepam", ["5mg"], ["tabletka"]),
        ("Phenazepam", "Fenazepam", ["0.5mg"], ["tabletka"]),
        ("Zolpidem", "Zolpidem", ["5mg", "10mg"], ["tabletka"]),
        ("Zopiclone", "Zopiklon", ["3.75mg", "7.5mg"], ["tabletka"]),
    ],
    "Psixologiya/Psixiatriya": [
        ("Fluoksetin", "Fluoksetin", ["20mg"], ["kapsula"]),
        ("Sertralin", "Sertralin", ["50mg", "100mg"], ["tabletka"]),
        ("Escitalopram", "Escitalopram", ["5mg", "10mg", "20mg"], ["tabletka"]),
        ("Venlafaksin", "Venlafaksin", ["37.5mg", "75mg", "150mg"], ["kapsula"]),
        ("Duloksetin", "Duloksetin", ["30mg", "60mg"], ["kapsula"]),
        ("Paroxetine", "Paroksetin", ["10mg", "20mg", "30mg"], ["tabletka"]),
        ("Citalopram", "Tsitalopram", ["10mg", "20mg"], ["tabletka"]),
        ("Mirtazapine", "Mirtazapin", ["15mg", "30mg"], ["tabletka"]),
        ("Trazodone", "Trazodon", ["50mg", "100mg"], ["tabletka"]),
        ("Clomipramine", "Klomipramin", ["25mg", "50mg"], ["tabletka"]),
        ("Imipramine", "Imipramin", ["25mg", "50mg"], ["tabletka"]),
        ("Amitriptyline", "Amitriptilin", ["10mg", "25mg", "50mg"], ["tabletka"]),
        ("Diazepam", "Diazepam", ["2mg", "5mg", "10mg"], ["tabletka"]),
        ("Alprazolam", "Alprazolam", ["0.25mg", "0.5mg", "1mg"], ["tabletka"]),
        ("Lorazepam", "Lorazepam", ["1mg", "2mg"], ["tabletka"]),
        ("Chlordiazepoxide", "Klordiasepoksid", ["5mg", "10mg"], ["tabletka"]),
        ("Buspirone", "Buspiron", ["5mg", "10mg"], ["tabletka"]),
        ("Hydroxyzine", "Gidroksizin", ["25mg"], ["tabletka"]),
        ("Propranolol", "Propranolol", ["10mg", "40mg"], ["tabletka"]),
        ("Mebicar", "Mebikar", ["300mg", "600mg"], ["tabletka"]),
        ("Adaptol", "Mebikar", ["300mg", "500mg"], ["tabletka"]),
        ("Triftazin", "Trifluoperazin", ["5mg"], ["tabletka"]),
        ("Haloperidol", "Galoperidol", ["1.5mg", "5mg", "10mg"], ["tabletka"]),
        ("Olanzapine", "Olanzapin", ["2.5mg", "5mg", "10mg"], ["tabletka"]),
        ("Quetiapine", "Ketiapin", ["25mg", "50mg", "100mg", "200mg"], ["tabletka"]),
        ("Risperidone", "Risperidon", ["1mg", "2mg", "3mg"], ["tabletka"]),
        ("Aripiprazole", "Aripiprazol", ["5mg", "10mg", "15mg"], ["tabletka"]),
        ("Lithium carbonate", "Litsey karbonat", ["300mg"], ["tabletka"]),
        ("Valproic acid", "Natriy valproat", ["200mg", "500mg"], ["tabletka"]),
    ],
    "Allergologiya": [
        ("Cetirizin", "Setirizin", ["5mg", "10mg"], ["tabletka", "tomchi"]),
        ("Loratadine", "Loratadin", ["10mg"], ["tabletka"]),
        ("Desloratadine", "Desloratadin", ["5mg"], ["tabletka"]),
        ("Fexofenadine", "Feksofenadin", ["120mg", "180mg"], ["tabletka"]),
        ("Levocetirizin", "Levotsetirizin", ["5mg"], ["tabletka"]),
        ("Chloropyramine", "Kloropiramin", ["25mg"], ["tabletka"]),
        ("Suprastin", "Kloropiramin", ["25mg"], ["tabletka"]),
        ("Diphenhydramine", "Difenhidramin", ["50mg"], ["tabletka"]),
        ("Dimethindene", "Dimetinden", ["1mg"], ["tomchi"]),
        ("Ketotifen", "Ketotifen", ["1mg"], ["tabletka"]),
        ("Azelastine", "Azellastin", ["0.1%"], ["sprey", "damla"]),
        ("Olopatadine", "Olopatadin", ["0.1%"], ["damla"]),
        ("Montelukast", "Montelukast", ["4mg", "5mg", "10mg"], ["tabletka"]),
        ("Zafirlukast", "Zafirlukast", ["20mg"], ["tabletka"]),
        ("Doxepin", "Doksepin", ["25mg"], ["kapsula"]),
        ("Terfenadine", "Terfenadin", ["60mg", "120mg"], ["tabletka"]),
        ("Astemizole", "Astemizol", ["10mg"], ["tabletka"]),
        ("Ranitidine", "Ranitidin", ["150mg"], ["tabletka"]),
        ("Famotidine", "Famotidin", ["20mg"], ["tabletka"]),
        ("Cromoglicic acid", "Kromoglitsik kislota", ["20mg"], ["kapsula"]),
        ("Nedocromil", "Nedokromil", ["20mg"], ["inhaler"]),
        ("Betamethasone", "Betametazon", ["0.5mg"], ["tabletka"]),
        ("Dexamethasone", "Deksametazon", ["0.5mg", "4mg"], ["tabletka"]),
        ("Prednisolone", "Prednizolon", ["5mg", "20mg"], ["tabletka"]),
        ("Triamcinolone", "Triamsinolon", ["4mg"], ["tabletka"]),
        ("Methylprednisolone", "Metilprednizolon", ["4mg", "16mg", "32mg"], ["tabletka"]),
        ("Hydrocortisone", "Hidrokortizon", ["20mg"], ["tabletka"]),
        ("Clemastine", "Klemastin", ["1mg"], ["tabletka"]),
        ("Mequitazine", "Mekvitazin", ["5mg"], ["tabletka"]),
        ("Phencarol", "Sinkarol", ["25mg", "50mg"], ["tabletka"]),
    ],
    "Immunologiya": [
        ("Interferon alfa", "Interferon alfa-2b", ["3MIU"], ["in'ektsiya"]),
        ("Peginterferon", "Peginterferon alfa-2a", ["135mcg", "180mcg"], ["in'ektsiya"]),
        ("Ribavirin", "Ribavirin", ["200mg"], ["kapsula"]),
        ("Acyclovir", "Atsiklovir", ["200mg", "400mg", "800mg"], ["tabletka", "maz"]),
        ("Valacyclovir", "Valatsiklovir", ["500mg", "1000mg"], ["tabletka"]),
        ("Famciclovir", "Famtsiklovir", ["250mg", "500mg"], ["tabletka"]),
        ("Ganciclovir", "Gantsiklovir", ["250mg", "500mg"], ["kapsula"]),
        ("Imiquimod", "Imikvimod", ["5%"], ["krem"]),
        ("Polyoxidonium", "Azoksimer bromid", ["6mg", "12mg"], ["tabletka", "in'ektsiya"]),
        ("Thymalin", "Timus ekstrakti", ["in'ektsiya"]),
        ("Thymogen", "Alfa-glutamil-triptofan", ["in'ektsiya"]),
        ("Immunal", "Echinacea purpurea", ["tomchi", "tabletka"]),
        ("Echinacea", "Echinacea", ["tabletka", "tomchi"]),
        ("Imudon", "Lizatlar", ["tabletka"]),
        ("IRS-19", "Bakterial lizatlar", ["sprey"]),
        ("Broncho-munal", "Bakterial lizatlar", ["kapsula"]),
        ("Ribomunil", "Bakterial ribosomalar", ["tabletka"]),
        ("Cycloferon", "Meglumin akridonatsetat", ["150mg", "400mg"], ["tabletka"]),
        ("Kagocel", "Kagotsel", ["12mg"], ["tabletka"]),
        ("Arbidol", "Umifenovir", ["100mg", "200mg"], ["kapsula"]),
        ("Tamiflu", "Oseltamivir", ["30mg", "45mg", "75mg"], ["kapsula"]),
        ("Relenza", "Zanamivir", ["5mg"], ["inhalyatsiya"]),
        ("Ingavirin", "Imidazolil-etanamid", ["90mg"], ["kapsula"]),
        ("Isoprinosine", "Inosin pranobeks", ["500mg"], ["tabletka"]),
        ("Lavomax", "Tiloron", ["60mg", "125mg"], ["tabletka"]),
        ("Amiksin", "Tiloron", ["60mg", "125mg"], ["tabletka"]),
    ],
    "Onkologiya-kimyo": [
        ("Methotrexate", "Metotreksat", ["2.5mg", "5mg", "10mg", "25mg"], ["tabletka", "in'ektsiya"]),
        ("5-Fluorouracil", "5-Fluorouratsil", ["500mg"], ["in'ektsiya"]),
        ("Cyclophosphamide", "Siklofosfamid", ["500mg"], ["in'ektsiya"]),
        ("Doxorubicin", "Doksorubitsin", ["50mg"], ["in'ektsiya"]),
        ("Cisplatin", "Tsisp latin", ["50mg", "100mg"], ["in'ektsiya"]),
        ("Carboplatin", "Karboplatin", ["150mg", "450mg"], ["in'ektsiya"]),
        ("Paclitaxel", "Paklitaksel", ["30mg", "100mg"], ["in'ektsiya"]),
        ("Docetaxel", "Doketaksel", ["20mg", "80mg"], ["in'ektsiya"]),
        ("Etoposide", "Etozid", ["100mg"], ["in'ektsiya"]),
        ("Vincristine", "Vinkristin", ["1mg"], ["in'ektsiya"]),
        ("Bleomycin", "Bleomitsin", ["15mg"], ["in'ektsiya"]),
        ("Tamoxifen", "Tamoksifen", ["10mg", "20mg"], ["tabletka"]),
        ("Anastrozole", "Anastrozol", ["1mg"], ["tabletka"]),
        ("Letrozole", "Letrozol", ["2.5mg"], ["tabletka"]),
        ("Capecitabine", "Kapetsitabin", ["150mg", "500mg"], ["tabletka"]),
        ("Imatinib", "Imatinib", ["100mg", "400mg"], ["tabletka"]),
        ("Erlotinib", "Erlotinib", ["100mg", "150mg"], ["kapsula"]),
        ("Sorafenib", "Sorafenib", ["200mg"], ["tabletka"]),
        ("Sunitinib", "Sunitinib", ["12.5mg", "25mg", "50mg"], ["kapsula"]),
        ("Bortezomib", "Bortezomib", ["3.5mg"], ["in'ektsiya"]),
        ("Lenalidomide", "Lenalidomide", ["5mg", "10mg", "15mg", "25mg"], ["kapsula"]),
        ("Temozolomide", "Temozolomid", ["20mg", "100mg", "250mg"], ["kapsula"]),
        ("Pembrolizumab", "Pembrolizumab", ["25mg/ml"], ["in'ektsiya"]),
        ("Nivolumab", "Nivolumab", ["10mg/ml"], ["in'ektsiya"]),
        ("Atezolizumab", "Atezolizumab", ["60mg/ml"], ["in'ektsiya"]),
    ],
    "Sport tibbiyoti": [
        ("Winstrol", "Stanozolol", ["2mg", "5mg"], ["tabletka"]),
        ("Dianabol", "Metandienon", ["5mg", "10mg"], ["tabletka"]),
        ("Anavar", "Oxandrolon", ["2.5mg", "10mg"], ["tabletka"]),
        ("Deca-Durabolin", "Nandrolon", ["50mg", "100mg"], ["in'ektsiya"]),
        ("Testosterone", "Testosteron", ["250mg"], ["in'ektsiya"]),
        ("Sustanon", "Testosteron aralashma", ["250mg"], ["in'ektsiya"]),
        ("Boldenone", "Boldenon", ["200mg"], ["in'ektsiya"]),
        ("Trenbolone", "Trenbolon", ["75mg"], ["in'ektsiya"]),
        ("Clomiphene", "Klomifen", ["50mg"], ["tabletka"]),
        ("HCG", "Human chorionic gonadotropin", ["5000 IU"], ["in'ektsiya"]),
        ("Creatine", "Kreatin monohidrat", ["5g"], ["paket"]),
        ("BCAA", "Amino kislota", ["tabletka", "paket"]),
        ("Whey Protein", "Vay protein", ["paket"]),
        ("Glutamine", "L-Glutamin", ["5g", "10g"], ["paket"]),
        ("HMB", "Gidroksimetilbutirat", ["500mg"], ["kapsula"]),
        ("Fat Burner", "Yonuvchi", ["kapsula", "tabletka"]),
        ("Pre-Workout", "Oldindan", ["paket"]),
        ("Collagen Peptides", "Kollagen peptidlar", ["paket"]),
        ("Electrolyte", "Elektrolit", ["paket"]),
        ("Multivitamin Sport", "Sport multivitamin", ["tabletka"]),
    ],
    "Kosmetologiya": [
        ("Retinol cream", "Retinol", ["0.3%", "0.5%", "1%"], ["krem"]),
        ("Vitamin C serum", "Askorbin kislota", ["10%", "15%", "20%"], ["serum"]),
        ("Hyaluronic acid", "Gialuron kislota", ["1%", "2%"], ["serum"]),
        ("Niacinamide", "Nikotinamid", ["5%", "10%"], ["serum"]),
        ("Salicylic acid", "Salitsil kislota", ["0.5%", "2%"], ["krem", "tonik"]),
        ("Glycolic acid", "Glikol kislota", ["5%", "10%"], ["tonik"]),
        ("AHA/BHA Peel", "AHA/BHA", ["tonik"]),
        ("Benzoyl peroxide", "Benzoyl peroksid", ["2.5%", "5%", "10%"], ["krem"]),
        ("Azelaic acid", "Azela kislota", ["15%", "20%"], ["krem"]),
        ("Ceramide cream", "Seramidlar", ["krem"]),
        ("Collagen cream", "Kollagen", ["krem"]),
        ("Peptide serum", "Peptidlar", ["serum"]),
        ("Sunscreen SPF50", "Quyoshdan himoya", ["50+"], ["krem"]),
        ("BB Cream", "BB krem", ["krem"]),
        ("Micellar water", "Mitsellar suv", ["200ml", "400ml"], ["eritma"]),
        ("Face Wash", "Yuzni yuvish", ["100ml", "150ml"], ["gel"]),
        ("Toner", "Toner", ["200ml"], ["eritma"]),
        ("Sheet Mask", "Yuz niqobi", ["niqob"]),
        ("Eye Cream", "Ko'z atrofi kremi", ["15ml"], ["krem"]),
        ("Lip Balm", "Lab balzami", ["10g"], ["balzam"]),
        ("Body Lotion", "Tana losioni", ["200ml", "400ml"], ["losion"]),
        ("Hair Oil", "Soch moyi", ["100ml"], ["moy"]),
        ("Shampoo", "Shampun", ["200ml", "400ml"], ["shampun"]),
        ("Conditioner", "Konditsioner", ["200ml", "400ml"], ["konditsioner"]),
        ("Hair Mask", "Soch niqobi", ["300ml"], ["niqob"]),
    ],
    "Gigiena": [
        ("Colgate", "Fluor", ["75ml", "100ml"], ["toothpaste"]),
        ("Oral-B", "Fluor", ["75ml", "100ml"], ["toothpaste"]),
        ("Listerine", "Antiseptik", ["250ml", "500ml"], ["eritma"]),
        ("Chlorhexidine", "Hlorgeksidin", ["100ml", "200ml"], ["eritma"]),
        ("Pantene", "Pro-Vitamin", ["200ml", "400ml"], ["shampun"]),
        ("Head & Shoulders", "Piritionin tsink", ["200ml", "400ml"], ["shampun"]),
        ("Nivea", "Nemlendirici", ["100ml", "200ml"], ["krem"]),
        ("Dove", "Nemlendirici", ["100ml", "250ml"], ["sabun"]),
        ("Vaseline", "Vazelin", ["100ml"], ["losion"]),
        ("Johnson's Baby", "Bolalar", ["200ml"], ["losion"]),
        ("Deodorant", "Ter to'xtatuvchi", ["50ml", "150ml"], ["sprey"]),
        ("Antiperspirant", "Ter to'xtatuvchi", ["50ml", "150ml"], ["sprey"]),
        ("Hand Sanitizer", "Qo'l tozalovchi", ["50ml", "100ml", "250ml"], ["gel"]),
        ("Wet Wipes", "Nam salfetka", ["10", "30", "60"], ["salfetka"]),
        ("Sunscreen SPF30", "Quyoshdan himoya", ["100ml"], ["krem"]),
        ("After Sun", "Quyoshdan keyin", ["200ml"], ["losion"]),
        ("Intimate Wash", "Maxsus yuvish", ["200ml"], ["eritma"]),
        ("Shower Gel", "Dush geli", ["250ml", "500ml"], ["gel"]),
        ("Bath Foam", "Vanna uchun", ["500ml"], ["foam"]),
        ("Cotton Pads", "Paxta", ["80", "120", "200"], ["paxta"]),
    ],
    "Tibbiy buyumlar": [
        ("Termometr", "Elektron", ["digi"]),
        ("Tensiometr", "Qon bosimi", ["avto"]),
        ("Glukometr", "Qand tahlili", ["digi"]),
        ("Nebulizer", "Inhalatsiya", ["kompressor"]),
        ("Pulse Oximeter", "Kislorod", ["digi"]),
        ("Massager", "Massaj", ["elctrik"]),
        ("Bandage", "Bandaj", ["10sm", "15sm"]),
        ("Gauze", "Marle", ["5m"]),
        ("Adhesive Tape", "Yelim lenta", ["2.5sm"]),
        ("Syringe", "Shprits", ["2ml", "5ml", "10ml"]),
        ("Needle", "Igna", ["23G", "25G"]),
        ("Gloves", "Qo'lqop", ["S", "M", "L"]),
        ("Mask", "Niqob", ["50", "100"]),
        ("Thermometer Cover", "Termometr qoplamasi", ["50"]),
        ("Inhaler Spacer", "Inhalatsiya adapter", ["dastgoh"]),
        ("CPAP Mask", "CPAP niqob", ["S", "M", "L"]),
        ("Wheelchair", "Nogironlar aravachasi", ["cheklangan"]),
        ("Crutch", "Qo'shltayoq", ["yengil", "og'ir"]),
        ("Orthopedic Belt", "Ortopedik kamar", ["M", "L", "XL"]),
        ("Support Brace", "Qo'llab-quvvatlash", ["M", "L", "XL"]),
    ],
    "O'simlik preparatlari": [
        ("Valeriana", "Valeriana", ["tabletka", "tomchi"]),
        ("Passiflora", "Passiflora", ["tabletka"]),
        ("St. John's Wort", "Ziravor o'ti", ["tabletka", "kapsula"]),
        ("Ginkgo Biloba", "Ginkgo biloba", ["40mg", "80mg"], ["tabletka", "kapsula"]),
        ("Echinacea", "Echinacea", ["tabletka", "tomchi"]),
        ("Milk Thistle", "O'simlik sut'i", ["140mg", "175mg"], ["kapsula"]),
        ("Artichoke", "Artishok", ["tabletka", "kapsula"]),
        ("Turmeric", "Zanjabil", ["500mg"], ["tabletka"]),
        ("Ginger", "Zanjabil", ["tabletka", "kapsula"]),
        ("Garlic", "Sarimsoq", ["tabletka", "kapsula"]),
        ("Cranberry", "Kranberi", ["tabletka", "kapsula"]),
        ("Aloe Vera", "Aloe vera", ["tabletka", "gel"]),
        ("Chamomile", "Romon chamomile", ["tabletka", "tomchi"]),
        ("Lemon Balm", "Limon balzami", ["tabletka", "tomchi"]),
        ("Hawthorn", "O'rik o'g'iti", ["tabletka", "tomchi"]),
        ("Linden", "Pude", ["tabletka", "tomchi"]),
        ("Rosehip", "It gullari", ["tabletka", "sirop"]),
        ("Propolis", "Proopolis", ["tabletka", "tomchi", "maz"]),
        ("Royal Jelly", "Asal matasi", ["kapsula"]),
        ("Pollen", "Chang", ["paket"]),
    ],
    "Uy sharoitida davolash": [
        ("Paratsetamol", "Paratsetamol", ["500mg"], ["tabletka"]),
        ("Ibuprofen", "Ibuprofen", ["400mg"], ["tabletka"]),
        ("Aspirin", "Acetilsalitsil kislota", ["500mg"], ["tabletka"]),
        ("Loperamide", "Loperamid", ["2mg"], ["tabletka"]),
        ("ORS", "Oral rehidratatsiya", ["paket"]),
        ("Activated Charcoal", "Ko'mir", ["250mg"], ["tabletka"]),
        ("Mezim", "Pancreatin", ["10000"], ["tabletka"]),
        ("Validol", "Validol", ["60mg"], ["tabletka"]),
        ("Corvalol", "Etamil bromizovalerianat", ["25ml"], ["eritma"]),
        ("Furacilin", "Nitrofural", ["0.2%"], ["eritma"]),
        ("Hydrogen Peroxide", "Vodorod peroksid", ["3%"], ["eritma"]),
        ("Iodine", "Yod", ["5%"], ["eritma"]),
        ("Brilliant Green", "Yashil", ["eritma"]),
        ("Boric Acid", "Bor kislota", ["2%"], ["eritma"]),
        ("Vaseline", "Vazelin", ["maz"]),
        ("Petroleum Jelly", "Neft moyi", ["maz"]),
        ("Calendula", "Calendula", ["tomchi", "maz"]),
        ("Chamomile", "Romon chamomile", ["tomchi"]),
        ("Salt", "Tuz", ["paket"]),
        ("Soda", "Soda", ["paket"]),
    ],
    "Ayollar salomatligi": [
        ("Folic Acid", "Folik kislota", ["5mg"], ["tabletka"]),
        ("Iron", "Temir", ["tabletka"]),
        ("Calcium + D3", "Kaltsiy + D3", ["tabletka"]),
        ("Prenatal", "Homiladorlik", ["tabletka"]),
        ("Progesterone", "Progesteron", ["tabletka", "in'ektsiya"]),
        ("Duphaston", "Dydrogesteron", ["10mg"], ["tabletka"]),
        ("Utrozhestan", "Progesteron", ["100mg", "200mg"], ["kapsula"]),
        ("Clomiphene", "Klomifen", ["50mg"], ["tabletka"]),
        ("Postinor", "Levonorgestrel", ["0.75mg"], ["tabletka"]),
        ("Escapelle", "Levonorgestrel", ["1.5mg"], ["tabletka"]),
        ("Yarina", "Drospirenon/Ethinylestradiol", ["tabletka"]),
        ("Jeanine", "Dienogest/Ethinylestradiol", ["tabletka"]),
        ("Regulon", "Desogestrel/Ethinylestradiol", ["tabletka"]),
        ("Novinet", "Desogestrel/Ethinylestradiol", ["tabletka"]),
        ("Lindinet", "Gestoden/Ethinylestradiol", ["tabletka"]),
        ("Clotrimazole", "Klotrimazol", ["100mg", "500mg"], ["tabletka", "shamcha"]),
        ("Pimafucin", "Natamitsin", ["100mg"], ["shamcha"]),
        ("Terzhinan", "Nestatine/Ternidazol", ["shamcha"]),
        ("Hexicon", "Hlorgeksidin", ["eritma", "shamcha"]),
        ("Lactonorm", "Laktobatsilluslar", ["kapsula"]),
    ],
    "Bolalar salomatligi": [
        ("Paratsetamol bolalar", "Paratsetamol", ["100mg", "120mg", "250mg"], ["suspenziya", "sirop"]),
        ("Ibuprofen bolalar", "Ibuprofen", ["100mg/5ml"], ["suspenziya"]),
        ("Nurofen bolalar", "Ibuprofen", ["100mg/5ml"], ["suspenziya"]),
        ("Cefekon", "Paratsetamol", ["100mg", "250mg"], ["shamcha"]),
        ("Viferon bolalar", "Interferon", ["shamcha"]),
        ("Anaferon bolalar", "Homeopatik", ["tabletka"]),
        ("Arbidol bolalar", "Umifenovir", ["100mg"], ["kapsula"]),
        ("Lazolvan bolalar", "Ambroksol", ["15mg/5ml"], ["sirop"]),
        ("ACC bolalar", "Atsetilsistein", ["100mg", "200mg"], ["paket"]),
        ("Prospan bolalar", "Efeushya", ["sirop"]),
        ("Gedelix bolalar", "Efira", ["sirop"]),
        ("Smecta bolalar", "Diosmektit", ["3g"], ["paket"]),
        ("Enterosgel bolalar", "Metilsilatik kislota", ["gel"]),
        ("Linex bolalar", "Laktobatsilluslar", ["kapsula"]),
        ("Bifiform bolalar", "Bifidobakteriyalar", ["kapsula"]),
        ("Mezim bolalar", "Pancreatin", ["10000"], ["tabletka"]),
        ("Supraks bolalar", "Tsefiksim", ["100mg"], ["suspenziya"]),
        ("Flemoksin bolalar", "Amoksitsillin", ["125mg", "250mg"], ["suspenziya"]),
        ("Zodak bolalar", "Setirizin", ["5mg"], ["sprey", "tomchi"]),
        ("Zyrtec bolalar", "Setirizin", ["5mg"], ["tomchi"]),
    ],
    "Keksalik salomatlik": [
        ("Calcium", "Kaltsiy", ["tabletka"]),
        ("Vitamin D", "D3 vitamini", ["tabletka", "kapsula"]),
        ("Magnesium", "Magniy", ["tabletka"]),
        ("CoQ10", "Ubiquinon", ["100mg", "200mg"], ["kapsula"]),
        ("Omega-3", "Omega-3", ["1000mg"], ["kapsula"]),
        ("Glucosamine", "Glükozamin", ["500mg"], ["tabletka"]),
        ("Chondroitin", "Xondroitin", ["500mg"], ["tabletka"]),
        ("Collagen", "Kollagen", ["tabletka", "paket"]),
        ("Vitamin B12", "B12 vitamini", ["1000mcg"], ["tabletka"]),
        ("Iron", "Temir", ["tabletka"]),
        ("Zinc", "Sink", ["tabletka"]),
        ("Ginkgo", "Ginkgo biloba", ["40mg"], ["tabletka"]),
        ("Lecithin", "Lesitin", ["kapsula"]),
        ("Melatonin", "Melatonin", ["3mg", "5mg"], ["tabletka"]),
        ("Saw Palmetto", "Palma mevasi", ["tabletka"]),
        ("Prostate Support", "Prostata", ["tabletka"]),
    ],
    "Hayvonlar uchun": [
        ("Antibiotik itlar", "Amoksitsillin", ["250mg", "500mg"], ["tabletka"]),
        ("Dewormer itlar", "Pirantel", ["tabletka"]),
        ("Flea Collar", "Bit", ["yoqa"]),
        ("Tick Spray", "Chayon", ["sprey"]),
        ("Eye Drops itlar", "Damla", ["damla"]),
        ("Ear Drops itlar", "Damla", ["damla"]),
        ("Joint Supplement itlar", "Bo'g'im", ["tabletka"]),
        ("Calming Supplement", "Tinchlantiruvchi", ["tabletka"]),
        ("Vitamin itlar", "Vitamin", ["tabletka", "sirop"]),
        ("Wound Healing", "Yara", ["maz"]),
        ("Shampoo itlar", "Shampun", ["shampun"]),
        ("Skin Cream itlar", "Teri", ["krem"]),
    ],
    "Parfyumeriya": [
        ("Eau de Parfum", "Atir", ["50ml", "100ml"], ["atir"]),
        ("Eau de Toilette", "Tualet suvi", ["50ml", "100ml"], ["atir"]),
        ("Body Mist", "Tana spreyi", ["100ml", "200ml"], ["sprey"]),
        ("Perfume Oil", "Atir moyi", ["10ml"], ["moy"]),
        ("Room Fragrance", "Xona atiri", ["100ml"], ["sprey"]),
        ("Car Fragrance", "Mashina atiri", ["sprey"]),
        ("Solid Perfume", "Qattiq atir", ["10g"], ["atir"]),
        ("Roll-on Perfume", "Roll-on atir", ["10ml"], ["atir"]),
    ],
}

MANUFACTURERS = {
    "Xitoy": ["Shanghai Pharma", "Sinopharm", "Harbin Pharma", "Guangzhou Pharma", "Beijing Pharma", "Sino Biopharm", "Topfond Pharma", "Tasly Pharma", "Lukso Pharma", "Zhejiang Pharma"],
    "Rossiya": ["Farmstandart", "R-pharm", "Borisovsky", "Pharmtechnologia", "Valenta", "Synthesis", "Stada CIS", "Ozon", "Nizhpharm", "Dalkhimfarm"],
    "Hindiston": ["Cipla", "Sun Pharma", "Dr. Reddy's", "Ranbaxy", "Zydus", "Aurobindo", "Lupin", "Glenmark", "Alkem", "Wockhardt"],
    "Turkiya": ["Abdi Ibrahim", "Sanovel", "Sandoz", "Bilim", "İlko", "Trijon", "Eczacıbaşı", "Deva", "Berk İlaç", "Saglik"],
    "Germaniya": ["Bayer", "Stada", "Berlin-Chemie", "Hexal", "Ratiopharm", "Sandoz", "Merck", "Boehringer Ingelheim", "Takeda", "Lipid"],
    "Shvetsariya": ["Novartis", "Roche", "Basilea", "Vifor", "Baldacci", "Spirig", "Cilag", "Streuli", "IBSA", "Meda"],
    "Italiya": ["Angelini", "Zambon", "Chiesi", "IBSA", "Dompé", "Italfarmaco", "Menarini", "Bracco", "Alfasigma"],
    "Fransiya": ["Sanofi", "Servier", "Boiron", "Innothera", "Upsa", "Merck", "Pierre Fabre"],
    "AQSH": ["Pfizer", "Merck", "Abbott", "Bristol-Myers", "Eli Lilly", "Amgen", "Gilead", "Johnson & Johnson", "Baxter", "Hospira"],
    "Buyuk Britaniya": ["GSK", "AstraZeneca", "Boots", "Alliance", "Wockhardt", "Mylan"],
    "Isroil": ["Teva", "Dexcel", "Rafa", "Taro"],
    "Yaponiya": ["Takeda", "Daiichi Sankyo", "Astellas", "Yamanouchi", "Chugai"],
    "Janubiy Koreya": ["Samsung", "Celltrion", "Hanmi", "Daewoong", "LG Chem", "Samjin", "Dong-A"],
    "O'zbekiston": ["Davr Farm", "Samarqand Farm", "Toshkent Farm", "Farmkon", "Zardavor"],
}

COUNTRIES = list(MANUFACTURERS.keys())

SIDE_EFFECTS = [
    ["Bosh og'rig'i", "Ko'ngil aynish", "Allergik reaksiya"],
    ["Diareya", "Qorin og'rig'i", "Shishish"],
    ["Uyqusizlik", "Bosh aylanishi", "Charchash"],
    ["Teriga toshma", "Qichish", "Shishish"],
    ["Isitma", "Charchash", "Bosh og'rig'i"],
    ["Qon bosimi o'zgarishi", "Yurak urishi", "Bosh aylanishi"],
]

BRAND_PREFIXES = ["Neo", "Bio", "Vita", "Pro", "Maxi", "Super", "Ultra", "Metro", "Penta", "Alpha", "Omega", "Sigma", "Sano", "Vero", "Farma", "Medica", "Sanita", "Natura", "Salus", "Aqua"]
BRAND_SUFFIXES = ["zol", "max", "fort", "pro", "plus", "vit", "din", "sin", "tol", "sol", "mix", "pax", "dex", "nex", "lex", "vet", "cal", "gel", "rin", "set", "fen", "pin", "min", "lin", "nol", "zid", "cin"]

def gen_id(idx):
    return f"med-{idx}"

def gen_slug(name):
    return name.lower().replace(" ", "-").replace("'", "").replace("(", "").replace(")", "")[:60]

def gen_image_path(form):
    form_images = {
        "tabletka": "/images/medicines/paracetamol.jpg",
        "kapsula": "/images/medicines/capsule.jpg",
        "sirop": "/images/medicines/syrup.jpg",
        "suspenziya": "/images/medicines/syrup.jpg",
        "gel": "/images/medicines/gel.jpg",
        "maz": "/images/medicines/gel.jpg",
        "krem": "/images/medicines/gel.jpg",
        "sprey": "/images/medicines/spray.jpg",
        "damla": "/images/medicines/spray.jpg",
        "in'ektsiya": "/images/medicines/injection.jpg",
        "inhalyatsiya": "/images/medicines/inhaler.jpg",
        "inhalyator": "/images/medicines/inhaler.jpg",
        "shamcha": "/images/medicines/suppository.jpg",
        "pastilka": "/images/medicines/capsule.jpg",
        "eritma": "/images/medicines/spray.jpg",
        "paket": "/images/medicines/syrup.jpg",
        "pasta": "/images/medicines/gel.jpg",
        "tomchi": "/images/medicines/spray.jpg",
        "shampun": "/images/medicines/gel.jpg",
        "toothpaste": "/images/medicines/gel.jpg",
        "jel": "/images/medicines/gel.jpg",
        "serum": "/images/medicines/spray.jpg",
        "tonik": "/images/medicines/spray.jpg",
        "losion": "/images/medicines/syrup.jpg",
        "atir": "/images/medicines/spray.jpg",
        "yoqa": "/images/medicines/capsule.jpg",
        "niqob": "/images/medicines/gel.jpg",
        "balzam": "/images/medicines/gel.jpg",
        "konditsioner": "/images/medicines/gel.jpg",
        "foam": "/images/medicines/syrup.jpg",
        "digi": "/images/medicines/capsule.jpg",
        "kompressor": "/images/medicines/inhaler.jpg",
        "avto": "/images/medicines/capsule.jpg",
        "elctrik": "/images/medicines/capsule.jpg",
        "cheklangan": "/images/medicines/capsule.jpg",
        "dastgoh": "/images/medicines/inhaler.jpg",
    }
    return form_images.get(form, "/images/medicines/paracetamol.jpg")

def gen_price():
    return random.choice([
        random.randint(500, 5000),
        random.randint(5000, 15000),
        random.randint(15000, 35000),
        random.randint(35000, 80000),
        random.randint(80000, 200000),
    ])

def gen_rating():
    return round(random.uniform(3.5, 5.0), 1)

def gen_review_count():
    return random.randint(5, 800)

def gen_brand_name():
    return f"{random.choice(BRAND_PREFIXES)}{random.choice(BRAND_SUFFIXES)}"

PHARMACY_NAMES = [
    "Farmalife Dorixona", "Sog'lik Dorixona", "Dorixona 777",
    "Aziza Dorixona", "Davolux Dorixona", "Hayot Dorixona",
    "Shifokor Dorixona", "Salomatlik Dorixona", "Farm-Dorixona",
    "O'zbekiston Dorixona", "Milliy Dorixona", "Eco Dorixona",
    "Ravon Dorixona", "Tez yordam Dorixona", "Plus Dorixona",
]

def generate_all():
    medicines = []
    medicine_prices = {}
    idx = 1
    
    all_cats = {**NEW_CATEGORIES}
    
    for category, drugs in all_cats.items():
        for drug_tuple in drugs:
            if len(drug_tuple) == 4:
                drug_name, generic, dosages, forms = drug_tuple
            else:
                drug_name, generic, dosages = drug_tuple
                forms = ["tabletka"]
            
            for dosage in dosages:
                form = random.choice(forms)
                country = random.choice(COUNTRIES)
                manufacturer = random.choice(MANUFACTURERS[country])
                name = f"{drug_name} {dosage}"
                price = gen_price()
                
                medicine = {
                    "id": gen_id(idx),
                    "name": name,
                    "slug": gen_slug(name),
                    "description": f"{name} — {generic} asosidagi sifatli dori vositasi. {category} kategoriyasiga kiradi.",
                    "category": category,
                    "form": form,
                    "dosage": dosage,
                    "unitPrice": price,
                    "oldPrice": price * 1.2 if random.random() < 0.3 else price * 1.15,
                    "isAvailable": random.random() > 0.1,
                    "rating": gen_rating(),
                    "reviewCount": gen_review_count(),
                    "image": gen_image_path(form),
                    "manufacturer": manufacturer,
                    "country": country,
                    "prescriptionRequired": random.random() < 0.3,
                    "isPopular": random.random() < 0.08,
                    "isFeatured": random.random() < 0.04,
                    "discount": random.randint(0, 25) if random.random() < 0.3 else 0,
                    "unit": "tabletka" if form in ["tabletka", "kapsula"] else form,
                    "packSize": random.choice([1, 2, 3, 5, 10, 20, 30, 60, 90, 100]),
                    "minimumOrder": 1,
                }
                medicines.append(medicine)
                
                # Prices from pharmacies
                price_list = []
                for _ in range(random.randint(3, 8)):
                    price_list.append({
                        "pharmacyId": f"ph-{random.randint(1, 152)}",
                        "pharmacyName": random.choice(PHARMACY_NAMES),
                        "pharmacyLogo": f"/images/pharmacy-{random.randint(1, 12)}.svg",
                        "pharmacyRating": round(random.uniform(4.0, 5.0), 1),
                        "price": price + random.randint(-int(price * 0.15), int(price * 0.2)),
                        "originalPrice": price + random.randint(0, int(price * 0.3)),
                        "discount": random.randint(0, 25),
                        "deliveryFee": random.choice([0, 5000, 10000, 15000]),
                        "deliveryTime": random.choice(["20 daqiqa", "30 daqiqa", "1 soat", "1.5 soat", "2 soat"]),
                        "isAvailable": random.random() > 0.15,
                        "stockQuantity": random.randint(0, 200),
                        "distance": round(random.uniform(0.5, 15.0), 1),
                    })
                medicine_prices[gen_id(idx)] = price_list
                idx += 1
    
    # Fill to 15k with additional brand names
    while len(medicines) < 15000:
        cat = random.choice(list(all_cats.keys()))
        base_name = gen_brand_name()
        dosage = random.choice(["50mg", "100mg", "200mg", "250mg", "500mg", "1g", "5ml", "10ml", "20ml"])
        form = random.choice(["tabletka", "kapsula", "sirop", "gel", "sprey", "in'ektsiya", "maz", "krem", "damla"])
        country = random.choice(COUNTRIES)
        manufacturer = random.choice(MANUFACTURERS[country])
        name = f"{base_name} {dosage}"
        price = gen_price()
        
        medicine = {
            "id": gen_id(idx),
            "name": name,
            "slug": gen_slug(name),
            "description": f"{name} — {cat} kategoriyasiga kiruvchi sifatli dori vositasi.",
            "category": cat,
            "form": form,
            "dosage": dosage,
            "unitPrice": price,
            "oldPrice": price * 1.2 if random.random() < 0.3 else price * 1.15,
            "isAvailable": random.random() > 0.1,
            "rating": gen_rating(),
            "reviewCount": gen_review_count(),
            "image": gen_image_path(form),
            "manufacturer": manufacturer,
            "country": country,
            "prescriptionRequired": random.random() < 0.25,
            "isPopular": random.random() < 0.08,
            "isFeatured": random.random() < 0.04,
            "discount": random.randint(0, 25) if random.random() < 0.3 else 0,
            "unit": "tabletka" if form in ["tabletka", "kapsula"] else form,
            "packSize": random.choice([1, 2, 3, 5, 10, 20, 30, 60, 90, 100]),
            "minimumOrder": 1,
        }
        medicines.append(medicine)
        
        price_list = []
        for _ in range(random.randint(3, 8)):
            price_list.append({
                "pharmacyId": f"ph-{random.randint(1, 152)}",
                "pharmacyName": random.choice(PHARMACY_NAMES),
                "pharmacyLogo": f"/images/pharmacy-{random.randint(1, 12)}.svg",
                "pharmacyRating": round(random.uniform(4.0, 5.0), 1),
                "price": price + random.randint(-int(price * 0.15), int(price * 0.2)),
                "originalPrice": price + random.randint(0, int(price * 0.3)),
                "discount": random.randint(0, 25),
                "deliveryFee": random.choice([0, 5000, 10000, 15000]),
                "deliveryTime": random.choice(["20 daqiqa", "30 daqiqa", "1 soat", "1.5 soat", "2 soat"]),
                "isAvailable": random.random() > 0.15,
                "stockQuantity": random.randint(0, 200),
                "distance": round(random.uniform(0.5, 15.0), 1),
            })
        medicine_prices[gen_id(idx)] = price_list
        idx += 1
    
    return medicines, medicine_prices

if __name__ == "__main__":
    medicines, prices = generate_all()
    
    with open('src/lib/generated-data.json') as f:
        data = json.load(f)
    
    data['generatedMedicines'] = medicines
    data['generatedMedicinePrices'] = prices
    
    with open('src/lib/generated-data.json', 'w') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    cats = {}
    for m in medicines:
        cats[m['category']] = cats.get(m['category'], 0) + 1
    
    print(f"Total medicines: {len(medicines)}")
    print(f"Total price entries: {len(prices)}")
    print(f"Categories: {len(cats)}")
    for c in sorted(cats.keys()):
        print(f"  {c}: {cats[c]}")
