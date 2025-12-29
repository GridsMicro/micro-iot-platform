import React from 'react';

type VideoProps = {
    src: string; // YouTube ID or URL
    title?: string;
    type?: 'youtube' | 'local'; // Default to youtube
    orientation?: 'horizontal' | 'vertical'; // Default to horizontal (16:9)
};

const Video: React.FC<VideoProps> = ({
    src,
    title = "Video player",
    type = 'youtube',
    orientation = 'horizontal'
}) => {

    // Aspect Ratio Calculation
    const aspectRatioClass = orientation === 'vertical'
        ? 'aspect-[9/16] max-w-[300px] mx-auto' // Shorts/TikTok style
        : 'aspect-video w-full'; // Standard 16:9

    if (type === 'youtube') {
        return (
            <div className={`relative my-8 rounded-xl overflow-hidden shadow-lg border border-white/20 glass ${aspectRatioClass}`}>
                <iframe
                    src={`https://www.youtube.com/embed/${src}`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                />
            </div>
        );
    }

    // Fallback for local/direct MP4 (if needed later)
    return (
        <div className={`relative my-8 rounded-xl overflow-hidden shadow-lg border border-white/20 glass ${aspectRatioClass}`}>
            <video controls className="w-full h-full object-cover">
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Video;
