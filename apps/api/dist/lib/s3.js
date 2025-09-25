"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET = exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
exports.s3 = new client_s3_1.S3Client({
    region: process.env.S3_REGION || "eu-west-3",
    forcePathStyle: true,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
});
exports.S3_BUCKET = process.env.S3_BUCKET;
