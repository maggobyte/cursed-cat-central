import React, { useState, useEffect, useRef } from 'react';
import './ImageLoader.css';

function ImageLoader() {
    const [currentImage, setCurrentImage] = useState(null);
    //const [incomingImage, setIncomingImage] = useState(null); // preload next image
    const [isSpinningOut, setIsSpinningOut] = useState(false);
    const [shouldSpin, setShouldSpin] = useState(false); // controls initial spin
    const incomingImageRef = useRef(null);

    // fetches and preloads the next image
    const preloadNextImage = async () => {
        try {
            const response = await fetch('/local-images');
            if (response.ok) {
                const newImageUrl = response.url + '?' + new Date().getTime();
                incomingImageRef.current = newImageUrl;
            } else {
                console.error('error loading image');
            }
        } catch (error) {
            console.error('error:', error);
        }
    };

    // handles the full transition when button is clicked
    const loadRandomImage = () => {
        setIsSpinningOut(true); // trigger spin-out
        setShouldSpin(true); // enable spin effect after button click

        // after spin-out completes, switch to the incoming image
        setTimeout(() => {
            setCurrentImage(incomingImageRef.current); // show the new image
            setIsSpinningOut(false); // start spin-in
            preloadNextImage(); // prepare the next image
        }, 1000); // adjust timing to match the spin-out duration
    };

    // initial image load without spin
    useEffect(() => {
        preloadNextImage().then(() => {
            setCurrentImage(incomingImageRef.current);
            setShouldSpin(false); // ensure no spin on initial load
        });
    }, []); // run once on mount

    return (
        <div className="image-loader-container">
            <h1>random image loader nya~ :3</h1>
            {currentImage ? (
                <img
                    src={currentImage}
                    alt="random from cursed cat central"
                    className={`image ${shouldSpin && (isSpinningOut ? 'spin-out' : 'spin-in')}`}
                />
            ) : (
                <p>loading image...</p>
            )}
            <br />
            <button onClick={loadRandomImage} className="button">load new image</button>
        </div>
    );
}

export default ImageLoader;
