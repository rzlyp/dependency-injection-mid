const Memstore = require('./components/store/memory_store');
const ConversationRepo = require('./components/repo/conversation_repo');
const UserRepo = require('./components/repo/user_repo');
const ApiServer = require('./components/server/api_server');


let store = new Memstore();
let convRepo = new ConversationRepo(store);
let userRepo = new UserRepo(store);
let server = new ApiServer(convRepo, userRepo);
server.start(5000);