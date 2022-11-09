import { FC, SyntheticEvent } from "react";
import styled from "styled-components";

interface ToggleProps {
  theme: string;
  handleChange: any;
}

const Toggle: FC<ToggleProps> = ({ theme, handleChange }) => {
  return (
    <div className="w-full flex justify-end fixed top-0 right-0 dark:bg-slate-900 bg-white z-50">
      <div className="inline-flex font-normal justify-center items-center dark:text-blue-500 gap-5 py-1 px-4">
        <span>Dark-Mode</span>
        <CheckBoxWrapper>
          <CheckBox
            id={"dark-toggle"}
            type="checkbox"
            onChange={handleChange}
            checked={theme === "dark"}
          />
          <CheckBoxLabel htmlFor={"dark-toggle"} />
        </CheckBoxWrapper>
      </div>
    </div>
  );
};

export default Toggle;

const CheckBoxWrapper = styled.div`
  position: relative;
  grid-area: 2 / 1 / 3 / 2;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 5px;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #e1e1e1;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
  @media (max-width: 768px) {
    top: 3px;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #1e3a8a;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
  &:disabled + ${CheckBoxLabel} {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;
