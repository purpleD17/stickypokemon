var app = require("express")();
var server = require("http").createServer(app);
var sticky = require("sticky-session");
var cluster = require("cluster"); // Only required if you want the worker id
var io = require ("socket.io")(server);
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');


app.get("/", function (req, res) {
    res.send("pokemon");
});

var startServer = sticky.listen(server, app.get('port'));

if (!startServer) {
    // MASTER code here runs only in master process
    console.log("MASTER with pid :" + process.pid);

    server.once("listening", function() {
            console.log("server started on port"+ port);}
    );

} else {
    //WORKER code goes here, the main logical code
    console.log("WORKER: " + cluster.worker.id + " with pid: " + process.pid);


    io.on("connection", function(socket){
        console.log("connection established on WORKER: " + cluster.worker.id);
        socket.on("disconnect", function() {
            console.log("WORKER: " + cluster.worker.id + " Got disconnect" );
        });
    });
}
