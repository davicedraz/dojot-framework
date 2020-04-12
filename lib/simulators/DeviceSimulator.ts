import fs from 'fs';
import mqtt from 'mqtt';
import { exec, ChildProcess } from 'child_process';

class Sensor {
    name: string;
    value: string;
};

class DeviceSimulator {

    public tenant: string;
    public deviceID: string
    public configFile: string;
    public platformHost: string;

    public duration: number = 5000;
    public frequency: number = 1000;
    public accelerate: number = 1;

    constructor(platformHost: string) {
        this.platformHost = platformHost;
    }

    public async start(tenant: string, deviceID: string, sensors: Array<Sensor>): Promise<ChildProcess> {
        try {
            this.deviceID = deviceID;
            this.tenant = tenant;

            await this.generateConfigFile(sensors);

            return exec(`node ./node_modules/device_emulator/index.js --run --cf ${this.configFile} --debug`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.log(`iot-simulator error: ${error}`);
                        return;
                    }
                    console.log(`iot-simulator: ${stdout}`);
                    console.log(`iot-simulator error: ${stderr}`);
                    return stdout;
                });
        } catch (error) {
            throw { status: error.status || error.statusCode || 500, message: error.message || error };
        }
    };

    public publishToDevice(id: string, data: any, tenant: string) {
        try {
            const client = mqtt.connect(`mqtt://${this.platformHost}:1883`);
            client.publish(`/${tenant}/${id}/attrs`, JSON.stringify(data), () => {
                console.log(`LOG: publishing ${JSON.stringify(data)} to topic ${id}`);
                client.end();
            });
        } catch (error) {
            throw `ERROR: ${error} on publish to topic ${id} on Dojot platform`;
        }
    }

    public async generateConfigFile(sensors: Array<Sensor>) {

        const data = JSON.stringify({
            "protocol": {
                "mqtt": {
                    "serverAddress": this.platformHost,
                    "topic": `/${this.tenant}/${this.deviceID}/attrs`,
                    "port": 1883
                }
            },
            "device": {
                "frequency": this.frequency,
                "accelerate": this.accelerate,
                "duration": this.duration,
                "sensors": sensors
            }
        });

        this.configFile = `${__dirname}//simulator.config.json`;
        await fs.writeFileSync(this.configFile, data);
    };

};

export = DeviceSimulator;
