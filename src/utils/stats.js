export const calculateAvg = (solves, n) => {
    if (solves.length < n) return null;
    const recent = solves.slice(0, n);
    const times = recent.map(s => s.time);

    // WCA rule: remove best and worst
    if (n >= 5) {
        const sorted = [...times].sort((a, b) => a - b);
        // Remove first (min) and last (max)
        // Actually WCA for Ao5 removes 1 best and 1 worst.
        // For Mean of 3, it doesn't remove anything usually? 
        // WCA doesn't have official Mo3 for 3x3 usually, but for 6x6/7x7/FMC it's Mean of 3.
        // Standard Mo3 is just arithmetic mean.

        const trimmed = sorted.slice(1, -1);
        const sum = trimmed.reduce((a, b) => a + b, 0);
        return sum / trimmed.length;
    } else {
        // Mean (e.g. Mo3)
        const sum = times.reduce((a, b) => a + b, 0);
        return sum / times.length;
    }
};

export const calculateBest = (solves) => {
    return solves.length > 0 ? Math.min(...solves.map(s => s.time)) : null;
};
