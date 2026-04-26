"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const help_module_1 = require("./help/help.module");
const gateway_module_1 = require("./gateway/gateway.module");
const user_entity_1 = require("./users/entities/user.entity");
const help_request_entity_1 = require("./help/entities/help-request.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT, 10) || 5432,
                username: process.env.DB_USERNAME || 'yolora_user',
                password: process.env.DB_PASSWORD || 'yolora_pass',
                database: process.env.DB_NAME || 'yolora',
                entities: [user_entity_1.User, help_request_entity_1.HelpRequest],
                synchronize: true,
                logging: false,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            help_module_1.HelpModule,
            gateway_module_1.GatewayModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map