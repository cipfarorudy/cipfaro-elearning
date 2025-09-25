"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToPdfBuffer = htmlToPdfBuffer;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function htmlToPdfBuffer(html) {
    const browser = await puppeteer_1.default.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });
    await browser.close();
    return pdf;
}
