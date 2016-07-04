module.exports = (function(){
    function benchmark(fn){
      for (var i=0, t=Date.now(); Date.now()-t<500; ++i)
        fn();
      return i*2;
    };

    return {benchmark: benchmark};
})();
