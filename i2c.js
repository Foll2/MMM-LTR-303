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


//const i2cBus = i2c.openSync(1);

function initSensor() {
    const i2cBus = i2c.openSync(1);

    console.log('Initializing sensor...');
    // Power on the sensor
    i2cBus.writeByteSync(LTR303_ADDRESS, ALS_CONTR, 0x01);
    console.log('wrote 0x01 to ALS_CONTR');
    // Set measurement rate
    i2cBus.writeByteSync(LTR303_ADDRESS, ALS_MEAS_RATE, 0x23);
    console.log('wrote 0x23 to ALS_MEAS_RATE');
    console.log('Sensor initialized!');

    return i2cBus;
}


function readLightData(i2cBus) {
    const ALS_Data = i2cBus.readByteSync(LTR303_ADDRESS, ALS_STATUS) & 0x04;
    if (!ALS_Data) {
        return readLightData();
    };

    //IR Light
    const ch1Low = i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH1_0);
    const ch1High = i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH1_1);
    //const ch1Data = (ch1High << 8) | ch1Low;


    //Visible + IR Light
    const ch0Low = i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH0_0);
    const ch0High = i2cBus.readByteSync(LTR303_ADDRESS, ALS_DATA_CH0_1);
    const ch0Data = (ch0High << 8) | ch0Low;
    
    return ch0Data;
}
// Initialize the sensor
initSensor();

setInterval(() => {console.log(`Visible Light: ${readLightData()}`);}, 1000);

i2cBus.closeSync();