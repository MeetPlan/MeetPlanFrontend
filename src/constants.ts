import {dialog, fs} from "@tauri-apps/api";

export const production: boolean = isProduction;
export let baseurl: string = isTauriApp ? localStorage.getItem("baseurl") : (!production ? "http://127.0.0.1:8000" : "/api");
export const isTauri: boolean = isTauriApp;
console.log(baseurl, isTauri);

const blobToBinary = async blob => {
    const buffer = await blob.arrayBuffer();

    return new Uint8Array(buffer);
};

export const saveBlob = async blob => {
    if (isTauri) {
        dialog.save()
            .then(async (path)=>{
                await fs.writeBinaryFile({
                    path: path,
                    contents: await blobToBinary(blob),
                })
            })
    } else {
        var _url = window.URL.createObjectURL(blob);
        window.open(_url, "_blank").focus();
    }
}
