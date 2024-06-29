const NodeHelper = require("node_helper");
const Log = require("logger");
const i2c = require('i2c-bus');



// I2C address of the LTR-303ALS-01
const LTR303_ADDRESS = 0x29;

// LTR-303ALS-01 register addresses
const ALS_CONTR = 0x80;
const ALS_MEAS_RATE = 0x85;
const ALS_DATA_CH1_0 = 0x88;
const ALS_DATA_CH1_1 = 0x89;
const ALS_DATA_CH0_0 = 0x8A;
const ALS_DATA_CH0_1 = 0x8B;
const ALS_STATUS = 0x8C;


module.exports = NodeHelper.create({
    i2cBus: null,

    init: function() {
        this.i2cBus = i2c.openSync(1);

        console.log('Initializing sensor...');
        // Power on the sensor
        this.i2cBus.writeByteSync(LTR303_ADDRESS, ALS_CONTR, 0x01);
        console.log('wrote 0x01 to ALS_CONTR');
        // Set measurement rate
        this.i2cBus.writeByteSync(LTR303_ADDRESS, ALS_MEAS_RATE, 0x23);
        console.log('wrote 0x23 to ALS_MEAS_RATE');

        console.log('Sensor initialized!');
    },

    start: function() {
        Log.log("Starting");
		this.started = false;
    },

    stop: function() {
        Log.log("Shutting down " + this.name);
        //this.connection.close();
        this.i2cBus.closeSync();
    },

    socketNotificationReceived: function (notification, payload) {
		switch (notification) {
			case "START": {
                this.config = payload;
				if (!this.started) {
					this.started = true;
                    this.LightInterval = setInterval(this.readLight.bind(this), this.config.updateGap);
				}
				break;
            }
			case "SUSPEND": {
                this.config = payload;
				Log.log("Suspending brightness detection");
				clearInterval(this.LightInterval);
				break;
			}
			case "RESUME": {
                this.config = payload;
				Log.log("Resuming brightness detection");
				this.LightInterval = setInterval(this.readLight.bind(this), this.config.updateGap);
			break;
			}
			default: ;
		}
	},

    readLight: function() {
        //Run IR just because

        //IR Light
        const ch1Low = this.i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH1_0);
        const ch1High = this.i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH1_1);

        //Visible + IR Light
        const ch0Low = this.i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH0_0);
        const ch0High = this.i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH0_1);
        const ch0Data = (ch0High << 8) | ch0Low;

        this.sendSocketNotification("DATA", ch0Data);
    }


});