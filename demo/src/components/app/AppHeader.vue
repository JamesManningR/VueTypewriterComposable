<script setup lang="ts">
import { name, version } from "../../../../package.json";
</script>

<template>
<header>
  <h1>Typer Composable Demo</h1>
  <a :href="`https://www.npmjs.com/package/${name}`">
    <code>
      {{ name }} {{ version }}
    </code>
  </a>
</header>
</template>