import { ICertPayLoad } from './lib/interfaces/certPayload';
export declare class CertificateDecoder {
    rawCert: String;
    private decodedBase45Cert;
    private decompressedBase45Cert;
    rawCBORData: Object;
    private rawPayload;
    generalCert: Array<any>;
    generalMapCert: Map<number, any>;
    generalCertObj: ICertPayLoad;
    constructor(rawCert: string);
    getCertIssuer(): String;
    getCertName(): string;
    isPartial(): boolean;
    getHUCVersion(): String;
    getFirstDose(): import("./lib/interfaces/subcomponent/vInterface").IVaccine;
    getSecondDose(): any[] | import("./lib/interfaces/subcomponent/vInterface").IVaccine;
    private decode;
}
