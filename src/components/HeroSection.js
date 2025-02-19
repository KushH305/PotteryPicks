import React from 'react';
import { Canvas } from 'react-three-fiber';
import { useSpring, animated } from 'react-spring';

const PotteryModel = () => {
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <cylinderGeometry args={[1, 1.5, 3, 32]} />
      <meshPhysicalMaterial 
        color="#8B4513" 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
};

const HeroSection = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200
  });

  const titleAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 400
  });

  return (
    <section className="hero-section">
      <animated.div style={fadeIn} className="hero-content">
        <animated.h1 style={titleAnimation}>
          Shape Your Masterpiece
        </animated.h1>
        <animated.p style={titleAnimation}>
          Design and visualize your pottery before bringing it to life
        </animated.p>
      </animated.div>
      <div className="hero-model">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <PotteryModel />
        </Canvas>
      </div>
    </section>
  );
};

export default HeroSection;
