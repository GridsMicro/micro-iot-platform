import React from 'react';

type StatusBadgeProps = {
    rssi: number; // Signal strength in dBm (e.g., -50 is good, -90 is bad)
    isOnline: boolean;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ rssi, isOnline }) => {
    // Determine Signal Quality
    let signalColor = 'bg-gray-400';
    let signalText = 'Unknown';

    if (isOnline) {
        if (rssi > -60) {
            signalColor = 'bg-emerald-500'; // Excellent
            signalText = 'Excellent';
        } else if (rssi > -70) {
            signalColor = 'bg-teal-500'; // Good
            signalText = 'Good';
        } else if (rssi > -80) {
            signalColor = 'bg-yellow-500'; // Fair
            signalText = 'Fair';
        } else {
            signalColor = 'bg-red-500'; // Poor
            signalText = 'Poor';
        }
    } else {
        signalColor = 'bg-gray-400';
        signalText = 'Offline';
    }

    return (
        <div className="flex items-center gap-3 px-3 py-1 bg-white/50 border border-white/60 rounded-full shadow-sm backdrop-blur-sm w-fit">
            {/* Online/Offline Dot */}
            <span className={`relative flex h-3 w-3`}>
                {isOnline && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${signalColor}`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${signalColor}`}></span>
            </span>

            {/* Text Info */}
            <div className="flex flex-col leading-none">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{isOnline ? 'Online' : 'Offline'}</span>
                {isOnline && <span className="text-[10px] text-gray-500">Signal: {signalText} ({rssi} dBm)</span>}
            </div>
        </div>
    );
};

export default StatusBadge;
