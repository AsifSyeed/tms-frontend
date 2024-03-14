

<template>
    <Button @click="handleButtonTap" :disabled="props.disabled" :label="props.title" class="w-full border-round" />
</template>

<script lang="ts" setup>

const emit = defineEmits(['buttonTapped']);
const props = defineProps({
    title: {
        type: String
    },
    disabled: {
        type: Boolean
    }
});

const handleButtonTap = () => {
  emit('buttonTapped');
};

</script>

<style lang="scss" scoped>
.p-button {
    background-color: $theme-yellow;
    border: none;
}

.p-button:hover {
    background-color: $theme-yellow-dark;
}
</style>