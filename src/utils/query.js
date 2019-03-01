export const getParam = (name) => {
    const url = new URL(global.location.href);
    return url.searchParams.get(name);
};
