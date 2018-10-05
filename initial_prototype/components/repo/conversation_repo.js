'use strict';

class ConversationRepo {
    constructor(store){
        this.store = Reflect.construct(store.get(), []);
        this.conversationId = 0;
    }

    create(data) {
        this.conversationId++;
        data.id = this.conversationId;
        this.store.set(this.conversationId.toString(), data);
        return data;
    }
    getById(conversationId){
        return this.store.get(conversationId.toString());
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
    update(conversationId, data) {
        let dataConversation = this.store.get(conversationId.toString());

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                dataConversation[key] = data[key];
            }
        }

        this.store.set(conversationId.toString(), dataConversation);
        return dataConversation;
    }

    delete(conversationId) {
        let deletedConversation = this.store.get(conversationId.toString());
        this.store.delete(conversationId.toString());
        return deletedConversation;
    }
}

module.exports = ConversationRepo;