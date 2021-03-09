<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-layout align-center justify-center>
          <v-flex class="login-form text-xs-center login">
            <div class="display-1 mb-3 d-flex flex-column align-center">
              <v-img src="/logo.svg" width="92"></v-img>
              InvoiceKit
            </div>
            <v-card light="light">
              <v-card-text>
                <nuxt></nuxt>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>

    <v-footer app>
      <v-flex class="text-xs-center">© 2021. All rights reserved.</v-flex>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: 'preventAuth',
}
</script>

<style scoped>
.login {
  max-width: 450px;
}
</style>
