const dev = process.env.NODE_ENV;
export const baseurl: string = dev === "development" ? "http://127.0.0.1:8000" : "http://backend";
console.log(baseurl)
