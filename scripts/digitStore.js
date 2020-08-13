class DigitStore {

    constructor() {
        this.digitPositions = [];

        // top left clock is [0][0]
        let zero = [[[3, 6], [0, 6], [0, 6], [0, 6], [0, 6], [0, 3]],
                [[3, 9], [6, 6], [0, 6], [0, 6], [0, 0], [3, 9]],
                [[6, 9], [0, 6], [0, 6], [0, 6], [0, 6], [0, 9]]];

        let one = [[[6, 6], [0, 0], [6, 6], [0, 0], [6, 6], [0, 0]],
               [[3, 6], [0, 6], [0, 6], [0, 6], [0, 6], [0, 3]],
               [[6, 9], [0, 6], [0, 6], [0, 6], [0, 6], [0, 9]]];

        let two = [[[3, 6], [0, 3], [3, 6], [0, 6], [0, 6], [0, 3]],
               [[3, 9], [6, 9], [0, 9], [3, 6], [0, 3], [3, 9]],
               [[6, 9], [0, 6], [0, 6], [0, 9], [6, 9], [0, 9]]];

        let three = [[[3, 6], [0, 3], [3, 6], [0, 3], [3, 6], [0, 3]],
                 [[3, 9], [6, 9], [0, 9], [6, 9], [0, 9], [3, 9]],
                 [[6, 9], [0, 6], [0, 6], [0, 6], [0, 6], [0, 9]]];

        let four = [[[3, 6], [0, 6], [0, 6], [0, 3], [6, 6], [0, 0]],
                [[6, 6], [0, 6], [0, 0], [6, 9], [0, 6], [0, 3]],
                [[6, 9], [0, 6], [0, 6], [0, 6], [0, 6], [0, 9]]];

        let five = [[[3, 6], [0, 6], [0, 6], [0, 3], [3, 6], [0, 3]],
                [[3, 9], [3, 6], [0, 3], [6, 9], [0, 9], [3, 9]],
                [[6, 9], [0, 9], [6, 9], [0, 6], [0, 6], [0, 9]]];

        let six = [[[3, 6], [0, 6], [0, 6], [0, 6], [0, 6], [0, 3]],
               [[3, 9], [3, 6], [0, 3], [6, 6], [0, 0], [3, 9]],
               [[6, 9], [0, 9], [6, 9], [0, 6], [0, 6], [0, 9]]];

        let seven = [[[3, 6], [0, 3], [6, 6], [0, 0], [6, 6], [0, 0]],
                 [[3, 9], [6, 9], [0, 6], [0, 6], [0, 6], [0, 3]],
                 [[6, 9], [0, 6], [0, 6], [0, 6], [0, 6], [0, 9]]];

        let eight = [[[3, 6], [0, 6], [0, 4.5], [1.5, 6], [0, 6], [0, 3]],
                 [[3, 9], [6, 6], [0, 0], [6, 6], [0, 0], [3, 9]],
                 [[6, 9], [0, 6], [0, 7.5], [6, 10.5], [0, 6], [0, 9]]];

        let nine = [[[3, 6], [0, 6], [0, 6], [0, 3], [3, 6], [0, 3]],
                [[3, 9], [6, 6], [0, 0], [6, 9], [0, 9], [3, 9]],
                [[6, 9], [0, 6], [0, 6], [0, 6], [0, 6], [0, 9]]];

        this.digitPositions.push(zero);
        this.digitPositions.push(one);
        this.digitPositions.push(two);
        this.digitPositions.push(three);
        this.digitPositions.push(four);
        this.digitPositions.push(five);
        this.digitPositions.push(six);
        this.digitPositions.push(seven);
        this.digitPositions.push(eight);
        this.digitPositions.push(nine);
    }

    getPositions(digit, x, y) {
        return this.digitPositions[digit][x][y];
    }

    getPartialPosition(digit, nextDigit, x, y) {
        let currentPosition = this.digitPositions[digit][x][y];
        let nextPosition = this.digitPositions[nextDigit][x][y];
        let partialSecond = momentNow.millisecond() / 1000;

        let dists = [];
        // After the loop, the values will represent:
        // Index 0: Straight-through distance from hand 0 to hand 0.
        // Index 1: Cross-over distance from hand 0 to hand 1.
        // Index 2: Cross-over distance from hand 1 to hand 0.
        // Index 3: Straight-through distance from hand 1 to hand 1.
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                let temp_dist = (nextPosition[j] - currentPosition[i]) % 12;
                temp_dist = (temp_dist + 12) % 12; // corrects for the JavaScript modulo 'bug'
                // if (temp_dist === 0) {
                //     temp_dist = 12;   
                // }
                dists.push(temp_dist);
            }
        }

        let dist_0;
        let dist_1;
        // If total cross-over distance < total straight-through distance then cross-over, else straight-through
        if (dists[1] + dists[2] == dists[0] + dists[3]) {
            if (Math.abs(dists[1] - dists[2]) < Math.abs(dists[0] - dists[3])) {
                dist_0 = dists[1];
                dist_1 = dists[2];
            } else {
                dist_0 = dists[0];
                dist_1 = dists[3];
            }
        } else if (dists[1] + dists[2] < dists[0] + dists[3]) {
            dist_0 = dists[1];
            dist_1 = dists[2];
        } else {
            dist_0 = dists[0];
            dist_1 = dists[3];
        }

        return [((currentPosition[0] + (dist_0 * this.p2e(partialSecond))) % 12), ((currentPosition[1] + (dist_1 * this.p2e(partialSecond))) % 12)];
    }

    p2e(percentage, intensity=2) {
        let result;
        if (percentage < 0.5) {
            result = ((percentage * 2) ** intensity) / 2;
        }
        else {
            result = ((1 - ((1 - ((percentage - 0.5) * 2)) ** intensity)) / 2) + 0.5;
        }
        return result;
    }
    
}