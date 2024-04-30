<script lang="ts" setup></script>

<template>
  <div class="grid place-items-center h-screen">
    <div class="p-5 flex flex-col gap-5 w-[60vw]">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col justify-start items-start gap-2">
          <h1 class="text-3xl font-bold text-center">SignUp</h1>
          <h2>Create account</h2>
        </div>
        <UFormGroup label="Name">
          <UInput type="text" />
        </UFormGroup>
        <UFormGroup label="Email">
          <UInput type="email" />
        </UFormGroup>
        <UFormGroup label="Password">
          <UInput type="password" />
        </UFormGroup>
        <UButton type="submit" block> Login </UButton>
      </div>
      <p class="text-sm">
        Already have an account? <NuxtLink to="/login">Click here </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
