<template>
  <v-app>
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet"/>

      <div>
        <v-toolbar color="blue-grey darken-2" dark>
          <v-toolbar-title class='font-weight-bold'>ZotTodoRe</v-toolbar-title>
          <v-spacer></v-spacer>
          <div v-if="connected">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon color="white" v-bind="attrs" v-on="on">
                  <v-icon>mdi-account-cog</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <changePassword />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
           
            <v-btn icon color="white" @click="deconnexion">
              <v-icon>mdi-export</v-icon>
            </v-btn>
          </div>
          <div v-else class="d-flex">
            <v-btn text color="white" :to="registerPath"> Inscription </v-btn>
            <v-btn text color="white" :to="loginPath"> Connexion </v-btn>
          </div>
        </v-toolbar>
      </div>

    <v-main>
      <router-view @updateNavbar="updateNavbar"></router-view>
    </v-main>

      <v-footer dark padless v-if="connected">
      <v-card class="flex blue-grey darken-2" flat tile>
        <v-card-text class="py-2 white--text text-center">
          Copyright {{ new Date().getFullYear() }} — <strong>Daryl ABRADOR</strong>
        </v-card-text>
      </v-card>
    </v-footer>
    <flashMessage></flashMessage>
  </v-app>
</template>

<script src="./layout.js"></script>