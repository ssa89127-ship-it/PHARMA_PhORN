export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PharmaHub",
    url: "https://pharma-ph-orn-pe1d.vercel.app",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    description:
      "Compare medicine prices from 152+ pharmacies in Uzbekistan. Order online with 30-minute delivery.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "UZS",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "12500",
    },
    featureList: [
      "10,000+ medicines",
      "152+ pharmacies",
      "Price comparison",
      "30-minute delivery",
      "AI health assistant",
      "Doctor consultation",
      "Prescription management",
    ],
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PharmaHub",
    url: "https://pharma-ph-orn-pe1d.vercel.app",
    logo: "https://pharma-ph-orn-pe1d.vercel.app/logo.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998-90-123-45-67",
      contactType: "customer service",
      availableLanguage: ["Uzbek", "Russian", "English"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
    </>
  );
}
