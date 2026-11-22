export type Lang = "uz" | "ru" | "en";
export type Section = { h: string; p: string[] };
export type PageContent = { title: string; intro: string; updated?: string; sections: Section[] };

const UPDATED = { uz: "Oxirgi yangilanish: 2026-yil 22-noyabr", ru: "Последнее обновление: 22 ноября 2026 г.", en: "Last updated: 22 November 2026" };

export const PAGES: Record<"about" | "privacy" | "terms" | "contact", Record<Lang, PageContent>> = {
  about: {
    uz: {
      title: "Biz haqimizda",
      intro: "VitaHub — O'zbekistondagi dorixonalardagi dori narxlarini solishtirish, eng yaqin dorixonani topish va buyurtma berishni osonlashtiradigan platforma.",
      sections: [
        { h: "Maqsadimiz", p: ["Har bir inson kerakli dorini adolatli narxda, vaqt yo'qotmasdan topa olishi kerak. Biz narxlarni ochiq qilamiz va bir nechta dorixonani bitta sahifada solishtirish imkonini beramiz."] },
        { h: "Nima qilamiz", p: ["Dori vositalarini qidirish va dorixonalar bo'yicha narxlarni solishtirish.", "Xaritada yaqin dorixonalar, ish vaqti va aloqa ma'lumotlari.", "Retseptsiz dorilarni yetkazib berish; retseptli dorilar faqat dorixonada e-retsept bilan beriladi."] },
        { h: "Muhim eslatma", p: ["VitaHub tibbiy maslahat bermaydi. Sayt va AI yordamchidagi ma'lumotlar faqat tanishish uchun. Davolanish bo'yicha qarorni shifokor yoki farmatsevt bilan qabul qiling. Shoshilinch holatda 103 raqamiga qo'ng'iroq qiling."] },
      ],
    },
    ru: {
      title: "О нас",
      intro: "VitaHub — платформа, которая помогает сравнивать цены на лекарства в аптеках Узбекистана, находить ближайшую аптеку и оформлять заказ.",
      sections: [
        { h: "Наша цель", p: ["Каждый должен находить нужное лекарство по честной цене и без потери времени. Мы делаем цены прозрачными и позволяем сравнить несколько аптек на одной странице."] },
        { h: "Что мы делаем", p: ["Поиск лекарств и сравнение цен по аптекам.", "Ближайшие аптеки на карте, часы работы и контакты.", "Доставка безрецептурных препаратов; рецептурные отпускаются только в аптеке по электронному рецепту."] },
        { h: "Важно", p: ["VitaHub не даёт медицинских консультаций. Информация на сайте и в AI-помощнике носит ознакомительный характер. Решения о лечении принимайте вместе с врачом или фармацевтом. В экстренной ситуации звоните 103."] },
      ],
    },
    en: {
      title: "About us",
      intro: "VitaHub is a platform that helps people in Uzbekistan compare medicine prices across pharmacies, find the nearest pharmacy and place orders.",
      sections: [
        { h: "Our mission", p: ["Everyone should find the medicine they need at a fair price without wasting time. We make prices transparent and let you compare several pharmacies on one page."] },
        { h: "What we do", p: ["Medicine search and price comparison across pharmacies.", "Nearby pharmacies on a map, with opening hours and contacts.", "Delivery of over-the-counter medicines; prescription medicines are dispensed only at a pharmacy with an e-prescription."] },
        { h: "Important", p: ["VitaHub does not provide medical advice. Information on the site and from the AI assistant is for reference only. Make treatment decisions with a doctor or pharmacist. In an emergency, call 103."] },
      ],
    },
  },
  privacy: {
    uz: {
      title: "Maxfiylik siyosati",
      intro: "Ushbu siyosat VitaHub qanday shaxsga doir ma'lumotlarni yig'ishi, ulardan qanday foydalanishi va qanday himoya qilishini tushuntiradi. Biz O'zbekiston Respublikasining «Shaxsga doir ma'lumotlar to'g'risida»gi Qonuniga amal qilamiz.",
      updated: UPDATED.uz,
      sections: [
        { h: "Qanday ma'lumotlarni yig'amiz", p: ["Telefon raqamingiz (SMS kod orqali kirish uchun) va ixtiyoriy ravishda ismingiz.", "Yetkazib berish manzili va buyurtma tafsilotlari — faqat buyurtma bersangiz.", "Texnik ma'lumotlar: brauzer turi, til va mavzu sozlamalari, xatolar jurnali."] },
        { h: "Ulardan qanday foydalanamiz", p: ["Hisobingizni tasdiqlash va buyurtmani bajarish uchun.", "Buyurtma holati haqida xabar berish uchun.", "Xizmat sifatini yaxshilash uchun (umumlashtirilgan, shaxsni aniqlamaydigan shaklda)."] },
        { h: "Kimga beramiz", p: ["Buyurtmani bajarish uchun zarur bo'lgan hajmda — tanlagan dorixonangiz va yetkazib beruvchiga.", "SMS kod yuborish uchun SMS provayderiga (faqat telefon raqami).", "Qonunda belgilangan hollarda vakolatli davlat organlariga. Ma'lumotlaringizni sotmaymiz."] },
        { h: "Saqlash va himoya", p: ["Ma'lumotlar himoyalangan ulanish (HTTPS) orqali uzatiladi. Kirish sessiyasi imzolangan cookie fayl orqali 30 kun saqlanadi.", "Savat va manzil qurilmangizdagi brauzer xotirasida saqlanadi va istalgan vaqtda o'chirilishi mumkin."] },
        { h: "Sizning huquqlaringiz", p: ["Ma'lumotlaringizni ko'rish, tuzatish yoki o'chirishni so'rashingiz mumkin. Buning uchun info@vitahub.uz manziliga yozing."] },
      ],
    },
    ru: {
      title: "Политика конфиденциальности",
      intro: "Эта политика объясняет, какие персональные данные собирает VitaHub, как мы их используем и защищаем. Мы соблюдаем Закон Республики Узбекистан «О персональных данных».",
      updated: UPDATED.ru,
      sections: [
        { h: "Какие данные мы собираем", p: ["Номер телефона (для входа по SMS-коду) и, по желанию, имя.", "Адрес доставки и детали заказа — только если вы оформляете заказ.", "Технические данные: тип браузера, настройки языка и темы, журнал ошибок."] },
        { h: "Как мы их используем", p: ["Для подтверждения аккаунта и выполнения заказа.", "Для уведомлений о статусе заказа.", "Для улучшения сервиса (в обобщённом, обезличенном виде)."] },
        { h: "Кому мы передаём данные", p: ["Выбранной аптеке и службе доставки — в объёме, необходимом для заказа.", "SMS-провайдеру для отправки кода (только номер телефона).", "Уполномоченным органам в случаях, предусмотренных законом. Мы не продаём ваши данные."] },
        { h: "Хранение и защита", p: ["Данные передаются по защищённому соединению (HTTPS). Сессия входа хранится в подписанном cookie-файле 30 дней.", "Корзина и адрес хранятся в памяти браузера на вашем устройстве и могут быть удалены в любой момент."] },
        { h: "Ваши права", p: ["Вы можете запросить доступ к своим данным, их исправление или удаление, написав на info@vitahub.uz."] },
      ],
    },
    en: {
      title: "Privacy policy",
      intro: "This policy explains what personal data VitaHub collects, how we use it and how we protect it. We comply with the Law of the Republic of Uzbekistan \"On Personal Data\".",
      updated: UPDATED.en,
      sections: [
        { h: "What we collect", p: ["Your phone number (to sign in with an SMS code) and, optionally, your name.", "Delivery address and order details — only if you place an order.", "Technical data: browser type, language and theme settings, error logs."] },
        { h: "How we use it", p: ["To verify your account and fulfil your order.", "To notify you about your order status.", "To improve the service (in aggregated, non-identifying form)."] },
        { h: "Who we share it with", p: ["Your chosen pharmacy and the courier — only as needed for the order.", "Our SMS provider, to send the code (phone number only).", "Authorised state bodies where the law requires it. We do not sell your data."] },
        { h: "Storage and security", p: ["Data is sent over an encrypted connection (HTTPS). Your sign-in session is kept in a signed cookie for 30 days.", "Your cart and address are stored in your browser on your device and can be cleared at any time."] },
        { h: "Your rights", p: ["You can ask to see, correct or delete your data by writing to info@vitahub.uz."] },
      ],
    },
  },
  terms: {
    uz: {
      title: "Foydalanish shartlari",
      intro: "VitaHub saytidan foydalanish orqali siz quyidagi shartlarga rozilik bildirasiz.",
      updated: UPDATED.uz,
      sections: [
        { h: "Xizmat", p: ["VitaHub dorixonalardagi narx va mavjudlik haqidagi ma'lumotni ko'rsatadi va buyurtmani hamkor dorixonaga yetkazadi. Dorini sotuvchi — litsenziyaga ega dorixona."] },
        { h: "Narxlar va mavjudlik", p: ["Narx va qoldiqlar dorixonalar tomonidan yangilanadi va o'zgarishi mumkin. Yakuniy narx buyurtmani dorixona tasdiqlaganda belgilanadi."] },
        { h: "Retseptli dorilar", p: ["Retsept bilan beriladigan dorilar onlayn yetkazib berilmaydi. Ular faqat dorixonada elektron retsept (e-retsept) ko'rsatilganda beriladi."] },
        { h: "Tibbiy ma'lumot", p: ["Saytdagi ma'lumotlar, jumladan AI yordamchi javoblari, tibbiy maslahat emas. Dorini qabul qilishdan oldin yo'riqnomani o'qing va shifokor yoki farmatsevt bilan maslahatlashing."] },
        { h: "Hisob", p: ["Kirish uchun o'zingizga tegishli telefon raqamidan foydalaning va SMS kodni boshqalarga bermang."] },
        { h: "Javobgarlik", p: ["Dorining sifati va berilishi uchun uni sotgan dorixona javobgar. VitaHub ma'lumotlarni to'g'ri ko'rsatishga harakat qiladi, lekin dorixonalar bergan ma'lumotlardagi xatolar uchun javobgar emas."] },
      ],
    },
    ru: {
      title: "Условия использования",
      intro: "Пользуясь сайтом VitaHub, вы соглашаетесь со следующими условиями.",
      updated: UPDATED.ru,
      sections: [
        { h: "Сервис", p: ["VitaHub показывает цены и наличие в аптеках и передаёт заказ аптеке-партнёру. Продавец лекарства — аптека с лицензией."] },
        { h: "Цены и наличие", p: ["Цены и остатки обновляют аптеки, они могут меняться. Окончательная цена фиксируется, когда аптека подтверждает заказ."] },
        { h: "Рецептурные препараты", p: ["Рецептурные препараты не доставляются онлайн. Их отпускают только в аптеке при предъявлении электронного рецепта."] },
        { h: "Медицинская информация", p: ["Информация на сайте, включая ответы AI-помощника, не является медицинской консультацией. Перед приёмом прочитайте инструкцию и проконсультируйтесь с врачом или фармацевтом."] },
        { h: "Аккаунт", p: ["Используйте для входа свой номер телефона и никому не сообщайте SMS-код."] },
        { h: "Ответственность", p: ["За качество и отпуск лекарства отвечает продавшая его аптека. VitaHub старается показывать точные данные, но не отвечает за ошибки в данных, предоставленных аптеками."] },
      ],
    },
    en: {
      title: "Terms of use",
      intro: "By using the VitaHub website you agree to the following terms.",
      updated: UPDATED.en,
      sections: [
        { h: "The service", p: ["VitaHub shows prices and availability at pharmacies and passes your order to a partner pharmacy. The seller of the medicine is the licensed pharmacy."] },
        { h: "Prices and availability", p: ["Prices and stock are updated by pharmacies and may change. The final price is set when the pharmacy confirms the order."] },
        { h: "Prescription medicines", p: ["Prescription medicines are not delivered online. They are dispensed only at a pharmacy on presentation of an electronic prescription."] },
        { h: "Medical information", p: ["Information on the site, including AI assistant answers, is not medical advice. Read the leaflet and consult a doctor or pharmacist before taking any medicine."] },
        { h: "Your account", p: ["Sign in with a phone number that belongs to you and never share your SMS code."] },
        { h: "Liability", p: ["The pharmacy that sells a medicine is responsible for its quality and dispensing. VitaHub aims to show accurate data but is not liable for errors in data supplied by pharmacies."] },
      ],
    },
  },
  contact: {
    uz: {
      title: "Biz bilan bog'lanish",
      intro: "Savol, taklif yoki muammo bo'lsa, biz bilan bog'laning.",
      sections: [
        { h: "Aloqa", p: ["Email: info@vitahub.uz", "Telefon: +998 90 123-45-67 (har kuni 09:00–21:00)", "Manzil: Amir Temur ko'chasi 108, Toshkent"] },
        { h: "Dorixonalar uchun", p: ["Hamkor bo'lishni va narxlaringizni platformaga qo'shishni xohlasangiz, info@vitahub.uz manziliga «Hamkorlik» mavzusi bilan yozing."] },
      ],
    },
    ru: {
      title: "Контакты",
      intro: "Если у вас есть вопрос, предложение или проблема — свяжитесь с нами.",
      sections: [
        { h: "Связь", p: ["Email: info@vitahub.uz", "Телефон: +998 90 123-45-67 (ежедневно 09:00–21:00)", "Адрес: ул. Амира Темура, 108, Ташкент"] },
        { h: "Для аптек", p: ["Если вы хотите стать партнёром и добавить свои цены на платформу, напишите на info@vitahub.uz с темой «Партнёрство»."] },
      ],
    },
    en: {
      title: "Contact us",
      intro: "Have a question, suggestion or problem? Get in touch.",
      sections: [
        { h: "Contact", p: ["Email: info@vitahub.uz", "Phone: +998 90 123-45-67 (daily 09:00–21:00)", "Address: 108 Amir Temur Street, Tashkent"] },
        { h: "For pharmacies", p: ["To become a partner and list your prices on the platform, email info@vitahub.uz with the subject \"Partnership\"."] },
      ],
    },
  },
};
