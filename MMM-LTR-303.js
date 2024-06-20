//MMM-LTR-303Dimming


Module.register("MMM-LTR-303Dimming", {
  // Default module config
    defaults: {
        maxLux: 500,
        maxDim: 1,
    },
    opacity: null,

    start: function() {
        this.sendSocketNotification('START','');
        this.overlay = this.createOverlay();
    },
    suspend: function() {
        this.sendSocketNotification('SUSPEND','');
    },

    resume: function() {
        this.sendSocketNotification('RESUME','');
    },

    notificationReceived: function(notification, payload, sender) {
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
			case "DATA":
                this.updateOverlay(payload);
			break;
        }
    },

    createOverlay: function() {
        const overlay = document.createElement("div");

        overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
        overlay.style.position = "fixed";
        overlay.style.top = "0px";
        overlay.style.left = "0px";
        overlay.style.right = "0px";
        overlay.style.bottom = "0px";
        overlay.style.zIndex = 9999;
        overlay.style.transitionTimingFunction = "linear";
        overlay.style.pointerEvents = "none";

        return overlay;
    },

    updateOverlay: function(payload) {
        this.opacity = Math.max(0, this.config.maxDim - (payload / this.config.maxLux) * this.config.maxDim);
        // 0lux = 0.9dim
        // 500lux = 0dim

        this.overlay.style.transitionDuration = '800ms';
        this.overlay.style.backgroundColor = `rgba(0, 0, 0, ${this.opacity})`;

        this.updateDom(1000);
    },

    getDom: function() {
        return this.overlay;    
    },
});