<template>
    <v-ons-page @show="updateMapPage()" @hide="cancelUpdateMap()">
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>

        <canvas id="map-canvas"></canvas>

        <div class="map-page-buttons">
            <v-ons-fab ripple id="add_zone" @click="handleAddZone()">
                <ons-icon icon="fa-plus"></ons-icon>
            </v-ons-fab>
            <v-ons-fab ripple id="start_zoned_cleanup" @click="handleStartZonedCleanup()" :disabled="startZonedCleanupButtonDisabled">
                <ons-icon icon="fa-play"></ons-icon>
            </v-ons-fab>
            <v-ons-fab ripple id="goto" @click="handleGoto()" :disabled="gotoButtonDisabled">
                <ons-icon icon="fa-map-marker"></ons-icon>
            </v-ons-fab>
        </div>

    </v-ons-page>
</template>
 
<script>
    let map = null;

    module.exports = {
        data: function() {
            return { 
                loading: false,
                gotoButtonDisabled: false,
                startZonedCleanupButtonDisabled: false
            }
        },
        methods: {
            updateMapPage: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;
                const VacuumMap = (await import("../zone/js-modules/vacuum-map.js")).VacuumMap;

                this.loading = true;
                try {
                    let mapData = await ApiService.getLatestMap();
                    if (map === null) {
                        map = new VacuumMap(document.getElementById("map-canvas"));
                        map.initCanvas(mapData);
                    } else {
                        map.updateMap(mapData);
                    }
                    map.initWebSocket();
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                     this.loading = false;
                }
            },
            cancelUpdateMap: function () {
                if (map !== null) {
                    map.closeWebSocket();
                }
            },
            goto_point: async function (point) {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                this.gotoButtonDisabled = true;
                try {
                    await ApiService.goto(point.x, point.y);
                    this.$ons.notification.toast("Command successfully sent!",
                        {buttonLabel: "Dismiss", timeout: fn.toastOKTimeout});
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                    this.gotoButtonDisabled = false;
                }
            },
            zoned_cleanup: async function (zones) {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                this.startZonedCleanupButtonDisabled = true;
                try {
                    await ApiService.startCleaningZoneByCoords(zones);
                    this.$ons.notification.toast("Command successfully sent!",
                        {buttonLabel: "Dismiss", timeout: fn.toastOKTimeout});
                } catch (err) {
                    this.$ons.notification.toast(
                        err, {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                    this.startZonedCleanupButtonDisabled = false;
                }
            },
            handleGoto: function () {
                const gotoPoint = map.getLocations().gotoPoints[0];
                if (gotoPoint)
                    this.goto_point(gotoPoint);
            },
            handleStartZonedCleanup: function () {
                const repeatNumber = 1;
                const zones =
                    map.getLocations().zones.map(zoneCoordinates => [...zoneCoordinates, repeatNumber]);
                this.zoned_cleanup(zones);
            },
            handleAddZone: function() {
                map.addZone();
            }
        }
    }
</script>
 
<style scoped>

</style>