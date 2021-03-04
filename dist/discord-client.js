"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = __importDefault(require("ws"));
var events_1 = __importDefault(require("events"));
var axios_1 = __importDefault(require("axios"));
var discord_slash_commands_client_1 = __importDefault(require("discord-slash-commands-client"));
var EeveeDiscordClient = /** @class */ (function (_super) {
    __extends(EeveeDiscordClient, _super);
    function EeveeDiscordClient(token, intents) {
        if (intents === void 0) { intents = 0; }
        var _this = _super.call(this) || this;
        _this.ready = false;
        _this.user = null;
        _this.guilds = [];
        _this.ws = null;
        _this.heartbeat_seq = null;
        _this.api_base = "https://discord.com/api/v8/";
        _this.slash_command_manager = null;
        _this.slash_commands = [];
        _this.session_id = "";
        _this._send = function (d) {
            var _a;
            (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(d));
        };
        _this._connect = function () {
            _this.ready = false;
            clearInterval(_this.heartbeat);
            _this.ws = new ws_1.default("wss://gateway.discord.gg?v=8&encoding=json", {
                perMessageDeflate: false,
            });
            _this.ws.on("open", _this._handle_open);
            _this.ws.on("close", _this._connect);
            _this.ws.on("message", _this._handle_message);
        };
        _this._handle_open = function () {
            if (_this.session_id) {
                // Attempt to resume
                _this._send({
                    op: 6,
                    d: {
                        token: _this.token,
                        session_id: _this.session_id,
                        seq: _this.heartbeat_seq,
                    },
                });
            }
            else {
                // Create a new session
                _this._send({
                    op: 2,
                    d: {
                        token: _this.token,
                        intents: _this.intents,
                        properties: {
                            $os: "linux",
                            $browser: "eevee-discord-slash-commands-nodejs",
                            $device: "eevee-discord-slash-commands-nodejs",
                        },
                    },
                });
            }
        };
        _this._handle_message = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var p, p9, p10, _a, p1, _slash_commands, interaction;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        p = JSON.parse(data.toString());
                        // Save Sequence
                        if (p.s)
                            this.heartbeat_seq = p.s;
                        // Handle Resume Failure
                        if (p.op == 9) {
                            p9 = p;
                            if (!p9.d) {
                                this.session_id = "";
                                this._handle_open();
                            }
                            return [2 /*return*/];
                        }
                        // Emit Raw Event
                        this.emit("raw", p);
                        // Handle Heartbeat
                        if (p.op == 10) {
                            p10 = p;
                            clearInterval(this.heartbeat);
                            this.heartbeat = setInterval(this._hearbeat_ack, p10.d.heartbeat_interval);
                            this.emit("heartbeat", p10.d.heartbeat_interval);
                            return [2 /*return*/];
                        }
                        if (p.op == 11) {
                            this.emit("heartbeat-ack");
                            return [2 /*return*/];
                        }
                        if (!(p.op == 0)) return [3 /*break*/, 3];
                        _a = p.t;
                        switch (_a) {
                            case "READY": return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1:
                        p1 = p;
                        console.log(p1);
                        this.session_id = p1.d.session_id;
                        this.user = p1.d.user;
                        this.ready = true;
                        console.log(this.user, this.ready);
                        this.guilds = ((_b = p1.d.guilds) === null || _b === void 0 ? void 0 : _b.map(function (g) { return g.id; })) || [];
                        this.slash_command_manager = new discord_slash_commands_client_1.default.Client(this.token, this.user.id);
                        return [4 /*yield*/, this.slash_command_manager.getCommands()];
                    case 2:
                        _slash_commands = _c.sent();
                        if (!(_slash_commands instanceof Array))
                            _slash_commands = [_slash_commands];
                        this.slash_commands = _slash_commands;
                        this.emit("ready", p1);
                        return [2 /*return*/];
                    case 3:
                        // Handle Dispatch
                        if (p.op == 0) {
                            switch (p.t) {
                                case "INTERACTION_CREATE":
                                    interaction = p.d;
                                    this.emit("interaction", interaction);
                                    return [2 /*return*/];
                            }
                        }
                        this.emit("raw-unhandled", p);
                        return [2 /*return*/];
                }
            });
        }); };
        _this._hearbeat_ack = function () {
            _this._send({
                op: 1,
                d: _this.heartbeat_seq,
            });
        };
        _this.respondToInteraction = function (interaction, response) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = this.api_base +
                    "interactions/" +
                    interaction.id +
                    "/" +
                    interaction.token +
                    "/callback";
                console.log(url);
                return [2 /*return*/, axios_1.default.post(url, response)];
            });
        }); };
        _this.registerSlashCommand = function (command, guildId) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.slash_command_manager) === null || _a === void 0 ? void 0 : _a.createCommand(command, guildId)];
            });
        }); };
        _this.modifySlashCommand = function (command, commandId, guildId) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.slash_command_manager) === null || _a === void 0 ? void 0 : _a.editCommand(command, commandId, guildId)];
            });
        }); };
        _this.unregisterSlashCommand = function (commandId, guildId) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                return [2 /*return*/, (_a = this.slash_command_manager) === null || _a === void 0 ? void 0 : _a.deleteCommand(commandId, guildId)];
            });
        }); };
        _this.getSlashCommands = function (guildID) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (_a = this.slash_command_manager) === null || _a === void 0 ? void 0 : _a.getCommands({ guildID: guildID });
                return [2 /*return*/];
            });
        }); };
        _this.getSlashCommand = function (commandID) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (_a = this.slash_command_manager) === null || _a === void 0 ? void 0 : _a.getCommands({ commandID: commandID });
                return [2 /*return*/];
            });
        }); };
        _this.token = token;
        _this.intents = intents;
        _this._connect();
        return _this;
    }
    return EeveeDiscordClient;
}(events_1.default));
exports.default = EeveeDiscordClient;
