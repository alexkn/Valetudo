<template>
    <v-ons-page @show="updateSettingsAccessControlPage()">
        
        <ons-toolbar>
            <div class="left">
                <ons-back-button>Settings</ons-back-button>
            </div>
            <div class="center">Access Control Settings</div>
            <div class="right">
            </div>
        </ons-toolbar>
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>

        <ons-list-title style="margin-top:20px;">HTTP Authentication Settings</ons-list-title>
        <ons-list>
            <ons-list-item>
                <div>
                    <ons-col>
                            <ons-col width="150px" vertical-align='center'>Enabled</ons-col>
                    </ons-col>
                </div>
                <label class="right" style="width:100%">
                    <ons-row>
                        <ons-col>
                                <ons-col width="150px" vertical-align='center'><v-ons-checkbox v-model="enabled"></v-ons-checkbox></ons-col>
                        </ons-col>
                    </ons-row>
                </label>
            </ons-list-item>
            <ons-list-item>
                <label class="right" style="width:100%">
                    <ons-row>
                        <ons-col>
                                <v-ons-input v-model="username" float placeholder="Username" style="width:100%"></v-ons-input>
                        </ons-col>
                    </ons-row>
                </label>
            </ons-list-item>
            <ons-list-item>
                <label class="right" style="width:100%">
                    <ons-row>
                        <ons-col>
                                <v-ons-input v-model="password" type="password" float placeholder="Password" style="width:100%;"></v-ons-input>
                        </ons-col>
                    </ons-row>
                </label>
            </ons-list-item>
            <ons-list-item>
                <label class="right" style="width:100%">
                    <ons-row>
                        <ons-col>
                                <v-ons-input v-model="confirmPassword" type="password" float placeholder="Password (again)" style="width:100%;"></v-ons-input>
                        </ons-col>
                    </ons-row>
                </label>
            </ons-list-item>
            <ons-list-item>
                <div class="center">
                    <v-ons-button modifier="large" class="button-margin" @click="handleHttpAuthSettingsSaveButton()">Save credentials</v-ons-button>
                </div>
            </ons-list-item>
        </ons-list>

        <v-ons-list-title style="margin-top:20px;" v-show="sshVisible">SSH Keys Settings</v-ons-list-title>
        <v-ons-list v-show="sshVisible">
            <ons-list-item>
                <label class="right" style="width:100%">
                    <ons-row>
                        <ons-col>
                            <textarea class="textarea" v-model="sshKeys" rows="5" placeholder="ssh-rsa ..." style="width:100%"></textarea>
                        </ons-col>
                    </ons-row>
                </label>
            </ons-list-item>
            <ons-list-item>
                <div class="center">
                    <v-ons-button modifier="large" class="button-margin" @click="handleSSHKeysSettingsSaveButton()">Save SSH keys</v-ons-button>
                </div>
            </ons-list-item>
            <ons-list-item>
                <label class="right" style="width:100%">
                    <ons-row>
                        <ons-col vertical-align='center'>Enter "confirm" below. Don't lock yourself out!</ons-col>
                    </ons-row>
                    <ons-row>
                        <ons-col>
                                <v-ons-input v-model="confirmSshDisable" float maxlength="32" placeholder="" style="width:100%"></v-ons-input>
                        </ons-col>
                    </ons-row>
                </label>
            </ons-list-item>
            <ons-list-item>
                <div class="center">
                    <v-ons-button style="background-color:#ff0000" modifier="large" class="button-margin" @click="handleSSHKeysSettingsPermanentlyDisableButton()">Permanently disable SSH key upload</v-ons-button>
                </div>
            </ons-list-item>
        </v-ons-list>
 
    </v-ons-page>
</template>
 
<script>
    module.exports = {
        data: function() {
            return { 
                loading: false,
                enabled: false,
                username: "valetudo",
                password: "",
                confirmPassword: "",
                sshKeys: "",
                sshVisible: false,
                confirmSshDisable: ""
            }
        },
        computed: {

        },
        methods: {
            updateSettingsAccessControlPage: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    let res = await ApiService.getHttpAuthConfig();
                    this.enabled = res.enabled;
                    this.username = res.username;

                    try {
                        res = await ApiService.getSshKeys();
                        this.sshKeys = res;
                        this.sshVisible = true;
                    } catch (error) {
                        // ignore error (SSH Keys disabled)
                    }
                } catch (err) {
                    this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            handleSSHKeysSettingsSaveButton: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                var loadingBarSettingsAccessControl = document.getElementById("loading-bar-settings-access-control");
                var sshKeysTextArea = document.getElementById("settings-access-control-ssh-keys-textarea");

                this.loading = true;
                try {
                    await ApiService.setSshKeys(this.sshKeys);
                } catch (err) {
                    this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            handleSSHKeysSettingsPermanentlyDisableButton: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    await ApiService.disableSshKeyUpload(this.confirmSshDisable);
                    this.sshVisible = false;
                } catch (err) {
                    this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            }, 

            handleHttpAuthSettingsSaveButton: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                if (this.password !== this.confirmPassword)
                    return this.$ons.notification.toast(
                        "Passwords don't match",
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});

                this.loading = true;
                try {
                    await ApiService.saveHttpAuthConfig({
                        enabled: this.enabled === true,
                        username: this.username,
                        password: this.password,
                    });
                } catch (err) {
                    this.$ons.notification.toast(err.message, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>
 
<style scoped>

</style>