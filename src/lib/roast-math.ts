import { DataPoint } from "@/types";

/**
 * Calculate Rate of Rise (RoR)
 * Typically calculated over a 30s or 60s window.
 * Returns degrees per minute.
 */
export const calculateRoR = (
    currentTemp: number,
    currentTime: number,
    history: DataPoint[],
    windowSeconds: number = 30
): number => {
    if (history.length === 0) return 0;

    // Find the point ~windowSeconds ago
    const targetTime = currentTime - windowSeconds;

    // Simple approach: Find closest point
    const pastPoint = history.find(p => p.timestamp >= targetTime);

    if (!pastPoint) return 0;
    if (pastPoint.timestamp === currentTime) return 0; // Avoid divide by zero if duplicate

    const tempDiff = currentTemp - pastPoint.temperature;
    const timeDiff = currentTime - pastPoint.timestamp;

    if (timeDiff <= 0) return 0;

    // RoR = (TempDiff / TimeDiffSeconds) * 60
    return (tempDiff / timeDiff) * 60;
};

/**
 * Calculate Development Time Ratio (DTR)
 * DTR = (Development Time / Total Roast Time) * 100
 */
export const calculateDTR = (
    currentDevTime: number,
    totalTime: number
): number => {
    if (totalTime === 0) return 0;
    return (currentDevTime / totalTime) * 100;
};

/**
 * Estimate finish time for a target DTR
 * Given:
 *  - fcStartTime (1st Crack timestamp)
 *  - targetDTR (e.g. 20%)
 * 
 * Formula:
 *  TargetDTR = ( (TotalTime - FCStart) / TotalTime )
 *  targetDTR * TotalTime = TotalTime - FCStart
 *  FCStart = TotalTime - targetDTR * TotalTime
 *  FCStart = TotalTime * (1 - targetDTR)
 *  TotalTime = FCStart / (1 - targetDTR)
 */
export const estimateFinishTime = (
    fcStartTime: number,
    targetDTRPercentage: number
): number | null => {
    if (targetDTRPercentage >= 100 || targetDTRPercentage <= 0) return null;

    const ratio = targetDTRPercentage / 100;
    // If FC happened at 600s, and we want 20% DTR:
    // Total = 600 / (1 - 0.20) = 600 / 0.8 = 750s
    return fcStartTime / (1 - ratio);
};

/**
 * Calculate RoR in °C per second between two data points.
 * Used for interpolation between manual readings.
 */
export const calculateRoRPerSecond = (
    prevTemp: number,
    prevTime: number,
    currTemp: number,
    currTime: number
): number => {
    const dt = currTime - prevTime;
    if (dt <= 0) return 0;
    return (currTemp - prevTemp) / dt;
};

/**
 * Interpolate temperature based on a base temperature and RoR.
 * Returns predicted temperature at baseTemp + rorPerSecond * elapsed.
 */
export const interpolateTemperature = (
    baseTemp: number,
    rorPerSecond: number,
    elapsedSeconds: number
): number => {
    return baseTemp + rorPerSecond * elapsedSeconds;
};

/**
 * Estimate the timestamp when Bean Temp reached a target temperature (default: 140°C).
 * Used to auto-estimate Yellow Point when the user skips the Yellow button.
 * Scans recorded dataPoints and linearly interpolates between the two points
 * surrounding the target temperature.
 */
export const estimateYellowTime = (
    dataPoints: DataPoint[],
    targetTemp: number = 140
): number | null => {
    for (let i = 1; i < dataPoints.length; i++) {
        const prev = dataPoints[i - 1];
        const curr = dataPoints[i];
        if (prev.temperature < targetTemp && curr.temperature >= targetTemp) {
            const ratio = (targetTemp - prev.temperature) / (curr.temperature - prev.temperature);
            return prev.timestamp + ratio * (curr.timestamp - prev.timestamp);
        }
    }
    return null;
};
