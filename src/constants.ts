export const production: boolean = import.meta.env.PROD;
export let baseurl: string = !production ? "http://127.0.0.1:8000" : "/api";
console.log(baseurl);

const blobToBinary = async (blob: Blob) => {
    const buffer = await blob.arrayBuffer();

    return new Uint8Array(buffer);
};

export const saveBlob = async (blob: Blob) => {
    let _url = window.URL.createObjectURL(blob);
    // @ts-ignore
    window.open(_url, "_blank").focus();
}
