exports.remove = (arr, val) => {
    var i = 0;
    while (i < arr.length) {
        if(arr[i] === val)
            arr.splice(i, 1);
        else
            ++i;
    }
    return arr;
}