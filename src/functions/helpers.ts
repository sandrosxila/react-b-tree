export const range = ({ start, stop, step = 1 }: { start: number, stop: number, step?: number }) => {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
};

