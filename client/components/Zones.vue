<template>
    <v-ons-page @show="ZonesInit()">
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>

        <ons-list-title style="margin-top:20px;">Configured zones</ons-list-title>
        <ons-list id="zones-list">
            <v-ons-list-item v-for="(zone, index) in userZones" v-bind:zone="zone" v-bind:index="index" v-bind:key="zone.id" tappable class="locations-list-item" @click="switchToMapZoneEdit(index)">
                <label>
                    <ons-icon icon="edit"></ons-icon>
                </label>
                <label>
                    {{ zone.name }}
                </label>
                <ons-button class="button-delete" @click.stop="deleteZone(index);"><ons-icon icon="fa-trash"></ons-icon> Delete</ons-button>
            </v-ons-list-item>

            <ons-list-item class="locations-list-item">
                <label>
                    <ons-icon icon="edit"></ons-icon>
                </label>
                <v-ons-input id="add-zone-name" v-model="newZoneName" placeholder="Enter name for zone ..."></v-ons-input>
                <v-ons-button class="delete-button-right" @click="addNewZone()"><ons-icon icon="fa-plus"></ons-icon> Add</v-ons-button>
            </ons-list-item>
        </ons-list>

        <ons-list-title style="margin-top:20px;">Configured goto locations</ons-list-title>
        <ons-list id="spot-list">
            <v-ons-list-item v-for="(spot, index) in spots" v-bind:spot="spot" v-bind:index="index" v-bind:key="spot.name" tappable class="locations-list-item" @click="switchToMapSpotEdit(index)">
                <label>
                    <ons-icon icon="edit"></ons-icon>
                </label>
                <label>
                    {{ spot.name }}
                </label>
                <ons-button class="button-delete" @click.stop="deleteSpot(index);"><ons-icon icon="fa-trash"></ons-icon> Delete</ons-button>
            </v-ons-list-item>

            <ons-list-item class="locations-list-item">
                <label>
                    <ons-icon icon="edit"></ons-icon>
                </label>
                <v-ons-input id="add-spot-name" v-model="newSpotName" placeholder="Enter name for spot ..."></v-ons-input>
                <v-ons-button class="delete-button-right" @click="addNewSpot()"><ons-icon icon="fa-plus"></ons-icon> Add</v-ons-button>
            </ons-list-item>
        </ons-list>
        
        <div id="forbidden-zones-item" v-show="forbiddenZonesVisible">
            <ons-list-title style="margin-top:20px;">Forbidden markers</ons-list-title>
            <ons-list id="forbidden-zones-list">
                <ons-list-item tappable class="locations-list-item" @click="switchToForbiddenMarkersEdit()">
                    <label><ons-icon icon="edit"></ons-icon></label>
                    <label>Configure forbidden zones</label>
                </ons-list-item>
            </ons-list>
        </div> 
    </v-ons-page>
</template>
 
<script>
    module.exports = {
        data: function() {
            return { 
                loading: false,
                zones: [],
                spots: [],
                newZoneName: "",
                newSpotName: "",
                forbiddenZonesVisible: false
            }
        },
        computed: {
            userZones: function () {
                return this.zones.filter((zone) => zone.user);
            }
        },
        methods: {
            switchToMapZoneEdit: async function (index) {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    let mapData = await ApiService.getLatestMap();
                    this.pushPage({
                        "id": "zones-configuration-map.html",
                        "title": "Zone configuration map",
                        "data": {"map": mapData, "zonesConfig": this.zones, "zoneToModify": index}
                    });
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            switchToMapSpotEdit: async function (index) {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    let mapData = await ApiService.getLatestMap();
                    this.pushPage({
                        "id": "spot-configuration-map.html",
                        "title": "Spot configuration map",
                        "data": {"map": mapData, "spotConfig": this.spots, "spotToModify": index}
                    });
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            switchToForbiddenMarkersEdit: async function (index) {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    let mapData = await ApiService.getLatestMap();
                    this.pushPage({
                        "id": "forbidden-markers-configuration-map.html",
                        "title": "Forbidden markers configuration map",
                        "data": {"map": mapData}
                    });
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            deleteZone: function (index) {
                this.zones.splice(index, 1);
                this.saveZones();
            },

            deleteSpot: function (index) {
                this.spots.splice(index, 1);

                this.saveSpots();
            },

            saveZones: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    await ApiService.saveZones(this.zones);
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            saveSpots: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    await ApiService.saveSpots(this.spots);
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            addNewZone: function () {
                if (this.newZoneName.trim() === "") {
                    this.$ons.notification.toast("Please enter a zone name",
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } else {
                    const id = Math.min(...this.zones.map(v => v.id)) - 1;
                    this.zones.push({id, name: this.newZoneName, areas: [], user: true});
                }

                this.saveZones();
                this.newZoneName = "";
            },

            addNewSpot: function () {
                if (this.newSpotName.trim() === "") {
                    this.$ons.notification.toast("Please enter a spot name",
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } else {
                    this.spots.push({name: this.newSpotName, coordinates: [25000, 25000]});
                }

                this.saveSpots();
                this.newSpotName = "";
            },

            ZonesInit: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;

                /* check for area and go to configuration */
                try {
                    this.zones = await ApiService.getZones();
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                }

                try {
                    this.spots = await ApiService.getSpots();
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                }

                /* forbidden zones are not supported by gen 1 vacuums */
                try {
                    let modelConfig = await ApiService.getModel();
                    if (modelConfig.identifier !== "rockrobo.vacuum.v1") {
                        this.forbiddenZonesVisible = true;
                    }
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                }

                this.loading = false;
            },
            pushPage(page) {
                this.$emit('push-page', page);
            }
        }
    }
</script>
 
<style scoped>
    .locations-list-item > div {
        display: grid;
        gap: 1em;
        grid-template-columns: auto 1fr auto;
        width: 100%;
    }

    .button-delete {
        background-color: #f45942; /* Random nice red color :) */
    }
</style>