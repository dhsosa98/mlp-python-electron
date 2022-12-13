const HelpCenterTitle = (props: any) => {
    return (
        <div className="flex items-center hover:cursor-pointer justify-center dark:bg-blue-700 hover:dark:bg-blue-700 hover:bg-sky-700 bg-sky-500 px-4 py-2 text-xl font-medium text-white rounded-t-lg " onClick={props.onClick}>
           {props.children}
        </div>
    )
}

export default HelpCenterTitle