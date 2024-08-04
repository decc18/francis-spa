<script setup lang="ts">
import { RouterLink } from 'vue-router';
import logo from '@/assets/images/profile/user-1.jpg';
</script>assets\images\profile
<template>
    <div class="logo">
        <RouterLink to="/">
            <img :src="logo" alt="home" style="width: 200px; height: auto;" />
        </RouterLink>
    </div>
</template>
