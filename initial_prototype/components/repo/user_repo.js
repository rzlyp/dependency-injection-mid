'use strict';

class UseRepo {
    constructor(store){
        this.store = Reflect.construct(store.get(), []);
        this.id = 0;
    }

    getById(userId){
       return this.store.get(userId.toString());
    }
    create(data){
        this.id++;
        data.id = this.id;
        this.store.set(this.id.toString(), data);
        return data;
    }
    read(page, limit) {
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
        let result = [];
        for (let i = start; limit !== 0; i++) {
            let value = this.store.get(keys[i]);
            limit--;
            result.push(value);
        }
        return result;
    }
    update(userId, data) {
        let userData = this.store.get(userId.toString());

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                userData[key] = data[key];
            }
        }

        this.store.set(userId.toString(), userData);
        return userData;
    }

    delete(userId) {
        let deleteUser = this.store.get(userId.toString());
        this.store.delete(userId.toString());
        return deleteUser;
    }
}

module.exports = UseRepo;