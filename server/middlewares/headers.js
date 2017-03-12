export default (req, res, next) => {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Type', 'application/json');
    next();
};
