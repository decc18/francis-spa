<script setup lang="ts">
import { UserIcon, MailIcon, ListCheckIcon } from 'vue-tabler-icons';
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <!-- <img src="@/assets/images/profile/user-1.jpg" height="35" alt="user" /> -->
        </template>
        <v-sheet rounded="xl" width="200" elevation="10" class="mt-2">
            <v-list class="py-0" lines="one" density="compact">
                <v-list-item value="item1" color="primary" >
                    <template v-slot:prepend>
                        <UserIcon stroke-width="1.5" size="20"/>
                    </template>
                    <v-list-item-title class="pl-4 text-body-1">Mi cuenta</v-list-item-title>
                </v-list-item>
                <!-- <v-list-item value="item2" color="primary">
                    <template v-slot:prepend>
                        <MailIcon stroke-width="1.5" size="20"/>
                    </template>
                    <v-list-item-title  class="pl-4 text-body-1">My Account</v-list-item-title>
                </v-list-item>-->
                <!-- <v-list-item value="item3" color="primary"> 
                    <template v-slot:prepend>
                        <ListCheckIcon stroke-width="1.5"  size="20"/>
                    </template>
                    <v-list-item-title class="pl-4 text-body-1">My Task</v-list-item-title>
                </v-list-item>  -->
            </v-list>
            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn to="" color="primary" variant="outlined" class="rounded-pill" block>Salir</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
