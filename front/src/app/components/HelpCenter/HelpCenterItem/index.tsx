const HelpCenterItem = (props: any) => {
    return (
        <div className="flex flex-col help-center-item">
            {props.children}
        </div>
    )
}

export default HelpCenterItem