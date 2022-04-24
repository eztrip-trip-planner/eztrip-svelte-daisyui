interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}

interface Hsla {
    h: number;
    s: number;
    l: number;
    a: number;
}

export class Color {
    public static WHITE = new Color({ r: 255, g: 255, b: 255, a: 1 });
    public static BLACK = new Color({ r: 0, g: 0, b: 0, a: 1 });

    /**
     *
     * @param r
     * @param g
     * @param b
     * @param a
     * @returns
     */
    public static fromRgba(r: number, g: number, b: number, a: number): Color {
        return new Color({
            r,
            g,
            b,
            a,
        });
    }

    /**
     *
     * @param hex
     * @returns
     */
    public static fromHex(hex: string): Color {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = parseInt(hex.slice(7, 9), 16);

        return new Color({
            r,
            g,
            b,
            a,
        });
    }

    /**
     *
     * @param h
     * @param s
     * @param l
     * @param a
     * @returns
     */
    public static fromHsla(
        h: number,
        s: number,
        l: number,
        a: number = 1,
    ): Color {
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;

        if (s === 0) r = g = b = l;
        else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return new Color({
            r,
            g,
            b,
            a,
        });
    }

    private readonly rgba: Rgba;

    public constructor(rgba: Rgba) {
        this.rgba = rgba;
    }

    /**
     *
     * @param ratio
     * @returns
     */
    public lighten(ratio: number): Color {
        const hsla = this.toHsla();
        hsla.l += hsla.l * ratio;
        return Color.fromHsla(hsla.h, hsla.s, hsla.l, hsla.a);
    }

    /**
     *
     * @param ratio
     * @returns
     */
    public darken(ratio: number): Color {
        const hsla = this.toHsla();
        hsla.l -= hsla.l * ratio;
        return Color.fromHsla(hsla.h, hsla.s, hsla.l, hsla.a);
    }

    /**
     *
     * @param ratio
     * @returns
     */
    public saturate(ratio: number): Color {
        const hsla = this.toHsla();
        hsla.s += ratio;
        return Color.fromHsla(hsla.h, hsla.s, hsla.l, hsla.a);
    }

    /**
     *
     * @param color
     * @param weight
     * @returns
     */
    public mix(color: Color, weight: number = 0.5): Color {
        const w = 2 * weight - 1;
        const a = this.rgba.a - color.rgba.a;

        const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        const w2 = 1 - w1;

        return new Color({
            r: this.rgba.r * w1 + color.rgba.r * w2,
            g: this.rgba.g * w1 + color.rgba.g * w2,
            b: this.rgba.b * w1 + color.rgba.b * w2,
            a: this.rgba.a * weight + color.rgba.a * (1 - weight),
        });
    }

    /**
     *
     * @returns
     */
    public toHsla(): Hsla {
        const r = this.rgba.r / 255;
        const g = this.rgba.g / 255;
        const b = this.rgba.b / 255;
        const a = this.rgba.a;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const h =
            max === min
                ? 0
                : max === r
                ? (g - b) / (max - min)
                : max === g
                ? 2 + (b - r) / (max - min)
                : 4 + (r - g) / (max - min);

        const l = (max + min) / 2;
        const s =
            max === min
                ? 0
                : l < 0.5
                ? (max - min) / (max + min)
                : (max - min) / (2 - max - min);

        return {
            h: h * 60,
            s,
            l,
            a,
        };
    }
}
