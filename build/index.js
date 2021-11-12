"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
// import passport from "passport";
var express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
var index_1 = __importDefault(require("./users/index"));
var index_2 = __importDefault(require("./accomodation/index"));
process.env.TS_NODE_DEV && require("dotenv").config();
var server = (0, express_1.default)();
var port = process.env.PORT || 3001;
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use("/users", index_1.default);
server.use("/accomodation", index_2.default);
console.table((0, express_list_endpoints_1.default)(server));
if (!process.env.MONGO_CONNECTION) {
    throw new Error("No MongoDB uri defined");
}
mongoose_1.default.connect(process.env.MONGO_CONNECTION);
mongoose_1.default.connection.on("connected", function () {
    console.log("Mongo connected!");
    server.listen(port, function () {
        console.log("Server running on port " + port);
    });
});
