<template>
    <v-ons-page @show="homeInit()" @hide="homeHide()">
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>

        <section>
            <p id="robot-state">
                <span v-if="error_code" class="robot-error">
                    <ons-icon icon="fa-exclamation-triangle"></ons-icon> 
                    {{ human_error }} 
                    <ons-icon icon="fa-exclamation-triangle"></ons-icon>
                </span>
                <span v-else>{{ human_state }}</span>
            </p>
            <div style="width:100%; text-align:center;">
                <p id="robot-state-details">
                    <span id="robot-state-details-m2">Area: {{ ("00" + (clean_area / 1000000).toFixed(2)).slice(-6) }} m²</span>
                    <span id="robot-state-details-time">Time: {{ secondsToHms(clean_time) }}</span>
                </p>
            </div>
        </section>
        <hr>

        <section id="robot-control-buttons">
            <v-ons-button class="button-margin" @click="handleControlButton('start')" :disabled="startButtonDisabled">
                <ons-icon icon="fa-play"></ons-icon> Start
            </v-ons-button>
            <v-ons-button class="button-margin" @click="handleControlButton('pause')" :disabled="pauseButtonDisabled">
                <ons-icon icon="fa-pause"></ons-icon> Pause
            </v-ons-button>
            <br>
            <v-ons-button class="button-margin" @click="handleControlButton('stop')" :disabled="stopButtonDisabled">
                <ons-icon icon="fa-stop"></ons-icon> Stop
            </v-ons-button>
            <v-ons-button class="button-margin" @click="handleControlButton('home')" :disabled="homeButtonDisabled">
                <ons-icon icon="fa-home"></ons-icon> Home
            </v-ons-button>
            <br>
            <v-ons-button class="button-margin" @click="handleControlButton('spot')" :disabled="spotButtonDisabled">
                <ons-icon icon="fa-caret-down"></ons-icon> Spot
            </v-ons-button>
            <v-ons-button class="button-margin" @click="handleControlButton('find')" :disabled="findButtonDisabled">
                <ons-icon icon="fa-map-marker"></ons-icon> Find
            </v-ons-button>
            <br>
            <v-ons-button class="button-margin" @click="handleGoToButton()" :disabled="gotoButtonDisabled">
                <ons-icon icon="fa-map-signs"></ons-icon> Go to 
            </v-ons-button>
            <v-ons-button class="button-margin" @click="handleZonesButton()" :disabled="areaButtonDisabled">
                <ons-icon icon="fa-map"></ons-icon> Zones 
            </v-ons-button>
            <br>
            <v-ons-button class="button-margin" @click="handleFanspeedButton()" :disabled="fanspeedButtonDisabled">
                <ons-icon icon="fa-superpowers"></ons-icon> {{ fan_power ? (fanspeedPresets[fan_power] || "Custom " + fan_power +"%") : "Unknown power" }} 
            </v-ons-button>
        </section>
        <hr>

        <section style="margin: 10px 16px">
            <p>Battery: {{ battery }} %</p>
            <p><v-ons-progress-bar :value="battery" secondary-value="100"></v-ons-progress-bar></p>
        </section>

        <v-ons-dialog id="zone-clean-select" cancelable :visible.sync="showZonesDialog">
            <ons-list-title style="">Select zones</ons-list-title>
            <ons-list id="zone-list" :style="{ overflowY: 'auto', maxHeight: zoneListMaxHeight }">
                <v-ons-list-item v-for="(zone, index) in zones" v-bind:zone="zone" v-bind:index="index" v-bind:key="zone.id" tappable style="margin-bottom:0;">
                    <label class="left">
                        <ons-checkbox :input-id="'zone-' + zone.id" :zone-id="zone.id" class="zone-select-checkbox"></ons-checkbox>
                    </label>
                    <label :for="'zone-' + zone.id" class="center">{{ zone.name }}</label>
                </v-ons-list-item>
            </ons-list>
            <ons-list-item>
                <v-ons-button class="button" @click="handleZonesCancelButton()" style="width:45%; margin-right:5%;" modifier="outline">Cancel</v-ons-button>
                <v-ons-button class="button" @click="handleZonesStartButton()" style="width:45%;"><ons-icon icon="fa-play" class="ons-icon fa-play fa"></ons-icon> Start</v-ons-button>
            </ons-list-item>
        </v-ons-dialog>
    </v-ons-page>
</template>
 
<script>
    let currentRefreshTimer;
    let zonesSelectDialog = null;

    module.exports = {
        data: function() {
            return { 
                loading: false,
                battery: null,
                spots: [],
                zones: [],
                state: null,
                human_state: "Loading state...!",
                in_cleaning: null,
                error_code: 0,
                human_error: null,
                clean_area: 0,
                clean_time: null,
                fanspeedPresets: [],
                fan_power: null,
                pressedButton: null,
                showZonesDialog: false
            }
        },
        computed: {
            startButtonDisabled: function() {
                if (this.pressedButton == "start") return true;
                if (this.in_cleaning === 1 || this.in_cleaning === 2 ||
                    ["SPOT_CLEANING", "GOING_TO_TARGET", "CLEANING"].indexOf(this.state) != -1) {
                    if (["IDLE", "PAUSED", "CHARGER_DISCONNECTED"].indexOf(this.state) != -1) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return this.state == 6;
                }
            },
            pauseButtonDisabled: function() {
                if (this.pressedButton == "pause") return true;
                if (this.in_cleaning === 1 || this.in_cleaning === 2 ||
                    ["SPOT_CLEANING", "GOING_TO_TARGET", "CLEANING"].indexOf(this.state) != -1) {
                    if (["IDLE", "PAUSED", "CHARGER_DISCONNECTED"].indexOf(this.state) != -1) {
                        return true;
                    } else {
                        return false
                    }
                } else {
                    return this.state !== 6;
                }
            },
            stopButtonDisabled: function() {
                if (this.pressedButton == "stop") return true;
                return ["CHARGING", "DOCKING", "PAUSED", "IDLE"].indexOf(this.state) != -1;
            },
            homeButtonDisabled: function() {
                if (this.pressedButton == "home") return true;
                return ["RETURNING_HOME", "CHARGING", "CHARGING_PROBLEM"].indexOf(this.state) != -1;
            },
            spotButtonDisabled: function() {
                if (this.pressedButton == "spot") return true;
                return this.in_cleaning === 1 || this.in_cleaning === 2 || ['SPOT_CLEANING', 'GOING_TO_TARGET', 'CLEANING'].indexOf(this.state) != -1;
            },
            findButtonDisabled: function () {
                if (this.pressedButton == "find") return true;
                return false;
            },
            gotoButtonDisabled: function() {
                if (this.pressedButton == "goto") return true;
                return !this.spots || this.spots.length == 0;
            },
            areaButtonDisabled: function() {
                if (this.pressedButton == "area") return true;
                return !this.zones || this.zones.length == 0;
            },
            fanspeedButtonDisabled: function() {
                if (this.pressedButton == "fanspeed") return true;
                return !this.fanspeedPresets || this.fanspeedPresets.length == 0;
            },
            zoneListMaxHeight: function () {
                return document.body.clientHeight - 200 + 'px';
            }
        },
        methods: {
            homeInit: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                /* check for area and go to configuration */
                let config = await ApiService.getConfig();
                this.spots = config.spots;
                this.zones = await ApiService.getZones();

                this.fanspeedPresets = await ApiService.getFanSpeeds();

                this.updateHomePage();
            },
            homeHide: async function() {
                window.clearTimeout(currentRefreshTimer);
            },
            secondsToHms: function (d) {
                d = Number(d);

                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);

                return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
            },
            handleControlButton: async function (button) {
                const ApiService = (await import("../services/api.service.js")).ApiService;
                
                this.loading = true;

                try {
                    this.pressedButton = button;
                    switch (button) {
                        case "start":
                            await ApiService.startCleaning();
                            break;
                        case "pause":
                            await ApiService.pauseCleaning();
                            break;
                        case "stop":
                            ApiService.stopCleaning();
                            break;
                        case "home":
                            ApiService.driveHome();
                            break;
                        case "find":
                            ApiService.findRobot();
                            break;
                        case "spot":
                            ApiService.spotClean();
                            break;
                        default:
                            throw new Error("Invalid button");
                    }

                    window.clearTimeout(currentRefreshTimer);
                    window.setTimeout(() => {
                        this.updateHomePage();
                    }, 500);
                } catch (err) {
                    this.loading = false;
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                }
            },
            handleFanspeedButton: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                window.clearTimeout(currentRefreshTimer);

                let index = await this.$ons.openActionSheet({
                    title: "Select power mode",
                    cancelable: true,
                    buttons: [...Object.values(this.fanspeedPresets), {label: "Cancel", icon: "md-close"}]
                });

                var level = Object.keys(this.fanspeedPresets)[index];

                if (level) {
                    this.loading = true;
                    this.pressedButton = "fanspeed";
                    try {
                        await ApiService.setFanspeed(level);
                        window.clearTimeout(currentRefreshTimer);
                        window.setTimeout(() => {
                            this.updateHomePage();
                        }, 150);
                    } catch (err) {
                        this.pressedButton = "null";
                        this.loading = false;
                        this.$ons.notification.toast(err.message,
                            {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                    }
                } else {
                    window.setTimeout(() => {
                        this.updateHomePage();
                    }, 3000);
                }

            },
            handleGoToButton: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                window.clearTimeout(currentRefreshTimer);
                var options = [];

                for (var i = 0; i < this.spots.length; i++) {
                    options.push(this.spots[i][0]);
                }

                options.push({label: "Cancel", icon: "md-close"});

                let index = await this.$ons.openActionSheet({title: "Go to", cancelable: true, buttons: options});
                if (index > -1 && index < this.spots.length) {
                    try {
                        await ApiService.goto(this.spots[index][1], this.spots[index][2]);
                        window.setTimeout(() => {
                            this.updateHomePage();
                        }, 3000);
                    } catch (err) {
                        this.$ons.notification.toast(err.message,
                            {buttonLabel: "Dismiss", timeout: 1500});
                    }
                } else {
                    window.setTimeout(() => {
                        this.updateHomePage();
                    }, 3000);
                }
            },
            handleZonesCancelButton: async function () {
                this.showZonesDialog = false;
            },
            handleZonesStartButton: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                let checkboxes = document.getElementsByClassName("zone-select-checkbox");
                let zoneIds = [];
                Array.prototype.forEach.call(checkboxes, function(element) {
                    if (element.checked === true) {
                        zoneIds.push(parseInt(element.getAttribute("zone-id")));
                    }
                });

                if (zoneIds.length > 0) {
                    try {
                        await ApiService.startCleaningZonesById(zoneIds);
                    } catch (err) {
                        this.$ons.notification.toast(err.message,
                            {buttonLabel: "Dismiss", timeout: 1500});
                    } finally {
                        window.setTimeout(() => {
                            this.updateHomePage();
                        }, 3000);
                    }
                } else {
                    window.setTimeout(() => {
                        this.updateHomePage();
                    }, 3000);
                }
                this.showZonesDialog = false;
            },
            handleZonesButton: async function () {
                this.showZonesDialog = true;
            },
            updateHomePage: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;

                try {
                    let res = await ApiService.getCurrentStatus();
                    this.loading = false;
                    this.battery = res.battery;
                    this.in_cleaning = res.in_cleaning;
                    this.state = res.state;
                    this.human_state = res.human_state;
                    this.error_code = res.error_code;
                    this.human_error = res.human_error;
                    this.clean_area = res.clean_area;
                    this.clean_time = res.clean_time;
                    this.fan_power = res.fan_power;
                    this.pressedButton = null;

                    currentRefreshTimer =
                        window.setTimeout(() => {
                            this.updateHomePage();
                        }, 5000);
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                }
            }
        }
    }
</script>
 
<style scoped>
    hr {
        width:98%; 
        opacity: 0.3;
    }
    #robot-state {
        text-align: center;
        font-size: 1.2em;
        font-weight: 500;
    }

    .robot-error {
        color: #eb5959;
        display: block;
    }

    #robot-control-buttons {
        text-align: center;
    }

        #robot-control-buttons > ons-button {
            margin: 5px;
            font-size: 1.2em;
            width: 40%;
        }

    #robot-state-details-m2 {
        margin-right: 5%;
    }

    #robot-state-details-time {
        text-align: right;
    }
</style>