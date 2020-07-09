<template>
    <v-ons-page @show="updateSettingsCarpetModePage()">
        <ons-toolbar>
            <div class="left">
                <ons-back-button>Settings</ons-back-button>
            </div>
            <div class="center">Carpet Mode</div>
            <div class="right">
            </div>
        </ons-toolbar>
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>
        <ons-list-title style="margin-top:5px;">Carpet Mode Configuration</ons-list-title>

        <ons-row>
            <ons-col></ons-col>
            <ons-col vertical-align='center' style='text-align:center; max-width: 400px;'>In Carpet Mode, the vacuum will recognize carpets automatically and increase the suction.</ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col width="150px" vertical-align='center'>Enabled</ons-col>
            <ons-col width="150px" vertical-align='center'><v-ons-checkbox v-model="enabled"></v-ons-checkbox></ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col><br/></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col vertical-align='center' style='text-align:center; max-width: 400px;'><b>Only change any of the following parameter if you know what you are doing!</b></ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col width="150px" vertical-align='center'>Current Low</ons-col>
            <ons-col width="150px" vertical-align='center'><v-ons-input type="number" placeholder="400" min="1" max="1000" v-model="current_low"></v-ons-input></ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col width="150px" vertical-align='center'>Current High</ons-col>
            <ons-col width="150px" vertical-align='center'><v-ons-input type="number" placeholder="500" min="1" max="1000" v-model="current_high"></v-ons-input></ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col width="150px" vertical-align='center'>Current Integral</ons-col>
            <ons-col width="150px" vertical-align='center'><v-ons-input type="number" placeholder="450" min="1" max="1000" v-model="current_integral"></v-ons-input></ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col width="150px" vertical-align='center'>Stall Time</ons-col>
            <ons-col width="150px" vertical-align='center'><v-ons-input type="number" placeholder="100" min="1" max="100" v-model="stall_time"></v-ons-input></ons-col>
            <ons-col></ons-col>
        </ons-row>
        <ons-row>
            <ons-col></ons-col>
            <ons-col width="100px" vertical-align='center'><v-ons-button modifier="large" class="button-margin" @click="saveCarpetMode()">Save</v-ons-button></ons-col>
            <ons-col></ons-col>
        </ons-row>
    </v-ons-page>
</template>
 
<script>
    module.exports = {
        data: function() {
            return { 
                loading: false,
                enabled: false,
                current_low: null,
                current_high: null,
                current_integral: null,
                stall_time: null
            }
        },
        methods: {
            updateSettingsCarpetModePage: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    let res = await ApiService.getCarpetMode();
                    let result = res[0];
                    this.current_low = result.current_low;
                    this.current_high = result.current_high;
                    this.current_integral = result.current_integral;
                    this.stall_time = result.stall_time;
                    this.enabled = (result.enable == 1);
                } catch (err) {
                    this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            saveCarpetMode: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                let answer = await this.$ons.notification
                    .confirm("Do you really want to save the modifications made in the carpet mode?");

                if (answer === 1) {
                    this.loading = true;

                    try {
                        await ApiService.setCarpetMode(this.enabled, this.current_low, this.current_high, this.current_integral, this.stall_time);
                        this.updateSettingsCarpetModePage();
                    } catch (err) {
                        this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }
    }
</script>
 
<style scoped>
</style>