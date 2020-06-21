<template>
    <v-ons-page @show="ManualControlInit()" @hide="ManualControlHide()">
        <v-ons-progress-bar value="0" :indeterminate="loading"></v-ons-progress-bar>

        <div class="aspect-ratio" style="text-align: center; position: relative; height: 99%;" id="notouchmovementsarea">
                <canvas id="manual-control-area" class="fit-img fit-img-tight" style="background-color: #9ea7b833; height: 90%; width: 90%; position:relative;"
                    v-on:touchstart="touchStart"
                    v-on:touchmove="touchMove"
                    v-on:touchcancel="touchEnd"
                    v-on:touchend="touchEnd"
                    v-on:mousedown="startManualControlTimer()"
                    v-on:mouseenter="startManualControlTimer()"
                    v-on:mouseup="startManualControlTimer()"
                    v-on:mouseleave="startManualControlTimer()"
                    v-on:mouseout="startManualControlTimer()"
                    v-on:mousemove.prevent="mouseMove">
                </canvas>
                <div>
                    <v-ons-button id="start-manual-control-button" class="button-margin" @click="startManualControl()" :disabled="manualControlEnabled">Start Manual Control</v-ons-button>
                    <v-ons-button id="stop-manual-control-button" class="button-margin" @click="stopManualControl()" :disabled="!manualControlEnabled">Stop Manual Control</v-ons-button>
                </div>
        </div> 
    </v-ons-page>
</template>
 
<script>
    const manualControlDurationMS = 100;
    const manualControlStateRefreshTimerMS = 2000; // refresh manual control state each x ms
    const maxVelocity = 0.3;
    const manualControlMinimalVelocity = 0.02; // below this abs limit robot will not move
    const manualControlMinimalOmega = 0.1;     // below this abs limit (currentAngle) robot will not turn
    const manualControlminimalDistanceForOmega = 10; // below this abs limit (currentXYDistance) the robot will not turn

    let manualControlStateRefreshTimer;
    let timedManualControlLoop;
    let manualControlCanvas;
    let manualControlCanvasContext;

    module.exports = {
        data: function() {
            return { 
                loading: false,
                manualControlSequenceId: 1,
                manualControlEnabled: false,
                currentVelocity: 0,
                currentOmega: 0,
                currentAngle: 0,
                currentYDistance: 0,
                currentXYDistance: 0,
                centerX: null,
                centerY: null
            }
        },
        methods: {
            // API / Manual Control Handling
            manualMoveRobot: async function (angle, velocity) {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                this.loading = true;
                try {
                    // move for twice the interval we're updating at
                    // to keep on track if one package got lost
                    await ApiService.setManualControl(angle, velocity, manualControlDurationMS * 2, this.manualControlSequenceId++);
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            _startManualControl: function () {
                if (!this.manualControlEnabled) {
                    this.manualControlEnabled = true;

                    // TODO: Howto do this with Vue?
                    document.getElementById("sidemenu").removeAttribute("swipeable");
                    document.getElementById("appTabbar").removeAttribute("swipeable");
                }
            },

            _stopManualControl: function () {
                if (this.manualControlEnabled) {
                    this.manualControlEnabled = false;
                    
                    // TODO: Howto do this with Vue?
                    document.getElementById("sidemenu").setAttribute("swipeable", "swipeable");
                    document.getElementById("appTabbar").setAttribute("swipeable", "swipeable");
                    this.stopManualControlTimer();
                }
            },

            postponeRefreshManualControlMode: function () {
                clearInterval(manualControlStateRefreshTimer);
                manualControlStateRefreshTimer =
                    setInterval(() => {
                        this.refreshManualControlMode();
                    }, manualControlStateRefreshTimerMS);
            },

            startManualControl: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                if (!this.manualControlEnabled) {
                    this.loading = true;
                    try {
                        await ApiService.startManualControl();
                        this._startManualControl();
                        this.postponeRefreshManualControlMode();
                    } catch (err) {
                        this.$ons.notification.toast(err.message,
                            {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                    } finally {
                        this.loading = false;
                    }
                }
            },

            stopManualControl: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                if (this.manualControlEnabled) {
                    this.loading = true;
                    try {
                        await ApiService.stopManualControl();
                        this._stopManualControl();
                        this.postponeRefreshManualControlMode();
                    } catch (err) {
                        this.$ons.notification.toast(err.message,
                            {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                    } finally {
                        this.loading = false;
                    }
                }
            },

            sendManualControl: function () {
                // limit velocity to square (up, bottom, left, right are to be equal!)
                if (this.currentYDistance > this.centerY) {
                    this.currentYDistance = this.centerY;
                }
                this.currentVelocity = (this.currentYDistance / this.centerY) * maxVelocity;

                // center deadzone
                if (Math.abs(this.currentVelocity) < manualControlMinimalVelocity) {
                    this.currentVelocity = 0;
                }

                if (Math.abs(this.currentAngle) < manualControlMinimalOmega ||
                    Math.abs(this.currentXYDistance) < manualControlminimalDistanceForOmega) {
                    this.currentOmega = 0;
                } else {
                    this.currentOmega = this.currentAngle;
                }

                this.drawValuesToCanvas();
                this.manualMoveRobot(this.currentOmega, this.currentVelocity);
            },

            startManualControlTimer: function () {
                if (!timedManualControlLoop && this.manualControlEnabled) {
                    this.sendManualControl(); // send + start repetitive timer
                    timedManualControlLoop =
                        setInterval(() => {
                            this.sendManualControl();
                        }, manualControlDurationMS);
                }
            },

            stopManualControlTimer: function () {
                if (timedManualControlLoop) {
                    clearInterval(timedManualControlLoop);
                    timedManualControlLoop = 0;
                }
            },

            // Canvas orga
            initCanvas: function () {
                manualControlCanvas = document.getElementById("manual-control-area");
                // apply shown dimensions to canvas - required because of percentual css dimension
                manualControlCanvas.setAttribute("width", manualControlCanvas.clientWidth.toString());
                manualControlCanvas.setAttribute("height", manualControlCanvas.clientHeight.toString());

                manualControlCanvasContext = manualControlCanvas.getContext("2d");
                this.centerX = manualControlCanvas.width / 2;
                this.centerY = manualControlCanvas.height / 2;

                manualControlCanvasContext.moveTo(this.centerX, this.centerY);
                manualControlCanvasContext.fillStyle = "#ff0044";
                manualControlCanvasContext.arc(this.centerX, this.centerY, 5, 0, 360, false);
                manualControlCanvasContext.fill();
            },

            drawValuesToCanvas: function () {
                // delete old values / draw background
                manualControlCanvasContext.fillStyle = "#FFFFFF"; //#9ea7b833
                manualControlCanvasContext.fillRect(0, 0, 200, 50);
                // draw values
                manualControlCanvasContext.font = "12px Helvetica";
                manualControlCanvasContext.textAlign = "left";
                manualControlCanvasContext.fillStyle = "#8A8A8A";
                manualControlCanvasContext.fillText("Velocity:\t" + this.currentVelocity.toPrecision(2) +
                                                    "\tOmega:\t" + this.currentOmega.toPrecision(2),
                30, 30);
            },

            // Mouse Handling
            getMousePos: function (canvasDom, mouseEvent) {
                var rect = canvasDom.getBoundingClientRect();
                return {x: mouseEvent.clientX - rect.left, y: mouseEvent.clientY - rect.top};
            },

            // Touch Handling
            getTouchPos: function (evt) {
                var rect = manualControlCanvas.getBoundingClientRect();

                if (evt && evt.touches) {
                    if (evt.touches.length === 1) { // Only deal with one finger
                        var touch = evt.touches[0]; // Get the information for finger #1
                        return {
                            x: touch.pageX - rect.left, //-touch.target.offsetLeft,
                            y: touch.pageY - rect.top   //-touch.target.offsetTop
                        };
                    }
                } else {
                    return {x: 0, y: 0};
                }
            },

            touchStart: function (e) {
                e.preventDefault();
                this.startManualControlTimer();
                var m = this.getTouchPos();
                this.calculateAngleAndDistance(m);
            },

            touchMove: function (e) {
                e.preventDefault();
                var m = this.getTouchPos(e);
                this.calculateAngleAndDistance(m);
            },

            touchEnd: function () {
                this.stopManualControlTimer();
            },

            mouseMove: function (e) {
                var m = this.getMousePos(manualControlCanvas, e);
                this.calculateAngleAndDistance(m);
            },

            calculateAngleAndDistance: function (m) {
                var tX = Math.abs(this.centerX - m.x);
                var tY = Math.abs(this.centerY - m.y);

                this.currentYDistance = this.centerY - m.y;
                this.currentXYDistance = Math.floor(Math.sqrt(tX * tX + tY * tY));

                if (m.x < this.centerX) {
                    if (m.y < this.centerY) {
                        // upper left
                        this.currentAngle = -Math.atan((this.centerX - m.x) / (m.y - this.centerY));
                    } else {
                        // lower left
                        if (m.y === this.centerY) {
                            this.currentAngle = 0;
                        } else {
                            this.currentAngle = -Math.atan((m.x - this.centerX) / (m.y - this.centerY));
                        }
                    }
                } else {
                    if (m.y < this.centerY) {
                        // upper right
                        this.currentAngle = Math.atan((this.centerX - m.x) / (this.centerY - m.y));
                    } else {
                        // lower right
                        if (this.centerY === m.y) {
                            this.currentAngle = 0;
                        } else {
                            this.currentAngle = Math.atan((m.x - this.centerX) / (this.centerY - m.y));
                        }
                    }
                }
            },

            // Page Handling (refresh/update/onload/onhide)
            refreshManualControlMode: async function () {
                const ApiService = (await import("../services/api.service.js")).ApiService;

                try {
                    let res = await ApiService.getCurrentStatus();
                    if (res.state === "MANUAL_MODE") {
                        this._startManualControl();
                    } else {
                        this._stopManualControl();
                    }
                } catch (err) {
                    this.$ons.notification.toast(err.message,
                        {buttonLabel: "Dismiss", timeout: fn.toastErrorTimeout});
                } finally {
                    this.loading = false;
                }
            },

            ManualControlInit: function () {
                this.loading = true;
                this.refreshManualControlMode();
                // Since the robot may disable manual control mode by itself, this timer keeps the
                // state of the robot in track with the UI
                manualControlStateRefreshTimer =
                    setInterval(() => {
                        this.refreshManualControlMode();
                    }, manualControlStateRefreshTimerMS);
                
                this.initCanvas();
            },

            ManualControlHide: function () {
                this.stopManualControl();
                clearInterval(manualControlStateRefreshTimer);
            }
        }
    }
</script>
 
<style scoped>
    #notouchmovementsarea {
        /* Prevent nearby text being highlighted when accidentally dragging mouse outside confines of the canvas */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>