export function shouldBlock(text){
    const blocked=[
        /api[_-]?key/i,
        /authorization/i,
        /bearer\s+[a-z0-9\-_.]+/i,
        /private[_-]?key/i,
        /password\s*[:=]/i,
        /otp\s*[:=]/i,
    ];
    return blocked.some(rx=>rx.test(text));
}