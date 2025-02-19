
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/DashboardPage.css'; // Import your CSS file
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for toggle
import { useNavigate } from 'react-router-dom';

import { auth, db } from './firebase'; // Import your Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';


const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [pastShape, setPastShape] = useState([]);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showShapesDropdown, setShowShapesDropdown] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const availableShapes = [
        { id: 1, name: "Cube", thumbnail: "/cube-thumb.jpg" },
        { id: 2, name: "Sphere", thumbnail: "/sphere-thumb.jpg" },
        { id: 3, name: "Pyramid", thumbnail: "/pyramid-thumb.jpg" }
    ];

    const pastShapes = [
        { id: 1, name: "My Cube Design", date: "2024-01-15", thumbnail: "/design1.png" },
        { id: 2, name: "Cool Sphere", date: "2024-01-14", thumbnail: "/design2.png" },
        { id: 3, name: "Pyramid Project", date: "2024-01-13", thumbnail: "/design3.png" }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setUser(authUser);
            setLoading(true);
            setError(null);

            if (authUser) {
                try {
                    // 1. Fetch user data
                    const userDocRef = doc(db, "users", authUser.uid);
                    const docSnap = await getDoc(userDocRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUsername(userData.username);

                        // 2. Fetch past shapes (after user data is loaded)
                        const designsCollectionRef = collection(db, "users", authUser.uid, "designs");
                        const querySnapshot = await getDocs(designsCollectionRef);
                        const shapes = [];
                        querySnapshot.forEach((doc) => {
                            shapes.push(doc.data());
                        });
                        setPastShape(shapes);


                    } else {
                        setError("User not found");
                        navigate("/signup"); // Or redirect as needed
                    }
                } catch (error) {
                    setError(error.message);
                    console.error("Error fetching data:", error); // Log the full error
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setUsername(null);
                setPastShape([]); // Clear past shapes if no user
                navigate("/login"); // Or redirect as needed
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, [navigate]); // Add navigate as a dependency

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            console.log("Error signing out", error);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Not authorized to view this page. <Link to="/login">Login</Link></div>;
    }
    return (
        <div className="dashboard-page">
            {/* Navbar */}
            <nav className="navbar">
                <img src="/potterypickslogo.png" alt="Pottery Picks Logo" className="navbar-logo" />
                <h1 className="navbar-title">Pottery Picks</h1>
                <div className="auth-buttons">
                    <Link to="/">
                        <button className="auth-button logout" onClick={handleLogout}>Log Out</button>
                    </Link>
                </div>
            </nav>
            {/* Layout */}
            <div className="dashboard-layout">
                <div className="dashboard-main">
                    <h2 className="dashboard-greeting"> Hello, {username}</h2>
                    <div className="available-shapes">
                        <h3 className="section-title">Available Shapes</h3>
                        <div className="shapes-grid">
                            {availableShapes.map(shape => (
                                <div key={shape.id} className="shape-card">
                                    <img src={shape.thumbnail} alt={shape.name} className="shape-thumbnail" />
                                    <h4 className="shape-name">{shape.name}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link to="/pastshapes">
                        <button className="past-shapes-button">View Past Designs</button>
                    </Link>
                    <Link to="/app" className="create-design-button">
                        Start Designing
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;