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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpRequest = exports.HelpRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var HelpRequestStatus;
(function (HelpRequestStatus) {
    HelpRequestStatus["PENDING"] = "pending";
    HelpRequestStatus["ACCEPTED"] = "accepted";
    HelpRequestStatus["COMPLETED"] = "completed";
    HelpRequestStatus["CANCELLED"] = "cancelled";
})(HelpRequestStatus || (exports.HelpRequestStatus = HelpRequestStatus = {}));
let HelpRequest = class HelpRequest {
};
exports.HelpRequest = HelpRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HelpRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HelpRequest.prototype, "requesterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'requesterId' }),
    __metadata("design:type", user_entity_1.User)
], HelpRequest.prototype, "requester", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], HelpRequest.prototype, "helperId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'helperId' }),
    __metadata("design:type", Object)
], HelpRequest.prototype, "helper", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: HelpRequestStatus, default: HelpRequestStatus.PENDING }),
    __metadata("design:type", String)
], HelpRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], HelpRequest.prototype, "requesterLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], HelpRequest.prototype, "requesterLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Object)
], HelpRequest.prototype, "helperLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Object)
], HelpRequest.prototype, "helperLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], HelpRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], HelpRequest.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HelpRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HelpRequest.prototype, "updatedAt", void 0);
exports.HelpRequest = HelpRequest = __decorate([
    (0, typeorm_1.Entity)('help_requests')
], HelpRequest);
//# sourceMappingURL=help-request.entity.js.map