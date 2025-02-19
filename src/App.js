import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
import "./styles.css";
import './styles/HomePage.css';

import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { auth, db } from './firebase'; // Import your Firebase config
import { doc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions

// Extend to make OrbitControls available as a JSX element
extend({ OrbitControls });

const SpaceShip = () => {
  const [model, setModel] = useState();

  useEffect(() => {
    new GLTFLoader().load("/scene.gltf", setModel);
  }, []);

  return model ? <primitive object={model.scene} /> : null;
};

const Controls = ({ shouldRotate }) => {
  const orbitRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.autoRotate = shouldRotate;
      orbitRef.current.update();
    }
  });

  return (
    <orbitControls
      autoRotate
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  );
};

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[100, 100]} />
    <meshPhysicalMaterial attach="material" color="white" />
  </mesh>
); 

/**
 * FaceMaterial is a helper component that updates its underlying material color
 * whenever the "color" prop changes.
 */
const FaceMaterial = ({ color, attachProp }) => {
  const materialRef = useRef();
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
    }
  }, [color]);
  return <meshStandardMaterial ref={materialRef} attach={attachProp} />;
};

/**
 * ColorableCube uses a separate material for each face.
 * The order of materials for a Box geometry is: [Right, Left, Top, Bottom, Front, Back]
 */
const ColorableCube = ({ faceColors }) => {
  return (
    <mesh castShadow position={[0, 0, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attachArray="material" // Use attachArray for multiple materials
        color={faceColors.right}
      />
      <meshStandardMaterial attachArray="material" color={faceColors.left} />
      <meshStandardMaterial attachArray="material" color={faceColors.top} />
      <meshStandardMaterial attachArray="material" color={faceColors.bottom} />
      <meshStandardMaterial attachArray="material" color={faceColors.front} />
      <meshStandardMaterial attachArray="material" color={faceColors.back} />
    </mesh>
  );
};

export default function App() {

  // Firebase setup
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  // State for each face color; default is white for all faces.
  const [faceColors, setFaceColors] = useState({
    right: "#ffffff",
    left: "#ffffff",
    top: "#ffffff",
    bottom: "#ffffff",
    front: "#ffffff",
    back: "#ffffff",
  });

  // State to track which face is currently selected for color changes.
  const [selectedFace, setSelectedFace] = useState("front");
  const [shouldRotate, setShouldRotate] = useState(true);

  // When one of the color buttons is clicked,
  // update the color of the currently selected face.
  const updateSelectedFaceColor = (color) => {
    setFaceColors((prev) => ({
      ...prev,
      [selectedFace]: color,
    }));
  };

  const handleSaveDesign = async () => {
    setSaving(true);
    try {
      if (auth.currentUser) {
        console.log("Current user UID:", auth.currentUser.uid);
        const designsCollectionRef = collection(db, "users", auth.currentUser.uid, "designs");
        console.log("Designs collection ref:", designsCollectionRef);

        const nextDesignNumber = await getNextDesignNumber(designsCollectionRef);
        const designName = `Design ${nextDesignNumber}`;

        const designDocRef = doc(designsCollectionRef, designName);

        await setDoc(designDocRef, {
          designData: faceColors,
          timestampe: new Date(),
          name: designName
        })
        console.log("Design saved successfully!");
        navigate("/dashboard");
      } else {
        console.error("User not logged in");
      }
    } catch (error) {
      console.error("Error saving design:", error);
    } finally {
      setSaving(false);
    }
  }

  const getNextDesignNumber = async (designsCollectionRef) => {
    const q = query(designsCollectionRef, where("name", ">=", "Design"), where("name", "<=", "Design \uf8ff"));
    const querySnapshot = await getDocs(q);

    let maxNumber = 0
    querySnapshot.forEach((doc) => {
      const name = doc.data().name;
      const number = parseInt(name.replace("Design ", ""));
      if(!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    })

    return maxNumber + 1;
  }

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 5] }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <fog attach="fog" args={["white", 5, 15]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 5, 10]} penumbra={1} castShadow />
        <Controls shouldRotate={shouldRotate} />
        <ColorableCube faceColors={faceColors} />
        <Plane />
        <SpaceShip />
      </Canvas>
      {/* Overlay UI for selecting a face and setting its color */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          background: "rgba(255,255,255,0.9)",
          padding: "10px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Dropdown to select which face to update */}
        <div>
          <label htmlFor="face-select">Select Face: </label>
          <select
            id="face-select"
            value={selectedFace}
            onChange={(e) => setSelectedFace(e.target.value)}
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="front">Front</option>
            <option value="back">Back</option>
          </select>
        </div>
        {/* Buttons to change the selected face's color */}
        <button onClick={() => updateSelectedFaceColor("red")}>Red</button>
        <button onClick={() => updateSelectedFaceColor("green")}>Green</button>
        <button onClick={() => updateSelectedFaceColor("blue")}>Blue</button>
        <button onClick={() => setShouldRotate(!shouldRotate)}>
          {shouldRotate ? "Stop Rotation" : "Start Rotation"}
        </button>
        <button onClick={handleSaveDesign} disabled={saving}>
          {saving ? "Saving..." : "Save Design"}
        </button>

      </div>
    </div>
  );
}
