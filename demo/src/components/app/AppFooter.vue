<script setup lang="ts">
import { name, homepage } from "../../../../package.json";
</script>

<template>
  <footer>
    <a :href="`https://www.npmjs.com/package/${name}`"> NPM </a>
    <a :href="homepage">Github Repo</a>

    <p>
      Written by <a href="https://github.com/JamesManningR">James Manning</a>
    </p>
  </footer>
</template>
