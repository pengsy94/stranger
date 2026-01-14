
interface IProps {
    label: string
    onClick?: () => void
}

const Button = ({ label, onClick = () => { } }: IProps) => {
    return (
        <div
            className="text-white text-center font-medium bg-(--button-background) rounded-sm select-none cursor-pointer shadow-(--shadow-custom-teal) active:bg-(--online-color) md:hover:bg-(--online-color) focus:bg-(--button-primary-color) focus-visible:bg-(--button-primary-color)"
            onClick={() => onClick()}
        >
            <div className="pl-2 pr-2 pt-1.5 pb-1.5 text-sm">{label}</div>
        </div>
    )
}

export default Button;