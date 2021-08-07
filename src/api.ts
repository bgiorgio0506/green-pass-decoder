import base45 from 'base45'; 
import cbor from 'cbor'; 
import zlib from 'zlib';
import { ICertPayLoad } from './lib/interfaces/certPayload';

export class CertificateDecoder{

    public rawCert:String = ''
    private declare decodedBase45Cert:Buffer; 
    private declare decompressedBase45Cert: Buffer;
    public declare rawCBORData:Object;
    private declare rawPayload:Buffer;
    public declare generalCert:Array<any>;
    public declare generalMapCert: Map<number, any>
    public declare generalCertObj:ICertPayLoad; 

    constructor(rawCert:string){
        this.rawCert = rawCert.substring(5, rawCert.length); // strip the HUC header for decoding 
        this.decode();
    }


    public getCertIssuer(){
        return this.generalCertObj.v[0].is
    }

    public getCertName(){
        return this.generalCertObj.nam.fn + ' '+this.generalCertObj.nam.gn //family name then first name
    }

    public isPartial(){
        if(this.generalCertObj.v[0].sd === 2 && this.generalCertObj.v.length < 2) return true;
    }

    public getHUCVersion(){
        return this.generalCertObj.ver
    }

    public getFirstDose(){
        return this.generalCertObj.v[0];
    }

    public getSecondDose(){
        if(this.generalCertObj.v[0].sd === 1 && !this.generalCertObj.v[1]) return []; 
        else return this.generalCertObj.v[1]
    }

    private decode(){
        this.decodedBase45Cert = base45.decode(this.rawCert);
        this.decompressedBase45Cert = zlib.inflateSync(this.decodedBase45Cert) //here we get the CBOR data structure as per EU specification of the eHealthNetwork
        this.rawCBORData = cbor.decodeAllSync(this.decompressedBase45Cert)
        this.rawPayload = this.rawCBORData[0].value[2]// hard coded index for the payload; 
        this.generalCert = cbor.decodeAllSync(this.rawCBORData[0].value[2])
        this.generalMapCert= this.generalCert[0].get(-216);
        this.generalCertObj = this.generalMapCert.get(1);
    }
}