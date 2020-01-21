import React from "react";
import TooltipTrigger from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";

import { ATTENDANCE_TYPE } from "./constants.js";

const contentMap = {
  [ATTENDANCE_TYPE.SITTING]: "Sitting day attendance",
  [ATTENDANCE_TYPE.OTHER]: "Non-sitting day attendance"
};

export const AttendanceTooltip = ({
  children,
  attendanceType,
  hideArrow,
  ...props
}) => (
  <TooltipTrigger
    {...props}
    tooltip={({
      arrowRef,
      tooltipRef,
      getArrowProps,
      getTooltipProps,
      placement
    }) => (
      <div
        {...getTooltipProps({
          ref: tooltipRef,
          className: "tooltip-container"
        })}
      >
        {!hideArrow && (
          <div
            {...getArrowProps({
              ref: arrowRef,
              className: "tooltip-arrow",
              "data-placement": placement
            })}
          />
        )}
        {contentMap[attendanceType]}
      </div>
    )}
  >
    {({ getTriggerProps, triggerRef }) => (
      <span
        {...getTriggerProps({
          ref: triggerRef,
          className: "trigger"
        })}
      >
        {children}
      </span>
    )}
  </TooltipTrigger>
);
