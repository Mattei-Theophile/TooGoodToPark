<script setup>
import Header from "@/components/core/Header.vue";
import Footer from "@/components/core/Footer.vue";
import CookieBanner from "@/components/core/cookies/cookie-banner.vue";

// Handle cookie consent
const handleCookieConsent = (consent) => {
  console.log('Cookie consent given:', consent);

  // Initialize analytics/marketing scripts based on consent
  if (consent.analytics) {
    // Initialize Google Analytics or other analytics
    console.log('Analytics cookies allowed - initialize tracking');
  }

  if (consent.marketing) {
    // Initialize marketing pixels/scripts
    console.log('Marketing cookies allowed - initialize marketing tools');
  }

  if (consent.functional) {
    // Initialize functional features
    console.log('Functional cookies allowed');
  }
};
</script>

<template>
  <Header />
  <main>

    <router-view />

  </main>

  <Footer />

  <!-- Cookie Banner -->
  <CookieBanner @consent-given="handleCookieConsent" />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

main{
  margin-top: 1rem;

}

</style>
