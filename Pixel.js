module.exports = (function Pixel(){
    // rgba :: Int, Int, Int, Int -> Pixel
    function rgba(r,g,b,a){
        return r + (g << 8) + (b << 16) + (a << 24);
    };

    // rgb :: Int, Int, Int -> Pixel
    function rgb(r,g,b){
        return r + (g << 8) + (b << 16);
    };

    // htmlString :: Pixel -> String
    // Converts a Pixel to a HTML-formatted string.
    function htmlString(pixel){
        var a = alpha(pixel);
        return a > 0 
            ? "rgba("+red(pixel)+","+green(pixel)+","+blue(pixel)+","+(a/255)+")"
            : "rgb("+red(pixel)+","+green(pixel)+","+blue(pixel)+")";
    };

    // hsl :: Float, Float, Float, Float -> Pixel
    // Adapted from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    function hsl(h, s, l, a){
        var r, g, b;
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return rgba(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a||255);
    };

    // getHsl :: pixel -> {hue::Float, saturation::Float, luminance::Float}
    // Adapted from http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    function getHsl(pixel){
        var r = red(pixel)/255, g = green(pixel)/255, b = blue(pixel)/255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return {hue:h, saturation:s, luminance:l};
    };

    // withHsl :: Pixel, ({hue::Float, saturation::Float, luminance::Float} -> {hue::Float, saturation::Float, luminance::Float}) -> Pixel
    function withHsl(pixel,fn){
        var oldHsl = getHsl(pixel);
        var newHsl = fn(oldHsl.hue, oldHsl.saturation, oldHsl.luminance);
        return hsl(newHsl.hue, newHsl.saturation, newHsl.luminance, alpha(pixel));
    };

    // brighten :: Pixel, Float -> Pixel
    function brighten(pixel,amount){
        return withHsl(pixel,function(h,s,l){return {hue:h,saturation:s,luminance:(l+amount)%1}});
    };

    // shiftHue :: Pixel, Float -> Pixel
    function shiftHue(pixel,amount){
        return withHsl(pixel,function(h,s,l){return {hue:(h+amount)%1,saturation:s,luminance:l}});
    };

    // shiftSaturation :: Pixel, Float -> Pixel
    function shiftSaturation(pixel,amount){
        return withHsl(pixel,function(h,s,l){return {hue:h,saturation:(s+amount)%1,luminance:l}});
    };

    // hue :: Pixel, Float
    function hue(pixel){
        return getHsl(pixel).hue;
    };

    // luminance :: Pixel, Float
    function luminance(pixel){
        return getHsl(pixel).luminance;
    };

    // saturation :: Pixel -> Float
    function saturation(pixel){
        return getHsl(pixel).saturation;
    };

    // red :: Pixel -> Int
    function red(pixel){
        return pixel & 0x000000FF;
    };

    // green :: Pixel -> Int
    function green(pixel){
        return (pixel & 0x0000FF00) >>> 8;
    };

    // blue :: Pixel -> Int
    function blue(pixel){
        return (pixel & 0x00FF0000) >>> 16;
    };

    // alpha :: Pixel -> Int
    function alpha(pixel){
        return (pixel & 0xFF000000) >>> 24;
    };

    // add :: Pixel -> Pixel -> Pixel
    function add(a,b){
        return  rgba(red(a)+red(b), green(a)+green(b), blue(a)+blue(b), alpha(a)+alpha(b));
    };

    // sub :: Pixel -> Pixel -> Pixel
    function sub(a,b){
        return  rgba(red(a)-red(b), green(a)-green(b), blue(a)-blue(b), alpha(a)-alpha(b));
    };

    // sqrDist :: Pixel, Pixel -> Float
    function sqrDist(a,b){
        var ar = red(a)/255, ag = green(a)/255, ab = blue(a)/255;
        var br = red(b)/255, bg = green(b)/255, bb = blue(b)/255;
        return (ar-br)*(ar-br)+(ag-bg)*(ag-bg)+(ab-bb)*(ab-bb);
    };

    // dist :: Pixel, Pixel -> Float
    function dist(a,b){
        return Math.sqrt(sqrDist(a,b));
    };

    return {
        rgba            : rgba,
        rgb             : rgb,
        red             : red,
        green           : green,
        hsl             : hsl,
        withHsl         : withHsl,
        getHsl          : getHsl,
        brighten        : brighten,
        shiftHue        : shiftHue,
        shiftSaturation : shiftSaturation,
        hue             : hue,
        luminance       : luminance,
        saturation      : saturation,
        htmlString      : htmlString,
        blue            : blue,
        alpha           : alpha,
        sqrDist         : sqrDist,
        dist            : dist};
})();
