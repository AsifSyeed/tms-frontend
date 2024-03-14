<template>
  <InputText :placeholder="$props.placeholder" :type="$props.type" class="w-full border-round"/>
</template>

<script lang="ts" setup>

const props = defineProps({
    type: {
        type: String
    },
    placeholder: {
        type: String
    },
    disabled: {
        type: Boolean
    }
});


</script>

<style lang="scss" scoped>

.p-inputtext:focus{
  outline: 1px solid $theme-yellow !important;
}
.p-inputtext:enabled:focus{
  outline: 1px solid $theme-yellow !important;
} 
</style>