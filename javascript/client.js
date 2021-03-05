const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage =  grpcObject.todoPackage;

const client = new todoPackage.Todo('localhost:40000', grpc.credentials.createInsecure());
client.createTodo({
    "id": -1,
    "text": process.argv.slice(2).reduce((a, c) => `${a} ${c}`),
}, (err, response) => {
    
    const call = client.readTodosStream();
    call.on('data', item => console.log('received from server: ', JSON.stringify(item)));
    call.on('end', () => console.log('server ended communication with client.'));
});

