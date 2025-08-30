import { describe } from "node:test";
import { beforeEach, expect, it, test, vi } from "vitest";
import { prisma } from "@/dbHelper/prismaDb";

import {
  fetchLayout,
  createComponentsInLayout,
  deleteComponentsAtBreakpoint,
  updateComponentsAtBreakpoint,
} from "@/services/layoutServices";

// mocking the prisma database methods
// 🔁 Automatically mock the module
vi.mock("@/dbHelper/prismaDb", () => ({
  prisma: {
    weatherLayout: {
      findMany: vi.fn(),
    },
    weatherComponent: {
      create: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn().mockImplementation(async (fn) => await fn(prisma)),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});
// mock layout data (has breakpoints)
const mockLayoutData = [
  {
    layoutSize: "lg",
    WeatherComponents: [
      { dataGrid: { i: "1", x: 0, y: 0 } },
      { dataGrid: { i: "2", x: 1, y: 1 } },
    ],
  },
  {
    layoutSize: "sm",
    WeatherComponents: [{ dataGrid: { i: "3", x: 0, y: 0 } }],
  },
];
const layouts = mockLayoutData.map((layout: any) => {
  const key = layout.layoutSize;
  const values = layout.WeatherComponents.map((v: any) => v.dataGrid);
  return { [key]: values };
});
const resultMockData = Object.assign({}, ...layouts);

// data
const userId = "1";
const breakpoint = "lg";
const newComp = { i: "4", x: 2, y: 2, w: 2, h: 2 };
const weatherId = "1";

describe("testing components in layouts CRUD functions", async () => {
  //^ get
  it("fetching layout from backend", async () => {
    (
      prisma.weatherLayout.findMany as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockLayoutData);

    const result = await fetchLayout(userId);

    expect(result).toEqual(resultMockData);
  });

  //^ post
  it("creating a layout", async () => {
    (
      prisma.weatherComponent.create as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});

    const result = await createComponentsInLayout({
      breakpoint,
      userId,
      newComp,
    });
    expect(prisma.weatherComponent.create).toHaveBeenCalledWith({
      data: {
        layoutSize: breakpoint,
        userId: Number(userId),
        weatherId: newComp.i,
        dataGrid: JSON.parse(JSON.stringify(newComp)),
      },
    });
  });

  //^ delete
  it("delete a componentn in layout", async () => {
    (
      prisma.weatherComponent.delete as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});
    (
      prisma.weatherComponent.findMany as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockLayoutData);
    const result = await deleteComponentsAtBreakpoint({
      userId,
      weatherId,
      breakpoint,
    });

    expect(prisma.weatherComponent.delete).toHaveBeenCalledWith({
      where: {
        layoutSize_userId_weatherId: {
          userId: Number(userId),
          layoutSize: breakpoint,
          weatherId,
        },
      },
    });
  });

  it("update components at breakpoint", async () => {
    const userId = "1";

    const layouts = {
      lg: [
        { i: "1", x: 0, y: 0, w: 2, h: 2 },
        { i: "2", x: 1, y: 1, w: 2, h: 2 },
      ],
      sm: [{ i: "3", x: 0, y: 0, w: 2, h: 2 }],
    };

    await updateComponentsAtBreakpoint({ userId, layouts });

    expect(prisma.weatherComponent.update).toHaveBeenCalledTimes(3);

    expect(prisma.weatherComponent.update).toHaveBeenCalledWith({
      where: {
        layoutSize_userId_weatherId: {
          layoutSize: "lg",
          userId: Number(userId),
          weatherId: "1",
        },
      },
      data: {
        dataGrid: layouts.lg[0],
      },
    });

    expect(prisma.weatherComponent.update).toHaveBeenCalledWith({
      where: {
        layoutSize_userId_weatherId: {
          layoutSize: "sm",
          userId: Number(userId),
          weatherId: "3",
        },
      },
      data: {
        dataGrid: layouts.sm[0],
      },
    });
  });
});
