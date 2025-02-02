<template>
    <div class="login-page">
        <LoginForm />
    </div>
</template>
  
<script setup>
    import LoginForm from '../components/LoginForm.vue';
</script>

<style scoped>
.page-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f6fa;
    padding: 1rem;
}
</style>