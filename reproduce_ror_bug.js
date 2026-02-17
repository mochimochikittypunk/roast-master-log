/**
 * Calculate Rate of Rise (RoR)
 * Copied from src/lib/roast-math.ts for reproduction
 */
const calculateRoR = (
    currentTemp,
    currentTime,
    history,
    windowSeconds = 30
) => {
    if (history.length === 0) return 0;

    // Find the point ~windowSeconds ago
    const targetTime = currentTime - windowSeconds;

    // Simple approach: Find closest point
    let pastPoint = history.find(p => p.timestamp >= targetTime);

    // If no point found within window (data is sparse), use the most recent point
    if (!pastPoint && history.length > 0) {
        pastPoint = history[history.length - 1];
    }

    if (!pastPoint) return 0;
    if (pastPoint.timestamp === currentTime) return 0; // Avoid divide by zero if duplicate

    const tempDiff = currentTemp - pastPoint.temperature;
    const timeDiff = currentTime - pastPoint.timestamp;

    if (timeDiff <= 0) return 0;

    // RoR = (TempDiff / TimeDiffSeconds) * 60
    return (tempDiff / timeDiff) * 60;
};

// Test Cases

// Case 1: Normal dense data
// History: 0s -> 100C
// Current: 60s -> 110C
// Window: 60s
console.log("Case 1: Normal (0s->100C, Current 60s->110C, Window 60s)");
const history1 = [{ timestamp: 0, temperature: 100 }];
const ror1 = calculateRoR(110, 60, history1, 60);
console.log(`RoR: ${ror1} (Expected: 10)`);

// Case 2: Sparse data (Bug Repro)
// History: 0s -> 100C
// Current: 61s -> 110C
// Window: 60s
// targetTime = 61 - 60 = 1.
// history.find(p => p.timestamp >= 1) -> undefined (since 0 < 1)
console.log("\nCase 2: Sparse (0s->100C, Current 61s->110C, Window 60s)");
const history2 = [{ timestamp: 0, temperature: 100 }];
const ror2 = calculateRoR(110, 61, history2, 60);
console.log(`RoR: ${ror2} (Expected: ~9.8, Actual: 0?)`);

// Case 3: Very sparse data
// History: 0s -> 100C
// Current: 120s -> 120C
// Window: 60s
console.log("\nCase 3: Very Sparse (0s->100C, Current 120s->120C, Window 60s)");
const history3 = [{ timestamp: 0, temperature: 100 }];
const ror3 = calculateRoR(120, 120, history3, 60);
console.log(`RoR: ${ror3} (Expected: 10, Actual: 0?)`);
