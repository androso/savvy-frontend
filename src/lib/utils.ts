import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axiosLib from "axios";

export const axios = axiosLib.create({ baseURL: "http://localhost:3000" });

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
