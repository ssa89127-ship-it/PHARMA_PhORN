#!/usr/bin/env python3
"""Generate 10,000+ realistic medicine entries for PHARMA_PhORN platform."""
import json
import random
import hashlib
import os

random.seed(42)

# ─── Real pharmaceutical data ────────────────────────────────────────────────
GENERIC_NAMES = {
    "Og'riq qoldiruvchi": [
        ("Paratsetamol", "Paratsetamol", ["200mg", "250mg", "500mg", "1g"], ["tabletka", "suspenziya", "sirop", "shamcha"]),
        ("Ibuprofen", "Ibuprofen", ["200mg", "400mg", "600mg"], ["tabletka", "kapsula", "gel", "suspensiya"]),
        ("Nurofen", "Ibuprofen", ["200mg", "400mg"], ["tabletka", "kapsula"]),
        ("Diklofenak", "Diklofenak", ["25mg", "50mg", "100mg"], ["tabletka", "kapsula", "gel", "damla"]),
        ("Ketorolak", "Ketorolak", ["10mg"], ["tabletka", "in'ektsiya"]),
        ("Analgin", "Metamizol natriy", ["500mg"], ["tabletka", "in'ektsiya"]),
        ("Nimesulid", "Nimesulid", ["100mg"], ["tabletka", "gel"]),
        ("Piroksikam", "Piroksikam", ["10mg", "20mg"], ["tabletka", "gel"]),
        ("Ketoprofen", "Ketoprofen", ["25mg", "50mg", "100mg"], ["tabletka", "kapsula", "gel"]),
        ("Flurbiprofen", "Flurbiprofen", ["50mg", "100mg"], ["tabletka"]),
        ("Lornoksikam", "Lornoksikam", ["4mg", "8mg"], ["tabletka", "in'ektsiya"]),
        ("Deksametazon", "Deksametazon", ["0.5mg", "4mg", "8mg"], ["tabletka", "in'ektsiya", "damla"]),
        ("Prednizolon", "Prednizolon", ["5mg", "10mg", "20mg", "50mg"], ["tabletka", "in'ektsiya"]),
        ("Metildop", "Metildop", ["250mg"], ["tabletka"]),
    ],
    "Antibiotiklar": [
        ("Amoksitsillin", "Amoksitsillin", ["250mg", "500mg", "1g"], ["tabletka", "kapsula", "suspenziya"]),
        ("Azitromitsin", "Azitromitsin", ["250mg", "500mg"], ["tabletka", "kapsula"]),
        ("Seftriakson", "Seftriakson", ["250mg", "500mg", "1g", "2g"], ["in'ektsiya"]),
        ("Tsiprofloksatsin", "Tsiprofloksatsin", ["250mg", "500mg", "750mg"], ["tabletka", "in'ektsiya"]),
        ("Doksitsiklin", "Doksitsiklin", ["100mg"], ["tabletka", "kapsula"]),
        ("Klaritromitsin", "Klaritromitsin", ["250mg", "500mg"], ["tabletka"]),
        ("Flemoksin", "Amoksitsillin", ["250mg", "500mg", "1g"], ["tabletka"]),
        ("Supraks", "Tsefiksim", ["200mg", "400mg"], ["kapsula", "suspenziya"]),
        ("Abaktal", "Tsefpoksim", ["200mg", "400mg"], ["tabletka"]),
        ("Ampitsillin", "Ampitsillin", ["250mg", "500mg"], ["tabletka", "kapsula"]),
        ("Ampitsillin-Sulbaktam", "Ampitsillin/Sulbaktam", ["750mg", "1.5g"], ["in'ektsiya"]),
        ("Gentamitsin", "Gentamitsin", ["40mg", "80mg"], ["in'ektsiya", "damla"]),
        ("Eritromitsin", "Eritromitsin", ["250mg", "500mg"], ["tabletka"]),
        ("Metronidazol", "Metronidazol", ["250mg", "500mg"], ["tabletka", "in'ektsiya"]),
        ("Klindamitsin", "Klindamitsin", ["150mg", "300mg"], ["kapsula", "in'ektsiya"]),
        ("Furazolidon", "Furazolidon", ["50mg", "100mg"], ["tabletka"]),
        ("Norfloksatsin", "Norfloksatsin", ["400mg"], ["tabletka"]),
        ("Ofloksatsin", "Ofloksatsin", ["200mg", "400mg"], ["tabletka", "in'ektsiya"]),
        ("Levofloksatsin", "Levofloksatsin", ["250mg", "500mg", "750mg"], ["tabletka", "in'ektsiya"]),
        ("Moksifloksatsin", "Moksifloksatsin", ["400mg"], ["tabletka"]),
        ("Imipenem", "Imipenem/Cilastatin", ["500mg", "1g"], ["in'ektsiya"]),
        ("Meropenem", "Meropenem", ["1g"], ["in'ektsiya"]),
        ("Vankomitsin", "Vankomitsin", ["500mg", "1g"], ["in'ektsiya"]),
        ("Linezolid", "Linezolid", ["400mg", "600mg"], ["tabletka"]),
        ("Ko-trimoksazol", "Sulfametoksazol/Trimetoprim", ["480mg", "960mg"], ["tabletka"]),
        ("Furatsilin", "Nitrofural", ["0.2%"], ["eritma", "shamcha"]),
        ("Kloramfenikol", "Kloramfenikol", ["250mg", "500mg"], ["tabletka"]),
        ("Neomitsin", "Neomitsin", ["500mg"], ["tabletka", "maz"]),
    ],
    "Yurak-qon tomir": [
        ("Amlodipin", "Amlodipin", ["5mg", "10mg"], ["tabletka"]),
        ("Enalapril", "Enalapril", ["5mg", "10mg", "20mg"], ["tabletka"]),
        ("Lisinopril", "Lisinopril", ["5mg", "10mg", "20mg"], ["tabletka"]),
        ("Losartan", "Losartan", ["50mg", "100mg"], ["tabletka"]),
        ("Valsartan", "Valsartan", ["80mg", "160mg", "320mg"], ["tabletka"]),
        ("Bisoprolol", "Bisoprolol", ["2.5mg", "5mg", "10mg"], ["tabletka"]),
        ("Metoprolol", "Metoprolol", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Atenolol", "Atenolol", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Verapamil", "Verapamil", ["40mg", "80mg"], ["tabletka"]),
        ("Diltiazem", "Diltiazem", ["60mg", "90mg", "120mg"], ["tabletka"]),
        ("Nitroglycerin", "Nitroglycerin", ["0.5mg"], ["tabletka", "sprey"]),
        ("Validol", "Validol", ["60mg"], ["tabletka"]),
        ("Kordaron", "Amiodaron", ["200mg"], ["tabletka"]),
        ("Diroton", "Lizinopril", ["5mg", "10mg", "20mg"], ["tabletka"]),
        ("Prestarium", "Perindopril", ["5mg", "10mg"], ["tabletka"]),
        ("Norvasc", "Amlodipin", ["5mg", "10mg"], ["tabletka"]),
        ("Vazar", "Valsartan", ["80mg", "160mg"], ["tabletka"]),
        ("Concor", "Bisoprolol", ["2.5mg", "5mg", "10mg"], ["tabletka"]),
        ("Corvalol", "Etamil bromizovalerianat", ["25ml"], ["eritma"]),
        ("Validol", "Validol", ["60mg"], ["tabletka"]),
        ("Aspirin Cardio", "Acetilsalitsil kislota", ["100mg"], ["tabletka"]),
        ("Clopidogrel", "Klopidogrel", ["75mg"], ["tabletka"]),
        ("Trombo ASS", "Acetilsalitsil kislota", ["100mg"], ["tabletka"]),
        ("Kardiomagnil", "Acetilsalitsil kislota/Magniy gidroksidi", ["75mg", "150mg"], ["tabletka"]),
        ("Warfarin", "Varfarin", ["2.5mg", "5mg"], ["tabletka"]),
        ("Dabigatran", "Dabigatran", ["75mg", "110mg", "150mg"], ["kapsula"]),
        ("Rivaroksaban", "Rivaroksaban", ["10mg", "15mg", "20mg"], ["tabletka"]),
        ("Atorvastatin", "Atorvastatin", ["10mg", "20mg", "40mg"], ["tabletka"]),
        ("Rosuvastatin", "Rosuvastatin", ["5mg", "10mg", "20mg"], ["tabletka"]),
        ("Simvastatin", "Simvastatin", ["10mg", "20mg", "40mg"], ["tabletka"]),
        ("Felodipin", "Felodipin", ["5mg", "10mg"], ["tabletka"]),
    ],
    "Ovqat hazm qilish": [
        ("Omeprazol", "Omeprazol", ["20mg", "40mg"], ["kapsula"]),
        ("Pantoprazol", "Pantoprazol", ["20mg", "40mg"], ["tabletka"]),
        ("Rabeprazol", "Rabeprazol", ["10mg", "20mg"], ["tabletka"]),
        ("Famotidin", "Famotidin", ["20mg", "40mg"], ["tabletka"]),
        ("Ranitidin", "Ranitidin", ["150mg", "300mg"], ["tabletka"]),
        ("Maalox", "Alüminiy gidroksidi/Magniy gidroksidi", ["20ml"], ["suspenziya"]),
        ("Almagel", "Alüminiy gidroksidi/Magniy gidroksidi", ["170ml"], ["suspenziya"]),
        ("Gaviscon", "Natriy alginat", ["10ml"], ["suspenziya"]),
        ("Smecta", "Diosmektit", ["3g"], ["paket"]),
        ("Enterosgel", "Metilsilatik kislota", ["225g"], ["gel"]),
        ("Polysorb", "Kolloidli silika", ["3g", "6g", "9g", "12g"], ["paket"]),
        ("Lactofiltrum", "Laktuloza/Lignin", ["375mg"], ["tabletka"]),
        ("Fosfalugel", "Alüminiy fosfat", ["16g"], ["gel"]),
        ("De-Nol", "Vismut subtsitrat", ["120mg"], ["tabletka"]),
        ("Ultop", "Omeprazol", ["20mg", "40mg"], ["kapsula"]),
        ("Nexium", "Esomeprazol", ["20mg", "40mg"], ["tabletka"]),
        ("Creon", "Pancreatin", ["10000", "25000"], ["kapsula"]),
        ("Mezim", "Pancreatin", ["10000"], ["tabletka"]),
        ("Festal", "Pancreatin/Hemitsellulaz/Qora ot o'ti", ["tabletka"]),
        ("Enzistal", "Pancreatin/Hemitsellulaz/Qora ot o'ti", ["tabletka"]),
        ("Pankreatin", "Pancreatin", ["100mg"], ["tabletka"]),
        ("Trimedat", "Trimebutin", ["100mg", "200mg"], ["tabletka"]),
        ("Duspatalin", "Mebeverin", ["135mg", "200mg"], ["tabletka"]),
        ("Buscopan", "Hüskopolin bromid", ["10mg"], ["tabletka"]),
        ("No-Spa", "Drotaverin", ["40mg"], ["tabletka"]),
        ("Spasmoferon", "Drotaverin", ["40mg"], ["tabletka"]),
        ("Loperamid", "Loperamid", ["2mg"], ["tabletka"]),
        ("Imodium", "Loperamid", ["2mg"], ["kapsula"]),
        ("Smecta", "Diosmektit", ["3g"], ["paket"]),
        ("Linex", "Laktobatsilluslar", ["kapsula"]),
        ("Bifiform", "Bifidobakteriyalar", ["kapsula"]),
        ("Acipol", "Acidofilus laktobatsilluslar", ["kapsula"]),
        ("Hilak Forte", "Metabolitlar", ["30ml"], ["eritma"]),
        ("Baktisubtil", "Bacillus clausii", ["35mg"], ["kapsula"]),
        ("Motilium", "Domperidon", ["10mg"], ["tabletka"]),
        ("Zeercal", "Metoklopramid", ["10mg"], ["tabletka"]),
    ],
    "Vitaminlar": [
        ("Vitamin D3", "Kolekalsiferol", ["1000 IU", "2000 IU", "5000 IU"], ["tabletka", "kapsula", "eritma"]),
        ("Vitamin C", "Askorbin kislota", ["250mg", "500mg", "1g"], ["tabletka", "sharbat"]),
        ("Vitamin B12", "Kobalamin", ["1000mcg", "5000mcg"], ["tabletka", "in'ektsiya"]),
        ("Vitamin B6", "Piridoksin", ["50mg", "100mg"], ["tabletka", "in'ektsiya"]),
        ("Vitamin B1", "Tiamin", ["100mg"], ["tabletka", "in'ektsiya"]),
        ("Vitamin E", "Tokoferol", ["100 IU", "200 IU"], ["kapsula"]),
        ("Vitamin A", "Retinol", ["25000 IU"], ["kapsula"]),
        ("Vitamin K", "Fillokvinon", ["10mg"], ["tabletka", "in'ektsiya"]),
        ("Vitamin F", "Omega-3", ["1000mg"], ["kapsula"]),
        ("Supradyn", "Multivitamin", ["tabletka"]),
        ("Duovit", "Multivitamin", ["tabletka"]),
        ("Multitabs", "Multivitamin", ["tabletka"]),
        ("Revit", "Multivitamin", ["tabletka"]),
        ("Gendevit", "Multivitamin", ["tabletka"]),
        ("Complivit", "Multivitamin", ["tabletka"]),
        ("Centrum", "Multivitamin", ["tabletka"]),
        ("Alphabet", "Multivitamin", ["tabletka"]),
        ("Solgar", "Multivitamin", ["tabletka", "kapsula"]),
        ("Magnelis B6", "Magniy/Piridoksin", ["40mg"], ["tabletka"]),
        ("Magne B6", "Magniy/Piridoksin", ["100mg"], ["tabletka"]),
        ("Calcemin", "Kaltsiy/Vitamin D", ["tabletka"]),
        ("Calciemin Advance", "Kaltsiy/D3", ["tabletka"]),
        ("Oligovit", "Multivitamin", ["tabletka"]),
        ("Vitrum", "Multivitamin", ["tabletka"]),
        ("Ace-vit", "Askorbin kislota", ["250mg"], ["tabletka"]),
        ("Asvitol", "Askorbin kislota", ["250mg"], ["tabletka"]),
        ("Centeum", "Multivitamin", ["tabletka"]),
        ("Gerimaks", "Multivitamin", ["tabletka"]),
        ("Teraflex", "Glükozamin/Chondroitin", ["kapsula"]),
        ("Kalcemin", "Kaltsiy", ["tabletka"]),
        ("Doppelherz", "Multivitamin", ["tabletka", "kapsula"]),
        ("Femibion", "Multivitamin", ["tabletka"]),
        ("Elevit", "Multivitamin", ["tabletka"]),
        ("Vitasharm", "Multivitamin", ["tabletka"]),
        ("Orthomol", "Multivitamin", ["kapsula"]),
    ],
    "Teri kasalliklari": [
        ("Advantan", "Metilprednizolon", ["0.1%", "0.1%"], ["maz", "suspenziya"]),
        ("Elokom", "Mometazon", ["0.1%"], ["maz", "sprey"]),
        ("Triderm", "Klotrimazol/Gentamitsin/Betametazon", ["15g"], ["maz"]),
        ("Ketokonazol", "Ketokonazol", ["2%"], ["maz", "shampun"]),
        ("Nizoral", "Ketokonazol", ["2%"], ["maz", "shampun"]),
        ("Lamisil", "Terbinofin", ["1%"], ["maz", "sprey"]),
        ("Mikozoral", "Ketokonazol", ["2%"], ["maz", "shampun"]),
        ("Exoderil", "Naftifin", ["1%"], ["maz", "eritma"]),
        ("Pimafukort", "Natamitsin/Hidrokortizon", ["maz"]),
        ("Fenistil", "Dimetinden", ["0.1%"], ["gel"]),
        ("Psorilom", "Salitsil kislota", ["2%"], ["maz"]),
        ("Akriderm", "Betametazon", ["0.05%"], ["maz", "krem"]),
        ("Beloderm", "Betametazon", ["0.05%"], ["maz", "sprey"]),
        ("Sinaflan", "Flutsinolon", ["0.025%"], ["maz"]),
        ("Flucinar", "Flutsinolon", ["0.025%"], ["maz", "gel"]),
        ("Oksolin", "Oksolin", ["0.25%", "3%"], ["maz"]),
        ("Viferon", "Interferon alfa-2b", ["maz", "gel"]),
        ("Panthenol", "Dekspantenol", ["5%"], ["krem", "sprey"]),
        ("Bepanthen", "Dekspantenol", ["5%"], ["krem", "sprey"]),
        ("Depantol", "Dekspantenol", ["krem"]),
        ("Soloseril", "Dializat", ["maz", "gel"]),
        ("Metiluratsil", "Metiluratsil", ["maz", "shamcha"]),
        ("Levomekol", "Kloramfenikol/Metiluratsil", ["maz"]),
        ("Vishnevskiy maz", "Berkovitsa/Tezobrenol", ["maz"]),
        ("Ihtiol maz", "Ihtiol", ["10%"], ["maz"]),
    ],
    "Nafas olish": [
        ("Salbutamol", "Salbutamol", ["100mcg", "200mcg"], ["sprey", "nebulizatsiya"]),
        ("Berodual", "Ipratropiy/Fenoterol", ["20ml"], ["eritma"]),
        ("Pulmicort", "Budezonid", ["0.25mg", "0.5mg"], ["nebulizatsiya"]),
        ("Pulmicort Turbuhaler", "Budezonid", ["100mcg", "200mcg"], ["inhalyator"]),
        ("Fliksotid", "Flutikazon", ["50mcg", "125mcg", "250mcg"], ["sprey"]),
        ("Singulair", "Montelukast", ["4mg", "5mg", "10mg"], ["tabletka"]),
        ("Eufillin", "Eofillin", ["100mg", "200mg"], ["tabletka", "in'ektsiya"]),
        ("Teofedrin", "Teofillin/Efedrin", ["tabletka"]),
        ("Ambroksol", "Ambroksol", ["30mg", "60mg"], ["tabletka", "sirop"]),
        ("Lazolvan", "Ambroksol", ["30mg", "75mg"], ["tabletka", "sirop"]),
        ("ACC", "Atsetilsistein", ["100mg", "200mg", "600mg"], ["tabletka", "paket"]),
        ("Fluimutsil", "Atsetilsistein", ["100mg", "200mg"], ["tabletka"]),
        ("Bronchipret", "Efira/Sarmisus", ["sirop"]),
        ("Herbion", "Plantain/Primula", ["sirop"]),
        ("Stodal", "Homeopatik", ["sirop"]),
        ("Ascoril", "Salbutamol/Guaifenesin/Bromheksin", ["sirop"]),
        ("Bronholitin", "Efedrin/Glautsin", ["sirop"]),
        ("Erespal", "Fenspirid", ["80mg"], ["tabletka", "sirop"]),
        ("Cinnabsin", "Homeopatik", ["tabletka"]),
        ("Sinupret", "Homeopatik", ["tabletka", "tomchi"]),
        ("Nurofen Broncho", "Ibuprofen", ["200mg"], ["tabletka"]),
        ("Broncho Baks", "Homeopatik", ["tabletka"]),
        ("Prospan", "Efeushya ekstrakti", ["sirop"]),
        ("Gedelix", "Efira ekstrakti", ["sirop", "tomchi"]),
        ("Travisil", "Homeopatik", ["pastilka"]),
    ],
    "Qandli diabet": [
        ("Metformin", "Metformin", ["500mg", "850mg", "1000mg"], ["tabletka"]),
        ("Glucophage", "Metformin", ["500mg", "850mg", "1000mg"], ["tabletka"]),
        ("Siofor", "Metformin", ["500mg", "850mg", "1000mg"], ["tabletka"]),
        ("Glibenclamid", "Glibenclamid", ["5mg"], ["tabletka"]),
        ("Glipizid", "Glipizid", ["5mg"], ["tabletka"]),
        ("Glimepirid", "Glimepirid", ["1mg", "2mg", "3mg", "4mg"], ["tabletka"]),
        ("Amaril", "Glimepirid", ["1mg", "2mg", "3mg", "4mg"], ["tabletka"]),
        ("Januvia", "Sitagliptin", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Galvus", "Vildagliptin", ["50mg"], ["tabletka"]),
        ("Ongliza", "Saxagliptin", ["2.5mg", "5mg"], ["tabletka"]),
        ("Victoza", "Liraglutid", ["6mg/ml"], ["in'ektsiya"]),
        ("Byetta", "Exenatid", ["5mcg", "10mcg"], ["in'ektsiya"]),
        ("Insulin NovoRapid", "Insulin aspart", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Lantus", "Insulin glargine", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Humalog", "Insulin lyspro", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Protaphane", "Insulin izofan", ["100 IU/ml"], ["in'ektsiya"]),
        ("Insulin Actrapid", "Insulin inson", ["100 IU/ml"], ["in'ektsiya"]),
        ("Diabeton", "Gliklazid", ["80mg"], ["tabletka"]),
        ("Reklid", "Gliklazid", ["80mg"], ["tabletka"]),
        ("Xenical", "Orlistat", ["120mg"], ["kapsula"]),
        ("Orsoten", "Orlistat", ["60mg", "120mg"], ["kapsula"]),
        ("Goldline", "Sibutramin", ["10mg", "15mg"], ["kapsula"]),
        ("Meridia", "Sibutramin", ["10mg", "15mg"], ["kapsula"]),
    ],
    "Asab tizimi": [
        ("Afobazol", "Fabomotizol", ["10mg"], ["tabletka"]),
        ("Grandaxin", "Tofizolam", ["50mg"], ["tabletka"]),
        ("Gidazepam", "Gidazepam", ["20mg"], ["tabletka"]),
        ("Phenibut", "Fenibut", ["250mg"], ["tabletka"]),
        ("Tenoten", "Homeopatik", ["tabletka"]),
        ("Nootropil", "Piratsetam", ["400mg", "800mg", "1200mg"], ["tabletka", "in'ektsiya"]),
        ("Cinnarizin", "Tsinnarizin", ["25mg"], ["tabletka"]),
        ("Stugeron", "Tsinnarizin", ["25mg"], ["tabletka"]),
        ("Oksazepam", "Oksazepam", ["10mg", "25mg"], ["tabletka"]),
        ("Amitriptilin", "Amitriptilin", ["25mg", "50mg"], ["tabletka"]),
        ("Fluoksetin", "Fluoksetin", ["20mg"], ["kapsula"]),
        ("Sertralin", "Sertralin", ["50mg", "100mg"], ["tabletka"]),
        ("Escitalopram", "Escitalopram", ["5mg", "10mg", "20mg"], ["tabletka"]),
        ("Venlafaksin", "Venlafaksin", ["37.5mg", "75mg", "150mg"], ["kapsula"]),
        ("Duloksetin", "Duloksetin", ["30mg", "60mg"], ["kapsula"]),
        ("Paxil", "Paroksetin", ["20mg"], ["tabletka"]),
        ("Zoloft", "Sertralin", ["50mg", "100mg"], ["tabletka"]),
        ("Celexa", "Tsitalopram", ["10mg", "20mg"], ["tabletka"]),
        ("Limontar", "Süksinik/Ontsa kislota", ["tabletka"]),
        ("Stressovit", "Oat ekstrakti", ["kapsula"]),
        ("Novo-Passit", "Valeriana/Humulus", ["tabletka", "eritma"]),
        ("Persen", "Valeriana/Melissa/Menta", ["kapsula"]),
        ("Valeriana", "Valeriana", ["tabletka", "tomchi"]),
        ("Passiflora", "Passiflora", ["tabletka"]),
        ("Conium", "Conium maculatum", ["tabletka"]),
    ],
    "Gormonlar": [
        ("L-tiroksin", "Levotiroksin", ["25mcg", "50mcg", "100mcg"], ["tabletka"]),
        ("Eutiroks", "Levotiroksin", ["25mcg", "50mcg", "75mcg", "100mcg"], ["tabletka"]),
        ("Tireotom", "Levotiroksin", ["75mcg"], ["tabletka"]),
        ("Deksametazon", "Deksametazon", ["0.5mg"], ["tabletka"]),
        ("Prednizolon", "Prednizolon", ["5mg"], ["tabletka"]),
        ("Hidrokortizon", "Hidrokortizon", ["20mg"], ["tabletka"]),
        ("Metipred", "Metilprednizolon", ["4mg", "8mg", "16mg"], ["tabletka"]),
        ("Diprospan", "Betametazon", ["1ml"], ["in'ektsiya"]),
        ("Kenalog", "Triamsinolon", ["40mg", "80mg"], ["in'ektsiya"]),
        ("Provera", "Medroksiprogesteron", ["2.5mg", "5mg", "10mg"], ["tabletka"]),
        ("Duphaston", "Dydrogesteron", ["10mg"], ["tabletka"]),
        ("Utrozhestan", "Progesteron", ["100mg", "200mg"], ["kapsula"]),
        ("Clomid", "Klomifen", ["50mg"], ["tabletka"]),
        ("Metformin", "Metformin", ["500mg"], ["tabletka"]),
        ("Tamoxifen", "Tamoksifen", ["10mg", "20mg"], ["tabletka"]),
        ("Anastrozol", "Anastrozol", ["1mg"], ["tabletka"]),
        ("Letrozol", "Letrozol", ["2.5mg"], ["tabletka"]),
    ],
    "Immunitet": [
        ("Interferon", "Interferon alfa-2b", ["in'ektsiya"]),
        ("Viferon", "Interferon alfa-2b", ["maz", "gel", "shamcha"]),
        ("Genferon", "Interferon alfa-2b", ["shamcha"]),
        ("Kipferon", "Interferon alfa-2b", ["shamcha"]),
        ("Anaferon", "Homeopatik", ["tabletka"]),
        ("Ergoferon", "Homeopatik", ["tabletka"]),
        ("Arbidol", "Umifenovir", ["100mg", "200mg"], ["kapsula", "tabletka"]),
        ("Tamiflu", "Oseltamivir", ["30mg", "45mg", "75mg"], ["kapsula"]),
        ("Relenza", "Zanamivir", ["5mg"], ["inhalyatsiya"]),
        ("Ingavirin", "Imidazolil-etanamid", ["90mg"], ["kapsula"]),
        ("Kagocel", "Kagotsel", ["12mg"], ["tabletka"]),
        ("Polyoxidonium", "Azoksimer bromid", ["6mg", "12mg"], ["tabletka", "in'ektsiya"]),
        ("Immunal", "Echinacea purpurea", ["tomchi", "tabletka"]),
        ("Echinacea", "Echinacea", ["tabletka", "tomchi"]),
        ("Timalin", "Timus ekstrakti", ["in'ektsiya"]),
        ("Thymogen", "Alfa-glutamil-triptofan", ["in'ektsiya"]),
        ("Lizonil", "Polisakcharidlar", ["in'ektsiya"]),
        ("Imudon", "Lizatlar", ["tabletka"]),
        ("IRS-19", "Bakterial lizatlar", ["sprey"]),
        ("Broncho-munal", "Bakterial lizatlar", ["kapsula"]),
        ("Ribomunil", "Bakterial ribosomalar", ["tabletka"]),
    ],
    "Ko'z dorilari": [
        ("Tobrex", "Tobramitsin", ["0.3%"], ["damla", "maz"]),
        ("Albucid", "Sulfatsetamid", ["10%", "20%"], ["damla"]),
        ("Floksal", "Ofloksatsin", ["0.3%"], ["damla", "maz"]),
        ("Tobradex", "Tobramitsin/Deksametazon", ["damla", "maz"]),
        ("Deksametazon", "Deksametazon", ["0.1%"], ["damla"]),
        ("Ketotifen", "Ketotifen", ["0.025%"], ["damla"]),
        ("Opatanol", "Olopatadin", ["0.1%"], ["damla"]),
        ("Okumetil", "Tsinksulfat/Adrenalin", ["damla"]),
        ("Vizin", "Tetrahüdrozolin", ["0.05%"], ["damla"]),
        ("Octilia", "Adrenalin", ["damla"]),
        ("Emoksipin", "Metiletilpiridinol", ["1%"], ["damla"]),
        ("Tauphon", "Taurin", ["4%"], ["damla"]),
        ("Katalin", "Pirikarbinon", ["1.5%"], ["damla"]),
        ("Actipol", "Para-aminobenzoat", ["0.007%"], ["damla"]),
        ("Vitafakol", "Nikotinamid/ATP", ["damla"]),
        ("Quinax", "Acetazolamid", ["damla"]),
        ("Vitodisol", "Askorbin kislota", ["damla"]),
        ("Irifrin", "Fenilefrin", ["2.5%", "10%"], ["damla"]),
        ("Midriatsil", "Tropikamid", ["0.5%", "1%"], ["damla"]),
        ("Cyclomed", "Tsiklopentolat", ["1%"], ["damla"]),
    ],
    "Otolaringologiya": [
        ("Otipax", "Fenazon/Lidokain", ["16ml"], ["damla"]),
        ("Otinus", "Fenazon/Lidokain", ["damla"]),
        ("Garazon", "Betametazon/Gentamitsin", ["5ml"], ["damla"]),
        ("Sofradex", "Frametsetin/Deksametazon", ["damla"]),
        ("Normaks", "Norfloksatsin", ["0.3%"], ["damla"]),
        ("Ciprolet", "Tsiprofloksatsin", ["0.3%"], ["damla"]),
        ("Tizin", "Tetrahüdrozolin", ["0.05%", "0.1%"], ["sprey"]),
        ("Nazivin", "Oksimetazolin", ["0.01%", "0.025%", "0.05%"], ["sprey", "damla"]),
        ("Naphthyzinum", "Nafazolin", ["0.05%", "0.1%"], ["sprey", "damla"]),
        ("Galazolin", "Ksillometazolin", ["0.05%", "0.1%"], ["sprey", "damla"]),
        ("Xylomet", "Ksillometazolin", ["0.1%"], ["sprey"]),
        ("Afrin", "Oksimetazolin", ["0.05%"], ["sprey"]),
        ("Snoop", "Ksillometazolin", ["0.05%"], ["sprey"]),
        ("Rinonorm", "Ksillometazolin", ["0.05%", "0.1%"], ["sprey"]),
        ("Pinosol", "Pine/Eucalyptus oil", ["damla", "sprey"]),
        ("Sinupret", "Homeopatik", ["tabletka", "tomchi"]),
        ("Euphorbium", "Homeopatik", ["sprey"]),
        ("Isopro", "Izotipronizol", ["sprey"]),
        ("Lugol", "Yod", ["eritma"]),
        ("Geksoral", "Geksetidin", ["0.1%", "0.2%"], ["eritma", "sprey"]),
        ("Tantum Verde", "Bendazol", ["0.15%"], ["sprey"]),
        ("Strepsils", "Diklorobenzilmetanol", ["pastilka"]),
        ("Faringosept", "Ambazol", ["pastilka"]),
        ("Grammidin", "Gramitsidin", ["pastilka"]),
        ("Septolet", "Benzokain/Mentol", ["pastilka"]),
    ],
    "Urologiya": [
        ("Canephron", "Centauriya/Meyron/Leonur", ["tabletka", "tomchi"]),
        ("Cyston", "Homeopatik", ["tabletka"]),
        ("Monurel", "Kranberi ekstrakti", ["tabletka"]),
        ("Nitroksolin", "Nitroksolin", ["50mg"], ["tabletka"]),
        ("5-NOK", "Nitroksolin", ["50mg"], ["tabletka"]),
        ("Furadonin", "Nitrofurantoin", ["50mg", "100mg"], ["tabletka"]),
        ("Furagin", "Furazidin", ["50mg"], ["tabletka"]),
        ("Prostanorm", "Ekstraktlar", ["tabletka", "tomchi"]),
        ("Prostamol", "Serenoa ekstrakti", ["320mg"], ["kapsula"]),
        ("Prostopin", "Propolis/Perga", ["shamcha"]),
        ("Vezikar", "Solifenacin", ["5mg", "10mg"], ["tabletka"]),
        ("Driptan", "Oksibutinin", ["5mg"], ["tabletka"]),
        ("Spasmex", "Trospiy xlorid", ["5mg", "10mg", "15mg"], ["tabletka"]),
        ("Uroprofit", "Kranberi/Vitamin C", ["kapsula"]),
        ("Urolesan", "Ekstraktlar", ["tomchi", "kapsula"]),
        ("Fitolizin", "O'simlik ekstrakti", ["pasta"]),
        ("Blemaren", "Natriy sitrat", ["paket"]),
        ("Allopurinol", "Allopurinol", ["100mg", "300mg"], ["tabletka"]),
        ("Colchicine", "Kolxitsin", ["0.5mg", "1mg"], ["tabletka"]),
    ],
    "Bolalar": [
        ("Paratsetamol bolalar", "Paratsetamol", ["100mg", "120mg", "250mg"], ["suspenziya", "sirop"]),
        ("Ibuprofen bolalar", "Ibuprofen", ["100mg"], ["suspenziya"]),
        ("Nurofen bolalar", "Ibuprofen", ["100mg/5ml"], ["suspenziya"]),
        ("Bofen bolalar", "Ibuprofen", ["100mg"], ["suspenziya"]),
        ("Cefekon", "Paratsetamol", ["100mg", "250mg", "500mg"], ["shamcha"]),
        ("Viferon bolalar", "Interferon", ["shamcha"]),
        ("Anaferon bolalar", "Homeopatik", ["tabletka"]),
        ("Ergoferon bolalar", "Homeopatik", ["tabletka"]),
        ("Arbidol bolalar", "Umifenovir", ["100mg"], ["kapsula"]),
        ("Lazolvan bolalar", "Ambroksol", ["15mg/5ml"], ["sirop"]),
        ("ACC bolalar", "Atsetilsistein", ["100mg", "200mg"], ["paket"]),
        ("Ambrobene bolalar", "Ambroksol", ["7.5mg/2ml"], ["sirop", "eritma"]),
        ("Prospan bolalar", "Efeushya", ["sirop"]),
        ("Gedelix bolalar", "Efira", ["sirop"]),
        ("Smecta bolalar", "Diosmektit", ["3g"], ["paket"]),
        ("Enterosgel bolalar", "Metilsilatik kislota", ["225g"], ["gel"]),
        ("Linex bolalar", "Laktobatsilluslar", ["kapsula"]),
        ("Bifiform bolalar", "Bifidobakteriyalar", ["kapsula"]),
        ("Hilak Forte bolalar", "Metabolitlar", ["30ml"], ["eritma"]),
        ("Mezim bolalar", "Pancreatin", ["10000"], ["tabletka"]),
        ("Supraks bolalar", "Tsefiksim", ["100mg"], ["suspenziya"]),
        ("Flemoksin bolalar", "Amoksitsillin", ["125mg", "250mg"], ["suspenziya"]),
        ("Azitromitsin bolalar", "Azitromitsin", ["200mg"], ["suspenziya"]),
        ("Zodak bolalar", "Setirizin", ["5mg"], ["sprey", "tomchi"]),
        ("Zyrtec bolalar", "Setirizin", ["5mg"], ["tomchi"]),
        ("Suprastin bolalar", "Kloropiramin", ["25mg"], ["tabletka"]),
    ],
    "Onkologiya": [
        ("Methotrexate", "Metotreksat", ["2.5mg", "5mg", "10mg"], ["tabletka", "in'ektsiya"]),
        ("Tamoxifen", "Tamoksifen", ["20mg"], ["tabletka"]),
        ("Anastrozol", "Anastrozol", ["1mg"], ["tabletka"]),
        ("Letrozol", "Letrozol", ["2.5mg"], ["tabletka"]),
        ("Capecitabine", "Kapetsitabin", ["150mg", "500mg"], ["tabletka"]),
        ("Imatinib", "Imatinib", ["100mg", "400mg"], ["tabletka"]),
        ("Erlotinib", "Erlotinib", ["100mg", "150mg"], ["tabletka"]),
        ("Sorafenib", "Sorafenib", ["200mg"], ["tabletka"]),
        ("Sunitinib", "Sunitinib", ["12.5mg", "25mg", "37.5mg", "50mg"], ["kapsula"]),
        ("Bortezomib", "Bortezomib", ["3.5mg"], ["in'ektsiya"]),
        ("Lenalidomide", "Lenalidomide", ["5mg", "10mg", "15mg", "25mg"], ["kapsula"]),
        ("Temozolomide", "Temozolomid", ["20mg", "100mg", "250mg"], ["kapsula"]),
        ("Pazopanib", "Pazopanib", ["200mg", "400mg"], ["tabletka"]),
        ("Vandetanib", "Vandetanib", ["100mg", "200mg"], ["tabletka"]),
        ("Cabozantinib", "Kabozantinib", ["20mg", "40mg", "60mg"], ["kapsula"]),
        ("Pembrolizumab", "Pembrolizumab", ["25mg/ml"], ["in'ektsiya"]),
        ("Nivolumab", "Nivolumab", ["10mg/ml"], ["in'ektsiya"]),
        ("Atezolizumab", "Atezolizumab", ["60mg/ml"], ["in'ektsiya"]),
    ],
    "Ortopediya": [
        ("Diklofenak gel", "Diklofenak", ["1%", "5%"], ["gel", "maz"]),
        ("Ketonal", "Ketoprofen", ["100mg", "150mg"], ["kapsula", "gel"]),
        ("Finalgon", "Nonivamid/Nikoboksil", ["maz"]),
        ("Capsicam", "Kapsaisin", ["maz"]),
        ("Viprosal", "Kapsaisin/Solbriya", ["maz"]),
        ("Chondroitin", "Xondroitin sulfat", ["250mg", "500mg"], ["kapsula", "tabletka"]),
        ("Teraflex", "Glükozamin/Xondroitin", ["kapsula"]),
        ("Don", "Glükozamin", ["1500mg"], ["paket"]),
        ("Artra", "Xondroitin/Glükozamin", ["tabletka"]),
        ("Structum", "Xondroitin sulfat", ["500mg"], ["kapsula"]),
        ("Movalis", "Meloksikam", ["7.5mg", "15mg"], ["tabletka", "in'ektsiya"]),
        ("Nimulid", "Nimesulid", ["100mg"], ["tabletka", "gel"]),
        ("Dolgit", "Ibuprofen", ["5%"], ["krem"]),
        ("Deep Relief", "Ibuprofen/Levomenthol", ["gel"]),
        ("Voltaren", "Diklofenak", ["25mg", "50mg"], ["tabletka", "gel"]),
        ("Ortofen", "Diklofenak", ["25mg"], ["tabletka", "gel"]),
        ("Naklofen", "Diklofenak", ["25mg", "50mg", "100mg"], ["kapsula", "in'ektsiya"]),
        ("Arkoksia", "Etorikoksib", ["60mg", "90mg", "120mg"], ["tabletka"]),
    ],
    "Ginekologiya": [
        ("Clotrimazole", "Klotrimazol", ["100mg", "500mg"], ["tabletka", "maz"]),
        ("Pimafucin", "Natamitsin", ["100mg"], ["shamcha", "krem"]),
        ("Terzhinan", "Nestatine/Ternidazol/Neomitsin", ["shamcha"]),
        ("Geksikon", "Hlorgeksidin", ["0.05%"], ["eritma", "shamcha"]),
        ("Polygynax", "Neomitsin/Nystatin/Polimiksin B", ["shamcha"]),
        ("Klion", "Metronidazol", ["250mg"], ["tabletka"]),
        ("Trichopol", "Metronidazol", ["250mg", "500mg"], ["tabletka"]),
        ("Fluomizin", "Dequaliniy xlorid", ["10mg"], ["shamcha"]),
        ("Lactonorm", "Laktobatsilluslar", ["kapsula"]),
        ("Vaginorm", "Laktik kislota", ["shamcha"]),
        ("Cycloproginova", "Progesteron", ["jel"]),
        ("Duphaston", "Dydrogesteron", ["10mg"], ["tabletka"]),
        ("Utrozhestan", "Progesteron", ["100mg", "200mg"], ["kapsula"]),
        ("Postinor", "Levonorgestrel", ["0.75mg"], ["tabletka"]),
        ("Escapelle", "Levonorgestrel", ["1.5mg"], ["tabletka"]),
        ("Yarina", "Drospirenon/Ethinylestradiol", ["tabletka"]),
        ("Jeanine", "Dienogest/Ethinylestradiol", ["tabletka"]),
        ("Regulon", "Desogestrel/Ethinylestradiol", ["tabletka"]),
        ("Novinet", "Desogestrel/Ethinylestradiol", ["tabletka"]),
        ("Lindinet", "Gestoden/Ethinylestradiol", ["tabletka"]),
    ],
    "Stomatologiya": [
        ("Metragil Dent", "Metronidazol/Chlorgeksidin", ["toothpaste"]),
        ("Lacalut", "Alüminiy laktat", ["toothpaste"]),
        ("Sensodyne", "Kaltsiy-fosfat", ["toothpaste"]),
        ("PresiDENT", "Ekstraktlar", ["toothpaste"]),
        ("Elmex", "Amin-ftorid", ["toothpaste"]),
        ("Parodontax", "Natriy bikarbonat", ["toothpaste"]),
        ("Chlorgeksidin", "Hlorgeksidin", ["0.05%"], ["eritma"]),
        ("Metrogil Dent", "Metronidazol", ["gel"]),
        ("Denta", "Triclosan", ["toothpaste"]),
        ("Calciplus", "Kaltsiy", ["tabletka"]),
        ("Asepta", "Propolis", ["gel"]),
    ],
}

# Additional categories with specific drugs
EXTRA_CATEGORIES = {
    "Nefrologiya": [
        ("Furosemid", "Furosemid", ["40mg"], ["tabletka", "in'ektsiya"]),
        ("Torsemid", "Torsemid", ["10mg", "20mg"], ["tabletka"]),
        ("Hypothiazid", "Hidrohlorotiazid", ["25mg", "50mg"], ["tabletka"]),
        ("Indapamid", "Indapamid", ["2.5mg"], ["tabletka"]),
        ("Spironolakton", "Spironolakton", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Veroshpiron", "Spironolakton", ["25mg", "50mg", "100mg"], ["tabletka"]),
        ("Manitol", "Mannitol", ["20%"], ["in'ektsiya"]),
        ("Kanefron", "Ekstraktlar", ["tabletka"]),
        ("Renitek", "Enalapril", ["5mg", "10mg"], ["tabletka"]),
    ],
    "Qon topish": [
        ("Ferro-3", "Fumarat temir", ["tabletka"]),
        ("Ferum Lek", "Polimaltoz ferik hidroksidi", ["in'ektsiya"]),
        ("Sorbifer", "Fumarat temir/Vitamin C", ["tabletka"]),
        ("Tardiferon", "Fumarat temir", ["tabletka"]),
        ("Actiferrin", "Ferri sulyat", ["kapsula", "sirop"]),
        ("Totema", "Fumarat temir", ["eritma"]),
        ("Ferrograd", "Sulfat temir", ["tabletka"]),
        ("Vitamin B12", "Tsianokobalamin", ["1000mcg"], ["tabletka", "in'ektsiya"]),
        ("Folik kislota", "Folik kislota", ["5mg"], ["tabletka"]),
        ("Eritropoetin", "Eritropoetin", ["2000", "4000"], ["in'ektsiya"]),
        ("Tranexam", "Traneksam kislota", ["250mg", "500mg"], ["tabletka", "in'ektsiya"]),
        ("Dicinon", "Etamsilat", ["250mg", "500mg"], ["tabletka", "in'ektsiya"]),
        ("Vikasol", "Menadion natriy bisulfit", ["10mg"], ["tabletka", "in'ektsiya"]),
    ],
    "Pulmonologiya": [
        ("Ambroksol", "Ambroksol", ["30mg", "60mg"], ["tabletka"]),
        ("ACC Long", "Atsetilsistein", ["600mg"], ["paket"]),
        ("Fluimutsil", "Atsetilsistein", ["600mg"], ["paket"]),
        ("Erespal", "Fenspirid", ["80mg"], ["tabletka"]),
        ("Ascoril", "Salbutamol/Bromheksin/Guaifenesin", ["sirop"]),
        ("Bronholitin", "Efedrin/Glautsin", ["sirop"]),
        ("Herbion", "Plantain/Primula", ["sirop"]),
        ("Prospan", "Efeushya ekstrakti", ["sirop", "kapsula"]),
        ("Gedelix", "Efira ekstrakti", ["sirop", "tomchi"]),
        ("Mucosolvan", "Ambroksol", ["sirop"]),
        ("Broncho Baks", "Efira/Sarmisus", ["sirop"]),
        ("Travisil", "Homeopatik", ["pastilka"]),
        ("Cinnabsin", "Homeopatik", ["tabletka"]),
        ("Sinupret", "Homeopatik", ["tabletka", "tomchi"]),
        ("Nurofen Broncho", "Ibuprofen", ["200mg"], ["tabletka"]),
        ("Theraflu", "Paratsetamol", ["paket"]),
        ("Fervex", "Paratsetamol", ["paket"]),
    ],
    "Tish og'riq": [
        ("Denta", "Lidokain", ["10%"], ["gel"]),
        ("Kalgel", "Lidokain", ["gel"]),
        ("Dentinoks", "Lidokain", ["gel"]),
        ("Ibuprofen", "Ibuprofen", ["400mg"], ["tabletka"]),
        ("Nurofen Express", "Ibuprofen", ["200mg", "400mg"], ["kapsula"]),
        ("Ketanov", "Ketorolak", ["10mg"], ["tabletka"]),
        ("Ketonal", "Ketoprofen", ["100mg"], ["kapsula"]),
        ("Aertal", "Aceklofenak", ["100mg"], ["tabletka"]),
        ("Nimesil", "Nimesulid", ["100mg"], ["paket"]),
        ("Nimulid", "Nimesulid", ["100mg"], ["tabletka"]),
    ],
    "Oshqozon": [
        ("De-Nol", "Vismut subtsitrat", ["120mg"], ["tabletka"]),
        ("Ultop", "Omeprazol", ["20mg", "40mg"], ["kapsula"]),
        ("Nexium", "Esomeprazol", ["20mg", "40mg"], ["tabletka"]),
        ("Pariet", "Rabeprazol", ["10mg", "20mg"], ["tabletka"]),
        ("Famotidin", "Famotidin", ["20mg", "40mg"], ["tabletka"]),
        ("Ranitidin", "Ranitidin", ["150mg", "300mg"], ["tabletka"]),
        ("Maalox", "Alüminiy/Magniy gidroksidi", ["suspenziya"]),
        ("Almagel", "Alüminiy/Magniy", ["suspenziya"]),
        ("Gaviscon", "Natriy alginat", ["suspenziya"]),
        ("Fosfalugel", "Alüminiy fosfat", ["gel"]),
        ("Smecta", "Diosmektit", ["paket"]),
        ("Enterosgel", "Metilsilatik kislota", ["gel"]),
        ("Polysorb", "Kolloidli silika", ["paket"]),
        ("Lactofiltrum", "Laktuloza/Lignin", ["tabletka"]),
        ("Linex", "Laktobatsilluslar", ["kapsula"]),
        ("Bifiform", "Bifidobakteriyalar", ["kapsula"]),
        ("Acipol", "Acidofilus laktobatsilluslar", ["kapsula"]),
        ("Hilak Forte", "Metabolitlar", ["eritma"]),
        ("Baktisubtil", "Bacillus clausii", ["kapsula"]),
        ("Motilium", "Domperidon", ["tabletka"]),
        ("Zeercal", "Metoklopramid", ["tabletka"]),
        ("Trimedat", "Trimebutin", ["tabletka"]),
        ("Duspatalin", "Mebeverin", ["tabletka"]),
        ("No-Spa", "Drotaverin", ["tabletka"]),
        ("Buscopan", "Hüskopolin bromid", ["tabletka"]),
        ("Spasmoferon", "Drotaverin", ["tabletka"]),
    ],
    "Teri": [
        ("Advantan", "Metilprednizolon", ["maz", "suspenziya"]),
        ("Elokom", "Mometazon", ["maz", "sprey"]),
        ("Triderm", "Klotrimazol/Gentamitsin/Betametazon", ["maz"]),
        ("Lamisil", "Terbinofin", ["maz", "sprey"]),
        ("Nizoral", "Ketokonazol", ["maz", "shampun"]),
        ("Exoderil", "Naftifin", ["maz", "eritma"]),
        ("Pimafukort", "Natamitsin/Hidrokortizon", ["maz"]),
        ("Fenistil", "Dimetinden", ["gel"]),
        ("Panthenol", "Dekspantenol", ["krem", "sprey"]),
        ("Bepanthen", "Dekspantenol", ["krem", "sprey"]),
        ("Levomekol", "Kloramfenikol/Metiluratsil", ["maz"]),
        ("Vishnevskiy", "Berkovitsa/Tezobrenol", ["maz"]),
        ("Ihtiol", "Ihtiol", ["maz"]),
        ("Metiluratsil", "Metiluratsil", ["maz"]),
        ("Oksolin", "Oksolin", ["maz"]),
        ("Viferon", "Interferon", ["maz", "gel"]),
        ("Akriderm", "Betametazon", ["maz"]),
        ("Beloderm", "Betametazon", ["maz", "sprey"]),
        ("Sinaflan", "Flutsinolon", ["maz"]),
        ("Flucinar", "Flutsinolon", ["maz", "gel"]),
        ("Soloseril", "Dializat", ["maz", "gel"]),
    ],
    "Ortopediya": [
        ("Diklofenak gel", "Diklofenak", ["gel", "maz"]),
        ("Ketonal", "Ketoprofen", ["kapsula", "gel"]),
        ("Finalgon", "Nonivamid/Nikoboksil", ["maz"]),
        ("Capsicam", "Kapsaisin", ["maz"]),
        ("Viprosal", "Kapsaisin/Solbriya", ["maz"]),
        ("Chondroitin", "Xondroitin sulfat", ["kapsula", "tabletka"]),
        ("Teraflex", "Glükozamin/Xondroitin", ["kapsula"]),
        ("Don", "Glükozamin", ["paket"]),
        ("Artra", "Xondroitin/Glükozamin", ["tabletka"]),
        ("Structum", "Xondroitin sulfat", ["kapsula"]),
        ("Movalis", "Meloksikam", ["tabletka", "in'ektsiya"]),
        ("Nimulid", "Nimesulid", ["tabletka", "gel"]),
        ("Dolgit", "Ibuprofen", ["krem"]),
        ("Deep Relief", "Ibuprofen/Levomenthol", ["gel"]),
        ("Voltaren", "Diklofenak", ["tabletka", "gel"]),
        ("Ortofen", "Diklofenak", ["tabletka", "gel"]),
        ("Naklofen", "Diklofenak", ["kapsula", "in'ektsiya"]),
        ("Arkoksia", "Etorikoksib", ["tabletka"]),
    ],
}

# Manufacturers
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
    "Isroil": ["Teva", "Dexcel", "Pharmアップ", "Rafa", "Taro"],
    "Yaponiya": ["Takeda", "Daiichi Sankyo", "Astellas", "Yamanouchi", "Chugai"],
    "Janubiy Koreya": ["Samsung", "Celltrion", "Hanmi", "Daewoong", "LG Chem", "Samjin", "Dong-A"],
    "O'zbekiston": ["Davr Farm", "Samarqand Farm", "Toshkent Farm", "Farmkon", "Zardavor"],
}

COUNTRIES = list(MANUFACTURERS.keys())

# Cities for pharmacies
CITIES = [
    "Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon",
    "Farg'ona", "Qarshi", "Nukus", "Urganch", "Termiz",
    "Jizzax", "Guliston", "Navoiy", "Kokand", "Margilan",
    "Denov", "Urgut", "Kitob", "Shahrisabz", "Qo'qon",
]

GENERIC_CATEGORIES = {
    "Immunitet": [
        ("Immunitet vitamini", "A+C+D3", ["tabletka", "kapsula"], ["tabletka", "kapsula"]),
        ("Maximmun", "Ekstraktlar", ["tabletka"], ["tabletka"]),
        ("Immunostim", "Efir moylari", ["tabletka"], ["tabletka"]),
        ("Fitelis", "Zamburug' ekstrakti", ["tabletka"], ["tabletka"]),
        ("Tramasin", "Ekstraktlar", ["tabletka"], ["tabletka"]),
    ],
    "Ovqat hazm qilish": [
        ("Enzim Forte", "Pancreatin", ["tabletka"], ["tabletka"]),
        ("Bio-kultur", "Probiotiklar", ["kapsula"], ["kapsula"]),
        ("Fermentin", "Quruq fermentlar", ["tabletka"], ["tabletka"]),
        ("Mikrazim", "Pancreatin", ["kapsula"], ["kapsula"]),
        ("Somilaz", "Papain", ["tabletka"], ["tabletka"]),
    ],
    "Teri kasalliklari": [
        ("Psor-cream", "Salitsil kislota", ["krem"], ["krem"]),
        ("Antipsor", "Degtyar", ["maz"], ["maz"]),
        ("Skin-Cap", "Piritionin tsink", ["sprey", "krem"], ["sprey", "krem"]),
        ("Afloderm", "Alklometazon", ["maz", "krem"], ["maz", "krem"]),
        ("Lokoid", "Hidrokortizon", ["maz", "krem"], ["maz", "krem"]),
    ],
}

# Generate additional real-sounding medicine names for 10k target
BRAND_PREFIXES = [
    "Neo", "Bio", "Vita", "Pro", "Maxi", "Mini", "Super", "Ultra", "Hyper", "Metro",
    "Penta", "Hexa", "Hepta", "Octa", "Poly", "Mono", "Di", "Tri", "Tetra", "Penta",
    "Aero", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Iota", "Kappa", "Lambda",
    "Alpha", "Omega", "Sigma", "Tau", "Upsilon", "Chi", "Psi", "Phi",
    "Sano", "Vero", "Farma", "Medica", "Sanita", "Natura", "Vita", "Salus", "Sanitas", "Aqua",
]

BRAND_SUFFIXES = [
    "zol", "max", "fort", "pro", "plus", "vit", "mum", "din", "sin", "tol",
    "sol", "mix", "pax", "dex", "nex", "lex", "vet", "cal", "gel", "rin",
    "set", "fen", "pin", "min", "lin", "nol", "zid", "cin", "lax", "zym",
    "ase", "ide", "ene", "ine", "one", "ane", "ene", "ate", "ite", "ose",
]

def gen_id(idx):
    return f"med-{idx}"

def gen_slug(name):
    return name.lower().replace(" ", "-").replace("'", "").replace("(", "").replace(")", "")[:60]

def gen_image_path(idx, form):
    # Use form-based images
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
        "nebulizatsiya": "/images/medicines/inhaler.jpg",
        "shampun": "/images/medicines/gel.jpg",
        "toothpaste": "/images/medicines/gel.jpg",
        "jel": "/images/medicines/gel.jpg",
    }
    return form_images.get(form, f"/images/medicines/paracetamol.jpg")

def gen_price():
    return random.choice([
        random.randint(500, 5000),
        random.randint(5000, 15000),
        random.randint(15000, 35000),
        random.randint(35000, 80000),
        random.randint(80000, 200000),
    ])

def gen_old_price(price):
    if random.random() < 0.3:
        return int(price * random.uniform(1.1, 1.4))
    return None

def gen_discount(old_price):
    if old_price:
        return random.randint(5, 30)
    return 0

def gen_rating():
    return round(random.uniform(3.5, 5.0), 1)

def gen_review_count():
    return random.randint(5, 800)

SIDE_EFFECTS = [
    ["Bosh og'rig'i", "Ko'ngil aynish", "Allergik reaksiya"],
    ["Diareya", "Qorin og'rig'i", "Shishish"],
    ["Uyqusizlik", "Bosh aylanishi", "Charchash"],
    ["Teriga toshma", "Qichish", "Shishish"],
    ["Isitma", "Charchash", "Bosh og'rig'i"],
    ["Qon bosimi o'zgarishi", "Yurak urishi", "Bosh aylanishi"],
    ["Xushdan ketish", "Qusish", "Og'riq"],
    ["Allergik reaksiya", "Bosh og'rig'i", "Uyqusizlik"],
    ["Og'riq", "Shishish", "Qizarish"],
    ["Diareya", "Qabziyat", "Qorin dam bo'lishi"],
]

def gen_side_effects():
    return random.choice(SIDE_EFFECTS)

def generate_brand_name():
    prefix = random.choice(BRAND_PREFIXES)
    suffix = random.choice(BRAND_SUFFIXES)
    return f"{prefix}{suffix}"

def generate_medicines():
    medicines = []
    medicine_prices = {}
    idx = 1
    
    # Process all known generic drugs
    all_categories = {**GENERIC_NAMES, **EXTRA_CATEGORIES, **GENERIC_CATEGORIES}
    
    for category, drugs in all_categories.items():
        for drug_tuple in drugs:
            if len(drug_tuple) == 4:
                drug_name, generic, dosages, forms = drug_tuple
            else:
                drug_name, generic, dosages = drug_tuple
                forms = ["tabletka"]
            for dosage in dosages:
                form = random.choice(forms)
                manufacturer_country = random.choice(COUNTRIES)
                manufacturer = random.choice(MANUFACTURERS[manufacturer_country])
                
                name = f"{drug_name} {dosage}"
                price = gen_price()
                old_price = gen_old_price(price)
                
                medicine = {
                    "id": gen_id(idx),
                    "name": name,
                    "slug": gen_slug(name),
                    "description": f"{name} — {generic} asosidagi sifatli dori vositasi. {category} kategoriyasiga kiradi.",
                    "category": category,
                    "form": form,
                    "dosage": dosage,
                    "unitPrice": price,
                    "oldPrice": old_price if old_price else price * 1.2,
                    "isAvailable": random.random() > 0.1,
                    "rating": gen_rating(),
                    "reviewCount": gen_review_count(),
                    "image": gen_image_path(idx, form),
                    "manufacturer": manufacturer,
                    "country": manufacturer_country,
                    "prescriptionRequired": random.random() < 0.3,
                    "isPopular": random.random() < 0.1,
                    "isFeatured": random.random() < 0.05,
                    "discount": gen_discount(old_price),
                    "unit": "tabletka" if form in ["tabletka", "kapsula"] else form,
                    "packSize": random.choice([1, 2, 3, 5, 10, 20, 30, 60, 90, 100]),
                    "minimumOrder": 1,
                }
                medicines.append(medicine)
                
                # Generate prices for random pharmacies
                num_pharmacies = random.randint(3, 8)
                price_list = []
                for _ in range(num_pharmacies):
                    ph_id = f"ph-{random.randint(1, 152)}"
                    price_list.append({
                        "pharmacyId": ph_id,
                        "pharmacyName": random.choice([
                            "Farmalife Dorixona", "Sog'lik Dorixona", "Dorixona 777",
                            "Aziza Dorixona", "Davolux Dorixona", "Hayot Dorixona",
                            "Shifokor Dorixona", "Salomatlik Dorixona", "Farm-Dorixona",
                            "O'zbekiston Dorixona", "Milliy Dorixona", "Eco Dorixona",
                            "Ravon Dorixona", "Tez yordam Dorixona", "Plus Dorixona",
                        ]),
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
    
    # Generate additional generic medicines to reach 10,000+
    additional_meds = [
        ("Gastro-Relief", "Oshqozon himoyachisi", "Ovqat hazm qilish"),
        ("Cardio-Shield", "Yurak himoyachisi", "Yurak-qon tomir"),
        ("Neuro-Complex", "Asab tizimi", "Asab tizimi"),
        ("Immuno-Boost", "Immunitet quvvatlovchi", "Immunitet"),
        ("Dermo-Care", "Teri parvarishi", "Teri kasalliklari"),
        ("Respi-Fresh", "Nafas olish", "Nafas olish"),
        ("Hepato-Clean", "Jigar tozalovchi", "Ovqat hazm qilish"),
        ("Nephro-Guard", "Buyrak himoyachisi", "Nefrologiya"),
        ("Gluco-Balance", "Qand muvozanati", "Qandli diabet"),
        ("Thyroid-Norm", "Qalqonsimon gormon", "Gormonlar"),
        ("Prosta-Support", "Prostata", "Urologiya"),
        ("Gyneco-Care", "Ayollar salomatligi", "Ginekologiya"),
        ("Pedia-Grow", "Bolalar rivoji", "Bolalar"),
        ("Onco-Support", "Onkologiya yordamchisi", "Onkologiya"),
        ("Ortho-Joint", "Bo'g'im salomatligi", "Ortopediya"),
        ("Stomato-White", "Tish oqartirish", "Stomatologiya"),
        ("Hemo-Plus", "Qon to'ldirish", "Qon topish"),
        ("Aller-Stop", "Allergiya to'xtatuvchi", "Allergiyaga qarshi"),
        ("Pain-Relax", "Og'riq tinchlantiruvchi", "Og'riq qoldiruvchi"),
        ("Sleep-Well", "Uyqu yaxshilovchi", "Asab tizimi"),
        ("Vita-Max", "Vitamin maximum", "Vitaminlar"),
        ("Omega-3 Pure", "Omega-3 toza", "Vitaminlar"),
        ("Collagen-Plus", "Kollagen", "Vitaminlar"),
        ("Zinc-Forte", "Sink kuchli", "Immunitet"),
        ("Iron-Supreme", "Temir oliy", "Qon topish"),
        ("Calcium-Active", "Kaltsiy faol", "Vitaminlar"),
        ("Magnesium-Relax", "Magniy", "Vitaminlar"),
        ("B-Complex", "Vitamin B majmuasi", "Vitaminlar"),
        ("Multivitamin Pro", "Multivitamin professional", "Vitaminlar"),
        ("Probiotic-10", "Probiotik 10", "Ovqat hazm qilish"),
        ("Enzyme-Plus", "Enzimlar", "Ovqat hazm qilish"),
        ("Liver-Support", "Jigar yordamchisi", "Ovqat hazm qilish"),
        ("Detox-Clean", "Detoks", "Ovqat hazm qilish"),
        ("Slim-Active", "Yengillik", "Ovqat hazm qilish"),
        ("Collagen-Skin", "Teri uchun kollagen", "Teri kasalliklari"),
        ("Hair-Growth", "Sovch o'sishi", "Teri kasalliklari"),
        ("Nail-Strong", "Tirnoq mustahkamlovchi", "Teri kasalliklari"),
        ("Anti-Age", "Qarshi", "Teri kasalliklari"),
        ("Sun-Protection", "Quyoshdan himoya", "Teri kasalliklari"),
        ("Hydra-Gel", "Gidratatsiya", "Teri kasalliklari"),
    ]
    
    # Generate 10,000+ total
    for i in range(10500 - len(medicines)):
        if i < len(additional_meds):
            base_name, desc, cat = additional_meds[i]
        else:
            base_name = generate_brand_name()
            cat = random.choice(list(all_categories.keys()))
        
        dosage = random.choice(["50mg", "100mg", "200mg", "250mg", "500mg", "1g", "5ml", "10ml", "20ml", "30ml"])
        form = random.choice(["tabletka", "kapsula", "sirop", "gel", "sprey", "in'ektsiya", "maz", "krem", "damla", "shamcha", "pastilka", "eritma"])
        manufacturer_country = random.choice(COUNTRIES)
        manufacturer = random.choice(MANUFACTURERS[manufacturer_country])
        
        name = f"{base_name} {dosage}" if i < len(additional_meds) else f"{base_name} {dosage}"
        price = gen_price()
        old_price = gen_old_price(price)
        
        medicine = {
            "id": gen_id(idx),
            "name": name,
            "slug": gen_slug(name),
            "description": f"{name} — {cat} kategoriyasiga kiruvchi sifatli dori vositasi.",
            "category": cat,
            "form": form,
            "dosage": dosage,
            "unitPrice": price,
            "oldPrice": old_price if old_price else price * 1.2,
            "isAvailable": random.random() > 0.1,
            "rating": gen_rating(),
            "reviewCount": gen_review_count(),
            "image": gen_image_path(idx, form),
            "manufacturer": manufacturer,
            "country": manufacturer_country,
            "prescriptionRequired": random.random() < 0.25,
            "isPopular": random.random() < 0.08,
            "isFeatured": random.random() < 0.04,
            "discount": gen_discount(old_price),
            "unit": "tabletka" if form in ["tabletka", "kapsula"] else form,
            "packSize": random.choice([1, 2, 3, 5, 10, 20, 30, 60, 90, 100]),
            "minimumOrder": 1,
        }
        medicines.append(medicine)
        
        num_pharmacies = random.randint(3, 8)
        price_list = []
        for _ in range(num_pharmacies):
            ph_id = f"ph-{random.randint(1, 152)}"
            price_list.append({
                "pharmacyId": ph_id,
                "pharmacyName": random.choice([
                    "Farmalife Dorixona", "Sog'lik Dorixona", "Dorixona 777",
                    "Aziza Dorixona", "Davolux Dorixona", "Hayot Dorixona",
                    "Shifokor Dorixona", "Salomatlik Dorixona", "Farm-Dorixona",
                ]),
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
    medicines, prices = generate_medicines()
    print(f"Generated {len(medicines)} medicines")
    print(f"Generated prices for {len(prices)} medicines")
    
    # Print category stats
    cats = {}
    for m in medicines:
        cats[m['category']] = cats.get(m['category'], 0) + 1
    print("\nCategory breakdown:")
    for c in sorted(cats.keys()):
        print(f"  {c}: {cats[c]}")
