export const production: boolean = import.meta.env.PROD;
export let baseurl: string = !production ? "http://127.0.0.1:8000" : "/api";
export const isTauri: boolean = false;
console.log(baseurl, isTauri);

const blobToBinary = async blob => {
    const buffer = await blob.arrayBuffer();

    return new Uint8Array(buffer);
};

export const saveBlob = async blob => {
    var _url = window.URL.createObjectURL(blob);
    window.open(_url, "_blank").focus();
}
