//MMM-LTR-303.js


Module.register("MMM-LTR-303", {
  // Default module config
    defaults: {
        maxLux: 500,
        maxDim: 0.7,
        updateGap: 3000,
    },
    opacity: null,

    start: function() {
        this.overlay = this.createOverlay();
        this.sendSocketNotification('START', this.config);
    },
    suspend: function() {
        this.sendSocketNotification('SUSPEND', this.config);
    },

    resume: function() {
        this.sendSocketNotification('RESUME', this.config);
    },

    notificationReceived: function(notification, payload, sender) {
    },

    socketNotificationReceived: function(notification, payload) {
        switch (notification) {
			case "DATA": {
                this.updateOverlay(payload);
			    break;
            }
        }
    },

    createOverlay: function() {
        const overlay = document.createElement("div");

        overlay.style.background = "#000";
        overlay.style.opacity = 0.5;
        overlay.style.transition = `opacity ${this.config.updateGap * 1.25}ms linear`;
        overlay.style.position = "fixed";
        overlay.style.top = "0px";
        overlay.style.left = "0px";
        overlay.style.right = "0px";
        overlay.style.bottom = "0px";
        overlay.style.bottom = "0px";
        overlay.style.zIndex = 9999;
        overlay.style.pointerEvents = "none";

        return overlay;
    },

    updateOverlay: function(payload) {
        this.opacity = Math.max(0, this.config.maxDim - (payload / this.config.maxLux) * this.config.maxDim);
        // 0lux = 0.9dim
        // 500lux = 0dim

            this.updateDom(this.config.updateGap);
    },

    getDom: function() {
        return this.overlay;    
    },
});