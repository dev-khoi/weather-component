import { prisma } from "@/dbHelper/prismaDb.js";
import { isDifferent } from "@/lib/isDifferent.js";
import { CustomError, Layout } from "@/types/type.js";
import { InputJsonValue } from "@prisma/client/runtime/library";

//^get
const fetchLayout = async (userId: string) => {
  const layoutSizes = await prisma.weatherLayout.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      layoutSize: true,
      WeatherComponents: {
        select: {
          dataGrid: true,
        },
      },
    },
  });
  const layouts = layoutSizes.map((layout: any) => {
    const key = layout.layoutSize;
    const values = layout.WeatherComponents.map((v: any) => v.dataGrid);
    return { [key]: values };
  });
  return Object.assign({}, ...layouts);
};
//^ post
const createComponentsInLayout = async ({
  breakpoint,
  userId,
  newComp,
}: {
  breakpoint: string;
  userId: string;
  newComp: Layout;
}) => {
  const layoutJson: InputJsonValue = JSON.parse(JSON.stringify(newComp));

  try {
    await prisma.weatherComponent.create({
      data: {
        layoutSize: breakpoint,
        userId: Number(userId),
        weatherId: newComp.i,
        dataGrid: layoutJson,
      },
    });
  } catch (e) {
    const error: CustomError = new Error("creating component unsuccessfully");
    error.status = 400;
    throw error;
  }
};

//^ delete
const deleteComponentsAtBreakpoint = async ({
  userId,
  weatherId,
  breakpoint,
}: {
  userId: string;
  weatherId: string;
  breakpoint: string;
}) => {
  try {
    await prisma.$transaction(async (tx: any) => {
      const matchingComponents = await prisma.weatherComponent.findMany({
        where: {
          userId: Number(userId),
          layoutSize: breakpoint,
        },
      });

      if (matchingComponents.length <= 1) {
        throw new Error("Cannot delete the last remaining layout component.");
      }
      //^ delete
      const remove = await prisma.weatherComponent.delete({
        where: {
          layoutSize_userId_weatherId: {
            userId: Number(userId),
            layoutSize: breakpoint,
            weatherId,
          },
        },
      });
    });
  } catch (e) {
    const error: CustomError = new Error("delete component unsuccessful");
    error.status = 400;
    throw error;
  }
};

//^ put
const updateComponentsAtBreakpoint = async ({
  userId,
  layouts,
}: {
  userId: string;
  layouts: { [key: string]: Layout[] };
}) => {
  const layoutsArr = Object.entries(layouts);

  for (const [layoutSize, layoutComps] of layoutsArr) {
    if (layoutComps.length < 1) {
      throw new Error("cannot have 0 layoutComps");
    }
    const weatherComponentsAtSize = await prisma.weatherComponent.findMany({
      where: { layoutSize: layoutSize, userId: Number(userId) },
    });

    for (const comp of layoutComps) {
      const dbComp = weatherComponentsAtSize.filter(
        (x: any) => x.weatherId === comp.i
      );
      const result = isDifferent(comp, dbComp);

      if (result) {
        try {
          await prisma.weatherComponent.update({
            where: {
              layoutSize_userId_weatherId: {
                layoutSize: layoutSize,
                userId: Number(userId),
                weatherId: comp.i,
              },
            },
            data: {
              dataGrid: { ...comp },
            },
          });
        } catch (e) {
          console.log(e);
          const error: CustomError = new Error("Invalid or expired token");
          error.status = 401;
          throw error;
        }
      }
    }
  }
};

export {
  fetchLayout,
  createComponentsInLayout,
  deleteComponentsAtBreakpoint,
  updateComponentsAtBreakpoint,
};
