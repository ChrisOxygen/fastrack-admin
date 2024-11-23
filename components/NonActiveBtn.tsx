import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function NonActiveBtn({
  btnText,
  tooltipText,
}: {
  btnText: string;
  tooltipText: string;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger className=" cu rounded-xl flex shrink-0 bg-gray-300 font-dm_sans text-white uppercase font-semibold px-4 py-2 ">
          {btnText}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default NonActiveBtn;
