<template>
  <b-container>
    <h1>Bitcoin Price Index</h1>
    <h2>Essay on the deeper meaning of Vue</h2>

    <section v-if="errored">
      <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>

      <div
        v-else
        v-for="currency in info"
        class="currency"
      >
        {{ currency.description }}:
        <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
      </div>

    </section>
  </b-container>
</template>
<script>

</script>
<style>

</style>
