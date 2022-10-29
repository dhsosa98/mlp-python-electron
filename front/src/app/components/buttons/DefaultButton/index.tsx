import { FC } from "react";

interface Props {
  children: React.ReactNode;
  onClick?: any;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  disabled?: boolean;
}

const StyledDefaultButton: FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
  type,
}) => {
  return (
    <button
      className={`${className} font-medium ms-font-xl py-3 px-6 hover:opacity-80 rounded-md text-white inline-flex justify-center`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}{" "}
    </button>
  );
};

export default StyledDefaultButton;
