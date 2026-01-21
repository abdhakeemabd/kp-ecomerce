import React, { useState } from 'react';

const ImageLoader = ({ src, alt, className, width, height, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width: width ? '100%' : 'auto' }}>
            {!isLoaded && (
                <div
                    className="skeleton absolute inset-0 z-10 w-full h-full"
                    style={{ height: height || '100%' }}
                />
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                width={width}
                height={height}
                loading="lazy"
                {...props}
            />
        </div>
    );
};

export default ImageLoader;
