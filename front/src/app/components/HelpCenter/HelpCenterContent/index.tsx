import { useRef } from "react";
import { useTranslation } from "react-i18next";

const HelpCenterContent = (props: any) => {
    const helpCenterContent = useRef<HTMLDivElement>(null);

    const {t: T} = useTranslation();

    const handleSearch = (e: any) => {
        const search = e.target.value.toLowerCase();
        const helpCenterItems = helpCenterContent.current?.querySelectorAll(".help-center-item");
        helpCenterItems?.forEach((item: any) => {
            const title = item.querySelector(".help-center-item-title")?.textContent.toLowerCase();
            const content = item.querySelector(".help-center-item-content")?.textContent.toLowerCase();
            if (title?.includes(search) || content?.includes(search)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        })
    }

    return (
        <div ref={helpCenterContent} className="flex flex-col gap-3">
            <div className="inline-flex justify-center items-center outline-1 outline-stone-100 border border-gray-100 py-1 px-2 dark:text-slate-800 dark:bg-slate-100 dark:border-slate-200 rounded-full ">
                <input type="text" placeholder={`${T("Search")}...`} onChange={handleSearch} className="flex flex-grow outline-none dark:bg-transparent"/>
                {/* Make me a search svg icon */}
                <svg className="h-5 mr-2" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7"><title id="title">Search Icon</title><desc id="desc">A magnifying glass icon.</desc><g className="search-path" fill="none" stroke="#848F91"><path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/></g></svg>
            </div>
            {props.children}
        </div>
    )
}

export default HelpCenterContent