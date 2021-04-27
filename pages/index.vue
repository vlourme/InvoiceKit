<template>
  <div
    class="w-full font-body overflow-y-hidden text-white bg-gradient-to-br from-gray-800 to-gray-900"
  >
    <div class="max-w-7xl mx-auto">
      <section
        class="md:h-screen py-12 px-4 block lg:px-2 md:py-0 md:flex justify-center items-center"
      >
        <div class="text-center">
          <h1 class="font-poppins font-semibold text-2xl md:text-4xl my-4">
            Une infrastructure de facturation moderne et entièrement en ligne
          </h1>

          <img class="max-w-5xl w-full mx-auto" src="~/assets/demo@3x.png" />

          <p class="md:text-lg max-w-5xl mx-auto text-gray-200">
            InvoiceKit est un CRM de nouvelle génération pensé pour être simple
            d'utilisation mais complet et modulable.
            <br />
            Comme tout les CRM, il gère vos clients et vos documents (devis,
            facture, contrats). Cependant, InvoiceKit est capable de travailler
            et s'adapter avec des modèles de données inconnues rendant son usage
            extensible.
          </p>

          <div class="mt-6 flex flex-col items-center md:block">
            <nuxt-link
              class="bg-blue-500 border-2 border-transparent hover:bg-transparent hover:border-blue-500 transition-all px-4 py-2 rounded-lg text-lg font-medium"
              to="/auth/register"
              >Créer mon compte</nuxt-link
            >

            <nuxt-link
              class="mt-4 md:mt-0 md:ml-4 border-2 border-green-500 hover:bg-green-500 transition-all px-4 py-2 rounded-lg text-lg font-light"
              to="/auth/login"
              >Se connecter</nuxt-link
            >
          </div>
        </div>
      </section>
      <section class="py-12 px-6">
        <div class="grid xs:grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <div class="text-gray-200">
            <i class="bx bx-timer text-6xl"></i>
            <p class="mt-2 font-medium text-xl">Mise en route rapide</p>
            <p class="mt-1 text-gray-400">
              L'inscription et la création d'un espace de travail prend moins de
              trois minutes.
            </p>
          </div>
          <div class="text-gray-200">
            <i class="bx bxs-extension text-6xl"></i>
            <p class="mt-2 font-medium text-xl">Extensible</p>
            <p class="mt-1 text-gray-400">
              Le support de modèles de données externes et d'extensions est
              inclut.
            </p>
          </div>
          <div class="text-gray-200">
            <i class="bx bx-git-branch text-6xl"></i>
            <p class="mt-2 font-medium text-xl">Open Source</p>
            <p class="mt-1 text-gray-400">
              Pour des questions de transparence, le code source est entièrement
              public.
            </p>
          </div>
        </div>
      </section>
      <section class="lg:py-20 py-10 px-6 max-w-6xl mx-auto text-gray-200">
        <i class="bx bxs-info-square text-6xl"></i>
        <p class="mt-2 font-medium text-xl">A propos</p>
        <p class="mt-1 text-gray-400">
          InvoiceKit est un projet secondaire et personnel développé entièrement
          par
          <a
            class="text-blue-400 hover:text-blue-500 transition-colors"
            href="https://vlour.me"
            >Victor Lourme</a
          >.
          <br />
          Le but d'InvoiceKit est à terme de devenir entièrement extensible et
          capable de gérer de la donnée externe sous n'importe quel format.
          <br />
          Concernant le développement, le projet est disponible sur GitHub,
          actuellement développé avec Nuxt et Firebase en suivant une logique
          serverless.
        </p>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  head: {
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
      },
    ],
  },
})
</script>
