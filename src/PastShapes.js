import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/PastShapes.css';
import { auth, db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const PastShapes = () => {
    const [pastShapes, setPastShapes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPastShapes = async () => {
            if (auth.currentUser) {
                const designsCollectionRef = collection(db, "users", auth.currentUser.uid, "designs");
                try {
                    const querySnapshot = await getDocs(designsCollectionRef);
                    const shapes = [];
                    querySnapshot.forEach((doc) => {
                        shapes.push(doc.data());
                    });
                    setPastShapes(shapes);
                } catch (error) {
                    console.error("Error fetching past shapes:", error);
                    setError("Error fetching designs. Please try again later.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPastShapes();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your designs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h2>Oops!</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="past-shapes-page">
            <div className="page-header">
                <h1>My Past Designs</h1>
                <Link to="/dashboard" className="back-button">
                    Back to Dashboard
                </Link>
            </div>
            
            {pastShapes.length === 0 ? (
                <div className="no-designs">
                    <h2>No designs yet</h2>
                    <p>Start creating your first pottery design!</p>
                    <Link to="/app" className="create-design-button">
                        Create New Design
                    </Link>
                </div>
            ) : (
                <div className="designs-grid">
                    {pastShapes.map((shape, index) => (
                        <div key={index} className="design-card">
                            <div className="design-card-header">
                                <h3>{shape.name}</h3>
                                <span className="timestamp">
                                    {shape.timestamp?.toDate().toLocaleDateString()}
                                </span>
                            </div>
                            <div className="color-display">
                                {Object.entries(shape.designData).map(([face, color]) => (
                                    <div key={face} className="color-row">
                                        <span className="face-name">{face}</span>
                                        <div className="color-preview">
                                            <div 
                                                className="color-square" 
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="color-value">{color}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PastShapes;