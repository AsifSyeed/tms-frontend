<template>
    <InputNumber class="w-full" inputId="horizontal-buttons" showButtons buttonLayout="horizontal" :step="1"
        decrementButtonClass="p-button-danger" incrementButtonClass="p-button-success" mode="decimal">
        <template #incrementbuttonicon>
            <span class="pi pi-plus" />
        </template>
        <template #decrementbuttonicon>
            <span class="pi pi-minus" />
        </template>
    </InputNumber>
</template>

<script lang="ts" setup>

</script>

<style></style>