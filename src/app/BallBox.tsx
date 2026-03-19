'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

type Props = {
  trigger: number;
  color: string;
};

export default function BallBox({ trigger, color }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create());
  const runnerRef = useRef(Matter.Runner.create());

  useEffect(() => {
    const engine = engineRef.current;
    const world = engine.world;
    const runner = runnerRef.current;

    // Set gravity
    engine.gravity.y = 1; // 1 is normal, increase for faster fall

    // Create renderer
    const render = Matter.Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width: 300,
        height: 200,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Walls
    const ground = Matter.Bodies.rectangle(150, 200, 300, 20, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, 100, 20, 200, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(300, 100, 20, 200, { isStatic: true });
    Matter.World.add(world, [ground, leftWall, rightWall]);

    // Run physics
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
    };
  }, []);

  // Drop ball when trigger changes
  useEffect(() => {
    const engine = engineRef.current;

    const ball = Matter.Bodies.circle(
      Math.random() * 200 + 50, // x position
      10,                       // y position slightly below top
      10,                       // radius
      {
        restitution: 0.9,       // bounce
        friction: 0.05,         // how quickly it slows down on surfaces
        render: { fillStyle: color },
      }
    );

    Matter.World.add(engine.world, ball);
  }, [trigger, color]);

  return <div ref={sceneRef} />;
}