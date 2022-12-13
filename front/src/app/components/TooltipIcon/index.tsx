import { FC } from "react";
import ReactTooltip from "react-tooltip";

interface Props {
  tooltipMessage: string;
  tooltipId?: string;
}

const TooltipIcon: FC<Props> = ({ tooltipMessage, tooltipId }) => {
  return (
    <>
      <span
        data-tip={tooltipMessage}
        data-for={tooltipId}
        className="cursor-pointer inline-block ml-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 30 30"
          className="fill-current text-sky-500 dark:text-blue-700"
        >
          <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16,21h-2v-7h2V21z M15,11.5 c-0.828,0-1.5-0.672-1.5-1.5s0.672-1.5,1.5-1.5s1.5,0.672,1.5,1.5S15.828,11.5,15,11.5z"></path>
        </svg>
      </span>
      <ReactTooltip
        id={tooltipId}
        className=" !bg-sky-500 w-[180px] !font-normal dark:!bg-blue-900 dark:text-slate-200"
        effect="solid"
        type="info"
        html={true}
      />
    </>
  );
};

export default TooltipIcon;
