import {usePathname as useNextJsPathname } from "next/navigation";

const basePath = "/ny-bolig";
export function usePathname() {
    const pathName = useNextJsPathname();
    const fixedPathname = pathName.slice(basePath.length);
    if (fixedPathname.length === 0) {
        return "/";
    }
    return fixedPathname;
}