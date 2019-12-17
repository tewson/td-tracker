import React from "react";
import TooltipTrigger from "react-popper-tooltip";
import "react-popper-tooltip/dist/styles.css";

export const AttendanceTooltip = ({
  children,
  content,
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
        {content}
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
