var Hapi = require("hapi");

var server = new Hapi.Server();

server.connection({ port: 3001 });

server.register({
    register: require("yar"),
    options: {
        maxCookieSize: 0,
        cookieOptions: { isSecure: false, password: "some_secret_key" }
    }
}, function (err) {
    if (!err) {
        server.route({
            method: "GET",
            path: "/test",
            config: {
                handler: function (request, reply) {
                    request.session.flash("test", "some flash message");
                    reply.redirect("/test2");
                }
            }
        });
        server.route({
            method: "GET",
            path: "/test2",
            config: {
                handler: function (request, reply) {
                    var flash_msg = request.session.flash("test");
                    // flash_msg empty array.
                    reply(flash_msg);
                }
            }
        });

        server.start(function(err) {
            if (!err) {
                console.log("server started @3001");
            }
        });
    }
});
