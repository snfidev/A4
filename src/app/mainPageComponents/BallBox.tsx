"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import "./page.css";

type Props = {
  trigger: number;
  color: string;
};

export default function BallBox({ trigger, color }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | undefined>(undefined);
  const runnerRef = useRef<Matter.Runner | undefined>(undefined);

  useEffect(() => {
    const box = sceneRef.current;
    if (!box) return;

    // Create new engine and runner on mount
    const engine = Matter.Engine.create();
    const runner = Matter.Runner.create();
    engineRef.current = engine;
    runnerRef.current = runner;

    engine.gravity.y = 1.5;

    const render = Matter.Render.create({
      element: box,
      engine,
      options: {
        width: box.clientWidth,
        height: box.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    function setupWorld() {
      if (!box) return;
      const width = box.clientWidth;
      const height = box.clientHeight;

      // Clear only bodies
      Matter.World.clear(engine.world, false);

      const ground = Matter.Bodies.rectangle(width / 2, height, width, 20, {
        isStatic: true,
        render: { visible: false },
      });
      const leftWall = Matter.Bodies.rectangle(0, height / 2, 20, height, {
        isStatic: true,
        render: { visible: false },
      });
      const rightWall = Matter.Bodies.rectangle(width, height / 2, 20, height, {
        isStatic: true,
        render: { visible: false },
      });

      Matter.World.add(engine.world, [ground, leftWall, rightWall]);

      render.canvas.width = width;
      render.canvas.height = height;
    }

    setupWorld();

    const observer = new ResizeObserver(setupWorld);
    observer.observe(box);

    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      // Cleanup completely to avoid broken canvas on back navigation
      observer.disconnect();
      Matter.Render.stop(render);
      render.canvas.remove(); // ✅ remove the canvas element
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  // Drop ball when trigger changes
  useEffect(() => {
    const engine = engineRef.current;
    const box = sceneRef.current;
    if (!engine || !box) return;

    const width = box.clientWidth;

    const ball = Matter.Bodies.circle(Math.random() * width, 10, 10, {
      restitution: 0.9,
      friction: 0.05,
      render: { fillStyle: color },
    });

    Matter.World.add(engine.world, ball);
  }, [trigger, color]);

  return <div ref={sceneRef} />;
}
