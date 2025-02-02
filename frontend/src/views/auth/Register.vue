<template>
    <div class="register-page">
        <RegisterForm />
    </div>
</template>
  
<script setup>
    import RegisterForm from '../components/RegisterForm.vue';
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