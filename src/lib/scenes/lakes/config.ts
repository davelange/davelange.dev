import { cubicInOut, circOut } from "svelte/easing";
import { Tween } from "svelte/motion";
import { randInt } from "./utils";

const placeholder = { x: 0, y: 0 };

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type Pos = typeof placeholder;
type Updater<T> = (
  dir: number,
  current: T
) => {
  target: T;
  options: {
    duration: number;
  };
};
export type Lake = {
  radius: number;
  position: Pos;
  delay: number;
  tween: Tween<Pos>;
  radiusTween: Tween<number>;
  update: Updater<Pos>;
};

export const lakeConfigs = [
  [
    {
      radius: 1,
      position: { x: 0.45, y: 0.9 },
      delay: 2000,
      tween: new Tween(placeholder, {
        duration: 2500,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0.7, {
        duration: 500,
        delay: 200,
        easing: circOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.35, 0.55),
            y: current.y
          },
          options: {
            duration: rand(2000, 4000)
          }
        };
      }
    },
    {
      //Big off to the right
      radius: 8,
      radiusTween: new Tween(7, {
        duration: 800,
        easing: circOut,
        delay: 100
      }),
      position: { x: 0.95, y: 0.75 },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 2800,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: current.x + -dir * 0.08,
            y: current.y
          },
          options: {
            duration: rand(2800, 3000)
          }
        };
      }
    },
    {
      // Top left of big
      radius: 1.715,
      radiusTween: new Tween(1, {
        duration: 600,
        easing: circOut,
        delay: 120
      }),
      position: { x: 0.215, y: 0.674 },
      delay: 100,
      tween: new Tween(placeholder, {
        duration: 2200,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.15, 0.5),
            y: current.y
          },
          options: {
            duration: rand(2000, 3000)
          }
        };
      }
    },
    {
      // Big central
      radius: 13,
      radiusTween: new Tween(11, {
        duration: 1000,
        easing: circOut,
        delay: 40
      }),
      position: {
        x: 0.5,
        y: 0.5
      },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 3000,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.35, 0.65),
            y: current.y
          },
          options: {
            duration: rand(2000, 4000)
          }
        };
      }
    },
    {
      // Bottom right off big
      radius: 3,
      radiusTween: new Tween(2, {
        duration: 800,
        easing: circOut,
        delay: 100
      }),
      position: {
        x: 0.712,
        y: 0.32
      },
      delay: 1000,
      tween: new Tween(placeholder, {
        duration: 3000,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.1, 0.9),
            y: rand(0.32, 0.3)
          },
          options: {
            duration: rand(3000, 4000)
          }
        };
      }
    },
    {
      radius: 17,
      radiusTween: new Tween(16, {
        duration: 800,
        easing: circOut,
        delay: 80
      }),
      position: {
        x: 0.5,
        y: 0
      },
      delay: 100,
      tween: new Tween(placeholder, {
        duration: 4000,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.4, 0.55),
            y: rand(0, 0.02)
          },
          options: {
            duration: rand(4000, 4100)
          }
        };
      }
    }
  ],
  [
    {
      //Small Top
      radius: 1,
      position: { x: 0.75, y: 0.932 },
      delay: 2000,
      tween: new Tween(placeholder, {
        duration: 4100,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.75, 0.8),
            y: current.y
          },
          options: {
            duration: rand(6000, 7000)
          }
        };
      }
    },
    {
      //Big off to the right
      radius: 5.865,
      position: { x: 0.516, y: 0.824 },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 5000,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: current.x,
            y: current.y - -dir * 0.04
          },
          options: {
            duration: rand(4500, 5500)
          }
        };
      }
    },
    {
      // Top left of big
      radius: 4.294,
      position: { x: 0.28, y: 0.607 },
      delay: 100,
      tween: new Tween(placeholder, {
        duration: 5100,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.28, 0.35),
            y: current.y - -dir * 0.04
          },
          options: {
            duration: rand(5000, 5100)
          }
        };
      }
    },
    {
      // Big central
      radius: 10.577,
      position: {
        x: 0.686,
        y: 0.437
      },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 5000,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: current.x + -dir * 0.1,
            y: current.y
          },
          options: {
            duration: rand(5000, 6000)
          }
        };
      }
    },
    {
      // Bottom right off big
      radius: 3.247,
      position: { x: 0.712, y: 0.254 },
      delay: 1000,
      tween: new Tween(placeholder, {
        duration: 4000,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: current.x + -dir * 0.05,
            y: rand(0.25, 0.5)
          },
          options: {
            duration: rand(4000, 4100)
          }
        };
      }
    },
    {
      radius: 16,
      position: { x: 0.33, y: 0 },
      delay: 100,
      tween: new Tween(placeholder, {
        duration: 4000,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.4, 0.55),
            y: rand(0, 0.02)
          },
          options: {
            duration: rand(4000, 4100)
          }
        };
      }
    }
  ],
  [
    {
      radius: 0.1,
      disabled: true,
      position: { x: 0, y: 0 },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 0,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 0,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: 0,
            y: 0
          },
          options: {
            duration: 0
          }
        };
      }
    },
    {
      radius: 0.1,
      disabled: true,
      position: { x: 0, y: 0 },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 0,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 0,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: 0,
            y: 0
          },
          options: {
            duration: 0
          }
        };
      }
    },
    {
      // Top left of big
      radius: 1.715,
      position: { x: 0.215, y: 0.725 },
      delay: 50,
      tween: new Tween(placeholder, {
        duration: 2000,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: rand(0.28, 0.35),
            y: current.y - -dir * 0.04
          },
          options: {
            duration: rand(5000, 5100)
          }
        };
      }
    },
    {
      radius: 13,
      position: {
        x: 0.5,
        y: 0.568
      },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 300,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: current.x + -dir * 0.1,
            y: current.y
          },
          options: {
            duration: rand(5000, 6000)
          }
        };
      }
    },
    {
      // Bottom right off big
      radius: 6.389,
      position: { x: 0.712, y: 0.28 },
      delay: 1000,
      tween: new Tween(placeholder, {
        duration: 4000,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 500,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: current.x + -dir * 0.05,
            y: rand(0.25, 0.3)
          },
          options: {
            duration: rand(4000, 4100)
          }
        };
      }
    },
    {
      radius: 0.1,
      disabled: true,
      position: { x: 0, y: 0 },
      delay: 0,
      tween: new Tween(placeholder, {
        duration: 0,
        easing: cubicInOut
      }),
      radiusTween: new Tween(0, {
        duration: 0,
        easing: cubicInOut
      }),
      update: (dir: number, current: Pos) => {
        return {
          target: {
            x: 0,
            y: 0
          },
          options: {
            duration: 0
          }
        };
      }
    }
  ]
];

export const colorsLight = {
  0: {
    primary: 0xf2df82,
    secondary: 0xc0b87c
  },
  1: {
    primary: 0x6a94f6,
    secondary: 0x3e68cc
  },
  2: {
    primary: 0x90d08b,
    secondary: 0x73a970
  }
};

export const colorsDark = {
  0: {
    primary: 0x526eda,
    secondary: 0x7c8dd0
  },
  1: {
    primary: 0xda5267,
    secondary: 0xf08a99
  },
  2: {
    primary: 0x70dbcf,
    secondary: 0x62bcb1
  }
};

const randChars = ["0", "_", "/", "+", "»", "░"];
function createTransformation(text: string) {
  return Array.from({
    length: text.length
  }).map((_, index) => ({
    apply: randInt(0, 1),
    char: randChars[randInt(0, randChars.length - 1)],
    original: text[index]
  }));
}
export const text = {
  greetingTransformation: [] as ReturnType<
    typeof createTransformation
  >,
  subtitleTransformation: [] as ReturnType<
    typeof createTransformation
  >,
  greeting: "Welcome",
  subtitle: "Thanks for visiting, feel free to explore"
};
text.greetingTransformation = createTransformation(text.greeting);
text.subtitleTransformation = createTransformation(text.subtitle);
