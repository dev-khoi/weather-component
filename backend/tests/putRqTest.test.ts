import { describe, it, expect } from "vitest";
import { isDifferent } from "../src/lib/isDifferent";

const comp1 = {
  h: 3,
  i: "0",
  w: 2,
  x: 0,
  y: 0,
  maxH: 6,
  maxW: 5,
  minH: 3,
  minW: 2,
  moved: false,
  static: false,
};

const dbComp1 = [
  {
    layoutSize: "xxs",
    userId: 1,
    weatherId: "0",
    dataGrid: { ...comp1 },
  },
];

describe("unit test for isDifferent", () => {
  it("should return false if comp and dbComp are identical", () => {
    expect(isDifferent(comp1, dbComp1)).toBe(false);
  });

  it("should return true if a property in comp is different", () => {
    const modifiedComp = { ...comp1, x: 1 }; // changed x from 0 to 1
    expect(isDifferent(modifiedComp, dbComp1)).toBe(true);
  });
});
