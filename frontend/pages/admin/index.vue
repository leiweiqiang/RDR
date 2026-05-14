<script setup lang="ts">
import { ref } from 'vue'
import AdminDataTable from '@/components/admin/AdminDataTable.vue'
import AdminSectionCards from '@/components/admin/AdminSectionCards.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminSiteHeader from '@/components/admin/AdminSiteHeader.vue'
import { adminTableData } from '@/data/adminTableData'

const mobileSidebarOpen = ref(false)

useHead({
  title: 'Admin — RDR',
})
</script>

<template>
  <div
    class="admin-dashboard flex min-h-svh w-full bg-background text-foreground [--header-height:theme(spacing.12)] md:[--header-height:theme(spacing.14)]"
  >
    <AdminSidebar v-model:mobile-open="mobileSidebarOpen" />

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminSiteHeader @menu="mobileSidebarOpen = true" />

      <div class="flex flex-1 flex-col gap-2">
        <div class="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-6 md:px-6 md:py-6">
          <AdminSectionCards />
          <AdminDataTable :data="adminTableData" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  /* Opaque shell: parent .page-transition-root still has a hero image — block it */
  background-image: none !important;
  background-color: hsl(var(--background));
}
</style>
