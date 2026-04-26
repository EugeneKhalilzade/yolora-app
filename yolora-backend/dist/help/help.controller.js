"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const help_service_1 = require("./help.service");
let HelpController = class HelpController {
    constructor(helpService) {
        this.helpService = helpService;
    }
    async createRequest(req, body) {
        return this.helpService.createRequest(req.user.id, body.latitude, body.longitude, body.description);
    }
    async acceptRequest(req, requestId, body) {
        return this.helpService.acceptRequest(requestId, req.user.id, body.latitude, body.longitude);
    }
    async rejectRequest(requestId) {
        return this.helpService.rejectRequest(requestId);
    }
    async completeRequest(requestId, body) {
        return this.helpService.completeRequest(requestId, body.rating);
    }
    async getActiveRequest(req) {
        return this.helpService.getActiveRequest(req.user.id);
    }
    async getNearbyRequests(latitude, longitude) {
        return this.helpService.getPendingRequestsNearby(parseFloat(latitude), parseFloat(longitude));
    }
};
exports.HelpController = HelpController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HelpController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Post)('accept/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HelpController.prototype, "acceptRequest", null);
__decorate([
    (0, common_1.Post)('reject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HelpController.prototype, "rejectRequest", null);
__decorate([
    (0, common_1.Post)('complete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HelpController.prototype, "completeRequest", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HelpController.prototype, "getActiveRequest", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HelpController.prototype, "getNearbyRequests", null);
exports.HelpController = HelpController = __decorate([
    (0, common_1.Controller)('help'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [help_service_1.HelpService])
], HelpController);
//# sourceMappingURL=help.controller.js.map