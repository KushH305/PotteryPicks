import React from 'react';
import { useSpring, animated } from 'react-spring';

const DesignCard = ({ title, image, description }) => {
  const [props, set] = useSpring(() => ({
    transform: 'scale(1)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }));

  return (
    <animated.div
      className="design-card"
      style={props}
      onMouseEnter={() => set({
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      })}
      onMouseLeave={() => set({
        transform: 'scale(1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      })}
    >
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </animated.div>
  );
};

const FeaturedDesigns = () => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 600
  });

  const designs = [
    {
      title: "Classic Vase",
      image: "/placeholder.svg?height=200&width=200",
      description: "Traditional design with modern touches"
    },
    {
      title: "Modern Bowl",
      image: "/placeholder.svg?height=200&width=200",
      description: "Minimalist approach to everyday pottery"
    },
    {
      title: "Artistic Plate",
      image: "/placeholder.svg?height=200&width=200",
      description: "Bold patterns meet functional design"
    }
  ];

  return (
    <animated.section style={fadeIn} className="featured-designs">
      <h2>Featured Designs</h2>
      <div className="designs-grid">
        {designs.map((design, index) => (
          <DesignCard key={index} {...design} />
        ))}
      </div>
    </animated.section>
  );
};

export default FeaturedDesigns;
