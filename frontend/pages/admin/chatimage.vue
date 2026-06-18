<script setup lang="ts">
import ChatImageCTA from '@/components/chatimage/ChatImageCTA.vue'
import ChatImageFAQ from '@/components/chatimage/ChatImageFAQ.vue'
import ChatImageFeatures from '@/components/chatimage/ChatImageFeatures.vue'
import ChatImageFooter from '@/components/chatimage/ChatImageFooter.vue'
import ChatImageGenerator from '@/components/chatimage/ChatImageGenerator.vue'
import ChatImageHeader from '@/components/chatimage/ChatImageHeader.vue'
import ChatImageHowItWorks from '@/components/chatimage/ChatImageHowItWorks.vue'
import ChatImagePricing from '@/components/chatimage/ChatImagePricing.vue'
import ChatImagePromptGallery from '@/components/chatimage/ChatImagePromptGallery.vue'
import ChatImageTools from '@/components/chatimage/ChatImageTools.vue'
import ChatImageUseCases from '@/components/chatimage/ChatImageUseCases.vue'

useHead({
  title: 'RDR Generator | Create & Edit Images Online',
  meta: [
    {
      name: 'description',
      content: 'Create images from text prompts, edit uploaded references, and generate posters, product shots, UI mockups, portraits, and social graphics with RDR.',
    },
  ],
  htmlAttrs: { class: 'chatimage-html' },
  bodyAttrs: { class: 'chatimage-body' },
})
</script>

<template>
  <div id="home" class="chatimage-app min-h-svh w-full bg-background text-foreground antialiased">
    <ChatImageHeader />
    <main>
      <ChatImageGenerator />
      <ChatImageTools />
      <ChatImagePromptGallery />
      <ChatImageFeatures />
      <ChatImageHowItWorks />
      <ChatImageUseCases />
      <ChatImagePricing />
      <ChatImageFAQ />
      <ChatImageCTA />
    </main>
    <ChatImageFooter />
  </div>
</template>

<style scoped>
.chatimage-app {
  background-image: none !important;
  background-color: hsl(var(--background));
}
</style>

<style>
/* Override the dark app shell so overscroll/rubber-band shows white, not black. */
html.chatimage-html,
html.chatimage-html body.chatimage-body {
  background-color: #fff;
}
html.chatimage-html body.chatimage-body .page-transition-root {
  background-color: #fff;
  background-image: none;
}
</style>
