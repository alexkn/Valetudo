<template>
    <v-ons-page @show="init()">
        <ons-toolbar>
            <div class="left">
                <ons-back-button>Settings</ons-back-button>
            </div>
            <div class="center">Info</div>
            <div class="right"></div>
        </ons-toolbar>
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>

        <ons-list-title style="margin-top:5px;">System</ons-list-title>
        <ons-list>
            <ons-list-item>
                <div class="left">
                    Device Manufacturer:
                </div>
                <div class="right">
                    {{ model.manufacturer }}
                </div>
            </ons-list-item>
            <ons-list-item>
                <div class="left">
                    Device Model:
                </div>
                <div class="right">
                    {{ model.name }}
                </div>
            </ons-list-item>
            <ons-list-item>
                <div class="left">
                    Device Model Identifier:
                </div>
                <div class="right">
                    {{ model.identifier }}
                </div>
            </ons-list-item>
            <ons-list-item>
                <div class="left">
                    Firmware version:
                </div>
                <div class="right">
                    {{ fwVersion.version }}
                </div>
            </ons-list-item>
            <ons-list-item>
                <div class="left">
                    Timezone:
                </div>
                <div class="right">
                    {{ timezone }}
                </div>
            </ons-list-item>
        </ons-list>
        <ons-list-title style="margin-top:5px;">Valetudo</ons-list-title>
        <ons-list>
            <ons-list-item>
                <div class="left">
                    Running Valetudo version:
                </div>
                <div class="right">
                    {{ fwVersion.valetudoVersion }}
                </div>
            </ons-list-item>
            <ons-list-item>
                <div class="left">
                    Newest Valetudo version:
                </div>
                <div class="right">
                    <span v-if="newestRelease.tag_name">{{ newestRelease.tag_name }}</span>
                    <ons-button v-else modifier="large" class="button-margin" @click="checkNewValetudoVersion();">Check for new Valetudo Version</ons-button>
                </div>
            </ons-list-item>
            <ons-list-item v-if="newestRelease.tag_name && newestRelease.tag_name != fwVersion.valetudoVersion">
                <div class="left">
                    Newest Version URL:
                </div>
                <div class="right">
                    <a :href="newestRelease.html_url">{{ newestRelease.html_url }}</a>
                </div>
            </ons-list-item>
        </ons-list>
    </v-ons-page>
</template>
 
<script>
    module.exports = {
        data: function() {
            return { 
                loading: false,
                fwVersion: {version: "?", valetudoVersion: "?"},
                model: {},
                timezone: null,
                newestRelease: {}
            }
        },
        methods: {
            init: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;
                try {
                    this.loading = true;
                    this.fwVersion = await ApiService.getFWVersion();
                    this.model = await ApiService.getModel();
                    this.timezone = await ApiService.getTimezone();
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },
            checkNewValetudoVersion: async function () {
                try {
                    this.loading = true;

                    let res = await fetch("https://api.github.com/repos/Hypfer/Valetudo/releases", {method: "GET"});
                    if (!res.ok) {
                        throw Error(await res.text());
                    }
                    let json = await res.json();
                    this.newestRelease = json[0];
                } catch (err) {
                    this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: 1500});
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>
 
<style>

</style>