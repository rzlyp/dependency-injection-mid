'use strict';

class GenericRepo {
    constructor(options, store){
        this.options = options;
        this.store = Reflect.construct(store.get(), []);
        this.id = 0;
    }

    create(data) {
        this.id++;
        data.id = this.id;
        this.store.set(this.id.toString(), data);
        return data;
    }
    getById(id){
        return this.store.get(id.toString());
    }
    read(page, limit) {
        let result = [];
        if(page !== undefined || page !== '' || limit !== undefined || limit !== ''){
            let keys = this.store.keys();
            let start = 0;
            if (page > 1) {
                start = page * 5;
            }
            if (keys.length < limit) {
                limit = keys.length;
            } else if (limit === 0) {
                limit = keys.length;
            }

            for (let i = start; limit !== 0; i++) {
                let value = this.store.get(keys[i]);
                limit--;
                result.push(value);
            }
        }else{
            result = this.store.keys();
        }
        
        
        
        return result;
    }
    update(id, data) {
        let bodyData = this.store.get(id.toString());

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                bodyData[key] = data[key];
            }
        }

        this.store.set(id.toString(), bodyData);
        return bodyData;
    }

    delete(id) {
        let deleteAction = this.store.get(id.toString());
        this.store.delete(id.toString());
        return deleteAction;
    }
}

module.exports = GenericRepo;