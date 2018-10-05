'use strict';

const path = require('path');

module.exports = class Injector {
    constructor(config) {
        this.config = config;
        this.module = {};
        this.components = {};
    }

    start() {
        let config = this.config.components;
        let module = this.module;
        let arrComponent = [];

        
        //buat manggil semua fungsi js yang ditentukan di config.json dan dimasukkan ke dalam list component
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                let file = config[key].file;
                module[key] = require("./" + path.dirname(file) + "/" + path.basename(file, '.js'));
                arrComponent.push(key);

            }
        }
        this.module = module;

        while (arrComponent.length !== 0) {
            let key = arrComponent[0];
            let depedencies = config[key].depedencies;
            let isDependency = true; //untuk menunjukan apakah component memiliki dependency atau tidak
            let dependencyComponent = [];

            for (let j = 0; j < depedencies.length; j++) {
                //jika dependency kosong maka hapus object dari array listComponent
                if (!this.components[depedencies[j]]) {
                    arrComponent.splice(0, 1);
                    arrComponent.push(key);
                    isDependency = false;
                    break;
                }
                //memasukkan dependency jika ada.
                dependencyComponent.push(this.components[depedencies[j]]);
            }
            //jika inisialisasi ada *dependency maka memeasukkan module yaitu component repo beserta dengan konstruktor yang dibutuhkan. Jika sudah maka component dihapus satu2 dari array
            if (isDependency) {
                //push function ke var components yang berisi class + dependency yang dibutuhkan sesuai dengan config.json
                this.components[key] = Reflect.construct(this.module[key], dependencyComponent); 
                arrComponent.splice(0, 1);
            }

            console.log(arrComponent);
        }

        //apply ke api_server.js dengan port yang telah ditentukan
        let main = this.config.main;
        let server = this.components[main.component];
        server[main.method].apply(server, main.args);
    }
};