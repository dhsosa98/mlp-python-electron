const HelpCenterItemTitle = (props: any) => {
    return (
        <div className="flex flex-col items-center justify-center help-center-item-title">
            <h2 className="text-lg font-bold dark:text-white text-center">{props.children}</h2>
        </div>
    )
}

export default HelpCenterItemTitle
