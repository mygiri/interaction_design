//functions from Kuruc's implementation

function linspace(startValue, stopValue, cardinality) {
    let arr = []
    let step = (stopValue - startValue) / (cardinality - 1)
    for (let i = 0; i < cardinality; i++) {
      arr.push(parseFloat((startValue + step * i).toFixed(2)))
    }
    return arr
  }
  

  function getClosestValues(arr1, arr2) {
    return arr1.map((value) => {
      let closestValue = arr2[0];
      let closestDistance = Math.abs(value - closestValue);
  
      for (let i = 1; i < arr2.length; i++) {
        let distance = Math.abs(value - arr2[i]);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestValue = arr2[i];
        }
      }
      return closestValue; // return value from arr2, that is closest to the value of arr1
    });
  }



  
export{
    linspace,
    getClosestValues
}