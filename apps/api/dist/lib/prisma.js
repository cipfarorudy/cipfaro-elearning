"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// Mode développement sans PostgreSQL - utilise des données simulées
console.log("🟡 Mode développement: utilisation de données simulées sans PostgreSQL");
var prisma_dev_1 = require("./prisma-dev");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_dev_1.prisma; } });
