// comparing between layouts and query to find the different
// return a bool

import { CustomError } from "@/types/type";

const isDifferent = (comp: any, dbComp: any) => {
  if (!comp || !dbComp) {
    const error: CustomError = new Error("components are not valid");
    error.status = 400;
    throw error;
  }

  const keys = [
    "h",
    "i",
    "w",
    "x",
    "y",
    "maxH",
    "maxW",
    "minH",
    "minW",
    "moved",
    "static",
  ];

  for (const key of keys) {
    if (comp[key] !== dbComp[0].dataGrid[key]) {
      return true; // something changed
    }
  }
  return false; // identical
};

export { isDifferent };
