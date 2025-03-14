// Content Security Policy middleware
export function setupCSP(app) {
  app.use((req, res, next) => {
    // Set secure headers
    res.setHeader('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "font-src 'self' data:; " +
      "img-src 'self' data: blob:; " +
      "connect-src 'self' http://localhost:* https://api.openai.com; " +
      "frame-ancestors 'none';"
    );
    
    // Set X-Frame-Options header
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Set other security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer');
    
    next();
  });
} 