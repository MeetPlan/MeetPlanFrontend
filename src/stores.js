import {writable} from "svelte/store";
import isMobile from "is-mobile";

export const svelteLoc = writable("/");
export const drawerOpen = writable(!isMobile());
