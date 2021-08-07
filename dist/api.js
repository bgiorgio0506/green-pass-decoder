"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateDecoder = void 0;
const base45_1 = __importDefault(require("base45"));
const cbor_1 = __importDefault(require("cbor"));
const zlib_1 = __importDefault(require("zlib"));
class CertificateDecoder {
    constructor(rawCert) {
        this.rawCert = '';
        this.rawCert = rawCert.substring(5, rawCert.length); // strip the HUC header for decoding 
        this.decode();
    }
    getCertIssuer() {
        return this.generalCertObj.v[0].is;
    }
    getCertName() {
        return this.generalCertObj.nam.fn + ' ' + this.generalCertObj.nam.gn; //family name then first name
    }
    isPartial() {
        if (this.generalCertObj.v[0].sd === 2 && this.generalCertObj.v.length < 2)
            return true;
    }
    getHUCVersion() {
        return this.generalCertObj.ver;
    }
    getFirstDose() {
        return this.generalCertObj.v[0];
    }
    getSecondDose() {
        if (this.generalCertObj.v[0].sd === 1 && !this.generalCertObj.v[1])
            return [];
        else
            return this.generalCertObj.v[1];
    }
    decode() {
        this.decodedBase45Cert = base45_1.default.decode(this.rawCert);
        this.decompressedBase45Cert = zlib_1.default.inflateSync(this.decodedBase45Cert); //here we get the CBOR data structure as per EU specification of the eHealthNetwork
        this.rawCBORData = cbor_1.default.decodeAllSync(this.decompressedBase45Cert);
        this.rawPayload = this.rawCBORData[0].value[2]; // hard coded index for the payload; 
        this.generalCert = cbor_1.default.decodeAllSync(this.rawCBORData[0].value[2]);
        this.generalMapCert = this.generalCert[0].get(-216);
        this.generalCertObj = this.generalMapCert.get(1);
    }
}
exports.CertificateDecoder = CertificateDecoder;
