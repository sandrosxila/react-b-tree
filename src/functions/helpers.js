export const range = ({start, stop, step}) => {
    if(!step)
        step = 1
    return Array.from({length: (stop - start) / step + 1}, (_, i) => start + (i * step));
};

