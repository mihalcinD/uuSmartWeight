export function countPeaks(values: number[]): number {
    let peakCount = 0;
    for (let i = 3; i < values.length - 3; i++) {
        const yVal = values[i];

        // Some left points have bigger or equal y value
        if (yVal <= values[i - 3] || yVal <= values[i - 2] || yVal <= values[i - 1]) continue;

        // Some right points have bigger or equal y value
        if (yVal <= values[i + 1] || yVal <= values[i + 2] || yVal <= values[i + 1]) continue;

        peakCount++;
    }
    
    return peakCount;
}