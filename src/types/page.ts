export type PresetPageSize = "A4" | "B5";

export interface PageSize {
  width: number;
  height: number;
}

export class PageMargin {
  constructor(
    public top: number,
    public right: number,
    public bottom: number,
    public left: number,
  ) {}
}

export class AxisPageMargin {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
