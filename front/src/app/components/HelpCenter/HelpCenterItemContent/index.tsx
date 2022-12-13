const HelpCenterItemContent = (props: any) => {
    return (
        <div className="flex flex-col help-center-item-content">
            <p className="text-sm dark:text-white">{props.children}</p>
        </div>
    )
}

export default HelpCenterItemContent