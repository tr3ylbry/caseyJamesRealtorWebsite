import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CameraIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" aria-hidden="true" {...base} {...props}><path d="M4 10.5h5l2-3h10l2 3h5v15H4z"/><circle cx="16" cy="18" r="5"/></svg>;
}

export function DroneIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" aria-hidden="true" {...base} {...props}><path d="M12 14h8l2 5H10zM16 14V9M8 9h16M8 6v6M24 6v6"/><circle cx="8" cy="5" r="3"/><circle cx="24" cy="5" r="3"/><path d="M13 19v4m6-4v4"/></svg>;
}

export function TourIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" aria-hidden="true" {...base} {...props}><path d="M5 9.5 16 4l11 5.5v13L16 28 5 22.5zM5 9.5 16 15l11-5.5M16 15v13"/><path d="M10 13v7l6 3"/></svg>;
}

export function VideoIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" aria-hidden="true" {...base} {...props}><rect x="4" y="7" width="18" height="18" rx="2"/><path d="m22 13 6-4v14l-6-4zM12 12l6 4-6 4z"/></svg>;
}

export function ChartIcon(props: IconProps) {
  return <svg viewBox="0 0 32 32" aria-hidden="true" {...base} {...props}><path d="M5 27V15m8 12V10m8 17V5m7 22H3"/><path d="m5 10 8-5 8 2 7-5"/></svg>;
}

export function ArrowIcon(props: IconProps) {
  return <svg viewBox="0 0 20 20" aria-hidden="true" {...base} {...props}><path d="M4 10h12m-5-5 5 5-5 5"/></svg>;
}
