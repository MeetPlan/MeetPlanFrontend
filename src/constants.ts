export const production: boolean = isProduction;
export let baseurl: string = isTauriApp ? localStorage.getItem("baseurl") : (!production ? "http://127.0.0.1:8000" : "/api");
export const isTauri: boolean = isTauriApp;
console.log(baseurl, isTauri);
