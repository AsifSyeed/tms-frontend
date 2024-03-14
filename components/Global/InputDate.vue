<template>
  <Calendar id="calendar-12h" showTime showIcon iconDisplay="input" hourFormat="12" class=" w-full" />
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
.p-calendar:not(.p-calendar-disabled).p-focus > .p-inputtext{
  outline: 1px solid $theme-yellow !important;
}

.p-datepicker:not(.p-disabled) table td span:not(.p-highlight):not(.p-disabled) {
    outline-color: $theme-yellow !important;
}

.p-datepicker table td > span.p-highlight {
    color: var(--gray-800) !important;
    background: $theme-yellow !important;
}
.p-datepicker table td > span:focus {
    outline: 1px solid $theme-yellow !important;
    outline-offset: 2px;
    box-shadow: none;
}
</style>