![npm type definitions](https://img.shields.io/npm/types/typescript)
![version](https://img.shields.io/badge/version-1.1.2-green)

# Dojot Node.js Framework

## About

This is a usefull framework to support any Nodejs application that intends to communicate with dojot platform. The library component maps the Dojot endpoints and lets you add the entire Dojot public API to your application. Take a look at http://www.dojot.com.br/ for more.

## Install

For now, this library is being developed and it's not ready to become a npm package, so it is necessary to import to your project the entire github repository link:

    npm install git+https://github.com/davicedraz/dojot-framework.git --save

*****

## Usage

The dojot-framework aims to serve the main methods available at Dojot endpoints to make easy building IoT applications. The current version of the library provides methods and enable the acess of the following API Components:  

- [Device Simulator](#Device-simulator)
    - [start random data simulation](#start-random-data-simulation)
- [User authentication](#User-authentication)
    - [login](#login)
    - [getToken](#gettoken)
- [User management](#User-management)
    - [createUser](#createUser)
    - [getUsers](#getUsers)
    - [getOneUser](#getOneUser)
    - [updateOneUser](#updateOneUser)
    - [deleteOneUser](#deleteOneUser)
- [Template management](#Template-management)
    - [createTemplate](#createTemplate)
    - [getTemplates](#getTemplates)
    - [getOneTemplate](#getOneTemplate)
- [Device management](#Device-management)
    - [createDevice](#createDevice)
    - [getDevices](#getdevices)
    - [getOneDevice](#getOneDevice)
    - [getDeviceByTemplate](#getDeviceByTemplate)
    - [getDeviceData](#getDeviceData)
    - [getDeviceHistory](#getDeviceHistory)
    - [getAllDevicesIds](#getAllDevicesIds)
    - [getAllDevicesLabels](#getAllDevicesLabels)
    - [getAttributeValues](#getAttributeValues)
    - [getDevicesByAttribute](#getDevicesByAttribute)    
- ~~[Socket.io](#Dojot-socket-connection)~~
    - ~~[startSocket](#startSocket)~~
    - ~~[getDataFromSocket](#getDataFromSocket)~~
    - ~~[filterData](#filterData)~~
    - ~~[persistIncomingData](#persistIncomingData)~~
- ~~[Time data](#Time-data)~~
    - ~~[obtainDaysWithData](#obtainDaysWithData)~~

Check the [docs](https://dojotdocs.readthedocs.io/en/latest/components-and-apis.html#exposed-apis) to see more.

## How to setup

First of all, you should have a instance of Dojot platform running locally or has access to one. check the installation guide [here](https://dojotdocs.readthedocs.io/en/latest/installation-guide.html) if you don't have yet. 

1. Create a json config file and set, at least, the following variables:

    * platformURL (has to be the URL where the Dojot platform runs on port :8000)
    * credentials (has to be the username and password registered on platform)

    ```JSON
    {
        "platformURL": "http://localhost:8000",
        "platformHost": "localhost",
        "protocol": "digital",
        "credentials": {
            "username": "admin",
            "passwd": "admin"
        }
    }
    ```

2. Import the dojot-framework in main of your application.

3. Set your configurations to let the library know how to operate with your Dojot instance.

    You can do that by calling the **setConfig()** method or setting it manually:

    ```Javascript
    const DojotFramework = require('dojot-framework');
    
    const config = require('./config.json');
    const dojot = new DojotFramework(config);
    ```

*****

## Device simulator

The Device Simulator brings together a set of features that allows us to simulate an IoT device and sending data to the Dojot platform. This feature has been added to the Framework for ease application development avoiding the need for real data and writing of automated tests.

### start random data simulation

The emulated data is based on probability distributions to randomize the values for adevice. The available distributions are **normal/gauss**, **binomial**, **uniform** and **poisson**.
See [probability-distributions](http://statisticsblog.com/probability-distributions/) to more details.
The amount of data generated is based on the frequency and the duration contained onconfig.json.   

#### Example
```Javascript
const dojot = new DojotFramework(config);

dojot.simulator.start("tenant", "device_id", 
        [
            { "name": "device_attr", "value": "BINOMIAL(1, 0.8)" }
        ]);
```

*****

## Dojot API

You can also build your IoT's application with your favorite tools and third-party packages and accessing the Dojot platform [endpoints](https://dojotdocs.readthedocs.io/en/latest/components-and-apis.html#exposed-apis)

In order to access the Components API provided by dojot-framework, you will need a session token to set on each component. In these examples, the commented parameter "token" can be obtained by calling the [getToken](#gettoken) method provided by the authentication controller of the library.

Now your application is ready to receive and passes the requests to the instance of the Dojot platform.

```Javascript
const config = require('./config.json');

const DojotFramework = require('dojot-framework');
const express = require('express');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dojot = new DojotFramework(config);

const http = require('http').Server(app);

dojot.api.init()
    .then((api => {
        http.listen(3000, () => {
            console.log('Dojot application server listening on port 3000');
        });
    }));
```

## User authentication

The Dojot platform has endpoints to perform user and session management. The dojot-framework provides some methods to interact with it.

### login

In order to authenticate with the system, the enpoint authentication returning a session token to be used on requests. The method **login()** resolve the promise that returns the exactly response of a login on Dojot platform based on credentials that was passed on config file.

#### Example
```Javascript
dojot.authentication.login()
    .then(response => {
        //your code here
    });
```

### getToken

By the credentials of the configuration file, the dojot-framework is able to log in to Dojot and return a token to your application. This token is required on all other requests.

#### Example
```Javascript
async function userAuthentication() {
    token = await dojot.authentication.getToken();
}
```
In this example, we create a userAuthentication() inside the application and call the method **getToken()** of the authentication controller that returns a promise with the 
token. 

*****

## User management

### createUser

Creates a new user into a Dojot platform, assigning it a service. Service is the token that associates the user with the set of devices and flows it has access to.

#### Example
```Javascript
let user = {
    "username": "Jhon",
    "service": "iot",
    "email": "jhon@email.com.br",
    "name": "Jhon Cena",
    "profile": "user"
}

dojot.users.createUser(user);    
```

### getUsers

This method returns a list containing all users known to the Dojot platform.

#### Example
```Javascript
dojot.users.getUsers()
    .then(users => {
        //shows the user list
        console.log(users);
    });
```

### getOneUser

Retrieves all information from a specific registered user.

#### Example
```Javascript
dojot.users.getOneUser(5)
    .then(user => {
        //shows the user information object
        console.log(user);
    });
```

### updateOneUser

Replaces user information. Fields or attributes that are not informed will revert to their defaults. But the attribute username can not be replaced!

#### Example
```Javascript
let newUser = {
    "service": "iot2",
    "email": "jhon2@email.com.br",
    "name": "Jhon Oliver",
    "profile": "user"
}

dojot.users.updateOneUser(1, newUser);    
```

### deleteOneUser

Removes a user from the Dojot platform by the user's id.

#### Example
```Javascript
dojot.users.deleteOneUser(5);
```

*****

## Template management

All these methods are related to CRUD operations over templates based on enpoints of the Dojot's Device Management API Component. Before describing the device component, we must detail the template methods.

According to the Dojot [documentation](https://dojot.github.io/device-manager/apiary_latest.html):

Templates are a way to describe the “device model”, or, more abstractly, a “device class”. These templates contains all the attributes that will be applied to the device. Always remember that they can (and eventually will) be merged into one to create a single device - they must not have attributes with the same name. If this is inevitable, a tag could be added to the attribute name and, while creating the device, translation instructions could be created in order to map each attribute from the incoming message to the appropriate device attribute.

As seen above, the token is required to access all the methods of this component. 

### createTemplate

This method registers a new template on Dojot platform.

#### Example
```Javascript
const template = {
  "label": "SensorModel",
  "attrs": [
    {
      "label": "temperature",
      "type": "dynamic",
      "value_type": "float"
    },
    {
      "label": "model-id",
      "type": "static",
      "value_type": "string",
      "static_value": "model-001"
    }
  ]
}

dojot.templates.createTemplate(template);
```

### getTemplates

Get the full list of templates with all their associated attributes.

#### Parameters

You can pass the parameters with an JSON object.

- `page_size` - (optional) Example: 20
- `page_num` - (optional) Example: 1
- `attr_format` - Must be one of “both”, “single” (if ‘data_attrs’ and ‘config_attrs’ are to be omited) or “split” (if ‘attrs’ list is to be omited). ‘attrs’ field will always contain all template attributes that are listed by both ‘data_attrs’ and ‘config_attrs’.
- `attr` - Return only templates that posess a given attribute’s value
- `sortBy` - Return entries sorted by given field. Currently only label is supported.

#### Example

#### Example
```Javascript
dojot.templates.getTemplates()
    .then(templates => {
        //shows the template list
        console.log(templates);
    });
```

### getOneTemplate

Retrieves all information from a specific device by the device's id.

#### Example
```Javascript
dojot.templates.getOneTemplate(5)
    .then(template => {
        //shows the template information object
        console.log(template);
    });
```

*****

## Device management

All these methods are related to CRUD operations over devices based on enpoints of the Dojot's Device Management API Component. As seen above, the token is required to access all the methods of this component.

### createDevice

Register a new device. In this example object, there is already a template (id 1) which describes all the attributes to be applied to this device.

#### Example
```Javascript
const device = {
  "label": "test_device",
  "templates": [
    1
  ]
}

dojot.devices.createDevice(device);
```

### getDevices

This method returns a full list of devices with all their associated attributes. Each attribute from attrs is the template ID from where the attributes came from.

#### Example
```Javascript
dojot.devices.getDevices()
    .then(devices => {
        //shows the device list
        console.log(devices);
    });
```

### getOneDevice

Retrieves all information from a specific device by the device's id.

#### Example
```Javascript
dojot.devices.getOneDevice('11e9f9')
    .then(device => {
        //shows the device information object
        console.log(devices);
    });
```

### getDeviceByTemplate

Get the full list of devices that belong to a given template's id.

#### Example
```Javascript
dojot.devices.getDeviceByTemplate(5)
    .then(device => {
         //shows the device list
        console.log(devices);
    });
```
### getDeviceData
 
This method allow your application gets the raw data for a device id or attribute. The response will retrieve all data from all device’s attributes, unless a parameter is given.

#### Parameters

You can pass the parameters with an JSON object.

- `id` - Identifier of the device whose associated raw data wants to be retrieved.
- `attr` - Name of the attribute whose associated raw data wants to be retrieved. If not provided, will consider all attributes.
- `lastN` - Maximum number of raw data entries to retrieve. If not provided, will return all data entries of the attributes.

#### Example

```Javascript
dojot.devices.getDeviceData('11e9f9')
    .then(data => {
        //shows the historical data of this device
        console.log(data);
    });
``` 

You can pass the parameters with an JSON object.

### getDeviceHistory

Gets the raw data stored by the Dojot STH from certain date onwards (or the origin of time if no starting date is provided) applying certain offset and a limit to the number of entries to be retrieved.

#### Parameters

You can pass the parameters with an JSON object.

- `id` - Identifier of the device whose associated raw data wants to be retrieved.
- `attr` - Name of the attribute whose associated raw data wants to be retrieved. If not provided, will consider all attributes.
- `dateFrom` - The starting date from which the raw data should be retrieved. If not provided, the origin of time is used.
- `dateTo` - The final date until which the raw data should be retrieved. If not provided, the current date is used.
- `lastN` - Maximum number of raw data entries to retrieve. If not provided, will return all data entries of the attributes.

#### Example

```Javascript
dojot.devices.getDeviceHistory('11e9f9', 'temperature', '2018-03-18T00:00:00-03:00', '2019-03-20T12:00:59-03:00', 5)
    .then(data => {
        //shows the historical data of this device
        console.log(data);
    });
``` 
### getAllDevicesIds

This method returns an array with all Device's id's registered on platform by the account configured on config file.

#### Example

```Javascript
//returns a array with devices ids: ['1d24', 'd983f', '24hki']
let array = dojot.devices.getAllDevicesIds();
``` 

### getAllDevicesLabels

This method returns an JSON object that contains all Device's labels separated by id and label value.

#### Example

```Javascript
//returns a array with devices labels: { '5e7c4e': 'geladeira_01',   '62dda5': 'carrinho_01',   b3dace: 'carrinho_02' }
let array = dojot.devices.getAllDevicesLabels();
``` 

### getAttributeValues

Returns an array with all occurrences of a given attribute.

#### Example

```Javascript
//returns a array with devices ids: [0.32, 1.20, 3.3]
dojot.devices.getAttributeValues('temperature');
``` 

### getDevicesByAttribute

Let's say that your application needs to get all devices from a given attribute, this method can do this for you. 

You can pass or not a *value* as a second parameter.

#### Example

```Javascript
dojot.devices.getDevicesByAttribute('temperature', 0.58)
    .then(devices => {
        //returns a list of devices that has temperature
    });
``` 

*****

## Dojot Socket connection

The Dojot platform has a Component API where it is possible to establish a [Socket.io](https://socket.io/) connection and subscribe the data of a certain device. In this library, we provide some methods that can help to make this subscription, perform the filtering of useful data and make it available in a preprocessed way for your third-party applications.

### startSocket
//TODO: 
### getDataFromSocket
//TODO: 
### filterData
//TODO: 
### persistIncomingData
//TODO:
 
## Time data

On the process of applications constructions that will communicate with Dojot, mainly web applications, it is common that the large amount of data that the platform provides becomes a bottleneck. Therefore, we provide methods that can help filter the data over specific periods of time and save processing.

### obtainDaysWithData

This method aims to provide a simple way to get only the days that have data in a filtering period. For example, let's say you have a brightness attribute and you want to know what days the bulbs on a device was lit. So you can show a calendar or search field in your application, only days that contains data.

#### Example
```Javascript
let brightness = [
    {
        "id": 1,
        "value": "0,1350",
        "device_id": "d874d9",
        "timestamp": 1545225677741
    },
    {
        "id": 2,
        "value": "1,20",
        "device_id": "d874d9",
        "timestamp": 1545225677789
    }
];

dojot.timeData.obtainDaysWithData(brightness);
```
In this example, note that the adopted communication protocol is digital (0 or 1) and this can be setted in the config.json configuration file. If you adopt another protocol, you will need to implement your own method to make this works.

#

*This library is still in development. More methods that map the endpoints of the Dojot platform will be added according to the use of this library in real applications.*

*That is it! Feel free to add endpoints, database and other features to your app or server. Stay tuned to get more updates.*
